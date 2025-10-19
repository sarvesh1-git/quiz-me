import { NextResponse } from 'next/server';
import { getTodayQuiz, hasCompletedTodayQuiz } from '@/lib/db';

export async function GET() {
  try {
    const quiz = await getTodayQuiz();
    const completed = await hasCompletedTodayQuiz();

    return NextResponse.json({
      hasQuiz: quiz !== null,
      isCompleted: completed,
      canTakeQuiz: quiz !== null && !completed,
    });
  } catch (error) {
    console.error('Error checking quiz status:', error);
    return NextResponse.json(
      { error: 'Failed to check quiz status' },
      { status: 500 }
    );
  }
}
