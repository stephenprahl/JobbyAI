const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import prisma from '../services/prisma.service';
import { logger } from '../utils/logger';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
  };
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE';
  postedDate: string;
  matchScore: number;
  matchReasons: string[];
  skillsMatched: string[];
  skillsNeeded: string[];
  description: string;
  requirements: string[];
  benefits?: string[];
  url?: string;
  source: string;
  trending: boolean;
  urgent: boolean;
  recommended: boolean;
}

export const jobRecommendationsRoutes = new Elysia({ prefix: '/jobs' })
  .onRequest(({ request }) => {
    logger.info(`[JobRecommendations] ${request.method} ${request.url}`);
  })

  // Get personalized job recommendations
  .post(
    '/recommendations',
    async ({ body, headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        // Get user profile and skills
        const userProfile = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            profile: true,
            skills: {
              include: {
                skill: true
              }
            },
            experiences: true
          }
        });

        if (!userProfile) {
          set.status = 404;
          return {
            success: false,
            error: 'User profile not found'
          };
        }

        // Extract user skills
        const userSkills = userProfile.skills.map(us => us.skill.name);

        // Get existing job listings to avoid duplicates
        const existingJobs = await prisma.jobListing.findMany({
          where: { userId: user.id },
          select: { title: true, companyName: true }
        });

        // Generate AI-powered recommendations (mock implementation)
        const recommendations: JobRecommendation[] = await generateJobRecommendations(
          userProfile,
          userSkills,
          body.filters || {},
          existingJobs
        );

        return {
          success: true,
          data: recommendations
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching job recommendations:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        filters: t.Optional(t.Object({
          minSalary: t.Optional(t.Number()),
          jobTypes: t.Optional(t.Array(t.String())),
          locations: t.Optional(t.Array(t.String())),
          industries: t.Optional(t.Array(t.String())),
          remote: t.Optional(t.Boolean()),
          minMatchScore: t.Optional(t.Number())
        }))
      })
    }
  )

  // Save a job from recommendations
  .post(
    '/save',
    async ({ body, headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        // In a real implementation, you would fetch the job details from the recommendation system
        // For now, we'll create a mock job listing
        const jobListing = await prisma.jobListing.create({
          data: {
            userId: user.id,
            title: 'Recommended Job', // Would be populated from recommendation data
            companyName: 'Great Company',
            location: 'Remote',
            description: 'A great opportunity',
            requirements: ['Skill 1', 'Skill 2'],
            applied: false,
            notes: 'Saved from recommendations'
          }
        });

        return {
          success: true,
          data: { jobId: jobListing.id, message: 'Job saved successfully' }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error saving job:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        jobId: t.String()
      })
    }
  )

  // Get trending jobs
  .get(
    '/trending',
    async ({ headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        // Generate trending jobs (mock implementation)
        const trendingJobs = await generateTrendingJobs();

        return {
          success: true,
          data: trendingJobs
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching trending jobs:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      })
    }
  );

// Helper function to generate job recommendations
async function generateJobRecommendations(
  userProfile: any,
  userSkills: string[],
  filters: any,
  existingJobs: any[]
): Promise<JobRecommendation[]> {
  // This is a mock implementation. In a real system, you would:
  // 1. Use AI/ML models to analyze user profile
  // 2. Query external job APIs (LinkedIn, Indeed, etc.)
  // 3. Calculate match scores based on skills, experience, and preferences
  // 4. Rank and filter results

  const mockJobs: JobRecommendation[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: { min: 120000, max: 160000 },
      type: 'FULL_TIME',
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: 92,
      matchReasons: [
        'Skills match 90% of requirements',
        'Salary aligns with your preferences',
        'Company culture fits your profile'
      ],
      skillsMatched: userSkills.slice(0, 4),
      skillsNeeded: ['TypeScript', 'GraphQL'],
      description: 'We are looking for a talented Frontend Developer to join our team...',
      requirements: [
        '5+ years of React experience',
        'Strong JavaScript/TypeScript skills',
        'Experience with modern frontend tools'
      ],
      benefits: ['Health insurance', 'Remote work', '401k'],
      url: 'https://example.com/job/1',
      source: 'LinkedIn',
      trending: true,
      urgent: false,
      recommended: true
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: { min: 100000, max: 140000 },
      type: 'REMOTE',
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: 87,
      matchReasons: [
        'Remote-first company',
        'Skills overlap with requirements',
        'Growth opportunity'
      ],
      skillsMatched: userSkills.slice(0, 3),
      skillsNeeded: ['AWS', 'Docker'],
      description: 'Join our dynamic startup as a Full Stack Engineer...',
      requirements: [
        'Experience with React and Node.js',
        'Cloud deployment experience',
        'Startup mindset'
      ],
      benefits: ['Equity', 'Flexible hours', 'Learning budget'],
      url: 'https://example.com/job/2',
      source: 'AngelList',
      trending: false,
      urgent: true,
      recommended: true
    },
    {
      id: '3',
      title: 'React Developer',
      company: 'MegaCorp Ltd.',
      location: 'New York, NY',
      salary: { min: 90000, max: 130000 },
      type: 'FULL_TIME',
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: 78,
      matchReasons: [
        'Strong React background required',
        'Large company stability',
        'Good benefits package'
      ],
      skillsMatched: userSkills.slice(0, 2),
      skillsNeeded: ['Redux', 'Jest'],
      description: 'We need a React Developer to work on our flagship product...',
      requirements: [
        '3+ years of React experience',
        'Testing experience',
        'Team collaboration skills'
      ],
      benefits: ['Health insurance', 'Dental', 'Vision', 'PTO'],
      url: 'https://example.com/job/3',
      source: 'Indeed',
      trending: false,
      urgent: false,
      recommended: false
    }
  ];

  // Apply filters
  let filteredJobs = mockJobs;

  if (filters.minSalary) {
    filteredJobs = filteredJobs.filter(job =>
      job.salary && job.salary.min >= filters.minSalary
    );
  }

  if (filters.remote) {
    filteredJobs = filteredJobs.filter(job =>
      job.type === 'REMOTE' || job.location.toLowerCase().includes('remote')
    );
  }

  if (filters.minMatchScore) {
    filteredJobs = filteredJobs.filter(job =>
      job.matchScore >= filters.minMatchScore
    );
  }

  if (filters.jobTypes && filters.jobTypes.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.jobTypes.includes(job.type)
    );
  }

  // Sort by match score
  filteredJobs.sort((a, b) => b.matchScore - a.matchScore);

  return filteredJobs;
}

// Helper function to generate trending jobs
async function generateTrendingJobs(): Promise<JobRecommendation[]> {
  // Mock trending jobs implementation
  return [
    {
      id: 'trending-1',
      title: 'AI Engineer',
      company: 'AI Innovations',
      location: 'San Francisco, CA',
      salary: { min: 150000, max: 200000 },
      type: 'FULL_TIME',
      postedDate: new Date().toISOString(),
      matchScore: 85,
      matchReasons: ['Hot skill demand', 'High salary range', 'Growing field'],
      skillsMatched: ['Python', 'Machine Learning'],
      skillsNeeded: ['TensorFlow', 'PyTorch'],
      description: 'Join the AI revolution as an AI Engineer...',
      requirements: ['ML experience', 'Python proficiency', 'PhD preferred'],
      benefits: ['Stock options', 'Top-tier insurance', 'Research time'],
      url: 'https://example.com/trending/1',
      source: 'Company Website',
      trending: true,
      urgent: false,
      recommended: true
    }
  ];
}
