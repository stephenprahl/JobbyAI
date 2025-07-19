/**
 * Comprehensive Google Cloud API Key Diagnostic
 */

import { config } from 'dotenv';
config();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

console.log('🔧 Google Cloud API Key Diagnostic');
console.log('===================================');
console.log('');

// Step 1: Basic key validation
console.log('1️⃣ API Key Validation:');
console.log('   Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 'NOT SET');
console.log('   Key prefix:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT SET');

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_new_google_cloud_console_api_key_here') {
  console.log('❌ API key not properly set!');
  console.log('💡 Please update GOOGLE_GEMINI_API_KEY in your .env file');
  process.exit(1);
}

// Step 2: Check if Generative Language API is enabled
console.log('\n2️⃣ Checking API Availability:');
try {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
  );

  if (response.status === 403) {
    console.log('❌ API not enabled or billing not set up');
    console.log('💡 Solutions:');
    console.log('   1. Enable Generative Language API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.log('   2. Set up billing in Google Cloud Console');
    console.log('   3. Wait a few minutes for changes to propagate');
    process.exit(1);
  } else if (response.status === 400) {
    const error = await response.text();
    console.log('❌ Bad Request:', error);
  } else if (response.status === 401) {
    console.log('❌ Unauthorized - API key is invalid');
    console.log('💡 Generate a new API key in Google Cloud Console');
  } else if (response.ok) {
    const data = await response.json();
    console.log('✅ API is accessible');
    console.log('📋 Available models:');
    data.models.slice(0, 5).forEach(model => {
      console.log(`   - ${model.name.replace('models/', '')}`);
    });
  }
} catch (error) {
  console.log('❌ Network error:', error.message);
}

// Step 3: Test specific model
console.log('\n3️⃣ Testing Model Access:');
try {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello! Please respond with "API is working!" to confirm.'
          }]
        }]
      })
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log('✅ Model test successful!');
    console.log('🤖 Response:', data.candidates[0].content.parts[0].text.trim());
    console.log('\n🎉 Your API key is working perfectly!');
    console.log('🚀 You can now run: bun run dev');
  } else {
    const error = await response.text();
    console.log('❌ Model test failed:', error);

    // Parse the error for specific guidance
    try {
      const errorData = JSON.parse(error);
      if (errorData.error.code === 400) {
        console.log('💡 This might be a billing or API enablement issue');
        console.log('   Check Google Cloud Console for billing and API status');
      }
    } catch (parseError) {
      console.log('💡 Check your Google Cloud Console setup');
    }
  }
} catch (error) {
  console.log('❌ Request failed:', error.message);
}

console.log('\n📚 Helpful Links:');
console.log('   • Enable API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
console.log('   • API Keys: https://console.cloud.google.com/apis/credentials');
console.log('   • Billing: https://console.cloud.google.com/billing');
