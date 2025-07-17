const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import prisma from '../services/prisma.service';
import { logger } from '../utils/logger';

interface ScamReport {
  title: string;
  companyName: string;
  location?: string;
  description?: string;
  url?: string;
  email?: string;
  phone?: string;
  salary?: string;
  employmentType?: string;
  scamType: string;
  evidenceUrls?: string[];
  notes?: string;
}

export const scamTrackerRoutes = new Elysia({ prefix: '/scams' })
  .onRequest(({ request }) => {
    logger.info(`[ScamTracker] ${request.method} ${request.url}`);
  })

  // Get all reported scams (paginated)
  .get(
    '/',
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

        const { page = '1', limit = '20', status, severity, scamType } = query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Build filter conditions
        const where: any = {};
        if (status) where.status = status;
        if (severity) where.severity = severity;
        if (scamType) where.scamType = scamType;

        const [scams, totalCount] = await Promise.all([
          prisma.jobScam.findMany({
            where,
            include: {
              reportedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              },
              verifiedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              },
              _count: {
                select: {
                  userWarnings: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limitNum
          }),
          prisma.jobScam.count({ where })
        ]);

        return {
          success: true,
          data: {
            scams,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: totalCount,
              totalPages: Math.ceil(totalCount / limitNum),
              hasMore: offset + scams.length < totalCount
            }
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching scams:', errorMessage);
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
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        status: t.Optional(t.String()),
        severity: t.Optional(t.String()),
        scamType: t.Optional(t.String())
      })
    }
  )

  // Report a new scam
  .post(
    '/report',
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

        const scamData = body as ScamReport;

        // Validate required fields
        if (!scamData.title || !scamData.companyName || !scamData.scamType) {
          set.status = 400;
          return {
            success: false,
            error: 'Title, company name, and scam type are required'
          };
        }

        // Check for duplicate reports (same company, title, and URL if provided)
        const existingScam = await prisma.jobScam.findFirst({
          where: {
            title: scamData.title,
            companyName: scamData.companyName,
            ...(scamData.url && { url: scamData.url })
          }
        });

        if (existingScam) {
          return {
            success: false,
            error: 'This scam has already been reported',
            data: { existingScamId: existingScam.id }
          };
        }

        // Create the scam report
        const newScam = await prisma.jobScam.create({
          data: {
            reportedById: user.id,
            title: scamData.title,
            companyName: scamData.companyName,
            location: scamData.location,
            description: scamData.description,
            url: scamData.url,
            email: scamData.email,
            phone: scamData.phone,
            salary: scamData.salary,
            employmentType: scamData.employmentType,
            scamType: scamData.scamType,
            evidenceUrls: scamData.evidenceUrls || [],
            notes: scamData.notes
          },
          include: {
            reportedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        });

        logger.info('New scam reported:', {
          scamId: newScam.id,
          reportedBy: user.id,
          company: newScam.companyName,
          scamType: newScam.scamType
        });

        return {
          success: true,
          data: newScam,
          message: 'Scam reported successfully. Thank you for helping protect the community!'
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error reporting scam:', errorMessage);
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
        title: t.String(),
        companyName: t.String(),
        location: t.Optional(t.String()),
        description: t.Optional(t.String()),
        url: t.Optional(t.String()),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        salary: t.Optional(t.String()),
        employmentType: t.Optional(t.String()),
        scamType: t.String(),
        evidenceUrls: t.Optional(t.Array(t.String())),
        notes: t.Optional(t.String())
      })
    }
  )

  // Check if a job posting might be a scam
  .post(
    '/check',
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

        const { title, companyName, url, email } = body;

        // Search for similar scams
        const potentialScams = await prisma.jobScam.findMany({
          where: {
            OR: [
              { companyName: { contains: companyName, mode: 'insensitive' as any } },
              ...(url ? [{ url: { contains: url, mode: 'insensitive' as any } }] : []),
              ...(email ? [{ email: { contains: email, mode: 'insensitive' as any } }] : []),
              { title: { contains: title, mode: 'insensitive' as any } }
            ],
            status: {
              in: ['REPORTED', 'VERIFIED', 'UNDER_REVIEW']
            }
          },
          include: {
            reportedBy: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            _count: {
              select: {
                userWarnings: true
              }
            }
          },
          orderBy: [
            { status: 'desc' }, // Verified scams first
            { severity: 'desc' },
            { warningCount: 'desc' }
          ]
        });

        let riskLevel = 'LOW';
        let warnings: string[] = [];

        if (potentialScams.length > 0) {
          const verifiedScams = potentialScams.filter(s => s.status === 'VERIFIED');
          const highSeverityScams = potentialScams.filter(s => s.severity === 'HIGH' || s.severity === 'CRITICAL');

          if (verifiedScams.length > 0) {
            riskLevel = 'HIGH';
            warnings.push('This job posting matches verified scam reports');
          } else if (highSeverityScams.length > 0) {
            riskLevel = 'MEDIUM';
            warnings.push('This job posting shows similarities to reported scams');
          } else {
            riskLevel = 'LOW';
            warnings.push('Similar reports found, exercise caution');
          }

          // Track that user has been warned
          if (potentialScams.length > 0 && riskLevel !== 'LOW') {
            await Promise.all(
              potentialScams.slice(0, 3).map(async (scam) => {
                await prisma.userScamWarning.upsert({
                  where: {
                    userId_scamId: {
                      userId: user.id,
                      scamId: scam.id
                    }
                  },
                  update: {
                    warnedAt: new Date()
                  },
                  create: {
                    userId: user.id,
                    scamId: scam.id
                  }
                });

                // Increment warning count
                await prisma.jobScam.update({
                  where: { id: scam.id },
                  data: {
                    warningCount: {
                      increment: 1
                    }
                  }
                });
              })
            );
          }
        }

        return {
          success: true,
          data: {
            riskLevel,
            warnings,
            matchingScams: potentialScams.map((scam: any) => ({
              id: scam.id,
              title: scam.title,
              companyName: scam.companyName,
              scamType: scam.scamType,
              severity: scam.severity,
              status: scam.status,
              reportedBy: `${scam.reportedBy.firstName} ${scam.reportedBy.lastName?.charAt(0)}.`,
              warningCount: scam._count.userWarnings,
              createdAt: scam.createdAt
            }))
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error checking for scams:', errorMessage);
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
        title: t.String(),
        companyName: t.String(),
        url: t.Optional(t.String()),
        email: t.Optional(t.String())
      })
    }
  )

  // Get scam statistics
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
        await authService.getCurrentUser(token);

        const [
          totalReports,
          verifiedScams,
          recentReports,
          topScamTypes,
          severityStats,
          statusStats
        ] = await Promise.all([
          prisma.jobScam.count(),
          prisma.jobScam.count({ where: { status: 'VERIFIED' } }),
          prisma.jobScam.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            }
          }),
          prisma.jobScam.groupBy({
            by: ['scamType'],
            _count: { scamType: true },
            orderBy: { _count: { scamType: 'desc' } },
            take: 5
          }),
          prisma.jobScam.groupBy({
            by: ['severity'],
            _count: { severity: true }
          }),
          prisma.jobScam.groupBy({
            by: ['status'],
            _count: { status: true }
          })
        ]);

        return {
          success: true,
          data: {
            totalReports,
            verifiedScams,
            recentReports,
            topScamTypes: topScamTypes.map(item => ({
              type: item.scamType,
              count: item._count.scamType
            })),
            severityDistribution: severityStats.map(item => ({
              severity: item.severity,
              count: item._count.severity
            })),
            statusDistribution: statusStats.map(item => ({
              status: item.status,
              count: item._count.status
            }))
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching scam stats:', errorMessage);
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
  )

  // Verify a scam (admin only)
  .put(
    '/:scamId/verify',
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

        // Check if user is admin
        if (user.role !== 'ADMIN') {
          set.status = 403;
          return {
            success: false,
            error: 'Admin access required'
          };
        }

        const { scamId } = params;

        const updatedScam = await prisma.jobScam.update({
          where: { id: scamId },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
            verifiedById: user.id
          },
          include: {
            reportedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            },
            verifiedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        });

        logger.info('Scam verified:', {
          scamId: updatedScam.id,
          verifiedBy: user.id,
          company: updatedScam.companyName
        });

        return {
          success: true,
          data: updatedScam,
          message: 'Scam verified successfully'
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error verifying scam:', errorMessage);
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
        scamId: t.String()
      })
    }
  )

  // Get user's scam warnings
  .get(
    '/my-warnings',
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

        const warnings = await prisma.userScamWarning.findMany({
          where: {
            userId: user.id,
            dismissed: false
          },
          include: {
            scam: {
              select: {
                id: true,
                title: true,
                companyName: true,
                scamType: true,
                severity: true,
                status: true,
                createdAt: true
              }
            }
          },
          orderBy: { warnedAt: 'desc' }
        });

        return {
          success: true,
          data: warnings
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching user warnings:', errorMessage);
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
