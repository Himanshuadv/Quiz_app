// src/data/mockData.ts

// src/data/mockData.ts
import type {QuizData } from "../types/quiz"

export const MOCK_QUIZ_DATA: QuizData = {
  'Wellness': [
    { id: 1, question: "Which hormone regulates the sleep cycle, peaking at night?", options: ["Cortisol", "Melatonin", "Serotonin", "Dopamine"], correctAnswer: "Melatonin" },
    { id: 2, question: "What is the minimum recommended weekly duration for moderate-intensity aerobic exercise?", options: ["30 minutes", "75 minutes", "150 minutes", "200 minutes"], correctAnswer: "150 minutes" },
    { id: 3, question: "Which nutrient group provides the body's primary source of energy?", options: ["Fats", "Proteins", "Carbohydrates", "Vitamins"], correctAnswer: "Carbohydrates" },
    { id: 4, question: "The '20-20-20 Rule' is a common recommendation for preventing strain in which part of the body?", options: ["Lower back", "Knees", "Eyes", "Neck"], correctAnswer: "Eyes" },
    { id: 5, question: "Which technique involves focusing intensely on the present moment without judgment?", options: ["Cognitive Restructuring", "Mindfulness", "Time Blocking", "Intermittent Fasting"], correctAnswer: "Mindfulness" },
  ],
  'Tech Trends': [
    { id: 1, question: "Which technology creates decentralized, immutable ledgers for secure transactions?", options: ["Quantum Computing", "Blockchain", "Edge Computing", "5G Networking"], correctAnswer: "Blockchain" },
    { id: 2, question: "What does 'MLOps' primarily focus on?", options: ["Mobile Localization", "Machine Learning Operations", "Massive Ledger Optimization", "Memory Link Ordering"], correctAnswer: "Machine Learning Operations" },
    { id: 3, question: "What is a 'zero-day' exploit?", options: ["A bug fixed within 24 hours", "An attack that targets a system for the first time", "A vulnerability unknown to the software vendor", "An exploit requiring no code"], correctAnswer: "A vulnerability unknown to the software vendor" },
    { id: 4, question: "The term 'digital twin' refers to what concept?", options: ["A backup server farm", "A virtual replica of a physical system", "A dual-core processor", "Two identical data centers"], correctAnswer: "A virtual replica of a physical system" },
    { id: 5, question: "What is the primary benefit of 'Edge Computing' over traditional cloud computing?", options: ["Lower overall cost", "Reduced data latency", "Higher storage capacity", "Simplified programming models"], correctAnswer: "Reduced data latency" },
  ],
};
