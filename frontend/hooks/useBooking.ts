import { useState, useCallback } from 'react';
import { useBookingStore } from '@/lib/store';
import { fetchAvailableCoaches, fetchAvailableSlots, bookSlot } from '@/lib/api';
import type { BookSlotRequest } from '@/lib/api';

export function useBooking() {
  const {
    availableCoaches,
    availableSlots,
    slotsGroupedByDate,
    selectedSlot,
    currentBooking,
    isLoadingCoaches,
    isLoadingSlots,
    isBooking,
    coachesError,
    slotsError,
    bookingError,
    userTimezone,
    setAvailableCoaches,
    setAvailableSlots,
    setSlotsGroupedByDate,
    setSelectedSlot,
    setCurrentBooking,
    setLoadingCoaches,
    setLoadingSlots,
    setBooking,
    setCoachesError,
    setSlotsError,
    setBookingError,
    setUserTimezone,
    resetBooking,
  } = useBookingStore();

  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch available coaches based on risk score
   */
  const loadCoaches = async (riskScore: number, language?: string) => {
    setLoadingCoaches(true);
    setCoachesError(null);
    setError(null);

    try {
      const coaches = await fetchAvailableCoaches(riskScore, language);
      setAvailableCoaches(coaches);
      return coaches;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load coaches';
      setCoachesError(message);
      setError(message);
      throw err;
    } finally {
      setLoadingCoaches(false);
    }
  };

  /**
   * Fetch available slots for given coach IDs
   */
  const loadSlots = async (coachIds: string[], timezone?: string, groupByDate: boolean = true) => {
    setLoadingSlots(true);
    setSlotsError(null);
    setError(null);

    try {
      const result = await fetchAvailableSlots(coachIds, timezone, groupByDate);
      setAvailableSlots(result.slots);
      
      if (result.groupedByDate) {
        setSlotsGroupedByDate(result.groupedByDate);
      } else if (groupByDate) {
        // Group slots by date if backend didn't return grouped data
        const grouped: Record<string, typeof result.slots> = {};
        result.slots.forEach((slot) => {
          const date = new Date(slot.start_time).toISOString().split('T')[0];
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(slot);
        });
        setSlotsGroupedByDate(grouped);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load slots';
      setSlotsError(message);
      setError(message);
      throw err;
    } finally {
      setLoadingSlots(false);
    }
  };

  /**
   * Book a slot
   */
  const bookSelectedSlot = async (userId: string, quizRiskScore: number) => {
    if (!selectedSlot) {
      throw new Error('No slot selected');
    }

    setBooking(true);
    setBookingError(null);
    setError(null);

    try {
      const request: BookSlotRequest = {
        user_id: userId,
        slot_id: selectedSlot.id,
        quiz_risk_score: quizRiskScore,
      };

      const booking = await bookSlot(request);
      setCurrentBooking(booking);
      return booking;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to book slot';
      setBookingError(message);
      setError(message);
      throw err;
    } finally {
      setBooking(false);
    }
  };

  /**
   * Initialize booking flow - load coaches and slots
   */
  const initializeBooking = useCallback(async (riskScore: number, language?: string, timezone?: string) => {
    try {
      // Set user timezone
      if (timezone) {
        setUserTimezone(timezone);
      }

      // Load coaches first
      const coaches = await fetchAvailableCoaches(riskScore, language);
      setAvailableCoaches(coaches);

      if (coaches.length === 0) {
        throw new Error('No coaches available for your risk score');
      }

      // Then load slots for all coaches
      const coachIds = coaches.map((c) => c.id);
      
      // Fetch slots
      setLoadingSlots(true);
      setSlotsError(null);
      try {
        const result = await fetchAvailableSlots(coachIds, timezone, true);
        setAvailableSlots(result.slots);
        
        if (result.groupedByDate) {
          setSlotsGroupedByDate(result.groupedByDate);
        } else {
          // Group slots by date if backend didn't return grouped data
          const grouped: Record<string, typeof result.slots> = {};
          result.slots.forEach((slot) => {
            const date = new Date(slot.start_time).toISOString().split('T')[0];
            if (!grouped[date]) {
              grouped[date] = [];
            }
            grouped[date].push(slot);
          });
          setSlotsGroupedByDate(grouped);
        }
      } finally {
        setLoadingSlots(false);
      }

      return { coaches, coachIds };
    } catch (err) {
      throw err;
    }
  }, [setUserTimezone, setAvailableCoaches, setLoadingSlots, setSlotsError, setAvailableSlots, setSlotsGroupedByDate]);

  return {
    // State
    availableCoaches,
    availableSlots,
    slotsGroupedByDate,
    selectedSlot,
    currentBooking,
    isLoadingCoaches,
    isLoadingSlots,
    isBooking,
    coachesError,
    slotsError,
    bookingError,
    error,
    userTimezone,

    // Actions
    loadCoaches,
    loadSlots,
    bookSelectedSlot,
    initializeBooking,
    setSelectedSlot,
    setUserTimezone,
    resetBooking,
  };
}

