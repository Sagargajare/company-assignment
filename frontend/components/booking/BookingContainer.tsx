import { useEffect, useState, useRef } from 'react';
import { useBooking } from '@/hooks';
import { useTranslation, type Language } from '@/hooks';
import { BookingCalendar, BookingConfirmation } from './index';

interface BookingContainerProps {
  userId: string;
  riskScore: number;
  userTimezone?: string;
  language?: Language;
}

export default function BookingContainer({
  userId,
  riskScore,
  userTimezone,
  language = 'en',
}: BookingContainerProps) {
  const {
    availableSlots,
    slotsGroupedByDate,
    selectedSlot,
    currentBooking,
    isLoadingCoaches,
    isLoadingSlots,
    isBooking,
    coachesError,
    slotsError,
    bookingError,
    initializeBooking,
    setSelectedSlot,
    bookSelectedSlot,
  } = useBooking();

  const { t, formatDateTime } = useTranslation(language);

  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (hasInitializedRef.current) {
      return;
    }

    const init = async () => {
      hasInitializedRef.current = true;
      try {
        setInitError(null);
        await initializeBooking(riskScore, language, userTimezone);
        setIsInitialized(true);
      } catch (err) {
        setInitError(err instanceof Error ? err.message : 'Failed to initialize booking');
        hasInitializedRef.current = false; // Allow retry on error
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show booking confirmation if booking is successful
  if (currentBooking) {
    return <BookingConfirmation booking={currentBooking} language={language} />;
  }

  // Show initialization error
  if (initError || coachesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white border-2 border-red-200 rounded-2xl max-w-md shadow-xl">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-800 mb-3">{t.error}</h3>
          <p className="text-red-600 mb-4">{initError || coachesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!isInitialized || isLoadingCoaches || isLoadingSlots) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>
          <p className="text-gray-700 font-semibold text-xl">{t.loadingSlots}</p>
          <p className="text-gray-500 text-sm mt-2">{t.pleasewait}</p>
        </div>
      </div>
    );
  }

  const handleBookSlot = async () => {
    if (!selectedSlot) {
      return;
    }

    try {
      await bookSelectedSlot(userId, riskScore);
    } catch (err) {
      console.error('Failed to book slot:', err);
      // Error is already set in the store
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.bookYourConsultation}</h1>
          <p className="text-gray-600 text-lg">
            {t.selectAvailableSlot}
          </p>
        </div>

        {/* Error Message */}
        {(slotsError || bookingError) && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-800 font-medium">{slotsError || bookingError}</p>
          </div>
        )}

        {/* Calendar */}
        <BookingCalendar
          slots={availableSlots}
          slotsGroupedByDate={slotsGroupedByDate}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          isLoading={isLoadingSlots}
          error={slotsError}
          language={language}
        />

        {/* Booking Button */}
        {selectedSlot && (
          <div className="mt-8 mb-6 sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 rounded-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.selectedSlot}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDateTime(selectedSlot.start_time_user_tz || selectedSlot.start_time)}
                </p>
                <p className="text-sm text-gray-500">{t.coach}: {selectedSlot.coach_name}</p>
              </div>
              <button
                onClick={handleBookSlot}
                disabled={isBooking}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg ${
                  isBooking
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                }`}
              >
                {isBooking && (
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                )}
                <span className="text-lg">{isBooking ? t.booking : t.confirmBooking}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

