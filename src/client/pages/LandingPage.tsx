import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiFileText,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiZap
} from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import DemoModal from '../components/DemoModal'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../contexts/AuthContext'


const LandingPageTailwind: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [footerModal, setFooterModal] = useState<{ title: string; content: React.ReactNode } | null>(null)

  const handleWatchDemo = useCallback(() => {
    setIsDemoModalOpen(true)
  }, [])

  // GSAP animation refs
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const bgTopRef = useRef<HTMLDivElement>(null)
  const bgBottomRef = useRef<HTMLDivElement>(null)
  // Add refs for header, footer, and modal for GSAP
  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    // Animate header (on mount)
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.05 })
    }
    // Animate background shapes for subtle movement (parallax)
    if (bgTopRef.current) {
      gsap.fromTo(bgTopRef.current, { opacity: 0, y: -60 }, { opacity: 0.7, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.2 })
    }
    if (bgBottomRef.current) {
      gsap.fromTo(bgBottomRef.current, { opacity: 0, y: 60 }, { opacity: 0.7, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.3 })
    }
    // Hero section: fade/slide/scale in children (on mount)
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 1, ease: 'power3.out', delay: 0.25 }
      )
    }
    // Features section: scroll-triggered
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.querySelectorAll('.card-hover'),
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.10, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            once: true
          }
        }
      )
      gsap.fromTo(
        featuresRef.current.querySelector('h2'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
            once: true
          }
        }
      )
    }
    // Benefits section: scroll-triggered
    if (benefitsRef.current) {
      const left = benefitsRef.current.querySelector('div > div')
      const right = benefitsRef.current.querySelector('.card')
      if (left) {
        gsap.fromTo(left, { opacity: 0, x: -40 }, {
          opacity: 1, x: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: left,
            start: 'top 80%',
            once: true
          }
        })
      }
      if (right) {
        gsap.fromTo(right, { opacity: 0, scale: 0.95 }, {
          opacity: 1, scale: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: right,
            start: 'top 80%',
            once: true
          }
        })
      }
    }
    // Pricing section: scroll-triggered
    if (pricingRef.current) {
      gsap.fromTo(
        pricingRef.current.querySelectorAll('.card-hover'),
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.10, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: pricingRef.current,
            start: 'top 80%',
            once: true
          }
        }
      )
      gsap.fromTo(
        pricingRef.current.querySelector('h2'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: pricingRef.current,
            start: 'top 85%',
            once: true
          }
        }
      )
    }
    // Trust section: scroll-triggered
    if (trustRef.current) {
      gsap.fromTo(
        trustRef.current.querySelectorAll('.text-center'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.10, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: trustRef.current,
            start: 'top 80%',
            once: true
          }
        }
      )
      gsap.fromTo(
        trustRef.current.querySelector('h2'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: trustRef.current,
            start: 'top 85%',
            once: true
          }
        }
      )
    }
    // CTA section: scroll-triggered
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current.querySelectorAll('h2, p, .flex, .mt-12'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.10, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            once: true
          }
        }
      )
    }
    // Footer (on mount)
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 1.5 }
      )
    }
    // Modal (on open)
    if (modalRef.current && isDemoModalOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, [isDemoModalOpen])

  const handleFooterInfo = (title: string, content: React.ReactNode) => {
    setFooterModal({ title, content })
  }

  const closeFooterModal = () => setFooterModal(null)

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
      title: 'Smart Template Selection',
      description: 'Access 3 to 50+ professionally designed templates. Our AI recommends the best template based on your industry and target role.',
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
    'ATS-friendly formats & keyword optimization',
    'Real-time job matching analysis',
    'Multiple export formats (PDF, Word, etc.)',
    'Professional template library (3-50+ designs)',
    'Industry-specific content suggestions',
    'Secure direct payment processing',
    'No hidden fees or complex billing'
  ]

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header ref={headerRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiFileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gradient tracking-tight">
                  JobbyAI
                </h1>
              </div>
              <div className="flex items-center space-x-6">
                <ThemeToggle />
                <RouterLink
                  to="/documentation"
                  className="text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Documentation
                </RouterLink>
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Welcome, {user?.email?.split('@')[0]}
                    </span>
                    <RouterLink
                      to="/dashboard"
                      className="btn btn-primary shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Go to Dashboard
                    </RouterLink>
                  </>
                ) : (
                  <>
                    <RouterLink
                      to="/login"
                      className="text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign In
                    </RouterLink>
                    <RouterLink
                      to="/register"
                      className="btn btn-primary shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Get Started
                    </RouterLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        {/* Enhanced animated background shapes */}
        <div ref={bgTopRef} className="pointer-events-none absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-primary-400/20 via-purple-400/10 to-blue-400/15 blur-3xl opacity-70 z-0" />
        <div ref={bgBottomRef} className="pointer-events-none absolute bottom-0 right-0 w-full h-96 bg-gradient-to-l from-secondary-400/20 via-pink-400/10 to-primary-400/15 blur-3xl opacity-70 z-0" />

        <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-32 pb-40 z-10">
          {/* Grid background pattern */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg width="100%" height="100%" className="w-full h-full" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-600" opacity="0.3" />
                </pattern>
                <pattern id="squares" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect x="10" y="10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-300 dark:text-primary-700" opacity="0.2" />
                  <rect x="50" y="50" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-300 dark:text-purple-700" opacity="0.2" />
                </pattern>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#squares)" />
              <rect width="100%" height="100%" fill="url(#heroGradient)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-5xl mx-auto">
              {/* Hero Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full px-6 py-3 mb-8 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    🚀 AI-Powered Resume Builder
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Join 15,000+ users
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-none">
                Create{' '}
                <span className="relative">
                  <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Winning
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-50"></div>
                </span>
                {' '}Resumes
                <br />
                with{' '}
                <span className="relative inline-block">
                  <span className="text-gradient bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    AI Precision
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-600/10 rounded-2xl -z-10 blur-xl"></div>
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium">
                Generate <span className="font-bold text-blue-600 dark:text-blue-400">ATS-optimized</span>,
                tailored resumes in <span className="font-bold text-purple-600 dark:text-purple-400">seconds</span>.
                Our advanced AI analyzes job postings and crafts{' '}
                <span className="font-bold text-pink-600 dark:text-pink-400">personalized content</span>{' '}
                that gets you noticed by hiring managers.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <RouterLink
                  to="/register"
                  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-xl font-bold px-12 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <span>Start Building Now</span>
                    <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </RouterLink>

                <button
                  onClick={handleWatchDemo}
                  className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-800 dark:text-gray-200 text-xl font-bold px-12 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <FiPlay className="w-5 h-5 text-white ml-0.5" />
                    </div>
                    <span>Watch Demo</span>
                  </div>
                  {isDemoModalOpen && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                  )}
                </button>
              </div>

              {/* Enhanced Stats with animations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="group text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">
                    95%
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-bold text-lg">
                    Match Rate
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                    Improvement
                  </div>
                </div>

                <div className="group text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">
                    15K+
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-bold text-lg">
                    Resumes
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                    Created
                  </div>
                </div>

                <div className="group text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">
                    3x
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-bold text-lg">
                    Interview
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                    Rate
                  </div>
                </div>

                <div className="group text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">
                    10s
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-bold text-lg">
                    Generation
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                    Time
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-16 flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium ml-4">
                    Join thousands of successful job seekers
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium ml-2">
                    4.9/5 from 2,000+ reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-24 bg-white dark:bg-gray-800 relative z-10">
          {/* Grid background pattern */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="featuresGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#featuresGrid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400 font-medium text-sm mb-6">
                ✨ Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Everything You Need to{' '}
                <span className="text-gradient">Land Your Dream Job</span>
              </h2>
              <p className="text-xl text-gray-800 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed font-medium">
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
                    <p className="text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section ref={benefitsRef} className="py-24 bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-900 dark:to-gray-800 relative z-10">
          {/* Grid background pattern */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="benefitsGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary-400 dark:text-primary-600" />
                  <circle cx="25" cy="25" r="1" fill="currentColor" className="text-primary-300 dark:text-primary-700" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#benefitsGrid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-success-50 dark:bg-success-900/30 rounded-full text-success-600 dark:text-success-400 font-medium text-sm mb-6">
                  🚀 Why Choose Us
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                  Stand Out from the{' '}
                  <span className="text-gradient">Competition</span>
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-200 mb-10 leading-relaxed font-medium">
                  Transform your job search with AI-powered resumes tailored to each application.
                  Our secure payment system ensures your data stays protected while you focus on landing your dream job.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-4 group">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-success-400 to-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <FiCheck className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
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
                    <p className="text-gray-700 dark:text-gray-200 mb-8 text-lg leading-relaxed font-medium">
                      Upload your existing resume or start from scratch and let our AI do the heavy lifting.
                    </p>
                    <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/50 dark:to-purple-900/50 rounded-2xl p-6">
                      <div className="text-4xl font-black text-gradient mb-2">95%</div>
                      <div className="text-gray-700 dark:text-gray-200 font-semibold">Match Rate Improvement</div>
                    </div>
                  </div>
                </div>
                {/* Floating decoration */}
                {/* Floating decoration removed for cleaner look */}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 relative z-10">
          {/* Grid background pattern */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-25">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="testimonialsGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300 dark:text-blue-700" />
                  <rect x="20" y="20" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400 dark:text-blue-600" opacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#testimonialsGrid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 font-medium text-sm mb-6">
                💬 Success Stories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                What Our Users{' '}
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Are Saying
                </span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
                Join thousands of professionals who have transformed their careers with our AI-powered platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative">
                  <div className="flex items-center space-x-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed mb-6 font-medium">
                    "JobbyAI helped me land my dream job at a Fortune 500 company. The AI-generated resume was so well-tailored that I got 5 interview calls in the first week!"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Sarah Chen</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Software Engineer at Google</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative">
                  <div className="flex items-center space-x-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed mb-6 font-medium">
                    "The job analysis feature is incredible! It showed me exactly what skills I was missing and helped me tailor my resume perfectly. 95% match score on my last application!"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Marcus Johnson</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Product Manager at Microsoft</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative">
                  <div className="flex items-center space-x-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed mb-6 font-medium">
                    "As a career changer, I was struggling to highlight transferable skills. JobbyAI's career development tools helped me identify and showcase my strengths perfectly."
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Aisha Patel</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">UX Designer at Airbnb</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Trusted by Professionals Worldwide
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Join the community that's revolutionizing job search success
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    250%
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-semibold">
                    Avg. Interview Increase
                  </div>
                </div>

                <div className="group">
                  <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    89%
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-semibold">
                    Job Offer Rate
                  </div>
                </div>

                <div className="group">
                  <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    24h
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-semibold">
                    Avg. First Response
                  </div>
                </div>

                <div className="group">
                  <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    4.9★
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 font-semibold">
                    User Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section ref={pricingRef} className="py-24 bg-white dark:bg-gray-800 relative z-10">
          {/* Grid background pattern */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-25">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="pricingGrid" width="70" height="70" patternUnits="userSpaceOnUse">
                  <path d="M 70 0 L 0 0 0 70" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-300 dark:text-purple-700" />
                  <rect x="15" y="15" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400 dark:text-purple-600" opacity="0.3" />
                  <rect x="43" y="43" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400 dark:text-purple-600" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pricingGrid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 font-medium text-sm mb-6">
                💎 Flexible Plans
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Choose Your Perfect{' '}
                <span className="text-gradient">Plan</span>
              </h2>
              <p className="text-xl text-gray-800 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed font-medium">
                From free basic templates to unlimited premium designs with industry-specific features,
                choose a plan that accelerates your career growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Free Plan */}
              <div className="card card-hover border-2 border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mb-4">$0</div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      3 resume generations
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      3 basic templates
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      5 job analyses
                    </div>
                  </div>
                  <RouterLink
                    to="/register"
                    className="btn btn-outline w-full"
                  >
                    Get Started
                  </RouterLink>
                </div>
              </div>

              {/* Basic Plan */}
              <div className="card card-hover border-2 border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Basic</h3>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mb-4">$9.99</div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      25 resume generations
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      15 professional templates
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      50 job analyses
                    </div>
                  </div>
                  <RouterLink
                    to="/subscription"
                    className="btn btn-primary w-full"
                  >
                    Choose Plan
                  </RouterLink>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="card card-hover border-2 border-primary-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
                  <div className="text-3xl font-black text-primary-600 dark:text-primary-400 mb-4">$19.99</div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Unlimited resumes
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      50+ premium templates
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Industry-specific designs
                    </div>
                  </div>
                  <RouterLink
                    to="/subscription"
                    className="btn btn-primary w-full"
                  >
                    Choose Plan
                  </RouterLink>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="card card-hover border-2 border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mb-4">$49.99</div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Everything in Pro
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Custom templates
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Team management
                    </div>
                  </div>
                  <RouterLink
                    to="/subscription"
                    className="btn btn-outline w-full"
                  >
                    Contact Sales
                  </RouterLink>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <FiCheck className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Secure Payment Processing</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <FiCheck className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">14-Day Free Trial</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <FiCheck className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Cancel Anytime</span>
                </div>
              </div>
              <RouterLink
                to="/subscription"
                className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              >
                View detailed comparison →
              </RouterLink>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section ref={trustRef} className="py-16 bg-gradient-to-r from-gray-50 to-primary-50/20 dark:from-gray-900 dark:to-gray-800 relative z-10">
          {/* Grid background pattern */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="trustGrid" width="45" height="45" patternUnits="userSpaceOnUse">
                  <path d="M 45 0 L 0 0 0 45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#trustGrid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Job Seekers Worldwide
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your data security and privacy are our top priorities. We use industry-leading encryption and secure payment processing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Direct card processing with bank-level encryption</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiZap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Instant Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Start building immediately after subscription</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiStar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Professional templates used by top companies</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiTarget className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Hidden Fees</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Transparent pricing with no surprise charges</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-24 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 relative overflow-hidden z-10">
          {/* Grid background pattern */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-15">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="ctaGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                  <rect x="25" y="25" width="15" height="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
                  <rect x="60" y="60" width="15" height="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctaGrid)" />
            </svg>
          </div>
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Land Your{' '}
              <span className="text-yellow-300">Dream Job?</span>
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join 15,000+ successful job seekers who transformed their careers with AI-powered resumes.
              Start your free trial today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <RouterLink
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-50 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
              >
                Start Free Trial Now
                <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </RouterLink>
              <RouterLink
                to="/subscription"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary-600 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200"
              >
                View All Plans
              </RouterLink>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <FiCheck className="h-5 w-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="h-5 w-5" />
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer ref={footerRef} className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FiFileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gradient">JobbyAI</h3>
                </div>
                <p className="text-gray-300 leading-relaxed max-w-md mb-6">
                  Transform your career with AI-powered resume creation. Professional templates,
                  secure payments, and intelligent job matching - all in one platform.
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
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Features', 'Explore AI-powered resume building, job analysis, and smart template selection.')}>Features</a></li>
                  <li><RouterLink to="/subscription" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Pricing</RouterLink></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Templates', 'Choose from a wide range of professional templates for every industry and career stage.')}>Templates</a></li>
                  <li><RouterLink to="/documentation" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">API</RouterLink></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-6">
                  Support
                </h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Help Center', 'Visit our Help Center for guides, troubleshooting, and tips.')}>Help Center</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Contact Us', 'Contact our support team at support@resumeplan.ai or use the in-app chat.')}>Contact Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('FAQ', 'Find answers to common questions about plans, payments, and features.')}>FAQ</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Status', 'Check the current status of our platform and services.')}>Status</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 font-medium">
                  &copy; 2025 JobbyAI. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Privacy', 'Read our privacy policy to learn how we protect your data.')}>Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Terms', 'Review our terms of service for using JobbyAI.')}>Terms</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium" onClick={() => handleFooterInfo('Security', 'Learn about our security practices and data protection measures.')}>Security</a>
                  {/* Footer Info Modal */}
                  {footerModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
                        <button onClick={closeFooterModal} className="absolute top-3 right-3 text-gray-400 hover:text-primary-500 text-2xl font-bold">&times;</button>
                        <h2 className="text-2xl font-bold mb-4 text-gradient">{footerModal.title}</h2>
                        <div className="text-gray-700 dark:text-gray-200 text-base">{footerModal.content}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal rendered outside main container */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  )
}

export default LandingPageTailwind
