#!/bin/bash

# Path to the .env file
ENV_FILE="/home/code/resume-plan-ai/platform/backend/.env"

# Check if the .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo ".env file not found at $ENV_FILE"
    exit 1
fi

# Create a backup of the current .env file
cp "$ENV_FILE" "${ENV_FILE}.bak"

# Remove OpenRouter settings
sed -i '/^OPENROUTER_/d' "$ENV_FILE"

# Add Ollama configuration if it doesn't exist
if ! grep -q "^OLLAMA_" "$ENV_FILE"; then
    echo -e "\n# Ollama Configuration" >> "$ENV_FILE"
    echo "OLLAMA_API_URL=http://localhost:11434" >> "$ENV_FILE"
    echo "OLLAMA_MODEL=llama3" >> "$ENV_FILE"
    echo "OLLAMA_TEMPERATURE=0.7" >> "$ENV_FILE"
    echo "Ollama configuration has been added to your .env file"
else
    echo "Ollama configuration already exists in your .env file"
fi

echo "Your .env file has been updated. A backup was created at ${ENV_FILE}.bak"
