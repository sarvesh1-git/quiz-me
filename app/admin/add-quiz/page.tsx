'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Home } from 'lucide-react';

interface Question {
  question: string;
  type: 'radio' | 'checkbox' | 'text' | 'dropdown';
  options: string[];
  correct_answer: string;
}

export default function AddQuizPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', type: 'radio', options: ['', ''], correct_answer: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', type: 'radio', options: ['', ''], correct_answer: '' },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!date) {
      setMessage({ type: 'error', text: 'Please select a date' });
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setMessage({ type: 'error', text: `Question ${i + 1} is empty` });
        return;
      }
      if (!q.correct_answer.trim()) {
        setMessage({ type: 'error', text: `Question ${i + 1} needs a correct answer` });
        return;
      }
      if ((q.type === 'radio' || q.type === 'checkbox' || q.type === 'dropdown') && 
          q.options.some(opt => !opt.trim())) {
        setMessage({ type: 'error', text: `Question ${i + 1} has empty options` });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        date,
        questions: questions.map((q) => ({
          question: q.question,
          type: q.type,
          options: q.type === 'text' ? null : q.options.filter(opt => opt.trim()),
          correct_answer: q.correct_answer,
        })),
      };

      const response = await fetch('/api/admin/add-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || 'Failed to add quiz';
        throw new Error(errorMsg);
      }

      setMessage({ type: 'success', text: 'Quiz added successfully!' });
      
      // Reset form
      setTimeout(() => {
        setDate('');
        setQuestions([{ question: '', type: 'radio', options: ['', ''], correct_answer: '' }]);
        setMessage(null);
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add quiz. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Add Daily Quiz 📝</h1>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              <Home size={20} />
              Home
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl font-semibold ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-red-100 text-red-700 border-2 border-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Date Selection */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-800 mb-2">Quiz Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700"
                required
              />
            </div>

            {/* Questions */}
            <div className="space-y-6 mb-8">
              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-purple-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Question {qIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700"
                      placeholder="Enter your question..."
                      required
                    />
                  </div>

                  {/* Question Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(qIndex, 'type', e.target.value as Question['type'])
                      }
                      className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700 bg-white"
                    >
                      <option value="radio">Multiple Choice (Single Answer)</option>
                      <option value="checkbox">Multiple Choice (Multiple Answers)</option>
                      <option value="text">Text Input</option>
                      <option value="dropdown">Dropdown</option>
                    </select>
                  </div>

                  {/* Options (for radio, checkbox, dropdown) */}
                  {(question.type === 'radio' ||
                    question.type === 'checkbox' ||
                    question.type === 'dropdown') && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              className="flex-1 p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700"
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                        >
                          <Plus size={20} />
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correct Answer
                      {question.type === 'checkbox' && ' (comma-separated for multiple)'}
                    </label>
                    <input
                      type="text"
                      value={question.correct_answer}
                      onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                      className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-700"
                      placeholder={
                        question.type === 'checkbox'
                          ? 'e.g., Option1,Option2'
                          : 'Enter the correct answer...'
                      }
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question Button */}
            <button
              type="button"
              onClick={addQuestion}
              className="w-full mb-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              <Plus size={24} />
              Add Another Question
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding Quiz...' : 'Add Quiz 🚀'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
