import React, { useEffect, useRef, useState } from 'react';
import {
  FiBarChart,
  FiClock,
  FiPlay,
  FiVideo
} from 'react-icons/fi';
import {
  ActiveInterview,
  InterviewFeedback,
  InterviewSetup,
  PerformanceAnalytics,
  SessionHistory,
  TechnicalInterview,
  type InterviewConfig
} from '../components/interview';
import { useAuth } from '../contexts/AuthContext';
import { CodingChallenge, codingChallenges } from '../data/interviewData';

// Types
interface InterviewSession {
  id: string;
  position: string;
  company: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  interviewType: 'behavioral' | 'technical' | 'case' | 'presentation' | 'mixed';
  duration: number;
  questions: Question[];
  createdAt: string;
  industry?: string;
  focusAreas?: string[];
  codingChallenges?: CodingChallenge[];
}

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  tips: string[];
  idealAnswerStructure: string[];
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

interface SimulatorState {
  isActive: boolean;
  currentQuestionIndex: number;
  timeRemaining: number;
  isRecording: boolean;
  isPaused: boolean;
  responses: string[];
  confidence: number[];
  startTime: Date | null;
}

const InterviewSimulatorPage: React.FC = () => {
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    isActive: false,
    currentQuestionIndex: 0,
    timeRemaining: 120,
    isRecording: false,
    isPaused: false,
    responses: [],
    confidence: [],
    startTime: null
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'practice' | 'sessions' | 'analytics'>('practice');
  const [currentResponse, setCurrentResponse] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // Effects
  useEffect(() => {
    if (user) {
      fetchInterviewSessions();
    }

    // Setup speech recognition
    setupSpeechRecognition();

    return () => {
      cleanup();
    };
  }, [user]);

  useEffect(() => {
    if (simulatorState.isActive && !simulatorState.isPaused && simulatorState.timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setSimulatorState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1)
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [simulatorState.isActive, simulatorState.isPaused, simulatorState.timeRemaining]);

  // Setup functions
  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        setCurrentResponse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setSimulatorState(prev => ({ ...prev, isRecording: false }));
      };
    }
  };

  const cleanup = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopCamera();
  };

  // API functions
  const fetchInterviewSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interview/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else {
        // Use mock data if API is not available
        setSessions(generateMockSessions());
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions(generateMockSessions());
    } finally {
      setLoading(false);
    }
  };

  const generateMockSessions = (): InterviewSession[] => {
    return [
      {
        id: '1',
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        difficulty: 'senior',
        interviewType: 'technical',
        duration: 45,
        questions: generateMockQuestions('technical'),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        industry: 'Technology'
      },
      {
        id: '2',
        position: 'Product Manager',
        company: 'Innovation Inc',
        difficulty: 'mid',
        interviewType: 'behavioral',
        duration: 30,
        questions: generateMockQuestions('behavioral'),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        industry: 'Technology'
      }
    ];
  };

  const generateMockQuestions = (type: string): Question[] => {
    const behavioralQuestions = [
      {
        id: '1',
        text: 'Tell me about a time when you had to overcome a significant challenge at work.',
        category: 'Problem Solving',
        difficulty: 'medium' as const,
        timeLimit: 180,
        tips: [
          'Use the STAR method (Situation, Task, Action, Result)',
          'Be specific about your role and actions',
          'Quantify the impact when possible',
          'Show what you learned from the experience'
        ],
        idealAnswerStructure: [
          'Set the context (Situation)',
          'Explain your responsibility (Task)',
          'Detail your approach (Action)',
          'Share the outcome (Result)',
          'Reflect on lessons learned'
        ]
      },
      {
        id: '2',
        text: 'Describe a situation where you had to work with a difficult team member.',
        category: 'Teamwork',
        difficulty: 'medium' as const,
        timeLimit: 180,
        tips: [
          'Focus on professional behavior',
          'Show empathy and understanding',
          'Highlight problem-solving skills',
          'Demonstrate leadership qualities'
        ],
        idealAnswerStructure: [
          'Describe the situation objectively',
          'Explain your approach to understanding their perspective',
          'Detail the steps you took to resolve issues',
          'Share the positive outcome',
          'Mention what you learned about teamwork'
        ]
      }
    ];

    const technicalQuestions = [
      {
        id: '3',
        text: 'How would you design a scalable system to handle millions of users?',
        category: 'System Design',
        difficulty: 'hard' as const,
        timeLimit: 300,
        tips: [
          'Start with clarifying questions',
          'Break down the problem',
          'Consider scalability from the beginning',
          'Discuss trade-offs'
        ],
        idealAnswerStructure: [
          'Clarify requirements and constraints',
          'Estimate scale (users, data, requests)',
          'Design high-level architecture',
          'Deep dive into critical components',
          'Address scalability and reliability'
        ]
      },
      {
        id: '4',
        text: 'Explain the difference between REST and GraphQL APIs. When would you use each?',
        category: 'Technical Knowledge',
        difficulty: 'medium' as const,
        timeLimit: 240,
        tips: [
          'Start with clear definitions',
          'Compare key differences',
          'Provide real-world use cases',
          'Consider performance implications'
        ],
        idealAnswerStructure: [
          'Define REST and GraphQL',
          'Compare their architectural differences',
          'Discuss advantages and disadvantages',
          'Provide specific use case examples',
          'Mention performance considerations'
        ]
      }
    ];

    return type === 'technical' ? technicalQuestions : behavioralQuestions;
  };

  // Interview control functions
  const startInterview = async (config: InterviewConfig) => {
    try {
      setLoading(true);

      const newSession: InterviewSession = {
        id: Date.now().toString(),
        position: config.position,
        company: config.company,
        difficulty: config.difficulty,
        interviewType: config.type,
        duration: config.duration,
        questions: generateMockQuestions(config.type),
        createdAt: new Date().toISOString(),
        industry: config.industry,
        focusAreas: config.focusAreas,
        codingChallenges: config.type === 'technical' ? codingChallenges.slice(0, 3) : undefined
      };

      setCurrentSession(newSession);
      setSimulatorState({
        isActive: true,
        currentQuestionIndex: 0,
        timeRemaining: newSession.questions[0]?.timeLimit || 180,
        isRecording: false,
        isPaused: false,
        responses: [],
        confidence: [],
        startTime: new Date()
      });
      setCurrentResponse('');
      setShowFeedback(false);

      // Start camera if available
      await startCamera();

    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.warn('Camera access denied or not available:', error);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const handleNextQuestion = () => {
    if (!currentSession) return;

    const newResponses = [...simulatorState.responses, currentResponse];
    const newConfidence = [...simulatorState.confidence, 3]; // Default confidence level

    if (simulatorState.currentQuestionIndex < currentSession.questions.length - 1) {
      const nextQuestion = currentSession.questions[simulatorState.currentQuestionIndex + 1];
      setSimulatorState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: nextQuestion.timeLimit,
        responses: newResponses,
        confidence: newConfidence
      }));
      setCurrentResponse('');
    } else {
      // Interview complete
      finishInterview(newResponses, newConfidence);
    }
  };

  const finishInterview = async (responses: string[], confidence: number[]) => {
    if (!currentSession) return;

    // Generate comprehensive results
    const mockResults: InterviewResults = {
      sessionId: currentSession.id,
      overallScore: 78,
      responses: currentSession.questions.map((q, index) => ({
        questionId: q.id,
        response: responses[index] || '',
        duration: 145,
        confidence: confidence[index] || 3,
        clarity: 4,
        relevance: 3.5,
        feedback: 'Good structure and relevant examples. Consider adding more specific metrics to strengthen your response.',
        improvements: ['Add quantifiable results', 'Practice more concise delivery', 'Include specific examples']
      })),
      strengths: [
        'Clear communication style',
        'Good use of real examples',
        'Professional demeanor',
        'Technical knowledge',
        'Structured approach to answering'
      ],
      areasForImprovement: [
        'Time management during responses',
        'More specific metrics and data',
        'Confidence in delivery',
        'Body language and eye contact',
        'Follow-up question preparation'
      ],
      recommendations: [
        'Practice the STAR method more consistently',
        'Prepare specific metrics for your achievements',
        'Work on maintaining eye contact with the camera',
        'Practice in front of a mirror to improve body language',
        'Record yourself to identify speech patterns'
      ],
      nextSteps: [
        'Schedule another practice session focusing on behavioral questions',
        'Review technical concepts for your target role',
        'Prepare company-specific examples and research',
        'Practice with a peer for additional feedback',
        'Work on time management with a stopwatch'
      ],
      detailedAnalysis: {
        communicationScore: 75,
        technicalScore: 82,
        behavioralScore: 76,
        confidenceLevel: 70
      }
    };

    setResults(mockResults);
    setSimulatorState(prev => ({ ...prev, isActive: false }));
    setShowFeedback(true);
    stopCamera();
  };

  const pauseInterview = () => {
    setSimulatorState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetInterview = () => {
    setCurrentSession(null);
    setResults(null);
    setSimulatorState({
      isActive: false,
      currentQuestionIndex: 0,
      timeRemaining: 120,
      isRecording: false,
      isPaused: false,
      responses: [],
      confidence: [],
      startTime: null
    });
    setCurrentResponse('');
    setShowFeedback(false);
    stopCamera();
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (simulatorState.isRecording) {
      recognitionRef.current.stop();
      setSimulatorState(prev => ({ ...prev, isRecording: false }));
    } else {
      recognitionRef.current.start();
      setSimulatorState(prev => ({ ...prev, isRecording: true }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeSubmission = (challengeId: string, code: string, language: string) => {
    console.log('Code submitted:', { challengeId, code, language });

    // In a real implementation, this would:
    // 1. Send the code to a backend service for execution
    // 2. Run test cases and get results
    // 3. Store the submission for review

    // For now, we'll just log it and potentially move to next challenge
    alert(`Code submitted successfully for ${challengeId} in ${language}!`);
  };

  const downloadReport = () => {
    if (!results) return;

    const reportData = {
      session: currentSession,
      results: results,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${currentSession?.position.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading interview simulator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <FiVideo className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                AI Interview Simulator
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Practice with AI-powered mock interviews and get instant feedback
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'practice', label: 'Practice Session', icon: FiPlay },
              { id: 'sessions', label: 'Session History', icon: FiClock },
              { id: 'analytics', label: 'Performance Analytics', icon: FiBarChart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'practice' && (
          <div className="space-y-8">
            {!currentSession && !showFeedback && (
              <InterviewSetup onStartInterview={startInterview} loading={loading} />
            )}

            {currentSession && !showFeedback && (
              <>
                {currentSession.interviewType === 'technical' && currentSession.codingChallenges ? (
                  <TechnicalInterview
                    challenges={currentSession.codingChallenges}
                    onSubmitSolution={handleCodeSubmission}
                    onFinishInterview={() => finishInterview(simulatorState.responses, simulatorState.confidence)}
                    videoRef={videoRef}
                    mediaStream={mediaStream}
                    isRecording={simulatorState.isRecording}
                    onToggleRecording={toggleRecording}
                    formatTime={formatTime}
                  />
                ) : (
                  <ActiveInterview
                    session={currentSession}
                    state={simulatorState}
                    currentResponse={currentResponse}
                    onResponseChange={setCurrentResponse}
                    onNextQuestion={handleNextQuestion}
                    onFinishInterview={() => finishInterview(simulatorState.responses, simulatorState.confidence)}
                    onPauseInterview={pauseInterview}
                    onResetInterview={resetInterview}
                    videoRef={videoRef}
                    mediaStream={mediaStream}
                    isRecording={simulatorState.isRecording}
                    onToggleRecording={toggleRecording}
                    formatTime={formatTime}
                  />
                )}
              </>
            )}

            {showFeedback && results && (
              <InterviewFeedback
                results={results}
                onNewSession={resetInterview}
                onDownloadReport={downloadReport}
              />
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <SessionHistory
              sessions={sessions.map(session => ({
                ...session,
                score: Math.floor(Math.random() * 40) + 60, // Mock scores
                questionsCompleted: session.questions.length,
                totalQuestions: session.questions.length
              }))}
              onReviewSession={(sessionId) => {
                console.log('Review session:', sessionId);
                // Implement review functionality
              }}
              onRetrySession={(sessionId) => {
                console.log('Retry session:', sessionId);
                // Implement retry functionality
              }}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <PerformanceAnalytics
              sessions={sessions.map((session, index) => ({
                id: session.id,
                date: session.createdAt,
                score: Math.floor(Math.random() * 40) + 60, // Mock scores
                duration: session.duration,
                type: session.interviewType,
                questionsAnswered: session.questions.length
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulatorPage;
