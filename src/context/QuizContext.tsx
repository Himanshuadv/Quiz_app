
import React, { createContext, useReducer, useContext } from "react";
import type { Question } from "../types/quiz";
import type { State } from "../types/quizState";

export const initialState: State = {
  view: "topic", 
  topic: null,
  questions: [],
  answers: {}, 
  currentIndex: 0,
  score: 0,
  feedback: null, 
  loading: false, 
  error: null, 
};

type Action =
  | { type: "START_LOADING"; topic: string }
  | { type: "SET_QUESTIONS"; questions: Question[] }
  | { type: "ANSWER_QUESTION"; id: string; answer: string }
  | { type: "FINISH_QUIZ" }
  | { type: "SET_FEEDBACK"; feedback: string }
  | { type: "RESET" }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "SET_TOPIC"; topic: string }
  | {type: "SET_VIEW"; view: string,feedback:string}

const QuizContext = createContext<any>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, view: "loading", topic: action.topic, loading: true };
    case "SET_QUESTIONS":
      return {
        ...state,
        questions: action.questions,
        view: "quiz",
        loading: false,
      };
    case "ANSWER_QUESTION": {
      // Update answers
      const updatedAnswers = { ...state.answers, [action.id]: action.answer };

      // Recalculate score by comparing each answered question's answer with correctAnswer
      let newScore = 0;
      for (const question of state.questions) {
        const userAnswer = updatedAnswers[question.id];
        if (userAnswer && userAnswer === question.correctAnswer) {
          newScore++;
        }
      }

      return {
        ...state,
        answers: updatedAnswers,
        score: newScore,
      };
    }
    case "FINISH_QUIZ":
      return { ...state, view: "results" };
    case "SET_TOPIC":
        return {...state, topic:action.topic};
    case "SET_FEEDBACK":
      return { ...state, feedback: action.feedback,loading: false,view: "results",currentIndex:0 };
    case "RESET":
      return initialState;
    case "NEXT_QUESTION":
      return { ...state, currentIndex: state.currentIndex + 1 };

    case "PREV_QUESTION":
      return { ...state, currentIndex: state.currentIndex - 1 };
    case "SET_VIEW":
      return {...state,feedback:action.feedback, view:action.view }
    default:
      return state;
  }
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
