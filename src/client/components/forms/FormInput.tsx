import React, { forwardRef } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  touched?: boolean
  showValidation?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helpText?: string
  required?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({
    label,
    error,
    touched,
    showValidation = true,
    leftIcon,
    rightIcon,
    helpText,
    required,
    className = '',
    ...props
  }, ref) => {
    const hasError = error && touched
    const isValid = !error && touched && props.value

    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-bold text-gray-900 dark:text-gray-100">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-600 dark:text-gray-300">
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
              ${isValid && showValidation ? 'border-green-500' : ''}
              ${className}
            `}
            {...props}
          />

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
        </div>

        {hasError && (
          <p className="text-sm text-red-600 font-medium flex items-start">
            <FiX className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            {error}
          </p>
        )}

        {helpText && !hasError && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
