'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookingContainer } from '@/components/booking';
import { useQuizStore } from '@/lib/store';

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId, riskScore } = useQuizStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Get user timezone and language from URL params or store
  const userTimezone = searchParams.get('timezone') || undefined;
  const language = searchParams.get('language') || undefined;

  // Wait for store to hydrate from localStorage
  useEffect(() => {
    Promise.resolve().then(() => setIsHydrated(true));
  }, []);

  // Only redirect after hydration is complete
  useEffect(() => {
    if (isHydrated && (!userId || riskScore === null)) {
      router.push('/quiz');
    }
  }, [isHydrated, userId, riskScore, router]);

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

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}

