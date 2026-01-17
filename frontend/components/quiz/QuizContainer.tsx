'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/hooks';
import { QuizStep, UserForm } from './index';
import type { UserFormData } from '@/types';
import { createUser } from '@/lib/api';

interface QuizContainerProps {
  userId?: string;
}

export default function QuizContainer({ userId }: QuizContainerProps) {
  const router = useRouter();
  const {
    schema,
    currentStep,
    currentQuestion,
    isLoadingSchema,
    isSubmitting,
    error,
    isCompleted,
    riskScore,
    userId: storeUserId,
    loadSchema,
    setUserId,
    setAnswer,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
    submit,
    getCurrentAnswer,
    resetQuiz,
  } = useQuiz();

  const [showUserForm, setShowUserForm] = useState(!userId && !storeUserId);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // Initialize quiz on mount (only if user exists)
  useEffect(() => {
    if (userId || storeUserId) {
      const initQuiz = async () => {
        try {
          await loadSchema();
        } catch (err) {
          console.error('Failed to initialize quiz:', err);
        }
      };
      initQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, storeUserId]);

  const handleUserSubmit = async (formData: UserFormData) => {
    setIsCreatingUser(true);
    setUserError(null);
    try {
      const user = await createUser(formData);
      
      // Only clear quiz progress if this is a different user
      // If it's the same user (same ID), preserve their progress
      if (storeUserId && storeUserId !== user.id) {
        // Different user - clear progress
        resetQuiz();
      } else if (!storeUserId) {
        // No previous user - clear any stale progress
        resetQuiz();
      }
      // If storeUserId === user.id, don't reset (same user continues)
      
      // Set user ID
      setUserId(user.id);
      setShowUserForm(false);
      
      // Load schema after user is created
      await loadSchema();
    } catch (err) {
      setUserError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleAnswer = (answer: string | string[] | number) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.question_id, answer);
  };

  const handleNext = async () => {
    if (!canGoNext) {
      // Submit quiz if this is the last question
      try {
        await submit();
      } catch (err) {
        console.error('Failed to submit quiz:', err);
      }
      return;
    }
    goToNextStep();
  };

  // Show user form if no user exists
  if (showUserForm) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center">
        <UserForm onSubmit={handleUserSubmit} isLoading={isCreatingUser} error={userError} />
      </div>
    );
  }

  // Loading state for quiz schema
  if (isLoadingSchema && schema.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>
          <p className="text-gray-700 font-semibold text-xl">Loading questions...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && schema.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white border-2 border-red-200 rounded-2xl max-w-md shadow-xl">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-800 mb-3">Error Loading Quiz</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Completed state
  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-10 bg-white border-2 border-green-200 rounded-2xl max-w-lg shadow-xl">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Quiz Completed!</h2>
          {riskScore !== null && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <p className="text-sm font-semibold text-gray-600 mb-1">Your Risk Score</p>
              <p className="text-4xl font-bold text-blue-600">{riskScore}</p>
            </div>
          )}
          <p className="text-gray-600 text-lg mb-6">
            You can now proceed to book a consultation with a coach.
          </p>
          <button
            onClick={() => {
              // Get user timezone from browser
              const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              // Navigate to booking page with timezone parameter
              router.push(`/booking?timezone=${encodeURIComponent(timezone)}`);
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Book Consultation
          </button>
        </div>
      </div>
    );
  }

  // No question available
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-gray-600 text-lg">No questions available.</p>
        </div>
      </div>
    );
  }

  // Render current question
  return (
    <div className="min-h-screen py-12 px-4 flex items-center">
      <QuizStep
        question={currentQuestion}
        answer={getCurrentAnswer()}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={goToPreviousStep}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        isSubmitting={isSubmitting}
        currentStep={currentStep}
        totalQuestions={schema.length}
      />
    </div>
  );
}
