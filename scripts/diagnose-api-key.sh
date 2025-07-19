#!/bin/bash

echo "🔍 Gemini API Key Diagnostic"
echo "============================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Extract the API key from .env
api_key=$(grep "GOOGLE_GEMINI_API_KEY=" .env | cut -d'=' -f2 | tr -d '"' | tr -d "'")

echo "📋 Current API Key Status:"
echo "Length: ${#api_key} characters"
echo "First 10 chars: ${api_key:0:10}..."
echo "Last 5 chars: ...${api_key: -5}"

# Check if it's still the placeholder
if [ "$api_key" = "your_actual_api_key_here" ]; then
    echo "❌ Still using placeholder value!"
    echo "💡 You need to replace 'your_actual_api_key_here' with your real API key"
    exit 1
fi

# Check format
if [[ $api_key =~ ^AIzaSy.{33}$ ]]; then
    echo "✅ API key format looks correct"
else
    echo "⚠️  API key format looks incorrect"
    echo "   Expected: AIzaSy... (39 characters total)"
    echo "   Got: ${api_key:0:6}... (${#api_key} characters)"
fi

echo ""
echo "🧪 Testing API key with simple request..."

# Test the API key with a simple curl request
response=$(curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${api_key}" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts":[{
        "text": "Say hello"
      }]
    }]
  }')

if echo "$response" | grep -q "candidates"; then
    echo "✅ API key is working!"
    echo "🎉 Gemini responded successfully"
else
    echo "❌ API key test failed"
    echo "Response: $response"

    if echo "$response" | grep -q "API_KEY_INVALID"; then
        echo "💡 The API key is invalid. Please check:"
        echo "   - Make sure you copied the complete key"
        echo "   - Verify it's from Google AI Studio"
        echo "   - Try generating a new key"
    fi
fi
