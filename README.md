🧠 AI-Assisted Quiz App

An interactive quiz experience powered by AI. Users select a topic, the app generates questions dynamically, and guides them through a smooth question-by-question flow with progress tracking and custom feedback.


1. 🚀 Project Setup & Demo

Web Setup

```bash
npm install
npm run dev   # or npm start
```

Demo

- Web: https://orange-rock-0338d8700.1.azurestaticapps.net/
- Video: https://drive.google.com/file/d/1M_ukLaNcaqM2nkEqCm8zDSa35qRKAves/view?usp=drive_link

2.  📌 Problem Understanding

We needed to create a quiz app with following functionality:

    • Dynamic Topic Selection - Choose from multiple quiz topics (Wellness, Tech Trends, etc.)
    • AI-Powered Question Generation - Real-time MCQ creation with 4 options per question
    • Intuitive Quiz Flow - Navigate seamlessly with Next/Previous buttons and progress tracking
    • Smart Feedback System - Receive personalized AI-generated performance feedback
    • Answer Review - Detailed analysis of each question with correct answers and explanations
    • PDF Export - Download comprehensive quiz reports for offline review
    • Fallback Mechanism - Automatic retry logic with OpenTDB API backup for reliability

Assumptions made:

•AI returns valid JSON (retry logic handles malformed outputs).
•Three retry attempts for question generation.
•If AI fails, fallback API: OpenTDB.
•Fixed quiz size: 5 questions per session.
•User’s answers are tracked locally for simplicity.

3. 🤖 AI Prompts & Iterations

Initial Prompt (Issue: inconsistent JSON)

> “Generate 5 MCQs on the topic X. Each must have question, 4 options, correctAnswer.”

Issue: Sometimes AI added explanations or extra text.

Refined Prompt (Stable JSON)

SCHEMA: const QUESTION_SCHEMA = {
type: "ARRAY",
items: {
type: "OBJECT",
properties: {
question: { type: "STRING" },
options: {
type: "ARRAY",
items: { type: "STRING" }
},
correctAnswer: { type: "STRING" },
description:{type:"STRING"}
},
required: ["question", "options", "correctAnswer","description"],
propertyOrdering: ["question", "options", "correctAnswer","description"],
}
};

> “Generate exactly 5 MCQs in JSON. Each object must have: question (string), options (array of 4 strings), correctAnswer (string). Do not include any other fields or text outside JSON.”

Handling Malformed Output

- Added `try/catch` with retries.
- If JSON parse fails, fallback prompt is sent.
- The frontend will attempt thrice.

4.  🏗️ Architecture & Code Structure

Main Flow

- `App.tsx` → Entry point, routes between screens.
- `QuizContext.tsx` → Centralized state (current question, score, answers).

Components / Screens

- TopicSelectionScreen.tsx → User selects quiz topic.
- LoadingScreen.tsx → Loader while AI fetches questions.
- QuizScreen.tsx → Displays one question at a time with navigation + progress bar.
- ResultScreen.tsx → Shows final score + AI-generated feedback.
- AnalysisScreen.tsx → Detailed breakdown, Each questions with your answers and correct answers
- CardWrapper.tsx / TopicButton.tsx → Reusable UI components.

Services

- `geminiAiService.ts` → AI call wrapper for generating quiz questions.
- `openAiService.ts` → Alternative/fallback AI client.
- `generatePdf.ts` → Generates quiz report PDF (questions, answers, explanations).

Types

- `quiz.ts` → Defines question structure (question, options, correctAnswer, etc.).
- `quizState.ts` → Defines quiz session state.

5.  📸 Screenshots / Recording

- Topic selection
<img width="1039" height="727" alt="Screenshot 2025-10-04 at 11 39 22 PM" src="https://github.com/user-attachments/assets/8b27bfef-a7ea-4a31-8152-d86dea7349a4" />

- AI loader

<img width="785" height="618" alt="Screenshot 2025-10-04 at 11 39 51 PM" src="https://github.com/user-attachments/assets/79378a87-281a-4fbb-897d-2c3e61c33553" />

- Interactive quiz flow (Next/Previous)

<img width="991" height="701" alt="Screenshot 2025-10-04 at 11 40 05 PM" src="https://github.com/user-attachments/assets/3ae3cb7d-f581-468a-abab-4a23085110a3" />

<img width="1036" height="678" alt="Screenshot 2025-10-04 at 11 40 27 PM" src="https://github.com/user-attachments/assets/0125edb8-d520-4166-a704-27cd1010d6df" />
<img width="832" height="659" alt="Screenshot 2025-10-04 at 11 40 39 PM" src="https://github.com/user-attachments/assets/f6a09ce1-474a-4c6b-87ae-38211a5638e3" />
<img width="825" height="643" alt="Screenshot 2025-10-04 at 11 40 49 PM" src="https://github.com/user-attachments/assets/acbbd6a6-8678-4cc5-9d42-a069a769a53a" />

Review Section:

<img width="959" height="791" alt="Screenshot 2025-10-04 at 11 40 59 PM" src="https://github.com/user-attachments/assets/1a5d7c4c-a220-4fd8-a4db-917a93cf78ee" />

<img width="964" height="812" alt="Screenshot 2025-10-04 at 11 41 24 PM" src="https://github.com/user-attachments/assets/74c64e45-9af0-440e-95ff-791774b9823e" />

Quiz Report: Pdf formate
<img width="885" height="688" alt="Screenshot 2025-10-04 at 11 41 47 PM" src="https://github.com/user-attachments/assets/94dcd772-767a-45cd-8b5e-1a19d9c43fed" />


(Add screenshots or a recording here.)

6.  Known Issues / Future Improvements

        • No User Persistence - Quiz history is not saved across sessions
        • Fixed Question Count - Limited to 5 questions per quiz
        • Basic PDF Design - Text-only reports without visual analytics
        • Limited Topics - Pre-defined topic list instead of user-generated topics
    
Browser Compatibility

    • Tested on Chrome, Firefox, and Safari
    • Mobile responsiveness needs improvement
    • PDF generation may have issues on older browsers


Additional features:

    • Bookmarks for questions/topics
    • Notes per question
    • Performance visualization with graphs/histograms

🚧 Future Improvements
High Priority

    • Backend Integration - Implement Node.js/Express server with MongoDB
    • User Authentication - Add login system to track individual progress
    • Question Database - Store generated questions to reduce API calls
    • Performance Analytics - Display score trends and improvement metrics
    • Difficulty Levels - Easy, Medium, Hard question categories

Medium Priority

    • Topic Customization - Allow users to create custom quiz topics
    • Timer Feature - Add optional time limits per question
    • Social Features - Leaderboards and score sharing
    • Enhanced PDF Reports - Include charts, graphs, and visual summaries
    • Dark Mode - Toggle between light and dark themes

Low Priority

    • Multi-Language Support - Localization for different languages
    • Question Bookmarking - Save favorite questions for later review
    • Note-Taking - Add personal notes to specific questions
    • Gamification - Badges, achievements, and streak tracking
    • Accessibility - Screen reader support and keyboard navigation

Technical Enhancements

    • Caching Strategy - Implement Redis for frequently requested topics
    • Rate Limiting - Prevent API abuse and manage costs
    • WebSocket Integration - Real-time multiplayer quiz battles
    • Analytics Integration - Track user behavior with Google Analytics
    • Progressive Web App - Offline functionality and installability






7.Bonus Work

- Added downloadable PDF report after quiz completion.
- Clean UI with reusable components (`CardWrapper`, `TopicButton`).
- State managed with React Context,useReducer for scalability.
- Added revied session for each questions.
- Potential: Leaderboards, multi-user support, AI difficulty adjustment.

📂 Project Structure Snapshot

```
src/
 ├── components/   # Screens & UI components
 ├── context/      # Global QuizContext
 ├── service/      # AI + PDF generation, Logic for fallback opentdb api quiz generation.
 ├── types/        # TS types for quiz & state
 ├── App.tsx       # Entry point
 ├── main.tsx      # ReactDOM render
```
