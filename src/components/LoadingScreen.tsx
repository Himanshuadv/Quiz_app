import React, { useEffect, useState, useMemo } from "react";

type Props = {
  topic: string | null;
  result: boolean;  // added result prop
};

const LOADING_MESSAGES = [
  "AI is crafting 5 unique questions on",
  "AI is brainstorming tricky scenarios about",
  "AI is ensuring the quiz is challenging and fair",
  "Generating Question 1 on",
  "Generating Question 2 on",
  "Generating Question 3 on",
  "Generating Question 4 on",
  "Generating Question 5 on",
  "Almost ready! Polishing the questions...",
] as const;

const TRANSITION_INTERVAL = 3000; // 3 seconds

const LoadingScreen: React.FC<Props> = ({ topic, result }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const progress = useMemo(
    () => Math.min(((currentIndex + 1) / LOADING_MESSAGES.length) * 100, 100),
    [currentIndex]
  );

  useEffect(() => {
    if (result) return; // Stop cycling messages if result is true

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setFade(true);
      }, 300);
    }, TRANSITION_INTERVAL);

    return () => clearInterval(interval);
  }, [result]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] p-4">
      <div className="relative">
        {/* Spinning loader */}
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-500 border-opacity-75"></div>

        {/* Inner pulse circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-purple-500 opacity-20 animate-ping"></div>
        </div>
      </div>

      {/* Loading or Feedback message */}
      <div
        className={`mt-10 text-center transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {result ? (
          <p className="text-xl md:text-2xl font-semibold tracking-wide text-green-400">
            ✅ Feedback is being generated...
          </p>
        ) : (
          <p className="text-xl md:text-2xl font-medium tracking-wide text-gray-200">
            {LOADING_MESSAGES[currentIndex]}{" "}
            {topic && <span className="text-cyan-400 font-bold">{topic}</span>}
            <span className="animate-pulse">...</span>
          </p>
        )}
      </div>

      {/* Progress bar (hide when result is true) */}
      {!result && (
        <div className="mt-8 w-full max-w-md">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 text-center mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
