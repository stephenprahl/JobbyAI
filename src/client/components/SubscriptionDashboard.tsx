import React from 'react'
import { FiBarChart, FiFileText, FiGrid, FiZap } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useSubscription } from '../contexts/SubscriptionContext'

const SubscriptionDashboard: React.FC = () => {
  const { subscription, loading } = useSubscription()

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Subscription Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please contact support if this seems like an error.
          </p>
        </div>
      </div>
    )
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'resume_generation':
        return <FiFileText className="w-5 h-5" />
      case 'job_analysis':
        return <FiBarChart className="w-5 h-5" />
      case 'templates':
        return <FiGrid className="w-5 h-5" />
      case 'ai_analysis':
        return <FiZap className="w-5 h-5" />
      default:
        return <FiZap className="w-5 h-5" />
    }
  }

  const getFeatureName = (feature: string) => {
    switch (feature) {
      case 'resume_generation':
        return 'Resume Generations'
      case 'job_analysis':
        return 'Job Analyses'
      case 'templates':
        return 'Templates'
      case 'ai_analysis':
        return 'AI Analyses'
      default:
        return feature
    }
  }

  const getUsageColor = (usage: number, limit: number | null) => {
    if (limit === null) return 'text-green-600 dark:text-green-400'
    const percentage = (usage / limit) * 100
    if (percentage >= 90) return 'text-red-600 dark:text-red-400'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'BASIC':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'PRO':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'ENTERPRISE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Plan
          </h3>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanBadgeColor(subscription.plan)}`}>
              {subscription.planDetails.name}
            </span>
          </div>
        </div>
        <Link
          to="/subscription"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Manage Plan
        </Link>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Usage This Month
        </h4>

        {subscription.usageRecords.map((record) => (
          <div key={record.feature} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${getUsageColor(record.usage, record.limit)}`}>
                {getFeatureIcon(record.feature)}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getFeatureName(record.feature)}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${getUsageColor(record.usage, record.limit)}`}>
                {record.limit === null ? (
                  `${record.usage} / Unlimited`
                ) : (
                  `${record.usage} / ${record.limit}`
                )}
              </span>
              {record.limit !== null && record.limit > 0 && (
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${(record.usage / record.limit) * 100 >= 90
                        ? 'bg-red-500'
                        : (record.usage / record.limit) * 100 >= 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    style={{
                      width: `${Math.min((record.usage / record.limit) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {subscription.plan === 'FREE' && (
        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
          <div className="text-sm">
            <p className="text-primary-800 dark:text-primary-200 font-medium mb-2">
              🚀 Ready to unlock more features?
            </p>
            <p className="text-primary-700 dark:text-primary-300 mb-3">
              Upgrade to get unlimited resumes, premium templates, and advanced AI features.
            </p>
            <Link
              to="/subscription"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm"
            >
              View Plans →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionDashboard
