import React from "react";

type Props = {
  topic: string | null;
};

const LoadingScreen: React.FC<Props> = ({ topic }) => (
  <div className="flex flex-col items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
    <p className="mt-8 text-2xl font-medium tracking-wider text-purple-300">
      AI is crafting 5 unique questions on{" "}
      <span className="text-cyan-400 font-bold">{topic}</span>...
    </p>
    {/* <p className="mt-2 text-md text-gray-400">(Simulating Gemini API call...)</p> */}
  </div>
);

