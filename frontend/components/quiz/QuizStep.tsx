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
  currentStep: number;
  totalQuestions: number;
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
  currentStep,
  totalQuestions,
}: QuizStepProps) {
  const [localAnswer, setLocalAnswer] = useState<string | string[] | number | undefined>(answer);

  // Sync local answer with prop answer when question changes
  useEffect(() => {
    if (answer !== localAnswer) {
      setLocalAnswer(answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const options = question.options || undefined;
    const questionsRequiringOptions = ['radio', 'checkbox', 'select'];

    // Validate options for question types that require them
    if (questionsRequiringOptions.includes(question.question_type)) {
      if (!options || !Array.isArray(options) || options.length === 0) {
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm font-medium mb-1">Error: Missing Options</p>
            <p className="text-red-600 text-sm">
              This question requires options but none were provided. Please contact support.
            </p>
          </div>
        );
      }
    }

    switch (question.question_type) {
      case 'radio':
        return (
          <div className="space-y-3">
            {options!.map((option: { value: string; label: string }) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  localAnswer === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={question.question_id}
                  value={option.value}
                  checked={localAnswer === option.value}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-3 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const selectedValues = Array.isArray(localAnswer) ? localAnswer : [];
        return (
          <div className="space-y-3">
            {options!.map((option: { value: string; label: string }) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    isChecked
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    name={question.question_id}
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v) => v !== option.value);
                      handleAnswerChange(newValues);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded"
                  />
                  <span className="ml-3 text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        );

      case 'select':
        // Dropdown/select input with options from backend
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select an option:
            </label>
            <select
              value={typeof localAnswer === 'string' ? localAnswer : typeof localAnswer === 'number' ? localAnswer.toString() : ''}
              onChange={(e) => {
                // Try to parse as number if all option values are numeric
                const value = e.target.value;
                const numericValue = Number(value);
                handleAnswerChange(isNaN(numericValue) || value !== numericValue.toString() ? value : numericValue);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">-- Select an option --</option>
              {options!.map((option: { value: string; label: string }) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'number':
        // If options provided, render as dropdown; otherwise free-form number input
        if (options && options.length > 0) {
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a value:
              </label>
              <select
                value={typeof localAnswer === 'number' ? localAnswer.toString() : typeof localAnswer === 'string' ? localAnswer : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = Number(value);
                  handleAnswerChange(isNaN(numericValue) ? value : numericValue);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">-- Select a value --</option>
                {options.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        // Free-form number input
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
        // If options provided, render as dropdown; otherwise free-form textarea
        if (options && options.length > 0) {
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select an option:
              </label>
              <select
                value={typeof localAnswer === 'string' ? localAnswer : typeof localAnswer === 'number' ? localAnswer.toString() : ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">-- Select an option --</option>
                {options.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        // Free-form textarea
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
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentStep + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {question.question_text}
        </h2>
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

