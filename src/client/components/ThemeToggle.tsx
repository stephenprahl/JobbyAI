import React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = true
}) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600
        text-gray-700 dark:text-gray-300 transition-all duration-200
        focus:ring-2 focus:ring-primary-500/50 focus:outline-none
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <FiSun className="w-4 h-4" />
      ) : (
        <FiMoon className="w-4 h-4" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? 'Light' : 'Dark'} Mode
        </span>
      )}
    </button>
  )
}

export default ThemeToggle
