import React, { useEffect, useRef, useState } from 'react';
import {
  FiActivity,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiMic,
  FiMicOff,
  FiPause,
  FiPlay,
  FiSettings,
  FiTarget
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

// Types
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
  mode: 'quick' | 'comprehensive' | 'custom';
}

interface InterviewFeedback {
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

interface PracticeConfig {
  mode: 'quick' | 'comprehensive' | 'custom';
  jobTitle: string;
  company: string;
  industry?: string;
  focusAreas?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  questionCount?: number;
}

const InterviewPrepPage: React.FC = () => {
  const { user, token } = useAuth();

  // State
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [loading, setLoading] = useState(false);
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

  // Refs
  const recognitionRef = useRef<any>(null);

  // Mock question database
  const questionDatabase: InterviewQuestion[] = [
    {
      id: '1',
      type: 'behavioral',
      difficulty: 'intermediate',
      question: 'Tell me about a time when you had to overcome a significant challenge at work.',
      category: 'Problem Solving',
      tips: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Be specific about your role and actions',
        'Quantify the impact when possible',
        'Show what you learned from the experience'
      ],
      sampleAnswer: 'When I was working as a software developer at XYZ Company, we faced a critical system outage...',
      followUpQuestions: [
        'How did you communicate this challenge to your team?',
        'What would you do differently if faced with a similar situation?'
      ],
      keywords: ['challenge', 'problem-solving', 'teamwork', 'leadership'],
      industry: 'Technology'
    },
    {
      id: '2',
      type: 'behavioral',
      difficulty: 'intermediate',
      question: 'Describe a situation where you had to work with a difficult team member.',
      category: 'Teamwork',
      tips: [
        'Focus on professional behavior',
        'Show empathy and understanding',
        'Highlight problem-solving skills',
        'Demonstrate leadership qualities'
      ],
      keywords: ['teamwork', 'conflict resolution', 'communication'],
      industry: 'General'
    },
    {
      id: '3',
      type: 'technical',
      difficulty: 'advanced',
      question: 'How would you design a scalable system to handle millions of users?',
      category: 'System Design',
      tips: [
        'Start with clarifying questions',
        'Break down the problem',
        'Consider scalability from the beginning',
        'Discuss trade-offs'
      ],
      keywords: ['system design', 'scalability', 'architecture'],
      industry: 'Technology'
    },
    {
      id: '4',
      type: 'situational',
      difficulty: 'intermediate',
      question: 'How would you handle a situation where you disagree with your manager\'s decision?',
      category: 'Leadership',
      tips: [
        'Show respect for authority',
        'Demonstrate professional communication',
        'Focus on constructive solutions',
        'Show willingness to collaborate'
      ],
      keywords: ['leadership', 'communication', 'conflict resolution'],
      industry: 'General'
    },
    {
      id: '5',
      type: 'company_specific',
      difficulty: 'intermediate',
      question: 'Why do you want to work for our company specifically?',
      category: 'Motivation',
      tips: [
        'Research the company thoroughly',
        'Connect your values with company values',
        'Mention specific products, services, or initiatives',
        'Show genuine enthusiasm'
      ],
      keywords: ['motivation', 'company research', 'values alignment'],
      industry: 'General'
    }
  ];

  // Effects
  useEffect(() => {
    if (user) {
      fetchInterviewSessions();
      setAvailableQuestions(questionDatabase);
      setFilteredQuestions(questionDatabase);
    }

    setupSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [user]);

  useEffect(() => {
    filterQuestions();
  }, [practiceConfig, availableQuestions]);

  // Setup speech recognition
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

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }
  };

  // Filter questions based on config
  const filterQuestions = () => {
    let filtered = [...availableQuestions];

    if (practiceConfig.industry && practiceConfig.industry !== '') {
      filtered = filtered.filter(q =>
        q.industry === practiceConfig.industry || q.industry === 'General'
      );
    }

    if (practiceConfig.difficulty) {
      filtered = filtered.filter(q => q.difficulty === practiceConfig.difficulty);
    }

    if (practiceConfig.focusAreas && practiceConfig.focusAreas.length > 0) {
      filtered = filtered.filter(q =>
        practiceConfig.focusAreas!.some(area =>
          q.category.toLowerCase().includes(area.toLowerCase()) ||
          q.keywords?.some(keyword =>
            keyword.toLowerCase().includes(area.toLowerCase())
          )
        )
      );
    }

    setFilteredQuestions(filtered);
  };

  // API functions
  const fetchInterviewSessions = async () => {
    try {
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
        setSessions([]);
      }
    } catch (error) {
      console.error('Error fetching interview sessions:', error);
      setSessions([]);
    }
  };

  // Interview control functions
  const startNewSession = async () => {
    try {
      setLoading(true);

      // Generate questions based on config
      let selectedQuestions = [...filteredQuestions];

      // Shuffle and select based on mode
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

      const questionCount = practiceConfig.mode === 'quick' ? 5 :
        practiceConfig.mode === 'comprehensive' ? 15 :
          practiceConfig.questionCount || 10;

      selectedQuestions = selectedQuestions.slice(0, questionCount);

      const newSession: InterviewSession = {
        id: Date.now().toString(),
        jobTitle: practiceConfig.jobTitle || 'General Position',
        company: practiceConfig.company || 'Practice Company',
        questions: selectedQuestions,
        responses: [],
        totalDuration: 0,
        averageScore: 0,
        mode: practiceConfig.mode
      };

      setCurrentSession(newSession);
      setCurrentQuestionIndex(0);
      setSessionStartTime(new Date());
      setQuestionStartTime(new Date());
      setCurrentResponse('');
      setFeedback(null);
      setIsPaused(false);
    } catch (error) {
      console.error('Error starting interview session:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const resetSession = () => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setCurrentResponse('');
    setSessionStartTime(null);
    setQuestionStartTime(null);
    setFeedback(null);
    setIsRecording(false);
    setIsPaused(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const submitResponse = async () => {
    if (!currentSession || !questionStartTime || !currentResponse.trim()) return;

    const duration = (new Date().getTime() - questionStartTime.getTime()) / 1000;
    const currentQuestion = currentSession.questions[currentQuestionIndex];

    try {
      // Mock API call for now
      const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const mockFeedback = generateMockFeedback(currentResponse, currentQuestion);

      // Update current session with response
      const updatedSession = {
        ...currentSession,
        responses: [
          ...currentSession.responses,
          {
            questionId: currentQuestion.id,
            response: currentResponse,
            duration,
            score: mockScore,
            feedback: mockFeedback
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
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const generateMockFeedback = (response: string, question: InterviewQuestion): string => {
    const responseLength = response.trim().split(' ').length;

    if (responseLength < 10) {
      return "Your response could be more detailed. Try to provide specific examples and elaborate on your experience.";
    } else if (responseLength > 200) {
      return "Good detail, but try to be more concise. Focus on the most relevant points and structure your answer clearly.";
    } else {
      return "Good response structure. Consider adding more specific metrics or quantifiable results to strengthen your answer.";
    }
  };

  const finishSession = async (session: InterviewSession) => {
    try {
      const totalDuration = sessionStartTime ? (new Date().getTime() - sessionStartTime.getTime()) / 1000 : 0;
      const averageScore = session.responses.reduce((sum, r) => sum + (r.score || 0), 0) / session.responses.length;

      // Generate comprehensive feedback
      const mockFeedback: InterviewFeedback = {
        overallScore: Math.round(averageScore),
        strengths: [
          'Clear communication style',
          'Good use of specific examples',
          'Professional presentation',
          'Structured responses'
        ],
        improvements: [
          'Add more quantifiable results',
          'Practice time management',
          'Include more technical details where relevant',
          'Work on confidence in delivery'
        ],
        keyPoints: [
          'Remember to use the STAR method for behavioral questions',
          'Prepare specific metrics and achievements',
          'Practice common questions for your industry',
          'Research the company thoroughly'
        ],
        recommended_practice: [
          'Behavioral Questions',
          'Technical Deep Dives',
          'Company Research',
          'Mock Presentations'
        ],
        detailedScores: {
          clarity: Math.floor(Math.random() * 30) + 70,
          relevance: Math.floor(Math.random() * 30) + 70,
          structure: Math.floor(Math.random() * 30) + 70,
          confidence: Math.floor(Math.random() * 30) + 70
        }
      };

      setFeedback(mockFeedback);
      setCurrentSession(null);
      setCurrentQuestionIndex(0);

      // Add to sessions list
      const completedSession = {
        ...session,
        totalDuration,
        averageScore: Math.round(averageScore),
        completedAt: new Date().toISOString()
      };
      setSessions(prev => [completedSession, ...prev]);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <FiActivity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Interview Preparation
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Practice with AI-powered mock interviews tailored to your target roles
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiSettings className="w-4 h-4 mr-2" />
              Configure
            </button>
          </div>
        </div>

        {!currentSession && !feedback && (
          <>
            {/* Configuration Panel */}
            {showConfig && (
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Practice Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={practiceConfig.jobTitle}
                      onChange={(e) => setPracticeConfig(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={practiceConfig.company}
                      onChange={(e) => setPracticeConfig(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g., Google"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <select
                      value={practiceConfig.industry}
                      onChange={(e) => setPracticeConfig(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Industries</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Practice Mode Selection */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose Your Practice Mode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setPracticeConfig(prev => ({ ...prev, mode: 'quick' }))}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${practiceConfig.mode === 'quick'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <FiClock className="w-5 h-5 text-blue-500 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Quick Practice</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    5-7 essential questions • 15-20 minutes
                  </p>
                </button>

                <button
                  onClick={() => setPracticeConfig(prev => ({ ...prev, mode: 'comprehensive' }))}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${practiceConfig.mode === 'comprehensive'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
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
                  onClick={() => setPracticeConfig(prev => ({ ...prev, mode: 'custom' }))}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${practiceConfig.mode === 'custom'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
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
                Ready to Start?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filteredQuestions.length} questions available for your configuration
              </p>
              <button
                onClick={startNewSession}
                disabled={loading || filteredQuestions.length === 0}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200 font-medium"
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
                <div className="flex items-center space-x-3">
                  <button
                    onClick={pauseSession}
                    className="p-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
                  >
                    {isPaused ? <FiPlay className="w-4 h-4" /> : <FiPause className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={resetSession}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    End Session
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
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
                      onClick={toggleVoiceInput}
                      className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors ${isRecording
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
                  disabled={isPaused}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                      disabled={!currentResponse.trim() || isPaused}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200"
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
                <FiAward className="w-6 h-6 text-green-500 mr-3" />
                Interview Complete - Your Results
              </h2>

              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {feedback.overallScore}%
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  Overall Performance Score
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(feedback.detailedScores).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{value}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</div>
                  </div>
                ))}
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
                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
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
                        <FiTarget className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
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
                    <div className="text-lg font-semibold text-blue-600">
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
};

export default InterviewPrepPage;
