// Central export point for all TypeScript types

// Quiz types
export type { QuizQuestion, QuizAnswer, QuizState } from '@/lib/store/quizStore';

// User types
export interface UserFormData {
  email: string;
  name: string;
  timezone: string;
  language_preference: 'en' | 'hi';
}

// API Response types
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

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  timezone: string;
  language_preference: string;
  created_at: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  timezone?: string;
  language_preference?: 'en' | 'hi';
}

export interface CreateUserResponse {
  success: boolean;
  data: UserResponse;
  message?: string;
}

