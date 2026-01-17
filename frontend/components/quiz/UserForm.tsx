'use client';

import { useState, useEffect, startTransition } from 'react';
import type { UserFormData } from '@/types';
import { getBrowserTimezone, getTimezonesWithBrowser, TIMEZONES } from '@/constants';

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export type { UserFormData };

export default function UserForm({ onSubmit, isLoading = false, error }: UserFormProps) {
  // Initialize with UTC to ensure server and client match (prevents hydration error)
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    timezone: 'UTC',
    language_preference: 'en',
  });

  // Initialize with default values that match server render
  const [timezoneState, setTimezoneState] = useState({
    timezones: TIMEZONES,
    browserTimezone: 'UTC',
  });

  const [localError, setLocalError] = useState<string | null>(null);

  // Update timezone on client side only (after hydration)
  // This is necessary to avoid hydration mismatch - server renders with UTC,
  // then client updates to actual browser timezone after mount
  useEffect(() => {
    const detectedTimezone = getBrowserTimezone();
    const timezones = getTimezonesWithBrowser();
    
    // Use startTransition to mark this as a non-urgent update
    // This pattern is necessary to prevent hydration errors when using browser APIs
    startTransition(() => {
      setTimezoneState({
        timezones,
        browserTimezone: detectedTimezone,
      });
      setFormData(prev => ({ ...prev, timezone: detectedTimezone }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Basic validation
    if (!formData.email || !formData.name) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl relative overflow-hidden border border-gray-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-blue-600 font-semibold text-lg">Creating your account...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait</p>
          </div>
        </div>
      )}

      <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Get Started
        </h2>
        <p className="text-gray-600 text-base">
          Please provide your information to begin the quiz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 shadow-sm hover:border-blue-400 transition-colors placeholder:text-gray-500"
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 shadow-sm hover:border-blue-400 transition-colors placeholder:text-gray-500"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        {/* Timezone Field */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-semibold text-gray-700 mb-2">
            Timezone
          </label>
          <select
            id="timezone"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 font-medium shadow-sm hover:border-blue-400 transition-colors"
            disabled={isLoading}
          >
            {timezoneState.timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Default: Automatically detected from your browser ({timezoneState.browserTimezone})
          </p>
        </div>

        {/* Language Preference */}
        <div>
          <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
            Language Preference
          </label>
          <select
            id="language"
            value={formData.language_preference}
            onChange={(e) =>
              setFormData({ ...formData, language_preference: e.target.value as 'en' | 'hi' })
            }
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 font-medium shadow-sm hover:border-blue-400 transition-colors"
            disabled={isLoading}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-800">{error || localError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
          }`}
        >
          {isLoading && (
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          )}
          <span className="text-lg">{isLoading ? 'Creating Account...' : 'Start Quiz'}</span>
        </button>
      </form>
    </div>
  );
}

