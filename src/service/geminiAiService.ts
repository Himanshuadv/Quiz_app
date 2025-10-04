// --- Configuration & Services (Adapted for Gemini API) ---


const apiKey = import.meta.env.VITE_API_KEY as string;
import { fetchMCQs } from "./openTb";

const QUESTION_SCHEMA = {
    type: "ARRAY",
    items: {
        type: "OBJECT",
        properties: {
            question: { type: "STRING" },
            options: {
                type: "ARRAY",
                items: { type: "STRING" }
            },
            correctAnswer: { type: "STRING" },
            description:{type:"STRING"}
        },
        required: ["question", "options", "correctAnswer","description"],
        propertyOrdering: ["question", "options", "correctAnswer","description"],
    }
};

const FEEDBACK_SCHEMA = {
    type: "OBJECT",
    properties: {
        message: { type: "STRING" },
    },
    required: ["message"],
    propertyOrdering: ["message"],
};

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL;
const GEMINI_URL = import.meta.env.VITE_GEMINI_URL
const API_URL = `${GEMINI_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

/**
 * Generates quiz questions using the Gemini API and a strict JSON schema.
 * @param {string} topic - The topic for the quiz.
 * @param {number} amount - The number of questions to generate.
 * @returns {Promise<Array<{question: string, options: string[], correctAnswer: string}>>}
 */
export const generateQuizQuestions = async (topic, amount = 5) => {
    const userPrompt = `Generate exactly ${amount} unique, interesting, and challenging multiple-choice questions about the topic: "${topic}". Ensure each question has 4 distinct options and one clearly marked correct answer with description about the answer (i.e.concise justification about the answer).`;
    
    const systemPrompt = "You are a quiz question generator. Your task is to generate high-quality multiple-choice questions. The output MUST be a JSON array that strictly follows the provided schema. Do not include any explanation or extra text outside the JSON block.";

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: QUESTION_SCHEMA,
            temperature: 0.7,
        }
    };

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            // console.log(`Attempting to fetch questions (Attempt ${attempts})...`);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API response error: Status ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                const parsedQuestions = JSON.parse(text);
                // Simple validation to ensure we got an array of questions
                if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
                    console.log('Questions successfully generated and parsed.');
                    return parsedQuestions.map((q, index) => ({ ...q, id: index }));
                }
            }
            throw new Error("Malformed JSON response from AI.");
        } catch (error) {
            console.error(`Error during fetch attempt ${attempts}:`, error);
            if (attempts < maxAttempts) {
                // Exponential backoff
                const delay = Math.pow(2, attempts) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                return await fetchMCQs(topic, amount);
                throw new Error("Failed to generate valid quiz questions after multiple retries.");
            }
        }
    }
     
};


/**
 * Generates a custom feedback message using the Gemini API.
 * @param {number} score - The user's score.
 * @param {number} maxScore - The maximum possible score.
 * @param {string} topic - The quiz topic.
 * @returns {Promise<string>} - The personalized feedback message.
 */
export const generateCustomFeedback = async (score, maxScore, topic,questions) => {
    const userPrompt = `The user scored ${score} out of ${maxScore} on a quiz about "${topic}" ${questions}. Write a single, encouraging, and highly personalized paragraph of feedback for the user. Do not explicitly restate the score, but reflect on the performance only one or two sentences. Then analysis the question and provide the topic these questions covers.`;

    const systemPrompt = "You are a motivational and informative quiz results analyst. Provide an encouraging feedback message in a single paragraph. The output MUST be a JSON object that strictly follows the provided schema.";

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: FEEDBACK_SCHEMA,
            temperature: 0.9,
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API response error: Status ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            const parsedFeedback = JSON.parse(text);
            return parsedFeedback.message || "Great effort! The AI struggled to generate custom feedback, but we are proud of your score.";
        }
    } catch (error) {
        console.error("Error generating custom feedback:", error);
    }

    // Fallback message
    const percent = (score / maxScore) * 100;
    if (percent === 100) return 'Perfect score! Great job! You mastered the topic.';
    if (percent >= 80) return 'Excellent work! You have strong knowledge in this area.';
    if (percent >= 50) return 'Good effort! Keep practicing to improve your understanding.';
    return 'Needs improvement, but don’t give up! Review the topic and try again.';
};
