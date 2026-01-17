'use client';

import { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/lib/store/quizStore';

interface QuizStepProps {
  question: QuizQuestion;
  answer?: string | string[] | number;
  onAnswer: (answer: string | string[] | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isSubmitting?: boolean;
}

export default function QuizStep({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isSubmitting = false,
}: QuizStepProps) {
  const [localAnswer, setLocalAnswer] = useState<string | string[] | number | undefined>(answer);

  useEffect(() => {
    setLocalAnswer(answer);
  }, [answer, question.question_id]);

  const handleAnswerChange = (value: string | string[] | number) => {
    setLocalAnswer(value);
    onAnswer(value);
  };

  const handleSubmit = () => {
    if (localAnswer !== undefined && localAnswer !== '' && (!Array.isArray(localAnswer) || localAnswer.length > 0)) {
      onNext();
    }
  };

  const isAnswerValid = () => {
    if (localAnswer === undefined || localAnswer === '') return false;
    if (Array.isArray(localAnswer) && localAnswer.length === 0) return false;
    return true;
  };

  const renderInput = () => {
    switch (question.question_type) {
      case 'radio':
        // For radio buttons, we need options from somewhere
        // This is a placeholder - in real implementation, options might come from question schema
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select an option:
            </label>
            {/* Radio options would be rendered here based on question data */}
            <input
              type="text"
              value={typeof localAnswer === 'string' ? localAnswer : ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your answer"
            />
          </div>
        );

      case 'checkbox':
        // For checkboxes
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select all that apply:
            </label>
            <input
              type="text"
              value={Array.isArray(localAnswer) ? localAnswer.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map((v) => v.trim()).filter(Boolean);
                handleAnswerChange(values);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter answers separated by commas"
            />
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a number:
            </label>
            <input
              type="number"
              value={typeof localAnswer === 'number' ? localAnswer : ''}
              onChange={(e) => handleAnswerChange(parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a number"
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your answer:
            </label>
            <textarea
              value={typeof localAnswer === 'string' ? localAnswer : ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your answer here..."
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Question */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {question.question_text}
        </h2>
        <p className="text-sm text-gray-500">
          Question {question.order_index + 1}
        </p>
      </div>

      {/* Answer Input */}
      <div className="mb-6">
        {renderInput()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious || isSubmitting}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            canGoPrevious && !isSubmitting
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isAnswerValid() || !canGoNext || isSubmitting}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            isAnswerValid() && canGoNext && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : canGoNext ? 'Next' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}

