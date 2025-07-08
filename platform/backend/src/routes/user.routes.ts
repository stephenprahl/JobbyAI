import { Elysia, t } from 'elysia';
import { logger } from '../utils/logger';

/**
 * User profile routes for Elysia.js with Prisma integration
 * Handles user profile management operations
 */
export const userRoutes = (app: Elysia) =>
  app.group('/users', (app) =>
    app
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
            // In a real implementation, extract user ID from JWT token
            const authHeader = headers.authorization;
            if (!authHeader) {
              set.status = 401;
              return {
                success: false,
                error: 'Authorization header required'
              };
            }

            // For now, we'll simulate getting the user
            // In production, decode JWT and get user ID
            logger.info('Getting current user profile');

            // Return mock user for development
            return {
              success: true,
              data: {
                id: 'user-123',
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                profile: {
                  headline: 'Senior Software Engineer',
                  summary: 'Experienced full-stack developer...',
                  location: 'San Francisco, CA',
                }
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
                firstName: t.String(),
                lastName: t.String(),
                profile: t.Object({
                  headline: t.String(),
                  summary: t.String(),
                  location: t.String(),
                })
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

            logger.info('Updating user profile', { updates: Object.keys(body) });

            // For now, return success with updated data
            return {
              success: true,
              data: {
                id: 'user-123',
                ...body,
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

            logger.info('Getting user skills');

            // Return mock skills for development
            return {
              success: true,
              data: [
                { name: 'JavaScript', level: 'EXPERT', yearsOfExperience: 5 },
                { name: 'TypeScript', level: 'ADVANCED', yearsOfExperience: 3 },
                { name: 'React', level: 'EXPERT', yearsOfExperience: 4 },
                { name: 'Node.js', level: 'ADVANCED', yearsOfExperience: 4 },
              ]
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
  );

export default userRoutes;
