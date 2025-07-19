#!/usr/bin/env node

const testHighConfidenceScam = async () => {
  console.log("🔐 Authenticating...");

  // Login to get auth token
  const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: "testuser@example.com",
      password: "TestPassword123!"
    })
  });

  const loginResult = await loginResponse.json();
  const authToken = loginResult.data.accessToken;

  // Test with a super obvious scam that should get >80% confidence
  const superObviousScam = {
    title: "URGENT!!! Make $10,000 Weekly Working From Home!!!",
    company: "Quick Money LLC",
    description: "Make money FAST! No experience required! Just send us $500 for training materials and you'll earn $10,000 per week GUARANTEED! Work only 1 hour per day from home! Contact us immediately on WhatsApp +1234567890. Limited time offer! Act now before spots fill up! 100% GUARANTEED INCOME!!!",
    salary: "$10,000/week",
    location: "Work from anywhere",
    contactEmail: "makemoneyfast123@gmail.com",
    url: "https://quick-money-now.tk",
    requirements: ["Send $500 for training", "Must act immediately"]
  };

  console.log("🔍 Testing super obvious scam job:");
  console.log(`Title: ${superObviousScam.title}`);
  console.log(`Company: ${superObviousScam.company}`);
  console.log(`Email: ${superObviousScam.contactEmail}`);

  try {
    const response = await fetch('http://localhost:3001/api/scams/analyze-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ jobData: superObviousScam })
    });

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

      if (analysis.confidence >= 0.8) {
        console.log(`   🚫 Should be automatically BANNED`);

        // Wait a moment for database operations to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Now check if it's actually banned
        const checkResponse = await fetch('http://localhost:3001/api/scams/check-banned', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            company: superObviousScam.company,
            email: superObviousScam.contactEmail,
            url: superObviousScam.url
          })
        });

        const checkResult = await checkResponse.json();
        console.log(`\n🔍 Banned Check Result: ${checkResult.data.isBanned ? '🚫 BANNED' : '✅ NOT BANNED'}`);
        if (checkResult.data.reasons.length > 0) {
          console.log(`📋 Reasons: ${checkResult.data.reasons.join(', ')}`);
        }
      } else {
        console.log(`   ⚠️  Confidence too low for auto-ban (need ≥80%)`);
      }
    }
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
};

testHighConfidenceScam().catch(console.error);
