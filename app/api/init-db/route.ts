import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    
    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully! Tables created.' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: errorMessage,
        hint: 'Check your .env.local file and Vercel Postgres credentials'
      },
      { status: 500 }
    );
  }
}
