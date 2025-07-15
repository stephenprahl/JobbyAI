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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Default to open on desktop
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 ease-in-out hidden lg:block`}>
        <div className="flex flex-col h-screen">
          {/* Sidebar header with toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              {isSidebarOpen && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
                  JobbyAI
                </h1>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-all duration-200 group"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <div className={`transform transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`}>
                <FiChevronDown className="h-5 w-5 rotate-90" />
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              return (
                <RouterLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:shadow-md'
                    }`}
                  onClick={() => setIsSidebarOpen(true)} // Keep open on navigation
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${isActive
                    ? 'bg-white/20'
                    : 'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50'
                    } transition-all duration-200`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color} transition-all duration-200`} />
                  </div>
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium tracking-wide">{item.name}</span>
                  )}
                  {isActive && isSidebarOpen && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80" />
                  )}
                </RouterLink>
              )
            })}
          </nav>

          {/* User section - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 p-3 bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 group backdrop-blur-sm"
                title={!isSidebarOpen ? user?.email : undefined}
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                {isSidebarOpen && (
                  <>
                    <div className="ml-3 flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate tracking-wide">
                        {user?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Premium Account
                      </p>
                    </div>
                    <FiChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </>
                )}
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && isSidebarOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 z-50 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="py-2">
                    <RouterLink
                      to="/subscription"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsUserMenuOpen(false)
                      }}
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-3">
                        <FiCreditCard className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                      </div>
                      Subscription
                    </RouterLink>
                    <RouterLink
                      to="/settings"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsUserMenuOpen(false)
                      }}
                    >
                      <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <FiSettings className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      </div>
                      Settings
                    </RouterLink>
                    <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLogout()
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center mr-3">
                        <FiLogOut className="h-3 w-3 text-red-600 dark:text-red-400" />
                      </div>
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
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header - only show on mobile */}
        <header className="lg:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-all duration-200"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
              JobbyAI
            </h1>
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop header with theme toggle and sidebar toggle */}
        <header className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-all duration-200"
                  title="Expand sidebar"
                >
                  <FiMenu className="h-5 w-5" />
                </button>
              )}
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/profile' && 'Profile'}
                {location.pathname.startsWith('/career-development') && 'Career Development'}
                {location.pathname.startsWith('/salary-negotiation') && 'Salary Negotiation'}
                {location.pathname.startsWith('/interview-simulator') && 'Interview Simulator'}
                {location.pathname.startsWith('/resume') && 'Resume Builder'}
                {location.pathname.startsWith('/jobs') && 'Job Analysis'}
                {location.pathname === '/subscription' && 'Subscription'}
                {location.pathname === '/settings' && 'Settings'}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay - only show on small screens when sidebar is open */}
      <div className={`lg:hidden fixed inset-0 z-40 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
        <div className="absolute left-0 top-0 h-full w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          {/* Mobile sidebar content - same as desktop but with close button */}
          <div className="flex flex-col min-h-screen">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
                  JobbyAI
                </h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = isActivePath(item.href)
                return (
                  <RouterLink
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:shadow-md'
                      }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${isActive
                      ? 'bg-white/20'
                      : 'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50'
                      } transition-all duration-200`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color} transition-all duration-200`} />
                    </div>
                    <span className="ml-3 font-medium tracking-wide">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80" />
                    )}
                  </RouterLink>
                )
              })}
            </nav>

            <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 p-3 bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20">
              <div className="flex items-center px-3 py-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate tracking-wide">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Premium Account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handler for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
