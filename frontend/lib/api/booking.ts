import { API_ENDPOINTS } from './config';
import type { Coach, Slot, Booking } from '../store/bookingStore';

// Types
export interface AvailableCoachesResponse {
  success: boolean;
  data: Coach[];
  filters: {
    risk_score: number;
    required_seniority: string;
    language?: string;
  };
  message?: string;
}

export interface AvailableSlotsResponse {
  success: boolean;
  data?: Slot[];
  grouped_by_date?: Record<string, Slot[]>;
  filters: {
    coach_ids: string[];
    days_ahead: number;
    user_timezone?: string;
  };
  message?: string;
}

export interface BookSlotRequest {
  user_id: string;
  slot_id: string;
  quiz_risk_score: number;
}

export interface BookSlotResponse {
  success: boolean;
  data: Booking;
  message?: string;
}

// API Functions
export async function fetchAvailableCoaches(
  riskScore: number,
  language?: string
): Promise<Coach[]> {
  const params = new URLSearchParams({
    risk_score: riskScore.toString(),
    ...(language && { language }),
  });

  const response = await fetch(`${API_ENDPOINTS.COACHES_AVAILABLE}?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch available coaches: ${response.statusText}`);
  }

  const data: AvailableCoachesResponse = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch available coaches');
  }

  return data.data;
}

export async function fetchAvailableSlots(
  coachIds: string[],
  userTimezone?: string,
  groupByDate: boolean = false
): Promise<{ slots: Slot[]; groupedByDate?: Record<string, Slot[]> }> {
  const params = new URLSearchParams({
    coach_ids: JSON.stringify(coachIds),
    ...(userTimezone && { user_timezone: userTimezone }),
    ...(groupByDate && { group_by_date: 'true' }),
  });

  const response = await fetch(`${API_ENDPOINTS.SLOTS_AVAILABLE}?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch available slots: ${response.statusText}`);
  }

  const data: AvailableSlotsResponse = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch available slots');
  }

  return {
    slots: data.data || [],
    groupedByDate: data.grouped_by_date,
  };
}

export async function bookSlot(request: BookSlotRequest): Promise<Booking> {
  const response = await fetch(API_ENDPOINTS.BOOK_SLOT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to book slot: ${response.statusText}`);
  }

  const data: BookSlotResponse = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to book slot');
  }

  return data.data;
}

