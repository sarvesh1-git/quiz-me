export type QuestionType = 'radio' | 'checkbox' | 'text' | 'dropdown';

export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  options: string[] | null;
  correct_answer: string;
}

export interface Quiz {
  id: number;
  date: string;
  questions: Question[];
}

export interface Result {
  id: number;
  date: string;
  score: number;
  time_taken: number;
  total_questions: number;
  created_at: string;
}

export interface QuizSubmission {
  date: string;
  answers: Record<number, string | string[]>;
  time_taken: number;
}
