import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { clearCredentials, isRememberMeEnabled, loadCredentials, saveCredentials } from '../utils/encryption'

interface LoginPageTailwindProps {
  mode?: 'login' | 'register'
}

const LoginPageTailwind: React.FC<LoginPageTailwindProps> = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(() => {
    // Load saved credentials if "remember me" was checked
    const savedCredentials = loadCredentials()

    return {
      email: savedCredentials?.email || '',
      password: savedCredentials?.password || '',
      name: '',
      confirmPassword: ''
    }
  })
  const [rememberMe, setRememberMe] = useState(() => {
    // Check if remember me was previously enabled
    return isRememberMeEnabled()
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
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
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.name
        })
      }
      navigate('/dashboard')
    } catch (error) {
      // If login fails, don't save credentials regardless of remember me state
      if (isLogin && !rememberMe) {
        clearCredentials()
      }
      setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})

    if (!isLogin) {
      // Switching to login mode - restore saved credentials if available
      const savedCredentials = loadCredentials()

      setFormData({
        email: savedCredentials?.email || '',
        password: savedCredentials?.password || '',
        name: '',
        confirmPassword: ''
      })
      setRememberMe(isRememberMeEnabled())
    } else {
      // Switching to register mode - clear form
      setFormData({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
      })
      setRememberMe(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <RouterLink
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-6 transition-colors duration-200"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </RouterLink>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Resume Plan AI
          </h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={toggleMode}
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>                  <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${areCredentialsAutoFilled ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>}
              {areCredentialsAutoFilled && !errors.email && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
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
                </div>                  <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${areCredentialsAutoFilled ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>}
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
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>}
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
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  } transition-colors duration-200`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.219 1.037 1.037 0 .631-.402 1.572-.609 2.444-.174.731.367 1.329 1.096 1.329 1.315 0 2.326-1.387 2.326-3.392 0-1.774-1.274-3.014-3.096-3.014-2.111 0-3.35 1.585-3.35 3.221 0 .639.244 1.326.549 1.699.06.073.069.137.051.211-.056.234-.18.717-.205.817-.033.136-.107.166-.246.1-1.363-.636-2.216-2.632-2.216-4.235 0-3.456 2.509-6.631 7.235-6.631 3.798 0 6.751 2.705 6.751 6.32 0 3.772-2.379 6.805-5.68 6.805-1.109 0-2.155-.577-2.512-1.336 0 0-.55 2.095-.684 2.609-.247.95-.916 2.14-1.363 2.864 1.024.316 2.113.486 3.25.486 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPageTailwind
