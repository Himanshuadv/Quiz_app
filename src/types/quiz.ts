// src/types/quiz.ts

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export type UserAnswers = Record<number, string | null>;

export type QuizData = Record<string, Question[]>;

export type View = 'topic' | 'loading_quiz' | 'quiz' | 'results';