import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/lib/store/bookingStore';
import { useTranslation, type Language } from '@/hooks';
import type { Booking } from '@/lib/store/bookingStore';

interface BookingConfirmationProps {
  booking: Booking;
  language?: Language;
}

export default function BookingConfirmation({ booking, language = 'en' }: BookingConfirmationProps) {
  const navigate = useNavigate();
  const { resetBooking } = useBookingStore();
  const { t, formatDateTime } = useTranslation(language);

  if (!booking.slot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-gray-600">{t.loading}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Success Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <div className="text-center">
            <div className="text-7xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">{t.bookingConfirmed}</h2>
            <p className="text-gray-600">{t.consultationScheduled}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-8 space-y-6">
          <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.bookingDetails}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">{t.dateTime}:</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatDateTime(booking.slot.start_time_user_tz || booking.slot.start_time)}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">{t.coachName}:</span>
                <span className="text-sm font-semibold text-blue-600 text-right">
                  {booking.slot.coach_name}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">{t.status}:</span>
                <span className="text-sm font-semibold text-green-600 text-right capitalize">
                  {t.confirmed}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">Booking ID:</span>
                <span className="text-sm font-mono text-gray-700 text-right">
                  {booking.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">{t.whatsNext}</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t.receiveEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t.prepareQuestions}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t.joinOnTime}</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              {t.backToHome}
            </button>
            <button
              onClick={() => {
                // Reset booking state and navigate to booking page with language
                resetBooking();
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                navigate(`/booking?timezone=${encodeURIComponent(timezone)}&language=${language}`);
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              {t.bookAnother}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

