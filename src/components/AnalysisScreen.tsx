import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Info } from "lucide-react";
import { useQuiz } from "../context/QuizContext";

const AnalysisScreen: React.FC = () => {
  const { state, dispatch } = useQuiz();
  const { questions, currentIndex, answers } = state;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex+1) / totalQuestions) * 100;

  if (!currentQuestion) return <p>Loading question...</p>;

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      dispatch({ type: "NEXT_QUESTION" });
    } else {
      dispatch({ type: "SET_VIEW", view: "results" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) dispatch({ type: "PREV_QUESTION" });
  };

  const userAnswer = answers[currentQuestion.id];
  const correctAnswer = currentQuestion.correctAnswer;

  return (
    <div className="flex flex-col h-full w-full md:w-3/4 xl:w-1/2 lg:w-3/4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium mb-1 text-purple-300">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-grow p-6 sm:p-8 bg-gray-800 bg-opacity-50 rounded-2xl shadow-xl border border-gray-700/50">
        <p className="text-xl sm:text-2xl font-light text-cyan-300 mb-6">
          {currentQuestion.question}
        </p>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === correctAnswer;
            const isUserAnswer = option === userAnswer;

            let optionClass = "border-gray-700 hover:cursor-default";

            if (isCorrect) {
              optionClass = "bg-green-800/60 ring-2 ring-green-500";
            }
            if (isUserAnswer && !isCorrect) {
              optionClass = "bg-red-800/60 ring-2 ring-red-500";
            }

            return (
              <div
                key={index}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${optionClass}`}
              >
                <span className="font-mono text-purple-200 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-white">{option}</span>
                {isCorrect && <CheckCircle className="inline ml-2 text-green-400" />}
                {isUserAnswer && !isCorrect && <XCircle className="inline ml-2 text-red-400" />}
              </div>
            );
          })}
        </div>

        {/* ✅ Answer Description */}
        {currentQuestion.description && (
          <div className="mt-6 p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-gray-200">
            <div className="flex items-center mb-2 text-cyan-300">
              <Info className="w-5 h-5 mr-2" />
              <span className="font-semibold">Explanation</span>
            </div>
            <p className="text-sm leading-relaxed">{currentQuestion.description}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg text-white disabled:opacity-50 hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg text-white transition-all duration-300 transform 
            bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 shadow-md shadow-green-500/30 cursor-pointer"
        >
          <span>{currentIndex === totalQuestions - 1 ? "Back to Results" : "Next"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AnalysisScreen;
