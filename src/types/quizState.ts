// types/quizState.ts

import type { UserAnswers } from "./quiz";
import {type Question} from "./quiz"

export type State = {
  view: "topic" | "loading" | "quiz" | "results";
  topic: string | null;
  questions: Question[];
  answers: UserAnswers;
  currentIndex: number;
  score: number;
  feedback: string | null;
  loading: boolean;
  error: string | null;
};
