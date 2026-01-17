import { Request, Response } from 'express';
import { SlotService } from '../services/slot.service';
import { AvailableSlotsResponse, GetAvailableSlotsQuerySchema } from '../dto/slot.dto';
import { ErrorResponse } from '../dto/quiz.dto';

export class SlotController {
  private slotService: SlotService;

  constructor() {
    this.slotService = new SlotService();
  }

  /**
   * GET /api/slots/available
   * Get available slots for the next 7 days for specified coaches
   * Query params: coach_ids (required, JSON array), user_timezone (optional), group_by_date (optional)
   */
  getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate query parameters
      const validationResult = GetAvailableSlotsQuerySchema.safeParse(req.query);

      if (!validationResult.success) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid query parameters',
          message: validationResult.error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        };
        res.status(400).json(errorResponse);
        return;
      }

      const { coach_ids, user_timezone, group_by_date } = validationResult.data;

      // Validate coach_ids is not empty
      if (!coach_ids || coach_ids.length === 0) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid query parameters',
          message: 'At least one coach_id is required',
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Get available slots
      const slots = await this.slotService.getAvailableSlots(coach_ids, user_timezone);

      // Format slots for response
      const formattedSlots = slots.map((slot) =>
        this.slotService.formatSlotForResponse(slot, user_timezone)
      );

      const response: AvailableSlotsResponse = {
        success: true,
        data: formattedSlots,
        filters: {
          coach_ids,
          days_ahead: 7,
          ...(user_timezone && { user_timezone }),
        },
      };

      // Optionally group by date
      if (group_by_date) {
        response.grouped_by_date = {};
        formattedSlots.forEach((slot) => {
          const dateKey = slot.start_time_user_tz.split('T')[0];
          if (!response.grouped_by_date![dateKey]) {
            response.grouped_by_date![dateKey] = [];
          }
          response.grouped_by_date![dateKey].push(slot);
        });
      }

      // Add message if no slots found
      if (slots.length === 0) {
        response.message = 'No available slots found for the specified coaches in the next 7 days.';
      }

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get available slots',
      };

      res.status(500).json(errorResponse);
    }
  };
}

