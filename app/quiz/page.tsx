'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  type: 'radio' | 'checkbox' | 'text' | 'dropdown';
  options: string[] | null;
}

interface Quiz {
  id: number;
  date: string;
  questions: Question[];
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  results: Array<{
    questionId: number;
    question: string;
    userAnswer: string | string[];
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

export default function QuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (!quiz || result) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, result]);

  const fetchQuiz = async () => {
    try {
      // First check if quiz is already completed
      const statusResponse = await fetch('/api/quiz-status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.isCompleted) {
          setAlreadyCompleted(true);
          setLoading(false);
          return;
        }
      }

      // Fetch the quiz
      const response = await fetch('/api/quiz');
      if (!response.ok) {
        throw new Error('No quiz available for today');
      }
      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter((o) => o !== option) };
      }
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unanswered = quiz.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      alert('Please answer all questions before submitting!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: quiz.date,
          answers,
          time_taken: timeElapsed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const resultData = await response.json();
      setResult(resultData);

      // Show confetti for perfect score
      if (resultData.score === resultData.totalQuestions) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400">
        <div className="text-white text-2xl font-bold animate-pulse">Loading quiz...</div>
      </div>
    );
  }

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Already Completed!</h1>
          <p className="text-gray-600 mb-6">
            You've already completed today's quiz. Come back tomorrow for a new challenge!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Go Home
            </button>
            <button
              onClick={() => router.push('/results')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    const percentage = (result.score / result.totalQuestions) * 100;
    const emoji = percentage === 100 ? '🎉' : percentage >= 70 ? '😊' : percentage >= 50 ? '😐' : '😢';

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{emoji}</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
              <div className="text-6xl font-bold text-purple-600 mb-2">
                {result.score}/{result.totalQuestions}
              </div>
              <p className="text-xl text-gray-600">
                Time: {formatTime(result.timeTaken)}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {result.results.map((r, index) => (
                <div
                  key={r.questionId}
                  className={`p-4 rounded-xl border-2 ${
                    r.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {r.isCorrect ? (
                      <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    ) : (
                      <XCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">
                        {index + 1}. {r.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Your answer:</span>{' '}
                        {Array.isArray(r.userAnswer) ? r.userAnswer.join(', ') : r.userAnswer}
                      </p>
                      {!r.isCorrect && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Correct answer:</span> {r.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Go Home
              </button>
              <button
                onClick={() => router.push('/results')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Today&apos;s Quiz! 🎯</h1>
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
              <Clock className="text-purple-600" size={20} />
              <span className="font-bold text-purple-600">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {index + 1}. {question.question}
                </h3>

                {question.type === 'radio' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-purple-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-5 h-5 text-purple-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'checkbox' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-purple-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={((answers[question.id] as string[]) || []).includes(option)}
                          onChange={(e) =>
                            handleCheckboxChange(question.id, option, e.target.checked)
                          }
                          className="w-5 h-5 text-purple-600 rounded"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'text' && (
                  <input
                    type="text"
                    value={(answers[question.id] as string) || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700"
                    placeholder="Type your answer here..."
                  />
                )}

                {question.type === 'dropdown' && question.options && (
                  <select
                    value={(answers[question.id] as string) || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700 bg-white"
                  >
                    <option value="">Select an answer...</option>
                    {question.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
}
