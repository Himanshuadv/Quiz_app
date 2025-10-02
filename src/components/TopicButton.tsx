// src/components/TopicButton.tsx

import React from 'react';

interface TopicButtonProps {
  topic: string;
  icon: React.ElementType;
  color: 'wellness' | 'tech';
  onClick: (topic: string) => void;
}

const TopicButton: React.FC<TopicButtonProps> = ({ topic, icon: Icon, color, onClick }) => (
  <button
    onClick={() => onClick(topic)}
    className={`
      flex items-center justify-center space-x-2 w-full
      px-6 py-3 text-lg font-semibold tracking-wide
      rounded-xl transition-all duration-300 transform
      hover:scale-[1.03] active:scale-[0.98]
      shadow-lg hover:shadow-2xl
      bg-opacity-80 hover:bg-opacity-100
      cursor-pointer
      
      ${color === 'wellness'
        ? 'bg-cyan-600 text-white from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400'
        : 'bg-indigo-600 text-white from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500'
      }
      bg-gradient-to-r
    `}
    style={{
      textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
      boxShadow: `0 0 15px ${color === 'wellness' ? 'rgba(0, 255, 255, 0.5)' : 'rgba(124, 58, 237, 0.5)'}`,
    }}
  >
    <Icon className="w-5 h-5" />
    <span>{topic}</span>
  </button>
);

export default TopicButton;
