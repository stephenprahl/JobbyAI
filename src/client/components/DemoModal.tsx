import React, { useEffect } from 'react'
import { FiPlay, FiX } from 'react-icons/fi'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              JobbyAI Demo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              See how our AI-powered resume builder works
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close demo modal"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Video Content */}
        <div className="p-6">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            {/* Placeholder for actual video - you can replace this with an actual video element */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-purple-600">
              <div className="text-center text-white">
                <FiPlay className="h-16 w-16 mx-auto mb-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
                <h3 className="text-2xl font-semibold mb-2">Interactive Demo</h3>
                <p className="text-lg opacity-90 max-w-md mx-auto mb-4">
                  Experience how JobbyAI transforms job postings into perfectly tailored,
                  ATS-optimized resumes
                </p>
                <div className="text-sm opacity-75 space-y-1">
                  <p>• Paste any job posting URL</p>
                  <p>• AI analyzes requirements instantly</p>
                  <p>• Generate ATS-friendly resume in 60 seconds</p>
                </div>
              </div>
            </div>

            {/* Uncomment and modify this when you have an actual demo video */}
            {/*
            <video
              className="w-full h-full object-cover"
              controls
              poster="/demo-thumbnail.jpg"
              preload="metadata"
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              <source src="/demo-video.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
            */}
          </div>

          {/* Features highlight */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                AI Analysis
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Analyzes job requirements automatically
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                ATS Friendly
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Optimized for applicant tracking systems
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                Quick Results
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate tailored resumes in minutes
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ready to create your perfect resume?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose()
                  // Navigate to register page
                  window.location.href = '/register'
                }}
                className="btn btn-primary px-6 py-2"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoModal