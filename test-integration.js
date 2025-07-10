// Integration Test Script for Resume Plan AI Extension
// Run this in the browser console to test backend connectivity

async function testExtensionIntegration() {
  console.log('🧪 Testing Resume Plan AI Extension Integration...\n');

  const API_BASE = 'http://localhost:3001';

  // Test 1: Health Check
  console.log('1️⃣ Testing Backend Health...');
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check: PASSED', healthData);
    } else {
      console.log('❌ Health Check: FAILED - Status:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Health Check: FAILED - Error:', error.message);
  }

  // Test 2: Analysis Endpoint
  console.log('\n2️⃣ Testing Job Analysis Endpoint...');
  try {
    const testJobData = {
      job: {
        title: "Senior Full Stack Developer",
        company: "TechCorp Solutions",
        description: "We are seeking a talented Senior Full Stack Developer with experience in React, Node.js, and modern web technologies.",
        requirements: ["JavaScript", "React", "Node.js", "TypeScript"],
        location: "San Francisco, CA",
        salary: "$120,000 - $160,000",
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL"],
        experience: 5,
        employmentType: "Full-time"
      },
      userProfile: {
        skills: ["JavaScript", "React", "Node.js", "Python"],
        experience: [
          {
            title: "Full Stack Developer",
            company: "Tech Startup",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
            description: "Developed web applications using React and Node.js",
            skills: ["JavaScript", "React", "Node.js"]
          }
        ],
        education: [
          {
            degree: "Bachelor of Science",
            institution: "University of California",
            field: "Computer Science",
            startDate: "2016-09-01",
            endDate: "2020-05-31"
          }
        ]
      },
      options: {
        includeMissingSkills: true,
        includeSuggestions: true,
        detailedAnalysis: true
      }
    };

    const analysisResponse = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testJobData)
    });

    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json();
      console.log('✅ Job Analysis: PASSED');
      console.log('📊 Match Score:', analysisData.matchScore || 'N/A');
      console.log('🎯 Matching Skills:', analysisData.matchingSkills?.length || 0);
      console.log('⚠️ Missing Skills:', analysisData.missingSkills?.length || 0);
    } else {
      console.log('❌ Job Analysis: FAILED - Status:', analysisResponse.status);
      const errorText = await analysisResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Job Analysis: FAILED - Error:', error.message);
  }

  // Test 3: Extension Detection
  console.log('\n3️⃣ Testing Extension Installation...');
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
    console.log('✅ Chrome Extension: DETECTED');
    console.log('📱 Extension ID:', chrome.runtime.id);

    // Test extension messaging if possible
    try {
      chrome.runtime.sendMessage({ type: 'PING' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('⚠️ Extension Messaging: Limited (background script may not be responding)');
        } else {
          console.log('✅ Extension Messaging: WORKING');
        }
      });
    } catch (error) {
      console.log('⚠️ Extension Messaging: Not available on this page');
    }
  } else {
    console.log('❌ Chrome Extension: NOT DETECTED');
    console.log('ℹ️ Make sure the extension is loaded in chrome://extensions/');
  }

  // Test 4: Content Script Detection
  console.log('\n4️⃣ Testing Content Script...');
  const widget = document.getElementById('resume-plan-ai-widget');
  if (widget) {
    console.log('✅ Content Script Widget: FOUND');
    console.log('📍 Widget Position:', widget.style.position);
  } else {
    console.log('ℹ️ Content Script Widget: Not found (visit a job site to see the widget)');
  }

  // Test 5: CORS Configuration
  console.log('\n5️⃣ Testing CORS Configuration...');
  try {
    const corsTestResponse = await fetch(`${API_BASE}/health`, {
      method: 'OPTIONS'
    });
    console.log('✅ CORS Preflight: PASSED');
  } catch (error) {
    console.log('⚠️ CORS Preflight: May need configuration for production');
  }

  console.log('\n🏁 Integration Test Complete!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Load extension in chrome://extensions/');
  console.log('   2. Visit extension-demo.html or a job site');
  console.log('   3. Test widget interactions and job analysis');
  console.log('   4. Check browser console for extension logs');
}

// Auto-run test
testExtensionIntegration();
