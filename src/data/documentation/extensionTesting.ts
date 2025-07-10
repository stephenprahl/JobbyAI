import { DocumentationFile } from '../../types/documentation.js';

export const extensionTestingDocumentation: DocumentationFile = {
  id: 'extension-testing',
  title: 'Chrome Extension Testing Guide',
  description: 'Comprehensive testing guide for the Resume Plan AI Chrome extension, including installation instructions, testing checklists, and debugging procedures.',
  version: '1.0.0',
  lastUpdated: '2025-07-10',
  authors: ['Resume Plan AI Team'],
  tags: ['testing', 'chrome-extension', 'qa', 'debugging'],
  status: 'approved',
  sections: [
    {
      id: 'build-status',
      title: 'Extension Build Status',
      content: '✅ EXTENSION BUILD COMPLETE - The enhanced Resume Plan AI Chrome extension has been successfully built and is ready for testing.',
      type: 'text'
    },
    {
      id: 'development-installation',
      title: 'Development Installation',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'dev-install-1',
          text: 'Open Chrome and navigate to chrome://extensions/',
          completed: false,
          category: 'installation',
          priority: 'high'
        },
        {
          id: 'dev-install-2',
          text: 'Enable "Developer mode" in the top right',
          completed: false,
          category: 'installation',
          priority: 'high'
        },
        {
          id: 'dev-install-3',
          text: 'Click "Load unpacked"',
          completed: false,
          category: 'installation',
          priority: 'high'
        },
        {
          id: 'dev-install-4',
          text: 'Select the /home/code/resume-plan-ai/extension/dist folder',
          completed: false,
          category: 'installation',
          priority: 'high'
        },
        {
          id: 'dev-install-5',
          text: 'The extension should now appear in your browser',
          completed: false,
          category: 'installation',
          priority: 'high'
        }
      ]
    },
    {
      id: 'production-package',
      title: 'Production Package',
      content: 'Packaged file: /home/code/resume-plan-ai/extension-clean.tar.gz - Extract and follow the same steps as development installation',
      type: 'text'
    },
    {
      id: 'basic-functionality',
      title: 'Basic Functionality Testing',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'basic-1',
          text: 'Extension popup opens when clicked',
          completed: false,
          category: 'basic-functionality',
          priority: 'high'
        },
        {
          id: 'basic-2',
          text: 'UI loads without errors (Chakra UI components)',
          completed: false,
          category: 'basic-functionality',
          priority: 'high'
        },
        {
          id: 'basic-3',
          text: 'All tabs (Analysis, Applications, Profile, Tools) are accessible',
          completed: false,
          category: 'basic-functionality',
          priority: 'high'
        },
        {
          id: 'basic-4',
          text: 'Extension icon appears in toolbar',
          completed: false,
          category: 'basic-functionality',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'job-site-testing',
      title: 'Job Site Testing',
      type: 'checklist',
      content: 'Test on these supported platforms:',
      checklistItems: [
        {
          id: 'job-site-1',
          text: 'LinkedIn Jobs (*://linkedin.com/jobs/*)',
          completed: false,
          category: 'job-sites',
          priority: 'high'
        },
        {
          id: 'job-site-2',
          text: 'Indeed (*://indeed.com/viewjob*)',
          completed: false,
          category: 'job-sites',
          priority: 'high'
        },
        {
          id: 'job-site-3',
          text: 'Glassdoor (*://glassdoor.com/job-listing/*)',
          completed: false,
          category: 'job-sites',
          priority: 'high'
        },
        {
          id: 'job-site-4',
          text: 'Dice (*://dice.com/jobs/detail/*)',
          completed: false,
          category: 'job-sites',
          priority: 'medium'
        },
        {
          id: 'job-site-5',
          text: 'Monster (*://monster.com/job-openings/*)',
          completed: false,
          category: 'job-sites',
          priority: 'medium'
        },
        {
          id: 'job-site-6',
          text: 'ZipRecruiter (*://ziprecruiter.com/jobs/*)',
          completed: false,
          category: 'job-sites',
          priority: 'medium'
        },
        {
          id: 'job-site-7',
          text: 'CareerBuilder (*://careerbuilder.com/job/*)',
          completed: false,
          category: 'job-sites',
          priority: 'low'
        },
        {
          id: 'job-site-8',
          text: 'SimplyHired (*://simplyhired.com/job/*)',
          completed: false,
          category: 'job-sites',
          priority: 'low'
        },
        {
          id: 'job-site-9',
          text: 'Stack Overflow Jobs (*://stackoverflow.com/jobs/*)',
          completed: false,
          category: 'job-sites',
          priority: 'medium'
        },
        {
          id: 'job-site-10',
          text: 'AngelList/Wellfound (*://angel.co/*, *://wellfound.com/*)',
          completed: false,
          category: 'job-sites',
          priority: 'medium'
        },
        {
          id: 'job-site-11',
          text: 'Remote.co (*://remote.co/*)',
          completed: false,
          category: 'job-sites',
          priority: 'low'
        },
        {
          id: 'job-site-12',
          text: 'FlexJobs (*://flexjobs.com/*)',
          completed: false,
          category: 'job-sites',
          priority: 'low'
        }
      ]
    },
    {
      id: 'job-analysis-features',
      title: 'Job Analysis Features',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'analysis-1',
          text: 'Job data extraction works on job listing pages',
          completed: false,
          category: 'analysis',
          priority: 'high'
        },
        {
          id: 'analysis-2',
          text: 'Analysis tab shows match score and insights',
          completed: false,
          category: 'analysis',
          priority: 'high'
        },
        {
          id: 'analysis-3',
          text: 'Skills matching/missing skills detection',
          completed: false,
          category: 'analysis',
          priority: 'high'
        },
        {
          id: 'analysis-4',
          text: 'Salary data and company insights display',
          completed: false,
          category: 'analysis',
          priority: 'medium'
        },
        {
          id: 'analysis-5',
          text: 'Interview questions suggestions appear',
          completed: false,
          category: 'analysis',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'application-tracking',
      title: 'Application Tracking',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'app-track-1',
          text: 'Save application button works',
          completed: false,
          category: 'application-tracking',
          priority: 'high'
        },
        {
          id: 'app-track-2',
          text: 'Applications appear in Applications tab',
          completed: false,
          category: 'application-tracking',
          priority: 'high'
        },
        {
          id: 'app-track-3',
          text: 'Application status can be updated',
          completed: false,
          category: 'application-tracking',
          priority: 'medium'
        },
        {
          id: 'app-track-4',
          text: 'Application history is preserved',
          completed: false,
          category: 'application-tracking',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'integration-features',
      title: 'Integration Features',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'integration-1',
          text: '"Open Resume Builder" button opens main app',
          completed: false,
          category: 'integration',
          priority: 'high'
        },
        {
          id: 'integration-2',
          text: '"Generate Resume" creates tailored resume',
          completed: false,
          category: 'integration',
          priority: 'high'
        },
        {
          id: 'integration-3',
          text: '"View Full Analysis" opens detailed analysis in main app',
          completed: false,
          category: 'integration',
          priority: 'medium'
        },
        {
          id: 'integration-4',
          text: 'Backend API integration works (job analysis, user data)',
          completed: false,
          category: 'integration',
          priority: 'high'
        }
      ]
    },
    {
      id: 'prerequisites',
      title: 'Testing Environment Prerequisites',
      content: `# Backend running
curl http://localhost:3001/api/health

# Frontend running
curl http://localhost:5173

# Extension built
ls -la /home/code/resume-plan-ai/extension/dist/`,
      type: 'code',
      language: 'bash'
    },
    {
      id: 'debugging',
      title: 'Debugging Instructions',
      content: `Console Debugging:
1. Open Chrome DevTools (F12)
2. Check Console tab for any JavaScript errors
3. Check Network tab for API calls
4. Check Application tab > Storage for extension data

Extension-Specific Debugging:
1. Go to chrome://extensions/
2. Click "Details" on Resume Plan AI extension
3. Click "Inspect views: service worker" for background script debugging
4. Right-click extension popup > "Inspect" for popup debugging`,
      type: 'text'
    },
    {
      id: 'common-issues',
      title: 'Common Issues',
      type: 'list',
      content: '',
      items: [
        'CORS errors: Make sure backend has proper CORS configuration',
        'Content script not injecting: Check host permissions in manifest',
        'Popup not loading: Check for React/Chakra UI errors in console',
        'API calls failing: Verify backend is running and accessible'
      ]
    }
  ],
  metadata: {
    category: 'testing-qa',
    importance: 'critical',
    audience: ['testers', 'developers', 'qa-engineers'],
    relatedDocs: ['extension-enhancements', 'project-complete']
  }
};
