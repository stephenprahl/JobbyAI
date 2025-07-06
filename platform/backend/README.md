# Resume Plan AI - Backend

This is the backend service for the Resume Plan AI platform, providing APIs for job listing analysis and resume generation.

## Features

- Job listing analysis and matching
- AI-powered resume generation
- RESTful API endpoints
- Rate limiting and security headers
- Comprehensive logging

## Prerequisites

- Node.js 18+
- npm or yarn
- Netlify account (for deployment)
- [Ollama](https://ollama.ai/) installed and running locally (default: `http://localhost:11434`)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ```shell
   # Server
   PORT=3000
   NODE_ENV=development

   # Logging
   LOG_LEVEL=info

   # CORS
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

   # Ollama
   OLLAMA_API_URL=http://localhost:11434
   OLLAMA_MODEL=llama3  # or any other model you have downloaded
   OLLAMA_TEMPERATURE=0.7
   ```
4. Update the `.env` file with your configuration (see [Environment Variables](#environment-variables) section)

## Development

To start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing

To run tests:

```bash
npm test
```

## Deployment

### Prerequisites

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in to Netlify:
   ```bash
   netlify login
   ```

### Deploying

1. Run the deployment script:
   ```bash
   ./scripts/deploy.sh
   ```

2. Deploy to production:
   ```bash
   netlify deploy --prod
   ```

## Environment Variables

- `PORT` - Port to run the server on (default: 3000)
- `NODE_ENV` - Environment (development, production)
- `LOG_LEVEL` - Logging level (error, warn, info, debug)
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window in milliseconds
- `RATE_LIMIT_MAX` - Maximum requests per window
- `ALLOWED_ORIGINS` - Allowed CORS origins (comma-separated)
- `OLLAMA_API_URL` - URL of your Ollama server (default: `http://localhost:11434`)
- `OLLAMA_MODEL` - The Ollama model to use (default: `llama3`)
- `OLLAMA_TEMPERATURE` - Controls randomness in the AI's responses (0.0 to 1.0)

## API Documentation

### Job Analysis

- `POST /api/analyze` - Analyze a job listing and match it with a user profile

### Resume Generation

- `POST /api/resume/generate` - Generate a tailored resume
- `GET /api/resume/formats` - Get available resume formats

## License

MIT
