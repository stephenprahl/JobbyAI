import React from 'react';
import {
  FiClock,
  FiMessageCircle,
  FiMic,
  FiMicOff,
  FiPause,
  FiPlay,
  FiSkipForward,
  FiSquare,
  FiVideoOff
} from 'react-icons/fi';

interface ActiveInterviewProps {
  session: any;
  state: any;
  currentResponse: string;
  onResponseChange: (value: string) => void;
  onNextQuestion: () => void;
  onFinishInterview: () => void;
  onPauseInterview: () => void;
  onResetInterview: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  mediaStream: MediaStream | null;
  isRecording: boolean;
  onToggleRecording: () => void;
  formatTime: (seconds: number) => string;
}

const ActiveInterview: React.FC<ActiveInterviewProps> = ({
  session,
  state,
  currentResponse,
  onResponseChange,
  onNextQuestion,
  onFinishInterview,
  onPauseInterview,
  onResetInterview,
  videoRef,
  mediaStream,
  isRecording,
  onToggleRecording,
  formatTime
}) => {
  const currentQuestion = session.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Interview Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {session.position} at {session.company}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Question {state.currentQuestionIndex + 1} of {session.questions.length} • {session.interviewType} Interview
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-2xl font-bold ${state.timeRemaining < 30 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
              {formatTime(state.timeRemaining)}
            </div>
            <button
              onClick={onPauseInterview}
              className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {state.isPaused ? <FiPlay className="w-4 h-4" /> : <FiPause className="w-4 h-4" />}
            </button>
            <button
              onClick={onResetInterview}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FiSquare className="w-4 h-4 mr-1" />
              End
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Video
            </h4>
            <button
              onClick={onToggleRecording}
              className={`p-2 rounded-lg transition-colors ${isRecording
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
            >
              {isRecording ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {mediaStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FiVideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Camera not available</p>
                  <button className="mt-2 text-purple-600 hover:text-purple-700 text-sm">
                    Enable Camera
                  </button>
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                REC
              </div>
            )}
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiMessageCircle className="w-5 h-5 text-purple-500 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Question
            </h4>
            <div className="ml-auto flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${currentQuestion.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : currentQuestion.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-xs">
                {currentQuestion.category}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>

          {/* Question Timer */}
          <div className="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
            <FiClock className="w-4 h-4 mr-1" />
            Suggested time: {Math.floor(currentQuestion.timeLimit / 60)}:{String(currentQuestion.timeLimit % 60).padStart(2, '0')}
          </div>

          {/* Tips */}
          {currentQuestion.tips && currentQuestion.tips.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Tips:</h5>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                {currentQuestion.tips.map((tip: string, index: number) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Response Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Response
        </h4>

        <textarea
          value={currentResponse}
          onChange={(e) => onResponseChange(e.target.value)}
          placeholder="Type your response here or speak aloud... You can also use the microphone for voice input."
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleRecording}
              className={`p-2 rounded-lg transition-colors ${isRecording
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {isRecording ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isRecording ? 'Recording...' : 'Use microphone for voice input'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentResponse.length} characters
            </span>
          </div>

          <div className="space-x-3">
            {state.currentQuestionIndex < session.questions.length - 1 ? (
              <button
                onClick={onNextQuestion}
                disabled={!currentResponse.trim()}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FiSkipForward className="w-4 h-4 mr-1" />
                Next Question
              </button>
            ) : (
              <button
                onClick={onFinishInterview}
                disabled={!currentResponse.trim()}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finish Interview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ideal Answer Structure */}
      {currentQuestion.idealAnswerStructure && currentQuestion.idealAnswerStructure.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <h5 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
            📋 Suggested Answer Structure:
          </h5>
          <ol className="text-sm text-purple-800 dark:text-purple-400 space-y-1">
            {currentQuestion.idealAnswerStructure.map((structure: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                {structure}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ActiveInterview;
