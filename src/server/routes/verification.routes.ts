const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const verificationRoutes = new Elysia({ prefix: '/api/verify' })
  // Verify email with token
  .get('/email',
    async ({ query, set }) => {
      try {
        const { token } = query;
        if (!token) {
          set.status = 400;
          return { success: false, message: 'Verification token is required' };
        }

        await authService.verifyEmail(token);

        // Redirect to success page on the frontend
        set.redirect = `${process.env.FRONTEND_URL}/verification/success`;
        return;
      } catch (error: any) {
        logger.error('Email verification failed:', error);
        // Redirect to error page with error message
        set.redirect = `${process.env.FRONTEND_URL}/verification/error?message=${encodeURIComponent(error.message)}`;
        return;
      }
    },
    {
      query: t.Object({
        token: t.String()
      })
    }
  )

  // Resend verification email
  .post('/resend',
    async ({ body, set }) => {
      try {
        const { email } = body;
        await authService.resendVerificationEmail(email);

        return {
          success: true,
          message: 'Verification email has been resent. Please check your inbox.'
        };
      } catch (error: any) {
        logger.error('Resend verification email failed:', error);
        set.status = 400;
        return {
          success: false,
          message: error.message || 'Failed to resend verification email'
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' })
      })
    }
  );

export default verificationRoutes;
