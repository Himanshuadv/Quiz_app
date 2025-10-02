import React,{useEffect,useState} from "react";

type Props = {
  topic: string | null;
};

const LoadingScreen: React.FC<Props> = ({ topic }) => {
  const messages = [
    `AI is crafting 5 unique questions on `,
    `AI is Still brainstorming tricky oes about `,
    `AI is Making sure the  quiz is challengin`,
    `Generating Question 1 on the `,
    `Generating Question 2 on the `,
     `Generating Question 3 on the `,
      `Generating Question 4 on the `,
       `Generating Question 5 on the `,
    `Almost ready! Polishing the  questions...`,
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // change message every 2 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      <p className="mt-8 text-2xl font-medium tracking-wider text-purple-300">
        {messages[index]}
        <span className="text-cyan-400 font-bold">{topic}</span>...
      </p>
    </div>
  );
};
export default LoadingScreen;
