#!/usr/bin/env node

/**
 * Extension Functionality Test Script
 * Tests all routes and API endpoints used by the extension
 */

const API_BASE = 'http://localhost:3002';
const FRONTEND_BASE = 'http://localhost:5173';

// Test API endpoints
const testEndpoints = [
  // Health checks
  { url: `${API_BASE}/health`, method: 'GET', description: 'Server Health Check' },
  { url: `${API_BASE}/analyze/health`, method: 'GET', description: 'Analysis Service Health' },
  { url: `${API_BASE}/resume/health`, method: 'GET', description: 'Resume Service Health' },
  { url: `${API_BASE}/users/health`, method: 'GET', description: 'Users Service Health' },

  // Frontend routes (basic connectivity)
  { url: `${FRONTEND_BASE}/`, method: 'GET', description: 'Frontend Landing Page' },
  { url: `${FRONTEND_BASE}/dashboard`, method: 'GET', description: 'Dashboard Page' },
  { url: `${FRONTEND_BASE}/resume/builder`, method: 'GET', description: 'Resume Builder Page' },
  { url: `${FRONTEND_BASE}/jobs`, method: 'GET', description: 'Job Analysis Page' },
];

// Test job analysis API
const testJobAnalysis = async () => {
  const mockJobData = {
    job: {
      title: "Senior Frontend Developer",
      company: "TechCorp",
      description: "We are looking for a senior frontend developer with React and TypeScript experience.",
      requirements: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      skills: ["React", "TypeScript", "JavaScript"],
      experience: 5,
      education: "Bachelor's degree",
      employmentType: "Full-time"
    },
    userProfile: {
      skills: ["React", "TypeScript", "Node.js", "JavaScript", "HTML", "CSS"],
      experience: [
        {
          title: "Frontend Developer",
          company: "Previous Company",
          startDate: "2020-01-01",
          endDate: "2024-01-01",
          description: "Built React applications",
          skills: ["React", "TypeScript"]
        }
      ],
      education: [
        {
          degree: "Bachelor of Science",
          institution: "University",
          field: "Computer Science",
          startDate: "2016-09-01",
          endDate: "2020-05-01"
        }
      ]
    },
    options: {
      includeMissingSkills: true,
      includeSuggestions: true,
      detailedAnalysis: true
    }
  };

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockJobData)
    });

    if (!response.ok) {
      console.log(`❌ Job Analysis API: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ Job Analysis API: Working (Match Score: ${data.data?.matchScore || 'N/A'}%)`);
    return true;
  } catch (error) {
    console.log(`❌ Job Analysis API: ${error.message}`);
    return false;
  }
};

// Test resume generation API
const testResumeGeneration = async () => {
  const mockResumeData = {
    userProfile: {
      name: "John Developer",
      email: "john@example.com",
      phone: "+1-555-0123",
      location: "San Francisco, CA",
      headline: "Senior Frontend Developer",
      summary: "Experienced frontend developer with 5+ years of experience",
      skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
      experience: [
        {
          title: "Frontend Developer",
          company: "Previous Company",
          startDate: "2020-01",
          endDate: "2024-01",
          current: false,
          description: "Built React applications",
          skills: ["React", "TypeScript"]
        }
      ],
      education: [
        {
          degree: "Bachelor of Science",
          institution: "University",
          field: "Computer Science",
          startDate: "2016-09",
          endDate: "2020-05"
        }
      ],
      certifications: []
    },
    jobListing: {
      title: "Senior Frontend Developer",
      company: "TechCorp",
      description: "Looking for a senior frontend developer",
      requirements: ["React", "TypeScript"],
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      skills: ["React", "TypeScript"],
      experience: 5,
      education: "Bachelor's degree",
      employmentType: "Full-time"
    },
    options: {
      format: "markdown",
      includeSummary: true,
      includeSkills: true,
      includeExperience: true,
      includeEducation: true,
      includeCertifications: true,
      maxLength: 1000
    }
  };

  try {
    const response = await fetch(`${API_BASE}/resume/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockResumeData)
    });

    if (!response.ok) {
      console.log(`❌ Resume Generation API: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ Resume Generation API: Working (Generated ${data.data?.content?.length || 0} characters)`);
    return true;
  } catch (error) {
    console.log(`❌ Resume Generation API: ${error.message}`);
    return false;
  }
};

// Test user profile API
const testUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    if (!response.ok) {
      console.log(`❌ User Profile API: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ User Profile API: Working`);
    return true;
  } catch (error) {
    console.log(`❌ User Profile API: ${error.message}`);
    return false;
  }
};

// Test a single endpoint
const testEndpoint = async (endpoint) => {
  try {
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: endpoint.method === 'GET' ? {} : { 'Content-Type': 'application/json' }
    });

    const status = response.status;
    if (status >= 200 && status < 400) {
      console.log(`✅ ${endpoint.description}: ${status}`);
      return true;
    } else {
      console.log(`❌ ${endpoint.description}: ${status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${endpoint.description}: ${error.message}`);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('🧪 Testing Extension Functionality\n');
  console.log('='.repeat(50));

  let passed = 0;
  let total = 0;

  // Test basic endpoints
  console.log('\n📡 Testing API Endpoints:');
  for (const endpoint of testEndpoints) {
    total++;
    if (await testEndpoint(endpoint)) {
      passed++;
    }
  }

  // Test job analysis
  console.log('\n🔍 Testing Job Analysis:');
  total++;
  if (await testJobAnalysis()) {
    passed++;
  }

  // Test resume generation
  console.log('\n📄 Testing Resume Generation:');
  total++;
  if (await testResumeGeneration()) {
    passed++;
  }

  // Test user profile
  console.log('\n👤 Testing User Profile:');
  total++;
  if (await testUserProfile()) {
    passed++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All extension functionality is working correctly!');
  } else {
    console.log('⚠️  Some functionality may not work properly in the extension.');
  }

  console.log('\n🔧 Extension Button Routes to Test Manually:');
  console.log('- Resume Builder: http://localhost:5173/resume/builder');
  console.log('- Full Dashboard: http://localhost:5173/dashboard');
  console.log('- Job Analytics: http://localhost:5173/analytics');
  console.log('- Network Insights: http://localhost:5173/network');
  console.log('- Resume (Generator): http://localhost:5173/resume');
  console.log('- Profile: http://localhost:5173/profile');

  console.log('\n📋 Extension Features to Test:');
  console.log('1. Install extension in Chrome/Edge developer mode');
  console.log('2. Visit a job site (LinkedIn, Indeed, etc.)');
  console.log('3. Click extension icon to open popup');
  console.log('4. Test "Analysis" tab on job sites');
  console.log('5. Test "Save Application" button');
  console.log('6. Test "Build Resume" button');
  console.log('7. Test "Applications" tab');
  console.log('8. Test "Profile" tab');
  console.log('9. Test "Tools" tab buttons');
  console.log('10. Test extension on non-job sites (general dashboard)');
};

// Run the tests
runTests().catch(console.error);
