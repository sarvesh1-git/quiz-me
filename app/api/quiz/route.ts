import { NextResponse } from 'next/server';
import { getTodayQuiz, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Initialize database if needed
    await initDatabase();
    
    const quiz = await getTodayQuiz();
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'No quiz available for today' },
        { status: 404 }
      );
    }
    
    // Remove correct answers from the response
    const sanitizedQuiz = {
      ...quiz,
      questions: quiz.questions.map(({ correct_answer, ...question }) => question),
    };
    
    return NextResponse.json(sanitizedQuiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
