import { Link, useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/store';
import { useBookingStore } from '@/lib/store/bookingStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { userId, riskScore, isCompleted, resetQuiz } = useQuizStore();
  const { currentBooking, resetBooking } = useBookingStore();
  const canBook = userId && riskScore !== null;
  
  const handleStartQuiz = () => {
    // If quiz is completed, allow user to start fresh
    if (isCompleted) {
      const shouldReset = window.confirm('You have already completed the quiz. Do you want to start over?');
      if (shouldReset) {
        resetQuiz();
      }
    }
    navigate('/quiz');
  };
  
  const handleResetAll = () => {
    if (window.confirm('This will clear all your data (quiz answers and bookings). Continue?')) {
      resetQuiz();
      resetBooking();
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-16 px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Clinical Onboarding Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Hair Test Quiz and Coach Booking System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            onClick={handleStartQuiz}
            className="block p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-500 hover:border-blue-600"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
              </h2>
              <p className="text-gray-600">
                Take the hair test quiz to assess your needs and get matched with a coach.
                {isCompleted && <><br /><span className="text-sm text-blue-600">Already completed - Click to retake</span></>}
              </p>
            </div>
          </button>

          {canBook ? (
            <Link
              to="/booking"
              className="block p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-green-500 hover:border-green-600"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">📅</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Book Appointment
                </h2>
                <p className="text-gray-600">
                  Select a time slot with your matched coach.
                  <br />
                  <span className="text-sm text-green-600 font-semibold">✓ Quiz completed</span>
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-8 bg-white rounded-lg shadow-md border-2 border-gray-200 opacity-50 cursor-not-allowed">
              <div className="text-center">
                <div className="text-5xl mb-4">📅</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Book Appointment
                </h2>
                <p className="text-gray-600">
                  Select a time slot with your matched coach.
                  <br />
                  <span className="text-sm text-gray-500">(Complete quiz first)</span>
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Debug/Reset button - only show if there's data */}
        {(userId || currentBooking) && (
          <div className="mt-8 text-center">
            <button
              onClick={handleResetAll}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Reset All Data (Clear Quiz & Booking)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

