import React, { useState } from 'react'
import { FiEye, FiEyeOff, FiRefreshCw } from 'react-icons/fi'
import EnhancedLoginPage from './pages/EnhancedLoginPage'
import EnhancedSignupPage from './pages/EnhancedSignupPage'
import LoginPageTailwind from './pages/LoginPage'

type ViewMode = 'enhanced-login' | 'enhanced-signup' | 'original-login' | 'original-signup'

const AuthComparison: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('enhanced-login')
  const [showOriginal, setShowOriginal] = useState(false)

  const views = {
    'enhanced-login': {
      title: 'Enhanced Login Page',
      component: <EnhancedLoginPage mode="login" />,
      description: 'Modern design with glassmorphism, animated features sidebar, enhanced form components'
    },
    'enhanced-signup': {
      title: 'Enhanced Signup Page',
      component: <EnhancedSignupPage />,
      description: 'Comprehensive signup flow with password strength meter, validation, and success states'
    },
    'original-login': {
      title: 'Original Login Page',
      component: <LoginPageTailwind mode="login" />,
      description: 'Original implementation for comparison'
    },
    'original-signup': {
      title: 'Original Signup Page',
      component: <LoginPageTailwind mode="register" />,
      description: 'Original registration flow for comparison'
    }
  }

  const currentViewData = views[currentView]

  if (showOriginal) {
    return (
      <div className="min-h-screen">
        {/* Floating controls */}
        <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowOriginal(false)}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiEyeOff className="h-4 w-4" />
              <span>Hide Controls</span>
            </button>
          </div>
        </div>

        {currentViewData.component}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Enhanced Authentication System
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Compare the enhanced login/signup experience with the original implementation
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowOriginal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiEye className="h-4 w-4" />
                <span>View Fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {Object.entries(views).map(([key, view]) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as ViewMode)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${currentView === key
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                {view.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Description */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {currentViewData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentViewData.description}
          </p>

          {/* Enhanced features highlight */}
          {currentView.includes('enhanced') && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                ✨ Enhanced Features:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700 dark:text-green-400">
                <div>• Glassmorphism design</div>
                <div>• Real-time validation</div>
                <div>• Password strength meter</div>
                <div>• Floating label animations</div>
                <div>• Enhanced social buttons</div>
                <div>• Loading states & transitions</div>
                <div>• Improved accessibility</div>
                <div>• Mobile-responsive design</div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Preview - {currentViewData.title}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Refresh preview"
              >
                <FiRefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden" style={{ height: '80vh' }}>
            <div className="absolute inset-0 overflow-auto">
              {currentViewData.component}
            </div>
          </div>
        </div>

        {/* Improvement Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              🎨 Visual Improvements
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Glassmorphism effects</li>
              <li>• Gradient backgrounds</li>
              <li>• Smooth animations</li>
              <li>• Modern typography</li>
              <li>• Enhanced color schemes</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              ⚡ Functionality Enhancements
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Real-time validation</li>
              <li>• Password strength meter</li>
              <li>• Social login integration</li>
              <li>• Loading states</li>
              <li>• Success feedback</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              ♿ Accessibility & UX
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• ARIA labels</li>
              <li>• Keyboard navigation</li>
              <li>• Screen reader support</li>
              <li>• Mobile optimization</li>
              <li>• Error announcements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthComparison
