import React, { useState } from 'react'
import {
  FiBriefcase,
  FiChevronDown,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiTarget,
  FiUser,
  FiVideo,
  FiX
} from 'react-icons/fi'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ThemeToggle } from './ThemeToggle'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome, color: 'text-primary-600' },
    { name: 'Profile', href: '/profile', icon: FiUser, color: 'text-purple-600' },
    { name: 'Career Development', href: '/career-development', icon: FiTarget, color: 'text-green-600' },
    { name: 'Salary Negotiation', href: '/salary-negotiation', icon: FiDollarSign, color: 'text-emerald-600' },
    { name: 'Interview Simulator', href: '/interview-simulator', icon: FiVideo, color: 'text-purple-600' },
    { name: 'Resume Builder', href: '/resume/builder', icon: FiFileText, color: 'text-success-600' },
    { name: 'My Resumes', href: '/resume', icon: FiFileText, color: 'text-warning-600' },
    { name: 'Job Analysis', href: '/jobs', icon: FiBriefcase, color: 'text-secondary-600' },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActivePath = (path: string) => {
    // Exact match first
    if (location.pathname === path) {
      return true
    }

    // Special handling for specific routes to avoid conflicts
    if (path === '/resume' && location.pathname.startsWith('/resume/')) {
      // Only match /resume for exact /resume path, not /resume/builder or other sub-paths
      return location.pathname === '/resume'
    }

    if (path === '/resume/builder') {
      // Match /resume/builder and any sub-paths of the builder
      return location.pathname === '/resume/builder' || location.pathname.startsWith('/resume/builder/')
    }

    // For other paths, allow sub-path matching
    if (path !== '/' && location.pathname.startsWith(path + '/')) {
      return true
    }

    return false
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col min-h-screen">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-12 px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              JobbyAI
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              return (
                <RouterLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 border-r-2 border-primary-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className={`mr-2 h-4 w-4 ${item.color}`} />
                  {item.name}
                </RouterLink>
              )
            })}
          </nav>

          {/* User section - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <FiUser className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-2 flex-1 text-left">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Account
                  </p>
                </div>
                <FiChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <RouterLink
                      to="/subscription"
                      className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        setIsSidebarOpen(false)
                      }}
                    >
                      <FiCreditCard className="mr-2 h-3 w-3" />
                      Subscription
                    </RouterLink>
                    <RouterLink
                      to="/settings"
                      className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        setIsSidebarOpen(false)
                      }}
                    >
                      <FiSettings className="mr-2 h-3 w-3" />
                      Settings
                    </RouterLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="mr-2 h-3 w-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1">
        {/* Mobile header */}
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              JobbyAI
            </h1>
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop header with theme toggle */}
        <header className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="p-4">
          {children}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Click outside handler for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
