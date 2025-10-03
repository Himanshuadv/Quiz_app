
🧠 AI-Assisted Quiz App

An interactive quiz experience powered by AI. Users select a topic, the app generates questions dynamically, and guides them through a smooth question-by-question flow with progress tracking and custom feedback.

1. 🚀 Project Setup & Demo


Web Setup

```bash
npm install
npm run dev   # or npm start
```

Demo

* Web: Deploy easily to Vercel/Netlify/Azure.
* Provide a hosted link or screen recording here.

 2. 📌 Problem Understanding

We needed to create a quiz app where:

1. Topic Selection: Users choose topics (e.g., *Wellness, Tech Trends*).
2. AI Question Generation: AI dynamically generates 5 multiple-choice questions with options and correct answers.
3. Quiz Flow: Users answer questions one-by-one with Next/Previous navigation and a progress bar.
4. Completion: On finishing, AI evaluates score and provides personalized feedback.
5. Bonus: User can download a detailed PDF quiz report.And User can review his answer and correct answer.

Assumptions made:
 AI always returns valid JSON (we added retries/error handling for malformed outputs).
 A fixed number of 5 questions per quiz.
 Correct answers are provided by AI, user answers are tracked locally.
3. 🤖 AI Prompts & Iterations

Initial Prompt (Issue: inconsistent JSON)

> “Generate 5 MCQs on the topic X. Each must have question, 4 options, correctAnswer.”

Issue: Sometimes AI added explanations or extra text.

Refined Prompt (Stable JSON)

> “Generate exactly 5 MCQs in JSON. Each object must have: question (string), options (array of 4 strings), correctAnswer (string). Do not include any other fields or text outside JSON.”

 Handling Malformed Output

* Added `try/catch` with retries.
* If JSON parse fails, fallback prompt is sent.
* The frontend will attempt thrice.

 4. 🏗️ Architecture & Code Structure

Main Flow

* `App.tsx` → Entry point, routes between screens.
* `QuizContext.tsx` → Centralized state (current question, score, answers).

Components / Screens

* TopicSelectionScreen.tsx → User selects quiz topic.
* LoadingScreen.tsx → Loader while AI fetches questions.
* QuizScreen.tsx → Displays one question at a time with navigation + progress bar.
* ResultScreen.tsx → Shows final score + AI-generated feedback.
* AnalysisScreen.tsx → Detailed breakdown, option to download PDF report.
* CardWrapper.tsx / TopicButton.tsx → Reusable UI components.

Services

* `geminiAiService.ts` → AI call wrapper for generating quiz questions.
* `openAiService.ts` → Alternative/fallback AI client.
* `generatePdf.ts` → Generates quiz report PDF (questions, answers, explanations).

Types

* `quiz.ts` → Defines question structure (question, options, correctAnswer, etc.).
* `quizState.ts` → Defines quiz session state.

 5. 📸 Screenshots / Recording

*  Topic selection
*  AI loader
*  Interactive quiz flow (Next/Previous)
*  Result + AI feedback
*  Download PDF report

(Add screenshots or a recording here.)



6.  Known Issues / Improvements

* Sometimes AI still adds small formatting issues → can be improved with structured output parsers.
* PDF export is basic → could add charts or percentage breakdowns.
* UI could support dark mode & animations.
* Limited topics → can integrate a topic suggestion AI.



7.Bonus Work

*  Added downloadable PDF report after quiz completion.
*  Clean UI with reusable components (`CardWrapper`, `TopicButton`).
*  State managed with React Context for scalability.
* Added revied session for each questions.
* Potential: Leaderboards, multi-user support, AI difficulty adjustment.


📂 Project Structure Snapshot

```
src/
 ├── components/   # Screens & UI components
 ├── context/      # Global QuizContext
 ├── service/      # AI + PDF generation
 ├── types/        # TS types for quiz & state
 ├── App.tsx       # Entry point
 ├── main.tsx      # ReactDOM render
```


