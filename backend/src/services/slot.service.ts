import { AppDataSource } from '../data-source';
import { Slot, Booking, Coach } from '../entities';
import { MoreThan, LessThan, In } from 'typeorm';

export class SlotService {
  private slotRepository = AppDataSource.getRepository(Slot);
  private bookingRepository = AppDataSource.getRepository(Booking);
  private coachRepository = AppDataSource.getRepository(Coach);

  /**
   * Get available slots for the next 7 days
   * @param coachIds Array of coach IDs to filter by
   * @param userTimezone User's timezone (for conversion)
   * @returns Available slots
   */
  async getAvailableSlots(coachIds: string[], userTimezone?: string): Promise<Slot[]> {
    try {
      // Calculate date range (next 7 days from now)
      const now = new Date();
      const sevenDaysLater = new Date(now);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      sevenDaysLater.setHours(23, 59, 59, 999); // End of 7th day

      // Get all slots for the specified coaches in the next 7 days
      // Slots that start within the next 7 days
      const slots = await this.slotRepository.find({
        where: {
          coach_id: In(coachIds),
          start_time: MoreThan(now),
          status: 'available',
        },
        relations: ['coach'],
        order: {
          start_time: 'ASC',
        },
      });

      // Filter slots that start within the next 7 days
      const slotsInRange = slots.filter(
        (slot) => slot.start_time <= sevenDaysLater
      );

      // Get all booked slot IDs (slots that have bookings)
      const bookings = await this.bookingRepository.find({
        where: {
          slot_id: In(slotsInRange.map((s) => s.id)),
          status: 'confirmed', // Only count confirmed bookings
        },
        select: ['slot_id'],
      });

      const bookedSlotIds = new Set(bookings.map((b) => b.slot_id));

      // Filter out booked slots
      const availableSlots = slotsInRange.filter((slot) => !bookedSlotIds.has(slot.id));

      return availableSlots;
    } catch (error) {
      throw new Error(
        `Failed to get available slots: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get slots grouped by date for easier frontend rendering
   * @param slots Array of slots
   * @param userTimezone User's timezone for date grouping
   * @returns Slots grouped by date
   */
  groupSlotsByDate(slots: Slot[], userTimezone?: string): Record<string, Slot[]> {
    const grouped: Record<string, Slot[]> = {};

    slots.forEach((slot) => {
      // Convert slot time to user timezone if provided
      let dateKey: string;
      
      if (userTimezone) {
        // Convert to user timezone for date grouping
        const slotDate = new Date(slot.start_time);
        const localDate = new Date(
          slotDate.toLocaleString('en-US', { timeZone: userTimezone })
        );
        dateKey = localDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      } else {
        // Use slot's original timezone
        dateKey = new Date(slot.start_time).toISOString().split('T')[0];
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });

    return grouped;
  }

  /**
   * Format slot for API response with timezone conversion
   * @param slot Slot entity
   * @param userTimezone User's timezone
   * @returns Formatted slot data
   */
  formatSlotForResponse(slot: Slot, userTimezone?: string): {
    id: string;
    coach_id: string;
    coach_name: string;
    start_time: string;
    end_time: string;
    start_time_user_tz: string;
    end_time_user_tz: string;
    timezone: string;
    status: string;
  } {
    const startTime = new Date(slot.start_time);
    const endTime = new Date(slot.end_time);

    // Default to ISO string (UTC)
    let startTimeUserTz = startTime.toISOString();
    let endTimeUserTz = endTime.toISOString();

    if (userTimezone) {
      // Format time in user's timezone as ISO-like string
      // Create a date object representing the time in user's timezone
      const startInUserTz = new Date(
        startTime.toLocaleString('en-US', { timeZone: userTimezone })
      );
      const endInUserTz = new Date(
        endTime.toLocaleString('en-US', { timeZone: userTimezone })
      );
      
      // Return ISO string format (frontend can parse and display)
      startTimeUserTz = startInUserTz.toISOString();
      endTimeUserTz = endInUserTz.toISOString();
    }

    return {
      id: slot.id,
      coach_id: slot.coach_id,
      coach_name: slot.coach?.name || 'Unknown',
      start_time: startTime.toISOString(), // Original time in UTC
      end_time: endTime.toISOString(), // Original time in UTC
      start_time_user_tz: startTimeUserTz, // Time in user's timezone (ISO format)
      end_time_user_tz: endTimeUserTz, // Time in user's timezone (ISO format)
      timezone: slot.timezone, // Coach's timezone
      status: slot.status,
    };
  }

  /**
   * Get slot by ID
   */
  async getSlotById(slotId: string): Promise<Slot | null> {
    try {
      const slot = await this.slotRepository.findOne({
        where: { id: slotId },
        relations: ['coach', 'booking'],
      });

      return slot || null;
    } catch (error) {
      throw new Error(`Failed to fetch slot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

