// src/components/CardWrapper.tsx

import React from "react";

interface CardWrapperProps {
  children: React.ReactNode;
  extraClasses?: string;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ children, extraClasses = "" }) => (
  <div
    className={`w-full max-w-lg p-6 sm:p-10 backdrop-blur-md rounded-[3rem] text-center shadow-2xl relative ${extraClasses}`}
    style={{
      backgroundColor: "rgba(5, 3, 21, 0.7)",
      border: "3px solid transparent",
      borderImage:
        "linear-gradient(135deg, #06b6d4, #a78bfa, #f472b6, #06b6d4) 1",
      borderImageSlice: 1,
    }}
  >
    <div
      className="absolute inset-0 rounded-[3rem] opacity-20"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #6d28d9, transparent 60%)",
      }}
    />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

export default CardWrapper;
