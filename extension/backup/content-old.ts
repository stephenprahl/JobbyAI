// Enhanced Content Script for Resume Plan AI Extension

interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  jobType: string;
  experienceLevel: string;
  posted: string;
  url: string;
  platform: string;
}

interface CompanyData {
  name: string;
  size?: string;
  industry?: string;
  website?: string;
  logo?: string;
}

// Store current analysis results
let currentAnalysis: any = null;
let currentJobData: JobData | null = null;

// Listen for messages from the background script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message.type);

  switch (message.type) {
    case 'JOB_ANALYSIS_RESULT':
      displayAnalysisResults(message.data);
      sendResponse({ success: true });
      break;

    case 'GET_CURRENT_ANALYSIS':
      if (currentAnalysis) {
        sendResponse({ success: true, data: currentAnalysis });
      } else {
        analyzeJobListing().then(() => {
          sendResponse({ success: true, data: currentAnalysis });
        }).catch(error => {
          console.error('Analysis failed:', error);
          sendResponse({ success: false, error: error.message });
        });
        return true; // Will respond asynchronously
      }
      break;

    case 'GET_JOB_DATA':
      try {
        const jobData = extractJobData();
        currentJobData = jobData;
        sendResponse({ success: true, data: jobData });
      } catch (error) {
        console.error('Failed to extract job data:', error);
        sendResponse({ success: false, error: error.message });
      }
      break;

    case 'REFRESH_ANALYSIS':
      refreshAnalysis();
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Main function to analyze the current job listing
async function analyzeJobListing() {
  try {
    const jobData = extractJobData();
    currentJobData = jobData;

    // Send the job data to the background script for analysis
    const response = await chrome.runtime.sendMessage({
      type: 'ANALYZE_JOB_LISTING',
      data: jobData
    });

    if (response?.success) {
      currentAnalysis = response.data;
      displayAnalysisWidget(response.data);
    } else {
      console.error('Failed to analyze job listing:', response?.error);
    }
  } catch (error) {
    console.error('Error in analyzeJobListing:', error);
  }
}

// Extract job data from the current page based on the platform
function extractJobData(): JobData {
  const url = window.location.href;
  const hostname = window.location.hostname;

  let jobData: JobData = {
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [],
    benefits: [],
    jobType: '',
    experienceLevel: '',
    posted: '',
    url: url,
    platform: getPlatformName(hostname)
  };

  try {
    if (hostname.includes('linkedin.com')) {
      jobData = extractLinkedInJobData();
    } else if (hostname.includes('indeed.com')) {
      jobData = extractIndeedJobData();
    } else if (hostname.includes('glassdoor.com')) {
      jobData = extractGlassdoorJobData();
    } else if (hostname.includes('dice.com')) {
      jobData = extractDiceJobData();
    } else if (hostname.includes('monster.com')) {
      jobData = extractMonsterJobData();
    } else if (hostname.includes('ziprecruiter.com')) {
      jobData = extractZipRecruiterJobData();
    } else if (hostname.includes('stackoverflow.com')) {
      jobData = extractStackOverflowJobData();
    } else {
      // Generic extraction for unknown sites
      jobData = extractGenericJobData();
    }

    // Ensure required fields
    jobData.url = url;
    jobData.platform = getPlatformName(hostname);

    console.log('Extracted job data:', jobData);
    return jobData;
  } catch (error) {
    console.error('Error extracting job data:', error);
    return jobData;
  }
}

// Platform-specific extraction functions
function extractLinkedInJobData(): JobData {
  const selectors = {
    title: '.t-24.t-bold.inline, .job-details-jobs-unified-top-card__job-title',
    company: '.job-details-jobs-unified-top-card__company-name a, .job-details-jobs-unified-top-card__company-name',
    location: '.job-details-jobs-unified-top-card__bullet, .t-black--light.mt2',
    description: '.job-details-jobs-unified-top-card__job-description, .jobs-description__content',
    salary: '.job-details-jobs-unified-top-card__salary',
    jobType: '.job-details-jobs-unified-top-card__job-insight span',
    posted: '.job-details-jobs-unified-top-card__posted-date'
  };

  return {
    title: extractText(selectors.title),
    company: extractText(selectors.company),
    location: extractText(selectors.location),
    description: extractText(selectors.description),
    requirements: extractRequirements(selectors.description),
    benefits: extractBenefits(selectors.description),
    salary: extractText(selectors.salary),
    jobType: extractText(selectors.jobType),
    experienceLevel: extractExperienceLevel(selectors.description),
    posted: extractText(selectors.posted),
    url: window.location.href,
    platform: 'LinkedIn'
  };
}

function extractIndeedJobData(): JobData {
  const selectors = {
    title: '[data-testid="jobsearch-JobInfoHeader-title"], .jobsearch-JobInfoHeader-title',
    company: '[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating-companyHeader',
    location: '[data-testid="job-location"], .jobsearch-JobInfoHeader-subtitle',
    description: '#jobDescriptionText, [data-testid="jobsearch-JobComponent-description"]',
    salary: '.jobsearch-JobMetadataHeader-item',
    jobType: '.jobsearch-JobMetadataHeader-item'
  };

  return {
    title: extractText(selectors.title),
    company: extractText(selectors.company),
    location: extractText(selectors.location),
    description: extractText(selectors.description),
    requirements: extractRequirements(selectors.description),
    benefits: extractBenefits(selectors.description),
    salary: extractText(selectors.salary),
    jobType: extractText(selectors.jobType),
    experienceLevel: extractExperienceLevel(selectors.description),
    posted: '',
    url: window.location.href,
    platform: 'Indeed'
  };
}

function extractGlassdoorJobData(): JobData {
  const selectors = {
    title: '.job-search-key-container h1, [data-test="job-title"]',
    company: '.job-search-key-container .employer, [data-test="employer-name"]',
    location: '.job-search-key-container .location, [data-test="job-location"]',
    description: '.jobDescriptionContent, [data-test="job-description"]',
    salary: '.salary-estimate'
  };

  return {
    title: extractText(selectors.title),
    company: extractText(selectors.company),
    location: extractText(selectors.location),
    description: extractText(selectors.description),
    requirements: extractRequirements(selectors.description),
    benefits: extractBenefits(selectors.description),
    salary: extractText(selectors.salary),
    jobType: '',
    experienceLevel: extractExperienceLevel(selectors.description),
    posted: '',
    url: window.location.href,
    platform: 'Glassdoor'
  };
}

function extractDiceJobData(): JobData {
  const selectors = {
    title: '.jobTitle, .job-title',
    company: '.company, .employer-name',
    location: '.location, .job-location',
    description: '.job-description, .jobDescription',
    salary: '.salary'
  };

  return {
    title: extractText(selectors.title),
    company: extractText(selectors.company),
    location: extractText(selectors.location),
    description: extractText(selectors.description),
    requirements: extractRequirements(selectors.description),
    benefits: extractBenefits(selectors.description),
    salary: extractText(selectors.salary),
    jobType: '',
    experienceLevel: extractExperienceLevel(selectors.description),
    posted: '',
    url: window.location.href,
    platform: 'Dice'
  };
}

function extractMonsterJobData(): JobData {
  // Similar structure for Monster.com
  return extractGenericJobData();
}

function extractZipRecruiterJobData(): JobData {
  // Similar structure for ZipRecruiter
  return extractGenericJobData();
}

function extractStackOverflowJobData(): JobData {
  const selectors = {
    title: '.fs-headline1, .job-details--header h1',
    company: '.fc-black-800, .job-details--header .company',
    location: '.fc-black-500, .job-details--header .location',
    description: '.job-details--content, .prose'
  };

  return {
    title: extractText(selectors.title),
    company: extractText(selectors.company),
    location: extractText(selectors.location),
    description: extractText(selectors.description),
    requirements: extractRequirements(selectors.description),
    benefits: extractBenefits(selectors.description),
    jobType: '',
    experienceLevel: extractExperienceLevel(selectors.description),
    posted: '',
    url: window.location.href,
    platform: 'Stack Overflow'
  };
}

function extractGenericJobData(): JobData {
  // Generic extraction for unknown job sites
  const title = extractText('h1, .job-title, .title, [class*="title"], [class*="job"]');
  const company = extractText('.company, [class*="company"], [class*="employer"]');
  const location = extractText('.location, [class*="location"]');
  const description = extractText('.description, .job-description, [class*="description"], .content, .job-content');

  return {
    title: title || document.title,
    company: company,
    location: location,
    description: description,
    requirements: extractRequirements('.description, .job-description'),
    benefits: extractBenefits('.description, .job-description'),
    jobType: '',
    experienceLevel: extractExperienceLevel('.description, .job-description'),
    posted: '',
    url: window.location.href,
    platform: 'Generic'
  };
}

// Helper functions
function extractText(selector: string): string {
  const element = document.querySelector(selector);
  return element?.textContent?.trim() || '';
}

function extractRequirements(descriptionSelector: string): string[] {
  const description = extractText(descriptionSelector).toLowerCase();
  const requirements: string[] = [];

  // Look for common requirement patterns
  const skillPatterns = [
    /\b(react|angular|vue|javascript|typescript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin)\b/gi,
    /\b(node\.?js|express|django|flask|spring|rails|laravel)\b/gi,
    /\b(mysql|postgresql|mongodb|redis|elasticsearch)\b/gi,
    /\b(aws|azure|gcp|docker|kubernetes|jenkins|git)\b/gi,
    /\b(html|css|sass|scss|tailwind|bootstrap)\b/gi
  ];

  skillPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      requirements.push(...matches.map(match => match.toLowerCase()));
    }
  });

  return [...new Set(requirements)]; // Remove duplicates
}

function extractBenefits(descriptionSelector: string): string[] {
  const description = extractText(descriptionSelector).toLowerCase();
  const benefits: string[] = [];

  const benefitPatterns = [
    /health insurance/gi,
    /dental insurance/gi,
    /401k|retirement/gi,
    /remote work|work from home/gi,
    /flexible hours/gi,
    /paid time off|pto|vacation/gi,
    /stock options|equity/gi,
    /bonus/gi
  ];

  benefitPatterns.forEach(pattern => {
    if (pattern.test(description)) {
      benefits.push(pattern.source.replace(/\|/g, ' or '));
    }
  });

  return benefits;
}

function extractExperienceLevel(descriptionSelector: string): string {
  const description = extractText(descriptionSelector).toLowerCase();

  if (description.includes('senior') || description.includes('lead') || description.includes('principal')) {
    return 'Senior';
  } else if (description.includes('mid-level') || description.includes('intermediate')) {
    return 'Mid-level';
  } else if (description.includes('junior') || description.includes('entry') || description.includes('graduate')) {
    return 'Entry-level';
  }

  return 'Not specified';
}

function getPlatformName(hostname: string): string {
  if (hostname.includes('linkedin.com')) return 'LinkedIn';
  if (hostname.includes('indeed.com')) return 'Indeed';
  if (hostname.includes('glassdoor.com')) return 'Glassdoor';
  if (hostname.includes('dice.com')) return 'Dice';
  if (hostname.includes('monster.com')) return 'Monster';
  if (hostname.includes('ziprecruiter.com')) return 'ZipRecruiter';
  if (hostname.includes('stackoverflow.com')) return 'Stack Overflow';
  return hostname;
}

// Display analysis widget on the page
function displayAnalysisWidget(analysis: any) {
  // Remove existing widget
  const existingWidget = document.getElementById('resume-plan-ai-widget');
  if (existingWidget) {
    existingWidget.remove();
  }

  // Create floating widget
  const widget = document.createElement('div');
  widget.id = 'resume-plan-ai-widget';
  widget.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      width: 320px;
      background: white;
      border: 2px solid #3182ce;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
    ">
      <div style="
        background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div style="font-weight: 600;">Resume Plan AI</div>
        <button onclick="document.getElementById('resume-plan-ai-widget').remove()" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
        ">×</button>
      </div>
      <div style="padding: 16px;">
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 600;">Match Score</span>
            <span style="
              background: ${analysis.matchScore >= 80 ? '#48bb78' : analysis.matchScore >= 60 ? '#ed8936' : '#f56565'};
              color: white;
              padding: 4px 8px;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 600;
            ">${analysis.matchScore}%</span>
          </div>
          <div style="
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
          ">
            <div style="
              width: ${analysis.matchScore}%;
              height: 100%;
              background: ${analysis.matchScore >= 80 ? '#48bb78' : analysis.matchScore >= 60 ? '#ed8936' : '#f56565'};
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600; margin-bottom: 6px; color: #48bb78;">✓ Matching Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${analysis.matchingSkills.slice(0, 4).map(skill => 
              `<span style="background: #c6f6d5; color: #22543d; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${skill}</span>`
            ).join('')}
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-weight: 600; margin-bottom: 6px; color: #f56565;">⚠ Missing Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${analysis.missingSkills.slice(0, 3).map(skill => 
              `<span style="background: #fed7d7; color: #742a2a; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${skill}</span>`
            ).join('')}
          </div>
        </div>
        <button onclick="chrome.runtime.sendMessage({type: 'OPEN_FULL_ANALYSIS'})" style="
          width: 100%;
          background: #3182ce;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        ">View Full Analysis</button>
      </div>
    </div>
  `;

  document.body.appendChild(widget);
}

function displayAnalysisResults(data: any) {
  currentAnalysis = data;
  displayAnalysisWidget(data);
}

function refreshAnalysis() {
  currentAnalysis = null;
  currentJobData = null;
  analyzeJobListing();
}

// Auto-analyze when page loads (with delay to ensure content is loaded)
setTimeout(() => {
  if (document.readyState === 'complete') {
    analyzeJobListing();
  } else {
    window.addEventListener('load', analyzeJobListing);
  }
}, 2000);

console.log('Resume Plan AI content script loaded');
  // Store the analysis for later use
  currentAnalysis = analysis;

  // Create or update the analysis container
  let container = document.getElementById('resume-plan-ai-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'resume-plan-ai-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      max-width: 90%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(container);
  }

  // Create the analysis content
  container.innerHTML = `
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; color: #2d3748; font-size: 18px;">Resume Match Score</h3>
      <button id="close-analysis" style="background: none; border: none; cursor: pointer; font-size: 16px;">×</button>
    </div>
    <div style="margin-bottom: 16px;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #4299e1;
                  display: flex; align-items: center; justify-content: center; color: white;
                  font-weight: bold; font-size: 18px; margin-right: 12px;">
          ${analysis.matchScore}%
        </div>
        <div>
          <div style="font-weight: 500; color: #2d3748;">Strong Match</div>
          <div style="font-size: 14px; color: #718096;">Based on your profile</div>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 16px;">
      <div style="font-weight: 500; margin-bottom: 8px; color: #2d3748;">Matching Skills</div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
        ${analysis.matchingSkills.map((skill: string) =>
    `<span style="background: #ebf8ff; color: #2b6cb0; padding: 4px 8px;
                     border-radius: 4px; font-size: 13px;">${skill}</span>`
  ).join('')}
      </div>

      ${analysis.missingSkills.length > 0 ? `
        <div style="font-weight: 500; margin: 12px 0 8px 0; color: #2d3748;">Missing Skills</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
          ${analysis.missingSkills.map((skill: string) =>
    `<span style="background: #fff5f5; color: #c53030; padding: 4px 8px;
                       border-radius: 4px; font-size: 13px;">${skill}</span>`
  ).join('')}
        </div>
      ` : ''}

      <div style="margin-top: 16px;">
        <button id="generate-resume" style="background: #4299e1; color: white; border: none;
                  padding: 8px 16px; border-radius: 4px; cursor: pointer; width: 100%;
                  font-weight: 500;">
          Generate Tailored Resume
        </button>
      </div>
    </div>
  `;

  // Add event listeners
  document.getElementById('close-analysis')?.addEventListener('click', () => {
    container?.remove();
  });

  document.getElementById('generate-resume')?.addEventListener('click', () => {
    // Send message to background script to generate resume
    chrome.runtime.sendMessage({
      type: 'GENERATE_RESUME',
      data: { tabId: null, analysis: currentAnalysis }
    }).then((response) => {
      if (response?.success) {
        // Open the Resume Plan AI app with the generated resume
        const resumeUrl = `${chrome.runtime.getURL('').replace('chrome-extension://', 'http://localhost:5173')}/resume-builder?resumeId=${response.resumeId}`;
        window.open(resumeUrl, '_blank');
      } else {
        // Fallback: open the resume builder directly
        window.open('http://localhost:5173/resume-builder', '_blank');
      }
    }).catch(() => {
      // Fallback: open the main app
      window.open('http://localhost:5173/', '_blank');
    });
  });
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', analyzeJobListing);
} else {
  analyzeJobListing();
}
