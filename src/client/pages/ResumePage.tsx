import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiCopy, FiDownload, FiEdit, FiEye, FiFileText, FiMinus, FiPlus, FiX } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import * as apiService from '../services/api'

const ResumePage: React.FC = () => {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<string | null>(null)
  const [resumeFormat, setResumeFormat] = useState('markdown')
  const [activeTab, setActiveTab] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [showToast, setShowToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [isLoadingResumes, setIsLoadingResumes] = useState(false)
  const [selectedResume, setSelectedResume] = useState<any | null>(null)

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      requirements: '',
      format: 'markdown',
      includeSummary: true,
      includeSkills: true,
      includeExperience: true,
      includeEducation: true,
      includeCertifications: true,
      maxLength: 1000,
    },
  })

  const formatOptions = [
    { value: 'markdown', label: 'Markdown', description: 'Simple text format with formatting' },
    { value: 'html', label: 'HTML', description: 'Web-ready HTML format' },
    { value: 'text', label: 'Plain Text', description: 'Simple text without formatting' },
    { value: 'pdf', label: 'PDF', description: 'Coming soon...', disabled: true },
  ]

  const watchedFormat = watch('format')

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type })
    setTimeout(() => setShowToast(null), 3000)
  }

  // Load saved resumes on component mount
  useEffect(() => {
    loadSavedResumes()
  }, [])

  const loadSavedResumes = async () => {
    setIsLoadingResumes(true)
    try {
      const response = await apiService.getUserResumes()
      if (response.success) {
        setSavedResumes(response.data || [])
      } else {
        showToastMessage('Failed to load saved resumes', 'error')
      }
    } catch (error) {
      console.error('Error loading resumes:', error)
      showToastMessage('Failed to load saved resumes', 'error')
    } finally {
      setIsLoadingResumes(false)
    }
  }

  const viewResumeDetails = (resume: any) => {
    setSelectedResume(resume)
    setShowPreview(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const onSubmit = async (data: any) => {
    setIsGenerating(true)

    try {
      // Call the actual API
      const response = await apiService.generateResume(data)

      if (response.success && response.data) {
        setGeneratedResume(response.data.content)
        setResumeFormat(response.data.format)
        setActiveTab(3) // Switch to Generated Resume tab

        showToastMessage('Your tailored resume has been successfully generated.', 'success')
      } else {
        throw new Error(response.error || 'Failed to generate resume')
      }
    } catch (error: any) {
      showToastMessage(error.message || 'Failed to generate resume. Please try again.', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (generatedResume) {
      navigator.clipboard.writeText(generatedResume)
      showToastMessage('Resume content copied to clipboard.', 'success')
    }
  }

  const handleDownload = () => {
    if (generatedResume) {
      const blob = new Blob([generatedResume], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume.${resumeFormat === 'markdown' ? 'md' : resumeFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const tabs = [
    'My Resumes',
    'Job Information',
    'Resume Options',
    ...(generatedResume ? ['Generated Resume'] : [])
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {showToast && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${showToast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
            }`}>
            <p className="font-semibold">{showToast.message}</p>
          </div>
        )}

        <div className="space-y-10">
          {/* Enhanced Header */}
          <div className="relative">
            <div className="text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                      <FiFileText className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
                      My Resumes
                    </h1>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-200 font-medium max-w-2xl leading-relaxed">
                    Generate tailored, ATS-friendly resumes based on specific job requirements using AI technology
                  </p>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                    <FiFileText className="w-4 h-4" />
                    <span>AI-Powered • ATS-Optimized • Job-Specific</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-2 shadow-xl">
            <nav className="flex space-x-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${activeTab === index
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          {/* Enhanced Tab Content */}
          <div className="mt-10">
            {/* My Resumes Tab */}
            {activeTab === 0 && (
              <div className="space-y-8">
                <div className="card card-hover">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
                        <FiFileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                          My Resumes
                        </h2>
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {savedResumes.length} resume{savedResumes.length !== 1 ? 's' : ''} saved
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/resume/builder')}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Create New Resume</span>
                    </button>
                  </div>

                  {isLoadingResumes ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your resumes...</span>
                    </div>
                  ) : savedResumes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiFileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">No resumes yet</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first professional resume using our AI-powered builder</p>
                      <button
                        onClick={() => navigate('/resume/builder')}
                        className="btn btn-primary"
                      >
                        Create Your First Resume
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedResumes.map((resume) => (
                        <div key={resume.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {resume.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Created {formatDate(resume.createdAt)}
                              </p>
                              {resume.updatedAt !== resume.createdAt && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Updated {formatDate(resume.updatedAt)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">{resume.content?.personalInfo?.fullName || 'No name'}</span>
                              {resume.content?.personalInfo?.email && (
                                <span className="block">{resume.content.personalInfo.email}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewResumeDetails(resume)}
                              className="flex-1 btn btn-outline text-sm py-2 px-3 flex items-center justify-center space-x-1"
                            >
                              <FiEye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => navigate(`/resume/builder?edit=${resume.id}`)}
                              className="flex-1 btn btn-primary text-sm py-2 px-3 flex items-center justify-center space-x-1"
                            >
                              <FiEdit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Information Tab */}
            {activeTab === 1 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="card card-hover">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                      <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                        Job Details
                      </h2>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Step 1 of 2</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 font-medium mb-8 leading-relaxed">
                    Provide information about the job you're targeting to get the most tailored resume
                  </p>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="profile-label">Job Title</label>
                        <input
                          {...register('jobTitle', { required: true })}
                          placeholder="e.g. Senior Software Engineer"
                          className="profile-input"
                        />
                      </div>
                      <div>
                        <label className="profile-label">Company Name</label>
                        <input
                          {...register('companyName', { required: true })}
                          placeholder="e.g. Google"
                          className="profile-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="profile-label">Job Description</label>
                      <textarea
                        {...register('jobDescription', { required: true })}
                        placeholder="Paste the complete job description here..."
                        rows={6}
                        className="profile-textarea"
                      />
                      <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          💡 Pro Tip: Include the full job description for the most accurate AI optimization.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="profile-label">Key Requirements (Optional)</label>
                      <textarea
                        {...register('requirements')}
                        placeholder="List specific requirements or skills mentioned in the job posting..."
                        rows={4}
                        className="profile-textarea"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Resume Options Tab */}
            {activeTab === 2 && (
              <div className="space-y-8">
                <div className="card card-hover">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
                      <FiFileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                        Format Options
                      </h2>
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Step 2 of 2</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 font-medium mb-8 leading-relaxed">
                    Choose your preferred output format and content options
                  </p>

                  <div className="space-y-8">
                    <div>
                      <label className="profile-label">Output Format</label>
                      <select
                        {...register('format')}
                        value={watchedFormat}
                        className="profile-input"
                      >
                        {formatOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                          >
                            {option.label} - {option.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="profile-label">Maximum Length (words)</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          {...register('maxLength')}
                          min={500}
                          max={2000}
                          className="profile-input"
                        />
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              const current = watch('maxLength') || 1000
                              const newValue = Math.max(500, current - 100)
                              register('maxLength').onChange({ target: { value: newValue } })
                            }}
                            className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <FiMinus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const current = watch('maxLength') || 1000
                              const newValue = Math.min(2000, current + 100)
                              register('maxLength').onChange({ target: { value: newValue } })
                            }}
                            className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <FiPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                          📝 Recommended: 800-1200 words for optimal ATS scanning and readability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card card-hover">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                      <FiFileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                      Sections to Include
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 font-medium mb-8 leading-relaxed">
                    Select which sections to include in your resume
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'includeSummary', label: 'Professional Summary' },
                      { key: 'includeSkills', label: 'Technical Skills' },
                      { key: 'includeExperience', label: 'Work Experience' },
                      { key: 'includeEducation', label: 'Education' },
                      { key: 'includeCertifications', label: 'Certifications' },
                    ].map((section) => (
                      <div key={section.key} className="flex items-center justify-between p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group">
                        <label className="font-bold text-gray-950 dark:text-white text-lg cursor-pointer">
                          {section.label}
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(section.key as any)}
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 group-hover:scale-105 transition-transform"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isGenerating}
                  className="w-full btn bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white text-xl py-6 font-bold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                      <span>Generating Your Perfect Resume...</span>
                    </>
                  ) : (
                    <>
                      <FiFileText className="w-6 h-6" />
                      <span>Generate AI-Powered Resume</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Enhanced Generated Resume Tab */}
            {activeTab === 3 && generatedResume && (
              <div className="space-y-8">
                <div className="card card-hover relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-primary-500 rounded-full blur-3xl opacity-10"></div>
                  <div className="relative">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-green-500 to-primary-600 p-3 rounded-2xl shadow-lg">
                            <FiFileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                              Your Generated Resume
                            </h2>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Ready for Download</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400 rounded-full shadow-lg">
                            ✅ Generated
                          </span>
                          <span className="px-4 py-2 text-sm font-bold border-2 border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">
                            {resumeFormat.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleCopyToClipboard}
                          className="p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-lg group"
                          title="Copy to clipboard"
                        >
                          <FiCopy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => setShowPreview(true)}
                          className="p-4 border-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:shadow-lg group"
                          title="Preview"
                        >
                          <FiEye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={handleDownload}
                          className="p-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 group"
                          title="Download"
                        >
                          <FiDownload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 max-h-[600px] overflow-y-auto shadow-inner">
                      <pre className="text-sm text-gray-950 dark:text-gray-50 whitespace-pre-wrap font-mono leading-relaxed">
                        {generatedResume}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreview(false)}></div>
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-2 rounded-xl">
                        <FiEye className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Resume Preview</h3>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-8 overflow-y-auto max-h-[70vh] bg-white dark:bg-gray-800">
                    {resumeFormat === 'markdown' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{generatedResume || ''}</ReactMarkdown>
                      </div>
                    ) : resumeFormat === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: generatedResume || '' }} />
                    ) : (
                      <pre className="text-sm text-gray-950 dark:text-gray-50 whitespace-pre-wrap font-mono leading-relaxed">
                        {generatedResume}
                      </pre>
                    )}
                  </div>
                  <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="btn btn-outline font-bold px-6 py-3"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume Preview Modal */}
      {showPreview && selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedResume.title}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedResume.content?.personalInfo?.fullName}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                    {selectedResume.content?.personalInfo?.email && (
                      <span>{selectedResume.content.personalInfo.email}</span>
                    )}
                    {selectedResume.content?.personalInfo?.phone && (
                      <span>{selectedResume.content.personalInfo.phone}</span>
                    )}
                    {selectedResume.content?.personalInfo?.location && (
                      <span>{selectedResume.content.personalInfo.location}</span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {selectedResume.content?.summary && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Professional Summary</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedResume.content.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {selectedResume.content?.experiences?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Work Experience</h3>
                    <div className="space-y-4">
                      {selectedResume.content.experiences.map((exp: any) => (
                        <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                          {exp.description && (
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedResume.content?.education?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Education</h3>
                    <div className="space-y-3">
                      {selectedResume.content.education.map((edu: any) => (
                        <div key={edu.id}>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">{edu.institution}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {edu.startDate} - {edu.endDate}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {selectedResume.content?.skills?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResume.content.skills.map((skill: any) => (
                        <span
                          key={skill.id}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="btn btn-outline flex-1"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate(`/resume/builder?edit=${selectedResume.id}`)}
                  className="btn btn-primary flex-1"
                >
                  Edit Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumePage
