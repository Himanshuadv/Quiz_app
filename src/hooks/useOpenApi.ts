// src/hooks/useOpenAiQuiz.ts

import { useState, useCallback } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface OpenAiQuizResult {
  questions: Question[] | null;
  feedbackText: string;
  isGeneratingQuestions: boolean;
  isGeneratingFeedback: boolean;
  generateQuestions: (topic: string) => Promise<void>;
  generateFeedback: (topic: string, score: number, total: number) => Promise<void>;
  error: string | null;
}

const OPENAI_API_KEY = "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"; // Set your OpenAI API key here securely
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const useOpenAiQuiz = (): OpenAiQuizResult => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const maxRetries = 3;

  const generateQuestions = useCallback(async (topic: string) => {
    setError(null);
    setIsGeneratingQuestions(true);
    setQuestions(null);

    // Prompt for generating MCQs in strict JSON without markdown/code blocks
    const prompt = `Generate 5 multiple choice questions on the topic "${topic}". Return JSON ONLY with this structure: {"questions":[{"question":string,"options":[string,string,string,string],"correctAnswer":string}]}. Shuffle options and ensure correctAnswer is exactly one of the options. Do not include explanations or any text other than the JSON. Return only valid JSON.`;

    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        const response = await fetch(OPENAI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // or an available model
            messages: [
              { role: "system", content: "You are a helpful AI assistant." },
              { role: "user", content: prompt },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content ?? "";

        // Parse JSON - expect strict JSON only!
        const parsed = JSON.parse(text);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          setQuestions(parsed.questions);
          success = true;
          break;
        } else {
          throw new Error("Invalid JSON structure");
        }
      } catch (e) {
        attempt++;
        if (attempt === maxRetries) {
          setError("Failed to generate quiz questions after several attempts.");
        } else {
          await new Promise((res) => setTimeout(res, 2 ** attempt * 1000));
        }
      }
    }

    setIsGeneratingQuestions(false);
  }, []);

  const generateFeedback = useCallback(
    async (topic: string, score: number, total: number) => {
      setError(null);
      setIsGeneratingFeedback(true);
      setFeedbackText("");

      const prompt = `Act as an encouraging AI quiz master. The user completed a quiz on "${topic}" and scored ${score} out of ${total}. Provide a brief, friendly paragraph feedback message including the score and a relevant fun fact about the topic. Do not use markdown, headings, or bullet points. Return only plain text.`;

      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: prompt },
              ],
              max_tokens: 300,
              temperature: 0.75,
            }),
          });

          if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
          }

          const data = await response.json();
          const text = data.choices?.[0]?.message?.content ?? "";
          setFeedbackText(text.trim());
          success = true;
          break;
        } catch (e) {
          attempt++;
          if (attempt === maxRetries) {
            setError("Failed to generate feedback after several attempts.");
          } else {
            await new Promise((res) => setTimeout(res, 2 ** attempt * 1000));
          }
        }
      }

      setIsGeneratingFeedback(false);
    },
    []
  );

  return {
    questions,
    feedbackText,
    isGeneratingQuestions,
    isGeneratingFeedback,
    generateQuestions,
    generateFeedback,
    error,
  };
};

export default useOpenAiQuiz;
