// Enhanced Background Script for Resume Plan AI Extension

// Import types for Chrome extension API
/// <reference types="@types/chrome" />

// Define types for our messages
type MessageType = 
  | 'ANALYZE_JOB_LISTING' 
  | 'GET_USER_PROFILE' 
  | 'SAVE_USER_PROFILE' 
  | 'GENERATE_RESUME'
  | 'SAVE_APPLICATION'
  | 'GET_APPLICATIONS'
  | 'UPDATE_APPLICATION_STATUS'
  | 'GET_COMPANY_INSIGHTS'
  | 'GET_SALARY_DATA'
  | 'SCHEDULE_INTERVIEW_PREP'
  | 'OPEN_FULL_ANALYSIS'
  | 'SYNC_WITH_BACKEND';

interface Message<T = unknown> {
  type: MessageType;
  data?: T;
}

interface UserProfile {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills: Array<{ name: string; level?: string; yearsOfExperience?: number }>;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description?: string;
    skills?: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: string;
    endDate?: string;
  }>;
  languages?: Array<{
    name: string;
    proficiency: string;
  }>;
}

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  platform: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'rejected' | 'offer' | 'withdrawn';
  url: string;
  notes?: string;
  nextAction?: string;
  nextActionDate?: string;
  interviewDates?: string[];
  salaryRange?: string;
  contactPerson?: string;
}

interface CompanyInsights {
  name: string;
  size: string;
  industry: string;
  funding?: string;
  glassdoorRating?: number;
  linkedinEmployees?: number;
  recentNews?: string[];
  techStack?: string[];
  benefits?: string[];
  interviewProcess?: string[];
}

interface SalaryData {
  min: number;
  max: number;
  median: number;
  currency: string;
  location: string;
  source: string;
  lastUpdated: string;
}

interface Settings {
  theme: 'light' | 'dark';
  enableNotifications: boolean;
  autoAnalyze: boolean;
  syncWithBackend: boolean;
  defaultLocation: string;
  preferredSalaryRange: { min: number; max: number };
  jobAlerts: {
    enabled: boolean;
    keywords: string[];
    locations: string[];
    frequency: 'daily' | 'weekly';
  };
}
  apiUrl: string;
  autoAnalyze: boolean;
}

// API configuration from environment variables
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30 seconds
  ENDPOINTS: {
    ANALYZE: '/api/analyze',
    PROFILE: '/api/profile',
    RESUME_GENERATE: '/api/resume/generate'
  }
} as const;

// Type for the message sender
interface MessageSender extends chrome.runtime.MessageSender {
  tab?: chrome.tabs.Tab;
}

// Type for the sendResponse function
type SendResponse<T = unknown> = (response: T) => void;

// Initialize the extension
function initializeExtension() {
  // Set up message listeners
  chrome.runtime.onMessage.addListener((message: Message, sender: MessageSender, sendResponse: SendResponse) => {
    if (message.type === 'ANALYZE_JOB_LISTING') {
      handleJobListingAnalysis(message.data, sender.tab?.id)
        .then(sendResponse)
        .catch(error => {
          console.error('Error handling job listing analysis:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep the message channel open for async response
    } else if (message.type === 'GET_USER_PROFILE') {
      getUserProfile()
        .then(sendResponse)
        .catch(error => {
          console.error('Error getting user profile:', error);
          sendResponse({ success: false, error: 'Failed to get user profile' });
        });
      return true;
    } else if (message.type === 'SAVE_USER_PROFILE') {
      saveUserProfile(message.data as UserProfile)
        .then(sendResponse)
        .catch(error => {
          console.error('Error saving user profile:', error);
          sendResponse({ success: false, error: 'Failed to save user profile' });
        });
      return true;
    } else if (message.type === 'GENERATE_RESUME') {
      handleResumeGeneration(message.data as { tabId: number; analysis: any })
        .then(sendResponse)
        .catch(error => {
          console.error('Error generating resume:', error);
          sendResponse({ success: false, error: 'Failed to generate resume' });
        });
      return true;
    }
  });

  // Set up installation handler
  chrome.runtime.onInstalled.addListener(handleInstallation);

  // Set up update handler
  chrome.runtime.onUpdateAvailable.addListener(handleUpdateAvailable);
}

/**
 * Handle extension installation
 */
async function handleInstallation(details: chrome.runtime.InstalledDetails) {
  if (details.reason === 'install') {
    const defaultProfile: UserProfile = {
      name: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      headline: '',
      summary: '',
      skills: [],
      experience: [],
      education: [],
      certifications: []
    };

    const defaultSettings: Settings = {
      theme: 'light',
      enableNotifications: true,
      apiUrl: API_CONFIG.BASE_URL,
      autoAnalyze: true
    };

    try {
      await chrome.storage.local.set({
        userProfile: defaultProfile,
        settings: defaultSettings
      });

      // Open the onboarding page
      await chrome.tabs.create({
        url: chrome.runtime.getURL('onboarding.html')
      });
    } catch (error) {
      console.error('Error during extension installation:', error);
    }
  }
}

/**
 * Handle extension updates
 */
function handleUpdateAvailable(details: { version: string }) {
  console.log('Updating extension to version:', details.version);
  chrome.runtime.reload();
}

/**
 * Handle job listing analysis by sending data to the backend API
 */
async function handleJobListingAnalysis(jobData: unknown, tabId?: number) {
  try {
    // Get user profile from storage
    const { userProfile } = await chrome.storage.local.get('userProfile') as { userProfile?: UserProfile };

    // Call the backend API
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job: jobData,
        userProfile: userProfile || null,
        options: {
          includeMissingSkills: true,
          includeSuggestions: true,
          detailedAnalysis: false
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to analyze job listing');
    }

    const result = await response.json();

    // Send the analysis result back to the content script
    if (tabId) {
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: 'JOB_ANALYSIS_RESULT',
          data: result.data
        });
      } catch (error) {
        console.warn('Could not send message to tab', error);
      }
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error analyzing job listing:', error);

    // Send error to content script if possible
    if (tabId) {
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: 'JOB_ANALYSIS_ERROR',
          error: error instanceof Error ? error.message : 'Failed to analyze job listing'
        });
      } catch (e) {
        console.warn('Could not send error to tab', e);
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze job listing'
    };
  }
}

/**
 * Get user profile from storage
 */
async function getUserProfile() {
  try {
    const { userProfile } = await chrome.storage.local.get('userProfile') as { userProfile?: UserProfile };
    return { success: true, data: userProfile || null };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: 'Failed to get user profile' };
  }
}

/**
 * Save user profile to storage
 */
async function saveUserProfile(profile: UserProfile) {
  try {
    await chrome.storage.local.set({ userProfile: profile });
    return { success: true };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error: 'Failed to save user profile' };
  }
}

/**
 * Handle resume generation by sending job data and analysis to the backend
 */
async function handleResumeGeneration(data: { tabId: number; analysis: any }) {
  try {
    const { tabId, analysis } = data;

    // Get job data from the content script
    const jobResponse = await chrome.tabs.sendMessage(tabId, { type: 'GET_JOB_DATA' });
    if (!jobResponse?.success) {
      throw new Error('Failed to get job data from page');
    }

    // Get user profile from storage
    const { userProfile } = await chrome.storage.local.get('userProfile') as { userProfile?: UserProfile };

    // Transform user profile to match backend schema
    const userProfileFormatted = {
      name: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'John Doe',
      email: userProfile?.email || 'user@example.com',
      phone: userProfile?.phone || '',
      location: userProfile?.location || '',
      headline: userProfile?.headline || '',
      summary: userProfile?.summary || '',
      skills: userProfile?.skills?.map(skill => skill.name || skill) || [],
      experience: userProfile?.experience?.map(exp => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: !exp.endDate,
        description: exp.description,
        skills: []
      })) || [],
      education: userProfile?.education?.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        field: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: undefined
      })) || [],
      certifications: userProfile?.certifications?.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.issueDate,
        url: undefined
      })) || []
    };

    // Transform job data to match backend schema
    const jobListingFormatted = {
      title: jobResponse.data.title || 'Unknown Position',
      company: jobResponse.data.company || 'Unknown Company',
      description: jobResponse.data.description || '',
      requirements: jobResponse.data.requirements || [],
      location: jobResponse.data.location || '',
      salary: jobResponse.data.salary || '',
      skills: jobResponse.data.skills || [],
      experience: undefined,
      education: undefined,
      employmentType: undefined
    };

    // Call the backend API to generate resume
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESUME_GENERATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: userProfileFormatted,
        jobListing: jobListingFormatted,
        options: {
          format: 'markdown',
          includeSummary: true,
          includeSkills: true,
          includeExperience: true,
          includeEducation: true,
          includeCertifications: true,
          maxLength: 1000
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to generate resume');
    }

    const result = await response.json();
    return { success: true, resumeId: result.resumeId, data: result.data };
  } catch (error) {
    console.error('Error generating resume:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate resume'
    };
  }
}

// Initialize the extension when the script loads
initializeExtension();
