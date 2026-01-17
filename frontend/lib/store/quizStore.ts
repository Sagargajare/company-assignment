// quizStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface QuizQuestion {
  id: string;
  question_id: string;
  question_text: string;
  question_type: string;
  branching_rules?: Record<string, unknown> | null;
  options?: Array<{ value: string; label: string }> | null;
  order_index: number;
}

export interface QuizAnswer {
  question_id: string;
  answer: string | string[] | number;
}

export interface QuizState {
  // Schema
  schema: QuizQuestion[];
  
  // Progress
  currentStep: number; // Index in schema array
  answers: Record<string, QuizAnswer>; // question_id -> answer mapping
  
  // Status
  isStarted: boolean;
  isCompleted: boolean;
  
  // Risk score (after submission)
  riskScore: number | null;
  
  // User ID
  userId: string | null;
  
  // Actions
  setSchema: (schema: QuizQuestion[]) => void;
  setUserId: (userId: string) => void;
  setCurrentStep: (step: number) => void;
  setAnswer: (questionId: string, answer: string | string[] | number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  markAsCompleted: () => void;
  setRiskScore: (score: number) => void;
  resetQuiz: () => void;
}

const initialState = {
  schema: [],
  currentStep: 0,
  answers: {},
  isStarted: false,
  isCompleted: false,
  riskScore: null,
  userId: null,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSchema: (schema) => {
        set({ schema, isStarted: true });
      },

      setUserId: (userId) => {
        set({ userId });
      },

      setCurrentStep: (step) => {
        const { schema } = get();
        const maxStep = schema.length - 1;
        const validStep = Math.max(0, Math.min(step, maxStep));
        set({ currentStep: validStep });
      },

      setAnswer: (questionId, answer) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: { question_id: questionId, answer },
          },
        }));
      },

      goToNextStep: () => {
        const { currentStep, schema } = get();
        const maxStep = schema.length - 1;
        if (currentStep < maxStep) {
          set({ currentStep: currentStep + 1 });
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      goToStep: (step) => {
        const { schema } = get();
        const maxStep = schema.length - 1;
        const validStep = Math.max(0, Math.min(step, maxStep));
        set({ currentStep: validStep });
      },

      markAsCompleted: () => {
        set({ isCompleted: true });
      },

      setRiskScore: (score) => {
        set({ riskScore: score });
      },

      resetQuiz: () => {
        set(initialState);
      },
    }),
    {
      name: 'quiz-storage', // localStorage key
      // Only persist essential data, not the full schema
      partialize: (state) => ({
        answers: state.answers,
        currentStep: state.currentStep,
        isStarted: state.isStarted,
        isCompleted: state.isCompleted,
        riskScore: state.riskScore,
        userId: state.userId,
      }),
    }
  )
);

