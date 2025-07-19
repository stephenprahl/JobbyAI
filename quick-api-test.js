/**
 * Quick test to verify API key works directly with Google's API
 */

import { config } from 'dotenv';
config();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

console.log('🔑 Testing API Key:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT SET');

async function testDirectAPI() {
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
              text: 'Hello from JobbyAI! Please respond with "AI is working!" to confirm the connection.'
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ API Error:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ Direct API Test Success!');
    console.log('🤖 Gemini Response:', data.candidates[0].content.parts[0].text);

    // Now test with our SDK
    console.log('\n🔧 Testing with Google SDK...');
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent('Say "SDK is working!" to confirm this test.');
    const response2 = await result.response;
    const text = response2.text();

    console.log('✅ SDK Test Success!');
    console.log('🤖 SDK Response:', text);

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testDirectAPI();
