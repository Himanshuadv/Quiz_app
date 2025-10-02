import React, { useEffect,useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import CardWrapper from "./CardWrapper";
import TopicButton from "./TopicButton";
import { MOCK_QUIZ_DATA } from "../data/mockData";
import LoadingScreen from "./LoadingScreen";
// import { fetchMCQs } from "../service/openAiService";
import { generateQuizQuestions } from "../service/geminiAiService";


const TopicSelectionScreen: React.FC = () => {
  const { dispatch } = useQuiz();
  const [isloading, setIsLoading] = useState(false)

  const handleSelect = async (topic: string) => {
  try {
    console.log("Fetching questions for", topic);
    // dispatch({type: "START_LOADING", topic})
    setIsLoading(true)
    const questions = await generateQuizQuestions(topic); // fetchMCQs should accept topic param
    console.log("Fetched questions:", questions);

    if (!questions || questions.length === 0) {
      alert("No questions found for this topic");
      return;
    }

    // Immediately set questions and switch to quiz view
    setIsLoading(false)
    dispatch({ type: "SET_QUESTIONS", questions });
    dispatch({ type: "SET_VIEW", view: "quiz" });
    dispatch({ type: "SET_TOPIC", topic });
  } catch (err) {
    console.error("Question fetch failed:", err);
    alert("Failed to load questions, please try again.");
  }
};



  return (
    <CardWrapper extraClasses="h-[500px] flex flex-col justify-center">
      <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 uppercase text-center">
        AI-POWERED <br /> KNOWLEDGE QUIZ
      </h1>
       {isloading && <LoadingScreen topic={"Loading result"} />}
     {!isloading && <> <div className="flex flex-col sm:flex-row gap-6 justify-center my-10">
        <TopicButton topic="Wellness" icon={Brain} color="wellness" onClick={handleSelect} />
        <TopicButton topic="Tech Trends" icon={Sparkles} color="tech" onClick={handleSelect} />
      </div>
      <p className="text-sm font-medium tracking-widest text-gray-400 uppercase mt-8 text-center">
        SELECT A TOPIC TO BEGIN
      </p></>}
    </CardWrapper>
  );
};

export default TopicSelectionScreen;
