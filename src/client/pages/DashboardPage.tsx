import React from 'react'
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBarChart,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiDollarSign,
  FiDownload,
  FiEdit, FiEye, FiFileText,
  FiHeart,
  FiPlus,
  FiRefreshCw,
  FiStar,
  FiTarget,
  FiTrendingUp, FiUser,
  FiUsers
} from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import SubscriptionDashboard from '../components/SubscriptionDashboard'
import { useAuth } from '../contexts/AuthContext'

const DashboardPageTailwind: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading your dashboard...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Preparing your personalized experience</p>
          </div>
        </div>
      </div>
    )
  }

  // Use mock data for now since we removed the user profile query
  const userData = {
    resumes: [] as any[],
    jobListings: [] as any[],
    experiences: [] as any[],
    skills: [] as any[],
    lastLoginAt: user ? new Date().toISOString() : null
  }
  const resumes = userData?.resumes || []
  const jobListings = userData?.jobListings || []
  const experiences = userData?.experiences || []
  const skills = userData?.skills || []

  // Check if this is a new user (simplified check)
  const isNewUser = !userData?.lastLoginAt || new Date(userData.lastLoginAt).getTime() > Date.now() - 60000 // Less than 1 minute ago

  // Calculate stats from real data
  const stats = {
    resumesGenerated: resumes.length,
    jobsAnalyzed: jobListings.length,
    averageMatchScore: jobListings.length > 0 ?
      Math.round(jobListings.reduce((sum, job) => sum + ((job as any).matchScore || 0), 0) / jobListings.length) : 0,
    lastActivity: userData?.lastLoginAt ?
      new Date(userData.lastLoginAt).toLocaleDateString() : 'Just now',
  }

  // Recent resumes from real data
  const recentResumes = resumes.slice(-3).map(resume => ({
    id: resume.id,
    title: resume.title,
    company: 'Various',
    matchScore: Math.floor(Math.random() * 20) + 70, // Placeholder until we have real match scores
    createdAt: new Date(resume.createdAt).toLocaleDateString(),
    status: resume.isPublic ? 'Active' : 'Draft'
  }))

  // Recent job applications from real data
  const recentJobs = jobListings.slice(-3).map(job => ({
    id: job.id,
    title: job.title,
    company: job.companyName,
    matchScore: (job as any).matchScore || Math.floor(Math.random() * 20) + 70,
    appliedDate: job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : 'Not applied',
    status: job.status || 'Saved'
  }))

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Enhanced Welcome Section */}
          <div className="text-center lg:text-left">
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute -top-4 -right-12 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-lg"></div>

              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <FiUser className="w-12 h-12 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-6xl lg:text-7xl font-black tracking-tight mb-4">
                    <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-blue-600 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Welcome back, {user?.firstName || 'there'}!
                    </span>
                    <span className="text-4xl ml-4">👋</span>
                  </h1>
                  <div className="flex justify-center lg:justify-start mb-6">
                    <div className="w-32 h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-full shadow-lg"></div>
                  </div>
                  <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-4xl leading-relaxed">
                    <span className="font-bold text-gray-800 dark:text-gray-200">Ready to accelerate your career?</span> Let's build something amazing together and
                    <span className="text-primary-600 dark:text-primary-400 font-semibold"> take your job search to the next level</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced New User Getting Started Card */}
          {isNewUser && (
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-800/30 rounded-3xl p-8 overflow-hidden shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-xl transform -translate-x-12 translate-y-12"></div>

              <div className="relative space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl">
                    <FiStar className="text-white w-6 h-6" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  </div>
                  <h2 className="text-2xl font-black text-blue-700 dark:text-blue-300 tracking-tight">
                    Welcome to JobbyAI!
                  </h2>
                </div>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                  🚀 Get started by creating your first AI-powered resume or analyzing a job posting to see how well you match.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <RouterLink
                    to="/resume/builder"
                    className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform duration-200">
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <span>Build Your Resume</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </RouterLink>
                  <RouterLink
                    to="/jobs"
                    className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                      <FiBriefcase className="w-5 h-5" />
                    </div>
                    <span>Analyze a Job</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                    <FiFileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Resumes Generated</p>
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-2">{stats.resumesGenerated}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center font-medium">
                  <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  {isNewUser ? 'Start creating!' : '+3 this week'}
                </p>
              </div>
            </div>

            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                    <FiBriefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Jobs Analyzed</p>
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-2">{stats.jobsAnalyzed}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center font-medium">
                  <FiTrendingUp className="w-4 h-4 mr-1 text-blue-500" />
                  {isNewUser ? 'Analyze jobs!' : '+7 this week'}
                </p>
              </div>
            </div>

            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-xl">
                    <FiStar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Avg. Match Score</p>
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-2">{stats.averageMatchScore}{isNewUser ? '' : '%'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center font-medium">
                  <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                  {isNewUser ? 'Start analyzing!' : 'Excellent'}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Activity</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.lastActivity}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{isNewUser ? 'Welcome!' : 'Resume generated'}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Analytics Overview */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                  Your Career Analytics
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  Track your job search progress and optimize your strategy
                </p>
              </div>
              <div className="flex space-x-3 mt-4 lg:mt-0">
                <button className="group flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <FiRefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Refresh Data</span>
                </button>
                <button className="flex items-center space-x-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <FiDownload className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                    <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                    +12%
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Response Rate
                </h3>
                <p className="text-3xl font-black text-green-600 dark:text-green-400 mb-2">
                  {isNewUser ? '0%' : '78%'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {isNewUser ? 'Apply to jobs to track' : 'Above industry average'}
                </p>
              </div>

              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                    <FiTarget className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                    +5
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Active Applications
                </h3>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-2">
                  {isNewUser ? '0' : '23'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {isNewUser ? 'Start applying!' : 'Interviews pending'}
                </p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200/50 dark:border-purple-800/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                    <FiAward className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                    NEW
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Skills Score
                </h3>
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-2">
                  {isNewUser ? '-' : '92'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {isNewUser ? 'Complete profile' : 'Top 10% in industry'}
                </p>
              </div>

              <div className="group bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-800/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
                    <FiDollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded-full">
                    AVG
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Salary Range
                </h3>
                <p className="text-3xl font-black text-orange-600 dark:text-orange-400 mb-2">
                  {isNewUser ? '$-' : '$85K'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {isNewUser ? 'Set target salary' : 'Based on profile'}
                </p>
              </div>
            </div>

            {/* Career Progress Chart */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Career Progress Timeline
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiActivity className="w-4 h-4" />
                  <span>Last 30 days</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Profile Optimization Complete</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Improved match score by 15%</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">New Resume Generated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tailored for Software Engineer role</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">5 days ago</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <FiBriefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Applied to 12 Positions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Focused on tech companies</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">1 week ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions with More Features */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <RouterLink
                to="/career-development"
                className="group flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors duration-200"
              >
                <span>Career Development</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </RouterLink>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative space-y-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
                    <FiFileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      Create AI Resume
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      Build a tailored resume with our advanced AI-powered builder in minutes
                    </p>
                  </div>
                  <RouterLink
                    to="/resume/builder"
                    className="group/btn flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span>Get Started</span>
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </RouterLink>
                </div>
              </div>

              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative space-y-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
                    <FiBriefcase className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      Analyze Job Match
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      See how well your profile matches job requirements and get improvement tips
                    </p>
                  </div>
                  <RouterLink
                    to="/jobs"
                    className="group/btn flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span>Analyze Now</span>
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </RouterLink>
                </div>
              </div>

              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative space-y-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
                    <FiTarget className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      Career Development
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      Set goals, track progress, and accelerate your career growth
                    </p>
                  </div>
                  <RouterLink
                    to="/career-development"
                    className="group/btn flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span>Start Planning</span>
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          {/* New Features Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-xl">
                  <FiStar className="text-white w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                  ✨ New Features Available
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <FiBookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Interview Prep</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Practice with AI-generated questions tailored to your target roles
                  </p>
                  <RouterLink
                    to="/interview-prep"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-sm flex items-center space-x-1"
                  >
                    <span>Try Now</span>
                    <FiArrowRight className="w-3 h-3" />
                  </RouterLink>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <FiUsers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Network Builder</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Connect with professionals in your industry and expand your network
                  </p>
                  <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm flex items-center space-x-1">
                    <span>Coming Soon</span>
                    <FiHeart className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <FiBarChart className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Salary Insights</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get real-time salary data and negotiation tips for your roles
                  </p>
                  <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm flex items-center space-x-1">
                    <span>Coming Soon</span>
                    <FiTrendingUp className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Resumes</h2>
                <RouterLink
                  to="/resume"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  View All
                </RouterLink>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="space-y-4">
                  {recentResumes.map((resume) => (
                    <div key={resume.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{resume.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {resume.company} • {resume.createdAt}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getScoreColor(resume.matchScore)}`}>
                            {resume.matchScore}% match
                          </span>
                          <span className="px-2 py-1 rounded-md text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700">
                            {resume.status}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              aria-label="View resume"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              aria-label="Edit resume"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Job Applications</h2>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="space-y-4">
                  {recentJobs.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No job applications yet. Start by analyzing some job listings!
                    </p>
                  ) : (
                    recentJobs.map((job) => (
                      <div key={job.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">{job.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Applied: {job.appliedDate}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getScoreColor(job.matchScore)}`}>
                              {job.matchScore}% match
                            </span>
                            <span className="px-2 py-1 rounded-md text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700">
                              {job.status}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label="View job"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label="Edit application"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8">
                <SubscriptionDashboard />
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tips & Insights</h2>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="space-y-3">
                      <FiTrendingUp className="text-green-500 w-6 h-6" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Great Progress!</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your average match score has improved by 12% this month.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="space-y-3">
                      <FiStar className="text-blue-500 w-6 h-6" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Pro Tip</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Adding quantifiable achievements can boost your match score by up to 15%.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="space-y-3">
                      <FiBriefcase className="text-purple-500 w-6 h-6" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Trending Skills</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          React, TypeScript, and AWS are highly sought after this week.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPageTailwind
