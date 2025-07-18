import React, { useEffect, useRef, useState } from 'react';
import {
  FiBriefcase,
  FiCopy,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiLoader,
  FiMessageCircle,
  FiMessageSquare,
  FiPaperclip,
  FiPlus,
  FiSend,
  FiSettings,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import * as apiService from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  jobApplications?: JobApplication[];
  resumeData?: ResumeData;
}

interface Attachment {
  id: string;
  name: string;
  type: 'resume' | 'job' | 'document';
  url?: string;
  data?: any;
}

interface JobApplication {
  id: string;
  title: string;
  company: string;
  platform: string;
  url: string;
  status: 'pending' | 'applying' | 'applied' | 'failed';
  appliedAt?: Date;
  resumeUsed?: string;
}

interface ResumeData {
  id: string;
  title: string;
  content: any;
  createdAt: Date;
  matchScore?: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface SuggestedPrompt {
  id: string;
  text: string;
  icon: React.ComponentType<any>;
  category: 'resume' | 'job' | 'career' | 'interview';
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userResumes, setUserResumes] = useState<ResumeData[]>([]);
  const [showPrompts, setShowPrompts] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showApplications, setShowApplications] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sample suggested prompts
  const suggestedPrompts: SuggestedPrompt[] = [
    {
      id: '1',
      text: 'Show me all my resumes and help me optimize them',
      icon: FiFileText,
      category: 'resume'
    },
    {
      id: '2',
      text: 'Find jobs that match my skills and apply automatically',
      icon: FiBriefcase,
      category: 'job'
    },
    {
      id: '3',
      text: 'Create a tailored resume for a specific job posting',
      icon: FiTarget,
      category: 'resume'
    },
    {
      id: '4',
      text: 'Apply to 10 software engineer jobs on LinkedIn',
      icon: FiTrendingUp,
      category: 'job'
    },
    {
      id: '5',
      text: 'Analyze my career progression and suggest improvements',
      icon: FiStar,
      category: 'career'
    },
    {
      id: '6',
      text: 'Prepare me for upcoming interviews with practice questions',
      icon: FiMessageCircle,
      category: 'interview'
    }
  ];

  // Load user resumes on mount
  useEffect(() => {
    loadUserResumes();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `Hello ${user?.firstName || 'there'}! 👋 I'm your AI career assistant. I can help you:

• **Manage your resumes** - View, edit, and optimize your existing resumes
• **Find and apply to jobs** - Search job boards and apply automatically
• **Create tailored resumes** - Generate job-specific resumes from your profile
• **Career planning** - Analyze your skills and suggest improvements
• **Interview prep** - Practice with mock interviews and questions

What would you like to do today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  const loadUserResumes = async () => {
    try {
      const response = await apiService.getUserResumes();
      if (response.success && response.data) {
        setUserResumes(response.data.map((resume: any) => ({
          id: resume.id,
          title: resume.title,
          content: resume.content,
          createdAt: new Date(resume.createdAt),
        })));
      }
    } catch (error) {
      console.error('Failed to load user resumes:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setShowPrompts(false);

    // Generate AI response
    try {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();

    // Resume-related queries
    if (input.includes('resume') || input.includes('cv')) {
      if (input.includes('show') || input.includes('list')) {
        return {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `I found ${userResumes.length} resumes in your account:

${userResumes.map((resume, index) => `**${index + 1}. ${resume.title}**
   Created: ${resume.createdAt.toLocaleDateString()}
   Last updated: ${resume.createdAt.toLocaleDateString()}`).join('\n\n')}

Would you like me to:
• Analyze and optimize any of these resumes?
• Create a new resume for a specific job?
• Generate a tailored version for a particular role?

Just let me know what you need!`,
          timestamp: new Date(),
          resumeData: userResumes[0], // Attach first resume as example
        };
      } else if (input.includes('create') || input.includes('generate')) {
        return {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `I'll help you create a new resume! To get started, please provide:

1. **Target job title** (e.g., "Software Engineer", "Marketing Manager")
2. **Job posting URL** (optional - I can analyze the requirements)
3. **Company name** (optional)
4. **Any specific requirements** you want to highlight

You can also paste a job description and I'll create a perfectly tailored resume that matches the requirements and keywords.

What position are you targeting?`,
          timestamp: new Date(),
        };
      }
    }

    // Job application queries with enhanced functionality
    if (input.includes('apply') || input.includes('job')) {
      if (input.includes('apply')) {
        // Extract job search parameters from the message
        const jobSearchParams = extractJobSearchParams(userInput);

        try {
          // Call the job application API
          const response = await apiService.applyToJobs(jobSearchParams);

          if (response.success) {
            return {
              id: `msg_${Date.now()}`,
              role: 'assistant',
              content: `🎉 Great! I found ${response.data.jobs.length} matching positions and prepared applications for you:

**Search Results:**
• Query: "${jobSearchParams.query}"
• Location: ${jobSearchParams.location || 'Any location'}
• Found: ${response.data.jobs.length} jobs
• Applications prepared: ${response.data.applications.length}

I'll now start applying to these positions with your best-matching resumes. You can track the progress below:`,
              timestamp: new Date(),
              jobApplications: response.data.applications.map((app: any) => ({
                id: app.id,
                title: app.jobTitle,
                company: app.companyName,
                platform: app.platform,
                url: app.jobUrl,
                status: app.status,
                resumeUsed: app.resumeUsed
              }))
            };
          } else {
            return {
              id: `msg_${Date.now()}`,
              role: 'assistant',
              content: `I encountered an issue while searching for jobs: ${response.error}

Let me help you with a different approach. Please tell me:
• What job titles are you interested in?
• Preferred location (or remote)?
• Salary range?
• Any specific companies?

I'll search for positions and apply with your best-suited resume for each role!`,
              timestamp: new Date(),
            };
          }
        } catch (error) {
          console.error('Job application error:', error);
          return {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: `I can help you apply to jobs automatically! Here's what I can do:

**🎯 Job Search & Application:**
• Search LinkedIn, Indeed, Glassdoor, and other job boards
• Filter by location, salary, experience level, and more
• Apply to multiple positions with tailored resumes
• Track application status and responses

**📋 To get started, tell me:**
• What job titles are you interested in?
• Preferred location (or remote)?
• Salary range?
• Any specific companies?

**Example:** "Apply to 5 software engineer jobs in San Francisco, $120k+, at tech companies"

I'll find matching positions and apply with your best-suited resume for each role!`,
            timestamp: new Date(),
            jobApplications: [
              {
                id: '1',
                title: 'Software Engineer',
                company: 'TechCorp',
                platform: 'LinkedIn',
                url: 'https://linkedin.com/jobs/123',
                status: 'pending',
                resumeUsed: 'Software Engineer Resume'
              },
              {
                id: '2',
                title: 'Frontend Developer',
                company: 'StartupXYZ',
                platform: 'Indeed',
                url: 'https://indeed.com/job/456',
                status: 'pending',
                resumeUsed: 'Frontend Developer Resume'
              }
            ]
          };
        }
      }

      // Job search without application
      if (input.includes('search') || input.includes('find')) {
        const jobSearchParams = extractJobSearchParams(userInput);

        try {
          const response = await apiService.searchJobs(jobSearchParams);

          if (response.success && response.data) {
            return {
              id: `msg_${Date.now()}`,
              role: 'assistant',
              content: `🔍 I found ${response.data.length} jobs matching your criteria:

**Search Parameters:**
• Query: "${jobSearchParams.query}"
• Location: ${jobSearchParams.location || 'Any location'}
• Salary: ${jobSearchParams.salary ? `$${jobSearchParams.salary.min || 0}k - $${jobSearchParams.salary.max || 'unlimited'}k` : 'Any salary'}

Here are the top matches:

${response.data.slice(0, 5).map((job: any, index: number) => `**${index + 1}. ${job.title}** at ${job.company}
   📍 ${job.location}
   💰 ${job.salary ? `$${job.salary.min}k - $${job.salary.max}k` : 'Salary not specified'}
   📅 Posted: ${new Date(job.postedDate).toLocaleDateString()}
   🔗 [Apply Now](${job.url})`).join('\n\n')}

Would you like me to:
• Apply to any of these positions?
• Create tailored resumes for specific roles?
• Search for more jobs with different criteria?`,
              timestamp: new Date(),
            };
          }
        } catch (error) {
          console.error('Job search error:', error);
        }
      }
    }

    // Resume creation queries
    if (input.includes('create') && input.includes('resume')) {
      const createResumeParams = extractResumeCreationParams(userInput);

      try {
        const response = await apiService.createTailoredResume(createResumeParams);

        if (response.success) {
          return {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: `🎉 Great! I've created a tailored resume for you:

**Resume Created:**
• Position: ${createResumeParams.jobTitle}
• Company: ${createResumeParams.companyName || 'General'}
• Status: Ready to use

Your new resume has been optimized for the ${createResumeParams.jobTitle} role and includes:
• ATS-optimized keywords
• Relevant skills highlighting
• Professional formatting
• Tailored content based on job requirements

The resume is now saved in your account and ready for job applications!`,
            timestamp: new Date(),
            resumeData: response.data.resume
          };
        }
      } catch (error) {
        console.error('Resume creation error:', error);
      }
    }

    // Career advice queries
    if (input.includes('career') || input.includes('advice') || input.includes('skill')) {
      return {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `I'd love to help with your career development! Based on your profile, here's what I can assist with:

**🚀 Career Analysis:**
• Skill gap analysis for your target roles
• Industry trends and market demand
• Salary benchmarking and negotiation tips
• Career path recommendations

**📈 Professional Growth:**
• Identify missing skills and certifications
• Suggest learning resources and courses
• Optimize your LinkedIn profile
• Network building strategies

**💡 Next Steps:**
• Set specific career goals with timelines
• Create action plans for skill development
• Track progress and milestones

What aspect of your career would you like to focus on? I can provide personalized recommendations based on your experience and goals.`,
        timestamp: new Date(),
      };
    }

    // Interview preparation
    if (input.includes('interview') || input.includes('practice')) {
      return {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `Great! I can help you prepare for interviews. Here's what we can do:

**🎯 Interview Preparation:**
• Practice common interview questions
• Mock technical interviews with coding challenges
• Behavioral question practice with STAR method
• Company-specific interview prep

**📝 Preparation Materials:**
• Create custom question sets for your target role
• Develop compelling stories for behavioral questions
• Practice answers with feedback and improvement tips
• Salary negotiation strategies

**🔄 Practice Sessions:**
• Timed practice rounds
• Video/audio practice with feedback
• Track your improvement over time

Would you like to:
1. Start with common interview questions?
2. Practice for a specific company/role?
3. Work on behavioral questions?
4. Do a mock technical interview?

Let me know what you'd like to focus on!`,
        timestamp: new Date(),
      };
    }

    // Default response
    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `I understand you'd like help with "${userInput}". I can assist you with:

**🎯 Core Services:**
• **Resume Management** - Create, edit, and optimize resumes
• **Job Applications** - Find and apply to positions automatically
• **Career Planning** - Skill analysis and growth recommendations
• **Interview Prep** - Practice questions and mock interviews

**💬 Try asking me:**
• "Show me all my resumes"
• "Apply to 5 marketing jobs in New York"
• "Create a resume for a data scientist role"
• "Help me prepare for a Google interview"

What would you like to focus on?`,
      timestamp: new Date(),
    };
  };

  const handlePromptClick = (prompt: SuggestedPrompt) => {
    setInputMessage(prompt.text);
    setShowPrompts(false);
    inputRef.current?.focus();
  };

  // Helper function to extract job search parameters from user input
  const extractJobSearchParams = (input: string) => {
    const params: any = {
      query: '',
      location: '',
      count: 5,
      salary: {}
    };

    // Extract job titles/keywords
    const jobTitleMatch = input.match(/(?:apply to|search for|find)\s+(\d+\s+)?([^,\n]+?)(?:\s+(?:jobs?|positions?|roles?))?(?:\s+(?:in|at|on))/i);
    if (jobTitleMatch) {
      params.query = jobTitleMatch[2].trim();
      if (jobTitleMatch[1]) {
        params.count = parseInt(jobTitleMatch[1].trim());
      }
    }

    // Extract location
    const locationMatch = input.match(/(?:in|at|location)\s+([^,\n$]+?)(?:\s*,|\s*$|\s+\$)/i);
    if (locationMatch) {
      params.location = locationMatch[1].trim();
    }

    // Extract salary
    const salaryMatch = input.match(/\$(\d+)k?\+?(?:\s*-\s*\$?(\d+)k?)?/i);
    if (salaryMatch) {
      params.salary.min = parseInt(salaryMatch[1]) * (salaryMatch[1].length <= 2 ? 1000 : 1);
      if (salaryMatch[2]) {
        params.salary.max = parseInt(salaryMatch[2]) * (salaryMatch[2].length <= 2 ? 1000 : 1);
      }
    }

    // If no specific query found, use the entire input as query
    if (!params.query) {
      params.query = input.replace(/apply to|search for|find|jobs?|positions?|roles?/gi, '').trim();
    }

    return params;
  };

  // Helper function to extract resume creation parameters
  const extractResumeCreationParams = (input: string) => {
    const params: any = {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      templateId: ''
    };

    // Extract job title
    const jobTitleMatch = input.match(/(?:resume for|create.*?for)\s+([^,\n]+?)(?:\s+(?:at|role|position))/i);
    if (jobTitleMatch) {
      params.jobTitle = jobTitleMatch[1].trim();
    }

    // Extract company name
    const companyMatch = input.match(/(?:at|for)\s+([^,\n]+?)(?:\s*,|\s*$)/i);
    if (companyMatch && !params.jobTitle.includes(companyMatch[1])) {
      params.companyName = companyMatch[1].trim();
    }

    // If no specific job title found, extract from the entire input
    if (!params.jobTitle) {
      const cleanInput = input.replace(/create|resume|for|new|tailored/gi, '').trim();
      if (cleanInput) {
        params.jobTitle = cleanInput;
      }
    }

    return params;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessage = (content: string) => {
    // Convert markdown-style formatting to HTML
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/•/g, '•');

    return { __html: formatted };
  };

  const renderJobApplications = (applications: JobApplication[]) => (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Job Applications ({applications.length})
        </div>
        <button
          onClick={() => setShowApplications(!showApplications)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          {showApplications ? 'Hide' : 'View All'}
        </button>
      </div>

      {showApplications && (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {app.title}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      at {app.company}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <FiBriefcase className="w-4 h-4" />
                      <span>{app.platform}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FiFileText className="w-4 h-4" />
                      <span>{app.resumeUsed}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'applied'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : app.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                    onClick={() => window.open(app.url, '_blank')}
                  >
                    Apply Now
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FiExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderResumeData = (resume: ResumeData) => (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {resume.title}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Created: {resume.createdAt.toLocaleDateString()}</span>
              {resume.matchScore && (
                <span className="flex items-center space-x-1">
                  <FiStar className="w-3 h-3" />
                  <span>{resume.matchScore}% match</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <FiDownload className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <FiExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
                  <FiMessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Career Assistant
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your personal job application & resume assistant
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setInputMessage('Show me all my resumes')}
                    className="w-full text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FiFileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">View My Resumes</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setInputMessage('Apply to 5 software engineer jobs')}
                    className="w-full text-left px-3 py-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FiBriefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Apply to Jobs</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setInputMessage('Create a new resume for data scientist role')}
                    className="w-full text-left px-3 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FiPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Create Resume</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Chat Sessions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Chat Sessions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FiPlus className="w-4 h-4" />
                    <span>New Chat</span>
                  </button>
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                    No previous sessions
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Resumes</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {userResumes.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Applications</span>
                    <span className="font-semibold text-gray-900 dark:text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Interviews</span>
                    <span className="font-semibold text-gray-900 dark:text-white">0</span>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  💡 AI Suggestion
                </h3>
                <p className="text-sm mb-3">
                  Based on your profile, I recommend applying to frontend developer roles at tech companies.
                </p>
                <button
                  onClick={() => setInputMessage('Apply to frontend developer jobs at tech companies')}
                  className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Main Chat */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-[calc(100vh-12rem)] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Suggested Prompts */}
                {showPrompts && messages.length <= 1 && (
                  <div className="mb-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
                        <FiZap className="w-4 h-4 mr-2" />
                        Suggested Actions
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt.id}
                          onClick={() => handlePromptClick(prompt)}
                          className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <prompt.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {prompt.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <FiMessageSquare className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-3xl px-4 py-3 rounded-lg ${message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                    >
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={formatMessage(message.content)}
                      />

                      {/* Job Applications */}
                      {message.jobApplications && renderJobApplications(message.jobApplications)}

                      {/* Resume Data */}
                      {message.resumeData && renderResumeData(message.resumeData)}

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <FiCopy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FiMessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about your resumes, job applications, or career advice..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FiPaperclip className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <FiSend className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setInputMessage('Apply to 5 jobs in my field')}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    Apply to Jobs
                  </button>
                  <button
                    onClick={() => setInputMessage('Create a resume for software engineer')}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    Create Resume
                  </button>
                  <button
                    onClick={() => setInputMessage('Show my resume analytics')}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setInputMessage('Search for remote developer jobs')}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                  >
                    Find Jobs
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Powered by AI</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
