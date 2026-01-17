import { AppDataSource } from '../data-source';
import { Booking, Slot, User } from '../entities';
import { QueryRunner } from 'typeorm';

export class BookingService {
  private bookingRepository = AppDataSource.getRepository(Booking);
  private slotRepository = AppDataSource.getRepository(Slot);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Book a slot with atomic transaction to prevent double-booking
   * Uses SELECT FOR UPDATE to lock the slot during transaction
   * @param userId User ID
   * @param slotId Slot ID to book
   * @param quizRiskScore Risk score from quiz (0-100)
   * @returns Created booking
   */
  async bookSlot(userId: string, slotId: string, quizRiskScore: number): Promise<Booking> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verify user exists
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // 2. Lock and verify slot is available (SELECT FOR UPDATE)
      // This prevents other transactions from reading/modifying the slot
      const slot = await queryRunner.manager
        .createQueryBuilder(Slot, 'slot')
        .setLock('pessimistic_write') // SELECT FOR UPDATE
        .where('slot.id = :slotId', { slotId })
        .getOne();

      if (!slot) {
        throw new Error('Slot not found');
      }

      // 3. Check if slot is already booked
      const existingBooking = await queryRunner.manager.findOne(Booking, {
        where: { slot_id: slotId },
      });

      if (existingBooking) {
        throw new Error('Slot already booked');
      }

      // 4. Verify slot status is 'available'
      if (slot.status !== 'available') {
        throw new Error(`Slot is not available (status: ${slot.status})`);
      }

      // 5. Validate risk score range
      if (quizRiskScore < 0 || quizRiskScore > 100) {
        throw new Error('Risk score must be between 0 and 100');
      }

      // 6. Create booking within transaction
      const booking = this.bookingRepository.create({
        user_id: userId,
        slot_id: slotId,
        quiz_risk_score: quizRiskScore,
        status: 'confirmed',
      });

      const savedBooking = await queryRunner.manager.save(booking);

      // 7. Update slot status to 'booked' (optional - for faster queries)
      slot.status = 'booked';
      await queryRunner.manager.save(slot);

      // 8. Commit transaction (all or nothing)
      await queryRunner.commitTransaction();

      // 9. Reload booking with relations for response
      const bookingWithRelations = await this.bookingRepository.findOne({
        where: { id: savedBooking.id },
        relations: ['user', 'slot', 'slot.coach'],
      });

      if (!bookingWithRelations) {
        throw new Error('Failed to retrieve created booking');
      }

      return bookingWithRelations;
    } catch (error) {
      // Rollback transaction on any error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id: bookingId },
        relations: ['user', 'slot', 'slot.coach'],
      });

      return booking || null;
    } catch (error) {
      throw new Error(`Failed to fetch booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const bookings = await this.bookingRepository.find({
        where: { user_id: userId },
        relations: ['slot', 'slot.coach'],
        order: {
          created_at: 'DESC',
        },
      });

      return bookings;
    } catch (error) {
      throw new Error(
        `Failed to fetch user bookings: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

