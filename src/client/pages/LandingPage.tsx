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
import { ThemeToggle } from '../components/ThemeToggle'

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
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiFileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient tracking-tight">
                Resume Plan AI
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <RouterLink
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/register"
                className="btn btn-primary shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </RouterLink>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight">
              Build Your Perfect Resume with{' '}
              <span className="text-gradient">
                AI Power
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Create tailored, ATS-friendly resumes that get you noticed.
              Our AI analyzes job postings and crafts the perfect resume for each application.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <RouterLink
                to="/register"
                className="btn btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
              >
                Start Building Now
                <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </RouterLink>
              <RouterLink
                to="/demo"
                className="btn btn-outline text-lg px-8 py-4 hover:bg-white dark:hover:bg-gray-800"
              >
                Watch Demo
              </RouterLink>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">95%</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Match Rate Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Resumes Generated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">2x</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Interview Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400 font-medium text-sm mb-6">
              ✨ Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Everything You Need to{' '}
              <span className="text-gradient">Land Your Dream Job</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
                  className="card card-hover group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-success-50 dark:bg-success-900/30 rounded-full text-success-600 dark:text-success-400 font-medium text-sm mb-6">
                🚀 Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Stand Out from the{' '}
                <span className="text-gradient">Competition</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Transform your job search with resumes that are specifically
                tailored to each application using cutting-edge AI technology.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-success-400 to-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FiCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="card shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FiZap className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Generate in Seconds
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                    Upload your existing resume or start from scratch and let our AI do the heavy lifting.
                  </p>
                  <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/50 dark:to-purple-900/50 rounded-2xl p-6">
                    <div className="text-4xl font-black text-gradient mb-2">95%</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Match Rate Improvement</div>
                  </div>
                </div>
              </div>
              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Transform Your{' '}
            <span className="text-yellow-300">Job Search?</span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed their dream jobs using Resume Plan AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <RouterLink
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-50 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
            >
              Start Free Trial
              <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
            <RouterLink
              to="/pricing"
              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary-600 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200"
            >
              View Pricing
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiFileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient">Resume Plan AI</h3>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md mb-6">
                AI-powered resume builder that helps you land your dream job with
                tailored, ATS-friendly resumes that stand out.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <FiStar className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <FiTrendingUp className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <FiBriefcase className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-6">
                Product
              </h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Templates</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-6">
                Support
              </h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 font-medium">
                &copy; 2025 Resume Plan AI. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageTailwind
