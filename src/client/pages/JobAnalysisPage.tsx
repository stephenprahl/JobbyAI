import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiAlertTriangle, FiBriefcase, FiCheckCircle, FiClock, FiDollarSign, FiMapPin, FiTrendingUp, FiXCircle } from 'react-icons/fi'
import * as apiService from '../services/api'
import { JobAnalysis } from '../types'

const JobAnalysisPage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<JobAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [showToast, setShowToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      requirements: '',
      jobUrl: '',
    },
  })

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type })
    setTimeout(() => setShowToast(null), 3000)
  }

  const onSubmit = async (data: any) => {
    setIsAnalyzing(true)

    try {
      // Call the actual API
      const response = await apiService.analyzeJob(data)

      if (response.success && response.data) {
        setAnalysisResult(response.data)
        setActiveTab(1) // Switch to Analysis Results tab

        showToastMessage('Job analysis has been completed successfully.', 'success')
      } else {
        throw new Error(response.error || 'Failed to analyze job')
      }
    } catch (error: any) {
      showToastMessage(error.message || 'Failed to analyze job posting. Please try again.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    return 'Needs Improvement'
  }

  const handleReset = () => {
    reset()
    setAnalysisResult(null)
    setActiveTab(0)
  }

  const tabs = [
    'Job Information',
    ...(analysisResult ? ['Analysis Results'] : [])
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                  <FiXCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-bold text-lg">{showToast.message}</p>
                <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                  <div className="bg-white h-1 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left mb-16">
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute -top-4 -right-12 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-lg"></div>

              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <FiTrendingUp className="w-12 h-12 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-6xl lg:text-7xl font-black tracking-tight mb-4">
                    <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-blue-600 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                      AI Job Analysis
                    </span>
                  </h1>
                  <div className="flex justify-center lg:justify-start mb-6">
                    <div className="w-32 h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-full shadow-lg"></div>
                  </div>
                  <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-4xl leading-relaxed">
                    <span className="font-bold text-gray-800 dark:text-gray-200">Unlock your career potential</span> with our AI-powered analysis engine.
                    Get intelligent insights, detailed feedback, and actionable recommendations to
                    <span className="text-primary-600 dark:text-primary-400 font-semibold"> boost your application success rate</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="relative mb-12">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-2">
              <nav className="flex space-x-2">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(index)}
                    className={`flex-1 relative py-4 px-8 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 ${activeTab === index
                        ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-xl transform scale-[1.02] z-10'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30'
                      }`}
                  >
                    <span className="flex items-center justify-center space-x-3">
                      {index === 0 && (
                        <div className={`p-2 rounded-lg ${activeTab === index
                            ? 'bg-white/20'
                            : 'bg-primary-100 dark:bg-primary-900/30'
                          }`}>
                          <FiBriefcase className={`w-5 h-5 ${activeTab === index
                              ? 'text-white'
                              : 'text-primary-600 dark:text-primary-400'
                            }`} />
                        </div>
                      )}
                      {index === 1 && (
                        <div className={`p-2 rounded-lg ${activeTab === index
                            ? 'bg-white/20'
                            : 'bg-primary-100 dark:bg-primary-900/30'
                          }`}>
                          <FiTrendingUp className={`w-5 h-5 ${activeTab === index
                              ? 'text-white'
                              : 'text-primary-600 dark:text-primary-400'
                            }`} />
                        </div>
                      )}
                      <span>{tab}</span>
                    </span>
                    {activeTab === index && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Tab Content */}
          <div className="mt-8">
            {/* Job Information Tab */}
            {activeTab === 0 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10 overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-blue-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>

                  <div className="relative">
                    <div className="flex items-center space-x-6 mb-10">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-primary-500 to-blue-600 p-4 rounded-2xl shadow-xl">
                          <FiBriefcase className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-gray-950 dark:text-white tracking-tight mb-2">
                          Job Posting Details
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                          Provide comprehensive information for our AI to deliver precise analysis
                        </p>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="block text-sm font-black text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-2">
                            Job Title *
                          </label>
                          <div className="relative group">
                            <input
                              {...register('jobTitle', { required: true })}
                              placeholder="e.g. Senior Frontend Developer"
                              className="w-full px-6 py-5 bg-white/90 dark:bg-gray-700/90 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl group-hover:scale-[1.01]"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                                <FiBriefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-black text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-2">
                            Company Name *
                          </label>
                          <div className="relative group">
                            <input
                              {...register('companyName', { required: true })}
                              placeholder="e.g. Netflix, Google, Apple"
                              className="w-full px-6 py-5 bg-white/90 dark:bg-gray-700/90 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl group-hover:scale-[1.01]"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                                <FiMapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-black text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-2">
                          Job URL
                          <span className="text-gray-500 font-normal ml-2 text-xs">(Optional)</span>
                        </label>
                        <div className="relative group">
                          <input
                            {...register('jobUrl')}
                            placeholder="https://company.com/careers/job-posting-id"
                            type="url"
                            className="w-full px-6 py-5 bg-white/90 dark:bg-gray-700/90 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl group-hover:scale-[1.01]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>                    <div className="space-y-3">
                        <label className="block text-sm font-black text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-2">
                          Job Description *
                        </label>
                        <div className="relative group">
                          <textarea
                            {...register('jobDescription', { required: true })}
                            placeholder="Paste the complete job description here. Include responsibilities, requirements, benefits, and any other relevant details..."
                            rows={10}
                            className="w-full px-6 py-5 bg-white/90 dark:bg-gray-700/90 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 font-medium text-base leading-relaxed resize-y min-h-[280px] shadow-lg hover:shadow-xl group-hover:scale-[1.01]"
                          />
                          <div className="absolute top-5 right-6">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-black text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-2">
                          Key Requirements & Skills
                          <span className="text-gray-500 font-normal ml-2 text-xs">(Optional)</span>
                        </label>
                        <div className="relative group">
                          <textarea
                            {...register('requirements')}
                            placeholder="List specific skills, technologies, or requirements you want to highlight for analysis (e.g., React, TypeScript, 5+ years experience, etc.)..."
                            rows={6}
                            className="w-full px-6 py-5 bg-white/90 dark:bg-gray-700/90 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 font-medium text-base leading-relaxed resize-y min-h-[160px] shadow-lg hover:shadow-xl group-hover:scale-[1.01]"
                          />
                          <div className="absolute top-5 right-6">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600 hover:from-primary-600 hover:via-primary-700 hover:to-blue-700 text-white font-black text-xl py-6 px-10 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin w-7 h-7 border-3 border-white border-t-transparent rounded-full"></div>
                        <span className="relative z-10">Analyzing Job Match...</span>
                      </>
                    ) : (
                      <>
                        <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform duration-200">
                          <FiTrendingUp className="w-6 h-6" />
                        </div>
                        <span className="relative z-10">Analyze Job Match</span>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-black text-xl py-6 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transform hover:scale-[1.02]"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            )}

            {/* Analysis Results Tab */}
            {activeTab === 1 && analysisResult && (
              <div className="space-y-8">
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                        <FiTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h2 className="text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                        Match Score
                      </h2>
                    </div>
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className={`text-8xl font-black mb-6 ${analysisResult.matchScore >= 80 ? 'text-green-600 dark:text-green-400' :
                          analysisResult.matchScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                          {analysisResult.matchScore}%
                        </div>
                        <span className={`inline-flex items-center px-6 py-3 rounded-full text-base font-black uppercase tracking-wider ${getScoreColor(analysisResult.matchScore)}`}>
                          {getScoreLabel(analysisResult.matchScore)}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 shadow-inner">
                          <div
                            className={`h-6 rounded-full transition-all duration-1000 ease-out shadow-lg ${getProgressColor(analysisResult.matchScore)} relative overflow-hidden`}
                            style={{ width: `${analysisResult.matchScore}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">
                          <span>0%</span>
                          <span>Perfect Match</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Matching Skills */}
                  <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 rounded-2xl shadow-xl border border-green-200 dark:border-green-800/30 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full transform translate-x-12 -translate-y-12"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                            <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="text-2xl font-black text-green-700 dark:text-green-400 tracking-tight">
                            Matching Skills
                          </h3>
                        </div>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-black bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {analysisResult.matchingSkills.length} skills
                        </span>
                      </div>
                      <ul className="space-y-4">
                        {analysisResult.matchingSkills.map((skill, index) => (
                          <li key={index} className="flex items-center space-x-4 p-3 bg-white/70 dark:bg-gray-700/30 rounded-xl border border-green-200/50 dark:border-green-800/20">
                            <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-900 dark:text-gray-100 font-semibold">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800/30 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full transform translate-x-12 -translate-y-12"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                            <FiXCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                          <h3 className="text-2xl font-black text-red-700 dark:text-red-400 tracking-tight">
                            Missing Skills
                          </h3>
                        </div>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-black bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          {analysisResult.missingSkills.length} skills
                        </span>
                      </div>
                      <ul className="space-y-4">
                        {analysisResult.missingSkills.map((skill, index) => (
                          <li key={index} className="flex items-center space-x-4 p-3 bg-white/70 dark:bg-gray-700/30 rounded-xl border border-red-200/50 dark:border-red-800/20">
                            <FiXCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <span className="text-gray-900 dark:text-gray-100 font-semibold">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="card">
                  <h3 className="text-xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">
                    Job Details Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiBriefcase className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">Position:</span>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{analysisResult.jobDetails.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiMapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">Company:</span>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{analysisResult.jobDetails.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiClock className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">Type:</span>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{analysisResult.jobDetails.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiTrendingUp className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">Experience Required:</span>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{analysisResult.jobDetails.experience}</span>
                      </div>
                    </div>
                    {analysisResult.salaryRange && (
                      <div className="flex items-center space-x-3">
                        <FiDollarSign className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-gray-900 dark:text-gray-100">Salary Range:</span>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            {analysisResult.salaryRange.currency} {analysisResult.salaryRange.min.toLocaleString()} - {analysisResult.salaryRange.max.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="card">
                  <h3 className="text-xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">
                    Recommendations
                  </h3>
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">How to improve your match score:</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          Focus on the areas below to strengthen your application for this role.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <FiAlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 rounded-2xl shadow-lg border border-green-200 dark:border-green-800/30 p-6 text-center relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/20 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div className="relative">
                      <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl inline-block mb-4">
                        <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-3">
                        {analysisResult.matchingSkills.length}
                      </div>
                      <div className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                        Skills Match
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        out of {analysisResult.matchingSkills.length + analysisResult.missingSkills.length} required
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800/30 p-6 text-center relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-500/20 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div className="relative">
                      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-2xl inline-block mb-4">
                        <FiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-3">
                        {analysisResult.missingSkills.length}
                      </div>
                      <div className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                        Skills Gap
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        skills to learn
                      </div>
                    </div>
                  </div>

                  <div className={`bg-gradient-to-br ${analysisResult.matchScore >= 80 ? 'from-green-50 to-white dark:from-green-900/10 border-green-200 dark:border-green-800/30' :
                    analysisResult.matchScore >= 60 ? 'from-yellow-50 to-white dark:from-yellow-900/10 border-yellow-200 dark:border-yellow-800/30' :
                      'from-red-50 to-white dark:from-red-900/10 border-red-200 dark:border-red-800/30'
                    } dark:to-gray-800 rounded-2xl shadow-lg border p-6 text-center relative overflow-hidden hover:shadow-xl transition-shadow duration-300`}>
                    <div className={`absolute top-0 right-0 w-16 h-16 ${analysisResult.matchScore >= 80 ? 'bg-gradient-to-br from-green-500/20' :
                      analysisResult.matchScore >= 60 ? 'bg-gradient-to-br from-yellow-500/20' :
                        'bg-gradient-to-br from-red-500/20'
                      } to-transparent rounded-full transform translate-x-8 -translate-y-8`}></div>
                    <div className="relative">
                      <div className={`${analysisResult.matchScore >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                        analysisResult.matchScore >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          'bg-red-100 dark:bg-red-900/30'
                        } p-4 rounded-2xl inline-block mb-4`}>
                        <FiTrendingUp className={`w-8 h-8 ${analysisResult.matchScore >= 80 ? 'text-green-600 dark:text-green-400' :
                          analysisResult.matchScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`} />
                      </div>
                      <div className={`text-2xl font-black mb-3 ${analysisResult.matchScore >= 80 ? 'text-green-600 dark:text-green-400' :
                        analysisResult.matchScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                        {getScoreLabel(analysisResult.matchScore)}
                      </div>
                      <div className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                        Match Strength
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {analysisResult.matchScore}% compatibility
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobAnalysisPage
