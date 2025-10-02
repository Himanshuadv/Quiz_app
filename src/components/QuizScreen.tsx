// src/components/QuizScreen.tsx
import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useQuiz } from "../context/QuizContext";

const QuizScreen: React.FC = () => {
  const { state, dispatch } = useQuiz();
  const { questions, currentIndex, answers } = state;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex) / totalQuestions) * 100;

  if (!currentQuestion) return <p>Loading question...</p>;

  const handleAnswerSelect = (option: string) => {
    
    
    dispatch({ type: "ANSWER_QUESTION", id: currentQuestion.id, answer: option });
  };

  const handleNext = () => {
    console.log(totalQuestions + "->"+ currentIndex
      
    );
    
    if (currentIndex < totalQuestions - 1) {
      dispatch({ type: "NEXT_QUESTION" });
    } else {
      dispatch({ type: "FINISH_QUIZ" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) dispatch({ type: "PREV_QUESTION" });
  };

  const isAnswered = !!answers[currentQuestion.id];

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
            className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 ease-out"
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
            const isSelected = answers[currentQuestion.id] === option;
            const optionClass = isSelected
              ? "ring-4 ring-purple-500 bg-purple-900/50 "
              : "hover:bg-gray-700/70 border-gray-700";

            return (
              <button
                key={index}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${optionClass}`}
                onClick={() => handleAnswerSelect(option)}
              >
                <span className="font-mono text-purple-200 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-white">{option}</span>
              </button>
            );
          })}
        </div>
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
          disabled={!isAnswered}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-white transition-all duration-300 transform 
            ${
              isAnswered
                ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 shadow-md shadow-cyan-500/30 cursor-pointer"
                : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
        >
          <span>{currentIndex === totalQuestions - 1 ? "Submit Quiz" : "Next"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;
