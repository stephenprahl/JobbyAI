#!/bin/bash

# Google Gemini API Key Setup Helper
# Run with: ./setup-gemini-key.sh

echo "🤖 Google Gemini API Key Setup"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "💡 Make sure you're in the JobbyAI directory"
    exit 1
fi

echo "📋 To get your API key:"
echo "1. Go to: https://aistudio.google.com/app/apikey"
echo "2. Sign in with your Google account"
echo "3. Click 'Create API Key'"
echo "4. Copy the generated key (starts with 'AIzaSy...')"
echo ""

# Prompt for API key
read -p "🔑 Enter your Google Gemini API key: " api_key

# Validate the API key format
if [[ ! $api_key =~ ^AIzaSy[A-Za-z0-9_-]{35}$ ]]; then
    echo "⚠️  Warning: API key format doesn't look correct"
    echo "   Expected format: AIzaSy... (39 characters total)"
    read -p "   Continue anyway? (y/N): " continue_choice
    if [[ ! $continue_choice =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Update the .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/GOOGLE_GEMINI_API_KEY=.*/GOOGLE_GEMINI_API_KEY=${api_key}/" .env
else
    # Linux
    sed -i "s/GOOGLE_GEMINI_API_KEY=.*/GOOGLE_GEMINI_API_KEY=${api_key}/" .env
fi

echo "✅ API key updated in .env file!"
echo ""

# Test the integration
echo "🧪 Testing integration..."
bun run test:gemini

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete! Your Gemini integration is working!"
    echo "🚀 You can now start your server with: bun run dev"
else
    echo ""
    echo "❌ Test failed. Please check your API key and try again."
    echo "💡 Make sure your API key is valid and has proper permissions."
fi
