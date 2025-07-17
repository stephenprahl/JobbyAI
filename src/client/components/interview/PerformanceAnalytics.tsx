import React from 'react';
import {
  FiAward,
  FiBarChart,
  FiCalendar,
  FiClock,
  FiStar,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';

interface PerformanceAnalyticsProps {
  sessions?: Array<{
    id: string;
    date: string;
    score: number;
    duration: number;
    type: string;
    questionsAnswered: number;
  }>;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ sessions = [] }) => {
  // Mock data if no sessions provided
  const mockSessions = [
    { id: '1', date: '2025-01-15', score: 85, duration: 30, type: 'behavioral', questionsAnswered: 8 },
    { id: '2', date: '2025-01-10', score: 78, duration: 25, type: 'technical', questionsAnswered: 6 },
    { id: '3', date: '2025-01-05', score: 82, duration: 35, type: 'mixed', questionsAnswered: 10 },
    { id: '4', date: '2025-01-01', score: 75, duration: 20, type: 'behavioral', questionsAnswered: 5 },
  ];

  const sessionData = sessions.length > 0 ? sessions : mockSessions;

  // Calculate analytics
  const averageScore = sessionData.reduce((sum, session) => sum + session.score, 0) / sessionData.length;
  const totalPracticeTime = sessionData.reduce((sum, session) => sum + session.duration, 0);
  const totalQuestions = sessionData.reduce((sum, session) => sum + session.questionsAnswered, 0);
  const improvementTrend = sessionData.length > 1
    ? sessionData[sessionData.length - 1].score - sessionData[0].score
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementIcon = () => {
    if (improvementTrend > 0) return <FiTrendingUp className="w-4 h-4 text-green-500" />;
    return <FiTarget className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                {Math.round(averageScore)}%
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <FiStar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getImprovementIcon()}
            <span className={`ml-1 text-sm ${improvementTrend > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {improvementTrend > 0 ? `+${improvementTrend}` : improvementTrend} since first session
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
              <p className="text-3xl font-bold text-green-600">{sessionData.length}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <FiAward className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Keep practicing regularly!
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Practice Time</p>
              <p className="text-3xl font-bold text-blue-600">{Math.round(totalPracticeTime / 60)}h {totalPracticeTime % 60}m</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FiClock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Avg: {Math.round(totalPracticeTime / sessionData.length)} min/session
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</p>
              <p className="text-3xl font-bold text-indigo-600">{totalQuestions}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
              <FiBarChart className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Avg: {Math.round(totalQuestions / sessionData.length)} per session
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FiTrendingUp className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Trend
          </h3>
        </div>

        <div className="h-64 flex items-end justify-between space-x-2">
          {sessionData.map((session, index) => (
            <div key={session.id} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t ${session.score >= 80 ? 'bg-green-500' :
                    session.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                style={{ height: `${(session.score / 100) * 200}px` }}
              ></div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                <div className="font-medium">{session.score}%</div>
                <div>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FiCalendar className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Sessions
          </h3>
        </div>

        <div className="space-y-4">
          {sessionData.slice(0, 5).map((session, index) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${session.score >= 80 ? 'bg-green-500' :
                    session.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Interview
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(session.date).toLocaleDateString()} • {session.duration} min • {session.questionsAnswered} questions
                  </div>
                </div>
              </div>
              <div className={`text-lg font-semibold ${getScoreColor(session.score)}`}>
                {session.score}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights and Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4">
          📊 Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-2">
              Your Best Performing Area:
            </h4>
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              {sessionData.length > 0 && sessionData.find(s => s.score === Math.max(...sessionData.map(s => s.score)))?.type || 'N/A'} interviews
            </p>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-2">
              Recommended Focus:
            </h4>
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              {averageScore < 70
                ? "Practice more behavioral questions using the STAR method"
                : averageScore < 85
                  ? "Work on technical depth and specific examples"
                  : "Maintain your excellent performance!"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
