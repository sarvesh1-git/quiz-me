import { NextResponse } from 'next/server';
import { addQuiz } from '@/lib/db';
import { Question } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { date, questions }: { date: string; questions: Omit<Question, 'id'>[] } = 
      await request.json();
    
    if (!date || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Date and questions are required' },
        { status: 400 }
      );
    }
    
    await addQuiz(date, questions);
    
    return NextResponse.json({ 
      success: true,
      message: `Quiz added successfully for ${date}` 
    });
  } catch (error) {
    console.error('Error adding quiz:', error);
    
    // Provide more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to add quiz';
    
    return NextResponse.json(
      { 
        error: 'Failed to add quiz',
        details: errorMessage,
        hint: 'Make sure .env.local is configured with Vercel Postgres credentials'
      },
      { status: 500 }
    );
  }
}
