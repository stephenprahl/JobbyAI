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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
            <FiBook className="w-4 h-4 mr-2" />
            Documentation & API Reference
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Build with JobbyAI
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive documentation, API reference, and guides to help you integrate
            AI-powered resume generation into your applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <FiZap className="w-5 h-5 mr-2" />
              Get API Key
            </Link>
            <button
              onClick={() => setActiveTab('quickstart')}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all duration-200"
            >
              <FiPlay className="w-5 h-5 mr-2" />
              Quick Start
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div ref={navRef} className="sticky top-8 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div ref={contentRef} className="space-y-8">

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Welcome to JobbyAI API
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      JobbyAI provides a powerful REST API that enables developers to integrate
                      AI-powered resume generation, job analysis, and ATS optimization into their applications.
                    </p>

                    {/* Key Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {[
                        {
                          icon: FiZap,
                          title: 'AI-Powered Generation',
                          description: 'Generate tailored resumes in seconds using advanced AI'
                        },
                        {
                          icon: FiShield,
                          title: 'Enterprise Security',
                          description: 'Bank-level security with end-to-end encryption'
                        },
                        {
                          icon: FiTrendingUp,
                          title: 'Real-time Analytics',
                          description: 'Track usage, performance, and optimization metrics'
                        },
                        {
                          icon: FiDatabase,
                          title: 'Scalable Infrastructure',
                          description: '99.9% uptime with global CDN and auto-scaling'
                        }
                      ].map((feature, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                            <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* API Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.9%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Uptime SLA</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">&lt;200ms</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">50+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Template Options</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Start Tab */}
              {activeTab === 'quickstart' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Quick Start Guide
                    </h2>

                    {/* Steps */}
                    <div className="space-y-6">
                      {[
                        {
                          step: 1,
                          title: 'Get Your API Key',
                          description: 'Register for an account and generate your API key from the dashboard.',
                          code: null
                        },
                        {
                          step: 2,
                          title: 'Authentication',
                          description: 'Include your API key in the Authorization header for all requests.',
                          code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.jobbyai.com/v1/user/profile`
                        },
                        {
                          step: 3,
                          title: 'Generate Your First Resume',
                          description: 'Send a POST request to create an AI-optimized resume.',
                          code: `curl -X POST https://api.jobbyai.com/v1/resume/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jobUrl": "https://example.com/job-posting",
    "template": "modern-professional",
    "format": "pdf"
  }'`
                        }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {item.description}
                            </p>
                            {item.code && (
                              <div className="relative">
                                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                                  <code>{item.code}</code>
                                </pre>
                                <button
                                  onClick={() => handleCopyCode(item.code, `step-${item.step}`)}
                                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  {copiedCode === `step-${item.step}` ? (
                                    <FiCheck className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <FiCopy className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* API Reference Tab */}
              {activeTab === 'api' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      API Reference
                    </h2>

                    {/* Base URL */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Base URL</h3>
                      <code className="text-blue-700 dark:text-blue-300">https://api.jobbyai.com/v1</code>
                    </div>

                    {/* Endpoints by Category */}
                    {['Authentication', 'User Management', 'Resume Generation', 'Job Analysis', 'Subscription'].map((category) => (
                      <div key={category} className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{category}</h3>
                        <div className="space-y-4">
                          {apiEndpoints.filter(endpoint => endpoint.category === category).map((endpoint, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                  }`}>
                                  {endpoint.method}
                                </span>
                                <code className="text-gray-900 dark:text-gray-100">{endpoint.endpoint}</code>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm">{endpoint.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples Tab */}
              {activeTab === 'examples' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Code Examples
                    </h2>

                    {/* Language Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: 'JavaScript / Node.js',
                          code: `// Initialize JobbyAI client
const JobbyAI = require('@jobbyai/sdk');
const client = new JobbyAI('YOUR_API_KEY');

// Generate resume
async function generateResume() {
  try {
    const resume = await client.resume.generate({
      jobUrl: 'https://example.com/job',
      template: 'modern-professional',
      format: 'pdf'
    });

    console.log('Resume generated:', resume.id);
    return resume;
  } catch (error) {
    console.error('Error:', error.message);
  }
}`
                        },
                        {
                          title: 'Python',
                          code: `import requests
import json

# API configuration
API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.jobbyai.com/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Generate resume
def generate_resume(job_url):
    payload = {
        'jobUrl': job_url,
        'template': 'modern-professional',
        'format': 'pdf'
    }

    response = requests.post(
        f'{BASE_URL}/resume/generate',
        headers=headers,
        data=json.dumps(payload)
    )

    return response.json()`
                        }
                      ].map((example, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {example.title}
                          </h3>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                              <code>{example.code}</code>
                            </pre>
                            <button
                              onClick={() => handleCopyCode(example.code, `example-${index}`)}
                              className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              {copiedCode === `example-${index}` ? (
                                <FiCheck className="w-4 h-4 text-green-400" />
                              ) : (
                                <FiCopy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Guides Tab */}
              {activeTab === 'guides' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Developer Guides
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: FiFileText,
                          title: 'Resume Generation Best Practices',
                          description: 'Learn how to optimize resume generation for different industries and roles.',
                          link: '#'
                        },
                        {
                          icon: FiBriefcase,
                          title: 'Job Analysis Integration',
                          description: 'Integrate job analysis features to provide better candidate matching.',
                          link: '#'
                        },
                        {
                          icon: FiTarget,
                          title: 'ATS Optimization Guide',
                          description: 'Ensure resumes pass through Applicant Tracking Systems successfully.',
                          link: '#'
                        },
                        {
                          icon: FiAward,
                          title: 'Template Customization',
                          description: 'Create and customize resume templates for your brand.',
                          link: '#'
                        }
                      ].map((guide, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer">
                          <div className="flex items-start space-x-4">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                              <guide.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {guide.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                {guide.description}
                              </p>
                              <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                                Read Guide <FiArrowRight className="w-4 h-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Frequently Asked Questions
                    </h2>

                    {/* Search */}
                    <div className="relative mb-8">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                      {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-xl">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-xl"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                            <FiChevronDown
                              className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''
                                }`}
                            />
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
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
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build with JobbyAI?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of developers using our API to power their applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <FiZap className="w-5 h-5 mr-2" />
              Get Started Free
            </Link>
            <a
              href="mailto:support@jobbyai.com"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all duration-200"
            >
              <FiMail className="w-5 h-5 mr-2" />
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
