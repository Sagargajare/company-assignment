/**
 * useTranslation Hook
 * Provides translation function based on user's language preference
 */

import { useMemo } from 'react';
import { getTranslations, type Translations } from '@/lib/i18n/translations';

export type Language = 'en' | 'hi';

/**
 * Locale configuration for each supported language
 */
const LOCALE_CONFIG: Record<Language, {
  locale: string;
  use12HourTime: boolean;
  pluralizationRules: 'en' | 'hi';
}> = {
  en: {
    locale: 'en-US',
    use12HourTime: true,
    pluralizationRules: 'en',
  },
  hi: {
    locale: 'hi-IN',
    use12HourTime: false,
    pluralizationRules: 'hi',
  },
};

/**
 * Hook to get translations for the current language
 * @param language User's language preference ('en' or 'hi')
 * @returns Translation object and helper functions
 */
export function useTranslation(language: Language = 'en') {
  const config = useMemo(() => LOCALE_CONFIG[language] || LOCALE_CONFIG.en, [language]);

  const t = useMemo(() => {
    return getTranslations(language);
  }, [language]);

  /**
   * Get locale string for date/time formatting
   */
  const locale = config.locale;

  /**
   * Format date with localization
   */
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, options);
  };

  /**
   * Format time with localization
   */
  const formatTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: config.use12HourTime,
      ...options,
    };
    return dateObj.toLocaleTimeString(locale, defaultOptions);
  };

  /**
   * Format date and time together
   */
  const formatDateTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: config.use12HourTime,
      ...options,
    };
    return dateObj.toLocaleString(locale, defaultOptions);
  };

  /**
   * Helper for pluralization (English adds 's', Hindi doesn't)
   */
  const pluralize = (count: number, singular: string) => {
    if (config.pluralizationRules === 'en') {
      return count !== 1 ? `${singular}s` : singular;
    }
    // Hindi doesn't add 's' for pluralization
    return singular;
  };

  return {
    t,
    language,
    locale,
    formatDate,
    formatTime,
    formatDateTime,
    pluralize,
  };
}

export type { Translations };

