// apiService.ts
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}
const API_KEY =  import.meta.env.VITE_OPEN_TB
export interface Feedback {
  score: number;
  maxScore: number;
  message: string;
}

const OPENTDB_API_URL = 'https://opentdb.com/api.php';

export async function fetchMCQs(topic?: string, amount: number = 5): Promise<Question[]> {
  // Map example topics to OpenTDB categories
  const categoryMap: Record<string, number> = {
    'Wellness': 17,       // Science & Nature
    'Tech Trends': 18,    // Science: Computers
    // Add more mappings if needed
  };

  const categoryId = topic && categoryMap[topic] ? `&category=${categoryMap[topic]}` : '';
  const url = `${OPENTDB_API_URL}?amount=${amount}&type=multiple${categoryId}`;

  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: Status ${response.status}`);
  }

  let data = await response.json();
  // console.log(data);
  
  if (data.response_code !== 0) {
    throw new Error('API returned no questions or error');
  }
  
  // Transform API data into internal Question format
  const questions: Question[] = data.results.map((q: any, index: number) => {
    // Combine correct + incorrect answers and shuffle
    const options = [...q.incorrect_answers, q.correct_answer];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return {
      id: index,
      question: decodeHtml(q.question),
      options: shuffledOptions.map(decodeHtml),
      correctAnswer: decodeHtml(q.correct_answer),
    };
  });

  return questions;
}

export function generateFeedback(score: number, maxScore: number): Feedback {
  let message = '';
  const percent = (score / maxScore) * 100;

  if (percent === 100) {
    message = 'Perfect score! Great job!';
  } else if (percent >= 80) {
    message = 'Excellent work! You have strong knowledge.';
  } else if (percent >= 50) {
    message = 'Good effort! Keep practicing to improve.';
  } else {
    message = 'Needs improvement, but don’t give up!';
  }

  return { score, maxScore, message };
}

// Helper to decode HTML entities returned by OpenTDB
function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
