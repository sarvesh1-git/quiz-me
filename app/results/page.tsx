'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, Clock, TrendingUp, Home } from 'lucide-react';

interface Result {
  id: number;
  date: string;
  score: number;
  time_taken: number;
  total_questions: number;
  created_at: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const chartData = results
    .slice()
    .reverse()
    .map((result) => ({
      date: formatDate(result.date),
      score: result.score,
      percentage: Math.round((result.score / result.total_questions) * 100),
      time: result.time_taken,
    }));

  const averageScore = results.length > 0
    ? Math.round(
        results.reduce((sum, r) => sum + (r.score / r.total_questions) * 100, 0) / results.length
      )
    : 0;

  const averageTime = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.time_taken, 0) / results.length)
    : 0;

  const bestScore = results.length > 0
    ? Math.max(...results.map((r) => (r.score / r.total_questions) * 100))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400">
        <div className="text-white text-2xl font-bold animate-pulse">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Your Progress 📊</h1>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              <Home size={20} />
              Home
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No quizzes completed yet!</h2>
              <p className="text-gray-600 mb-6">Take your first quiz to see your progress here.</p>
              <button
                onClick={() => router.push('/quiz')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy size={32} />
                    <h3 className="text-lg font-semibold">Best Score</h3>
                  </div>
                  <p className="text-4xl font-bold">{Math.round(bestScore)}%</p>
                </div>

                <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={32} />
                    <h3 className="text-lg font-semibold">Average Score</h3>
                  </div>
                  <p className="text-4xl font-bold">{averageScore}%</p>
                </div>

                <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={32} />
                    <h3 className="text-lg font-semibold">Avg Time</h3>
                  </div>
                  <p className="text-4xl font-bold">{formatTime(averageTime)}</p>
                </div>
              </div>

              {/* Score Chart */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Score Trend</h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #a855f7',
                          borderRadius: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#a855f7"
                        strokeWidth={3}
                        dot={{ fill: '#a855f7', r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Time Chart */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Time Taken</h2>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #10b981',
                          borderRadius: '12px',
                        }}
                        formatter={(value: number) => formatTime(value)}
                      />
                      <Bar dataKey="time" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Results Table */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Quizzes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 rounded-tl-xl">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Score</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 rounded-tr-xl">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => {
                        const percentage = Math.round((result.score / result.total_questions) * 100);
                        const emoji = percentage === 100 ? '🎉' : percentage >= 70 ? '😊' : percentage >= 50 ? '😐' : '😢';

                        return (
                          <tr
                            key={result.id}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {new Date(result.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                              {result.score}/{result.total_questions}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold ${
                                  percentage === 100
                                    ? 'bg-green-100 text-green-700'
                                    : percentage >= 70
                                    ? 'bg-blue-100 text-blue-700'
                                    : percentage >= 50
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {emoji} {percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {formatTime(result.time_taken)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
