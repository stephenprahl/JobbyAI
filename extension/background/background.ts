// Background script for Resume Plan AI extension

// Import types for Chrome extension API
/// <reference types="@types/chrome" />

// Define types for our messages
type MessageType = 'ANALYZE_JOB_LISTING' | 'GET_USER_PROFILE' | 'SAVE_USER_PROFILE';

interface Message<T = unknown> {
  type: MessageType;
  data?: T;
}

interface UserProfile {
  skills: Array<{ name: string; level?: string }>;
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
  certifications?: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate?: string;
  }>;
}

interface Settings {
  theme: 'light' | 'dark';
  enableNotifications: boolean;
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
    RESUME: '/api/resume'
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
      saveUserProfile(message.data)
        .then(sendResponse)
        .catch(error => {
          console.error('Error saving user profile:', error);
          sendResponse({ success: false, error: 'Failed to save user profile' });
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
      skills: [],
      experience: [],
      education: [],
      certifications: []
    };

    const defaultSettings: Settings = {
      theme: 'light',
      enableNotifications: true,
      apiUrl: API_BASE_URL,
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

// Initialize the extension when the script loads
initializeExtension();
