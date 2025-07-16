import React, { useState } from 'react'
import { FiCheckCircle, FiChevronRight, FiMail, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { EnhancedAuthLayout } from '../components/auth/EnhancedAuthLayout'
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons'
import { EnhancedFormButton } from '../components/forms/EnhancedFormButton'
import { EnhancedFormInput } from '../components/forms/EnhancedFormInput'
import { EnhancedPasswordInput } from '../components/forms/EnhancedPasswordInput'
import { useAuth } from '../contexts/AuthContext'

interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface ValidationErrors {
  [key: string]: string
}

const EnhancedSignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setTouchedFields(prev => new Set([...prev, name]))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters'
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters'
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'agreeToTerms']
    setTouchedFields(new Set(allFields))

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim()
      })

      setShowSuccess(true)

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Registration error:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider: 'google' | 'github') => {
    console.log(`Social signup with ${provider}`)
    // TODO: Implement social signup
  }

  if (showSuccess) {
    return (
      <EnhancedAuthLayout
        title="Welcome to JobbyAI!"
        subtitle="Your account has been created successfully. Redirecting you to your dashboard..."
        showFeatures={false}
        variant="compact"
      >
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Account Created Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to JobbyAI, {formData.firstName}! We're preparing your personalized dashboard...
          </p>
          <div className="mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </EnhancedAuthLayout>
    )
  }

  return (
    <EnhancedAuthLayout
      title="Create your account"
      subtitle="Join thousands of professionals who have accelerated their careers with JobbyAI. Start building your future today."
      showFeatures={true}
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Social Signup */}
        <SocialLoginButtons
          onGoogleLogin={() => handleSocialSignup('google')}
          onGithubLogin={() => handleSocialSignup('github')}
          disabled={isLoading}
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
              Or create account with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EnhancedFormInput
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
              helpText="Your first name as it appears on official documents"
              required
            />
            <EnhancedFormInput
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
              helpText="Your last name as it appears on official documents"
              required
            />
          </div>

          {/* Email Field */}
          <EnhancedFormInput
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
            helpText="We'll use this email for account notifications and updates"
            autoComplete="email"
            required
          />

          {/* Password Field */}
          <EnhancedPasswordInput
            id="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            touched={touchedFields.has('password')}
            placeholder="Create a strong password"
            autoComplete="new-password"
            showStrengthIndicator={true}
            required
          />

          {/* Confirm Password Field */}
          <EnhancedPasswordInput
            id="confirmPassword"
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

          {/* Terms Agreement */}
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className={`mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors ${errors.agreeToTerms ? 'border-red-500' : ''
                  }`}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
                  Privacy Policy
                </a>
                {' '}and consent to receive updates and marketing communications from JobbyAI.
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 font-medium flex items-start space-x-2">
                <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.agreeToTerms}</span>
              </p>
            )}
          </div>

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
          <EnhancedFormButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            loadingText="Creating your account..."
            fullWidth
            gradient={true}
            rightIcon={!isLoading && <FiChevronRight />}
          >
            Create your JobbyAI account
          </EnhancedFormButton>
        </form>

        {/* Additional Information */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By creating an account, you'll get access to AI-powered resume building,
            job matching, and career development tools designed to accelerate your professional growth.
          </p>
        </div>
      </div>
    </EnhancedAuthLayout>
  )
}

export default EnhancedSignupPage
