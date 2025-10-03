// src/App.tsx
import React , {useEffect} from "react";
import { useQuiz } from "./context/QuizContext";
import {fetchMCQs } from './service/openAiService'
import AnalysisScreen from "./components/AnalysisScreen";

import Layout from "./components/Layout";
import TopicSelectionScreen from "./components/TopicSelectionScreen";
import LoadingScreen from "./components/LoadingScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultScreen";

const App: React.FC = () => {
  const { state } = useQuiz();  // 👈 grab state from context


  return (
    <Layout>
      {state.view === "topic" && <TopicSelectionScreen />}
      {state.view === "loading" && <LoadingScreen topic={state.topic} />}
      {state.view === "quiz" && (
        <QuizScreen
          questions={state.questions}
          userAnswers={state.answers}
          currentQuestionIndex={state.currentIndex}
        />
      )}
      {state.view === "results" && (
        <ResultsScreen
          score={state.score}
          totalQuestions={state.questions.length}
          topic={state.topic!}
          // feedback={state.feedback}
        />
      )}
      {state.view === "analysis" && <AnalysisScreen />}
    </Layout>
  );
};

export default App;
