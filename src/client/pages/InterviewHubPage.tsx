import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import {
  FiBarChart,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiDownload,
  FiEye,
  FiFilter,
  FiLayers,
  FiPlay,
  FiSearch,
  FiSettings,
  FiTarget,
  FiUser,
  FiVideo,
  FiX
} from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CodingChallenge } from '../data/interviewData';

// Types
interface InterviewSession {
  id: string;
  position: string;
  company: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  interviewType: 'behavioral' | 'technical' | 'case' | 'presentation' | 'mixed';
  duration: number;
  createdAt: string;
  score?: number;
  questionsCompleted?: number;
  totalQuestions?: number;
  status: 'completed' | 'incomplete' | 'in_progress';
  feedback?: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    detailedScores: {
      communication: number;
      technical: number;
      behavioral: number;
      confidence: number;
    };
  };
  videoRecording?: {
    url: string;
    duration: number;
    size: number;
  };
  codeSubmissions?: Array<{
    questionId: string;
    code: string;
    language: string;
    testsPassed: number;
    totalTests: number;
  }>;
  questions?: Question[];
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

interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational' | 'company_specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  category: string;
  tips: string[];
  sampleAnswer?: string;
  followUpQuestions?: string[];
  keywords?: string[];
  industry?: string;
}

interface InterviewPrepFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyPoints: string[];
  recommended_practice: string[];
  detailedScores: {
    clarity: number;
    relevance: number;
    structure: number;
    confidence: number;
  };
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

interface FilterOptions {
  type: string;
  difficulty: string;
  company: string;
  dateRange: string;
  status: string;
}

interface PracticeConfig {
  mode: 'quick' | 'comprehensive' | 'custom';
  jobTitle: string;
  company: string;
  industry?: string;
  focusAreas?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  questionCount?: number;
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

export default function InterviewHubPage() {
  const { user, token } = useAuth();
  const location = useLocation();

  // Navigation state - automatically select tab based on route
  const getInitialTab = () => {
    if (location.pathname === '/interview-prep') return 'prep';
    if (location.pathname === '/interview-simulator') return 'simulator';
    if (location.pathname === '/interview-history') return 'history';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'prep' | 'simulator' | 'history'>(getInitialTab());
  const containerRef = useRef<HTMLDivElement>(null);

  // Common state
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Interview History State
  const [filteredSessions, setFilteredSessions] = useState<InterviewSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    difficulty: 'all',
    company: 'all',
    dateRange: 'all',
    status: 'all'
  });
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Interview Prep State
  const [currentPrepSession, setCurrentPrepSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [prepFeedback, setPrepFeedback] = useState<InterviewPrepFeedback | null>(null);
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig>({
    mode: 'quick',
    jobTitle: '',
    company: '',
    industry: '',
    focusAreas: [],
    difficulty: 'intermediate',
    questionCount: 5
  });
  const [isPaused, setIsPaused] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<InterviewQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>([]);

  // Interview Simulator State
  const [currentSimSession, setCurrentSimSession] = useState<InterviewSession | null>(null);
  const [simulatorResults, setSimulatorResults] = useState<InterviewResults | null>(null);
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
  const [showFeedback, setShowFeedback] = useState(false);

  // Define navigation tabs
  const navigationTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FiLayers,
      description: 'Interview hub dashboard and statistics'
    },
    {
      id: 'prep',
      label: 'Interview Prep',
      icon: FiBookOpen,
      description: 'Practice and prepare for interviews'
    },
    {
      id: 'simulator',
      label: 'Simulator',
      icon: FiVideo,
      description: 'Realistic interview simulation'
    },
    {
      id: 'history',
      label: 'History',
      icon: FiClock,
      description: 'Review past interview sessions'
    }
  ];

  // Mock data
  const mockSessions: InterviewSession[] = [
    {
      id: '1',
      position: 'Senior Software Engineer',
      company: 'Google',
      difficulty: 'senior',
      interviewType: 'technical',
      duration: 45,
      createdAt: '2025-07-15T10:30:00Z',
      score: 87,
      questionsCompleted: 8,
      totalQuestions: 10,
      status: 'completed',
      feedback: {
        overallScore: 87,
        strengths: ['Strong technical knowledge', 'Good problem-solving approach'],
        improvements: ['Speak more clearly', 'Provide more specific examples'],
        detailedScores: {
          communication: 85,
          technical: 92,
          behavioral: 78,
          confidence: 88
        }
      }
    },
    {
      id: '2',
      position: 'Frontend Developer',
      company: 'Meta',
      difficulty: 'mid',
      interviewType: 'behavioral',
      duration: 30,
      createdAt: '2025-07-14T14:20:00Z',
      score: 92,
      questionsCompleted: 6,
      totalQuestions: 6,
      status: 'completed',
      feedback: {
        overallScore: 92,
        strengths: ['Excellent communication', 'Great examples'],
        improvements: ['More confidence needed'],
        detailedScores: {
          communication: 95,
          technical: 88,
          behavioral: 94,
          confidence: 85
        }
      }
    },
    {
      id: '3',
      position: 'Data Scientist',
      company: 'Microsoft',
      difficulty: 'senior',
      interviewType: 'technical',
      duration: 60,
      createdAt: '2025-07-13T09:15:00Z',
      score: 78,
      questionsCompleted: 5,
      totalQuestions: 8,
      status: 'incomplete',
      feedback: {
        overallScore: 78,
        strengths: ['Good analytical thinking'],
        improvements: ['Need to complete more questions', 'Better time management'],
        detailedScores: {
          communication: 82,
          technical: 85,
          behavioral: 70,
          confidence: 75
        }
      }
    }
  ];

  // Animation effects
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  // Update active tab when route changes
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Animate tab transition
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach((button, index) => {
      if (button && navigationTabs[index]?.id !== activeTab) {
        gsap.to(button, {
          scale: 1,
          opacity: 0.7,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    // Animate active tab
    const activeButton = document.querySelector(`[data-tab="${activeTab}"]`);
    if (activeButton) {
      gsap.to(activeButton, {
        scale: 1.05,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [activeTab]);

  // Load mock data
  useEffect(() => {
    setSessions(mockSessions);
    setFilteredSessions(mockSessions);
  }, []);

  // Tab selection with animation
  const selectTab = (tabId: string) => {
    setActiveTab(tabId as any);

    // Animate tab content
    const tabIndex = navigationTabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
      gsap.fromTo(
        '.tab-content',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  };

  // Utility functions
  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'incomplete': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Interview Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your complete interview preparation and practice platform. Prepare, practice, and track your progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sessions.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FiPlay className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessions.filter(s => s.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Score</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FiBarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Practice Hours</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <FiClock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('prep')}
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FiBookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-blue-900 dark:text-blue-300">Start Practice</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Prepare for interviews</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <FiVideo className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-green-900 dark:text-green-300">Live Simulation</div>
              <div className="text-sm text-green-600 dark:text-green-400">Realistic interview practice</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <FiClock className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-purple-900 dark:text-purple-300">View History</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Review past sessions</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Sessions</h3>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
                    <FiPlay className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.position} at {session.company}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(session.createdAt)} • {session.duration}min
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {session.score && (
                    <span className={`font-semibold ${getScoreColor(session.score)}`}>
                      {session.score}%
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiPlay className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No interview sessions yet. Start practicing!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPrep = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Prep</h2>
          <p className="text-gray-600 dark:text-gray-400">Practice and prepare for your interviews</p>
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FiSettings className="w-4 h-4 mr-2" />
          Configure Practice
        </button>
      </div>

      {/* Practice Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
              <FiPlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Practice</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            5-minute sessions with common interview questions
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Start Quick Practice
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mr-3">
              <FiTarget className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comprehensive</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            In-depth practice with detailed feedback
          </p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start Comprehensive
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg mr-3">
              <FiCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Coding challenges and technical questions
          </p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Start Technical
          </button>
        </div>
      </div>

      {/* Recent Practice */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Practice Sessions</h3>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
                    <FiBookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.interviewType} Practice
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(session.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {session.score && (
                    <span className={`font-semibold ${getScoreColor(session.score)}`}>
                      {session.score}%
                    </span>
                  )}
                  <button className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiBookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No practice sessions yet. Start your first practice!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSimulator = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Simulator</h2>
          <p className="text-gray-600 dark:text-gray-400">Realistic interview simulation with AI feedback</p>
        </div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <FiVideo className="w-4 h-4 mr-2" />
          Start Simulation
        </button>
      </div>

      {/* Simulator Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Simulation Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${simulatorState.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}>
            {simulatorState.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {simulatorState.isActive ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Question Progress</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {simulatorState.currentQuestionIndex + 1} / 10
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((simulatorState.currentQuestionIndex + 1) / 10) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Remaining</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.floor(simulatorState.timeRemaining / 60)}:{(simulatorState.timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                {simulatorState.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                End Session
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FiVideo className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No active simulation. Start a new session to begin practicing.
            </p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Start New Simulation
            </button>
          </div>
        )}
      </div>

      {/* Simulation Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit mb-3">
            <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Behavioral</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Situational and behavioral questions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg w-fit mb-3">
            <FiCode className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Technical</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Coding challenges and technical problems
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg w-fit mb-3">
            <FiBarChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Case Study</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Business cases and problem-solving
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg w-fit mb-3">
            <FiVideo className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Presentation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Presentation and communication skills
          </p>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interview History</h2>
          <p className="text-gray-600 dark:text-gray-400">Review and analyze your past interview sessions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sessions</h3>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <FiPlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {session.position}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.company} • {session.interviewType} • {formatDate(session.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {session.score && (
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(session.score)}`}>
                          {session.score}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {session.duration}m
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {session.feedback && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.feedback.detailedScores.communication}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Communication</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.feedback.detailedScores.technical}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.feedback.detailedScores.behavioral}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Behavioral</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.feedback.detailedScores.confidence}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No interview sessions yet. Start practicing to see your history!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'prep':
        return renderPrep();
      case 'simulator':
        return renderSimulator();
      case 'history':
        return renderHistory();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {showToast && (
          <div className={`fixed top-8 right-8 z-50 p-6 rounded-2xl shadow-2xl transition-all duration-500 transform backdrop-blur-sm ${showToast.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border border-emerald-300/30'
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border border-red-300/30'
            } animate-in slide-in-from-right-5`}>
            <div className="flex items-center space-x-3">
              {showToast.type === 'success' ? (
                <div className="bg-white/20 p-1 rounded-full">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="bg-white/20 p-1 rounded-full">
                  <FiX className="w-5 h-5" />
                </div>
              )}
              <span className="font-medium">{showToast.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4">
            <FiLayers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interview Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {navigationTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
            {navigationTabs.map((tab, index) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => selectTab(tab.id)}
                className={`tab-button flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <tab.icon className={`w-6 h-6 transition-all duration-300 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'
                  } mr-3`} />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-8">
          <select
            value={activeTab}
            onChange={(e) => selectTab(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {navigationTabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            Section {navigationTabs.findIndex(tab => tab.id === activeTab) + 1} of {navigationTabs.length}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
