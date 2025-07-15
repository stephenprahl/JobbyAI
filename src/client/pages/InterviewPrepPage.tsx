import { useEffect, useState } from 'react';
import {
  FiBookOpen,
  FiClock,
  FiMessageSquare,
  FiMic,
  FiMicOff,
  FiPlay,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational' | 'company_specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  category: string;
  tips: string[];
  sampleAnswer?: string;
  followUpQuestions?: string[];
}

interface InterviewSession {
  id: string;
  jobTitle: string;
  company: string;
  questions: InterviewQuestion[];
  responses: Array<{
    questionId: string;
    response: string;
    duration: number;
    score?: number;
    feedback?: string;
  }>;
  totalDuration: number;
  averageScore: number;
  completedAt?: string;
}

interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyPoints: string[];
  recommended_practice: string[];
}

export default function InterviewPrepPage() {
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'quick' | 'comprehensive' | 'custom'>('quick');

  useEffect(() => {
    if (user) {
      fetchInterviewSessions();
    }
  }, [user]);

  const fetchInterviewSessions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/interview/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error fetching interview sessions:', error);
    }
  };

  const startNewSession = async (jobTitle?: string, company?: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/interview/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobTitle: jobTitle || 'General Position',
          company: company || 'Practice Company',
          mode: practiceMode
        })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSession(data.data);
        setCurrentQuestionIndex(0);
        setSessionStartTime(new Date());
        setQuestionStartTime(new Date());
      }
    } catch (error) {
      console.error('Error starting interview session:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!currentSession || !questionStartTime || !currentResponse.trim()) return;

    const duration = (new Date().getTime() - questionStartTime.getTime()) / 1000;
    const currentQuestion = currentSession.questions[currentQuestionIndex];

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/interview/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: currentSession.id,
          questionId: currentQuestion.id,
          response: currentResponse,
          duration
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update current session with response
        const updatedSession = {
          ...currentSession,
          responses: [
            ...currentSession.responses,
            {
              questionId: currentQuestion.id,
              response: currentResponse,
              duration,
              score: data.data.score,
              feedback: data.data.feedback
            }
          ]
        };
        setCurrentSession(updatedSession);

        // Move to next question or finish
        if (currentQuestionIndex < currentSession.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setCurrentResponse('');
          setQuestionStartTime(new Date());
        } else {
          finishSession(updatedSession);
        }
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const finishSession = async (session: InterviewSession) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/interview/finish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setFeedback(data.data.feedback);
        setCurrentSession(null);
        setCurrentQuestionIndex(0);
        fetchInterviewSessions();
      }
    } catch (error) {
      console.error('Error finishing session:', error);
    }
  };

  const currentQuestion = currentSession?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiMessageSquare className="w-8 h-8 text-purple-500 mr-3" />
            Interview Preparation
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Practice with AI-powered mock interviews tailored to your target roles
          </p>
        </div>

        {!currentSession && !feedback && (
          <>
            {/* Practice Mode Selection */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose Your Practice Mode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setPracticeMode('quick')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${practiceMode === 'quick'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <FiClock className="w-5 h-5 text-primary-500 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Quick Practice</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    5-7 essential questions • 15-20 minutes
                  </p>
                </button>

                <button
                  onClick={() => setPracticeMode('comprehensive')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${practiceMode === 'comprehensive'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <FiTarget className="w-5 h-5 text-purple-500 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Comprehensive</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    15-20 detailed questions • 45-60 minutes
                  </p>
                </button>

                <button
                  onClick={() => setPracticeMode('custom')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${practiceMode === 'custom'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <FiBookOpen className="w-5 h-5 text-green-500 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Custom Focus</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Choose specific topics • Flexible duration
                  </p>
                </button>
              </div>
            </div>

            {/* Start Interview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Start Your Practice Session
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Job Title (e.g., Software Engineer)"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Company Name (optional)"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => startNewSession()}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <FiPlay className="w-5 h-5 mr-2" />
                )}
                Start Interview Practice
              </button>
            </div>
          </>
        )}

        {/* Active Interview Session */}
        {currentSession && currentQuestion && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentSession.company} - {currentSession.jobTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Question {currentQuestionIndex + 1} of {currentSession.questions.length}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(((currentQuestionIndex + 1) / currentSession.questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Complete
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / currentSession.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentQuestion.type === 'behavioral'
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                      : currentQuestion.type === 'technical'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : currentQuestion.type === 'situational'
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
                    }`}>
                    {currentQuestion.type.replace('_', ' ')}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentQuestion.difficulty === 'beginner'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      : currentQuestion.difficulty === 'intermediate'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                    }`}>
                    {currentQuestion.difficulty}
                  </div>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FiClock className="w-4 h-4 mr-1" />
                  {questionStartTime && (
                    <span>
                      {Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)}s
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {currentQuestion.question}
              </h2>

              {/* Tips */}
              {currentQuestion.tips.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    💡 Tips for answering:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    {currentQuestion.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Response Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Response:
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`flex items-center px-3 py-1 rounded-lg text-sm ${isRecording
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {isRecording ? <FiMicOff className="w-4 h-4 mr-1" /> : <FiMic className="w-4 h-4 mr-1" />}
                      {isRecording ? 'Stop Recording' : 'Voice Input'}
                    </button>
                  </div>
                </div>

                <textarea
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  placeholder="Type your response here or use voice input..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentResponse.length} characters
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={submitResponse}
                      disabled={!currentResponse.trim()}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {currentQuestionIndex === currentSession.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Results */}
        {feedback && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiTrendingUp className="w-6 h-6 text-green-500 mr-3" />
                Interview Complete - Your Results
              </h2>

              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-primary-600 mb-2">
                  {feedback.overallScore}%
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  Overall Performance Score
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                        <span className="text-green-500 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-3">
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                        <span className="text-orange-500 mr-2">→</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Practice */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
                  Recommended Practice Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {feedback.recommended_practice.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setFeedback(null)}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Practice Again
                </button>
                <button
                  onClick={fetchInterviewSessions}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Previous Sessions */}
        {sessions.length > 0 && !currentSession && !feedback && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Previous Practice Sessions
            </h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.company} - {session.jobTitle}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {session.questions.length} questions • {Math.round(session.totalDuration / 60)} minutes
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary-600">
                      {session.averageScore}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {session.completedAt && new Date(session.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
