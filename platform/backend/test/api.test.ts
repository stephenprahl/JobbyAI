import { test, expect, beforeAll, afterAll, mock, jest } from 'bun:test';
import { Elysia } from 'elysia';
import { app } from '../src/index';
import { logger } from '../src/utils/logger';

// Mock OpenRouter response
const mockOpenRouterResponse = {
  choices: [{
    message: {
      content: JSON.stringify({
        matchScore: 85,
        missingSkills: ['AWS'],
        matchingSkills: ['TypeScript', 'Node.js', 'React'],
        suggestions: ['Consider gaining experience with AWS'],
        analysis: 'Strong match with room for improvement in cloud technologies.'
      })
    }
  }]
};

// Mock the global fetch function
const mockFetch = mock(async () => ({
  ok: true,
  json: async () => mockOpenRouterResponse
}));

global.fetch = mockFetch as any;

// Set up test environment variables
process.env.OPENROUTER_API_KEY = 'test-api-key';
process.env.OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
process.env.OPENROUTER_REFERRER = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

// Create a test instance of the app
let testApp: Elysia;

// Helper function to make test requests
const request = (app: Elysia) => ({
  get: (path: string) => app.handle(new Request(`http://localhost${path}`)),
  post: (path: string, body?: any) => 
    app.handle(new Request(`http://localhost${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }))
});

// Test data
const testJobListing = {
  title: 'Senior Software Engineer',
  company: 'Tech Corp',
  description: 'We are looking for a senior software engineer...',
  requirements: [
    '5+ years of experience with TypeScript',
    'Experience with modern web frameworks',
    'Strong problem-solving skills'
  ],
  skills: ['TypeScript', 'Node.js', 'React', 'AWS']
};

const testUserProfile = {
  experience: [
    {
      title: 'Software Engineer',
      company: 'Previous Company',
      duration: '2018-2023',
      description: 'Worked on various web applications using modern technologies.'
    }
  ],
  education: [
    {
      degree: 'BSc in Computer Science',
      field: 'Computer Science',
      institution: 'University of Technology',
      year: 2018
    }
  ],
  skills: ['TypeScript', 'Node.js', 'React', 'Docker'],
  certifications: ['AWS Certified Developer']
};

test('API Endpoints', async () => {
  beforeAll(() => {
    // Clone the app for testing
    testApp = new Elysia()
      .use(app)
      .onError(({ code, error }) => {
        logger.error(`Test error: ${code} - ${error.message}`);
        return new Response(error.toString(), { status: 500 });
      });
    
    logger.info('Starting test suite');
  });

  afterAll(() => {
    // Clean up
    testApp = null as any;
    logger.info('Test suite completed');
  });

  test('GET /api/health', async () => {
    const response = await request(testApp).get('/api/health');
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('service', 'resume-plan-ai-backend');
  });

  test('GET /api/analyze/health', async () => {
    const response = await request(testApp).get('/api/analyze/health');
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('service', 'analysis');
  });

  test('GET /api/resume/health', async () => {
    const response = await request(testApp).get('/api/resume/health');
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('service', 'resume');
  });

  test('GET /api/resume/formats', async () => {
    const response = await request(testApp).get('/api/resume/formats');
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('formats');
    expect(Array.isArray(data.data.formats)).toBe(true);
    expect(data.data.formats).toContain('markdown');
  });

  test('POST /api/analyze - should analyze job listing', async () => {
    const response = await request(testApp).post('/api/analyze', {
      job: testJobListing,
      userProfile: testUserProfile,
      options: {
        includeExplanation: true,
        includeMissingSkills: true
      }
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('matchScore');
    expect(typeof data.data.matchScore).toBe('number');
    expect(data.data).toHaveProperty('explanation');
    expect(data.data).toHaveProperty('matchingSkills');
    expect(Array.isArray(data.data.matchingSkills)).toBe(true);
  });

  test('POST /api/resume/generate - should generate resume', async () => {
    const response = await request(testApp).post('/api/resume/generate', {
      job: testJobListing,
      userProfile: testUserProfile,
      options: {
        format: 'markdown',
        includeSummary: true,
        includeSkills: true,
        includeExperience: true,
        includeEducation: true,
        includeCertifications: true
      }
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('resume');
    expect(typeof data.data.resume).toBe('string');
    expect(data.data).toHaveProperty('format', 'markdown');
    expect(data.data).toHaveProperty('generatedAt');
  });

  test('404 handler - should return 404 for unknown routes', async () => {
    const response = await request(testApp).get('/api/nonexistent');
    expect(response.status).toBe(404);
    
  
  logger.info('Starting test suite');
    expect(data).toHaveProperty('error');
  });
});
