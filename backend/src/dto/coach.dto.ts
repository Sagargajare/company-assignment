// Response DTOs
export interface CoachResponse {
  id: string;
  name: string;
  specialization: string | null;
  seniority_level: string;
  languages: string[];
  timezone: string;
  created_at: Date;
}

export interface AvailableCoachesResponse {
  success: boolean;
  data: CoachResponse[];
  filters: {
    risk_score: number;
    required_seniority: string;
    language?: string;
  };
  message?: string;
}

// Validation schemas
import { z } from 'zod';

export const GetAvailableCoachesQuerySchema = z.object({
  risk_score: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(0).max(100)),
  language: z.string().optional(),
});

