import { sql } from '@vercel/postgres';
import { Quiz, Question, Result } from './types';

export async function initDatabase() {
  try {
    // Create quizzes table (removed UNIQUE constraint on date to allow multiple questions per day)
    await sql`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        question TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        options JSONB,
        correct_answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create results table
    await sql`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        score INTEGER NOT NULL,
        time_taken INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getTodayQuiz(): Promise<Quiz | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { rows } = await sql`
      SELECT * FROM quizzes 
      WHERE date = ${today}
      ORDER BY id
    `;

    if (rows.length === 0) {
      return null;
    }

    const questions: Question[] = rows.map(row => ({
      id: row.id,
      question: row.question,
      type: row.type,
      options: row.options,
      correct_answer: row.correct_answer,
    }));

    return {
      id: rows[0].id,
      date: today,
      questions,
    };
  } catch (error) {
    console.error('Error fetching today quiz:', error);
    throw error;
  }
}

export async function submitQuizResult(
  date: string,
  score: number,
  timeTaken: number,
  totalQuestions: number
): Promise<void> {
  try {
    await sql`
      INSERT INTO results (date, score, time_taken, total_questions)
      VALUES (${date}, ${score}, ${timeTaken}, ${totalQuestions})
    `;
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    throw error;
  }
}

export async function getResults(): Promise<Result[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM results 
      ORDER BY created_at DESC
      LIMIT 30
    `;

    return rows.map(row => ({
      id: row.id,
      date: row.date,
      score: row.score,
      time_taken: row.time_taken,
      total_questions: row.total_questions,
      created_at: row.created_at,
    }));
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
}

export async function addQuiz(
  date: string,
  questions: Omit<Question, 'id'>[]
): Promise<void> {
  try {
    for (const question of questions) {
      await sql`
        INSERT INTO quizzes (date, question, type, options, correct_answer)
        VALUES (
          ${date},
          ${question.question},
          ${question.type},
          ${JSON.stringify(question.options)},
          ${question.correct_answer}
        )
      `;
    }
  } catch (error) {
    console.error('Error adding quiz:', error);
    throw error;
  }
}

export async function hasCompletedTodayQuiz(): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { rows } = await sql`
      SELECT COUNT(*) as count FROM results 
      WHERE date = ${today}
    `;

    return rows[0].count > 0;
  } catch (error) {
    console.error('Error checking today quiz completion:', error);
    return false;
  }
}
