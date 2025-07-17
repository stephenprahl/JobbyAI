import React, { useEffect, useRef, useState } from 'react';
import {
  FiCheck,
  FiClock,
  FiCode,
  FiDownload,
  FiMaximize2,
  FiMic,
  FiMicOff,
  FiMinimize2,
  FiPlay,
  FiRotateCcw,
  FiTerminal,
  FiUpload,
  FiVideo,
  FiVideoOff,
  FiX
} from 'react-icons/fi';
import { CodingChallenge } from '../../data/interviewData';

// Types
interface TechnicalInterviewProps {
  challenges: CodingChallenge[];
  onSubmitSolution: (challengeId: string, code: string, language: string) => void;
  onFinishInterview: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  mediaStream: MediaStream | null;
  isRecording: boolean;
  onToggleRecording: () => void;
  formatTime: (seconds: number) => string;
}

const TechnicalInterview: React.FC<TechnicalInterviewProps> = ({
  challenges,
  onSubmitSolution,
  onFinishInterview,
  videoRef,
  mediaStream,
  isRecording,
  onToggleRecording,
  formatTime
}) => {
  // State
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showTestOutput, setShowTestOutput] = useState(false);
  const [submittedChallenges, setSubmittedChallenges] = useState<Set<string>>(new Set());

  // Refs
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentChallenge = challenges[currentChallengeIndex];

  // Supported languages and their configurations
  const languages = {
    javascript: {
      name: 'JavaScript',
      extension: 'js',
      monacoLanguage: 'javascript',
      runnerTemplate: (code: string) => `
        ${code}
        // Test runner
        function runTests() {
          const results = [];
          {{TEST_CASES}}
          return results;
        }
      `
    },
    python: {
      name: 'Python',
      extension: 'py',
      monacoLanguage: 'python',
      runnerTemplate: (code: string) => `
${code}

# Test runner
def run_tests():
    results = []
    {{TEST_CASES}}
    return results
      `
    },
    java: {
      name: 'Java',
      extension: 'java',
      monacoLanguage: 'java',
      runnerTemplate: (code: string) => `
public class Solution {
    ${code}

    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test runner
        {{TEST_CASES}}
    }
}
      `
    },
    cpp: {
      name: 'C++',
      extension: 'cpp',
      monacoLanguage: 'cpp',
      runnerTemplate: (code: string) => `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    // Test runner
    {{TEST_CASES}}
    return 0;
}
      `
    }
  };

  // Effects
  useEffect(() => {
    if (currentChallenge) {
      setCode(currentChallenge.starterCode[selectedLanguage] || '');
      setTimeRemaining(currentChallenge.timeLimit * 60);
      setTestResults([]);
      setShowTestOutput(false);
    }
  }, [currentChallengeIndex, selectedLanguage, currentChallenge]);

  useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining]);

  // Code execution simulation
  const runCode = async () => {
    if (!currentChallenge || !code.trim()) return;

    setIsRunning(true);
    setShowTestOutput(true);

    try {
      // Simulate code execution with test cases
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const results = currentChallenge.testCases.map((testCase, index) => {
        // Mock test execution logic
        const passed = Math.random() > 0.3; // 70% pass rate for demo

        return {
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: passed ? testCase.expectedOutput : 'incorrect output',
          error: passed ? undefined : 'Runtime error or incorrect logic'
        };
      });

      setTestResults(results);
    } catch (error) {
      console.error('Error running code:', error);
      setTestResults([{
        passed: false,
        input: 'N/A',
        expected: 'N/A',
        actual: 'N/A',
        error: 'Execution failed'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = () => {
    if (!currentChallenge || !code.trim()) return;

    onSubmitSolution(currentChallenge.id, code, selectedLanguage);
    setSubmittedChallenges(prev => new Set([...prev, currentChallenge.id]));

    // Auto-advance to next challenge if available
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  };

  const useHint = (hintIndex: number) => {
    if (!usedHints.includes(hintIndex)) {
      setUsedHints(prev => [...prev, hintIndex]);
    }
  };

  const resetCode = () => {
    if (currentChallenge) {
      setCode(currentChallenge.starterCode[selectedLanguage] || '');
      setTestResults([]);
      setShowTestOutput(false);
    }
  };

  const downloadCode = () => {
    const extension = languages[selectedLanguage as keyof typeof languages].extension;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChallenge?.title.replace(/\s+/g, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);
  const isSubmitted = submittedChallenges.has(currentChallenge?.id || '');

  if (!currentChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Coding Challenges Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please check back later or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiCode className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Technical Interview
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Challenge {currentChallengeIndex + 1} of {challenges.length}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentChallenge.difficulty)}`}>
                {currentChallenge.difficulty}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${timeRemaining < 300 ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
              <FiClock className="w-4 h-4" />
              <span className="font-mono text-sm">
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Video Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {showVideo ? <FiVideo className="w-4 h-4" /> : <FiVideoOff className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggleRecording}
                className={`p-2 rounded-lg transition-colors ${isRecording
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
              >
                {isRecording ? <FiMicOff className="w-4 h-4" /> : <FiMic className="w-4 h-4" />}
              </button>
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentChallengeIndex + 1) / challenges.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900' : ''}`}>
        {/* Left Panel - Problem Description */}
        <div className={`${isFullscreen ? 'w-1/3' : 'w-1/2'} border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentChallenge.title}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentChallenge.category}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Problem Description
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentChallenge.description}
                </p>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Examples
                </h4>
                {currentChallenge.examples.map((example, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Input:</span>
                      <pre className="mt-1 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        <code>{example.input}</code>
                      </pre>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Output:</span>
                      <pre className="mt-1 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        <code>{example.output}</code>
                      </pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Explanation:</span>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Constraints
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {currentChallenge.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm">{constraint}</li>
                  ))}
                </ul>
              </div>

              {/* Hints */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hints
                  </h4>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    {showHints ? 'Hide' : 'Show'} Hints
                  </button>
                </div>
                {showHints && (
                  <div className="space-y-2">
                    {currentChallenge.hints.map((hint, index) => (
                      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Hint {index + 1}
                          </span>
                          {!usedHints.includes(index) && (
                            <button
                              onClick={() => useHint(index)}
                              className="text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                            >
                              Reveal
                            </button>
                          )}
                        </div>
                        {usedHints.includes(index) && (
                          <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                            {hint}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor and Video */}
        <div className={`${isFullscreen ? 'w-2/3' : 'w-1/2'} flex flex-col`}>
          {/* Video Feed */}
          {showVideo && (
            <div className="h-48 bg-gray-900 relative">
              {mediaStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <FiVideoOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-50">Camera not available</p>
                  </div>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  REC
                </div>
              )}
            </div>
          )}

          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {Object.entries(languages).map(([key, lang]) => (
                    <option key={key} value={key}>{lang.name}</option>
                  ))}
                </select>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <button
                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                    className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  >
                    A-
                  </button>
                  <span>{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                    className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={resetCode}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiRotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </button>
                <button
                  onClick={downloadCode}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiDownload className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 relative">
              <textarea
                ref={codeEditorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full h-full p-4 bg-gray-900 text-gray-100 font-mono resize-none focus:outline-none`}
                style={{ fontSize: `${fontSize}px` }}
                placeholder="Write your solution here..."
                spellCheck={false}
              />
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={runCode}
                  disabled={isRunning || !code.trim()}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  ) : (
                    <FiPlay className="w-4 h-4 mr-2" />
                  )}
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>

                <button
                  onClick={submitSolution}
                  disabled={!code.trim() || isSubmitted}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isSubmitted
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : allTestsPassed
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                  {isSubmitted ? (
                    <>
                      <FiCheck className="w-4 h-4 mr-2" />
                      Submitted
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-4 h-4 mr-2" />
                      Submit Solution
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {testResults.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tests: {testResults.filter(r => r.passed).length}/{testResults.length} passed
                    </span>
                    {allTestsPassed && (
                      <FiCheck className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )}

                <button
                  onClick={() => setShowTestOutput(!showTestOutput)}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiTerminal className="w-4 h-4 mr-1" />
                  {showTestOutput ? 'Hide' : 'Show'} Output
                </button>
              </div>
            </div>

            {/* Test Output */}
            {showTestOutput && (
              <div className="max-h-64 bg-gray-900 text-gray-100 p-4 overflow-y-auto border-t border-gray-700">
                <div className="space-y-2">
                  {testResults.length === 0 ? (
                    <p className="text-gray-400 text-sm">No test results yet. Run your code to see output.</p>
                  ) : (
                    testResults.map((result, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm">Test Case {index + 1}</span>
                          <div className="flex items-center">
                            {result.passed ? (
                              <div className="flex items-center text-green-400">
                                <FiCheck className="w-4 h-4 mr-1" />
                                PASSED
                              </div>
                            ) : (
                              <div className="flex items-center text-red-400">
                                <FiX className="w-4 h-4 mr-1" />
                                FAILED
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs space-y-1">
                          <div><span className="text-gray-400">Input:</span> {result.input}</div>
                          <div><span className="text-gray-400">Expected:</span> {result.expected}</div>
                          <div><span className="text-gray-400">Actual:</span> {result.actual}</div>
                          {result.error && (
                            <div className="text-red-400"><span className="text-gray-400">Error:</span> {result.error}</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentChallengeIndex(Math.max(0, currentChallengeIndex - 1))}
            disabled={currentChallengeIndex === 0}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous Challenge
          </button>

          <div className="flex items-center space-x-2">
            {challenges.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentChallengeIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${index === currentChallengeIndex
                    ? 'bg-purple-500 text-white'
                    : submittedChallenges.has(challenges[index].id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {currentChallengeIndex < challenges.length - 1 ? (
              <button
                onClick={() => setCurrentChallengeIndex(currentChallengeIndex + 1)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next Challenge
              </button>
            ) : (
              <button
                onClick={onFinishInterview}
                className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <FiCheck className="w-4 h-4 mr-2" />
                Finish Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalInterview;
