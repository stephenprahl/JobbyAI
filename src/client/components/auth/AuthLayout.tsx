import React from 'react'
import { FiArrowLeft, FiShield, FiStar, FiUsers, FiZap } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  showFeatures?: boolean
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showFeatures = true
}) => {
  const features = [
    {
      icon: <FiZap className="h-6 w-6" />,
      title: "AI-Powered Resume Builder",
      description: "Create tailored resumes in minutes with our intelligent AI technology"
    },
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties"
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: "Trusted by 50k+ Users",
      description: "Join thousands of professionals who've landed their dream jobs"
    },
    {
      icon: <FiStar className="h-6 w-6" />,
      title: "Industry Expert Approved",
      description: "Templates and advice from hiring managers and career experts"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Features (hidden on mobile) */}
        {showFeatures && (
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-700"></div>
            <div className="relative z-10 flex flex-col justify-center p-12 text-white">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6 text-white">
                  Launch Your Career with{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    JobbyAI
                  </span>
                </h1>
                <p className="text-xl mb-12 text-purple-100">
                  The smartest way to create professional resumes, analyze job matches, and accelerate your career growth.
                </p>

                <div className="space-y-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className="text-yellow-300">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-white">
                          {feature.title}
                        </h3>
                        <p className="text-purple-100 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-300/20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-purple-400/20 rounded-full"></div>
            <div className="absolute top-1/2 right-0 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>
        )}

        {/* Right side - Auth Form */}
        <div className={`flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 ${showFeatures ? 'lg:w-1/2' : ''}`}>
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Header */}
            <div className="text-center">
              <RouterLink
                to="/"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-8 transition-colors duration-200 font-medium"
              >
                <FiArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </RouterLink>

              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  JobbyAI
                </h1>
                <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">
              <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                {children}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
