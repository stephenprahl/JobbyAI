import React, { useEffect, useState } from 'react'
import { FiBriefcase, FiChevronRight, FiEye, FiEyeOff, FiLock, FiMail, FiShield, FiStar, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { clearCredentials, isRememberMeEnabled, loadCredentials, saveCredentials } from '../utils/encryption'

interface LoginPageTailwindProps {
  mode?: 'login' | 'register'
}

interface ValidationErrors {
  [key: string]: string
}

interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
}

const LoginPageTailwind: React.FC<LoginPageTailwindProps> = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState(() => {
    // Load saved credentials if "remember me" was checked
    const savedCredentials = loadCredentials()

    return {
      email: savedCredentials?.email || '',
      password: savedCredentials?.password || '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    }
  })
  const [rememberMe, setRememberMe] = useState(() => {
    // Check if remember me was previously enabled
    return isRememberMeEnabled()
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, label: '', color: '', suggestions: [] })
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const { login, register } = useAuth()
  const navigate = useNavigate()

  // Clear any form errors when credentials are auto-filled
  useEffect(() => {
    if (isLogin && formData.email && formData.password && rememberMe) {
      setErrors({})
    }
  }, [isLogin, formData.email, formData.password, rememberMe])

  // Show a subtle indication when credentials are auto-filled
  const areCredentialsAutoFilled = isLogin && rememberMe && loadCredentials() &&
    formData.email === loadCredentials()?.email

  // Password strength checker
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const suggestions: string[] = []

    if (password.length === 0) {
      return { score: 0, label: '', color: '', suggestions: [] }
    }

    if (password.length < 8) {
      suggestions.push('Use at least 8 characters')
    } else {
      score += 25
    }

    if (!/[a-z]/.test(password)) {
      suggestions.push('Include lowercase letters')
    } else {
      score += 15
    }

    if (!/[A-Z]/.test(password)) {
      suggestions.push('Include uppercase letters')
    } else {
      score += 15
    }

    if (!/[0-9]/.test(password)) {
      suggestions.push('Include numbers')
    } else {
      score += 15
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      suggestions.push('Include special characters')
    } else {
      score += 20
    }

    if (password.length >= 12) {
      score += 10
    }

    let label = ''
    let color = ''

    if (score < 30) {
      label = 'Weak'
      color = 'text-red-600'
    } else if (score < 60) {
      label = 'Fair'
      color = 'text-yellow-600'
    } else if (score < 80) {
      label = 'Good'
      color = 'text-blue-600'
    } else {
      label = 'Strong'
      color = 'text-green-600'
    }

    return { score, label, color, suggestions }
  }

  // Update password strength when password changes
  useEffect(() => {
    if (!isLogin && formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password))
    }
  }, [formData.password, isLogin])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, name]))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: ValidationErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      // Check password strength for registration
      const strength = calculatePasswordStrength(formData.password)
      if (strength.score < 30) {
        newErrors.password = 'Password is too weak. Please choose a stronger password.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({}) // Clear any previous errors

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password })

        // Handle remember me functionality after successful login
        if (rememberMe) {
          // Store credentials securely
          saveCredentials(formData.email, formData.password)
        } else {
          // Clear stored credentials if remember me is unchecked
          clearCredentials()
        }

        // Navigation will be handled by the auth context and route protection
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        })
        // Navigation will be handled by the auth context and route protection
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // If login fails, don't save credentials regardless of remember me state
      if (isLogin) {
        clearCredentials()
      }
      setErrors({ submit: error instanceof Error ? error.message : 'Authentication failed. Please check your credentials and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setTouchedFields(new Set())

    if (!isLogin) {
      // Switching to login mode - restore saved credentials if available
      const savedCredentials = loadCredentials()

      setFormData({
        email: savedCredentials?.email || '',
        password: savedCredentials?.password || '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
      })
      setRememberMe(isRememberMeEnabled())
    } else {
      // Switching to register mode - clear form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
      })
      setRememberMe(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen">
        {/* Left Panel - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-blue-600 opacity-90"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <FiBriefcase className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold">JobbyAI</h1>
              </div>
              <p className="text-blue-100 mt-2 text-lg">Professional Career Platform</p>
            </div>

            {/* Features */}
            <div className="space-y-8 mb-12">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <FiTrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI-Powered Career Growth</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Leverage artificial intelligence to optimize your resume, prepare for interviews, and accelerate your career advancement.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <FiShield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Enterprise-Grade Security</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Your professional data is protected with bank-level encryption and industry-leading security protocols.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <FiStar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Trusted by Professionals</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Join thousands of professionals who have successfully advanced their careers with our platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-blue-100 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-blue-100 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-blue-100 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-md mx-auto">
            {/* Back to Landing Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <FiBriefcase className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">JobbyAI</h1>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin
                  ? 'Sign in to access your professional dashboard'
                  : 'Join thousands of professionals advancing their careers'}
              </p>
            </div>

            {/* Toggle between login/signup */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  {isLogin ? 'Sign up for free' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                          }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                          }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 pr-11 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}

                  {/* Password Strength Indicator for Registration */}
                  {!isLogin && formData.password && touchedFields.has('password') && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Password strength:</span>
                        <span className={`font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.score < 30 ? 'bg-red-500' :
                            passwordStrength.score < 60 ? 'bg-yellow-500' :
                              passwordStrength.score < 80 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password for Registration */}
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-11 pr-11 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                          }`}
                        placeholder="Confirm your password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                )}

                {/* Remember Me - Only for Login */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {isLogin ? 'Sign in' : 'Create account'}
                        <FiChevronRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>
              </form>

              {/* Toggle between Login and Signup */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Privacy (Registration only) */}
          {!isLogin && (
            <div className="mt-6 text-center max-w-md mx-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPageTailwind
