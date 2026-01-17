// User Utilities
// Handles user creation and retrieval for quiz submission

const USER_STORAGE_KEY = 'quiz_user';

export interface QuizUser {
  id: string;
  email: string;
  name: string;
  timezone: string;
  language_preference: string;
}

/**
 * Get or create a user for the quiz
 * Uses localStorage to persist user ID across sessions
 * For demo purposes, creates a simple user without backend API call
 * In production, you'd want to create user via API before starting quiz
 */
export function getOrCreateQuizUser(): QuizUser {
  if (typeof window === 'undefined') {
    // Server-side: return default user
    return {
      id: '',
      email: 'demo@example.com',
      name: 'Demo User',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      language_preference: 'en',
    };
  }

  // Check if user exists in localStorage
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      // Invalid JSON, create new user
    }
  }

  // Create new demo user
  const newUser: QuizUser = {
    id: crypto.randomUUID(),
    email: `demo-${Date.now()}@example.com`,
    name: 'Quiz User',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    language_preference: 'en',
  };

  // Store in localStorage
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

  return newUser;
}

/**
 * Get current user from localStorage
 */
export function getQuizUser(): QuizUser | null {
  if (typeof window === 'undefined') return null;

  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (e) {
    return null;
  }
}

/**
 * Update user information
 */
export function updateQuizUser(updates: Partial<QuizUser>): QuizUser | null {
  const user = getQuizUser();
  if (!user) return null;

  const updatedUser: QuizUser = { ...user, ...updates };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}

/**
 * Clear stored user (for testing/reset)
 */
export function clearQuizUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_STORAGE_KEY);
}

