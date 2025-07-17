import React from 'react';
import { FiBarChart, FiCalendar, FiClock, FiStar, FiUser } from 'react-icons/fi';

interface SessionHistoryProps {
  sessions: Array<{
    id: string;
    position: string;
    company: string;
    difficulty: string;
    interviewType: string;
    duration: number;
    createdAt: string;
    score?: number;
    questionsCompleted?: number;
    totalQuestions?: number;
  }>;
  onReviewSession?: (sessionId: string) => void;
  onRetrySession?: (sessionId: string) => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onReviewSession,
  onRetrySession
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'entry':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'mid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'senior':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'executive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'behavioral':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'technical':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'case':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'presentation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'mixed':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiBarChart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Interview Sessions Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start your first practice session to see your interview history here.
        </p>
        <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          Start Your First Interview
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Interview Session History
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} completed
        </span>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {session.position}
                  </h4>
                  {session.score !== undefined && (
                    <span className={`text-lg font-bold ${getScoreColor(session.score)}`}>
                      {session.score}%
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <FiUser className="w-4 h-4" />
                  <span>{session.company}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty} level
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(session.interviewType)}`}>
                    {session.interviewType}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs font-medium flex items-center">
                    <FiClock className="w-3 h-3 mr-1" />
                    {session.duration} min
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {formatDate(session.createdAt)}
                  </div>
                  {session.questionsCompleted !== undefined && session.totalQuestions !== undefined && (
                    <div className="flex items-center">
                      <FiStar className="w-3 h-3 mr-1" />
                      {session.questionsCompleted}/{session.totalQuestions} questions
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                {onReviewSession && (
                  <button
                    onClick={() => onReviewSession(session.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Review
                  </button>
                )}
                {onRetrySession && (
                  <button
                    onClick={() => onRetrySession(session.id)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {session.questionsCompleted !== undefined && session.totalQuestions !== undefined && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                  style={{
                    width: `${(session.questionsCompleted / session.totalQuestions) * 100}%`
                  }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {sessions.length >= 10 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
            Load More Sessions
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
