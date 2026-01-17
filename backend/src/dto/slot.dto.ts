import { z } from 'zod';

// Response DTOs
export interface SlotResponse {
  id: string;
  coach_id: string;
  coach_name: string;
  start_time: string;
  end_time: string;
  start_time_user_tz: string;
  end_time_user_tz: string;
  timezone: string;
  status: string;
}

export interface AvailableSlotsResponse {
  success: boolean;
  data: SlotResponse[];
  grouped_by_date?: Record<string, SlotResponse[]>;
  filters: {
    coach_ids: string[];
    days_ahead: number;
    user_timezone?: string;
  };
  message?: string;
}

// Validation schemas
export const GetAvailableSlotsQuerySchema = z.object({
  coach_ids: z
    .union([
      z.string().transform((val) => {
        // Try to parse as JSON array first
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          // If not array, wrap in array
          return [parsed];
        } catch {
          // If not JSON, treat as comma-separated string
          return val.split(',').map((id) => id.trim()).filter(Boolean);
        }
      }),
      z.array(z.string()),
    ])
    .pipe(z.array(z.string().uuid()).min(1, 'At least one valid coach_id is required')),
  user_timezone: z.string().optional(),
  group_by_date: z
    .string()
    .optional()
    .transform((val) => val === 'true' || val === '1'),
});

