import React from 'react'
import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiFileText,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

const LandingPageTailwind: React.FC = () => {
  const features = [
    {
      icon: FiFileText,
      title: 'AI-Powered Resume Builder',
      description: 'Create tailored resumes that match job requirements using advanced AI technology.',
      color: 'from-primary-400 to-primary-600',
    },
    {
      icon: FiBriefcase,
      title: 'Job Analysis',
      description: 'Analyze job postings and get insights on how well your profile matches the requirements.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: FiZap,
      title: 'Quick Generation',
      description: 'Generate professional resumes in seconds, not hours.',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: FiTarget,
      title: 'Targeted Content',
      description: 'Every resume is customized to highlight the most relevant skills and experiences.',
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: FiStar,
      title: 'Multiple Formats',
      description: 'Export your resume in various formats including PDF, HTML, and Markdown.',
      color: 'from-secondary-400 to-secondary-600',
    },
    {
      icon: FiTrendingUp,
      title: 'Improve Match Score',
      description: 'Get suggestions to improve your resume and increase your job match score.',
      color: 'from-purple-400 to-purple-600',
    },
  ]

  const benefits = [
    'AI-powered content generation',
    'ATS-friendly formats',
    'Real-time job matching',
    'Multiple export options',
    'Professional templates',
    'Industry-specific suggestions'
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Resume Plan AI
            </h1>
            <div className="flex items-center space-x-4">
              <RouterLink
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Get Started
              </RouterLink>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build Your Perfect Resume with{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Create tailored, ATS-friendly resumes that get you noticed.
            Our AI analyzes job postings and crafts the perfect resume for each application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <RouterLink
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center gap-2"
            >
              Start Building Now
              <FiArrowRight className="h-5 w-5" />
            </RouterLink>
            <RouterLink
              to="/demo"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Watch Demo
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features to Land Your Dream Job
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need to create compelling resumes
              that stand out in today's competitive job market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Resume Plan AI?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Stand out from the competition with resumes that are specifically
                tailored to each job application using cutting-edge AI technology.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center flex-shrink-0">
                      <FiCheck className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiZap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Generate in Seconds
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Upload your existing resume or start from scratch and let our AI do the heavy lifting.
                  </p>
                  <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900 dark:to-purple-900 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">95%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Match Rate Improvement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who have successfully landed their dream jobs using Resume Plan AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <FiArrowRight className="h-5 w-5" />
            </RouterLink>
            <RouterLink
              to="/pricing"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              View Pricing
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Resume Plan AI</h3>
              <p className="text-gray-400">
                AI-powered resume builder that helps you land your dream job.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Support
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Resume Plan AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageTailwind
