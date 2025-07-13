import { SubscriptionPlan } from '@prisma/client';
import { logger } from '../utils/logger';
import prisma from './prisma.service';

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
   * Upgrade subscription plan with payment
   */
  public async upgradePlan(
    userId: string,
    newPlan: SubscriptionPlan,
    paymentMethodId?: string
  ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: true,
          paymentMethods: {
            where: { isActive: true, isDefault: true },
            take: 1
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const planDetails = SubscriptionService.getPlanDetails(newPlan);
      if (!planDetails || newPlan === 'FREE') {
        throw new Error('Invalid plan for upgrade');
      }

      // If upgrading to a paid plan, process payment
      if (planDetails.price > 0) {
        const defaultPaymentMethod = user.paymentMethods[0];
        const paymentMethod = paymentMethodId || defaultPaymentMethod?.id;

        if (!paymentMethod) {
          return {
            success: false,
            error: 'No payment method available'
          };
        }

        // Import payment service dynamically to avoid circular dependency
        const { paymentService } = await import('./payment.service');

        const paymentResult = await paymentService.processPaymentWithSavedMethod(
          userId,
          paymentMethod,
          planDetails.price,
          'usd',
          `Subscription upgrade to ${planDetails.name}`,
          user.subscription?.id
        );

        if (!paymentResult.success) {
          return {
            success: false,
            error: paymentResult.error || 'Payment failed'
          };
        }
      }

      // Update or create subscription
      let subscription;
      if (user.subscription) {
        // Update existing subscription
        subscription = await prisma.subscription.update({
          where: { userId },
          data: {
            plan: newPlan,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: this.calculatePeriodEnd(new Date()),
            cancelAtPeriodEnd: false,
            canceledAt: null
          }
        });
      } else {
        // Create new subscription
        subscription = await prisma.subscription.create({
          data: {
            userId,
            plan: newPlan,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: this.calculatePeriodEnd(new Date())
          }
        });
      }

      // Update usage records with new plan limits
      await this.updateUsageRecordsForPlan(userId, newPlan);

      logger.info('Subscription upgraded', { userId, newPlan, subscriptionId: subscription.id });

      return {
        success: true,
        subscriptionId: subscription.id
      };
    } catch (error) {
      logger.error('Error upgrading subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upgrade failed'
      };
    }
  }

  /**
   * Calculate period end date (30 days from start)
   */
  private calculatePeriodEnd(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    return endDate;
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
      const usageRecord = await prisma.usageRecord.findFirst({
        where: { userId, feature }
      });

      if (!usageRecord) {
        return { allowed: false };
      }

      // Check if usage has reset (monthly reset)
      const now = new Date();
      if (usageRecord.resetDate <= now) {
        // Reset usage
        await prisma.usageRecord.update({
          where: { id: usageRecord.id },
          data: {
            usage: 0,
            resetDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
          }
        });

        usageRecord.usage = 0;
      }

      // Check limits
      if (usageRecord.limit === null) {
        return { allowed: true }; // Unlimited
      }

      const remaining = usageRecord.limit - usageRecord.usage;
      return {
        allowed: remaining > 0,
        remaining
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

  /**
   * Process subscription renewals (to be called by a cron job)
   */
  public async processRenewals(): Promise<void> {
    try {
      const expiredSubscriptions = await prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          currentPeriodEnd: {
            lte: new Date()
          },
          cancelAtPeriodEnd: false,
          autoRenew: true
        },
        include: {
          user: {
            include: {
              paymentMethods: {
                where: { isActive: true, isDefault: true },
                take: 1
              }
            }
          }
        }
      });

      for (const subscription of expiredSubscriptions) {
        await this.renewSubscription(subscription);
      }

      logger.info(`Processed ${expiredSubscriptions.length} subscription renewals`);
    } catch (error) {
      logger.error('Error processing renewals:', error);
      throw error;
    }
  }

  /**
   * Renew a single subscription
   */
  private async renewSubscription(subscription: any): Promise<void> {
    try {
      const planDetails = SubscriptionService.getPlanDetails(subscription.plan);
      if (!planDetails || planDetails.price === 0) return;

      const defaultPaymentMethod = subscription.user.paymentMethods[0];
      if (!defaultPaymentMethod) {
        // No payment method, cancel subscription
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'CANCELED',
            canceledAt: new Date()
          }
        });
        return;
      }

      // Process renewal payment
      const { paymentService } = await import('./payment.service');
      const paymentResult = await paymentService.processPaymentWithSavedMethod(
        subscription.userId,
        defaultPaymentMethod.id,
        planDetails.price,
        'usd',
        `Subscription renewal for ${planDetails.name}`,
        subscription.id
      );

      if (paymentResult.success) {
        // Update subscription period
        const newPeriodStart = new Date();
        const newPeriodEnd = this.calculatePeriodEnd(newPeriodStart);

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            currentPeriodStart: newPeriodStart,
            currentPeriodEnd: newPeriodEnd,
            status: 'ACTIVE'
          }
        });

        logger.info('Subscription renewed successfully', {
          subscriptionId: subscription.id,
          userId: subscription.userId
        });
      } else {
        // Payment failed, mark subscription as past due
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'PAST_DUE' }
        });

        logger.warn('Subscription renewal payment failed', {
          subscriptionId: subscription.id,
          userId: subscription.userId,
          error: paymentResult.error
        });
      }
    } catch (error) {
      logger.error('Error renewing subscription:', error);
    }
  }
}

export const subscriptionService = new SubscriptionService();
