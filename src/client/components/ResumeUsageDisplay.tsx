import React from 'react'
import { FiAlertCircle, FiArrowUp, FiFileText } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useSubscription } from '../contexts/SubscriptionContext'

interface ResumeUsageDisplayProps {
  showUpgradePrompt?: boolean
  className?: string
}

const ResumeUsageDisplay: React.FC<ResumeUsageDisplayProps> = ({
  showUpgradePrompt = true,
  className = ''
}) => {
  const { subscription, loading, getResumeUsage } = useSubscription()

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="w-24 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  const { used, limit, remaining } = getResumeUsage()
  const isUnlimited = limit === null
  const isNearLimit = !isUnlimited && remaining <= 1 && remaining > 0
  const isAtLimit = !isUnlimited && remaining === 0

  const getUsageColor = () => {
    if (isAtLimit) return 'text-red-600 dark:text-red-400'
    if (isNearLimit) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getUsageText = () => {
    if (isUnlimited) return `${used} resumes generated`
    return `${used} / ${limit} resumes used`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Usage Display */}
      <div className="flex items-center space-x-2">
        <FiFileText className={`w-4 h-4 ${getUsageColor()}`} />
        <span className={`text-sm font-medium ${getUsageColor()}`}>
          {getUsageText()}
        </span>
      </div>

      {/* Remaining Count */}
      {!isUnlimited && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {isAtLimit ? (
            <span className="text-red-600 dark:text-red-400">
              No resumes remaining
            </span>
          ) : (
            <span>
              {remaining} resume{remaining !== 1 ? 's' : ''} remaining
            </span>
          )}
        </div>
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (isAtLimit || isNearLimit) && subscription?.plan === 'FREE' && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <FiAlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                {isAtLimit ? 'Resume limit reached!' : 'Almost at your limit!'}
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                Upgrade to generate unlimited resumes and access premium features.
              </p>
              <Link
                to="/subscription"
                className="inline-flex items-center space-x-1 mt-2 text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 font-medium text-sm"
              >
                <FiArrowUp className="w-3 h-3" />
                <span>Upgrade Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeUsageDisplay
