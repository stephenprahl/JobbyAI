const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import prisma from '../services/prisma.service';
import { logger } from '../utils/logger';

interface ApplicationTrend {
  date: string;
  applications: number;
  responses: number;
}

interface DailyUsage {
  date: string;
  count: number;
}

export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .onRequest(({ request }) => {
    logger.info(`[Analytics] ${request.method} ${request.url}`);
  })

  // Get dashboard analytics
  .get(
    '/dashboard',
    async ({ query, headers, set }) => {
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
        const timeRange = parseInt(query.timeRange as string) || 30;

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);

        // Get job applications
        const applications = await prisma.jobListing.findMany({
          where: {
            userId: user.id,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        // Calculate metrics
        const totalApplications = applications.length;
        const appliedJobs = applications.filter(job => job.applied);
        const responseRate = appliedJobs.length > 0 ?
          Math.round((appliedJobs.filter(job => job.status && job.status !== 'applied').length / appliedJobs.length) * 100) : 0;

        // Generate application trends
        const applicationTrends: ApplicationTrend[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayApplications = applications.filter(app =>
            new Date(app.createdAt).toDateString() === date.toDateString()
          ).length;

          applicationTrends.push({
            date: date.toISOString(),
            applications: dayApplications,
            responses: Math.floor(dayApplications * 0.2) // Mock response rate
          });
        }

        // Industry breakdown (mock data)
        const industryBreakdown = [
          { industry: 'Technology', count: Math.floor(totalApplications * 0.4), percentage: 40 },
          { industry: 'Finance', count: Math.floor(totalApplications * 0.25), percentage: 25 },
          { industry: 'Healthcare', count: Math.floor(totalApplications * 0.2), percentage: 20 },
          { industry: 'Other', count: Math.floor(totalApplications * 0.15), percentage: 15 }
        ];

        // Skill gap analysis (mock data)
        const skillGapAnalysis = [
          { skill: 'React', demandScore: 5, userLevel: 4, gap: 1 },
          { skill: 'Node.js', demandScore: 4, userLevel: 3, gap: 1 },
          { skill: 'Python', demandScore: 5, userLevel: 2, gap: 3 },
          { skill: 'AWS', demandScore: 4, userLevel: 2, gap: 2 },
          { skill: 'Docker', demandScore: 3, userLevel: 1, gap: 2 }
        ];

        const analyticsData = {
          totalApplications,
          responseRate,
          averageMatchScore: 78, // Mock data
          topSkills: ['JavaScript', 'React', 'Node.js'],
          applicationTrends,
          industryBreakdown,
          salaryInsights: {
            averageOffered: 85000,
            rangeMin: 70000,
            rangeMax: 120000,
            targetRange: '$80k - $100k'
          },
          monthlyGoals: {
            applicationsTarget: 20,
            currentProgress: totalApplications,
            daysLeft: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()
          },
          skillGapAnalysis
        };

        return {
          success: true,
          data: analyticsData
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching dashboard analytics:', errorMessage);
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
        timeRange: t.Optional(t.String())
      })
    }
  )

  // Get usage analytics for specific feature
  .get(
    '/usage/:feature',
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
        const { feature } = params;

        // Get usage records for the past 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const usageRecords = await prisma.usageRecord.findMany({
          where: {
            userId: user.id,
            feature,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        // Calculate daily usage for the last 7 days
        const daily: DailyUsage[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayUsage = usageRecords.filter(record =>
            new Date(record.createdAt).toDateString() === date.toDateString()
          ).length;

          daily.push({
            date: date.toISOString(),
            count: dayUsage
          });
        }

        // Calculate weekly trend
        const weeklyTrend = Array(7).fill(0);
        usageRecords.forEach(record => {
          const dayOfWeek = new Date(record.createdAt).getDay();
          weeklyTrend[dayOfWeek]++;
        });

        // Calculate statistics
        const totalUsage = usageRecords.length;
        const averagePerDay = totalUsage / 30;
        const projectedUsage = Math.ceil(averagePerDay * 30);

        // Find peak usage days
        const peakDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          .filter((_, index) => weeklyTrend[index] === Math.max(...weeklyTrend));

        // Determine trend
        const firstHalf = daily.slice(0, 3).reduce((sum, day) => sum + day.count, 0);
        const secondHalf = daily.slice(4).reduce((sum, day) => sum + day.count, 0);
        const trend = secondHalf > firstHalf ? 'up' : secondHalf < firstHalf ? 'down' : 'stable';

        // Get reset date (next month)
        const resetDate = new Date();
        resetDate.setMonth(resetDate.getMonth() + 1, 1);

        const analyticsData = {
          daily,
          weekly: [], // Could add weekly aggregation if needed
          monthly: [], // Could add monthly aggregation if needed
          weeklyTrend,
          peakUsageDays: peakDays,
          averagePerDay,
          trend,
          projectedUsage,
          resetDate: resetDate.toISOString(),
          lastUsed: usageRecords[0]?.createdAt.toISOString() || new Date().toISOString()
        };

        return {
          success: true,
          data: analyticsData
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching usage analytics:', errorMessage);
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
        feature: t.String()
      })
    }
  )

  // Get user activity summary
  .get(
    '/activity',
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

        // Get activity data from various tables
        const [resumes, jobListings, usageRecords] = await Promise.all([
          prisma.userResume.count({ where: { userId: user.id } }),
          prisma.jobListing.count({ where: { userId: user.id } }),
          prisma.usageRecord.findMany({
            where: { userId: user.id },
            select: { feature: true, usage: true, createdAt: true }
          })
        ]);

        const activitySummary = {
          totalResumes: resumes,
          totalJobsSaved: jobListings,
          totalFeatureUsage: usageRecords.length,
          lastActivity: usageRecords[0]?.createdAt || user.createdAt,
          mostUsedFeature: 'resume_generation', // Could calculate this
          weeklyActivity: 0 // Could calculate this
        };

        return {
          success: true,
          data: activitySummary
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching activity summary:', errorMessage);
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
