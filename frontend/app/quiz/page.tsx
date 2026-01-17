import QuizContainer from '@/components/quiz/QuizContainer';

// This is a server component that can fetch initial data
export default function QuizPage() {
  // For now, we'll use a dummy user ID
  // In production, this would come from auth context or session
  const userId = process.env.NEXT_PUBLIC_DEMO_USER_ID || undefined;

  return (
    <div>
      <QuizContainer userId={userId} />
    </div>
  );
}

