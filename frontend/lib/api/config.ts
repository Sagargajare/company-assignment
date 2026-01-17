// API Configuration
// Use environment variable or default to localhost:3001
// Make sure to set NEXT_PUBLIC_API_URL in your .env.local file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Quiz endpoints
  QUIZ_SCHEMA: `${API_BASE_URL}/api/quiz/schema`,
  QUIZ_SUBMIT: `${API_BASE_URL}/api/quiz/submit`,
  QUIZ_PROGRESS: (userId: string) => `${API_BASE_URL}/api/quiz/progress/${userId}`,

  // Coach endpoints
  COACHES_AVAILABLE: `${API_BASE_URL}/api/coaches/available`,

  // Slot endpoints
  SLOTS_AVAILABLE: `${API_BASE_URL}/api/slots/available`,

  // Booking endpoints
  BOOK_SLOT: `${API_BASE_URL}/api/bookings/book-slot`,
};

export default API_BASE_URL;

