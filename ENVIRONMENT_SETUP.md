# Environment Setup Guide

## Overview

This project uses environment variables to configure various services and settings. Follow this guide to set up your development environment properly.

## Setup Instructions

### 1. Create Environment File

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

### 2. Configure Required Variables

Edit your `.env` file and replace the placeholder values with your actual credentials:

#### Google Gemini API (Required)

- Get your API key from: <https://aistudio.google.com/app/apikey>
- Set `GOOGLE_GEMINI_API_KEY` to your actual API key

#### Database Configuration

- For local development, the default PostgreSQL settings should work
- For production, update `DATABASE_URL` with your production database connection string

#### Stripe (Required for payment features)

- Get your API keys from: <https://dashboard.stripe.com/apikeys>
- Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
- For webhooks, set `STRIPE_WEBHOOK_SECRET`

#### JWT (Required for authentication)

- Generate a strong secret for `JWT_SECRET`
- You can use: `openssl rand -hex 32`

## Security Notes

### ⚠️ IMPORTANT: Never commit `.env` files to version control

- `.env` files contain sensitive information like API keys and passwords
- The `.gitignore` file is configured to exclude all `.env*` files (except `.env.example`)
- Always use `.env.example` as a template with placeholder values

### Environment File Types

- `.env` - Your local development environment (never commit)
- `.env.example` - Template with placeholder values (safe to commit)
- `.env.local`, `.env.production`, etc. - Environment-specific files (never commit)

## Verification

After setting up your environment variables, you can verify they're working by:

1. Starting the development server: `bun run dev`
2. Checking the logs for any missing configuration warnings
3. Testing API features that depend on external services

## Troubleshooting

- If you see "API key not provided" errors, check your environment variable names
- Make sure your `.env` file is in the root directory of the project
- Restart your development server after changing environment variables
