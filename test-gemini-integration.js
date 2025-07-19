/**
 * Test script to verify Google Gemini integration
 * Run with: bun run test-gemini-integration.js
 */

import { config } from 'dotenv';
config(); // Load environment variables

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

console.log('🧪 Testing Google Gemini Integration...\n');

// Test 1: Check if API key is configured
console.log('1️⃣ Checking API Key Configuration...');
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
  console.log('❌ Google Gemini API key not configured');
  console.log('💡 Please set GOOGLE_GEMINI_API_KEY in your .env file');
  console.log('📋 Get your API key from: https://makersuite.google.com/app/apikey');
  process.exit(1);
} else {
  console.log('✅ API key is configured');
}

// Test 2: Try to import and initialize Gemini service
console.log('\n2️⃣ Testing Gemini Service Import...');
try {
  const { chatCompletion, isGeminiConfigured } = await import('./src/server/services/gemini.js');

  if (isGeminiConfigured()) {
    console.log('✅ Gemini service initialized successfully');

    // Test 3: Simple API call
    console.log('\n3️⃣ Testing API Call...');
    try {
      const response = await chatCompletion([
        { role: 'user', content: 'Say "Hello from Gemini!" if you can read this.' }
      ]);

      console.log('✅ API call successful!');
      console.log('🤖 Gemini Response:', response.trim());

      // Test 4: Test JobbyAI-specific functionality
      console.log('\n4️⃣ Testing JobbyAI-specific AI functionality...');
      const jobAnalysisResponse = await chatCompletion([
        {
          role: 'system',
          content: 'You are a career advisor. Extract skills from job descriptions.'
        },
        {
          role: 'user',
          content: 'Extract skills from this job: Senior Software Engineer with 5+ years React, Node.js, PostgreSQL experience.'
        }
      ]);

      console.log('✅ Job analysis test successful!');
      console.log('🎯 Skills extracted:', jobAnalysisResponse.trim());

      console.log('\n🎉 All tests passed! Google Gemini is ready for JobbyAI.');

    } catch (apiError) {
      console.log('❌ API call failed:', apiError.message);
      if (apiError.message.includes('API_KEY_INVALID')) {
        console.log('💡 Your API key might be invalid. Please check it.');
      } else if (apiError.message.includes('SAFETY')) {
        console.log('💡 Request was blocked by safety filters. This is normal for some test content.');
      }
    }

  } else {
    console.log('❌ Gemini service not properly configured');
  }

} catch (importError) {
  console.log('❌ Failed to import Gemini service:', importError.message);
  console.log('💡 Make sure you have installed @google/generative-ai package');
  console.log('   Run: bun add @google/generative-ai');
}

console.log('\n📖 Next steps:');
console.log('1. Make sure GOOGLE_GEMINI_API_KEY is set in your .env file');
console.log('2. Get your API key from: https://makersuite.google.com/app/apikey');
console.log('3. Start your server with: bun run dev');
console.log('4. Check health endpoint: http://localhost:3001/health');
