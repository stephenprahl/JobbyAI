import { Elysia, t } from 'elysia';
import { analyzeJobListing } from '../services/analysis';
import { JobAnalysisRequest } from '../schemas/analysis';
import { logger } from '../utils/logger';

// Define the request body schema
const analysisRequestSchema = t.Object({
  job: t.Object({
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
  userProfile: t.Optional(t.Object({
    skills: t.Array(t.String()),
    experience: t.Array(t.Object({
      title: t.String(),
      company: t.String(),
      startDate: t.String(),
      endDate: t.Optional(t.String()),
      description: t.Optional(t.String()),
      skills: t.Optional(t.Array(t.String())),
    })),
    education: t.Array(t.Object({
      degree: t.String(),
      institution: t.String(),
      field: t.Optional(t.String()),
      startDate: t.String(),
      endDate: t.Optional(t.String()),
    })),
  })),
  options: t.Optional(t.Object({
    includeMissingSkills: t.Optional(t.Boolean()),
    includeSuggestions: t.Optional(t.Boolean()),
    detailedAnalysis: t.Optional(t.Boolean()),
  })),
});

/**
 * Analysis routes for Elysia.js with Prisma integration
 * Handles job listing analysis and matching
 */
export const analysisPrismaRoutes = (app: Elysia) => 
  app.group('/analyze', (app) => 
    app
      // Add request logging
      .onRequest(({ request }) => {
        logger.info(`[${request.method}] ${request.url}`);
      })
      
      // Health check endpoint
      .get('/health', () => ({
        status: 'ok',
        service: 'analysis',
        timestamp: new Date().toISOString(),
        database: 'connected',
      }))
      
      // Analyze job listing endpoint
      .post(
        '/',
        async ({ body, set }) => {
          try {
            const { job, userProfile, options = {} } = body as JobAnalysisRequest;
            
            logger.info('Processing job analysis request', {
              jobTitle: job.title,
              company: job.company,
              hasUserProfile: !!userProfile,
              options
            });

            // Set default options if not provided
            const analysisOptions = {
              includeMissingSkills: true,
              includeSuggestions: true,
              detailedAnalysis: false,
              ...options
            };

            // Process the analysis
            const result = await analyzeJobListing({
              job,
              userProfile,
              options: analysisOptions
            });

            logger.info('Job analysis completed successfully', {
              jobTitle: job.title,
              matchScore: result.matchScore
            });

            return {
              success: true,
              data: result
            };
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error analyzing job listing:', errorMessage);
            set.status = 500;
            return {
              success: false,
              error: errorMessage
            };
          }
        },
        {
          // @ts-ignore - Elysia type definitions are not perfectly aligned with our schema
          body: analysisRequestSchema,
          response: {
            200: t.Object({
              success: t.Boolean(),
              data: t.Object({
                matchScore: t.Number(),
                matchingSkills: t.Array(t.String()),
                missingSkills: t.Array(t.String()),
                suggestions: t.Array(t.String()),
                analysis: t.Optional(t.String())
              })
            }),
            500: t.Object({
              success: t.Boolean(),
              error: t.String()
            })
          },
          detail: {
            summary: 'Analyze a job listing',
            tags: ['Analysis'],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      job: {
                        $ref: '#/components/schemas/Job'
                      },
                      userProfile: {
                        $ref: '#/components/schemas/UserProfile'
                      },
                      options: {
                        $ref: '#/components/schemas/AnalysisOptions'
                      }
                    },
                    required: ['job']
                  }
                }
              }
            },
            responses: {
              200: {
                description: 'Analysis completed successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        data: {
                          $ref: '#/components/schemas/AnalysisResult'
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
  );

export default analysisPrismaRoutes;
