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
    // In a real extension, we would send a message to the background script
    // to analyze the current page and get the results
    const analyzeCurrentPage = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real extension, we would get this from the background script
        // const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        // const response = await chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_ANALYSIS' });
        
        // For now, use mock data
        setAnalysis(MOCK_ANALYSIS);
        setIsLoading(false);
      } catch (error) {
        console.error('Error analyzing page:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    analyzeCurrentPage();
  }, []);

  const handleGenerateResume = () => {
    // In a real extension, this would open a new tab with the resume builder
    // or send a message to the background script to generate the resume
    alert('Resume generation will be implemented in the next phase!');
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
const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Popup />);

// Add TypeScript type definitions for Chrome extension API
declare global {
  interface Window {
    chrome: any;
  }
}
