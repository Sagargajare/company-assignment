import { useState } from 'react';
import { useQuizStore } from '@/lib/store';
import { fetchQuizSchema, submitQuiz as apiSubmitQuiz } from '@/lib/api';

export function useQuiz() {
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    schema,
    currentStep,
    answers,
    userId,
    language,
    isStarted,
    isCompleted,
    riskScore,
    setSchema,
    setUserId,
    setLanguage,
    setAnswer,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    markAsCompleted,
    setRiskScore,
    resetQuiz,
  } = useQuizStore();

  // Load quiz schema with language
  const loadSchema = async () => {
    setIsLoadingSchema(true);
    setError(null);
    try {
      const questions = await fetchQuizSchema(language);
      setSchema(questions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load quiz';
      setError(message);
      throw err;
    } finally {
      setIsLoadingSchema(false);
    }
  };

  // Note: Progress is maintained in Zustand store with localStorage persistence
  // No need to fetch from backend - progress is automatically restored from localStorage

  // Submit quiz
  const submit = async () => {

    if (!userId) {
      throw new Error('User ID is required to submit quiz');
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const responses = Object.values(answers);
      const response = await apiSubmitQuiz({
        user_id: userId,
        responses,
      });

      setRiskScore(response.data.risk_score);
      markAsCompleted();


      return response.data.risk_score;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current question
  const currentQuestion = schema[currentStep] || null;

  // Check if can go to next step
  const canGoNext = currentStep < schema.length - 1;
  const canGoPrevious = currentStep > 0;

  // Get answer for current question
  const getCurrentAnswer = () => {
    if (!currentQuestion) return undefined;
    return answers[currentQuestion.question_id]?.answer;
  };

  return {
    // State
    schema,
    currentStep,
    currentQuestion,
    answers,
    userId,
    language,
    isStarted,
    isCompleted,
    riskScore,
    isLoadingSchema,
    isSubmitting,
    error,

    // Computed
    canGoNext,
    canGoPrevious,
    totalQuestions: schema.length,
    answeredQuestions: Object.keys(answers).length,
    getCurrentAnswer,

    // Actions
    loadSchema,
    setUserId,
    setLanguage,
    setAnswer,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    submit,
    resetQuiz,
  };
}

