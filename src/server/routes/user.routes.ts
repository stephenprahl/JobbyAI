const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import prisma from '../services/prisma.service';
import { logger } from '../utils/logger';

/**
 * User profile routes for Elysia.js with Prisma integration
 * Handles user profile management operations
 */
export const userRoutes = new Elysia({ prefix: '/users' })
  // Add request logging
  .onRequest(({ request }) => {
    logger.info(`[${request.method}] ${request.url}`);
  })

  // Health check endpoint
  .get('/health', () => ({
    status: 'ok',
    service: 'users',
    timestamp: new Date().toISOString(),
  }))

  // Get current user profile
  .get(
    '/me',
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

        // Get user profile with related data
        const userProfile = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            profile: true,
            skills: {
              include: {
                skill: true
              }
            },
            experiences: true,
            education: true,
            certifications: true,
            jobListings: true,
            resumes: true
          }
        });

        if (!userProfile) {
          set.status = 404;
          return {
            success: false,
            error: 'User not found'
          };
        }

        logger.info('Getting current user profile', { userId: user.id });

        return {
          success: true,
          data: {
            id: userProfile.id,
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            role: userProfile.role,
            emailVerified: userProfile.emailVerified,
            isActive: userProfile.isActive,
            createdAt: userProfile.createdAt,
            updatedAt: userProfile.updatedAt,
            lastLoginAt: userProfile.lastLoginAt,
            profile: userProfile.profile ? {
              id: userProfile.profile.id,
              headline: userProfile.profile.headline,
              summary: userProfile.profile.summary,
              location: userProfile.profile.location,
              websiteUrl: userProfile.profile.websiteUrl,
              linkedinUrl: userProfile.profile.linkedinUrl,
              githubUrl: userProfile.profile.githubUrl,
              createdAt: userProfile.profile.createdAt,
              updatedAt: userProfile.profile.updatedAt
            } : null,
            skills: userProfile.skills.map(userSkill => ({
              skillId: userSkill.skillId,
              name: userSkill.skill.name,
              level: userSkill.level,
              yearsOfExperience: userSkill.yearsOfExperience,
              createdAt: userSkill.createdAt,
              updatedAt: userSkill.updatedAt
            })),
            experiences: userProfile.experiences,
            education: userProfile.education,
            certifications: userProfile.certifications,
            jobListings: userProfile.jobListings,
            resumes: userProfile.resumes
          }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting user profile:', errorMessage);
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
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            id: t.String(),
            email: t.String(),
            firstName: t.Optional(t.String()),
            lastName: t.Optional(t.String()),
            role: t.String(),
            emailVerified: t.Boolean(),
            isActive: t.Boolean(),
            createdAt: t.String(),
            updatedAt: t.String(),
            lastLoginAt: t.Optional(t.String()),
            profile: t.Optional(t.Object({
              id: t.String(),
              headline: t.Optional(t.String()),
              summary: t.Optional(t.String()),
              location: t.Optional(t.String()),
              websiteUrl: t.Optional(t.String()),
              linkedinUrl: t.Optional(t.String()),
              githubUrl: t.Optional(t.String()),
              createdAt: t.String(),
              updatedAt: t.String()
            })),
            skills: t.Array(t.Object({
              skillId: t.String(),
              name: t.String(),
              level: t.Optional(t.String()),
              yearsOfExperience: t.Optional(t.Number()),
              createdAt: t.String(),
              updatedAt: t.String()
            })),
            experiences: t.Array(t.Any()),
            education: t.Array(t.Any()),
            certifications: t.Array(t.Any()),
            jobListings: t.Array(t.Any()),
            resumes: t.Array(t.Any())
          })
        }),
        401: t.Object({
          success: t.Boolean(),
          error: t.String()
        }),
        404: t.Object({
          success: t.Boolean(),
          error: t.String()
        }),
        500: t.Object({
          success: t.Boolean(),
          error: t.String()
        })
      },
      detail: {
        summary: 'Get current user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile retrieved successfully'
          },
          401: {
            description: 'Unauthorized'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  )

  // Update user profile
  .put(
    '/me',
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

        logger.info('Updating user profile', { updates: Object.keys(body), userId: user.id });

        // Update user basic info
        const updateData: any = {};
        if (body.firstName !== undefined) updateData.firstName = body.firstName;
        if (body.lastName !== undefined) updateData.lastName = body.lastName;

        let updatedUser;
        if (Object.keys(updateData).length > 0) {
          updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData
          });
        } else {
          updatedUser = user;
        }

        // Update profile if provided
        if (body.profile) {
          await prisma.userProfile.upsert({
            where: { userId: user.id },
            update: {
              headline: body.profile.headline,
              summary: body.profile.summary,
              location: body.profile.location,
              websiteUrl: body.profile.websiteUrl,
              linkedinUrl: body.profile.linkedinUrl,
              githubUrl: body.profile.githubUrl,
              updatedAt: new Date()
            },
            create: {
              userId: user.id,
              headline: body.profile.headline,
              summary: body.profile.summary,
              location: body.profile.location,
              websiteUrl: body.profile.websiteUrl,
              linkedinUrl: body.profile.linkedinUrl,
              githubUrl: body.profile.githubUrl
            }
          });
        }

        return {
          success: true,
          data: {
            id: updatedUser.id,
            updatedAt: new Date().toISOString()
          }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error updating user profile:', errorMessage);
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
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        profile: t.Optional(t.Object({
          headline: t.Optional(t.String()),
          summary: t.Optional(t.String()),
          location: t.Optional(t.String()),
          websiteUrl: t.Optional(t.String()),
          linkedinUrl: t.Optional(t.String()),
          githubUrl: t.Optional(t.String()),
        }))
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            id: t.String(),
            updatedAt: t.String(),
          })
        }),
        401: t.Object({
          success: t.Boolean(),
          error: t.String()
        }),
        500: t.Object({
          success: t.Boolean(),
          error: t.String()
        })
      },
      detail: {
        summary: 'Update user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile updated successfully'
          },
          401: {
            description: 'Unauthorized'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  )

  // Get user skills
  .get(
    '/me/skills',
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

        logger.info('Getting user skills', { userId: user.id });

        const userSkills = await prisma.userSkill.findMany({
          where: { userId: user.id },
          include: {
            skill: true
          }
        });

        return {
          success: true,
          data: userSkills.map(userSkill => ({
            name: userSkill.skill.name,
            level: userSkill.level || 'BEGINNER',
            yearsOfExperience: userSkill.yearsOfExperience || 0,
          }))
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting user skills:', errorMessage);
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
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Array(t.Object({
            name: t.String(),
            level: t.String(),
            yearsOfExperience: t.Number(),
          }))
        }),
        401: t.Object({
          success: t.Boolean(),
          error: t.String()
        }),
        500: t.Object({
          success: t.Boolean(),
          error: t.String()
        })
      },
      detail: {
        summary: 'Get user skills',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User skills retrieved successfully'
          },
          401: {
            description: 'Unauthorized'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  )

  // Get user resumes
  .get(
    '/me/resumes',
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

        const resumes = await prisma.userResume.findMany({
          where: { userId: user.id },
          include: {
            template: true
          },
          orderBy: { createdAt: 'desc' }
        });

        logger.info('Getting user resumes', { userId: user.id, count: resumes.length });

        return {
          success: true,
          data: resumes
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting user resumes:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    }
  )

  // Get user job listings
  .get(
    '/me/jobs',
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

        const jobListings = await prisma.jobListing.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });

        logger.info('Getting user job listings', { userId: user.id, count: jobListings.length });

        return {
          success: true,
          data: jobListings
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting user job listings:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    }
  )

  // Get user experiences
  .get(
    '/me/experiences',
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

        const experiences = await prisma.experience.findMany({
          where: { userId: user.id },
          orderBy: { startDate: 'desc' }
        });

        logger.info('Getting user experiences', { userId: user.id, count: experiences.length });

        return {
          success: true,
          data: experiences
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting user experiences:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    }
  )

  // Get user education
  .get(
    '/me/education',
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

        const education = await prisma.education.findMany({
          where: { userId: user.id },
          orderBy: { startDate: 'desc' }
        });

        logger.info('Getting user education', { userId: user.id, count: education.length });

        return {
          success: true,
          data: education
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting user education:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    }
  )

  // Save/Create user resume
  .post(
    '/me/resumes',
    async ({ headers, body, set }) => {
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

        const { title, content, templateId, isPublic = false } = body;

        if (!title || !content) {
          set.status = 400;
          return {
            success: false,
            error: 'Title and content are required'
          };
        }

        const resume = await prisma.userResume.create({
          data: {
            userId: user.id,
            title,
            content,
            templateId: templateId || null,
            isPublic
          },
          include: {
            template: true
          }
        });

        logger.info('Resume saved successfully', { userId: user.id, resumeId: resume.id, title });

        return {
          success: true,
          data: resume,
          message: 'Resume saved successfully'
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error saving resume:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.Object({
          personalInfo: t.Object({
            fullName: t.String(),
            email: t.String(),
            phone: t.Optional(t.String()),
            location: t.Optional(t.String()),
            website: t.Optional(t.String()),
            linkedin: t.Optional(t.String())
          }),
          summary: t.Optional(t.String()),
          experiences: t.Array(t.Object({
            id: t.String(),
            title: t.String(),
            company: t.String(),
            location: t.Optional(t.String()),
            startDate: t.String(),
            endDate: t.Optional(t.String()),
            current: t.Optional(t.Boolean()),
            description: t.Optional(t.String())
          })),
          education: t.Array(t.Object({
            id: t.String(),
            institution: t.String(),
            degree: t.String(),
            fieldOfStudy: t.Optional(t.String()),
            startDate: t.Optional(t.String()),
            endDate: t.Optional(t.String()),
            gpa: t.Optional(t.String()),
            description: t.Optional(t.String())
          })),
          skills: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
            level: t.Union([
              t.Literal('Beginner'),
              t.Literal('Intermediate'),
              t.Literal('Advanced'),
              t.Literal('Expert')
            ])
          }))
        }),
        templateId: t.Optional(t.String()),
        isPublic: t.Optional(t.Boolean())
      })
    }
  )

  // Update user resume
  .put(
    '/me/resumes/:id',
    async ({ headers, body, params, set }) => {
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

        const { id } = params;
        const { title, content, templateId, isPublic } = body;

        // Check if resume exists and belongs to user
        const existingResume = await prisma.userResume.findFirst({
          where: { id, userId: user.id }
        });

        if (!existingResume) {
          set.status = 404;
          return {
            success: false,
            error: 'Resume not found'
          };
        }

        const updatedResume = await prisma.userResume.update({
          where: { id },
          data: {
            title: title || existingResume.title,
            content: content || existingResume.content,
            templateId: templateId !== undefined ? templateId : existingResume.templateId,
            isPublic: isPublic !== undefined ? isPublic : existingResume.isPublic
          },
          include: {
            template: true
          }
        });

        logger.info('Resume updated successfully', { userId: user.id, resumeId: id, title });

        return {
          success: true,
          data: updatedResume,
          message: 'Resume updated successfully'
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error updating resume:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        content: t.Optional(t.Any()),
        templateId: t.Optional(t.String()),
        isPublic: t.Optional(t.Boolean())
      })
    }
  );

export default userRoutes;
