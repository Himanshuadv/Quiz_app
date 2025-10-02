import React, { useEffect, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import CardWrapper from "./CardWrapper";
import LoadingScreen from "./LoadingScreen";
// import { generateFeedback } from "../service/openAiService";
import { generateCustomFeedback } from "../service/geminiAiService";
type Props = {
  score: number;
  totalQuestions: number;
  topic: string;
  feedback?: string | null;
};

const ResultsScreen: React.FC<Props> = ({ score, totalQuestions, topic }) => {
  const { dispatch } = useQuiz();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState<boolean | false>(false);

  useEffect(() => {
    // Define an asynchronous function inside the effect
    const fetchFeedback = async () => {
      // Assuming totalQuestions refers to the max possible score (maxScore)
      // const result = "Loading the Analysis"
      // dispatch({type: "START_LOADING", topic: result})
      setIsLoading(true)
      const generated = await generateCustomFeedback(score, totalQuestions, topic);
      console.log("generated the output but not able to score");

      dispatch({ type: "SET_FEEDBACK", generated })
      setFeedback(generated);
      setIsLoading(false)
    };

    // Call the async function
    fetchFeedback();

    // Dependency array corrected to include 'topic'
  }, [score, totalQuestions, topic]);
  return (
    <CardWrapper extraClasses="min-h-[400px] flex flex-col justify-center max-w-xl text-center">
      <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-lg mb-2">
        You scored <span className="text-purple-400 font-semibold">{score}</span> out of{" "}
        <span className="text-cyan-400">{totalQuestions}</span> on{" "}
        <span className="italic">{topic}</span>.
      </p>
      {feedback && <p className="mt-4 text-gray-300">{feedback}</p>}
      {isloading && <LoadingScreen topic={"Loading result"} />}
      <button
        onClick={() => dispatch({ type: "RESET" })}
        className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg transition mt-6 ${isloading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        disabled={isloading}
      >
        {isloading ? "Loading..." : "Reset"}
      </button>

    </CardWrapper>
  );
};

export default ResultsScreen;
