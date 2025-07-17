import React, { useEffect, useState } from 'react';
import {
  FiAward,
  FiBarChart,
  FiCalendar,
  FiClock,
  FiCode,
  FiDownload,
  FiEye,
  FiFilter,
  FiPlay,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiUser,
  FiVideo
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

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
}

interface FilterOptions {
  type: string;
  difficulty: string;
  company: string;
  dateRange: string;
  status: string;
}

const InterviewHistoryPage: React.FC = () => {
  const { user, token } = useAuth();

  // State
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Mock data for demonstration
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
        strengths: ['Strong algorithmic thinking', 'Clear communication', 'Good code structure'],
        improvements: ['Time management', 'Edge case handling'],
        detailedScores: {
          communication: 85,
          technical: 90,
          behavioral: 80,
          confidence: 88
        }
      },
      videoRecording: {
        url: '/recordings/session-1.mp4',
        duration: 2700,
        size: 256000000
      },
      codeSubmissions: [
        {
          questionId: 'q1',
          code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
          language: 'javascript',
          testsPassed: 15,
          totalTests: 15
        }
      ]
    },
    {
      id: '2',
      position: 'Product Manager',
      company: 'Meta',
      difficulty: 'mid',
      interviewType: 'behavioral',
      duration: 30,
      createdAt: '2025-07-14T14:15:00Z',
      score: 92,
      questionsCompleted: 6,
      totalQuestions: 6,
      status: 'completed',
      feedback: {
        overallScore: 92,
        strengths: ['Excellent storytelling', 'Strong leadership examples', 'Clear impact metrics'],
        improvements: ['Could dive deeper into failures', 'More technical understanding'],
        detailedScores: {
          communication: 95,
          technical: 75,
          behavioral: 98,
          confidence: 90
        }
      },
      videoRecording: {
        url: '/recordings/session-2.mp4',
        duration: 1800,
        size: 180000000
      }
    },
    {
      id: '3',
      position: 'Full Stack Developer',
      company: 'Microsoft',
      difficulty: 'mid',
      interviewType: 'mixed',
      duration: 60,
      createdAt: '2025-07-12T09:00:00Z',
      score: 78,
      questionsCompleted: 10,
      totalQuestions: 12,
      status: 'completed',
      feedback: {
        overallScore: 78,
        strengths: ['Good problem-solving approach', 'Decent coding skills'],
        improvements: ['System design knowledge', 'Confidence in answers', 'Time management'],
        detailedScores: {
          communication: 75,
          technical: 80,
          behavioral: 76,
          confidence: 70
        }
      },
      codeSubmissions: [
        {
          questionId: 'q1',
          code: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  \n  get(key) {\n    if (this.cache.has(key)) {\n      const value = this.cache.get(key);\n      this.cache.delete(key);\n      this.cache.set(key, value);\n      return value;\n    }\n    return -1;\n  }\n}',
          language: 'javascript',
          testsPassed: 8,
          totalTests: 10
        }
      ]
    },
    {
      id: '4',
      position: 'Data Scientist',
      company: 'Netflix',
      difficulty: 'senior',
      interviewType: 'case',
      duration: 50,
      createdAt: '2025-07-10T16:30:00Z',
      score: 84,
      questionsCompleted: 3,
      totalQuestions: 3,
      status: 'completed',
      feedback: {
        overallScore: 84,
        strengths: ['Strong analytical thinking', 'Good business understanding'],
        improvements: ['Statistical methodology', 'Presentation skills'],
        detailedScores: {
          communication: 80,
          technical: 88,
          behavioral: 82,
          confidence: 85
        }
      }
    },
    {
      id: '5',
      position: 'Frontend Engineer',
      company: 'Airbnb',
      difficulty: 'entry',
      interviewType: 'technical',
      duration: 25,
      createdAt: '2025-07-08T11:45:00Z',
      score: 65,
      questionsCompleted: 3,
      totalQuestions: 5,
      status: 'incomplete'
    }
  ];

  // Effects
  useEffect(() => {
    if (user) {
      fetchInterviewSessions();
    }
  }, [user]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [sessions, searchTerm, filters, sortBy, sortOrder]);

  // API functions
  const fetchInterviewSessions = async () => {
    try {
      setLoading(true);

      // Mock API call - replace with actual API
      setTimeout(() => {
        setSessions(mockSessions);
        setLoading(false);
      }, 1000);

      // Real API call would be:
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interview/sessions`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   setSessions(data.sessions || []);
      // }
    } catch (error) {
      console.error('Error fetching interview sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functions
  const applyFiltersAndSearch = () => {
    let filtered = [...sessions];

    // Apply search
    if (searchTerm.trim()) {
      filtered = filtered.filter(session =>
        session.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.type !== 'all') {
      filtered = filtered.filter(session => session.interviewType === filters.type);
    }
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(session => session.difficulty === filters.difficulty);
    }
    if (filters.company !== 'all') {
      filtered = filtered.filter(session => session.company === filters.company);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(session => session.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(session => new Date(session.createdAt) >= filterDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'score':
          comparison = (a.score || 0) - (b.score || 0);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredSessions(filtered);
  };

  // Utility functions
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
    switch (difficulty) {
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
    switch (type) {
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
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const downloadRecording = (session: InterviewSession) => {
    if (session.videoRecording) {
      // Mock download functionality
      const link = document.createElement('a');
      link.href = session.videoRecording.url;
      link.download = `interview-${session.company}-${session.position}-${session.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const retryInterview = (sessionId: string) => {
    // Navigate to interview simulator with similar configuration
    console.log('Retrying interview:', sessionId);
  };

  // Calculate statistics
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const averageScore = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <FiBarChart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Interview History
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Review your past interviews and track your progress
                </p>
              </div>
            </div>
            <button
              onClick={fetchInterviewSessions}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Sessions
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <FiAward className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(averageScore)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average Score
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                <FiClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Practice Time
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-3">
                <FiTrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedSessions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by position or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Filters
              </button>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
                <option value="duration-desc">Longest Duration</option>
                <option value="duration-asc">Shortest Duration</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="technical">Technical</option>
                    <option value="case">Case Study</option>
                    <option value="presentation">Presentation</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last 3 Months</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({
                      type: 'all',
                      difficulty: 'all',
                      company: 'all',
                      dateRange: 'all',
                      status: 'all'
                    })}
                    className="w-full px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interview Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBarChart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Interview Sessions Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || Object.values(filters).some(f => f !== 'all')
                  ? 'Try adjusting your search or filters.'
                  : 'Start your first practice session to see your interview history here.'
                }
              </p>
              <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Start New Interview
              </button>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {session.position}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <FiUser className="w-4 h-4" />
                          <span>{session.company}</span>
                          <span>•</span>
                          <FiCalendar className="w-4 h-4" />
                          <span>{formatDate(session.createdAt)}</span>
                        </div>
                      </div>
                      {session.score !== undefined && (
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(session.score)}`}>
                            {session.score}%
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Overall Score
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                        {session.difficulty} level
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(session.interviewType)}`}>
                        {session.interviewType}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs font-medium flex items-center">
                        <FiClock className="w-3 h-3 mr-1" />
                        {session.duration} min
                      </span>
                      {session.videoRecording && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-xs font-medium flex items-center">
                          <FiVideo className="w-3 h-3 mr-1" />
                          Recorded
                        </span>
                      )}
                      {session.codeSubmissions && session.codeSubmissions.length > 0 && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs font-medium flex items-center">
                          <FiCode className="w-3 h-3 mr-1" />
                          Code Submitted
                        </span>
                      )}
                    </div>

                    {session.questionsCompleted !== undefined && session.totalQuestions !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Progress: {session.questionsCompleted}/{session.totalQuestions} questions
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.round((session.questionsCompleted / session.totalQuestions) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(session.questionsCompleted / session.totalQuestions) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <FiEye className="w-4 h-4 mr-1" />
                      Review
                    </button>

                    {session.videoRecording && (
                      <button
                        onClick={() => downloadRecording(session)}
                        className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <FiDownload className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    )}

                    <button
                      onClick={() => retryInterview(session.id)}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      <FiPlay className="w-4 h-4 mr-1" />
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Interview Details
                  </h2>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Session Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Position:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{selectedSession.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Company:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{selectedSession.company}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Date:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{formatDate(selectedSession.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{selectedSession.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Type:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedSession.interviewType)}`}>
                            {selectedSession.interviewType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedSession.feedback && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Performance Scores
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(selectedSession.feedback.detailedScores).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{value}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                  style={{ width: `${value}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback */}
                  {selectedSession.feedback && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3">
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {selectedSession.feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start text-gray-700 dark:text-gray-300 text-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-3">
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {selectedSession.feedback.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start text-gray-700 dark:text-gray-300 text-sm">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Code Submissions */}
                  {selectedSession.codeSubmissions && selectedSession.codeSubmissions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Code Submissions
                      </h3>
                      <div className="space-y-4">
                        {selectedSession.codeSubmissions.map((submission, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Question {index + 1} ({submission.language})
                              </span>
                              <span className={`text-sm font-medium ${submission.testsPassed === submission.totalTests
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-yellow-600 dark:text-yellow-400'
                                }`}>
                                {submission.testsPassed}/{submission.totalTests} tests passed
                              </span>
                            </div>
                            <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                              <code>{submission.code}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  {selectedSession.videoRecording && (
                    <button
                      onClick={() => downloadRecording(selectedSession)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FiDownload className="w-4 h-4 mr-2" />
                      Download Recording
                    </button>
                  )}
                  <button
                    onClick={() => retryInterview(selectedSession.id)}
                    className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <FiPlay className="w-4 h-4 mr-2" />
                    Retry Interview
                  </button>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistoryPage;
