import React, { useEffect, useState } from 'react'
import { FiAlertCircle, FiArrowUp, FiBarChart, FiClock, FiFileText, FiInfo, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'

interface ResumeUsageDisplayProps {
  showUpgradePrompt?: boolean
  showAnalytics?: boolean
  className?: string
}

interface UsageAnalytics {
  weeklyTrend: number[]
  dailyAverage: number
  peakDays: string[]
  projectedMonthly: number
  lastUsed: string
  resetDate: string
}

const ResumeUsageDisplay: React.FC<ResumeUsageDisplayProps> = ({
  showUpgradePrompt = true,
  showAnalytics = false,
  className = ''
}) => {
  const { subscription, loading, getResumeUsage } = useSubscription()
  const { token } = useAuth()
  const [analytics, setAnalytics] = useState<UsageAnalytics | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
    if (showDetails && !analytics && token) {
      fetchAnalytics()
    }
  }, [showDetails, token])

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/usage/resume_generation`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching usage analytics:', error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    )
  }

  const { used, limit, remaining } = getResumeUsage()
  const isUnlimited = limit === null
  const isNearLimit = !isUnlimited && remaining <= 1 && remaining > 0
  const isAtLimit = !isUnlimited && remaining === 0
  const usagePercentage = !isUnlimited ? (used / limit) * 100 : 0

  const getUsageColor = () => {
    if (isAtLimit) return 'text-red-600 dark:text-red-400'
    if (isNearLimit) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-500'
    if (usagePercentage >= 90) return 'bg-red-500'
    if (usagePercentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getUsageText = () => {
    if (isUnlimited) return `${used} resumes generated`
    return `${used} / ${limit} resumes used`
  }

  const getDaysUntilReset = () => {
    if (!analytics?.resetDate) return null
    const resetDate = new Date(analytics.resetDate)
    const today = new Date()
    const diffTime = resetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Main Usage Display */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FiFileText className={`w-5 h-5 ${getUsageColor()}`} />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Resume Generations
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {(isAtLimit || isNearLimit) && (
              <FiAlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            {showAnalytics && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-lg font-semibold ${getUsageColor()}`}>
              {getUsageText()}
            </span>
            {!isUnlimited && (
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {remaining} remaining
                </span>
                {analytics && getDaysUntilReset() && (
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                    <FiClock className="w-3 h-3 mr-1" />
                    Resets in {getDaysUntilReset()} days
                  </div>
                )}
              </div>
            )}
          </div>

          {!isUnlimited && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${Math.min(100, usagePercentage)}%` }}
              />
            </div>
          )}

          {/* Quick Analytics */}
          {analytics && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <FiTrendingUp className="w-3 h-3" />
                <span>
                  {analytics.dailyAverage.toFixed(1)} per day avg
                </span>
              </div>
              {!isUnlimited && analytics.projectedMonthly > limit && (
                <div className="flex items-center space-x-1 text-orange-500">
                  <FiBarChart className="w-3 h-3" />
                  <span>May exceed limit</span>
                </div>
              )}
            </div>
          )}

          {/* Warning Messages */}
          {isNearLimit && (
            <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400 text-xs bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
              <FiAlertCircle className="w-3 h-3" />
              <span>Running low! Consider upgrading your plan.</span>
            </div>
          )}

          {isAtLimit && (
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
              <FiAlertCircle className="w-3 h-3" />
              <span>Limit reached! Upgrade to continue generating resumes.</span>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analytics */}
      {showAnalytics && showDetails && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {loadingAnalytics ? (
            <div className="p-4 text-center">
              <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <div className="p-4 space-y-4">
              {/* Weekly Trend */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                  Weekly Usage Trend
                </h4>
                <div className="flex items-end space-x-1 h-12">
                  {analytics.weeklyTrend.map((count, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-500 rounded-t"
                        style={{
                          height: `${Math.max(2, (count / Math.max(...analytics.weeklyTrend)) * 40)}px`
                        }}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {analytics.dailyAverage.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Daily Average
                  </div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {analytics.projectedMonthly}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Projected Monthly
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  💡 Usage Insights
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  {analytics.peakDays.length > 0 && (
                    <li>• Peak usage on {analytics.peakDays.join(', ')}</li>
                  )}
                  {!isUnlimited && analytics.projectedMonthly > limit && (
                    <li>• Current trend may exceed monthly limit</li>
                  )}
                  <li>• Last used: {new Date(analytics.lastUsed).toLocaleDateString()}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Analytics not available
            </div>
          )}
        </div>
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (isAtLimit || isNearLimit) && subscription?.plan === 'FREE' && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-yellow-50 dark:bg-yellow-900/20">
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
