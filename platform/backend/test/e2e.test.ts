import { test, expect, beforeAll, afterAll, mock } from 'bun:test';
import { Elysia } from 'elysia';
import { app } from '../src/index';
import { JobListing, UserProfile } from '../src/schemas/analysis';

// Set up test environment variables
process.env.OPENROUTER_API_KEY = 'test-api-key';
process.env.OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
process.env.OPENROUTER_REFERRER = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

// Mock OpenRouter response for analysis
const mockAnalysisResponse = {
  choices: [{
    message: {
      content: JSON.stringify({
        matchScore: 85,
        matchingSkills: ['TypeScript', 'Node.js', 'React', 'AWS', 'MongoDB', 'Docker'],
        missingSkills: ['GCP', 'Azure', 'NoSQL'],
        suggestions: [
          'Gain experience with GCP or Azure cloud platforms',
          'Learn more about NoSQL databases'
        ],
        analysis: 'Strong match with the job requirements. The candidate has most of the required skills and experience.'
      })
    }
  }]
};

// Mock OpenRouter response for resume generation
const mockResumeResponse = {
  choices: [{
    message: {
      content: '# John Doe\n\n## Senior Software Engineer\n\n### Summary\nExperienced software engineer with 5+ years of experience...' // Truncated for brevity
    }
  }]
};

// Mock the global fetch function
const mockFetch = mock(async (url: string, options: any) => {
  const body = JSON.parse(options.body);
  const isResumeRequest = body.messages.some((msg: any) => 
    msg.content.includes('Generate a tailored resume')
  );
  
  return {
    ok: true,
    json: async () => isResumeRequest ? mockResumeResponse : mockAnalysisResponse
  };
});

global.fetch = mockFetch as any;

// Helper function to make test requests
const request = (app: Elysia) => ({
  get: async (path: string) => {
    const response = await app.handle(new Request(`http://localhost${path}`));
    return {
      status: response.status,
      json: async () => await response.json()
    };
  },
  post: async (path: string, body?: unknown) => {
    const response = await app.handle(new Request(`http://localhost${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }));
    return {
      status: response.status,
      json: async () => await response.json()
    };
  }
});

test('End-to-End Workflow Test', async () => {
  const sampleJobListing: JobListing = {
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    description: 'We are looking for a Senior Software Engineer with experience in TypeScript, Node.js, and cloud technologies. The ideal candidate will have 5+ years of experience in building scalable web applications.',
    requirements: [
      '5+ years of experience with TypeScript/JavaScript',
      'Experience with Node.js and Express',
      'Knowledge of cloud platforms (AWS, GCP, or Azure)',
      'Experience with database systems (SQL and NoSQL)',
      'Strong problem-solving skills'
    ],
    location: 'Remote',
    url: 'https://example.com/jobs/senior-software-engineer',
    source: 'LINKEDIN',
    postedDate: '2023-06-01',
    employmentType: 'FULL_TIME'
  };

  const sampleUserProfile: UserProfile = {
    skills: [
      { name: 'TypeScript', level: 'ADVANCED', yearsOfExperience: 4 },
      { name: 'Node.js', level: 'ADVANCED', yearsOfExperience: 5 },
      { name: 'React', level: 'INTERMEDIATE', yearsOfExperience: 3 },
      { name: 'AWS', level: 'INTERMEDIATE', yearsOfExperience: 2 },
      { name: 'MongoDB', level: 'INTERMEDIATE', yearsOfExperience: 3 },
      { name: 'Docker', level: 'BEGINNER', yearsOfExperience: 1 }
    ],
    experience: [
      {
        title: 'Software Engineer',
        company: 'Web Solutions LLC',
        startDate: '2019-01-01',
        endDate: '2023-05-31',
        description: 'Developed and maintained web applications using TypeScript, Node.js, and React. Led a team of 3 developers.',
        skills: ['TypeScript', 'Node.js', 'React', 'MongoDB']
      },
      {
        title: 'Junior Developer',
        company: 'Digital Creations',
        startDate: '2017-06-01',
        endDate: '2018-12-31',
        description: 'Assisted in developing and maintaining web applications. Worked with JavaScript, Node.js, and SQL databases.',
        skills: ['JavaScript', 'Node.js', 'SQL']
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Tech University',
        fieldOfStudy: 'Computer Science',
        startDate: '2013-09-01',
        endDate: '2017-05-31'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2022-03-15',
        expirationDate: '2025-03-15'
      }
    ]
  };

  // Test the analyze endpoint
  test('should analyze job listing and return match score', async () => {
    const response = await request(app).post('/api/analyze', {
      job: sampleJobListing,
      userProfile: sampleUserProfile,
      options: {
        includeMissingSkills: true,
        includeSuggestions: true,
        detailedAnalysis: true
      }
    });

    const responseData = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseData).toHaveProperty('success', true);
    expect(responseData.data).toHaveProperty('matchScore');
    expect(responseData.data).toHaveProperty('matchingSkills');
    expect(responseData.data).toHaveProperty('missingSkills');
    expect(responseData.data).toHaveProperty('suggestions');
    expect(responseData.data).toHaveProperty('analysis');
  });

  // Test the resume generation endpoint
  test('should generate a tailored resume', async () => {
    const response = await request(app).post('/api/resume/generate', {
      job: sampleJobListing,
      userProfile: sampleUserProfile,
      options: {
        format: 'markdown',
        includeSummary: true,
        includeSkills: true,
        includeExperience: true,
        includeEducation: true,
        includeCertifications: true,
        maxLength: 1500
      }
    });

    const responseData = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseData).toHaveProperty('success', true);
    expect(responseData.data).toHaveProperty('resume');
    expect(responseData.data).toHaveProperty('format', 'markdown');
    expect(responseData.data).toHaveProperty('length');
    expect(responseData.data.length).toBeLessThanOrEqual(1500);
  });

  test('GET /api/resume/formats - should return available resume formats', async () => {
    const response = await request(app).get('/api/resume/formats');
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toHaveProperty('success', true);
    expect(responseData.data).toHaveProperty('formats');
    expect(Array.isArray(responseData.data.formats)).toBe(true);
    expect(responseData.data.formats).toContain('markdown');
  });
});
