import React from 'react'
import { FiArrowLeft, FiShield, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

interface EnhancedAuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  showFeatures?: boolean
  variant?: 'default' | 'compact'
}

export const EnhancedAuthLayout: React.FC<EnhancedAuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showFeatures = true,
  variant = 'default'
}) => {
  const features = [
    {
      icon: <FiZap className="h-6 w-6" />,
      title: "AI-Powered Resume Builder",
      description: "Create tailored resumes in minutes with our intelligent AI technology",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: "Trusted by 50k+ Users",
      description: "Join thousands of professionals who've landed their dream jobs",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <FiTrendingUp className="h-6 w-6" />,
      title: "95% Success Rate",
      description: "Our users see an average 40% increase in interview invitations",
      color: "from-blue-400 to-indigo-500"
    }
  ]

  const stats = [
    { label: "Active Users", value: "50,000+" },
    { label: "Jobs Matched", value: "1.2M+" },
    { label: "Success Rate", value: "95%" },
  ]

  const isCompact = variant === 'compact'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-purple-200/30 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary-200/30 to-primary-200/30 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Features */}
        {showFeatures && !isCompact && (
          <div className="hidden lg:flex lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700" />

            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <circle cx="30" cy="30" r="2" fill="white" fillOpacity="0.1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 flex flex-col justify-center p-12 text-white">
              <div className="max-w-lg">
                {/* Logo and title */}
                <div className="mb-8">
                  <h1 className="text-5xl font-black mb-4 leading-tight">
                    Launch Your Career with{' '}
                    <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                      JobbyAI
                    </span>
                  </h1>
                  <p className="text-xl text-purple-100 leading-relaxed">
                    The smartest way to create professional resumes, analyze job matches, and accelerate your career growth.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-yellow-300 mb-1">{stat.value}</div>
                      <div className="text-sm text-purple-100">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="group flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className={`flex-shrink-0 p-3 bg-gradient-to-r ${feature.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 text-white group-hover:text-yellow-300 transition-colors duration-300">
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

            {/* Floating decorative elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
            <div className="absolute top-1/3 right-20 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
          </div>
        )}

        {/* Right side - Auth Form */}
        <div className={`flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 ${showFeatures && !isCompact ? 'lg:w-1/2' : ''}`}>
          <div className={`mx-auto w-full ${isCompact ? 'max-w-md' : 'max-w-lg'}`}>
            {/* Header */}
            <div className="text-center mb-8">
              <RouterLink
                to="/"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-8 transition-all duration-200 font-medium group"
              >
                <FiArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </RouterLink>

              <div className="mb-8">
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  JobbyAI
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                {title}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Form Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl py-8 px-6 lg:px-8 shadow-2xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
                {children}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200">
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

export default EnhancedAuthLayout
