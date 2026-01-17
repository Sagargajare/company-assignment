import Link from "next/link";

export default function Home() {
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
          <Link
            href="/quiz"
            className="block p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-500 hover:border-blue-600"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Start Quiz
              </h2>
              <p className="text-gray-600">
                Take the hair test quiz to assess your needs and get matched with a coach.
              </p>
            </div>
          </Link>

          <div className="p-8 bg-white rounded-lg shadow-md border-2 border-gray-200 opacity-50">
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
        </div>
      </main>
    </div>
  );
}
