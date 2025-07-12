import React from 'react'
import { FiBriefcase, FiEdit, FiEye, FiFileText, FiPlus, FiStar, FiTrendingUp, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardPageTailwind: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Ready to take your job search to the next level?
          </p>
        </div>

        {/* New User Getting Started Card */}
        {isNewUser && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FiStar className="text-blue-500 w-5 h-5" />
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  Welcome to Resume Plan AI!
                </h2>
              </div>
              <p className="text-blue-600 dark:text-blue-400">
                Get started by creating your first AI-powered resume or analyzing a job posting to see how well you match.
              </p>
              <div className="flex space-x-4">
                <RouterLink
                  to="/resume/builder"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <FiFileText className="w-4 h-4 mr-2" />
                  Build Your Resume
                </RouterLink>
                <RouterLink
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  <FiBriefcase className="w-4 h-4 mr-2" />
                  Analyze a Job
                </RouterLink>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resumes Generated</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.resumesGenerated}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                {isNewUser ? 'Start creating!' : '+3 this week'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Jobs Analyzed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.jobsAnalyzed}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                {isNewUser ? 'Analyze jobs!' : '+7 this week'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Match Score</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.averageMatchScore}{isNewUser ? '' : '%'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <FiStar className="w-4 h-4 mr-1" />
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

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                <FiFileText className="w-8 h-8 text-blue-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Build a tailored resume with our AI-powered builder
                  </p>
                </div>
                <RouterLink
                  to="/resume/builder"
                  className="block w-full px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 text-center"
                >
                  Get Started
                </RouterLink>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                <FiBriefcase className="w-8 h-8 text-green-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analyze Job Posting</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    See how well your profile matches job requirements
                  </p>
                </div>
                <RouterLink
                  to="/jobs"
                  className="block w-full px-4 py-2 border border-green-600 text-green-600 dark:text-green-400 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 text-center"
                >
                  Get Started
                </RouterLink>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                <FiUser className="w-8 h-8 text-purple-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Profile</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Keep your profile information up to date
                  </p>
                </div>
                <RouterLink
                  to="/profile"
                  className="block w-full px-4 py-2 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 text-center"
                >
                  Get Started
                </RouterLink>
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
  )
}

export default DashboardPageTailwind
