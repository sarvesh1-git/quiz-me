import { NextResponse } from 'next/server';
import { getTodayQuiz, submitQuizResult } from '@/lib/db';
import { QuizSubmission } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const submission: QuizSubmission = await request.json();
    
    // Get today's quiz to validate answers
    const quiz = await getTodayQuiz();
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'No quiz available for today' },
        { status: 404 }
      );
    }
    
    // Calculate score
    let score = 0;
    const results = quiz.questions.map((question) => {
      const userAnswer = submission.answers[question.id];
      let isCorrect = false;
      
      if (question.type === 'checkbox') {
        // For checkbox, compare arrays
        const correctAnswers = question.correct_answer.split(',').sort();
        const userAnswers = Array.isArray(userAnswer) 
          ? userAnswer.sort() 
          : [];
        isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
      } else {
        // For other types, compare strings
        isCorrect = String(userAnswer).toLowerCase().trim() === 
                   question.correct_answer.toLowerCase().trim();
      }
      
      if (isCorrect) {
        score++;
      }
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect,
      };
    });
    
    // Save result to database
    await submitQuizResult(
      submission.date,
      score,
      submission.time_taken,
      quiz.questions.length
    );
    
    return NextResponse.json({
      score,
      totalQuestions: quiz.questions.length,
      timeTaken: submission.time_taken,
      results,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
