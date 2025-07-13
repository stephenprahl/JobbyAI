import { useEffect, useState } from 'react';
import {
  FiAward,
  FiCheck,
  FiCreditCard,
  FiHeart,
  FiPlus,
  FiShield,
  FiStar,
  FiTrash2,
  FiX,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

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

interface PaymentMethod {
  id: string;
  type: string;
  cardLast4: string;
  cardBrand: string;
  cardExpMonth: number;
  cardExpYear: number;
  cardHolderName?: string;
  billingAddress?: any;
  isDefault: boolean;
  createdAt: string;
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

interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  holderName?: string;
}

interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function SubscriptionPage() {
  const { user, token } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Payment form state
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expMonth: 1,
    expYear: new Date().getFullYear(),
    cvc: '',
    holderName: ''
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchSubscription();
      fetchPaymentMethods();
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

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/payment-methods`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleUpgradeWithExistingPayment = async (planId: string, paymentMethodId: string) => {
    if (!user) return;

    setProcessingPlan(planId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planId,
          paymentMethodId
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowPaymentModal(false);
        fetchSubscription();
        alert('Subscription upgraded successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Error upgrading subscription. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleUpgradeWithNewPayment = async (planId: string) => {
    if (!user) return;

    setProcessingPlan(planId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planId,
          paymentDetails: {
            card: cardDetails,
            billingAddress
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowPaymentModal(false);
        fetchSubscription();
        fetchPaymentMethods();
        alert('Subscription upgraded successfully!');
        // Reset form
        setCardDetails({
          number: '',
          expMonth: 1,
          expYear: new Date().getFullYear(),
          cvc: '',
          holderName: ''
        });
        setBillingAddress({
          line1: '',
          line2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Error upgrading subscription. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleUpgrade = (planId: string) => {
    if (!user || planId === 'FREE') return;

    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handleAddPaymentMethod = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          card: cardDetails,
          billingAddress,
          setAsDefault: paymentMethods.length === 0 // Set as default if it's the first payment method
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowAddPaymentModal(false);
        fetchPaymentMethods();
        alert('Payment method added successfully!');
        // Reset form
        setCardDetails({
          number: '',
          expMonth: 1,
          expYear: new Date().getFullYear(),
          cvc: '',
          holderName: ''
        });
        setBillingAddress({
          line1: '',
          line2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Error adding payment method. Please try again.');
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchPaymentMethods();
        alert('Payment method deleted successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert('Error deleting payment method. Please try again.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/payment-methods/${paymentMethodId}/default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchPaymentMethods();
        alert('Default payment method updated!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      alert('Error updating default payment method. Please try again.');
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
        fetchSubscription();
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
      case 'ENTERPRISE': return <FiAward className="w-6 h-6" />;
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const iconClass = "w-8 h-8";
    switch (brand.toLowerCase()) {
      case 'visa':
        return <div className={`${iconClass} bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold`}>VISA</div>;
      case 'mastercard':
        return <div className={`${iconClass} bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold`}>MC</div>;
      case 'amex':
        return <div className={`${iconClass} bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold`}>AMEX</div>;
      case 'discover':
        return <div className={`${iconClass} bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold`}>DISC</div>;
      default:
        return <FiCreditCard className={iconClass} />;
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
                      : subscription.currentPeriodEnd
                        ? `Active until ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                        : 'Active'
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

        {/* Payment Methods Section */}
        {user && (
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                  Payment Methods
                </h2>
                <button
                  onClick={() => setShowAddPaymentModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Payment Method</span>
                </button>
              </div>

              {paymentMethods.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                  No payment methods added yet. Add one to upgrade your subscription.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-xl p-4 ${method.isDefault
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getCardBrandIcon(method.cardBrand)}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              •••• •••• •••• {method.cardLast4}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Expires {method.cardExpMonth.toString().padStart(2, '0')}/{method.cardExpYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                              Default
                            </span>
                          )}
                          <button
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {method.cardHolderName && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {method.cardHolderName}
                        </p>
                      )}
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPaymentMethod(method.id)}
                          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
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
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${plan.popular
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
                    className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 ${isCurrentPlan
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
                <FiZap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant insights on job compatibility and resume optimization using advanced AI technology.
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

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-950 dark:text-white">
                  Upgrade to {plans.find(p => p.id === selectedPlan)?.name}
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Existing Payment Methods */}
              {paymentMethods.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-950 dark:text-white mb-4">
                    Use Existing Payment Method
                  </h4>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getCardBrandIcon(method.cardBrand)}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              •••• •••• •••• {method.cardLast4}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Expires {method.cardExpMonth.toString().padStart(2, '0')}/{method.cardExpYear}
                            </p>
                          </div>
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleUpgradeWithExistingPayment(selectedPlan, method.id)}
                          disabled={processingPlan !== null}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                          {processingPlan === selectedPlan ? 'Processing...' : 'Use This Card'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-600 dark:text-gray-300">or</p>
                  </div>
                </div>
              )}

              {/* New Payment Method Form */}
              <div>
                <h4 className="text-lg font-semibold text-gray-950 dark:text-white mb-4">
                  {paymentMethods.length > 0 ? 'Add New Payment Method' : 'Payment Information'}
                </h4>

                {/* Card Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        number: formatCardNumber(e.target.value)
                      })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exp. Month
                      </label>
                      <select
                        value={cardDetails.expMonth}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          expMonth: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exp. Year
                      </label>
                      <select
                        value={cardDetails.expYear}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          expYear: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                        })}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardDetails.holderName}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        holderName: e.target.value
                      })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4 mb-6">
                  <h5 className="text-md font-semibold text-gray-950 dark:text-white">
                    Billing Address
                  </h5>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={billingAddress.line1}
                      onChange={(e) => setBillingAddress({
                        ...billingAddress,
                        line1: e.target.value
                      })}
                      placeholder="123 Main St"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={billingAddress.line2}
                      onChange={(e) => setBillingAddress({
                        ...billingAddress,
                        line2: e.target.value
                      })}
                      placeholder="Apt 4B"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({
                          ...billingAddress,
                          city: e.target.value
                        })}
                        placeholder="New York"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({
                          ...billingAddress,
                          state: e.target.value
                        })}
                        placeholder="NY"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={billingAddress.postalCode}
                        onChange={(e) => setBillingAddress({
                          ...billingAddress,
                          postalCode: e.target.value
                        })}
                        placeholder="10001"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <select
                        value={billingAddress.country}
                        onChange={(e) => setBillingAddress({
                          ...billingAddress,
                          country: e.target.value
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpgradeWithNewPayment(selectedPlan)}
                    disabled={processingPlan !== null || !cardDetails.number || !cardDetails.cvc || !billingAddress.line1}
                    className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {processingPlan === selectedPlan ? 'Processing...' : `Upgrade for $${(plans.find(p => p.id === selectedPlan)?.price || 0) / 100}/month`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddPaymentModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-950 dark:text-white">
                  Add Payment Method
                </h3>
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Card Details Form - Same as in payment modal */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      number: formatCardNumber(e.target.value)
                    })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exp. Month
                    </label>
                    <select
                      value={cardDetails.expMonth}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        expMonth: parseInt(e.target.value)
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exp. Year
                    </label>
                    <select
                      value={cardDetails.expYear}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        expYear: parseInt(e.target.value)
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                      })}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.holderName}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      holderName: e.target.value
                    })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPaymentMethod}
                  disabled={!cardDetails.number || !cardDetails.cvc}
                  className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
