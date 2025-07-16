import React, { useState } from 'react'
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi'
import { FormInput } from './FormInput'

interface PasswordInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  touched?: boolean
  placeholder?: string
  autoComplete?: string
  showStrengthIndicator?: boolean
  required?: boolean
  className?: string
  id?: string
}

interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
}

export const EnhancedPasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  touched,
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
  showStrengthIndicator = false,
  required = false,
  className = '',
  id
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, label: '', color: '', suggestions: [] })

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

  React.useEffect(() => {
    if (showStrengthIndicator && value) {
      setStrength(calculatePasswordStrength(value))
    }
  }, [value, showStrengthIndicator])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const passwordMatchesConfirm = name === 'confirmPassword' && value && touched && !error

  return (
    <div className="space-y-2">
      <FormInput
        id={id}
        label={label}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        error={error}
        touched={touched}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        leftIcon={<FiLock />}
        rightIcon={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        }
        showValidation={!showStrengthIndicator}
        className={className}
      />

      {/* Password Match Indicator for Confirm Password */}
      {passwordMatchesConfirm && (
        <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Passwords match</span>
        </div>
      )}

      {/* Password Strength Indicator */}
      {showStrengthIndicator && value && touched && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Password strength:</span>
            <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-out ${strength.score < 30 ? 'bg-red-500' :
                  strength.score < 60 ? 'bg-yellow-500' :
                    strength.score < 80 ? 'bg-blue-500' : 'bg-green-500'
                }`}
              style={{ width: `${Math.max(strength.score, 5)}%` }}
            />
          </div>

          {strength.suggestions.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                To strengthen your password:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {strength.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
