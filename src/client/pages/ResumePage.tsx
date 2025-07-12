import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiCopy, FiDownload, FiEye, FiFileText, FiMinus, FiPlus } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import * as apiService from '../services/api'

const ResumePage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<string | null>(null)
  const [resumeFormat, setResumeFormat] = useState('markdown')
  const [activeTab, setActiveTab] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [showToast, setShowToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

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

  const onSubmit = async (data: any) => {
    setIsGenerating(true)

    try {
      // Call the actual API
      const response = await apiService.generateResume(data)

      if (response.success && response.data) {
        setGeneratedResume(response.data.content)
        setResumeFormat(response.data.format)
        setActiveTab(2) // Switch to Generated Resume tab

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
    'Job Information',
    'Resume Options',
    ...(generatedResume ? ['Generated Resume'] : [])
  ]

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${showToast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
          }`}>
          <p className="font-semibold">{showToast.message}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-black text-gray-950 dark:text-white mb-4 tracking-tight">
            AI Resume Builder
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 font-medium max-w-3xl">
            Generate a tailored, ATS-friendly resume based on specific job requirements using AI technology
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`py-4 px-2 border-b-2 font-bold text-sm tracking-wide transition-colors duration-200 ${activeTab === index
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        {/* Tab Content */}
        <div className="mt-8">
          {/* Job Information Tab */}
          {activeTab === 0 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">
                    Job Details
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    Provide information about the job you're targeting
                  </p>
                </div>

                <div className="space-y-6">
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
          {activeTab === 1 && (
            <div className="space-y-8">
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">
                    Format Options
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    Choose your preferred output format and content options
                  </p>
                </div>

                <div className="space-y-6">
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
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const current = watch('maxLength') || 1000
                            const newValue = Math.min(2000, current + 100)
                            register('maxLength').onChange({ target: { value: newValue } })
                          }}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">
                    Sections to Include
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    Select which sections to include in your resume
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'includeSummary', label: 'Professional Summary' },
                    { key: 'includeSkills', label: 'Technical Skills' },
                    { key: 'includeExperience', label: 'Work Experience' },
                    { key: 'includeEducation', label: 'Education' },
                    { key: 'includeCertifications', label: 'Certifications' },
                  ].map((section) => (
                    <div key={section.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <label className="font-bold text-gray-950 dark:text-white text-lg">
                        {section.label}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register(section.key as any)}
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isGenerating}
                className="w-full btn btn-primary text-lg py-4 font-bold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating Resume...</span>
                  </>
                ) : (
                  <>
                    <FiFileText className="w-5 h-5" />
                    <span>Generate Resume</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Resume Tab */}
          {activeTab === 2 && generatedResume && (
            <div className="space-y-8">
              <div className="card">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">
                      Your Generated Resume
                    </h2>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                        Generated
                      </span>
                      <span className="px-3 py-1 text-sm font-bold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                        {resumeFormat.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCopyToClipboard}
                      className="p-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Copy to clipboard"
                    >
                      <FiCopy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowPreview(true)}
                      className="p-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Preview"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      title="Download"
                    >
                      <FiDownload className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 max-h-[600px] overflow-y-auto">
                  <pre className="text-sm text-gray-950 dark:text-gray-50 whitespace-pre-wrap font-mono leading-relaxed">
                    {generatedResume}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowPreview(false)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-950 dark:text-white">Resume Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="btn btn-outline"
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
  )
}

export default ResumePage
