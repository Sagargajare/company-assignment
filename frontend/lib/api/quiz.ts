import { API_ENDPOINTS } from './config';
import type { QuizQuestion } from '../store/quizStore';

// Types
export interface QuizQuestionResponse {
  id: string;
  question_id: string;
  question_text: string;
  question_type: string;
  branching_rules: Record<string, any> | null;
  options: Array<{ value: string; label: string }> | null;
  order_index: number;
  created_at: Date;
}

export interface SubmitQuizRequest {
  user_id: string;
  responses: Array<{
    question_id: string;
    answer: string | string[] | number;
  }>;
}

export interface SubmitQuizResponse {
  success: boolean;
  data: {
    risk_score: number;
    user_id: string;
    submitted_at: Date;
  };
  message?: string;
}

// API Functions
export async function fetchQuizSchema(): Promise<QuizQuestion[]> {
  const response = await fetch(API_ENDPOINTS.QUIZ_SCHEMA, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz schema: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch quiz schema');
  }

  return data.data.map((q: QuizQuestionResponse): QuizQuestion => ({
    id: q.id,
    question_id: q.question_id,
    question_text: q.question_text,
    question_type: q.question_type,
    branching_rules: q.branching_rules || undefined,
    options: q.options || undefined,
    order_index: q.order_index,
  }));
}

export async function submitQuiz(request: SubmitQuizRequest): Promise<SubmitQuizResponse> {
  const response = await fetch(API_ENDPOINTS.QUIZ_SUBMIT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to submit quiz: ${response.statusText}`);
  }

  return response.json();
}


