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

interface AIAnalysis {
  isScam: boolean;
  confidence: number;
  scamType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasoning: string;
  redFlags: string[];
}

// AI-powered scam detection function
async function analyzeJobWithAI(jobData: any): Promise<AIAnalysis> {
  const redFlags: string[] = [];
  let scamScore = 0;
  let reasoning = '';

  // Check for common scam indicators
  const description = jobData.description?.toLowerCase() || '';
  const title = jobData.title?.toLowerCase() || '';
  const company = jobData.company?.toLowerCase() || '';

  // Red flag patterns
  const scamPatterns = [
    // Money/payment related scams
    { pattern: /pay.*fee|upfront.*cost|deposit.*required|investment.*required/i, weight: 0.4, flag: 'Upfront payment required' },
    { pattern: /wire.*money|transfer.*funds|western.*union|bitcoin|cryptocurrency/i, weight: 0.5, flag: 'Money transfer requests' },

    // Too good to be true
    { pattern: /\$[0-9,]+.*per.*week.*working.*home|\$[0-9,]+.*per.*hour.*no.*experience/i, weight: 0.3, flag: 'Unrealistic salary promises' },
    { pattern: /earn.*\$[0-9,]+.*daily|make.*money.*fast|get.*rich.*quick/i, weight: 0.4, flag: 'Get-rich-quick schemes' },

    // Vague job descriptions
    { pattern: /data.*entry.*no.*experience|easy.*work.*from.*home|simple.*tasks/i, weight: 0.2, flag: 'Vague job description' },
    { pattern: /no.*experience.*necessary.*high.*pay|flexible.*hours.*guaranteed/i, weight: 0.3, flag: 'Unrealistic requirements' },

    // Personal information harvesting
    { pattern: /social.*security|bank.*account|credit.*card|driver.*license/i, weight: 0.4, flag: 'Requests sensitive information' },
    { pattern: /send.*resume.*to.*personal.*email|contact.*via.*text|whatsapp/i, weight: 0.3, flag: 'Unprofessional communication' },

    // Fake companies
    { pattern: /google.*work.*from.*home|amazon.*work.*from.*home|facebook.*hiring/i, weight: 0.4, flag: 'Impersonating major companies' },

    // MLM/Pyramid schemes
    { pattern: /recruit.*others|multi.*level|pyramid|downline|network.*marketing/i, weight: 0.4, flag: 'MLM/Pyramid scheme indicators' },

    // Urgency tactics
    { pattern: /act.*now|limited.*time|urgent|immediate.*start|apply.*today.*only/i, weight: 0.2, flag: 'Urgency pressure tactics' },

    // Poor grammar/spelling (simplified check)
    { pattern: /recieve|seperate|occured|teh |adn |taht |yuo |thier /i, weight: 0.2, flag: 'Poor spelling/grammar' }
  ];

  // Email patterns
  const suspiciousEmailPatterns = [
    /@gmail\.com|@yahoo\.com|@hotmail\.com|@outlook\.com/i, // Personal emails for business
    /noreply|donotreply/i // No-reply emails for job postings
  ];

  // Company name red flags
  const suspiciousCompanyPatterns = [
    /llc$/i, // Many scams use fake LLCs
    /inc$/i,
    /solutions$/i,
    /consulting$/i,
    /services$/i,
    /group$/i
  ];

  // Analyze description for scam patterns
  scamPatterns.forEach(({ pattern, weight, flag }) => {
    if (pattern.test(description) || pattern.test(title)) {
      scamScore += weight;
      redFlags.push(flag);
    }
  });

  // Check email domain
  if (jobData.contactEmail) {
    suspiciousEmailPatterns.forEach(pattern => {
      if (pattern.test(jobData.contactEmail)) {
        scamScore += 0.2;
        redFlags.push('Uses personal email domain');
      }
    });
  }

  // Check company name patterns
  suspiciousCompanyPatterns.forEach(pattern => {
    if (pattern.test(company)) {
      scamScore += 0.1;
      redFlags.push('Generic company name pattern');
    }
  });

  // Check for missing important details
  if (!jobData.location || jobData.location.toLowerCase().includes('anywhere')) {
    scamScore += 0.1;
    redFlags.push('Vague or missing location');
  }

  if (!jobData.description || jobData.description.length < 100) {
    scamScore += 0.2;
    redFlags.push('Very short job description');
  }

  // Salary analysis
  if (jobData.salary) {
    const salaryText = jobData.salary.toLowerCase();
    if (salaryText.includes('$') && salaryText.includes('hour')) {
      const hourlyMatch = salaryText.match(/\$(\d+)/);
      if (hourlyMatch && parseInt(hourlyMatch[1]) > 50) {
        scamScore += 0.2;
        redFlags.push('Unusually high hourly rate');
      }
    }
  }

  // Determine scam type based on red flags
  let scamType = 'fake_position';
  if (redFlags.some(flag => flag.includes('payment') || flag.includes('money'))) {
    scamType = 'payment_scam';
  } else if (redFlags.some(flag => flag.includes('information'))) {
    scamType = 'identity_theft';
  } else if (redFlags.some(flag => flag.includes('MLM') || flag.includes('recruit'))) {
    scamType = 'pyramid_scheme';
  } else if (redFlags.some(flag => flag.includes('company'))) {
    scamType = 'fake_company';
  }

  // Determine severity
  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (scamScore >= 0.8) severity = 'CRITICAL';
  else if (scamScore >= 0.6) severity = 'HIGH';
  else if (scamScore >= 0.4) severity = 'MEDIUM';

  // Generate reasoning
  if (redFlags.length > 0) {
    reasoning = `Detected ${redFlags.length} red flag(s): ${redFlags.join(', ')}`;
  } else {
    reasoning = 'No significant scam indicators detected';
  }

  const confidence = Math.min(scamScore, 1.0);
  const isScam = confidence >= 0.4;

  return {
    isScam,
    confidence,
    scamType,
    severity,
    reasoning,
    redFlags
  };
}

// Ban job from platform
async function banJobFromPlatform(jobData: any, analysis: AIAnalysis): Promise<void> {
  try {
    // Add to banned companies list
    await prisma.bannedCompany.upsert({
      where: { companyName: jobData.company },
      update: {
        reason: `AI Detection: ${analysis.reasoning}`,
        bannedAt: new Date(),
        bannedBy: 'ai-system'
      },
      create: {
        companyName: jobData.company,
        reason: `AI Detection: ${analysis.reasoning}`,
        bannedBy: 'ai-system'
      }
    });

    // If there's a URL, add to banned URLs
    if (jobData.url) {
      await prisma.bannedUrl.upsert({
        where: { url: jobData.url },
        update: {
          reason: `AI Detection: Scam job posting`,
          bannedAt: new Date(),
          bannedBy: 'ai-system'
        },
        create: {
          url: jobData.url,
          reason: `AI Detection: Scam job posting`,
          bannedBy: 'ai-system'
        }
      });
    }

    // If there's an email, add to banned emails
    if (jobData.contactEmail) {
      await prisma.bannedEmail.upsert({
        where: { email: jobData.contactEmail },
        update: {
          reason: `AI Detection: Scam contact`,
          bannedAt: new Date(),
          bannedBy: 'ai-system'
        },
        create: {
          email: jobData.contactEmail,
          reason: `AI Detection: Scam contact`,
          bannedBy: 'ai-system'
        }
      });
    }

    logger.info('Banned scam job from platform:', {
      company: jobData.company,
      url: jobData.url,
      email: jobData.contactEmail,
      reason: analysis.reasoning
    });
  } catch (error) {
    logger.error('Error banning job from platform:', error);
    // Don't throw error, just log it
  }
}

// Flag job for manual review
async function flagJobForReview(jobData: any, analysis: AIAnalysis): Promise<void> {
  try {
    await prisma.flaggedJob.create({
      data: {
        title: jobData.title,
        companyName: jobData.company,
        description: jobData.description,
        url: jobData.url,
        contactEmail: jobData.contactEmail,
        flaggedReason: analysis.reasoning,
        aiConfidence: analysis.confidence,
        flaggedBy: 'ai-system'
      }
    });

    logger.info('Flagged job for manual review:', {
      company: jobData.company,
      confidence: analysis.confidence,
      reason: analysis.reasoning
    });
  } catch (error) {
    logger.error('Error flagging job for review:', error);
    // Don't throw error, just log it
  }
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

  // AI-powered scam analysis for job postings
  .post(
    '/analyze-job',
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

        const { jobData } = body;

        // AI analysis of the job posting
        const analysis = await analyzeJobWithAI(jobData);

        // If AI determines it's a scam with high confidence
        if (analysis.isScam && analysis.confidence >= 0.8) {
          // Automatically create scam report
          const scamReport = await prisma.jobScam.create({
            data: {
              reportedById: user.id,
              title: jobData.title,
              companyName: jobData.company,
              location: jobData.location,
              description: jobData.description,
              url: jobData.url,
              email: jobData.contactEmail,
              phone: jobData.contactPhone,
              salary: jobData.salary,
              employmentType: jobData.jobType,
              scamType: analysis.scamType,
              severity: analysis.severity,
              status: analysis.confidence >= 0.95 ? 'VERIFIED' : 'REPORTED',
              evidenceUrls: [],
              notes: `AI Analysis: ${analysis.reasoning}. Confidence: ${(analysis.confidence * 100).toFixed(1)}%`,
              verifiedAt: analysis.confidence >= 0.95 ? new Date() : null,
              // Don't set verifiedById for AI-created reports, only for manually verified ones
              verifiedById: null
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

          // Ban the job from the platform
          await banJobFromPlatform(jobData, analysis);

          logger.info('AI detected and banned scam job:', {
            scamId: scamReport.id,
            company: jobData.company,
            confidence: analysis.confidence,
            scamType: analysis.scamType
          });

          return {
            success: true,
            data: {
              isScam: true,
              scamReport,
              analysis,
              action: 'banned'
            },
            message: 'Job posting identified as scam and removed from platform'
          };
        }

        // If suspicious but not confirmed scam
        if (analysis.isScam && analysis.confidence >= 0.6) {
          // Flag for manual review
          await flagJobForReview(jobData, analysis);

          return {
            success: true,
            data: {
              isScam: true,
              analysis,
              action: 'flagged_for_review'
            },
            message: 'Job posting flagged for manual review due to suspicious indicators'
          };
        }

        // Job appears legitimate
        return {
          success: true,
          data: {
            isScam: false,
            analysis,
            action: 'approved'
          },
          message: 'Job posting appears legitimate'
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error analyzing job with AI:', errorMessage);
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
        jobData: t.Object({
          title: t.String(),
          company: t.String(),
          description: t.String(),
          location: t.Optional(t.String()),
          url: t.Optional(t.String()),
          contactEmail: t.Optional(t.String()),
          contactPhone: t.Optional(t.String()),
          salary: t.Optional(t.String()),
          jobType: t.Optional(t.String()),
          requirements: t.Optional(t.Array(t.String())),
          benefits: t.Optional(t.Array(t.String()))
        })
      })
    }
  )

  // Check if company/URL/email is banned
  .post(
    '/check-banned',
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
        await authService.getCurrentUser(token);

        const { company, url, email } = body;

        const [bannedCompany, bannedUrl, bannedEmail] = await Promise.all([
          company ? prisma.bannedCompany.findUnique({ where: { companyName: company } }) : null,
          url ? prisma.bannedUrl.findUnique({ where: { url } }) : null,
          email ? prisma.bannedEmail.findUnique({ where: { email } }) : null
        ]);

        const isBanned = !!(bannedCompany || bannedUrl || bannedEmail);
        const banReasons: string[] = [];

        if (bannedCompany) banReasons.push(`Company: ${bannedCompany.reason}`);
        if (bannedUrl) banReasons.push(`URL: ${bannedUrl.reason}`);
        if (bannedEmail) banReasons.push(`Email: ${bannedEmail.reason}`);

        return {
          success: true,
          data: {
            isBanned,
            reasons: banReasons,
            bannedCompany: bannedCompany || null,
            bannedUrl: bannedUrl || null,
            bannedEmail: bannedEmail || null
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error checking banned status:', errorMessage);
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
        company: t.Optional(t.String()),
        url: t.Optional(t.String()),
        email: t.Optional(t.String())
      })
    }
  )

  // Get flagged jobs for admin review
  .get(
    '/flagged-jobs',
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

        // Check if user is admin
        if (user.role !== 'ADMIN') {
          set.status = 403;
          return {
            success: false,
            error: 'Admin access required'
          };
        }

        const { page = '1', limit = '20', reviewed = 'false' } = query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const where = {
          reviewed: reviewed === 'true'
        };

        const [flaggedJobs, totalCount] = await Promise.all([
          prisma.flaggedJob.findMany({
            where,
            orderBy: { flaggedAt: 'desc' },
            skip: offset,
            take: limitNum
          }),
          prisma.flaggedJob.count({ where })
        ]);

        return {
          success: true,
          data: {
            flaggedJobs,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: totalCount,
              totalPages: Math.ceil(totalCount / limitNum),
              hasMore: offset + flaggedJobs.length < totalCount
            }
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching flagged jobs:', errorMessage);
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
        reviewed: t.Optional(t.String())
      })
    }
  )

  // Review a flagged job (admin only)
  .put(
    '/flagged-jobs/:jobId/review',
    async ({ params, body, headers, set }) => {
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

        const { jobId } = params;
        const { action } = body; // 'approved', 'banned', 'needs_more_review'

        const flaggedJob = await prisma.flaggedJob.update({
          where: { id: jobId },
          data: {
            reviewed: true,
            reviewedAt: new Date(),
            reviewedBy: user.id,
            reviewAction: action
          }
        });

        // If banned, add to banned lists
        if (action === 'banned') {
          const analysis: AIAnalysis = {
            isScam: true,
            confidence: 1.0,
            scamType: 'fake_position',
            severity: 'HIGH',
            reasoning: 'Manual admin review confirmation',
            redFlags: ['Admin verified scam']
          };

          await banJobFromPlatform({
            company: flaggedJob.companyName,
            url: flaggedJob.url,
            contactEmail: flaggedJob.contactEmail
          }, analysis);
        }

        logger.info('Flagged job reviewed:', {
          jobId: flaggedJob.id,
          reviewedBy: user.id,
          action,
          company: flaggedJob.companyName
        });

        return {
          success: true,
          data: flaggedJob,
          message: `Job ${action} successfully`
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error reviewing flagged job:', errorMessage);
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
      }),
      body: t.Object({
        action: t.String()
      })
    }
  )

  // Get scam statistics
  .get(
    '/banned-entities/stats',
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

        // Check if user is admin
        if (user.role !== 'ADMIN') {
          set.status = 403;
          return {
            success: false,
            error: 'Admin access required'
          };
        }

        const [
          bannedCompaniesCount,
          bannedUrlsCount,
          bannedEmailsCount,
          flaggedJobsCount,
          reviewedJobsCount
        ] = await Promise.all([
          prisma.bannedCompany.count(),
          prisma.bannedUrl.count(),
          prisma.bannedEmail.count(),
          prisma.flaggedJob.count(),
          prisma.flaggedJob.count({ where: { reviewed: true } })
        ]);

        return {
          success: true,
          data: {
            bannedCompanies: bannedCompaniesCount,
            bannedUrls: bannedUrlsCount,
            bannedEmails: bannedEmailsCount,
            flaggedJobs: flaggedJobsCount,
            reviewedJobs: reviewedJobsCount,
            pendingReview: flaggedJobsCount - reviewedJobsCount
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching banned entity stats:', errorMessage);
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
