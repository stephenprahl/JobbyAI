import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiCheck, FiChevronRight, FiEye, FiEyeOff, FiLock, FiMail, FiShield, FiUser, FiX } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-purple-200/30 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary-200/30 to-primary-200/30 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <RouterLink
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-8 transition-all duration-200 font-medium group"
            >
              <FiArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </RouterLink>

            <div className="mb-8">
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-3">
                JobbyAI
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto mb-2">
              {isLogin
                ? 'Sign in to access your personalized career dashboard and continue building your future.'
                : 'Join thousands of professionals who have accelerated their careers with JobbyAI.'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={toggleMode}
                className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 hover:underline"
              >
                {isLogin ? 'Sign up for free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl blur-xl" />
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl py-8 px-6 lg:px-8 shadow-2xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60">

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {!isLogin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                        First Name
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`enhanced-input pl-10 ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                            touchedFields.has('firstName') && !errors.firstName ? 'border-green-500' : ''}`}
                          placeholder="Enter your first name"
                        />
                        {touchedFields.has('firstName') && !errors.firstName && formData.firstName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {errors.firstName && <p className="mt-1 text-sm text-red-600 font-medium">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                        Last Name
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`enhanced-input pl-10 ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                            touchedFields.has('lastName') && !errors.lastName ? 'border-green-500' : ''}`}
                          placeholder="Enter your last name"
                        />
                        {touchedFields.has('lastName') && !errors.lastName && formData.lastName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {errors.lastName && <p className="mt-1 text-sm text-red-600 font-medium">{errors.lastName}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`enhanced-input pl-10 pr-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                        touchedFields.has('email') && !errors.email && formData.email ? 'border-green-500' : ''} ${areCredentialsAutoFilled ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {touchedFields.has('email') && !errors.email && formData.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <FiCheck className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <FiX className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>}
                  {areCredentialsAutoFilled && !errors.email && (
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center">
                      <FiShield className="h-4 w-4 mr-1" />
                      Credentials restored from previous login
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`enhanced-input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                        touchedFields.has('password') && !errors.password && formData.password ? 'border-green-500' : ''} ${areCredentialsAutoFilled ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>}

                  {/* Password Strength Indicator for Registration */}
                  {!isLogin && formData.password && touchedFields.has('password') && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Password strength:</span>
                        <span className={`font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.score < 30 ? 'bg-red-500' :
                              passwordStrength.score < 60 ? 'bg-yellow-500' :
                                passwordStrength.score < 80 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                      {passwordStrength.suggestions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Suggestions:</p>
                          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            {passwordStrength.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-center">
                                <span className="mr-1">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                      Confirm Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`enhanced-input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                          touchedFields.has('confirmPassword') && !errors.confirmPassword && formData.confirmPassword ? 'border-green-500' : ''}`}
                        placeholder="Confirm your password"
                      />
                      {touchedFields.has('confirmPassword') && !errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <div className="absolute inset-y-0 right-0 pr-10 flex items-center">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>}
                    {!errors.confirmPassword && touchedFields.has('confirmPassword') && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center">
                        <FiCheck className="h-4 w-4 mr-1" />
                        Passwords match
                      </p>
                    )}
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setRememberMe(checked)

                          // If unchecking, immediately clear stored credentials
                          if (!checked) {
                            clearCredentials()
                          }
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        Remember me
                        {rememberMe && loadCredentials() && (
                          <span className="ml-1 text-xs text-primary-600 dark:text-primary-400">
                            (credentials saved)
                          </span>
                        )}
                        {rememberMe && !loadCredentials() && (
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            (will save on login)
                          </span>
                        )}
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white transition-all duration-200 transform ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed scale-95'
                        : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-95 hover:scale-105'
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {isLogin ? 'Sign in to JobbyAI' : 'Create your account'}
                        <FiChevronRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Terms and Privacy (Registration only) */}
          {!isLogin && (
            <div className="mt-6 text-center max-w-md mx-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200">
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
