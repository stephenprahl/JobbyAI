import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef, useState } from 'react';
import {
  FiArrowRight,
  FiAward,
  FiBook,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiCode,
  FiCopy,
  FiDatabase,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiHelpCircle,
  FiMail,
  FiPlay,
  FiSearch,
  FiSend,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DocumentationPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Animation refs
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }
      );
    }

    // Navigation animation
    if (navRef.current) {
      gsap.fromTo(
        navRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.6, ease: "power2.out", delay: 0.3 }
      );
    }
  }, []);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBook },
    { id: 'quickstart', label: 'Quick Start', icon: FiZap },
    { id: 'api', label: 'API Reference', icon: FiCode },
    { id: 'examples', label: 'Examples', icon: FiPlay },
    { id: 'guides', label: 'Guides', icon: FiFileText },
    { id: 'faq', label: 'FAQ', icon: FiHelpCircle },
    { id: 'support', label: 'Support', icon: FiMail },
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/v1/auth/login',
      description: 'Authenticate user and get access token',
      category: 'Authentication'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/auth/register',
      description: 'Register new user account',
      category: 'Authentication'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/user/profile',
      description: 'Get user profile information',
      category: 'User Management'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/resume/generate',
      description: 'Generate AI-powered resume',
      category: 'Resume Generation'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/resume/templates',
      description: 'Get available resume templates',
      category: 'Resume Generation'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/job-analysis',
      description: 'Analyze job posting for resume optimization',
      category: 'Job Analysis'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/subscription/status',
      description: 'Get subscription status and usage',
      category: 'Subscription'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/subscription/upgrade',
      description: 'Upgrade subscription plan',
      category: 'Subscription'
    }
  ];

  const faqs = [
    {
      id: 'what-is-jobbyai',
      question: 'What is JobbyAI?',
      answer: 'JobbyAI is an AI-powered platform that helps you create tailored, ATS-optimized resumes in seconds. Simply paste a job posting URL, and our AI analyzes the requirements to generate a perfectly matched resume.'
    },
    {
      id: 'how-it-works',
      question: 'How does the AI resume generation work?',
      answer: 'Our AI analyzes job postings to understand requirements, skills, and keywords. It then uses your profile information to create a customized resume that highlights relevant experience and uses ATS-friendly formatting.'
    },
    {
      id: 'api-rate-limits',
      question: 'What are the API rate limits?',
      answer: 'Free tier: 10 requests/hour. Pro tier: 100 requests/hour. Enterprise: Unlimited. Rate limits reset every hour and are applied per API key.'
    },
    {
      id: 'supported-formats',
      question: 'What resume formats are supported?',
      answer: 'We support PDF, Word (.docx), plain text, and HTML formats. PDF is recommended for ATS compatibility.'
    },
    {
      id: 'data-security',
      question: 'How secure is my data?',
      answer: 'All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We never share your personal information with third parties.'
    },
    {
      id: 'template-customization',
      question: 'Can I customize resume templates?',
      answer: 'Yes! Pro and Enterprise users can customize colors, fonts, layouts, and sections. You can also create custom templates through our API.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or support system
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
              <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#fade)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full text-emerald-400 text-sm font-medium mb-8 border border-emerald-500/20">
              <FiBook className="w-4 h-4 mr-2" />
              Developer Documentation & API Reference
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
              Build with{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                JobbyAI
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Comprehensive documentation, REST API reference, SDKs, and integration guides
              to help you build powerful AI-driven career applications with our resume optimization platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
              >
                <FiZap className="w-5 h-5 mr-2" />
                Get API Key
              </Link>
              <button
                onClick={() => setActiveTab('quickstart')}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200"
              >
                <FiPlay className="w-5 h-5 mr-2" />
                Quick Start Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div ref={navRef} className="sticky top-8 space-y-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div ref={contentRef} className="space-y-8">

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                        <FiCode className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          JobbyAI Developer Platform
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Professional API for AI-powered career tools</p>
                      </div>
                    </div>

                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                      JobbyAI provides enterprise-grade REST APIs that enable developers to integrate
                      intelligent resume generation, ATS optimization, job analysis, and career coaching
                      features into their applications with ease.
                    </p>

                    {/* Key Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {[
                        {
                          icon: FiZap,
                          title: 'AI Resume Builder',
                          description: 'Generate tailored resumes with advanced AI matching',
                          color: 'emerald'
                        },
                        {
                          icon: FiShield,
                          title: 'Enterprise Security',
                          description: 'SOC 2 compliant with end-to-end encryption',
                          color: 'slate'
                        },
                        {
                          icon: FiTrendingUp,
                          title: 'Real-time Analytics',
                          description: 'Comprehensive usage metrics and insights',
                          color: 'teal'
                        },
                        {
                          icon: FiDatabase,
                          title: 'Scalable Infrastructure',
                          description: '99.99% uptime with global edge deployment',
                          color: 'gray'
                        }
                      ].map((feature, index) => (
                        <div key={index} className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300">
                            <div className={`w-12 h-12 bg-gradient-to-r ${feature.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                                feature.color === 'slate' ? 'from-slate-500 to-slate-600' :
                                  feature.color === 'teal' ? 'from-teal-500 to-teal-600' :
                                    'from-gray-500 to-gray-600'
                              } rounded-lg flex items-center justify-center mb-4`}>
                              <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Performance Stats */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">Platform Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">99.99%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">API Uptime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">&lt;150ms</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-slate-600 dark:text-slate-400 mb-2">100+</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Resume Templates</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-2">24/7</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Support Coverage</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Start Tab */}
              {activeTab === 'quickstart' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                        <FiZap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Quick Start Guide
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Get up and running in minutes</p>
                      </div>
                    </div>

                    {/* Getting Started Steps */}
                    <div className="space-y-8">
                      {[
                        {
                          step: 1,
                          title: 'Create Your Account & Get API Key',
                          description: 'Sign up for a JobbyAI developer account and generate your unique API key from the dashboard.',
                          code: null,
                          highlight: 'Free tier includes 1,000 API calls per month'
                        },
                        {
                          step: 2,
                          title: 'Install SDK or Set Up Authentication',
                          description: 'Choose your preferred method to interact with our API.',
                          code: `# Using npm (JavaScript/TypeScript)
npm install @jobbyai/sdk

# Using pip (Python)
pip install jobbyai

# Or use direct HTTP calls with your API key
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.jobbyai.com/v1/health`,
                          highlight: 'SDKs available for JavaScript, Python, and REST'
                        },
                        {
                          step: 3,
                          title: 'Generate Your First Resume',
                          description: 'Create an AI-optimized resume using our powerful generation endpoint.',
                          code: `// JavaScript/TypeScript
import { JobbyAI } from '@jobbyai/sdk';

const jobbyai = new JobbyAI('YOUR_API_KEY');

const resume = await jobbyai.resumes.generate({
  jobDescription: "Senior Software Engineer role...",
  userProfile: {
    name: "John Doe",
    email: "john@example.com",
    skills: ["React", "Node.js", "Python"]
  },
  template: "modern-professional",
  format: "pdf"
});

console.log('Resume generated:', resume.downloadUrl);`,
                          highlight: 'Resumes generated in under 3 seconds'
                        },
                        {
                          step: 4,
                          title: 'Integrate & Scale',
                          description: 'Add JobbyAI to your production application with advanced features.',
                          code: `// Advanced usage with customization
const resume = await jobbyai.resumes.generate({
  jobDescription: jobDescription,
  userProfile: userProfile,
  template: "executive-modern",
  customization: {
    colorScheme: "professional-blue",
    fontSize: "medium",
    sections: ["experience", "education", "skills"]
  },
  atsOptimization: true,
  includeAnalytics: true
});`,
                          highlight: 'Enterprise features: custom templates, webhooks, analytics'
                        }
                      ].map((item) => (
                        <div key={item.step} className="relative">
                          <div className="flex items-start space-x-6">
                            {/* Step Number */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                {item.step}
                              </div>
                              {item.step < 4 && (
                                <div className="w-px h-16 bg-gradient-to-b from-emerald-500 to-teal-600 ml-5 mt-4"></div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                {item.description}
                              </p>

                              {item.highlight && (
                                <div className="inline-flex items-center px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-full mb-4">
                                  <FiCheck className="w-4 h-4 mr-2" />
                                  {item.highlight}
                                </div>
                              )}

                              {item.code && (
                                <div className="relative">
                                  <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
                                    <pre className="text-gray-100 text-sm leading-relaxed">
                                      <code>{item.code}</code>
                                    </pre>
                                  </div>
                                  <button
                                    onClick={() => handleCopyCode(item.code, `step-${item.step}`)}
                                    className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                                  >
                                    {copiedCode === `step-${item.step}` ? (
                                      <FiCheck className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <FiCopy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Next Steps */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Ready for Production?</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Explore our advanced features including webhook notifications, custom templates,
                        bulk processing, and enterprise analytics.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setActiveTab('api')}
                          className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                        >
                          API Reference
                        </button>
                        <button
                          onClick={() => setActiveTab('examples')}
                          className="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg font-medium transition-colors"
                        >
                          Code Examples
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Reference Tab */}
              {activeTab === 'api' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mr-4">
                        <FiCode className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          API Reference
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Complete REST API documentation</p>
                      </div>
                    </div>

                    {/* Base URL */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-2">Base URL</h3>
                          <code className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-sm">
                            https://api.jobbyai.com/v1
                          </code>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Version</div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-semibold">v1.0</div>
                        </div>
                      </div>
                    </div>

                    {/* Authentication */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Authentication</h3>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
                        <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                          <strong>Important:</strong> All API requests must include your API key in the Authorization header.
                        </p>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4">
                        <pre className="text-gray-100 text-sm">
                          <code>Authorization: Bearer YOUR_API_KEY</code>
                        </pre>
                      </div>
                    </div>

                    {/* Endpoints by Category */}
                    {['Authentication', 'User Management', 'Resume Generation', 'Job Analysis', 'Subscription'].map((category) => (
                      <div key={category} className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          {category}
                        </h3>
                        <div className="space-y-4">
                          {apiEndpoints.filter(endpoint => endpoint.category === category).map((endpoint, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-4">
                                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${endpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {endpoint.method}
                                  </span>
                                  <code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                                    {endpoint.endpoint}
                                  </code>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                  <FiExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{endpoint.description}</p>

                              {/* Sample Response */}
                              {endpoint.method === 'POST' && endpoint.endpoint.includes('generate') && (
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Sample Response</div>
                                  <code className="text-xs text-gray-700 dark:text-gray-300">
                                    {`{ "id": "resume_123", "status": "completed", "downloadUrl": "...", "processingTime": "2.1s" }`}
                                  </code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Rate Limits */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Rate Limits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">Free Tier</div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">1,000 requests/month</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Pro Tier</div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">10,000 requests/month</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-600 dark:text-slate-400">Enterprise</div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">Custom limits</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Examples Tab */}
              {activeTab === 'examples' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                        <FiPlay className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Code Examples
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Real-world implementation examples</p>
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div className="flex flex-wrap gap-3 mb-8">
                      {[
                        { id: 'javascript', name: 'JavaScript', icon: '🟨' },
                        { id: 'python', name: 'Python', icon: '🐍' },
                        { id: 'curl', name: 'cURL', icon: '🌐' },
                        { id: 'php', name: 'PHP', icon: '🐘' }
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors"
                        >
                          <span className="mr-2">{lang.icon}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>

                    {/* Code Examples Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {[
                        {
                          title: 'JavaScript / TypeScript SDK',
                          description: 'Full-featured SDK with TypeScript support',
                          language: 'javascript',
                          code: `// Install: npm install @jobbyai/sdk
import { JobbyAI } from '@jobbyai/sdk';

const client = new JobbyAI({
  apiKey: process.env.JOBBYAI_API_KEY,
  environment: 'production' // or 'sandbox'
});

// Generate resume from job posting
async function generateResume(jobUrl: string, userProfile: any) {
  try {
    const result = await client.resumes.generate({
      jobUrl,
      userProfile,
      options: {
        template: 'modern-professional',
        format: 'pdf',
        atsOptimization: true,
        includeAnalytics: true
      }
    });

    // Handle webhook or poll for completion
    const resume = await client.resumes.waitForCompletion(result.id);

    return {
      success: true,
      downloadUrl: resume.downloadUrl,
      analytics: resume.analytics
    };
  } catch (error) {
    console.error('Resume generation failed:', error);
    throw error;
  }
}

// Usage
const userProfile = {
  name: "Sarah Chen",
  email: "sarah@example.com",
  phone: "+1-555-0123",
  location: "San Francisco, CA",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp",
      duration: "2020-2023",
      description: "Led development of microservices...",
      skills: ["React", "Node.js", "AWS"]
    }
  ],
  education: [{
    degree: "BS Computer Science",
    school: "Stanford University",
    year: "2020"
  }],
  skills: ["JavaScript", "Python", "React", "AWS"]
};

generateResume('https://jobs.example.com/senior-dev', userProfile);`
                        },
                        {
                          title: 'Python SDK',
                          description: 'Clean Python integration with async support',
                          language: 'python',
                          code: `# Install: pip install jobbyai
import asyncio
from jobbyai import JobbyAI, ResumeOptions
from jobbyai.types import UserProfile, Experience, Education

# Initialize client
client = JobbyAI(
    api_key="your-api-key-here",
    environment="production"
)

async def generate_resume_async(job_description: str, user_data: dict):
    """Generate resume with advanced options"""

    # Create user profile
    profile = UserProfile(
        name=user_data["name"],
        email=user_data["email"],
        phone=user_data.get("phone"),
        location=user_data.get("location"),
        summary=user_data.get("summary"),
        experience=[
            Experience(**exp) for exp in user_data.get("experience", [])
        ],
        education=[
            Education(**edu) for edu in user_data.get("education", [])
        ],
        skills=user_data.get("skills", [])
    )

    # Configure resume options
    options = ResumeOptions(
        template="executive-modern",
        format="pdf",
        ats_optimization=True,
        custom_sections=["achievements", "certifications"],
        color_scheme="professional-blue",
        font_size="medium"
    )

    try:
        # Generate resume
        result = await client.resumes.generate_async(
            job_description=job_description,
            user_profile=profile,
            options=options
        )

        # Wait for completion with progress updates
        resume = await client.resumes.wait_for_completion(
            result.id,
            timeout=30,
            progress_callback=lambda status: print(f"Status: {status}")
        )

        return {
            "success": True,
            "download_url": resume.download_url,
            "match_score": resume.analytics.match_score,
            "suggestions": resume.analytics.suggestions
        }

    except Exception as e:
        print(f"Error generating resume: {e}")
        return {"success": False, "error": str(e)}

# Usage example
user_data = {
    "name": "Alex Rodriguez",
    "email": "alex@example.com",
    "phone": "+1-555-0199",
    "location": "Austin, TX",
    "summary": "Experienced data scientist with 5+ years...",
    "experience": [
        {
            "title": "Senior Data Scientist",
            "company": "DataCorp",
            "start_date": "2021-01-01",
            "end_date": "2023-12-31",
            "description": "Led ML initiatives that increased revenue by 25%",
            "skills": ["Python", "TensorFlow", "AWS"]
        }
    ],
    "education": [
        {
            "degree": "MS Data Science",
            "school": "MIT",
            "graduation_year": 2020
        }
    ],
    "skills": ["Python", "Machine Learning", "SQL", "Docker"]
}

# Run async
job_desc = "Looking for a Senior Data Scientist with ML expertise..."
result = asyncio.run(generate_resume_async(job_desc, user_data))`
                        },
                        {
                          title: 'Direct HTTP/REST API',
                          description: 'Raw HTTP requests for any language',
                          language: 'curl',
                          code: `# 1. Generate Resume
curl -X POST https://api.jobbyai.com/v1/resumes/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jobDescription": "Senior Backend Engineer role...",
    "userProfile": {
      "name": "John Doe",
      "email": "john@example.com",
      "experience": [
        {
          "title": "Backend Engineer",
          "company": "TechStartup",
          "duration": "2020-2023",
          "description": "Built scalable APIs...",
          "skills": ["Go", "PostgreSQL", "Docker"]
        }
      ],
      "skills": ["Go", "Python", "PostgreSQL", "Kubernetes"]
    },
    "options": {
      "template": "modern-professional",
      "format": "pdf",
      "atsOptimization": true
    }
  }'

# Response:
# {
#   "id": "resume_abc123",
#   "status": "processing",
#   "estimatedCompletion": "2023-12-01T10:30:00Z"
# }

# 2. Check Status
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.jobbyai.com/v1/resumes/resume_abc123/status

# Response:
# {
#   "id": "resume_abc123",
#   "status": "completed",
#   "downloadUrl": "https://cdn.jobbyai.com/resumes/resume_abc123.pdf",
#   "analytics": {
#     "matchScore": 87,
#     "processingTime": "2.3s",
#     "suggestions": ["Add more quantified achievements"]
#   }
# }

# 3. Download Resume
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  -o resume.pdf \\
  "https://cdn.jobbyai.com/resumes/resume_abc123.pdf"

# 4. Get Analytics
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.jobbyai.com/v1/resumes/resume_abc123/analytics`
                        },
                        {
                          title: 'PHP Integration',
                          description: 'PHP library with modern features',
                          language: 'php',
                          code: `<?php
// Install: composer require jobbyai/php-sdk
require_once 'vendor/autoload.php';

use JobbyAI\\Client;
use JobbyAI\\Models\\UserProfile;
use JobbyAI\\Models\\ResumeOptions;

// Initialize client
$client = new Client([
    'api_key' => $_ENV['JOBBYAI_API_KEY'],
    'environment' => 'production'
]);

/**
 * Generate resume with comprehensive options
 */
function generateResume($jobDescription, $userData) {
    global $client;

    try {
        // Create user profile
        $profile = new UserProfile([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'phone' => $userData['phone'] ?? null,
            'location' => $userData['location'] ?? null,
            'summary' => $userData['summary'] ?? null,
            'experience' => $userData['experience'] ?? [],
            'education' => $userData['education'] ?? [],
            'skills' => $userData['skills'] ?? []
        ]);

        // Configure options
        $options = new ResumeOptions([
            'template' => 'creative-modern',
            'format' => 'pdf',
            'ats_optimization' => true,
            'include_analytics' => true,
            'custom_sections' => ['projects', 'certifications'],
            'webhook_url' => 'https://yourapp.com/webhooks/resume-complete'
        ]);

        // Generate resume
        $result = $client->resumes->generate([
            'job_description' => $jobDescription,
            'user_profile' => $profile,
            'options' => $options
        ]);

        // Poll for completion (or use webhooks)
        $resume = $client->resumes->waitForCompletion($result['id'], [
            'timeout' => 30,
            'poll_interval' => 2
        ]);

        return [
            'success' => true,
            'resume_id' => $resume['id'],
            'download_url' => $resume['download_url'],
            'analytics' => $resume['analytics'] ?? null
        ];

    } catch (\\JobbyAI\\Exceptions\\RateLimitException $e) {
        error_log("Rate limit exceeded: " . $e->getMessage());
        return ['success' => false, 'error' => 'rate_limit'];

    } catch (\\Exception $e) {
        error_log("Resume generation failed: " . $e->getMessage());
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// Usage example
$userData = [
    'name' => 'Maria Garcia',
    'email' => 'maria@example.com',
    'phone' => '+1-555-0167',
    'location' => 'Los Angeles, CA',
    'summary' => 'Creative marketing professional with 8+ years...',
    'experience' => [
        [
            'title' => 'Marketing Manager',
            'company' => 'Creative Agency',
            'start_date' => '2019-01-01',
            'end_date' => null, // Current job
            'description' => 'Led digital marketing campaigns...',
            'skills' => ['SEO', 'Google Analytics', 'Content Strategy']
        ]
    ],
    'education' => [
        [
            'degree' => 'BA Marketing',
            'school' => 'UCLA',
            'graduation_year' => 2018
        ]
    ],
    'skills' => ['Digital Marketing', 'SEO', 'Analytics', 'Content Creation']
];

$jobDescription = "Marketing Manager position requiring digital expertise...";
$result = generateResume($jobDescription, $userData);

if ($result['success']) {
    echo "Resume generated successfully: " . $result['download_url'];

    // Save to database
    $db->saveResume([
        'user_id' => $currentUser['id'],
        'resume_id' => $result['resume_id'],
        'download_url' => $result['download_url'],
        'created_at' => date('Y-m-d H:i:s')
    ]);
} else {
    echo "Failed to generate resume: " . $result['error'];
}
?>`
                        }
                      ].map((example, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {example.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {example.description}
                              </p>
                            </div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {example.language}
                            </div>
                          </div>
                          <div className="relative">
                            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto max-h-96 scrollbar-thin">
                              <pre className="text-gray-100 text-sm leading-relaxed">
                                <code>{example.code}</code>
                              </pre>
                            </div>
                            <button
                              onClick={() => handleCopyCode(example.code, `example-${index}`)}
                              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                            >
                              {copiedCode === `example-${index}` ? (
                                <FiCheck className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <FiCopy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SDK Links */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Official SDKs & Libraries</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { name: 'JavaScript/TypeScript', package: '@jobbyai/sdk', command: 'npm install @jobbyai/sdk' },
                          { name: 'Python', package: 'jobbyai', command: 'pip install jobbyai' },
                          { name: 'PHP', package: 'jobbyai/php-sdk', command: 'composer require jobbyai/php-sdk' },
                          { name: 'Go', package: 'github.com/jobbyai/go-sdk', command: 'go get github.com/jobbyai/go-sdk' }
                        ].map((sdk, index) => (
                          <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="font-medium text-gray-900 dark:text-white mb-2">{sdk.name}</div>
                            <code className="text-xs text-gray-600 dark:text-gray-400 block mb-3">{sdk.package}</code>
                            <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                              {sdk.command}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Guides Tab */}
              {activeTab === 'guides' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-700 rounded-xl flex items-center justify-center mr-4">
                        <FiFileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Developer Guides
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">In-depth tutorials and best practices</p>
                      </div>
                    </div>

                    {/* Featured Guides */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      {[
                        {
                          icon: FiFileText,
                          title: 'Resume Generation Best Practices',
                          description: 'Learn how to optimize resume generation for different industries, roles, and ATS systems.',
                          difficulty: 'Beginner',
                          readTime: '8 min read',
                          topics: ['ATS Optimization', 'Industry Templates', 'Content Guidelines'],
                          link: '#',
                          color: 'emerald'
                        },
                        {
                          icon: FiBriefcase,
                          title: 'Job Analysis & Matching',
                          description: 'Integrate intelligent job analysis to provide better candidate matching and recommendations.',
                          difficulty: 'Intermediate',
                          readTime: '12 min read',
                          topics: ['Job Parsing', 'Skills Matching', 'Scoring Algorithms'],
                          link: '#',
                          color: 'teal'
                        },
                        {
                          icon: FiTarget,
                          title: 'Advanced ATS Optimization',
                          description: 'Deep dive into ATS systems and how to ensure maximum compatibility and ranking.',
                          difficulty: 'Advanced',
                          readTime: '15 min read',
                          topics: ['ATS Systems', 'Keyword Optimization', 'Format Guidelines'],
                          link: '#',
                          color: 'slate'
                        },
                        {
                          icon: FiAward,
                          title: 'Custom Template Development',
                          description: 'Create and deploy custom resume templates that match your brand and requirements.',
                          difficulty: 'Advanced',
                          readTime: '20 min read',
                          topics: ['Template Engine', 'CSS Customization', 'Brand Guidelines'],
                          link: '#',
                          color: 'gray'
                        }
                      ].map((guide, index) => (
                        <div key={index} className="group relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                          <div className="relative border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-r ${guide.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                                  guide.color === 'teal' ? 'from-teal-500 to-teal-600' :
                                    guide.color === 'slate' ? 'from-slate-500 to-slate-600' :
                                      'from-gray-500 to-gray-600'
                                } rounded-lg flex items-center justify-center`}>
                                <guide.icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${guide.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                  {guide.difficulty}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{guide.readTime}</span>
                              </div>
                            </div>

                            {/* Content */}
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                              {guide.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                              {guide.description}
                            </p>

                            {/* Topics */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {guide.topics.map((topic, topicIndex) => (
                                <span key={topicIndex} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                  {topic}
                                </span>
                              ))}
                            </div>

                            {/* CTA */}
                            <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                              Read Guide
                              <FiArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Resources */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Additional Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            title: 'API Changelog',
                            description: 'Stay updated with the latest API changes and improvements.',
                            icon: FiFileText,
                            link: '#'
                          },
                          {
                            title: 'Community Forum',
                            description: 'Connect with other developers and get help from the community.',
                            icon: FiGithub,
                            link: '#'
                          },
                          {
                            title: 'Video Tutorials',
                            description: 'Watch step-by-step video guides for common integration patterns.',
                            icon: FiPlay,
                            link: '#'
                          }
                        ].map((resource, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors cursor-pointer">
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                              <resource.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {resource.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {resource.description}
                              </p>
                            </div>
                            <FiExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                        <FiHelpCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Find answers to common questions</p>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all"
                      />
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                      {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                            <FiChevronDown
                              className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${expandedFaq === faq.id ? 'rotate-180' : ''
                                }`}
                            />
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                              <div className="pt-4">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* No Results */}
                    {filteredFaqs.length === 0 && searchQuery && (
                      <div className="text-center py-12">
                        <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Try adjusting your search terms or browse all FAQs.
                        </p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                        >
                          Clear search
                        </button>
                      </div>
                    )}

                    {/* Help Section */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Still need help?</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Can't find what you're looking for? Our support team is here to help.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setActiveTab('support')}
                          className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                        >
                          <FiMail className="w-4 h-4 mr-2" />
                          Contact Support
                        </button>
                        <a
                          href="#"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                        >
                          <FiGithub className="w-4 h-4 mr-2" />
                          Community Forum
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Tab */}
              {activeTab === 'support' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Get Support
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Contact Form */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          Send us a message
                        </h3>
                        {submitted ? (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                            <FiCheck className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                              Message Sent!
                            </h4>
                            <p className="text-green-700 dark:text-green-400">
                              We'll get back to you within 24 hours.
                            </p>
                          </div>
                        ) : (
                          <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Message
                              </label>
                              <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
                            >
                              <FiSend className="w-5 h-5 mr-2" />
                              Send Message
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Support Options */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          Other ways to reach us
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              icon: FiMail,
                              title: 'Email Support',
                              description: 'support@jobbyai.com',
                              action: 'Send Email'
                            },
                            {
                              icon: FiGithub,
                              title: 'GitHub Issues',
                              description: 'Report bugs and request features',
                              action: 'Open Issue'
                            },
                            {
                              icon: FiExternalLink,
                              title: 'Status Page',
                              description: 'Check API status and uptime',
                              action: 'View Status'
                            }
                          ].map((option, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                                <option.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {option.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {option.description}
                                </p>
                              </div>
                              <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300">
                                {option.action}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 py-20 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
            <FiZap className="w-4 h-4 mr-2" />
            Start Building Today
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to integrate JobbyAI?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of developers building the future of career technology with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
            >
              <FiZap className="w-5 h-5 mr-2" />
              Get API Key - Free
            </Link>
            <a
              href="mailto:developers@jobbyai.com"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200"
            >
              <FiMail className="w-5 h-5 mr-2" />
              Contact Our Team
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400 mb-1">10M+</div>
                <div className="text-sm text-gray-400">Resumes Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-400 mb-1">500+</div>
                <div className="text-sm text-gray-400">Developers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-400 mb-1">99.99%</div>
                <div className="text-sm text-gray-400">Uptime SLA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400 mb-1">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
