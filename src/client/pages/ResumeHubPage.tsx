import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiActivity,
  FiBriefcase,
  FiCheckCircle,
  FiCopy,
  FiDollarSign,
  FiDownload,
  FiEdit,
  FiEdit3,
  FiEye,
  FiFile,
  FiFileText,
  FiLayers,
  FiMapPin,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiTrendingUp,
  FiXCircle,
  FiZap
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import ResumeUsageDisplay from '../components/ResumeUsageDisplay';
import TemplatePicker from '../components/templates/TemplatePicker';
import TemplatePreviewModal from '../components/templates/TemplatePreviewModal';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import * as apiService from '../services/api';
import { saveResume } from '../services/api';
import { JobAnalysis } from '../types';

// Resume Builder Types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
}

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ResumeData {
  title: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
}

export default function ResumeHubPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { subscription, checkFeatureUsage, refreshSubscription, getResumeUsage } = useSubscription();
  const location = useLocation();

  // Navigation state - automatically select tab based on route
  const getInitialTab = () => {
    if (location.pathname === '/resume/builder') return 'builder';
    if (location.pathname === '/jobs') return 'analysis';
    if (location.pathname === '/resume') return 'resumes';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'builder' | 'resumes' | 'analysis'>(getInitialTab());
  const containerRef = useRef<HTMLDivElement>(null);

  // Common state
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Resume Builder State
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: 'My Professional Resume',
    personalInfo: {
      fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email || '',
      phone: '',
      location: '',
      website: '',
      linkedin: ''
    },
    summary: '',
    experiences: [],
    education: [],
    skills: []
  });

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic-professional');
  const [isExporting, setIsExporting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // My Resumes State
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);

  // Job Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JobAnalysis | null>(null);

  // Form for resume generation and job analysis
  const resumeForm = useForm({
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      requirements: '',
      format: 'markdown',
      includeSummary: true,
      includeSkills: true,
      includeExperience: true,
      includeEducation: true,
      includeCertifications: true,
      maxLength: 1000,
    },
  });

  const jobAnalysisForm = useForm({
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      requirements: '',
      jobUrl: '',
    },
  });

  // Define navigation tabs
  const navigationTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FiLayers,
      description: 'Resume hub dashboard and statistics'
    },
    {
      id: 'builder',
      label: 'Resume Builder',
      icon: FiEdit3,
      description: 'Create and customize professional resumes'
    },
    {
      id: 'resumes',
      label: 'My Resumes',
      icon: FiFile,
      description: 'Manage and generate tailored resumes'
    },
    {
      id: 'analysis',
      label: 'Job Analysis',
      icon: FiBriefcase,
      description: 'Analyze job postings and market trends'
    }
  ];

  // Animation effects
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  // Update active tab when route changes
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Animate tab transition
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach((button, index) => {
      if (button && navigationTabs[index]?.id !== activeTab) {
        gsap.to(button, {
          scale: 1,
          opacity: 0.7,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    // Animate active tab
    const activeButton = document.querySelector(`[data-tab="${activeTab}"]`);
    if (activeButton) {
      gsap.to(activeButton, {
        scale: 1.05,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [activeTab]);

  // Tab selection with animation
  const selectTab = (tabId: string) => {
    setActiveTab(tabId as any);

    // Animate tab content
    const tabIndex = navigationTabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
      gsap.fromTo(
        '.tab-content',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  };

  // Load saved resumes
  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const response = await apiService.getUserResumes();
      if (response.success) {
        setSavedResumes(response.data || []);
      } else {
        showToastMessage('Failed to load saved resumes', 'error');
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
      showToastMessage('Failed to load saved resumes', 'error');
    } finally {
      setIsLoadingResumes(false);
    }
  };

  // Utility functions
  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  // Resume generation handler
  const handleResumeGeneration = async (data: any) => {
    const usageCheck = await checkFeatureUsage('resume_generation');
    if (!usageCheck.allowed) {
      showToastMessage(
        'Resume generation limit reached. Please upgrade your plan to generate more resumes.',
        'error'
      );
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiService.generateResume(data);
      if (response.success && response.data) {
        setGeneratedResume(response.data.content);
        showToastMessage('Resume generated successfully!', 'success');
        refreshSubscription();
      } else {
        throw new Error(response.error || 'Failed to generate resume');
      }
    } catch (error: any) {
      showToastMessage(error.message || 'Failed to generate resume. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Job analysis handler
  const handleJobAnalysis = async (data: any) => {
    setIsAnalyzing(true);
    try {
      const response = await apiService.analyzeJob(data);
      if (response.success && response.data) {
        setAnalysisResult(response.data);
        showToastMessage('Job analysis completed successfully.', 'success');
      } else {
        throw new Error(response.error || 'Failed to analyze job');
      }
    } catch (error: any) {
      showToastMessage(error.message || 'Failed to analyze job posting. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Resume builder handlers
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      const response = await saveResume({
        title: resumeData.title,
        content: resumeData,
        templateId: selectedTemplate,
        isPublic: false
      });
      if (response.success) {
        setLastSaved(new Date());
        showToastMessage('Resume saved successfully!', 'success');
        loadSavedResumes(); // Refresh the resumes list
      } else {
        throw new Error(response.error || 'Failed to save resume');
      }
    } catch (error: any) {
      showToastMessage(error.message || 'Failed to save resume', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const addExperience = (experience: Omit<WorkExperience, 'id'>) => {
    const newExperience = {
      ...experience,
      id: Date.now().toString()
    };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
    setShowExperienceForm(false);
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    const newEducation = {
      ...education,
      id: Date.now().toString()
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    setShowEducationForm(false);
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill = {
      ...skill,
      id: Date.now().toString()
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    setShowSkillForm(false);
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Resume Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your complete resume management solution. Build, organize, and optimize your professional documents.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Resumes</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{savedResumes.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FiFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Analyses Done</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysisResult ? '1' : '0'}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Usage This Month</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{getResumeUsage().used}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FiActivity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('builder')}
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FiEdit3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-blue-900 dark:text-blue-300">Build Resume</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Create a new resume</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('resumes')}
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <FiFile className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-green-900 dark:text-green-300">Generate Resume</div>
              <div className="text-sm text-green-600 dark:text-green-400">AI-powered creation</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <FiBriefcase className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-purple-900 dark:text-purple-300">Analyze Job</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Get market insights</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        {savedResumes.length > 0 ? (
          <div className="space-y-3">
            {savedResumes.slice(0, 3).map((resume) => (
              <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <FiFileText className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{resume.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(resume.createdAt)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedResume(resume);
                    setShowPreview(true);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <FiEye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No resumes yet. Start building your first resume!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBuilder = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and customize your professional resume</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiLayers className="w-4 h-4 mr-2" />
            Templates
          </button>
          <button
            onClick={handleSaveResume}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Resume Builder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Summary</h3>
            <textarea
              value={resumeData.summary}
              onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Write a brief summary of your professional experience and skills..."
            />
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h3>
              <button
                onClick={() => setShowExperienceForm(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{exp.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {resumeData.experiences.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No work experience added yet. Click "Add" to get started.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h3>
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
            >
              <FiEye className="w-4 h-4 mr-1" />
              Full Preview
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[400px]">
            <div className="text-center text-gray-500 dark:text-gray-400">
              Resume preview will appear here
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTemplateSelector && (
        <TemplatePicker
          selectedTemplateId={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          onPreview={setPreviewTemplateId}
          className="fixed inset-0 z-50"
        />
      )}

      {previewTemplateId && (
        <TemplatePreviewModal
          templateId={previewTemplateId}
          isOpen={!!previewTemplateId}
          resumeData={resumeData}
          onClose={() => setPreviewTemplateId(null)}
          onSelect={() => {
            setSelectedTemplate(previewTemplateId);
            setPreviewTemplateId(null);
          }}
        />
      )}
    </div>
  );

  const renderResumes = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Resumes</h2>
          <p className="text-gray-600 dark:text-gray-400">Generate and manage your tailored resumes</p>
        </div>
        <ResumeUsageDisplay />
      </div>

      {/* Resume Generation Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generate Tailored Resume</h3>
        <form onSubmit={resumeForm.handleSubmit(handleResumeGeneration)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <input
                {...resumeForm.register('jobTitle', { required: true })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                {...resumeForm.register('companyName')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Google"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Description
            </label>
            <textarea
              {...resumeForm.register('jobDescription', { required: true })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FiZap className="w-4 h-4 mr-2" />
                  Generate Resume
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Resume */}
      {generatedResume && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Resume</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(generatedResume)}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
              >
                <FiCopy className="w-4 h-4 mr-1" />
                Copy
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
              >
                <FiDownload className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          </div>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown>{generatedResume}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Saved Resumes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Resumes</h3>
        {isLoadingResumes ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading resumes...</p>
          </div>
        ) : savedResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedResumes.map((resume) => (
              <div key={resume.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{resume.title}</h4>
                  <button
                    onClick={() => {
                      setSelectedResume(resume);
                      setShowPreview(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {formatDate(resume.createdAt)}
                </p>
                <div className="flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded">
                    <FiEdit className="w-3 h-3 inline mr-1" />
                    Edit
                  </button>
                  <button className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded">
                    <FiDownload className="w-3 h-3 inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No saved resumes yet. Generate your first resume above!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Analysis</h2>
        <p className="text-gray-600 dark:text-gray-400">Analyze job postings and get market insights</p>
      </div>

      {/* Analysis Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Information</h3>
        <form onSubmit={jobAnalysisForm.handleSubmit(handleJobAnalysis)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <input
                {...jobAnalysisForm.register('jobTitle', { required: true })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                {...jobAnalysisForm.register('companyName')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Microsoft"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Description
            </label>
            <textarea
              {...jobAnalysisForm.register('jobDescription', { required: true })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Paste the complete job description here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job URL (Optional)
            </label>
            <input
              {...jobAnalysisForm.register('jobUrl')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <FiSearch className="w-4 h-4 mr-2" />
                  Analyze Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Analysis</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analysisResult.matchScore}%
                </div>
                <div className={`text-sm px-3 py-1 rounded-full inline-block ${getScoreColor(analysisResult.matchScore)}`}>
                  {getScoreLabel(analysisResult.matchScore)}
                </div>
              </div>
              <div className="w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${analysisResult.matchScore * 2.51} 251`}
                    className={getProgressColor(analysisResult.matchScore)}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Salary Range</h4>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${analysisResult.salaryRange?.min?.toLocaleString()} - ${analysisResult.salaryRange?.max?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {analysisResult.salaryRange?.currency || 'USD'}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <FiMapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {analysisResult.jobDetails.location || 'Not specified'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {analysisResult.jobDetails.type || 'On-site'}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <FiTrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Experience Level</h4>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {analysisResult.jobDetails.experience || 'Mid-level'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Experience required
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          {(analysisResult.matchingSkills.length > 0 || analysisResult.missingSkills.length > 0) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.matchingSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Matching Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matchingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {analysisResult.missingSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysisResult.recommendations && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <div className="space-y-3">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'builder':
        return renderBuilder();
      case 'resumes':
        return renderResumes();
      case 'analysis':
        return renderAnalysis();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {showToast && (
          <div className={`fixed top-8 right-8 z-50 p-6 rounded-2xl shadow-2xl transition-all duration-500 transform backdrop-blur-sm ${showToast.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border border-emerald-300/30'
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border border-red-300/30'
            } animate-in slide-in-from-right-5`}>
            <div className="flex items-center space-x-3">
              {showToast.type === 'success' ? (
                <div className="bg-white/20 p-1 rounded-full">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="bg-white/20 p-1 rounded-full">
                  <FiXCircle className="w-5 h-5" />
                </div>
              )}
              <span className="font-medium">{showToast.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4">
            <FiLayers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resume Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {navigationTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
            {navigationTabs.map((tab, index) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => selectTab(tab.id)}
                className={`tab-button flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <tab.icon className={`w-6 h-6 transition-all duration-300 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'
                  } mr-3`} />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-8">
          <select
            value={activeTab}
            onChange={(e) => selectTab(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {navigationTabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            Section {navigationTabs.findIndex(tab => tab.id === activeTab) + 1} of {navigationTabs.length}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
