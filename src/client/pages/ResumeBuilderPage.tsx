import React from 'react'
import { FiDownload, FiEdit3, FiEye, FiFileText, FiPlus, FiSave, FiStar, FiZap } from 'react-icons/fi'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {/* Enhanced Header */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                    <FiFileText className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
                    Resume Builder
                  </h1>
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-200 font-medium max-w-2xl leading-relaxed">
                  Create a professional, ATS-friendly resume tailored to your target job with AI-powered assistance
                </p>
                <div className="flex items-center space-x-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  <FiZap className="w-4 h-4" />
                  <span>AI-Powered • ATS-Optimized • Professional Templates</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="btn btn-outline flex items-center justify-center space-x-2 text-base py-3 px-6 font-bold">
                  <FiEye className="w-5 h-5" />
                  <span>Preview</span>
                </button>
                <button className="btn btn-primary flex items-center justify-center space-x-2 text-base py-3 px-6 font-bold shadow-xl">
                  <FiSave className="w-5 h-5" />
                  <span>Save Resume</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Panel - Builder */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resume Title */}
              <div className="card card-hover">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl">
                    <FiEdit3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Resume Title</h2>
                </div>
                <input
                  type="text"
                  defaultValue="My Professional Resume"
                  className="profile-input text-lg"
                  placeholder="Give your resume a descriptive title..."
                />
              </div>

              {/* Personal Information */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                      <FiEdit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Personal Information</h2>
                  </div>
                  <button className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    <FiEdit3 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="profile-label">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
                      className="profile-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="profile-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Phone Number</label>
                    <input
                      type="tel"
                      className="profile-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Location</label>
                    <input
                      type="text"
                      className="profile-input"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                      <FiFileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Professional Summary</h2>
                  </div>
                  <button className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    <FiEdit3 className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  rows={5}
                  placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career goals. Focus on what makes you unique and valuable to employers..."
                  className="profile-textarea text-base leading-relaxed"
                />
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    💡 Pro Tip: Keep it concise (3-4 sentences) and quantify your achievements when possible.
                  </p>
                </div>
              </div>

              {/* Experience Section */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
                      <FiStar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Work Experience</h2>
                  </div>
                  <button className="btn btn-primary flex items-center space-x-2 py-3 px-5 font-bold shadow-lg">
                    <FiPlus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiStar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">No work experience added yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Start building your professional story by adding your work experience</p>
                  <button className="btn btn-outline font-bold">Add Your First Experience</button>
                </div>
              </div>

              {/* Education Section */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl">
                      <FiStar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Education</h2>
                  </div>
                  <button className="btn btn-primary flex items-center space-x-2 py-3 px-5 font-bold shadow-lg">
                    <FiPlus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiStar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">No education added yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Add your educational background and qualifications</p>
                  <button className="btn btn-outline font-bold">Add Your Education</button>
                </div>
              </div>

              {/* Skills Section */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
                      <FiZap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Skills</h2>
                  </div>
                  <button className="btn btn-primary flex items-center space-x-2 py-3 px-5 font-bold shadow-lg">
                    <FiPlus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiZap className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">No skills added yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Showcase your technical and soft skills</p>
                  <button className="btn btn-outline font-bold">Add Your Skills</button>
                </div>
              </div>
            </div>

            {/* Enhanced Right Panel - AI Assistant & Actions */}
            <div className="space-y-8">
              {/* AI Resume Generator */}
              <div className="card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-primary-500 rounded-full blur-3xl opacity-10"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-primary-600 p-3 rounded-2xl shadow-lg mr-4">
                      <FiStar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">AI Assistant</h3>
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Powered by AI</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 font-medium mb-6 leading-relaxed">
                    Let our AI analyze job requirements and optimize your resume content for maximum impact and ATS compatibility.
                  </p>
                  <div className="space-y-4">
                    <textarea
                      placeholder="Paste a job description here to get AI-powered recommendations and tailored content suggestions..."
                      rows={5}
                      className="profile-textarea text-sm"
                    />
                    <button className="w-full btn bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 text-white font-bold py-4 shadow-xl transform hover:scale-[1.02] transition-all duration-200">
                      <div className="flex items-center justify-center space-x-2">
                        <FiZap className="w-5 h-5" />
                        <span>Generate with AI</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 font-semibold group">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FiEye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 dark:text-white">Preview Resume</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">See how your resume looks</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 font-semibold group">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FiDownload className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 dark:text-white">Download PDF</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Export as PDF file</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 font-semibold group">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FiSave className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 dark:text-white">Save Draft</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Save your progress</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Resume Templates */}
              <div className="card">
                <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">Templates</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-5 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 hover:shadow-lg group">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-primary-700 dark:text-primary-300">Professional</div>
                        <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-1">Clean & Modern</div>
                      </div>
                      <div className="w-3 h-3 bg-primary-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    </div>
                  </div>
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-gray-700 dark:text-gray-300">Creative</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Bold & Colorful</div>
                      </div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    </div>
                  </div>
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-gray-700 dark:text-gray-300">Minimalist</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Simple & Clean</div>
                      </div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    </div>
                  </div>
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-gray-700 dark:text-gray-300">Executive</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Formal & Classic</div>
                      </div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
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

export default ResumeBuilderPageTailwind
