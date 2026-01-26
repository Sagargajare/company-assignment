import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookingContainer } from '@/components/booking';
import { useQuizStore } from '@/lib/store';

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userId, riskScore, language: storeLanguage } = useQuizStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Get user timezone and language from URL params or fallback to store
  const userTimezone = searchParams.get('timezone') || undefined;
  const language = searchParams.get('language') || storeLanguage || 'en';

  // Wait for store to hydrate from localStorage
  useEffect(() => {
    Promise.resolve().then(() => setIsHydrated(true));
  }, []);

  // Only redirect after hydration is complete
  useEffect(() => {
    if (isHydrated && (!userId || riskScore === null)) {
      navigate('/quiz');
    }
  }, [isHydrated, userId, riskScore, navigate]);

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // After hydration, check if we need to redirect
  if (!userId || riskScore === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <BookingContainer
      userId={userId}
      riskScore={riskScore}
      userTimezone={userTimezone}
      language={language}
    />
  );
}

