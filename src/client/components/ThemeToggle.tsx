import React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-300 ease-in-out group border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300/80 dark:hover:border-gray-500/80 active:scale-95 shadow-sm hover:shadow-md"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun Icon */}
        <div className={`absolute inset-0 transform transition-all duration-500 ease-in-out ${isDark
            ? 'rotate-180 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
          }`}>
          <FiSun className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-200" />
        </div>

        {/* Moon Icon */}
        <div className={`absolute inset-0 transform transition-all duration-500 ease-in-out ${isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-180 scale-0 opacity-0'
          }`}>
          <FiMoon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200" />
        </div>
      </div>

      {/* Subtle indicator dot */}
      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-300 ${isDark
          ? 'bg-blue-500 shadow-blue-500/50'
          : 'bg-amber-500 shadow-amber-500/50'
        } shadow-lg opacity-0 group-hover:opacity-100`} />
    </button>
  )
}
