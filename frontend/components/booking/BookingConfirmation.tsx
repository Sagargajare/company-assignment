'use client';

import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/store/bookingStore';
import type { Booking } from '@/lib/store/bookingStore';

interface BookingConfirmationProps {
  booking: Booking;
}

export default function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const router = useRouter();
  const { resetBooking } = useBookingStore();
  const formatDateTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!booking.slot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-gray-600">Booking information is loading...</p>
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
            <h2 className="text-3xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your consultation has been successfully booked</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-8 space-y-6">
          <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">Date & Time:</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatDateTime(booking.slot.start_time_user_tz || booking.slot.start_time)}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">Coach:</span>
                <span className="text-sm font-semibold text-blue-600 text-right">
                  {booking.slot.coach_name}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className="text-sm font-semibold text-green-600 text-right capitalize">
                  {booking.status}
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
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>You will receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Please join the consultation at the scheduled time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>You can view your booking details anytime</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => {
                // Reset booking state and navigate to booking page
                resetBooking();
                router.push('/booking');
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

