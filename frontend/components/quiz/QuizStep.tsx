'use client';

import { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/types';

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
  totalQuestions
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
                className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  localAnswer === option.value
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name={question.question_id}
                  value={option.value}
                  checked={localAnswer === option.value}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className={`ml-4 text-base font-medium ${localAnswer === option.value ? 'text-blue-900' : 'text-gray-700'}`}>
                  {option.label}
                </span>
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
                  className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isChecked
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md transform scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
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
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded"
                  />
                  <span className={`ml-4 text-base font-medium ${isChecked ? 'text-blue-900' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case 'select':
        // Dropdown/select input with options from backend
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
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
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base text-gray-900 font-medium shadow-sm hover:border-blue-400 transition-colors"
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select a value:
              </label>
              <select
                value={typeof localAnswer === 'number' ? localAnswer.toString() : typeof localAnswer === 'string' ? localAnswer : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = Number(value);
                  handleAnswerChange(isNaN(numericValue) ? value : numericValue);
                }}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base text-gray-900 font-medium shadow-sm hover:border-blue-400 transition-colors"
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter a number:
            </label>
            <input
              type="number"
              value={typeof localAnswer === 'number' ? localAnswer : ''}
              onChange={(e) => handleAnswerChange(parseInt(e.target.value, 10) || 0)}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 shadow-sm hover:border-blue-400 transition-colors placeholder:text-gray-500"
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select an option:
              </label>
              <select
                value={typeof localAnswer === 'string' ? localAnswer : typeof localAnswer === 'number' ? localAnswer.toString() : ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base text-gray-900 font-medium shadow-sm hover:border-blue-400 transition-colors"
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter your answer:
            </label>
            <textarea
              value={typeof localAnswer === 'string' ? localAnswer : ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={5}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 shadow-sm hover:border-blue-400 transition-colors resize-none placeholder:text-gray-500"
              placeholder="Type your answer here..."
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl relative overflow-hidden border border-gray-100" style={{ height: '700px' }}>
      {/* Loading Overlay when submitting */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-blue-600 font-semibold text-lg">Submitting your answers...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait</p>
          </div>
        </div>
      )}

      <div className="h-full flex flex-col">
        {/* Header with Progress */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Question {currentStep + 1} of {totalQuestions}
              </span>
            </div>
            <div className="px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-sm font-bold text-blue-700">
                {Math.round(((currentStep + 1) / totalQuestions) * 100)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              {question.question_text}
            </h2>
          </div>

          {/* Answer Input */}
          <div className="mb-6">
            {renderInput()}
          </div>
        </div>

        {/* Navigation - Fixed at bottom */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious || isSubmitting}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              canGoPrevious && !isSubmitting
                ? 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isAnswerValid() || isSubmitting}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg ${
              isAnswerValid() && !isSubmitting
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>{canGoNext ? 'Next' : 'Submit Quiz'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

