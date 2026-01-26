import { API_ENDPOINTS } from './config';
import type { QuizQuestion, QuizQuestionResponse, SubmitQuizRequest, SubmitQuizResponse } from '@/types';

// API Functions
export async function fetchQuizSchema(language: string = 'en'): Promise<QuizQuestion[]> {
  // Add language parameter to the URL
  const url = new URL(API_ENDPOINTS.QUIZ_SCHEMA);
  url.searchParams.append('language', language);

  const response = await fetch(url.toString(), {
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


