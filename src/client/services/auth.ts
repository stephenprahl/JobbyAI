import axios, { AxiosResponse } from 'axios'
import { ApiResponse, AuthTokens, LoginRequest, RegisterRequest, User } from '../types'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set auth token
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Remove auth token
export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization']
}

// Auth API calls
export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthTokens>> => {
  const response: AxiosResponse<ApiResponse<AuthTokens>> = await api.post('/auth/login', credentials)
  return response.data
}

export const register = async (data: RegisterRequest): Promise<ApiResponse<AuthTokens>> => {
  const response: AxiosResponse<ApiResponse<AuthTokens>> = await api.post('/auth/register', data)
  return response.data
}

export const getCurrentUser = async (): Promise<User> => {
  const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get user')
  }
  return response.data.data
}

export const refreshToken = async (token: string): Promise<ApiResponse<AuthTokens>> => {
  const response: AxiosResponse<ApiResponse<AuthTokens>> = await api.post('/auth/refresh', {
    refreshToken: token,
  })
  return response.data
}

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await api.post('/auth/forgot-password', { email })
  return response.data
}

export const resetPassword = async (token: string, password: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await api.post('/auth/reset-password', {
    token,
    password,
  })
  return response.data
}

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - only clear auth state, don't force redirect
      removeAuthToken()
      localStorage.removeItem('auth_tokens')
      // Let the components handle the redirect based on their own logic
      // Don't force navigation here as it can cause unwanted redirects
    }
    return Promise.reject(error)
  }
)

export default api
