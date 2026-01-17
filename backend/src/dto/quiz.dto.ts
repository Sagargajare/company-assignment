import { z } from 'zod';

// Response DTOs
export interface QuizQuestionResponse {
  id: string;
  question_id: string;
  question_text: string;
  question_type: string;
  branching_rules: Record<string, any> | null;
  order_index: number;
  created_at: Date;
}

export interface QuizSchemaResponse {
  success: boolean;
  data: QuizQuestionResponse[];
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

// Validation schemas (for future use)
export const QuizResponseSchema = z.object({
  question_id: z.string(),
  answer: z.union([z.string(), z.array(z.string()), z.number()]),
});

export const SubmitQuizSchema = z.object({
  user_id: z.string().uuid(),
  responses: z.array(QuizResponseSchema),
});

// Submit Quiz Response DTOs
export interface SubmitQuizResponse {
  success: boolean;
  data: {
    risk_score: number;
    user_id: string;
    submitted_at: Date;
  };
  message?: string;
}

export interface SubmitQuizRequest {
  user_id: string;
  responses: Array<{
    question_id: string;
    answer: string | string[] | number;
  }>;
}

