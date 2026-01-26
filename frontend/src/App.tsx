import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initWebVitals } from '@/lib/performance/webVitals';

// Lazy load routes for better code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  // Initialize Web Vitals monitoring on mount
  useEffect(() => {
    initWebVitals();
  }, []);

  return (
    <div className="antialiased bg-pattern">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

