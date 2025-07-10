// Enhanced Background Script for Resume Plan AI Extension

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
  | 'OPEN_FULL_ANALYSIS'
  | 'SYNC_WITH_BACKEND';

interface Message<T = unknown> {
  type: MessageType;
  data?: T;
}

interface UserProfile {
  name?: string;
  email?: string;
  location?: string;
  skills: Array<{ name: string; level?: string; yearsOfExperience?: number }>;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
  }>;
}

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  platform: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'rejected' | 'offer';
  url: string;
  notes?: string;
}

// API configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  TIMEOUT: 30000,
  ENDPOINTS: {
    ANALYZE: '/api/analysis/analyze-job',
    PROFILE: '/api/user/profile',
    RESUME_GENERATE: '/api/resume/generate'
  }
} as const;

// Initialize the extension
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  console.log('Background script received message:', message.type);

  switch (message.type) {
    case 'ANALYZE_JOB_LISTING':
      handleJobListingAnalysis(message.data)
        .then(sendResponse)
        .catch(error => {
          console.error('Error handling job listing analysis:', error);
          sendResponse({ success: false, error: String(error) });
        });
      return true; // Keep message channel open for async response

    case 'GET_USER_PROFILE':
      getUserProfile()
        .then(sendResponse)
        .catch(error => {
          console.error('Error getting user profile:', error);
          sendResponse({ success: false, error: String(error) });
        });
      return true;

    case 'SAVE_USER_PROFILE':
      saveUserProfile(message.data as UserProfile)
        .then(sendResponse)
        .catch(error => {
          console.error('Error saving user profile:', error);
          sendResponse({ success: false, error: String(error) });
        });
      return true;

    case 'SAVE_APPLICATION':
      saveJobApplication(message.data as JobApplication)
        .then(sendResponse)
        .catch(error => {
          console.error('Error saving application:', error);
          sendResponse({ success: false, error: String(error) });
        });
      return true;

    case 'GET_APPLICATIONS':
      getJobApplications()
        .then(sendResponse)
        .catch(error => {
          console.error('Error getting applications:', error);
          sendResponse({ success: false, error: String(error) });
        });
      return true;

    case 'OPEN_FULL_ANALYSIS':
      chrome.tabs.create({ url: 'http://localhost:5173/job-analysis' });
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Handle job listing analysis
async function handleJobListingAnalysis(jobData: any): Promise<any> {
  try {
    console.log('Analyzing job data:', jobData);

    // Try to send to backend API
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobData }),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
      });

      if (response.ok) {
        const analysisResult = await response.json();
        return { success: true, data: analysisResult };
      } else {
        console.warn('Backend analysis failed, using mock data');
        return { success: true, data: getMockAnalysis() };
      }
    } catch (fetchError) {
      console.warn('Failed to reach backend, using mock data:', fetchError);
      return { success: true, data: getMockAnalysis() };
    }
  } catch (error) {
    console.error('Error in handleJobListingAnalysis:', error);
    return { success: false, error: String(error) };
  }
}

// Get user profile from storage or API
async function getUserProfile(): Promise<any> {
  try {
    // First try to get from local storage
    const result = await chrome.storage.local.get(['userProfile']);
    if (result.userProfile) {
      return { success: true, data: result.userProfile };
    }

    // If not in storage, try to get from API
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
      });

      if (response.ok) {
        const profile = await response.json();
        // Save to local storage for faster access
        await chrome.storage.local.set({ userProfile: profile });
        return { success: true, data: profile };
      }
    } catch (fetchError) {
      console.warn('Failed to fetch profile from API:', fetchError);
    }

    // Return default profile if nothing found
    const defaultProfile: UserProfile = {
      name: 'Job Seeker',
      skills: [],
      experience: [],
      education: []
    };

    return { success: true, data: defaultProfile };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: String(error) };
  }
}

// Save user profile to storage and API
async function saveUserProfile(profile: UserProfile): Promise<any> {
  try {
    // Save to local storage
    await chrome.storage.local.set({ userProfile: profile });

    // Try to save to API
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
      });

      if (!response.ok) {
        console.warn('Failed to save profile to API, but saved locally');
      }
    } catch (fetchError) {
      console.warn('Failed to reach API for profile save:', fetchError);
    }

    return { success: true, message: 'Profile saved successfully' };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error: String(error) };
  }
}

// Save job application
async function saveJobApplication(application: JobApplication): Promise<any> {
  try {
    // Get existing applications
    const result = await chrome.storage.local.get(['applications']);
    const applications = result.applications || [];

    // Add new application
    applications.push(application);

    // Save back to storage
    await chrome.storage.local.set({ applications });

    return { success: true, message: 'Application saved successfully' };
  } catch (error) {
    console.error('Error saving job application:', error);
    return { success: false, error: String(error) };
  }
}

// Get job applications
async function getJobApplications(): Promise<any> {
  try {
    const result = await chrome.storage.local.get(['applications']);
    const applications = result.applications || [];
    return { success: true, data: applications };
  } catch (error) {
    console.error('Error getting job applications:', error);
    return { success: false, error: String(error) };
  }
}

// Mock analysis data for when backend is unavailable
function getMockAnalysis() {
  return {
    matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
    matchingSkills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
    missingSkills: ['TypeScript', 'Docker', 'AWS'],
    suggestions: [
      'Highlight your JavaScript and React experience',
      'Consider learning TypeScript for better job prospects',
      'Add any cloud platform experience you have',
      'Emphasize problem-solving skills in your resume'
    ],
    salaryData: {
      min: 80000,
      max: 120000,
      median: 100000,
      currency: 'USD',
      location: 'United States'
    },
    interviewQuestions: [
      'Tell me about a challenging project you worked on',
      'How do you handle debugging complex issues?',
      'What's your experience with modern JavaScript frameworks?',
      'How do you stay updated with new technologies?'
    ]
  };
}

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Resume Plan AI Extension installed');
    // Set default settings
    chrome.storage.local.set({
      settings: {
        theme: 'light',
        enableNotifications: true,
        autoAnalyze: true
      }
    });
  }
});

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener(() => {
  console.log('Extension update available');
  chrome.runtime.reload();
});

console.log('Resume Plan AI background script loaded');
