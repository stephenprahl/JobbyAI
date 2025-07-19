/**
 * Test different Gemini models to find which one works
 */

import { config } from 'dotenv';
config();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro'
];

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}...`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello!'
            }]
          }]
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${modelName} works!`);
      console.log(`   Response: ${data.candidates[0].content.parts[0].text.trim()}`);
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ ${modelName} failed:`, JSON.parse(error).error.message);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${modelName} error:`, error.message);
    return false;
  }
}

async function testAllModels() {
  console.log('🧪 Testing different Gemini models with your API key...\n');

  for (const model of modelsToTest) {
    await testModel(model);
    console.log(''); // Empty line for readability
  }

  // Also test listing available models
  console.log('📋 Checking available models...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available models:');
      data.models.forEach(model => {
        console.log(`   - ${model.name.replace('models/', '')}`);
      });
    } else {
      console.log('❌ Could not list models');
    }
  } catch (error) {
    console.log('❌ Error listing models:', error.message);
  }
}

testAllModels();
