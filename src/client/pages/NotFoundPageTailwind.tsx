import React from 'react'
import { FiArrowLeft, FiHome } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

const NotFoundPageTailwind: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* 404 Illustration */}
          <div>
            <p className="text-8xl font-bold text-primary-500 leading-none">
              404
            </p>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered the wrong URL.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <RouterLink
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 text-lg"
            >
              <FiHome className="w-5 h-5 mr-2" />
              Go Home
            </RouterLink>
            <button
              onClick={() => window.history.back()}
              className="mx-auto flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPageTailwind
