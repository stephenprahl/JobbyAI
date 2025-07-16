const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import {
  getSimilarJobs,
  getTrendingJobs,
  searchJobs,
  type ExternalJobListing,
  type JobSearchFilters
} from '../services/jobSearch.service';
import prisma from '../services/prisma.service';
import { logger } from '../utils/logger';

export const jobSearchRoutes = new Elysia({ prefix: '/jobs' })
  .use(authService)
  .onRequest(({ request }) => {
    logger.info(`[JobSearch] ${request.method} ${request.url}`);
  })

  // Search for jobs from external APIs
  .post(
    '/search',
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

        const filters: JobSearchFilters = {
          query: body.query,
          location: body.location,
          jobType: body.jobType,
          remote: body.remote,
          salaryMin: body.salaryMin,
          salaryMax: body.salaryMax,
          experience: body.experience,
          industry: body.industry,
          postedDays: body.postedDays,
          limit: body.limit || 20,
          offset: body.offset || 0
        };

        logger.info('Searching jobs for user:', { userId: user.id, filters });

        const results = await searchJobs(filters);

        // Track search analytics
        try {
          // Get or create user subscription
          let subscription = await prisma.subscription.findUnique({
            where: { userId: user.id }
          });

          if (!subscription) {
            subscription = await prisma.subscription.create({
              data: {
                userId: user.id,
                plan: 'FREE',
                status: 'TRIAL'
              }
            });
          }

          await prisma.usageRecord.upsert({
            where: {
              userId_subscriptionId_feature: {
                userId: user.id,
                subscriptionId: subscription.id,
                feature: 'job_search'
              }
            },
            update: {
              usage: {
                increment: 1
              },
              updatedAt: new Date()
            },
            create: {
              userId: user.id,
              subscriptionId: subscription.id,
              feature: 'job_search',
              usage: 1,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Reset in 30 days
            }
          });
        } catch (error) {
          logger.warn('Failed to track job search usage:', error);
        }

        return {
          success: true,
          data: {
            jobs: results.jobs,
            totalCount: results.totalCount,
            hasMore: results.hasMore,
            nextOffset: results.nextOffset,
            searchId: `search-${Date.now()}-${user.id}`
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error searching jobs:', errorMessage);
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
        query: t.Optional(t.String()),
        location: t.Optional(t.String()),
        jobType: t.Optional(t.Union([
          t.Literal('full-time'),
          t.Literal('part-time'),
          t.Literal('contract'),
          t.Literal('temporary'),
          t.Literal('internship')
        ])),
        remote: t.Optional(t.Boolean()),
        salaryMin: t.Optional(t.Number()),
        salaryMax: t.Optional(t.Number()),
        experience: t.Optional(t.Union([
          t.Literal('entry'),
          t.Literal('mid'),
          t.Literal('senior')
        ])),
        industry: t.Optional(t.String()),
        postedDays: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number())
      })
    }
  )

  // Get trending jobs
  .get(
    '/trending',
    async ({ headers, query, set }) => {
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

        const limit = parseInt(query.limit as string) || 10;
        const trendingJobs = await getTrendingJobs(limit);

        logger.info('Fetched trending jobs:', { userId: user.id, count: trendingJobs.length });

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
      }),
      query: t.Object({
        limit: t.Optional(t.String())
      })
    }
  )

  // Save external job to user's job listings
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

        const jobData = body.job;

        // Check if job already exists for this user
        const existingJob = await prisma.jobListing.findFirst({
          where: {
            userId: user.id,
            title: jobData.title,
            companyName: jobData.company
          }
        });

        if (existingJob) {
          return {
            success: false,
            error: 'Job already saved'
          };
        }

        // Save job to database
        const savedJob = await prisma.jobListing.create({
          data: {
            userId: user.id,
            title: jobData.title,
            companyName: jobData.company,
            location: jobData.location,
            description: jobData.description,
            requirements: jobData.requirements || [],
            employmentType: mapJobTypeToEnum(jobData.jobType),
            source: jobData.source.toUpperCase(),
            url: jobData.url,
            applied: false,
            notes: `Saved from ${jobData.source}. External ID: ${jobData.id}${jobData.salary ? `. Salary: ${JSON.stringify(jobData.salary)}` : ''}${jobData.skills?.length ? `. Skills: ${jobData.skills.join(', ')}` : ''}${jobData.remote ? '. Remote position' : ''}`
          }
        });

        logger.info('Job saved successfully:', {
          userId: user.id,
          jobId: savedJob.id,
          title: jobData.title,
          company: jobData.company
        });

        return {
          success: true,
          data: {
            jobId: savedJob.id,
            message: 'Job saved successfully'
          }
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
        job: t.Object({
          id: t.String(),
          title: t.String(),
          company: t.String(),
          location: t.String(),
          description: t.String(),
          requirements: t.Optional(t.Array(t.String())),
          skills: t.Optional(t.Array(t.String())),
          salary: t.Optional(t.Object({
            min: t.Optional(t.Number()),
            max: t.Optional(t.Number()),
            currency: t.Optional(t.String())
          })),
          jobType: t.String(),
          remote: t.Boolean(),
          postedDate: t.String(),
          url: t.String(),
          source: t.String(),
          applyUrl: t.Optional(t.String())
        })
      })
    }
  )

  // Apply to external job
  .post(
    '/apply',
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

        const { jobId, applicationData } = body;

        // Find the job in our database
        let jobListing = await prisma.jobListing.findFirst({
          where: {
            id: jobId,
            userId: user.id
          }
        });

        // If job doesn't exist, save it first
        if (!jobListing && applicationData.job) {
          jobListing = await prisma.jobListing.create({
            data: {
              userId: user.id,
              title: applicationData.job.title,
              companyName: applicationData.job.company,
              location: applicationData.job.location,
              description: applicationData.job.description,
              requirements: applicationData.job.requirements || [],
              employmentType: mapJobTypeToEnum(applicationData.job.jobType),
              source: applicationData.job.source?.toUpperCase() || 'EXTERNAL',
              url: applicationData.job.url,
              applied: true,
              applicationDate: new Date(),
              notes: `${applicationData.notes || 'Applied through JobbyAI'}. External ID: ${applicationData.job.id}`
            }
          });
        } else if (jobListing) {
          // Update existing job as applied
          jobListing = await prisma.jobListing.update({
            where: { id: jobListing.id },
            data: {
              applied: true,
              applicationDate: new Date(),
              notes: applicationData.notes || jobListing.notes,
              status: 'APPLIED'
            }
          });
        }

        // Track application analytics
        try {
          // Get or create user subscription
          let subscription = await prisma.subscription.findUnique({
            where: { userId: user.id }
          });

          if (!subscription) {
            subscription = await prisma.subscription.create({
              data: {
                userId: user.id,
                plan: 'FREE',
                status: 'TRIAL'
              }
            });
          }

          await prisma.usageRecord.upsert({
            where: {
              userId_subscriptionId_feature: {
                userId: user.id,
                subscriptionId: subscription.id,
                feature: 'job_application'
              }
            },
            update: {
              usage: {
                increment: 1
              },
              updatedAt: new Date()
            },
            create: {
              userId: user.id,
              subscriptionId: subscription.id,
              feature: 'job_application',
              usage: 1,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          });
        } catch (error) {
          logger.warn('Failed to track job application usage:', error);
        }

        logger.info('Job application recorded:', {
          userId: user.id,
          jobId: jobListing?.id,
          title: jobListing?.title
        });

        return {
          success: true,
          data: {
            applicationId: jobListing?.id,
            message: 'Application recorded successfully',
            redirectUrl: applicationData.job?.applyUrl || applicationData.job?.url
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error recording job application:', errorMessage);
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
        jobId: t.Optional(t.String()),
        applicationData: t.Object({
          notes: t.Optional(t.String()),
          job: t.Optional(t.Object({
            id: t.String(),
            title: t.String(),
            company: t.String(),
            location: t.String(),
            description: t.String(),
            requirements: t.Optional(t.Array(t.String())),
            jobType: t.String(),
            url: t.String(),
            source: t.Optional(t.String()),
            applyUrl: t.Optional(t.String())
          }))
        })
      })
    }
  )

  // Get similar jobs to a specific job
  .get(
    '/similar/:jobId',
    async ({ params, headers, set }) => {
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

        const { jobId } = params;

        // Get the job from our database
        const job = await prisma.jobListing.findFirst({
          where: {
            id: jobId,
            userId: user.id
          }
        });

        if (!job) {
          set.status = 404;
          return {
            success: false,
            error: 'Job not found'
          };
        }

        // Create a mock external job for similarity search
        const externalJob: ExternalJobListing = {
          id: job.id,
          title: job.title,
          company: job.companyName,
          location: job.location || '',
          description: job.description || '',
          requirements: job.requirements,
          skills: [], // Extract from description if needed
          jobType: job.employmentType?.toLowerCase() || 'full_time',
          remote: job.description?.toLowerCase().includes('remote') || false,
          postedDate: job.createdAt.toISOString(),
          url: job.url || '',
          source: (job.source?.toLowerCase() || 'external') as any
        };

        const similarJobs = await getSimilarJobs(externalJob, 5);

        return {
          success: true,
          data: similarJobs
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching similar jobs:', errorMessage);
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
      params: t.Object({
        jobId: t.String()
      })
    }
  )

  // Get user's job application statistics
  .get(
    '/stats',
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

        const [
          totalSaved,
          totalApplied,
          recentApplications,
          topSources,
          topCompanies
        ] = await Promise.all([
          prisma.jobListing.count({
            where: { userId: user.id }
          }),
          prisma.jobListing.count({
            where: { userId: user.id, applied: true }
          }),
          prisma.jobListing.count({
            where: {
              userId: user.id,
              applied: true,
              applicationDate: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            }
          }),
          prisma.jobListing.groupBy({
            by: ['source'],
            where: { userId: user.id },
            _count: { source: true },
            orderBy: { _count: { source: 'desc' } },
            take: 5
          }),
          prisma.jobListing.groupBy({
            by: ['companyName'],
            where: { userId: user.id },
            _count: { companyName: true },
            orderBy: { _count: { companyName: 'desc' } },
            take: 5
          })
        ]);

        return {
          success: true,
          data: {
            totalSaved,
            totalApplied,
            recentApplications,
            applicationRate: totalSaved > 0 ? Math.round((totalApplied / totalSaved) * 100) : 0,
            topSources: topSources.map(s => ({
              source: s.source,
              count: s._count.source
            })),
            topCompanies: topCompanies.map(c => ({
              company: c.companyName,
              count: c._count.companyName
            }))
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching job stats:', errorMessage);
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

// Helper function to map job types to enum
function mapJobTypeToEnum(jobType: string): 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP' {
  const mapping: Record<string, 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP'> = {
    'full-time': 'FULL_TIME',
    'full_time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'part_time': 'PART_TIME',
    'contract': 'CONTRACT',
    'temporary': 'TEMPORARY',
    'internship': 'INTERNSHIP'
  };

  return mapping[jobType.toLowerCase()] || 'FULL_TIME';
}
