import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { logger } from '../utils/logger';
import prisma from './prisma.service';
import { paymentService } from './payment.service';

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: number; // in cents
  features: string[];
  limits: {
    resumeGenerations: number | null; // null = unlimited
    jobAnalyses: number | null;
    templates: number | null;
    aiAnalyses: number | null;
  };
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanDetails[] = [
  {
    id: 'FREE' as SubscriptionPlan,
    name: 'Free',
    description: 'Get started with basic features',
    price: 0,
    stripePriceId: 'price_free', // This will be set to actual Stripe price ID
    features: [
      '3 resume generations per month',
      '5 job analyses per month',
      '3 basic templates',
      'Email support',
      '14-day trial of Pro features'
    ],
    limits: {
      resumeGenerations: 3,
      jobAnalyses: 5,
      templates: 3,
      aiAnalyses: 5
    }
  },
  {
    id: 'BASIC' as SubscriptionPlan,
    name: 'Basic',
    description: 'Great for active job seekers',
    price: 999, // $9.99
    stripePriceId: 'price_basic', // This will be set to actual Stripe price ID
    features: [
      '25 resume generations per month',
      '50 job analyses per month',
      'All templates',
      'Priority email support',
      'Chrome extension'
    ],
    limits: {
      resumeGenerations: 25,
      jobAnalyses: 50,
      templates: null,
      aiAnalyses: 50
    }
  },
  {
    id: 'PRO' as SubscriptionPlan,
    name: 'Pro',
    description: 'Best for professionals and career changers',
    price: 1999, // $19.99
    stripePriceId: 'price_pro', // This will be set to actual Stripe price ID
    features: [
      'Unlimited resume generations',
      'Unlimited job analyses',
      'All premium templates',
      'Priority support',
      'Chrome extension',
      'Advanced AI insights',
      'Custom branding'
    ],
    limits: {
      resumeGenerations: null,
      jobAnalyses: null,
      templates: null,
      aiAnalyses: null
    },
    popular: true
  },
  {
    id: 'ENTERPRISE' as SubscriptionPlan,
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: 4999, // $49.99
    stripePriceId: 'price_enterprise', // This will be set to actual Stripe price ID
    features: [
      'Everything in Pro',
      'Team management',
      'Bulk operations',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee'
    ],
    limits: {
      resumeGenerations: null,
      jobAnalyses: null,
      templates: null,
      aiAnalyses: null
    }
  }
];

export class SubscriptionService {
  /**
   * Get subscription plan details
   */
  public static getPlanDetails(plan: SubscriptionPlan): SubscriptionPlanDetails | undefined {
    return SUBSCRIPTION_PLANS.find(p => p.id === plan);
  }

  /**
   * Get all available plans
   */
  public static getAllPlans(): SubscriptionPlanDetails[] {
    return SUBSCRIPTION_PLANS;
  }

  /**
   * Create a new subscription for a user with trial period
   */
  public async createSubscription(userId: string, plan: SubscriptionPlan = 'FREE'): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.subscription) {
        throw new Error('User already has a subscription');
      }

      // Start trial period (14 days)
      const trialStart = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          plan,
          status: 'TRIAL',
          trialStart,
          trialEnd,
        }
      });

      // Initialize usage records
      await this.initializeUsageRecords(userId, subscription.id, plan);

      logger.info('Subscription created', { userId, plan, subscriptionId: subscription.id });
      return subscription;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Initialize usage records for a subscription
   */
  private async initializeUsageRecords(userId: string, subscriptionId: string, plan: SubscriptionPlan): Promise<void> {
    const planDetails = SubscriptionService.getPlanDetails(plan);
    if (!planDetails) return;

    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1);

    const usageRecords = [
      {
        userId,
        subscriptionId,
        feature: 'resume_generation',
        usage: 0,
        limit: planDetails.limits.resumeGenerations,
        resetDate
      },
      {
        userId,
        subscriptionId,
        feature: 'job_analysis',
        usage: 0,
        limit: planDetails.limits.jobAnalyses,
        resetDate
      },
      {
        userId,
        subscriptionId,
        feature: 'ai_analysis',
        usage: 0,
        limit: planDetails.limits.aiAnalyses,
        resetDate
      }
    ];

    await prisma.usageRecord.createMany({
      data: usageRecords
    });
  }

  /**
   * Create Stripe customer
   */
  public async createStripeCustomer(userId: string, email: string, name?: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId
        }
      });

      // Update subscription with Stripe customer ID
      await prisma.subscription.update({
        where: { userId },
        data: { stripeCustomerId: customer.id }
      });

      return customer.id;
    } catch (error) {
      logger.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Create checkout session
   */
  public async createCheckoutSession(
    userId: string,
    plan: SubscriptionPlan,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const planDetails = SubscriptionService.getPlanDetails(plan);
      if (!planDetails || plan === 'FREE') {
        throw new Error('Invalid plan for checkout');
      }

      let customerId = user.subscription?.stripeCustomerId;
      if (!customerId) {
        customerId = await this.createStripeCustomer(
          userId,
          user.email,
          `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined
        );
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: planDetails.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          plan
        },
        subscription_data: {
          trial_period_days: user.subscription?.status === 'TRIAL' ? 0 : 14,
          metadata: {
            userId,
            plan
          }
        }
      });

      return session.url || '';
    } catch (error) {
      logger.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  public async handlePaymentSuccess(stripeSubscriptionId: string): Promise<void> {
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const userId = stripeSubscription.metadata.userId;
      const plan = stripeSubscription.metadata.plan as SubscriptionPlan;

      if (!userId || !plan) {
        throw new Error('Missing metadata in Stripe subscription');
      }

      await prisma.subscription.update({
        where: { userId },
        data: {
          stripeSubscriptionId,
          stripePriceId: stripeSubscription.items.data[0].price.id,
          plan,
          status: 'ACTIVE',
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        }
      });

      // Update usage records with new plan limits
      await this.updateUsageRecordsForPlan(userId, plan);

      logger.info('Payment success handled', { userId, plan, stripeSubscriptionId });
    } catch (error) {
      logger.error('Error handling payment success:', error);
      throw error;
    }
  }

  /**
   * Update usage records for a new plan
   */
  private async updateUsageRecordsForPlan(userId: string, plan: SubscriptionPlan): Promise<void> {
    const planDetails = SubscriptionService.getPlanDetails(plan);
    if (!planDetails) return;

    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) return;

    // Update existing usage records with new limits
    await prisma.usageRecord.updateMany({
      where: { userId, feature: 'resume_generation' },
      data: { limit: planDetails.limits.resumeGenerations }
    });

    await prisma.usageRecord.updateMany({
      where: { userId, feature: 'job_analysis' },
      data: { limit: planDetails.limits.jobAnalyses }
    });

    await prisma.usageRecord.updateMany({
      where: { userId, feature: 'ai_analysis' },
      data: { limit: planDetails.limits.aiAnalyses }
    });
  }

  /**
   * Check if user can use a feature
   */
  public async canUseFeature(userId: string, feature: string): Promise<{ allowed: boolean; remaining?: number }> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: {
          usageRecords: {
            where: { feature }
          }
        }
      });

      if (!subscription) {
        return { allowed: false };
      }

      // If in trial period, allow usage
      if (subscription.status === 'TRIAL' && subscription.trialEnd && subscription.trialEnd > new Date()) {
        return { allowed: true };
      }

      // If subscription is not active, deny usage
      if (subscription.status !== 'ACTIVE') {
        return { allowed: false };
      }

      const usageRecord = subscription.usageRecords[0];
      if (!usageRecord) {
        return { allowed: false };
      }

      // If no limit (unlimited), allow usage
      if (usageRecord.limit === null) {
        return { allowed: true };
      }

      // Check if under limit
      const remaining = usageRecord.limit - usageRecord.usage;
      return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining)
      };
    } catch (error) {
      logger.error('Error checking feature usage:', error);
      return { allowed: false };
    }
  }

  /**
   * Record feature usage
   */
  public async recordUsage(userId: string, feature: string): Promise<void> {
    try {
      await prisma.usageRecord.updateMany({
        where: { userId, feature },
        data: {
          usage: {
            increment: 1
          }
        }
      });

      logger.debug('Usage recorded', { userId, feature });
    } catch (error) {
      logger.error('Error recording usage:', error);
      throw error;
    }
  }

  /**
   * Get user's subscription details
   */
  public async getUserSubscription(userId: string): Promise<any> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: {
          usageRecords: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });

      if (!subscription) {
        return null;
      }

      const planDetails = SubscriptionService.getPlanDetails(subscription.plan);
      
      return {
        ...subscription,
        planDetails,
        isTrialActive: subscription.status === 'TRIAL' && 
                      subscription.trialEnd && 
                      subscription.trialEnd > new Date(),
        daysLeftInTrial: subscription.trialEnd ? 
                        Math.max(0, Math.ceil((subscription.trialEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) :
                        0
      };
    } catch (error) {
      logger.error('Error getting user subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  public async cancelSubscription(userId: string, immediate: boolean = false): Promise<void> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      if (subscription.stripeSubscriptionId) {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: !immediate
        });

        if (immediate) {
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        }
      }

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: immediate ? 'CANCELED' : 'ACTIVE',
          cancelAtPeriodEnd: !immediate,
          canceledAt: immediate ? new Date() : null
        }
      });

      logger.info('Subscription canceled', { userId, immediate });
    } catch (error) {
      logger.error('Error canceling subscription:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
