import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiCheck, 
  FiX, 
  FiStar, 
  FiZap, 
  FiShield, 
  FiAward,
  FiCreditCard,
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiHeart
} from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  limits: {
    resumeGenerations: number | null;
    jobAnalyses: number | null;
    templates: number | null;
    aiAnalyses: number | null;
  };
  popular?: boolean;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  trialEnd?: string;
  currentPeriodEnd?: string;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  planDetails: Plan;
  usageRecords: Array<{
    feature: string;
    usage: number;
    limit: number | null;
  }>;
}

export default function SubscriptionPage() {
  const { user, token } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/plans`);
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/current`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setSubscription(data.data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user || planId === 'FREE') return;

    setProcessingPlan(planId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planId,
          successUrl: `${window.location.origin}/subscription?success=true`,
          cancelUrl: `${window.location.origin}/subscription?canceled=true`
        })
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.data.checkoutUrl;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error starting checkout. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancelSubscription = async (immediate: boolean = false) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ immediate })
      });

      const data = await response.json();
      if (data.success) {
        setShowCancelModal(false);
        fetchSubscription(); // Refresh subscription data
        alert(immediate ? 'Subscription canceled immediately.' : 'Subscription will cancel at the end of the current period.');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Error canceling subscription. Please try again.');
    }
  };

  const formatUsage = (usage: number, limit: number | null) => {
    if (limit === null) return `${usage} / Unlimited`;
    return `${usage} / ${limit}`;
  };

  const getUsagePercentage = (usage: number, limit: number | null) => {
    if (limit === null) return 0;
    return Math.min((usage / limit) * 100, 100);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'FREE': return <FiHeart className="w-6 h-6" />;
      case 'BASIC': return <FiZap className="w-6 h-6" />;
      case 'PRO': return <FiStar className="w-6 h-6" />;
      case 'ENTERPRISE': return <FiCrown className="w-6 h-6" />;
      default: return <FiShield className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'FREE': return 'from-gray-500 to-gray-600';
      case 'BASIC': return 'from-blue-500 to-blue-600';
      case 'PRO': return 'from-purple-500 to-purple-600';
      case 'ENTERPRISE': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Unlock the full power of AI-driven resume creation and job analysis. Start with a free trial and upgrade when you're ready.
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">
                    Current Plan: {subscription.planDetails.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {subscription.isTrialActive
                      ? `${subscription.daysLeftInTrial} days left in trial`
                      : `Active until ${new Date(subscription.currentPeriodEnd!).toLocaleDateString()}`
                    }
                  </p>
                </div>
                <div className={`bg-gradient-to-r ${getPlanColor(subscription.plan)} p-3 rounded-xl text-white`}>
                  {getPlanIcon(subscription.plan)}
                </div>
              </div>

              {/* Usage Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {subscription.usageRecords.map((record) => (
                  <div key={record.feature} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                        {record.feature.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatUsage(record.usage, record.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getUsagePercentage(record.usage, record.limit)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel Subscription */}
              {subscription.plan !== 'FREE' && subscription.status === 'ACTIVE' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = subscription?.plan === plan.id;
            const canUpgrade = !subscription || (subscription.plan === 'FREE' && plan.id !== 'FREE');

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular
                    ? 'border-purple-500 dark:border-purple-400'
                    : 'border-gray-200 dark:border-gray-700'
                } ${isCurrentPlan ? 'ring-4 ring-primary-500/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Current
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${getPlanColor(plan.id)} rounded-2xl text-white mb-4`}>
                      {getPlanIcon(plan.id)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-black text-gray-950 dark:text-white">
                        ${plan.price === 0 ? '0' : (plan.price / 100).toFixed(0)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">
                        {plan.price === 0 ? '' : '/month'}
                      </span>
                    </div>
                    {plan.id === 'FREE' && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-2">
                        14-day trial included
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || processingPlan === plan.id || !canUpgrade}
                    className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl'
                    } ${processingPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {processingPlan === plan.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.id === 'FREE' ? (
                      'Start Free Trial'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-950 dark:text-white mb-4">
              Why Choose Resume Plan AI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of professionals who have transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI analyzes job postings and tailors your resume for maximum impact and ATS compatibility.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">
                Professional Templates
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from 24+ professionally designed templates across 9 categories to match your industry and style.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">
                Privacy & Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your data is encrypted and secure. We never share your information with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-950 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can cancel your subscription at any time. You'll continue to have access to your plan features until the end of your current billing period.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">
                What happens after my free trial ends?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                After your 14-day free trial, you'll be automatically moved to the Free plan with limited features. You can upgrade to a paid plan at any time to unlock additional features.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiX className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">
                  Cancel Subscription?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to cancel your subscription? You'll lose access to premium features.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Keep Plan
                  </button>
                  <button
                    onClick={() => handleCancelSubscription(false)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Cancel at Period End
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
