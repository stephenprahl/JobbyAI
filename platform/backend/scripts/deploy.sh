#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI is not installed. Installing..."
    npm install -g netlify-cli
fi

echo "Deployment preparation complete!"
echo "To deploy to Netlify, run the following commands:"
echo "1. netlify login"
echo "2. netlify deploy --prod"
