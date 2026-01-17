// Timezone constants

export interface TimezoneOption {
  value: string;
  label: string;
}

/**
 * Common timezones list for user selection
 */
export const TIMEZONES: TimezoneOption[] = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'America/Toronto', label: 'Toronto, Canada' },
  { value: 'America/Vancouver', label: 'Vancouver, Canada' },
  { value: 'America/Mexico_City', label: 'Mexico City, Mexico' },
  { value: 'America/Sao_Paulo', label: 'São Paulo, Brazil' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires, Argentina' },
  { value: 'Europe/London', label: 'London, UK (GMT)' },
  { value: 'Europe/Paris', label: 'Paris, France (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin, Germany (CET)' },
  { value: 'Europe/Rome', label: 'Rome, Italy (CET)' },
  { value: 'Europe/Madrid', label: 'Madrid, Spain (CET)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam, Netherlands (CET)' },
  { value: 'Europe/Stockholm', label: 'Stockholm, Sweden (CET)' },
  { value: 'Europe/Zurich', label: 'Zurich, Switzerland (CET)' },
  { value: 'Europe/Vienna', label: 'Vienna, Austria (CET)' },
  { value: 'Europe/Athens', label: 'Athens, Greece (EET)' },
  { value: 'Europe/Moscow', label: 'Moscow, Russia (MSK)' },
  { value: 'Asia/Dubai', label: 'Dubai, UAE (GST)' },
  { value: 'Asia/Karachi', label: 'Karachi, Pakistan (PKT)' },
  { value: 'Asia/Kolkata', label: 'Mumbai, Delhi, Kolkata (IST)' },
  { value: 'Asia/Dhaka', label: 'Dhaka, Bangladesh (BST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok, Thailand (ICT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Shanghai', label: 'Shanghai, Beijing (CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo, Japan (JST)' },
  { value: 'Asia/Seoul', label: 'Seoul, South Korea (KST)' },
  { value: 'Asia/Jakarta', label: 'Jakarta, Indonesia (WIB)' },
  { value: 'Australia/Sydney', label: 'Sydney, Australia (AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne, Australia (AEDT)' },
  { value: 'Australia/Brisbane', label: 'Brisbane, Australia (AEST)' },
  { value: 'Australia/Perth', label: 'Perth, Australia (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland, New Zealand (NZDT)' },
  { value: 'Africa/Cairo', label: 'Cairo, Egypt (EET)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg, South Africa (SAST)' },
  { value: 'Africa/Lagos', label: 'Lagos, Nigeria (WAT)' },
];

/**
 * Get browser's detected timezone
 */
export function getBrowserTimezone(): string {
  if (typeof window === 'undefined') return 'UTC';
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

/**
 * Get timezones list with browser timezone included if not already present
 */
export function getTimezonesWithBrowser(): TimezoneOption[] {
  const browserTimezone = getBrowserTimezone();
  const timezones = [...TIMEZONES];
  
  const browserTzExists = TIMEZONES.some(tz => tz.value === browserTimezone);
  if (!browserTzExists && browserTimezone !== 'UTC') {
    timezones.unshift({
      value: browserTimezone,
      label: `${browserTimezone} (Detected)`,
    });
  }
  
  return timezones;
}

