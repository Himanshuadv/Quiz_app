import React, { useEffect, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import CardWrapper from "./CardWrapper";
import LoadingScreen from "./LoadingScreen";
import { generateCustomFeedback } from "../service/geminiAiService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // for nice tables
import { generatePDF, type QuizMeta } from "../service/generatepdf";


type Props = {
  score: number;
  totalQuestions: number;
  topic: string;
};

const ResultsScreen: React.FC<Props> = ({ score, totalQuestions, topic }) => {
  const { state, dispatch } = useQuiz();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      const generated = await generateCustomFeedback(score, totalQuestions, topic);
      dispatch({ type: "SET_FEEDBACK", payload: generated });
      setFeedback(generated);
      setIsLoading(false);
    };

    fetchFeedback();
  }, [score, totalQuestions, topic, dispatch]);

  // ✅ Generate PDF report
const handleDownloadReport = () => {
  const currentDate = new Date().toLocaleString();
  const meta: QuizMeta = {
    topic: state.topic,
    score: state.score,
    total: (state.questions).length,
    date: currentDate,
  };

  generatePDF(meta, state.questions);
};



  return (
    <CardWrapper extraClasses="min-h-[400px] flex flex-col justify-center max-w-xl text-center">
      <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-lg mb-2">
        You scored <span className="text-purple-400 font-semibold">{score}</span> out of{" "}
        <span className="text-cyan-400">{totalQuestions}</span> on{" "}
        <span className="italic">{topic}</span>.
      </p>

      {feedback && <p className="mt-4 text-gray-300">{feedback}</p>}
      {isLoading && <LoadingScreen topic={"Loading result"} />}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Reset"}
        </button>

        <button
          onClick={handleDownloadReport}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl shadow-lg transition"
          disabled={isLoading}
        >
          Download Report
        </button>

        <button
          onClick={() => dispatch({ type: "SET_VIEW", view: "analysis" })}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg transition"
          disabled={isLoading}
        >
          Review Answers
        </button>
      </div>
    </CardWrapper>
  );
};

export default ResultsScreen;
