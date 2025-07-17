import React from 'react';
import {
  FiAlertTriangle,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiDownload,
  FiRefreshCw,
  FiShare2,
  FiStar,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';

interface InterviewFeedbackProps {
  results: InterviewResults;
  onNewSession: () => void;
  onDownloadReport?: () => void;
  onShareResults?: () => void;
}

interface InterviewResults {
  sessionId: string;
  overallScore: number;
  responses: Array<{
    questionId: string;
    response: string;
    duration: number;
    confidence: number;
    clarity: number;
    relevance: number;
    feedback: string;
    improvements: string[];
  }>;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
  detailedAnalysis?: {
    communicationScore: number;
    technicalScore: number;
    behavioralScore: number;
    confidenceLevel: number;
  };
}

const InterviewFeedback: React.FC<InterviewFeedbackProps> = ({
  results,
  onNewSession,
  onDownloadReport,
  onShareResults
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <FiCheckCircle className="w-4 h-4 mr-1" />
          Excellent Performance
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
          <FiStar className="w-4 h-4 mr-1" />
          Good Performance
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
        <FiAlertTriangle className="w-4 h-4 mr-1" />
        Needs Improvement
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)} mb-2`}>
            {results.overallScore}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Overall Interview Score
          </p>
          <div className="mb-6">
            {getScoreBadge(results.overallScore)}
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {results.overallScore >= 80
              ? "Outstanding! You demonstrated strong interview skills and would likely make a great impression."
              : results.overallScore >= 60
                ? "Good work! With some focused practice on key areas, you'll be even more competitive."
                : "Keep practicing! There are specific areas where improvement will significantly boost your performance."
            }
          </p>
        </div>
      </div>

      {/* Detailed Scores */}
      {results.detailedAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Detailed Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className={`text-2xl font-bold ${getScoreColor(results.detailedAnalysis.communicationScore)} mb-1`}>
                {results.detailedAnalysis.communicationScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Communication</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className={`text-2xl font-bold ${getScoreColor(results.detailedAnalysis.technicalScore)} mb-1`}>
                {results.detailedAnalysis.technicalScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Technical Skills</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className={`text-2xl font-bold ${getScoreColor(results.detailedAnalysis.behavioralScore)} mb-1`}>
                {results.detailedAnalysis.behavioralScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Behavioral</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className={`text-2xl font-bold ${getScoreColor(results.detailedAnalysis.confidenceLevel)} mb-1`}>
                {results.detailedAnalysis.confidenceLevel}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiTrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Strengths
            </h3>
          </div>
          <ul className="space-y-3">
            {results.strengths.map((strength, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiTarget className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Areas for Improvement
            </h3>
          </div>
          <ul className="space-y-3">
            {results.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <FiAlertTriangle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Question-by-Question Analysis
        </h3>
        <div className="space-y-4">
          {results.responses.map((response, index) => (
            <div key={response.questionId} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Question {index + 1}
                </h4>
                <div className="flex space-x-2">
                  <span className={`text-sm font-medium ${getScoreColor((response.clarity + response.relevance + response.confidence) / 3 * 20)}`}>
                    {Math.round((response.clarity + response.relevance + response.confidence) / 3 * 20)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Clarity</div>
                  <div className={`font-semibold ${getScoreColor(response.clarity * 20)}`}>
                    {response.clarity}/5
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Relevance</div>
                  <div className={`font-semibold ${getScoreColor(response.relevance * 20)}`}>
                    {response.relevance}/5
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                  <div className={`font-semibold ${getScoreColor(response.confidence * 20)}`}>
                    {response.confidence}/5
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {response.feedback}
              </p>

              {response.improvements.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    Specific Improvements:
                  </div>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                    {response.improvements.map((improvement, idx) => (
                      <li key={idx}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FiBookOpen className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personalized Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-blue-800 dark:text-blue-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FiAward className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Next Steps
          </h3>
        </div>
        <div className="space-y-3">
          {results.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-purple-800 dark:text-purple-300">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onNewSession}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center font-medium"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Start New Session
        </button>

        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Download Report
          </button>
        )}

        {onShareResults && (
          <button
            onClick={onShareResults}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
          >
            <FiShare2 className="w-4 h-4 mr-2" />
            Share Results
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewFeedback;
