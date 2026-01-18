import { QuizContainer } from '@/components/quiz';

export default function QuizPage() {
  // For now, we'll use a dummy user ID
  // In production, this would come from auth context or session
  const userId = import.meta.env.VITE_DEMO_USER_ID || undefined;

  return (
    <div>
      <QuizContainer userId={userId} />
    </div>
  );
}

