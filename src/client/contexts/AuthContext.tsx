import React, { createContext, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as authService from '../services/auth'
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../shared/types/userTypes'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAutoLoggingIn: boolean
  token: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(() => {
    const storedTokens = localStorage.getItem('auth_tokens')
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens)
        // Validate token structure
        if (parsedTokens && parsedTokens.accessToken && typeof parsedTokens.accessToken === 'string') {
          return parsedTokens
        } else {
          // Clear invalid tokens
          localStorage.removeItem('auth_tokens')
          return null
        }
      } catch (error) {
        // Clear corrupted tokens
        localStorage.removeItem('auth_tokens')
        return null
      }
    }
    return null
  })

  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false)
  const queryClient = useQueryClient()

  // Query to get current user
  const {
    data: user,
    isLoading,
  } = useQuery(
    ['user'],
    () => authService.getCurrentUser(),
    {
      enabled: !!tokens?.accessToken && tokens.accessToken.length > 0,
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors (401, 403)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false
        }
        // Only retry network errors up to 2 times
        return failureCount < 2
      },
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      onError: (error: any) => {
        // Only clear tokens if it's an authentication error (401, 403)
        // Don't clear on network errors or other issues
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setTokens(null)
          localStorage.removeItem('auth_tokens')
          authService.removeAuthToken()
        }
      },
    }
  )

  // Login mutation
  const loginMutation = useMutation(
    (credentials: LoginRequest) => authService.login(credentials),
    {
      onSuccess: (response) => {
        const newTokens = response.data
        if (newTokens && newTokens.accessToken) {
          setTokens(newTokens)
          localStorage.setItem('auth_tokens', JSON.stringify(newTokens))

          // Force the auth token to be set immediately
          authService.setAuthToken(newTokens.accessToken)

          // Invalidate and refetch user query immediately
          queryClient.invalidateQueries(['user'])
        }
      },
      onError: (error: any) => {
        console.error('Login failed:', error)
        // Clear any stored tokens on login failure
        setTokens(null)
        localStorage.removeItem('auth_tokens')
        authService.removeAuthToken()
      }
    }
  )

  // Register mutation
  const registerMutation = useMutation(
    (data: RegisterRequest) => authService.register(data),
    {
      onSuccess: (response) => {
        const newTokens = response.data
        if (newTokens) {
          setTokens(newTokens)
          localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
          // Immediately invalidate and refetch user query
          queryClient.invalidateQueries(['user'])
        }
      },
    }
  )

  // Logout function
  const logout = () => {
    setTokens(null)
    localStorage.removeItem('auth_tokens')

    // Remove auth token from API service
    authService.removeAuthToken()

    // Clear remember me credentials on logout
    import('../utils/encryption').then(({ clearCredentials }) => {
      clearCredentials()
    })

    queryClient.clear()
  }

  // Refresh token function
  const refreshToken = async () => {
    if (!tokens?.refreshToken) return

    try {
      const response = await authService.refreshToken(tokens.refreshToken)
      const newTokens = response.data
      setTokens(newTokens ?? null)
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
    } catch (error) {
      logout()
    }
  }

  // Set up axios interceptor for automatic token refresh
  useEffect(() => {
    if (tokens?.accessToken) {
      authService.setAuthToken(tokens.accessToken)
    } else {
      authService.removeAuthToken()
    }
  }, [tokens])

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!tokens?.accessToken) return

    const tokenPayload = JSON.parse(atob(tokens.accessToken.split('.')[1]))
    const expiresAt = tokenPayload.exp * 1000
    const timeUntilExpiry = expiresAt - Date.now()

    // Refresh 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0)

    const refreshTimer = setTimeout(() => {
      refreshToken()
    }, refreshTime)

    return () => clearTimeout(refreshTimer)
  }, [tokens])

  // Debug effect to track authentication state changes
  useEffect(() => {
    console.log('Auth state changed:', {
      hasTokens: !!tokens?.accessToken,
      tokenLength: tokens?.accessToken?.length || 0,
      hasUser: !!user,
      isAuthenticated: !!user && !!tokens?.accessToken,
      isLoading: isLoading || loginMutation.isLoading || registerMutation.isLoading,
      tokensPreview: tokens?.accessToken ? `${tokens.accessToken.substring(0, 20)}...` : 'none'
    })
  }, [user, tokens, isLoading, loginMutation.isLoading, registerMutation.isLoading])

  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading || loginMutation.isLoading || registerMutation.isLoading,
    isAuthenticated: !!user && !!tokens?.accessToken,
    isAutoLoggingIn,
    token: tokens?.accessToken || null,
    login: async (credentials: LoginRequest) => {
      await loginMutation.mutateAsync(credentials)
    },
    register: async (data: RegisterRequest) => {
      await registerMutation.mutateAsync(data)
    },
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
