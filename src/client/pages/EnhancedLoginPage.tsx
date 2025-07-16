import React, { useEffect, useState } from 'react'
import { FiChevronRight, FiMail, FiShield, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons'
import { FormButton } from '../components/forms/FormButton'
import { FormInput } from '../components/forms/FormInput'
import { PasswordInput } from '../components/forms/PasswordInput'
import { useAuth } from '../contexts/AuthContext'
import { clearCredentials, isRememberMeEnabled, loadCredentials, saveCredentials } from '../utils/encryption'

interface EnhancedLoginPageProps {
  mode?: 'login' | 'register'
}

interface ValidationErrors {
  [key: string]: string
}

interface FormData {
  email: string
  password: string
  firstName: string
  lastName: string
  confirmPassword: string
}

const EnhancedLoginPage: React.FC<EnhancedLoginPageProps> = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [formData, setFormData] = useState<FormData>(() => {
    const savedCredentials = loadCredentials()
    return {
      email: savedCredentials?.email || '',
      password: savedCredentials?.password || '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    }
  })
  const [rememberMe, setRememberMe] = useState(() => isRememberMeEnabled())
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  // Clear form errors when credentials are auto-filled
  useEffect(() => {
    if (isLogin && formData.email && formData.password && rememberMe) {
      setErrors({})
    }
  }, [isLogin, formData.email, formData.password, rememberMe])

  const areCredentialsAutoFilled = isLogin && rememberMe && loadCredentials() &&
    formData.email === loadCredentials()?.email

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setTouchedFields(prev => new Set([...prev, name]))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Email validation
    if (!formData.email.trim()) {
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
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters'
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters'
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

    // Mark all fields as touched
    const allFields = isLogin ? ['email', 'password'] : ['email', 'password', 'firstName', 'lastName', 'confirmPassword']
    setTouchedFields(new Set(allFields))

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password })

        // Handle remember me functionality
        if (rememberMe) {
          saveCredentials(formData.email, formData.password)
        } else {
          clearCredentials()
        }
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim()
        })
      }
    } catch (error) {
      console.error('Authentication error:', error)
      if (isLogin) {
        clearCredentials()
      }
      setErrors({
        submit: error instanceof Error ? error.message : 'Authentication failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setTouchedFields(new Set())

    if (!isLogin) {
      // Switching to login mode
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
      // Switching to register mode
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

  const handleSocialLogin = (provider: 'google' | 'github') => {
    console.log(`Social login with ${provider}`)
    // TODO: Implement social login
  }

  return (
    <AuthLayout
      title={isLogin ? 'Welcome back!' : 'Create your account'}
      subtitle={isLogin
        ? 'Sign in to access your personalized career dashboard and continue building your future.'
        : 'Join thousands of professionals who have accelerated their careers with JobbyAI.'}
      showFeatures={true}
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="text-center">
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

        {/* Social Login */}
        <SocialLoginButtons
          onGoogleLogin={() => handleSocialLogin('google')}
          onGithubLogin={() => handleSocialLogin('github')}
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name Fields (Registration only) */}
          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                id="firstName"
                name="firstName"
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                touched={touchedFields.has('firstName')}
                placeholder="Enter your first name"
                leftIcon={<FiUser />}
                required
              />
              <FormInput
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                touched={touchedFields.has('lastName')}
                placeholder="Enter your last name"
                leftIcon={<FiUser />}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <FormInput
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            touched={touchedFields.has('email')}
            placeholder="Enter your email address"
            leftIcon={<FiMail />}
            autoComplete="email"
            required
            className={areCredentialsAutoFilled ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}
          />

          {/* Credentials Auto-filled Indicator */}
          {areCredentialsAutoFilled && !errors.email && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <FiShield className="h-4 w-4" />
              <span>Credentials restored from previous login</span>
            </div>
          )}

          {/* Password Field */}
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            touched={touchedFields.has('password')}
            placeholder="Enter your password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            showStrengthIndicator={!isLogin}
            required
          />

          {/* Confirm Password (Registration only) */}
          {!isLogin && (
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              touched={touchedFields.has('confirmPassword')}
              placeholder="Confirm your password"
              autoComplete="new-password"
              showStrengthIndicator={false}
              required
            />
          )}

          {/* Remember Me (Login only) */}
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
                    if (!checked) {
                      clearCredentials()
                    }
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  Remember me
                  {rememberMe && loadCredentials() && (
                    <span className="ml-1 text-xs text-primary-600 dark:text-primary-400">
                      (credentials saved)
                    </span>
                  )}
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <FormButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            loadingText={isLogin ? 'Signing in...' : 'Creating account...'}
            fullWidth
            rightIcon={!isLoading && <FiChevronRight />}
          >
            {isLogin ? 'Sign in to JobbyAI' : 'Create your account'}
          </FormButton>
        </form>

        {/* Terms and Privacy (Registration only) */}
        {!isLogin && (
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default EnhancedLoginPage
