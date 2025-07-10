import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Types
type Skill = {
  name: string;
  relevance: number;
};

type AnalysisResult = {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
};

// Mock data for development
const MOCK_ANALYSIS: AnalysisResult = {
  matchScore: 85,
  matchingSkills: ['React', 'Node.js', 'JavaScript', 'REST APIs', 'Git'],
  missingSkills: ['TypeScript', 'Docker', 'AWS'],
  suggestions: [
    'Add TypeScript to your skills section',
    'Highlight any containerization experience',
    'Mention any cloud platform experience'
  ]
};

const Popup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Get analysis results from the background script
    const getCurrentAnalysis = async () => {
      try {
        // Check if we're on a supported job site
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.url) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        const url = tab.url;
        const isJobSite = url.includes('linkedin.com/jobs/') ||
          url.includes('indeed.com/viewjob') ||
          url.includes('glassdoor.com/job-listing/');

        if (!isJobSite) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // Send message to content script to get current analysis
        const response = await chrome.tabs.sendMessage(tab.id!, { type: 'GET_CURRENT_ANALYSIS' });

        if (response?.success && response.data) {
          setAnalysis(response.data);
        } else {
          // Use mock data for now if no real analysis is available
          setAnalysis(MOCK_ANALYSIS);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting analysis:', error);
        // Fall back to mock data
        setAnalysis(MOCK_ANALYSIS);
        setIsLoading(false);
      }
    };

    getCurrentAnalysis();
  }, []);

  const handleGenerateResume = async () => {
    try {
      // Get the current tab to extract job data
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      // Send message to background script to generate resume
      const response = await chrome.runtime.sendMessage({
        type: 'GENERATE_RESUME',
        data: { tabId: tab.id, analysis }
      });

      if (response?.success) {
        // Open the Resume Plan AI app with the generated resume
        const resumeUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5173'}/resume-builder?resumeId=${response.resumeId}`;
        await chrome.tabs.create({ url: resumeUrl });
      } else {
        // Fallback: open the resume builder directly
        const appUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5173'}/resume-builder`;
        await chrome.tabs.create({ url: appUrl });
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      // Fallback: open the main app
      const appUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5173'}/`;
      await chrome.tabs.create({ url: appUrl });
    }
  };

  const handleOpenSettings = () => {
    // In a real extension, this would open the options page
    chrome.runtime.openOptionsPage();
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Analyzing job listing...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="error">
        <div className="error-icon">⚠️</div>
        <p>Could not analyze this page. Please try on a job listing page.</p>
        <p>Supported sites: LinkedIn, Indeed, Glassdoor</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <img src="/icons/icon48.png" alt="Resume Plan AI" className="logo" />
        <h1>Resume Plan AI</h1>
      </header>

      <main className="main-content">
        {analysis && (
          <>
            <div className="score-container">
              <div className="score-circle">
                {analysis.matchScore}%
              </div>
              <p className="score-label">Match Score</p>
            </div>

            <div className="section">
              <h3>Matching Skills</h3>
              <div className="skills-container">
                {analysis.matchingSkills.map((skill, index) => (
                  <span key={`match-${index}`} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {analysis.missingSkills.length > 0 && (
              <div className="section">
                <h3>Missing Skills</h3>
                <div className="skills-container missing">
                  {analysis.missingSkills.map((skill, index) => (
                    <span key={`missing-${index}`} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="section">
              <h3>Suggestions</h3>
              <ul className="suggestions-list">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={`suggestion-${index}`}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <button
              id="generate-resume"
              className="primary-button"
              onClick={handleGenerateResume}
            >
              Generate Tailored Resume
            </button>
          </>
        )}
      </main>

      <footer className="footer">
        <button
          id="settings-button"
          className="icon-button"
          title="Settings"
          onClick={handleOpenSettings}
        >
          ⚙️
        </button>
        <a
          href="https://resumeplan.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-button"
          title="Help"
        >
          ❓
        </a>
      </footer>
    </div>
  );
};

// Render the React component
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}

// Add TypeScript type definitions for Chrome extension API
declare global {
  interface Window {
    chrome: typeof chrome;
  }
}
