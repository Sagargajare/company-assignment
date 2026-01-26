// API Configuration
// In production, use relative path (proxied through nginx)
// In development, use environment variable or localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_URL
export const API_ENDPOINTS = {
  // User endpoints
  CREATE_USER: `${API_BASE_URL}/api/users`,

  // Quiz endpoints
  QUIZ_SCHEMA: `${API_BASE_URL}/api/quiz/schema`,
  QUIZ_SUBMIT: `${API_BASE_URL}/api/quiz/submit`,

  // Coach endpoints
  COACHES_AVAILABLE: `${API_BASE_URL}/api/coaches/available`,

  // Slot endpoints
  SLOTS_AVAILABLE: `${API_BASE_URL}/api/slots/available`,

  // Booking endpoints
  BOOK_SLOT: `${API_BASE_URL}/api/bookings/book-slot`,
};

export default API_BASE_URL;
