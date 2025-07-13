const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import { paymentService } from '../services/payment.service';
import { subscriptionService, SubscriptionService } from '../services/subscription.service';
import { logger } from '../utils/logger';

export const subscriptionRoutes = new Elysia({ prefix: '/subscription' })
  .onRequest(({ request }) => {
    logger.info(`[${request.method}] ${request.url}`);
  })

  // Get all available plans
  .get('/plans', () => {
    return {
      success: true,
      data: SubscriptionService.getAllPlans()
    };
  })

  // Get current user's subscription
  .get(
    '/current',
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

        const subscription = await subscriptionService.getUserSubscription(user.id);

        return {
          success: true,
          data: subscription
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting user subscription:', errorMessage);
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
          data: t.Any()
        }),
        401: t.Object({
          success: t.Boolean(),
          error: t.String()
        }),
        500: t.Object({
          success: t.Boolean(),
          error: t.String()
        })
      }
    }
  )

  // Upgrade subscription with payment
  .post(
    '/upgrade',
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

        const { plan, paymentDetails, paymentMethodId } = body;

        // If payment details are provided, save payment method first
        let finalPaymentMethodId = paymentMethodId;
        if (paymentDetails && !paymentMethodId) {
          const saveResult = await paymentService.savePaymentMethod(
            user.id,
            paymentDetails.card,
            paymentDetails.billingAddress,
            true // Set as default
          );

          if (!saveResult.success) {
            set.status = 400;
            return {
              success: false,
              error: saveResult.error
            };
          }

          finalPaymentMethodId = saveResult.paymentMethodId;
        }

        const result = await subscriptionService.upgradePlan(
          user.id,
          plan,
          finalPaymentMethodId
        );

        if (!result.success) {
          set.status = 400;
          return {
            success: false,
            error: result.error
          };
        }

        return {
          success: true,
          data: { subscriptionId: result.subscriptionId }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error upgrading subscription:', errorMessage);
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
        plan: t.Union([
          t.Literal('BASIC'),
          t.Literal('PRO'),
          t.Literal('ENTERPRISE')
        ]),
        paymentMethodId: t.Optional(t.String()),
        paymentDetails: t.Optional(t.Object({
          card: t.Object({
            number: t.String(),
            expMonth: t.Number(),
            expYear: t.Number(),
            cvc: t.String(),
            holderName: t.Optional(t.String())
          }),
          billingAddress: t.Optional(t.Object({
            line1: t.String(),
            line2: t.Optional(t.String()),
            city: t.String(),
            state: t.String(),
            postalCode: t.String(),
            country: t.String()
          }))
        }))
      })
    }
  )

  // Get user's payment methods
  .get(
    '/payment-methods',
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

        const paymentMethods = await paymentService.getUserPaymentMethods(user.id);

        return {
          success: true,
          data: paymentMethods
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error getting payment methods:', errorMessage);
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

  // Add payment method
  .post(
    '/payment-methods',
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

        const { card, billingAddress, setAsDefault } = body;

        const result = await paymentService.savePaymentMethod(
          user.id,
          card,
          billingAddress,
          setAsDefault
        );

        if (!result.success) {
          set.status = 400;
          return {
            success: false,
            error: result.error
          };
        }

        return {
          success: true,
          data: { paymentMethodId: result.paymentMethodId }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error adding payment method:', errorMessage);
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
        card: t.Object({
          number: t.String(),
          expMonth: t.Number(),
          expYear: t.Number(),
          cvc: t.String(),
          holderName: t.Optional(t.String())
        }),
        billingAddress: t.Optional(t.Object({
          line1: t.String(),
          line2: t.Optional(t.String()),
          city: t.String(),
          state: t.String(),
          postalCode: t.String(),
          country: t.String()
        })),
        setAsDefault: t.Optional(t.Boolean())
      })
    }
  )

  // Delete payment method
  .delete(
    '/payment-methods/:id',
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

        await paymentService.deletePaymentMethod(user.id, params.id);

        return {
          success: true,
          data: { message: 'Payment method deleted successfully' }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error deleting payment method:', errorMessage);
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
        id: t.String()
      })
    }
  )

  // Set default payment method
  .post(
    '/payment-methods/:id/default',
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

        await paymentService.setDefaultPaymentMethod(user.id, params.id);

        return {
          success: true,
          data: { message: 'Default payment method updated successfully' }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error setting default payment method:', errorMessage);
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
        id: t.String()
      })
    }
  )

  // Check feature usage
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
        const usageResult = await subscriptionService.canUseFeature(user.id, feature);

        return {
          success: true,
          data: usageResult
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error checking feature usage:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      params: t.Object({
        feature: t.String()
      }),
      headers: t.Object({
        authorization: t.String(),
      })
    }
  )

  // Record feature usage
  .post(
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

        // Check if user can use the feature
        const usageCheck = await subscriptionService.canUseFeature(user.id, feature);
        if (!usageCheck.allowed) {
          set.status = 403;
          return {
            success: false,
            error: 'Feature usage limit exceeded'
          };
        }

        await subscriptionService.recordUsage(user.id, feature);

        return {
          success: true,
          data: { message: 'Usage recorded successfully' }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error recording feature usage:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      params: t.Object({
        feature: t.String()
      }),
      headers: t.Object({
        authorization: t.String(),
      })
    }
  )

  // Cancel subscription
  .post(
    '/cancel',
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

        const { immediate = false } = body;

        await subscriptionService.cancelSubscription(user.id, immediate);

        return {
          success: true,
          data: { message: 'Subscription canceled successfully' }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error canceling subscription:', errorMessage);
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
        immediate: t.Optional(t.Boolean())
      })
    }
  );

export default subscriptionRoutes;
