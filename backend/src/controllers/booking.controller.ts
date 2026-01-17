import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { BookSlotResponse, BookSlotSchema, BookingResponse, BookSlotRequest } from '../dto/booking.dto';
import { ErrorResponse } from '../dto/quiz.dto';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  /**
   * POST /api/bookings/book-slot
   * Book a slot with atomic transaction to prevent double-booking
   * Uses SELECT FOR UPDATE to lock the slot during transaction
   */
  bookSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body using Zod
      const validationResult = BookSlotSchema.safeParse(req.body);

      if (!validationResult.success) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid request data',
          message: validationResult.error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        };
        res.status(400).json(errorResponse);
        return;
      }

      const { user_id, slot_id, quiz_risk_score }: BookSlotRequest = validationResult.data;

      // Book the slot (atomic transaction)
      const booking = await this.bookingService.bookSlot(user_id, slot_id, quiz_risk_score);

      // Format response
      const bookingResponse: BookingResponse = {
        id: booking.id,
        user_id: booking.user_id,
        slot_id: booking.slot_id,
        quiz_risk_score: booking.quiz_risk_score,
        status: booking.status,
        created_at: booking.created_at,
        slot: booking.slot
          ? {
              id: booking.slot.id,
              coach_id: booking.slot.coach_id,
              coach_name: booking.slot.coach?.name || 'Unknown',
              start_time: booking.slot.start_time.toISOString(),
              end_time: booking.slot.end_time.toISOString(),
              timezone: booking.slot.timezone,
            }
          : undefined,
        user: booking.user
          ? {
              id: booking.user.id,
              email: booking.user.email,
              name: booking.user.name,
            }
          : undefined,
      };

      const response: BookSlotResponse = {
        success: true,
        data: bookingResponse,
        message: 'Slot booked successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to book slot',
      };

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json(errorResponse);
          return;
        }
        if (
          error.message.includes('already booked') ||
          error.message.includes('not available') ||
          error.message.includes('duplicate') ||
          error.message.includes('unique constraint')
        ) {
          // 409 Conflict for slot already booked
          errorResponse.error = 'Slot already booked';
          errorResponse.message = 'This slot has already been booked by another user';
          res.status(409).json(errorResponse);
          return;
        }
        if (error.message.includes('must be between')) {
          res.status(400).json(errorResponse);
          return;
        }
      }

      res.status(500).json(errorResponse);
    }
  };
}

