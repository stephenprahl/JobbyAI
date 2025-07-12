import React from 'react'
import { FiDownload, FiEdit3, FiEye, FiPlus, FiSave, FiStar } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

const ResumeBuilderPageTailwind: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create a professional resume tailored to your target job
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              <FiEye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
              <FiSave className="w-4 h-4 mr-2" />
              Save Resume
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Title */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume Title</h2>
              <input
                type="text"
                defaultValue="My Professional Resume"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                <button className="text-primary-600 hover:text-primary-700">
                  <FiEdit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Summary</h2>
                <button className="text-primary-600 hover:text-primary-700">
                  <FiEdit3 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h2>
                <button className="inline-flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Experience
                </button>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No work experience added yet. Click "Add Experience" to get started.
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
                <button className="inline-flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Education
                </button>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No education added yet. Click "Add Education" to get started.
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
                <button className="inline-flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Skill
                </button>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No skills added yet. Click "Add Skill" to get started.
              </div>
            </div>
          </div>

          {/* Right Panel - AI Assistant & Actions */}
          <div className="space-y-6">
            {/* AI Resume Generator */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FiStar className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Let our AI help you create a professional resume based on your profile and target job.
              </p>
              <div className="space-y-3">
                <textarea
                  placeholder="Paste a job description here to get AI-powered recommendations..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-md hover:from-purple-700 hover:to-primary-700 transition-all duration-200">
                  Generate with AI
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <FiEye className="w-4 h-4 mr-3" />
                  <span className="text-left">Preview Resume</span>
                </button>
                <button className="w-full flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <FiDownload className="w-4 h-4 mr-3" />
                  <span className="text-left">Download PDF</span>
                </button>
                <button className="w-full flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <FiSave className="w-4 h-4 mr-3" />
                  <span className="text-left">Save Draft</span>
                </button>
              </div>
            </div>

            {/* Resume Templates */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-primary-200 dark:border-primary-800 rounded-lg p-3 bg-primary-50 dark:bg-primary-900/20 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors duration-200">
                  <div className="text-xs font-medium text-primary-700 dark:text-primary-300">Professional</div>
                  <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">Clean & Modern</div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Creative</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Bold & Colorful</div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Minimalist</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Simple & Clean</div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Executive</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Formal & Classic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilderPageTailwind
