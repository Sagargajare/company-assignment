import { z } from 'zod';

// Response DTOs
export interface BookingResponse {
  id: string;
  user_id: string;
  slot_id: string;
  quiz_risk_score: number;
  status: string;
  created_at: Date;
  slot?: {
    id: string;
    coach_id: string;
    coach_name?: string;
    start_time: string;
    end_time: string;
    timezone: string;
  };
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface BookSlotResponse {
  success: boolean;
  data: BookingResponse;
  message?: string;
}

// Validation schemas
export const BookSlotSchema = z.object({
  user_id: z.string().uuid(),
  slot_id: z.string().uuid(),
  quiz_risk_score: z.number().int().min(0).max(100),
});

export interface BookSlotRequest {
  user_id: string;
  slot_id: string;
  quiz_risk_score: number;
}

