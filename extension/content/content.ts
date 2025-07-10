// Content script for Resume Plan AI extension

// Listen for messages from the background script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'JOB_ANALYSIS_RESULT') {
    displayAnalysisResults(message.data);
    sendResponse({ success: true });
  } else if (message.type === 'GET_CURRENT_ANALYSIS') {
    // Return the current analysis if available
    const container = document.getElementById('resume-plan-ai-container');
    if (container && currentAnalysis) {
      sendResponse({ success: true, data: currentAnalysis });
    } else {
      // Trigger a new analysis
      analyzeJobListing().then(() => {
        sendResponse({ success: true, data: currentAnalysis });
      });
    }
    return true; // Will respond asynchronously
  } else if (message.type === 'GET_JOB_DATA') {
    // Extract and return job data from the current page
    const jobData = extractJobData();
    sendResponse({ success: true, data: jobData });
  }
});

// Store current analysis results
let currentAnalysis: any = null;

// Main function to analyze the current job listing
async function analyzeJobListing() {
  const jobData = extractJobData();

  // Send the job data to the background script for analysis
  const response = await chrome.runtime.sendMessage({
    type: 'ANALYZE_JOB_LISTING',
    data: jobData
  });

  if (!response?.success) {
    console.error('Failed to analyze job listing:', response?.error);
  }
}

// Extract job data from the current page
function extractJobData() {
  // This will be customized for each job board
  const url = window.location.href;
  let jobData: any = {
    title: '',
    company: '',
    description: '',
    requirements: [],
    skills: [],
    location: '',
    url: url
  };

  // LinkedIn job listing
  if (url.includes('linkedin.com/jobs/')) {
    jobData.title = document.querySelector('.top-card-layout__title')?.textContent?.trim() || '';
    jobData.company = document.querySelector('.topcard__org-name-link')?.textContent?.trim() || '';
    jobData.location = document.querySelector('.topcard__flavor--bullet')?.textContent?.trim() || '';
    jobData.description = document.querySelector('.show-more-less-html__markup')?.innerHTML || '';
  }
  // Indeed job listing
  else if (url.includes('indeed.com/viewjob')) {
    jobData.title = document.querySelector('.jobsearch-JobInfoHeader-title')?.textContent?.trim() || '';
    jobData.company = document.querySelector('div[data-company-name]')?.textContent?.trim() || '';
    jobData.location = document.querySelector('.jobsearch-JobInfoHeader-subtitle > div:last-child')?.textContent?.trim() || '';
    jobData.description = document.querySelector('#jobDescriptionText')?.innerHTML || '';
  }
  // Glassdoor job listing
  else if (url.includes('glassdoor.com/job-listing/')) {
    jobData.title = document.querySelector('.job-title')?.textContent?.trim() || '';
    jobData.company = document.querySelector('.employerName')?.textContent?.trim() || '';
    jobData.location = document.querySelector('.location')?.textContent?.trim() || '';
    jobData.description = document.querySelector('.jobDescriptionContent')?.innerHTML || '';
  }

  // Extract skills and requirements from description (basic implementation)
  const descriptionText = jobData.description.toLowerCase();
  const commonSkills = ['javascript', 'typescript', 'react', 'node', 'python', 'java', 'aws', 'docker', 'kubernetes'];
  jobData.skills = commonSkills.filter(skill => descriptionText.includes(skill.toLowerCase()));

  return jobData;
}

// Display analysis results on the page
function displayAnalysisResults(analysis: any) {
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
