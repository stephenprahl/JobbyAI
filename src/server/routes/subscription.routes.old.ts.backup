const { Elysia, t } = require('elysia');
import { subscriptionService, SubscriptionService } from '../services/subscription.service';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

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

  // Create checkout session
  .post(
    '/checkout',
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

        const { plan, successUrl, cancelUrl } = body;

        const checkoutUrl = await subscriptionService.createCheckoutSession(
          user.id,
          plan,
          successUrl,
          cancelUrl
        );

        return {
          success: true,
          data: { checkoutUrl }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error creating checkout session:', errorMessage);
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
        successUrl: t.String(),
        cancelUrl: t.String()
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            checkoutUrl: t.String()
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
      }
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
  )

  // Stripe webhook endpoint
  .post(
    '/webhook',
    async ({ body, headers, set }) => {
      try {
        const sig = headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!sig || !endpointSecret) {
          set.status = 400;
          return { error: 'Missing signature or endpoint secret' };
        }

        let event;
        try {
          event = stripe.webhooks.constructEvent(body as string, sig, endpointSecret);
        } catch (err) {
          logger.error('Webhook signature verification failed:', err);
          set.status = 400;
          return { error: 'Webhook signature verification failed' };
        }

        // Handle the event
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;
            await subscriptionService.handlePaymentSuccess(subscription.id);
            break;

          case 'customer.subscription.deleted':
            // Handle subscription cancellation
            const canceledSubscription = event.data.object as Stripe.Subscription;
            logger.info('Subscription canceled via webhook:', {
              subscriptionId: canceledSubscription.id
            });
            break;

          case 'invoice.payment_succeeded':
            const invoice = event.data.object as any;
            if (invoice.subscription && typeof invoice.subscription === 'string') {
              await subscriptionService.handlePaymentSuccess(invoice.subscription);
            }
            break;

          case 'invoice.payment_failed':
            // Handle failed payment
            const failedInvoice = event.data.object as any;
            logger.warn('Payment failed:', {
              invoiceId: failedInvoice.id,
              subscriptionId: failedInvoice.subscription
            });
            break;

          default:
            logger.info('Unhandled webhook event type:', event.type);
        }

        return { received: true };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error handling webhook:', errorMessage);
        set.status = 500;
        return { error: errorMessage };
      }
    }
  );

export default subscriptionRoutes;
