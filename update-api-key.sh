#!/bin/bash

echo "🔑 Google Gemini API Key Updater"
echo "================================="
echo ""
echo "Current API key in .env: $(grep GOOGLE_GEMINI_API_KEY .env | cut -d'=' -f2)"
echo ""

read -p "📋 Paste your NEW API key here: " new_api_key

# Validate key format
if [[ $new_api_key =~ ^AIzaSy.* ]]; then
    echo "✅ Key format looks correct (starts with AIzaSy)"

    # Update the .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/GOOGLE_GEMINI_API_KEY=.*/GOOGLE_GEMINI_API_KEY=${new_api_key}/" .env
    else
        # Linux
        sed -i "s/GOOGLE_GEMINI_API_KEY=.*/GOOGLE_GEMINI_API_KEY=${new_api_key}/" .env
    fi

    echo "✅ Updated .env file!"
    echo ""
    echo "🧪 Testing new API key..."
    bun run cloud-api-diagnostic.js

else
    echo "⚠️  Key doesn't start with 'AIzaSy' - are you sure this is correct?"
    echo "   Google API keys typically start with 'AIzaSy'"
    echo ""
    read -p "Continue anyway? (y/N): " continue_choice
    if [[ $continue_choice =~ ^[Yy]$ ]]; then
        # Update anyway
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/GOOGLE_GEMINI_API_KEY=.*/GOOGLE_GEMINI_API_KEY=${new_api_key}/" .env
        else
            sed -i "s/GOOGLE_GEMINI_API_KEY=.*/GOOGLE_GEMINI_API_KEY=${new_api_key}/" .env
        fi
        echo "✅ Updated .env file!"
        bun run cloud-api-diagnostic.js
    else
        echo "❌ Setup cancelled"
    fi
fi
