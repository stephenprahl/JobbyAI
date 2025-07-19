#!/usr/bin/env node

const testScamDetection = async () => {
  // First, create a test user and get a real auth token
  console.log("🔐 Creating test user for authentication...");

  const testUser = {
    email: "testuser@example.com",
    password: "TestPassword123!",
    firstName: "Test",
    lastName: "User"
  };

  let authToken = null;

  try {
    // Try to register the test user
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      console.log("✅ Test user registered successfully");
    } else {
      console.log("ℹ️  Test user already exists, proceeding with login");
    }

    // Login to get the auth token
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const loginResult = await loginResponse.json();

    if (loginResult.success) {
      authToken = loginResult.data.accessToken;
      console.log("✅ Successfully authenticated test user");
    } else {
      console.log("❌ Failed to authenticate:", loginResult.error);
      return;
    }

  } catch (error) {
    console.log("❌ Authentication setup failed:", error.message);
    return;
  }

  // Test data - obviously scam job
  const scamJob = {
    title: "Work from Home - Make $5000/week",
    company: "Amazing Opportunities LLC",
    description: "No experience needed! Just send us $200 for training materials and start earning immediately! Work only 2 hours per day. Contact us on WhatsApp. Guaranteed income!",
    salary: "$5000/week",
    location: "Remote",
    contactEmail: "quickmoney123@gmail.com",
    url: "https://amazing-opportunities.tk",
    requirements: ["No experience needed"]
  };

  // Test data - legitimate job
  const legitimateJob = {
    title: "Software Engineer",
    company: "Tech Corp Inc",
    description: "We are looking for a skilled software engineer to join our team. You will be responsible for developing web applications using React and Node.js. This is a full-time position with competitive benefits.",
    salary: "$80,000 - $120,000",
    location: "San Francisco, CA",
    contactEmail: "hr@techcorp.com",
    url: "https://techcorp.com/careers",
    requirements: ["Bachelor's degree in Computer Science", "3+ years experience with React/Node.js", "Strong problem-solving skills"]
  };

  // Test data - suspicious but borderline job
  const suspiciousJob = {
    title: "Data Entry Specialist",
    company: "Global Data Solutions",
    description: "Easy data entry work from home. Flexible hours. Must be 18+. Contact immediately for quick start.",
    salary: "$25/hour",
    location: "Remote",
    contactEmail: "hiring@globaldatasolutions.info",
    url: "https://globaldatasolutions.info",
    requirements: ["Must be 18+"]
  };

  console.log("\n🔍 Testing AI Scam Detection System\n");

  const testJob = async (job, jobName) => {
    console.log(`\n📋 Testing ${jobName}:`);
    console.log(`Title: ${job.title}`);
    console.log(`Company: ${job.company}`);
    console.log(`Email: ${job.contactEmail}`);
    console.log(`URL: ${job.url}`);

    try {
      const response = await fetch('http://localhost:3001/api/scams/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ jobData: job })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ HTTP Error ${response.status}: ${errorText}`);
        return;
      }

      const result = await response.json();

      if (result.success) {
        const { analysis } = result.data;
        console.log(`\n✅ Analysis Result:`);
        console.log(`   🎯 Is Scam: ${analysis.isScam ? '❌ YES' : '✅ NO'}`);
        console.log(`   🎲 Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
        console.log(`   📊 Scam Type: ${analysis.scamType}`);
        console.log(`   ⚠️  Severity: ${analysis.severity}`);
        console.log(`   🧠 Reasoning: ${analysis.reasoning}`);
        console.log(`   🚩 Red Flags: ${analysis.redFlags.join(', ')}`);

        if (analysis.isScam) {
          console.log(`   🚫 Action: Job will be BANNED from platform`);
        } else if (analysis.confidence > 0.6) {
          console.log(`   ⚠️  Action: Job will be FLAGGED for manual review`);
        } else {
          console.log(`   ✅ Action: Job appears legitimate`);
        }
      } else {
        console.log(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }

    console.log('\n' + '─'.repeat(60));
  };

  // Test all three scenarios
  await testJob(scamJob, "OBVIOUS SCAM JOB");
  await testJob(legitimateJob, "LEGITIMATE JOB");
  await testJob(suspiciousJob, "SUSPICIOUS JOB");

  console.log('\n🎉 Testing completed!');

  // Test the check-banned endpoint
  console.log('\n🔍 Testing banned entity check...');

  try {
    const checkResponse = await fetch('http://localhost:3001/api/scams/check-banned', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        company: "Amazing Opportunities LLC",
        email: "quickmoney123@gmail.com",
        url: "https://amazing-opportunities.tk"
      })
    });

    const checkResult = await checkResponse.json();
    if (checkResult.success) {
      console.log(`📊 Banned Check Result: ${checkResult.data.isBanned ? '🚫 BANNED' : '✅ NOT BANNED'}`);
      if (checkResult.data.reasons.length > 0) {
        console.log(`📋 Reasons: ${checkResult.data.reasons.join(', ')}`);
      }
    }
  } catch (error) {
    console.log(`❌ Banned check failed: ${error.message}`);
  }
};

// Run the test
testScamDetection().catch(console.error);
