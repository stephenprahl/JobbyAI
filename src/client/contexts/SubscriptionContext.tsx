import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  limits: {
    resumeGenerations: number | null
    jobAnalyses: number | null
    templates: number | null
    aiAnalyses: number | null
  }
  popular?: boolean
}

interface UsageRecord {
  feature: string
  usage: number
  limit: number | null
  remaining?: number
}

interface Subscription {
  id: string
  plan: string
  status: string
  trialEnd?: string
  currentPeriodEnd?: string
  isTrialActive: boolean
  daysLeftInTrial: number
  planDetails: SubscriptionPlan
  usageRecords: UsageRecord[]
}

interface SubscriptionContextType {
  subscription: Subscription | null
  loading: boolean
  error: string | null
  refreshSubscription: () => Promise<void>
  checkFeatureUsage: (feature: string) => Promise<{ allowed: boolean; remaining?: number }>
  getResumeUsage: () => { used: number; limit: number | null; remaining: number }
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    if (!user || !token) {
      setSubscription(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setSubscription(data.data)
      } else {
        setError(data.error || 'Failed to fetch subscription')
      }
    } catch (err) {
      setError('Failed to fetch subscription data')
      console.error('Error fetching subscription:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkFeatureUsage = async (feature: string) => {
    if (!user || !token) {
      return { allowed: false }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/usage/${feature}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      return data.success ? data.data : { allowed: false }
    } catch (err) {
      console.error('Error checking feature usage:', err)
      return { allowed: false }
    }
  }

  const getResumeUsage = () => {
    if (!subscription) {
      return { used: 0, limit: 1, remaining: 1 } // Default to free plan limits
    }

    const resumeRecord = subscription.usageRecords.find(record => record.feature === 'resume_generation')
    if (!resumeRecord) {
      // Default values for free plan
      return { used: 0, limit: 1, remaining: 1 }
    }

    const used = resumeRecord.usage
    const limit = resumeRecord.limit
    const remaining = limit === null ? Infinity : Math.max(0, limit - used)

    return { used, limit, remaining }
  }

  useEffect(() => {
    fetchSubscription()
  }, [user, token])

  const refreshSubscription = fetchSubscription

  const value: SubscriptionContextType = {
    subscription,
    loading,
    error,
    refreshSubscription,
    checkFeatureUsage,
    getResumeUsage,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}
