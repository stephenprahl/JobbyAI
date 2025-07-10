// Enhanced Content Script for Resume Plan AI Extension
import './content.css';

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

interface WidgetState {
  isMinimized: boolean;
  isDragging: boolean;
  position: { x: number; y: number };
  isVisible: boolean;
}

// Store current analysis results and widget state
let currentAnalysis: any = null;
let currentJobData: JobData | null = null;
let widgetState: WidgetState = {
  isMinimized: false,
  isDragging: false,
  position: { x: 20, y: 20 },
  isVisible: true
};

// Touch/mobile interaction variables
let touchStartY = 0;
let touchStartX = 0;
let initialScrollTop = 0;

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
        }).catch((error: unknown) => {
          console.error('Analysis failed:', error);
          sendResponse({ success: false, error: String(error) });
        });
        return true; // Will respond asynchronously
      }
      break;

    case 'GET_JOB_DATA':
      try {
        const jobData = extractJobData();
        currentJobData = jobData;
        sendResponse({ success: true, data: jobData });
      } catch (error: unknown) {
        console.error('Failed to extract job data:', error);
        sendResponse({ success: false, error: String(error) });
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
  return extractGenericJobData();
}

function extractZipRecruiterJobData(): JobData {
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

// Display analysis widget on the page with enhanced responsive design
function displayAnalysisWidget(analysis: any) {
  // Remove existing widget
  const existingWidget = document.getElementById('resume-plan-ai-widget');
  if (existingWidget) {
    existingWidget.remove();
  }

  // Create floating widget with enhanced features
  const widget = document.createElement('div');
  widget.id = 'resume-plan-ai-widget';
  widget.className = 'resume-plan-ai-widget';

  // Set initial position based on screen size
  setWidgetPosition(widget);

  widget.innerHTML = `
    <div class="resume-plan-ai-header" id="widget-header">
      <div class="resume-plan-ai-title">
        <div class="resume-plan-ai-logo">🎯</div>
        Resume Plan AI
      </div>
      <div class="resume-plan-ai-controls">
        <button class="resume-plan-ai-btn" id="minimize-widget" title="Minimize">
          ${widgetState.isMinimized ? '📂' : '📌'}
        </button>
        <button class="resume-plan-ai-btn" id="refresh-analysis" title="Refresh">🔄</button>
        <button class="resume-plan-ai-btn" id="close-widget" title="Close">✕</button>
      </div>
    </div>
    <div class="resume-plan-ai-content" id="widget-content" style="${widgetState.isMinimized ? 'display: none;' : ''}">
      <div class="resume-plan-ai-match-score">
        <div class="resume-plan-ai-score-header">
          <div class="resume-plan-ai-score-label">
            <div class="resume-plan-ai-score-icon">📊</div>
            Match Score
          </div>
          <div class="resume-plan-ai-score-badge ${getScoreClass(analysis.matchScore)}" id="score-badge">
            ${analysis.matchScore}%
          </div>
        </div>
        <div class="resume-plan-ai-progress-container">
          <div class="resume-plan-ai-progress-bar">
            <div class="resume-plan-ai-progress-fill ${getScoreClass(analysis.matchScore)}"
                 style="width: ${analysis.matchScore}%; animation: fillProgress 1s ease-out;">
            </div>
          </div>
          <div class="resume-plan-ai-score-label-text">${getScoreLabel(analysis.matchScore)}</div>
        </div>
      </div>

      <div class="resume-plan-ai-skills-section">
        <div class="resume-plan-ai-skills-grid">
          <div class="resume-plan-ai-skill-group matching">
            <div class="resume-plan-ai-skill-header">
              <span class="resume-plan-ai-skill-icon">✅</span>
              <span class="resume-plan-ai-skill-title">Matching Skills</span>
              <span class="resume-plan-ai-skill-count">${analysis.matchingSkills.length}</span>
            </div>
            <div class="resume-plan-ai-skill-list">
              ${analysis.matchingSkills.slice(0, 4).map((skill: string) =>
    `<span class="resume-plan-ai-skill-tag matching">${skill}</span>`
  ).join('')}
              ${analysis.matchingSkills.length > 4 ?
      `<span class="resume-plan-ai-skill-more">+${analysis.matchingSkills.length - 4} more</span>` : ''}
            </div>
          </div>

          <div class="resume-plan-ai-skill-group missing">
            <div class="resume-plan-ai-skill-header">
              <span class="resume-plan-ai-skill-icon">⚠️</span>
              <span class="resume-plan-ai-skill-title">Missing Skills</span>
              <span class="resume-plan-ai-skill-count">${analysis.missingSkills.length}</span>
            </div>
            <div class="resume-plan-ai-skill-list">
              ${analysis.missingSkills.slice(0, 3).map((skill: string) =>
        `<span class="resume-plan-ai-skill-tag missing">${skill}</span>`
      ).join('')}
              ${analysis.missingSkills.length > 3 ?
      `<span class="resume-plan-ai-skill-more">+${analysis.missingSkills.length - 3} more</span>` : ''}
            </div>
          </div>
        </div>
      </div>

      <div class="resume-plan-ai-actions">
        <button class="resume-plan-ai-action-btn primary" id="view-full-analysis">
          <span class="resume-plan-ai-btn-icon">📈</span>
          View Full Analysis
        </button>
        <button class="resume-plan-ai-action-btn secondary" id="save-job">
          <span class="resume-plan-ai-btn-icon">💾</span>
          Save Job
        </button>
      </div>

      <div class="resume-plan-ai-quick-stats">
        <div class="resume-plan-ai-stat">
          <div class="resume-plan-ai-stat-value">${Math.round((analysis.matchingSkills.length / (analysis.matchingSkills.length + analysis.missingSkills.length)) * 100)}%</div>
          <div class="resume-plan-ai-stat-label">Skills Match</div>
        </div>
        <div class="resume-plan-ai-stat">
          <div class="resume-plan-ai-stat-value">${analysis.missingSkills.length}</div>
          <div class="resume-plan-ai-stat-label">Skills to Learn</div>
        </div>
        <div class="resume-plan-ai-stat">
          <div class="resume-plan-ai-stat-value">${getPlatformName(window.location.hostname)}</div>
          <div class="resume-plan-ai-stat-label">Platform</div>
        </div>
      </div>
    </div>
  `;

  // Add event listeners for interactive elements
  setupWidgetEventListeners(widget, analysis);

  // Add drag functionality
  setupDragFunctionality(widget);

  // Add touch gestures for mobile
  setupTouchGestures(widget);

  document.body.appendChild(widget);

  // Store current analysis
  currentAnalysis = analysis;

  // Add entrance animation
  setTimeout(() => {
    widget.style.transform = 'translateY(0)';
    widget.style.opacity = '1';
  }, 100);
}

// Set widget position based on screen size and state
function setWidgetPosition(widget: HTMLElement) {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Mobile: stick to bottom
    widget.style.position = 'fixed';
    widget.style.bottom = '20px';
    widget.style.left = '20px';
    widget.style.right = '20px';
    widget.style.top = 'auto';
    widget.style.width = 'auto';
  } else {
    // Desktop: use stored position or default
    widget.style.position = 'fixed';
    widget.style.top = `${widgetState.position.y}px`;
    widget.style.right = `${widgetState.position.x}px`;
    widget.style.bottom = 'auto';
    widget.style.left = 'auto';
    widget.style.width = '420px';
  }

  if (widgetState.isMinimized) {
    widget.classList.add('minimized');
  }
}

// Setup all widget event listeners
function setupWidgetEventListeners(widget: HTMLElement, analysis: any) {
  widget.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    e.stopPropagation();

    if (target.id === 'close-widget') {
      closeWidget(widget);
    } else if (target.id === 'minimize-widget') {
      toggleMinimize(widget);
    } else if (target.id === 'refresh-analysis') {
      refreshAnalysis();
      animateRefresh(target);
    } else if (target.id === 'view-full-analysis') {
      openFullAnalysis();
    } else if (target.id === 'save-job') {
      saveJobListing();
    } else if (widget.classList.contains('minimized')) {
      // Click anywhere on minimized widget to expand
      toggleMinimize(widget);
    }
  });

  // Add hover effects for score badge
  const scoreBadge = widget.querySelector('#score-badge');
  if (scoreBadge) {
    scoreBadge.addEventListener('mouseenter', () => {
      scoreBadge.textContent = getScoreLabel(analysis.matchScore);
    });
    scoreBadge.addEventListener('mouseleave', () => {
      scoreBadge.textContent = `${analysis.matchScore}%`;
    });
  }

  // Prevent widget from being hidden when clicking inside
  widget.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Setup drag functionality for desktop
function setupDragFunctionality(widget: HTMLElement) {
  const header = widget.querySelector('#widget-header') as HTMLElement;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;

  if (!header || window.innerWidth <= 768) return; // Don't enable drag on mobile

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    widget.classList.add('dragging');

    startX = e.clientX;
    startY = e.clientY;
    initialX = widget.offsetLeft;
    initialY = widget.offsetTop;

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const currentX = initialX + (e.clientX - startX);
    const currentY = initialY + (e.clientY - startY);

    // Keep widget within viewport bounds
    const maxX = window.innerWidth - widget.offsetWidth;
    const maxY = window.innerHeight - widget.offsetHeight;

    const constrainedX = Math.max(0, Math.min(maxX, currentX));
    const constrainedY = Math.max(0, Math.min(maxY, currentY));

    widget.style.left = `${constrainedX}px`;
    widget.style.top = `${constrainedY}px`;
    widget.style.right = 'auto';

    // Update stored position
    widgetState.position.x = window.innerWidth - constrainedX - widget.offsetWidth;
    widgetState.position.y = constrainedY;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      widget.classList.remove('dragging');
    }
  });
}

// Setup touch gestures for mobile
function setupTouchGestures(widget: HTMLElement) {
  if (window.innerWidth > 768) return; // Only for mobile

  widget.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    initialScrollTop = window.pageYOffset;
  }, { passive: true });

  widget.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const diffY = touchStartY - touchY;
    const diffX = Math.abs(touchStartX - touchX);

    // If primarily vertical swipe and significant movement
    if (diffX < 50 && Math.abs(diffY) > 50) {
      if (diffY > 100) {
        // Swipe up to minimize
        if (!widgetState.isMinimized) {
          toggleMinimize(widget);
        }
      } else if (diffY < -100) {
        // Swipe down to expand
        if (widgetState.isMinimized) {
          toggleMinimize(widget);
        }
      }
    }
  }, { passive: true });
}

// Helper functions for the enhanced widget
function getScoreClass(score: number): string {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  return 'Needs Improvement';
}

function closeWidget(widget: HTMLElement) {
  widget.style.transform = 'translateY(-20px)';
  widget.style.opacity = '0';
  setTimeout(() => {
    widget.remove();
    widgetState.isVisible = false;
  }, 300);
}

function toggleMinimize(widget: HTMLElement) {
  const content = widget.querySelector('#widget-content') as HTMLElement;
  const minimizeBtn = widget.querySelector('#minimize-widget') as HTMLElement;
  const isMinimized = widget.classList.contains('minimized');

  if (isMinimized) {
    // Expand
    widget.classList.remove('minimized');
    content.style.display = 'block';
    minimizeBtn.textContent = '📌';
    widgetState.isMinimized = false;

    // Animate expansion
    setTimeout(() => {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 100);
  } else {
    // Minimize
    content.style.opacity = '0';
    content.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      widget.classList.add('minimized');
      content.style.display = 'none';
      minimizeBtn.textContent = '📂';
      widgetState.isMinimized = true;
    }, 200);
  }
}

function openFullAnalysis() {
  // Send message to background script to open full analysis
  chrome.runtime.sendMessage({
    type: 'OPEN_FULL_ANALYSIS',
    data: currentAnalysis
  });
}

function animateRefresh(element: HTMLElement) {
  element.classList.add('spinning');
  setTimeout(() => {
    element.classList.remove('spinning');
  }, 1000);
}

function refreshAnalysis() {
  const widget = document.getElementById('resume-plan-ai-widget');
  if (!widget) return;

  const content = widget.querySelector('.resume-plan-ai-content') as HTMLElement;
  if (content) {
    content.classList.add('loading');
  }

  // Re-analyze the current job listing
  analyzeJobListing().then(() => {
    if (content) {
      content.classList.remove('loading');
    }
  }).catch((error) => {
    console.error('Failed to refresh analysis:', error);
    if (content) {
      content.classList.remove('loading');
    }
  });
}

function saveJobListing() {
  if (!currentJobData) return;

  // Send job data to the extension popup/background for saving
  chrome.runtime.sendMessage({
    type: 'SAVE_JOB',
    data: {
      jobData: currentJobData,
      analysis: currentAnalysis,
      savedAt: new Date().toISOString()
    }
  });

  // Show success feedback
  showToast('Job saved successfully! 💾', 'success');
}

function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Remove existing toast
  const existingToast = document.getElementById('resume-plan-ai-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'resume-plan-ai-toast';
  toast.className = `resume-plan-ai-toast ${type}`;
  toast.textContent = message;

  // Add toast styles
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: '2147483648',
    opacity: '0',
    transition: 'all 0.3s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
  });

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function displayAnalysisResults(data: any) {
  currentAnalysis = data;
  displayAnalysisWidget(data);
}

// Auto-analyze when page loads (with delay to ensure content is loaded)
setTimeout(() => {
  if (document.readyState === 'complete') {
    analyzeJobListing();
  } else {
    window.addEventListener('load', analyzeJobListing);
  }
}, 2000);

// Handle window resize to adjust widget position
window.addEventListener('resize', () => {
  const widget = document.getElementById('resume-plan-ai-widget');
  if (widget) {
    setWidgetPosition(widget);
  }
});

// Handle page navigation (for SPAs)
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    // Delay to allow page content to load
    setTimeout(() => {
      analyzeJobListing();
    }, 3000);
  }
}, 1000);

console.log('Resume Plan AI content script loaded');
