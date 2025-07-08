import React, { createContext, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as authService from '../services/auth'
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
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
    return storedTokens ? JSON.parse(storedTokens) : null
  })

  const queryClient = useQueryClient()

  // Query to get current user
  const {
    data: user,
    isLoading,
  } = useQuery(
    ['user'],
    () => authService.getCurrentUser(),
    {
      enabled: !!tokens?.accessToken,
      retry: false,
      onError: () => {
        // If user query fails, clear tokens
        setTokens(null)
        localStorage.removeItem('auth_tokens')
      },
    }
  )

  // Login mutation
  const loginMutation = useMutation(
    (credentials: LoginRequest) => authService.login(credentials),
    {
      onSuccess: (response) => {
        const newTokens = response.data
        if (newTokens) {
          setTokens(newTokens ?? null)
          localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
          queryClient.invalidateQueries(['user'])
        }
      },
    }
  )

  // Register mutation
  const registerMutation = useMutation(
    (data: RegisterRequest) => authService.register(data),
    {
      onSuccess: (response) => {
        const newTokens = response.data
        if (newTokens) {
          setTokens(newTokens ?? null)
          localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
          queryClient.invalidateQueries(['user'])
        }
      },
    }
  )

  // Logout function
  const logout = () => {
    setTokens(null)
    localStorage.removeItem('auth_tokens')
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

  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading && !!tokens?.accessToken,
    isAuthenticated: !!user && !!tokens?.accessToken,
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
