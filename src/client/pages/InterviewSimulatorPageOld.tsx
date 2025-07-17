import { useEffect, useRef, useState } from 'react';
import {
  FiAlertTriangle,
  FiAward,
  FiBarChart,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiMessageCircle,
  FiMic,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiVideo,
  FiVideoOff
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface InterviewSession {
  id: string;
  position: string;
  company: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  interviewType: 'behavioral' | 'technical' | 'case' | 'presentation' | 'mixed';
  duration: number;
  questions: Question[];
  createdAt: string;
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
  responses: {
    questionId: string;
    response: string;
    duration: number;
    confidence: number;
    clarity: number;
    relevance: number;
    feedback: string;
    improvements: string[];
  }[];
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
}

interface SimulatorState {
  isActive: boolean;
  currentQuestionIndex: number;
  timeRemaining: number;
  isRecording: boolean;
  responses: string[];
  confidence: number[];
}

export default function InterviewSimulatorPage() {
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    isActive: false,
    currentQuestionIndex: 0,
    timeRemaining: 120,
    isRecording: false,
    responses: [],
    confidence: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'practice' | 'sessions' | 'analytics'>('practice');
  const [currentResponse, setCurrentResponse] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    if (simulatorState.isActive && simulatorState.timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setSimulatorState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (simulatorState.timeRemaining === 0) {
      handleNextQuestion();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [simulatorState.isActive, simulatorState.timeRemaining]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      setSessions([
        {
          id: '1',
          position: 'Software Engineer',
          company: 'Tech Corp',
          difficulty: 'mid',
          interviewType: 'technical',
          duration: 45,
          questions: generateMockQuestions('technical'),
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
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
        text: 'Explain the difference between REST and GraphQL APIs. When would you use each?',
        category: 'System Design',
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

  const startInterview = async (sessionConfig: {
    position: string;
    company: string;
    difficulty: string;
    type: string;
    duration: number;
  }) => {
    try {
      setLoading(true);

      const newSession: InterviewSession = {
        id: Date.now().toString(),
        position: sessionConfig.position,
        company: sessionConfig.company,
        difficulty: sessionConfig.difficulty as any,
        interviewType: sessionConfig.type as any,
        duration: sessionConfig.duration,
        questions: generateMockQuestions(sessionConfig.type),
        createdAt: new Date().toISOString()
      };

      setCurrentSession(newSession);
      setSimulatorState({
        isActive: true,
        currentQuestionIndex: 0,
        timeRemaining: newSession.questions[0]?.timeLimit || 180,
        isRecording: false,
        responses: [],
        confidence: []
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
      console.warn('Camera access denied:', error);
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
    const newConfidence = [...simulatorState.confidence, 3]; // Mock confidence score

    if (simulatorState.currentQuestionIndex < currentSession.questions.length - 1) {
      const nextIndex = simulatorState.currentQuestionIndex + 1;
      setSimulatorState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        timeRemaining: currentSession.questions[nextIndex]?.timeLimit || 180,
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

    // Generate mock results
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
        feedback: 'Good structure and relevant examples. Consider adding more specific metrics.',
        improvements: ['Add quantifiable results', 'Practice more concise delivery']
      })),
      strengths: [
        'Clear communication style',
        'Good use of examples',
        'Professional demeanor',
        'Technical knowledge'
      ],
      areasForImprovement: [
        'Time management',
        'More specific metrics',
        'Confidence in delivery',
        'Body language'
      ],
      recommendations: [
        'Practice the STAR method more',
        'Prepare specific metrics for your achievements',
        'Work on maintaining eye contact',
        'Practice in front of a mirror'
      ],
      nextSteps: [
        'Schedule follow-up practice session',
        'Review technical concepts',
        'Prepare company-specific examples',
        'Practice with a peer'
      ]
    };

    setResults(mockResults);
    setSimulatorState(prev => ({ ...prev, isActive: false }));
    setShowFeedback(true);
    stopCamera();
  };

  const resetInterview = () => {
    setCurrentSession(null);
    setResults(null);
    setSimulatorState({
      isActive: false,
      currentQuestionIndex: 0,
      timeRemaining: 120,
      isRecording: false,
      responses: [],
      confidence: []
    });
    setCurrentResponse('');
    setShowFeedback(false);
    stopCamera();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
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
              { id: 'sessions', label: 'Past Sessions', icon: FiClock },
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

        {/* Practice Session Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-8">
            {!currentSession && !showFeedback && (
              <InterviewSetup onStartInterview={startInterview} />
            )}

            {currentSession && !showFeedback && (
              <ActiveInterview
                session={currentSession}
                state={simulatorState}
                currentResponse={currentResponse}
                onResponseChange={setCurrentResponse}
                onNextQuestion={handleNextQuestion}
                onFinishInterview={() => finishInterview(simulatorState.responses, simulatorState.confidence)}
                onReset={resetInterview}
                videoRef={videoRef}
                mediaStream={mediaStream}
                formatTime={formatTime}
              />
            )}

            {showFeedback && results && (
              <InterviewFeedback
                results={results}
                onNewSession={resetInterview}
              />
            )}
          </div>
        )}

        {/* Past Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Interview Sessions
              </h3>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {session.position} - {session.company}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.interviewType} • {session.difficulty} level • {session.duration} min
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <PerformanceAnalytics />
          </div>
        )}
      </div>
    </div>
  );
}

// Interview Setup Component
function InterviewSetup({ onStartInterview }: { onStartInterview: (config: any) => void }) {
  const [config, setConfig] = useState({
    position: 'Software Engineer',
    company: 'Tech Company',
    difficulty: 'mid',
    type: 'behavioral',
    duration: 30
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Setup Your Interview Practice
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position
          </label>
          <input
            type="text"
            value={config.position}
            onChange={(e) => setConfig(prev => ({ ...prev, position: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company
          </label>
          <input
            type="text"
            value={config.company}
            onChange={(e) => setConfig(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty Level
          </label>
          <select
            value={config.difficulty}
            onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interview Type
          </label>
          <select
            value={config.type}
            onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="behavioral">Behavioral</option>
            <option value="technical">Technical</option>
            <option value="case">Case Study</option>
            <option value="presentation">Presentation</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => onStartInterview(config)}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center"
      >
        <FiPlay className="w-5 h-5 mr-2" />
        Start Interview Practice
      </button>
    </div>
  );
}

// Active Interview Component
function ActiveInterview({
  session,
  state,
  currentResponse,
  onResponseChange,
  onNextQuestion,
  onFinishInterview,
  onReset,
  videoRef,
  mediaStream,
  formatTime
}: any) {
  const currentQuestion = session.questions[state.currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Interview Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {session.position} Interview
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Question {state.currentQuestionIndex + 1} of {session.questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-2xl font-bold ${state.timeRemaining < 30 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
              {formatTime(state.timeRemaining)}
            </div>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              End Interview
            </button>
          </div>
        </div>
      </div>

      {/* Video and Question */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Video
          </h4>
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
                </div>
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
            <span className={`ml-auto px-2 py-1 rounded text-xs ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <p className="text-gray-900 dark:text-white text-lg mb-4">
            {currentQuestion.text}
          </p>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Category: {currentQuestion.category}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Tips:</h5>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              {currentQuestion.tips.map((tip: string, index: number) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
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
          placeholder="Type your response here or speak aloud..."
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <FiMic className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Use microphone for voice input
            </span>
          </div>
          <div className="space-x-3">
            {state.currentQuestionIndex < session.questions.length - 1 ? (
              <button
                onClick={onNextQuestion}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={onFinishInterview}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Finish Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Interview Feedback Component
function InterviewFeedback({ results, onNewSession }: { results: InterviewResults; onNewSession: () => void }) {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-6xl font-bold text-purple-600 mb-2">
            {results.overallScore}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Overall Interview Score
          </p>
          <div className="mt-4">
            {results.overallScore >= 80 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                <FiCheckCircle className="w-4 h-4 mr-1" />
                Excellent Performance
              </span>
            ) : results.overallScore >= 60 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                <FiStar className="w-4 h-4 mr-1" />
                Good Performance
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                <FiAlertTriangle className="w-4 h-4 mr-1" />
                Needs Improvement
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiTrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Strengths
            </h3>
          </div>
          <ul className="space-y-2">
            {results.strengths.map((strength, index) => (
              <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                <FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiTarget className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Areas for Improvement
            </h3>
          </div>
          <ul className="space-y-2">
            {results.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                <FiAlertTriangle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FiBookOpen className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recommendations for Improvement
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.recommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
            Next Steps
          </h3>
        </div>
        <div className="space-y-3">
          {results.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </div>
              <p className="text-purple-800 dark:text-purple-300">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onNewSession}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Start New Session
        </button>
        <button className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Download Report
        </button>
      </div>
    </div>
  );
}

// Performance Analytics Component
function PerformanceAnalytics() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Performance Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">156m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Practice Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
