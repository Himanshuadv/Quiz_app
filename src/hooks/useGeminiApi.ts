// src/hooks/useGeminiApi.ts

import { useState, useCallback } from "react";

export interface GeminiApiResult {
  feedbackText: string;
  isGenerating: boolean;
  generateFeedback: (
    topic: string,
    score: number,
    total: number
  ) => Promise<void>;
}

const useGeminiApi = (): GeminiApiResult => {
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const apiKey = ""; // Canvas will provide this

  const generateFeedback = useCallback(
    async (topic: string, score: number, total: number) => {
      setIsGenerating(true);
      setFeedbackText("");

      const systemPrompt =
        "Act as a friendly, expert AI quiz master. Based on the user's score and topic, provide a custom, encouraging, single-paragraph feedback message. Do NOT use markdown headings or bullet points. Include the score and a fun fact related to the topic for which they answered questions.";

      const userQuery = `The user completed a quiz on the topic of "${topic}". Their final score was ${score} out of ${total}. Generate custom feedback.`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      let response: Response | null = null;
      let success = false;
      let retries = 0;
      const maxRetries = 5;

      while (retries < maxRetries && !success) {
        try {
          response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            success = true;
            break;
          } else {
            throw new Error(`API failed with status: ${response.status}`);
          }
        } catch (error) {
          retries++;
          if (retries < maxRetries) {
            const delay = Math.pow(2, retries) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            console.error("Gemini API failed after max retries:", error);
          }
        }
      }

      setIsGenerating(false);

      if (success && response) {
        try {
          const result = await response.json();
          const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            setFeedbackText(text);
          } else {
            setFeedbackText(
              "The AI had trouble generating custom feedback. But great job on finishing the quiz!"
            );
          }
        } catch (e) {
          console.error("Error parsing API response:", e);
          setFeedbackText("An unexpected error occurred processing the AI response.");
        }
      } else {
        setFeedbackText(
          "An error occurred while connecting to the AI. Please try again."
        );
      }
    },
    []
  );

  return { feedbackText, isGenerating, generateFeedback };
};

export default useGeminiApi;
