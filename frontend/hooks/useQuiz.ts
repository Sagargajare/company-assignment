'use client';

import { useEffect, useState } from 'react';
import { useQuizStore } from '@/lib/store/quizStore';
import { fetchQuizSchema, submitQuiz as apiSubmitQuiz, fetchQuizProgress } from '@/lib/api/quiz';

export function useQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    schema,
    currentStep,
    answers,
    userId,
    isStarted,
    isCompleted,
    riskScore,
    setSchema,
    setUserId,
    setCurrentStep,
    setAnswer,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    markAsCompleted,
    setRiskScore,
    resetQuiz,
  } = useQuizStore();

  // Load quiz schema
  const loadSchema = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const questions = await fetchQuizSchema();
      setSchema(questions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load quiz';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load user progress
  const loadProgress = async (userId: string) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const progress = await fetchQuizProgress(userId);
      
      // Restore progress to store
      setUserId(userId);
      
      if (progress.data.last_completed_question) {
        // Find the index of the next question
        const nextQuestionIndex = schema.findIndex(
          (q) => q.question_id === progress.data.next_question?.question_id
        );
        
        if (nextQuestionIndex >= 0) {
          setCurrentStep(nextQuestionIndex);
        }
      }

      if (progress.data.is_completed) {
        markAsCompleted();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load progress';
      setError(message);
      console.error('Failed to load quiz progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit quiz
  const submit = async () => {
    if (!userId) {
      throw new Error('User ID is required to submit quiz');
    }

    setIsLoading(true);
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
      setIsLoading(false);
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
    isStarted,
    isCompleted,
    riskScore,
    isLoading,
    error,

    // Computed
    canGoNext,
    canGoPrevious,
    totalQuestions: schema.length,
    answeredQuestions: Object.keys(answers).length,
    getCurrentAnswer,

    // Actions
    loadSchema,
    loadProgress,
    setUserId,
    setAnswer,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    submit,
    resetQuiz,
  };
}

