import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Coach {
  id: string;
  name: string;
  specialization: string | null;
  seniority_level: string;
  languages: string[];
  timezone: string;
}

export interface Slot {
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

export interface Booking {
  id: string;
  user_id: string;
  slot_id: string;
  quiz_risk_score: number;
  status: string;
  created_at: Date;
  slot?: Slot;
}

export interface BookingState {
  // Available coaches (after quiz completion)
  availableCoaches: Coach[];
  
  // Available slots
  availableSlots: Slot[];
  slotsGroupedByDate: Record<string, Slot[]>;
  
  // Selected slot for booking
  selectedSlot: Slot | null;
  
  // Current booking
  currentBooking: Booking | null;
  
  // Loading states
  isLoadingCoaches: boolean;
  isLoadingSlots: boolean;
  isBooking: boolean;
  
  // Error states
  coachesError: string | null;
  slotsError: string | null;
  bookingError: string | null;
  
  // Filters
  userTimezone: string | null;
  
  // Actions
  setAvailableCoaches: (coaches: Coach[]) => void;
  setAvailableSlots: (slots: Slot[]) => void;
  setSlotsGroupedByDate: (grouped: Record<string, Slot[]>) => void;
  setSelectedSlot: (slot: Slot | null) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  setLoadingCoaches: (loading: boolean) => void;
  setLoadingSlots: (loading: boolean) => void;
  setBooking: (booking: boolean) => void;
  setCoachesError: (error: string | null) => void;
  setSlotsError: (error: string | null) => void;
  setBookingError: (error: string | null) => void;
  setUserTimezone: (timezone: string) => void;
  resetBooking: () => void;
}

const initialState = {
  availableCoaches: [],
  availableSlots: [],
  slotsGroupedByDate: {},
  selectedSlot: null,
  currentBooking: null,
  isLoadingCoaches: false,
  isLoadingSlots: false,
  isBooking: false,
  coachesError: null,
  slotsError: null,
  bookingError: null,
  userTimezone: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,

      setAvailableCoaches: (coaches) => {
        set({ availableCoaches: coaches, coachesError: null });
      },

      setAvailableSlots: (slots) => {
        set({ availableSlots: slots, slotsError: null });
      },

      setSlotsGroupedByDate: (grouped) => {
        set({ slotsGroupedByDate: grouped });
      },

      setSelectedSlot: (slot) => {
        set({ selectedSlot: slot, bookingError: null });
      },

      setCurrentBooking: (booking) => {
        set({ currentBooking: booking, bookingError: null });
      },

      setLoadingCoaches: (loading) => {
        set({ isLoadingCoaches: loading });
      },

      setLoadingSlots: (loading) => {
        set({ isLoadingSlots: loading });
      },

      setBooking: (booking) => {
        set({ isBooking: booking });
      },

      setCoachesError: (error) => {
        set({ coachesError: error });
      },

      setSlotsError: (error) => {
        set({ slotsError: error });
      },

      setBookingError: (error) => {
        set({ bookingError: error });
      },

      setUserTimezone: (timezone) => {
        set({ userTimezone: timezone });
      },

      resetBooking: () => {
        set(initialState);
      },
    }),
    {
      name: 'booking-storage', // localStorage key
      // Persist only essential booking data
      partialize: (state) => ({
        selectedSlot: state.selectedSlot,
        currentBooking: state.currentBooking,
        userTimezone: state.userTimezone,
      }),
    }
  )
);

