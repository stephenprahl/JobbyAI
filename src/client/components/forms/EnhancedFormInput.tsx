import React, { forwardRef, useState } from 'react'
import { FiAlertCircle, FiCheck, FiX } from 'react-icons/fi'

interface EnhancedFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  touched?: boolean
  showValidation?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helpText?: string
  required?: boolean
  variant?: 'default' | 'floating'
}

export const EnhancedFormInput = forwardRef<HTMLInputElement, EnhancedFormInputProps>(
  ({
    label,
    error,
    touched,
    showValidation = true,
    leftIcon,
    rightIcon,
    helpText,
    required,
    variant = 'default',
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const hasError = error && touched
    const isValid = !error && touched && props.value
    const hasValue = props.value && String(props.value).length > 0

    const isFloating = variant === 'floating'

    return (
      <div className="space-y-2">
        {!isFloating && (
          <label htmlFor={props.id} className="block text-sm font-bold text-gray-900 dark:text-gray-100">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={`relative ${isFloating ? 'mt-4' : ''}`}>
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <div className={`h-5 w-5 transition-colors duration-200 ${hasError ? 'text-red-500' :
                  isValid ? 'text-green-500' :
                    isFocused ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'
                }`}>
                {leftIcon}
              </div>
            </div>
          )}

          <input
            ref={ref}
            className={`
              enhanced-input
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || (showValidation && (hasError || isValid)) ? 'pr-10' : ''}
              ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${isValid && showValidation ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
              ${isFocused ? 'ring-2 ring-primary-500/20' : ''}
              ${isFloating ? 'pt-6' : ''}
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Floating label */}
          {isFloating && (
            <label
              htmlFor={props.id}
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${leftIcon ? 'left-10' : 'left-3'
                } ${isFocused || hasValue
                  ? 'top-1 text-xs font-semibold text-primary-600 dark:text-primary-400'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
                }`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {showValidation && (hasError || isValid) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {hasError ? (
                <FiX className="h-5 w-5 text-red-500" />
              ) : isValid ? (
                <FiCheck className="h-5 w-5 text-green-500" />
              ) : null}
            </div>
          )}

          {rightIcon && !showValidation && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}

          {/* Focus ring effect */}
          <div className={`absolute inset-0 rounded-lg pointer-events-none transition-all duration-200 ${isFocused ? 'ring-2 ring-primary-500/20 ring-offset-2' : ''
            }`} />
        </div>

        {hasError && (
          <div className="flex items-start space-x-2 text-sm text-red-600 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
            <FiAlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {helpText && !hasError && (
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
            <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{helpText}</span>
          </p>
        )}
      </div>
    )
  }
)

EnhancedFormInput.displayName = 'EnhancedFormInput'
