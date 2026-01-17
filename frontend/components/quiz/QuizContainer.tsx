'use client';

import { useEffect } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import QuizStep from './QuizStep';

interface QuizContainerProps {
  userId?: string;
}

export default function QuizContainer({ userId }: QuizContainerProps) {
  const {
    schema,
    currentQuestion,
    isLoading,
    error,
    isCompleted,
    riskScore,
    loadSchema,
    loadProgress,
    setUserId,
    setAnswer,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
    submit,
    getCurrentAnswer,
  } = useQuiz();

  // Initialize quiz on mount
  useEffect(() => {
    const initQuiz = async () => {
      try {
        // Load schema first
        await loadSchema();

        // If userId provided, load progress
        if (userId) {
          setUserId(userId);
          await loadProgress(userId);
        }
      } catch (err) {
        console.error('Failed to initialize quiz:', err);
      }
    };

    initQuiz();
  }, [userId]);

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

  // Loading state
  if (isLoading && schema.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && schema.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Quiz</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Completed state
  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Quiz Completed!</h2>
          {riskScore !== null && (
            <p className="text-lg text-gray-700 mb-4">
              Your risk score: <span className="font-semibold text-blue-600">{riskScore}</span>
            </p>
          )}
          <p className="text-gray-600">
            You can now proceed to book a consultation with a coach.
          </p>
        </div>
      </div>
    );
  }

  // No question available
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No questions available.</p>
        </div>
      </div>
    );
  }

  // Render current question
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <QuizStep
        question={currentQuestion}
        answer={getCurrentAnswer()}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={goToPreviousStep}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />
    </div>
  );
}

