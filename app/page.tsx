'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brain, Trophy, Clock, Sparkles, BookOpen } from 'lucide-react';

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [hasQuizToday, setHasQuizToday] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    checkTodayQuiz();
  }, []);

  const checkTodayQuiz = async () => {
    try {
      const response = await fetch('/api/quiz-status');
      if (response.ok) {
        const data = await response.json();
        setHasQuizToday(data.hasQuiz);
        setIsCompleted(data.isCompleted);
      }
    } catch (error) {
      console.error('Error checking today quiz:', error);
      setHasQuizToday(false);
      setIsCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl md:text-8xl mb-4 animate-bounce">🎯</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">
              Quiz Me!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-semibold">
              {greeting}! Ready to learn something new?
            </p>
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Start Quiz Card */}
            <Link
              href="/quiz"
              className={`group relative overflow-hidden rounded-2xl p-8 text-white hover:scale-105 transition-transform ${
                loading || !hasQuizToday || isCompleted
                  ? 'opacity-50 pointer-events-none bg-gradient-to-br from-gray-400 to-gray-500'
                  : 'bg-gradient-to-br from-green-400 to-emerald-500'
              }`}
            >
              <div className="relative z-10">
                <Brain className="mb-4" size={48} />
                <h2 className="text-2xl font-bold mb-2">
                  {isCompleted ? 'Quiz Completed! ✅' : 'Start Quiz'}
                </h2>
                <p className={isCompleted ? 'text-gray-100' : 'text-green-50'}>
                  {loading
                    ? 'Loading...'
                    : isCompleted
                    ? "You've already completed today's quiz!"
                    : hasQuizToday
                    ? "Today's quiz is ready!"
                    : 'No quiz available today'}
                </p>
              </div>
              <Sparkles
                className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity"
                size={32}
              />
            </Link>

            {/* View Results Card */}
            <Link
              href="/results"
              className="group relative overflow-hidden bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-8 text-white hover:scale-105 transition-transform"
            >
              <div className="relative z-10">
                <Trophy className="mb-4" size={48} />
                <h2 className="text-2xl font-bold mb-2">My Progress</h2>
                <p className="text-blue-50">See your scores and history</p>
              </div>
              <Clock
                className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity"
                size={32}
              />
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="font-semibold text-gray-700">Timed Quizzes</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-gray-700">Track Progress</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-semibold text-gray-700">Fun Learning</p>
            </div>
          </div>

          {/* Admin Link */}
          <div className="text-center">
            <Link
              href="/admin/add-quiz"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors"
            >
              <BookOpen size={20} />
              Add New Quiz (Admin)
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white">
          <p className="text-sm font-semibold drop-shadow-lg">
            Made with ❤️ for curious minds
          </p>
        </div>
      </div>
    </div>
  );
}
