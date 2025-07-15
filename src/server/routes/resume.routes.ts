const { Elysia, t } = require('elysia');
import { JobListing } from '../schemas/analysis';
import { authService } from '../services/auth.service';
import { generateResume } from '../services/resumeBuilder';
import { subscriptionService } from '../services/subscription.service';
import { logger } from '../utils/logger';

// Define request schemas
const generateResumeSchema = t.Object({
  userProfile: t.Object({
    name: t.String(),
    email: t.String(),
    phone: t.Optional(t.String()),
    location: t.Optional(t.String()),
    headline: t.Optional(t.String()),
    summary: t.Optional(t.String()),
    skills: t.Array(t.String()),
    experience: t.Array(t.Object({
      title: t.String(),
      company: t.String(),
      startDate: t.String(),
      endDate: t.Optional(t.String()),
      current: t.Optional(t.Boolean()),
      description: t.Optional(t.String()),
      skills: t.Optional(t.Array(t.String())),
    })),
    education: t.Array(t.Object({
      degree: t.String(),
      institution: t.String(),
      field: t.Optional(t.String()),
      startDate: t.String(),
      endDate: t.Optional(t.String()),
      gpa: t.Optional(t.Number()),
    })),
    certifications: t.Optional(t.Array(t.Object({
      name: t.String(),
      issuer: t.String(),
      date: t.String(),
      url: t.Optional(t.String()),
    }))),
  }),
  jobListing: t.Object({
    title: t.String(),
    company: t.String(),
    description: t.String(),
    requirements: t.Optional(t.Array(t.String())),
    location: t.Optional(t.String()),
    salary: t.Optional(t.String()),
    skills: t.Optional(t.Array(t.String())),
    experience: t.Optional(t.Number()),
    education: t.Optional(t.String()),
    employmentType: t.Optional(t.String()),
  }),
  options: t.Optional(t.Object({
    format: t.Optional(t.Union([
      t.Literal('markdown'),
      t.Literal('html'),
      t.Literal('text'),
      t.Literal('pdf')
    ])),
    includeSummary: t.Optional(t.Boolean()),
    includeSkills: t.Optional(t.Boolean()),
    includeExperience: t.Optional(t.Boolean()),
    includeEducation: t.Optional(t.Boolean()),
    includeCertifications: t.Optional(t.Boolean()),
    maxLength: t.Optional(t.Number()),
  })),
});

/**
 * Resume routes for Elysia.js
 * Handles resume generation and management
 */
export const resumeRoutes = new Elysia({ prefix: '/resume' })
  // Add request logging
  .onRequest(({ request }) => {
    logger.info(`[${request.method}] ${request.url}`);
  })

  // Health check endpoint
  .get('/health', () => ({
    status: 'ok',
    service: 'resume',
    timestamp: new Date().toISOString(),
  }))

  // Generate resume endpoint
  .post(
    '/generate',
    async ({ body, headers, set }) => {
      try {
        // Check authentication
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

        // Check subscription limits for resume generation
        const usageCheck = await subscriptionService.canUseFeature(user.id, 'resume_generation');
        if (!usageCheck.allowed) {
          set.status = 403;
          return {
            success: false,
            error: 'Resume generation limit exceeded. Please upgrade your plan to generate more resumes.',
            remaining: usageCheck.remaining || 0
          };
        }

        const { userProfile, jobListing, options = {} } = body;

        logger.info('Processing resume generation request', {
          userId: user.id,
          jobTitle: jobListing.title,
          company: jobListing.company,
          format: options.format || 'markdown',
          remaining: usageCheck.remaining
        });

        // Set default options if not provided
        const resumeOptions = {
          format: 'markdown' as const,
          includeSummary: true,
          includeSkills: true,
          includeExperience: true,
          includeEducation: true,
          includeCertifications: true,
          maxLength: 1000,
          ...options
        };

        // Convert the request data to the expected format
        const jobListingFormatted: JobListing = {
          title: jobListing.title,
          company: jobListing.company,
          description: jobListing.description,
          requirements: jobListing.requirements || [],
          skills: jobListing.skills || [],
          location: jobListing.location,
          salary: jobListing.salary,
          url: '', // Not provided in request schema, using empty string
          employmentType: (jobListing.employmentType as any) || undefined,
        };

        // Transform simple skills array to detailed skills objects
        const skillsFormatted = userProfile.skills.map((skill: string) => ({
          name: skill,
          level: undefined,
          yearsOfExperience: undefined,
        }));

        // Transform experience array to match expected format
        const experienceFormatted = userProfile.experience.map((exp: any) => ({
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate || (exp.current ? 'Present' : ''),
          description: exp.description,
          skills: exp.skills,
        }));

        // Transform certifications to match expected format
        const certificationsFormatted = (userProfile.certifications || []).map((cert: any) => ({
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.date,
          expirationDate: cert.expirationDate,
        }));

        // Create combined profile with both basic info and structured data
        const userProfileFormatted = {
          // Basic profile information
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          location: userProfile.location,
          headline: userProfile.headline,
          summary: userProfile.summary,
          // Structured data for analysis
          skills: skillsFormatted,
          experience: experienceFormatted,
          education: userProfile.education,
          certifications: certificationsFormatted,
        };

        // Generate the resume
        const resumeContent = await generateResume(
          userProfileFormatted as any, // Using any since we have a combined profile format
          jobListingFormatted,
          resumeOptions
        );

        // Record the usage after successful generation
        await subscriptionService.recordUsage(user.id, 'resume_generation');

        logger.info('Resume generation completed successfully', {
          userId: user.id,
          jobTitle: jobListing.title,
          format: resumeOptions.format,
          length: resumeContent.length
        });

        return {
          success: true,
          data: {
            content: resumeContent,
            format: resumeOptions.format,
            metadata: {
              jobTitle: jobListing.title,
              company: jobListing.company,
              generatedAt: new Date().toISOString(),
              options: resumeOptions
            }
          }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error generating resume:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      body: generateResumeSchema,
      headers: t.Object({
        authorization: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            content: t.String(),
            format: t.String(),
            metadata: t.Object({
              jobTitle: t.String(),
              company: t.String(),
              generatedAt: t.String(),
              options: t.Object({
                format: t.String(),
                includeSummary: t.Boolean(),
                includeSkills: t.Boolean(),
                includeExperience: t.Boolean(),
                includeEducation: t.Boolean(),
                includeCertifications: t.Boolean(),
                maxLength: t.Number(),
              })
            })
          })
        }),
        500: t.Object({
          success: t.Boolean(),
          error: t.String()
        })
      },
      detail: {
        summary: 'Generate a tailored resume',
        tags: ['Resume'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userProfile: {
                    $ref: '#/components/schemas/UserProfile'
                  },
                  jobListing: {
                    $ref: '#/components/schemas/JobListing'
                  },
                  options: {
                    $ref: '#/components/schemas/ResumeOptions'
                  }
                },
                required: ['userProfile', 'jobListing']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Resume generated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      $ref: '#/components/schemas/GeneratedResume'
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    error: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  )

  // Get available resume formats
  .get('/formats', () => ({
    success: true,
    data: {
      formats: [
        {
          value: 'markdown',
          label: 'Markdown',
          description: 'Plain text format with simple formatting',
          extension: '.md'
        },
        {
          value: 'html',
          label: 'HTML',
          description: 'Web-ready HTML format',
          extension: '.html'
        },
        {
          value: 'text',
          label: 'Plain Text',
          description: 'Simple plain text format',
          extension: '.txt'
        },
        {
          value: 'pdf',
          label: 'PDF',
          description: 'Portable Document Format (coming soon)',
          extension: '.pdf',
          disabled: true
        }
      ]
    }
  }));

export default resumeRoutes;
