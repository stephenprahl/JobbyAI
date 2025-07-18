import React, { useEffect, useRef, useState } from 'react'
import {
  FiArrowLeft,
  FiChevronDown,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShield,
  FiTarget,
  FiUser,
  FiVideo,
  FiX
} from 'react-icons/fi'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ThemeToggle } from './ThemeToggle'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Mobile-first: closed by default
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuAnimating, setIsMobileMenuAnimating] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Auto-open sidebar on desktop, keep mobile behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle clicks outside the user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome, color: 'text-primary-600', description: 'Overview & quick stats' },
    { name: 'Profile', href: '/profile', icon: FiUser, color: 'text-purple-600', description: 'Personal information' },
    { name: 'Career Development', href: '/career-development', icon: FiTarget, color: 'text-green-600', description: 'Growth & planning' },
    { name: 'Salary Negotiation', href: '/salary-negotiation', icon: FiDollarSign, color: 'text-emerald-600', description: 'Compensation tools' },
    { name: 'Interview Hub', href: '/interview-prep', icon: FiVideo, color: 'text-blue-600', description: 'Practice, simulate & review interviews' },
    { name: 'Resume Hub', href: '/resume', icon: FiFileText, color: 'text-success-600', description: 'Build, manage & analyze resumes' },
    { name: 'Scam Tracker', href: '/scam-tracker', icon: FiShield, color: 'text-red-600', description: 'Report & track job scams' },
  ]

  const handleSidebarToggle = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuAnimating(true)
      setTimeout(() => setIsMobileMenuAnimating(false), 300)
    }
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleMobileNavClick = () => {
    setIsMobileMenuAnimating(true)
    setTimeout(() => {
      setIsSidebarOpen(false)
      setIsMobileMenuAnimating(false)
    }, 150)
  }

  const handleMenuItemClick = () => {
    // Add a small delay to allow dropdown animation to complete
    setTimeout(() => {
      setIsUserMenuOpen(false)
    }, 50)
  }

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

    // Special handling for Interview Hub (unified page)
    if (path === '/interview-prep') {
      // Match /interview-prep, /interview-simulator, and /interview-history (all now use the unified InterviewHubPage)
      return location.pathname === '/interview-prep' ||
        location.pathname === '/interview-simulator' ||
        location.pathname === '/interview-history'
    }

    // Special handling for Resume Hub (unified page)
    if (path === '/resume') {
      // Match /resume, /resume/builder, and /jobs (all now use the unified ResumeHubPage)
      return location.pathname === '/resume' ||
        location.pathname.startsWith('/resume/') ||
        location.pathname === '/jobs'
    }

    // For other paths, allow sub-path matching
    if (path !== '/' && location.pathname.startsWith(path + '/')) {
      return true
    }

    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        } bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 ease-in-out hidden lg:block overflow-hidden fixed left-0 top-0 h-full z-40`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header with toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 flex-shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              {isSidebarOpen && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent tracking-tight truncate">
                  JobbyAI
                </h1>
              )}
            </div>
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-all duration-200 group flex-shrink-0"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <div className={`transform transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`}>
                <FiChevronDown className="h-5 w-5 rotate-90" />
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              return (
                <RouterLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:shadow-md hover:transform hover:scale-[1.01]'
                    }`}
                  onClick={() => window.innerWidth >= 1024 && setIsSidebarOpen(true)}
                  title={!isSidebarOpen ? `${item.name} - ${item.description}` : undefined}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 ${isActive
                    ? 'bg-white/20'
                    : 'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50'
                    } transition-all duration-200`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color} transition-all duration-200`} />
                  </div>
                  {isSidebarOpen && (
                    <>
                      <div className="ml-3 flex-1 min-w-0">
                        <span className="font-medium tracking-wide truncate block">{item.name}</span>
                        {!isActive && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200 truncate block">
                            {item.description}
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full opacity-80 flex-shrink-0" />
                      )}
                    </>
                  )}
                </RouterLink>
              )
            })}
          </nav>

          {/* User section - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 p-3 bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 group backdrop-blur-sm"
                title={!isSidebarOpen ? user?.email : undefined}
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 flex-shrink-0">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                {isSidebarOpen && (
                  <>
                    <div className="ml-3 flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate tracking-wide">
                        {user?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Premium Account
                      </p>
                    </div>
                    <FiChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </>
                )}
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && isSidebarOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 z-50 border border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="py-2">
                    <RouterLink
                      to="/"
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/30 dark:hover:to-blue-900/30 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
                      onClick={handleMenuItemClick}
                    >
                      <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-200">
                        <FiArrowLeft className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">Back to Home</span>
                    </RouterLink>
                    <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>
                    <RouterLink
                      to="/subscription"
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group"
                      onClick={handleMenuItemClick}
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors duration-200">
                        <FiCreditCard className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="font-medium">Subscription</span>
                    </RouterLink>
                    <RouterLink
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group"
                      onClick={handleMenuItemClick}
                    >
                      <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
                        <FiSettings className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </RouterLink>
                    <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setIsUserMenuOpen(false)
                        // Use setTimeout to ensure the dropdown closes before logout
                        setTimeout(() => {
                          handleLogout()
                        }, 100)
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-200">
                        <FiLogOut className="h-3 w-3 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="font-medium">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className={`flex-1 min-w-0 flex flex-col ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} transition-all duration-300`}>
        {/* Mobile header */}
        <header className="lg:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 shadow-sm flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSidebarToggle}
              className="p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-all duration-200 active:scale-95"
              aria-label="Open navigation menu"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
              JobbyAI
            </h1>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:block bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSidebarOpen && (
                <button
                  onClick={handleSidebarToggle}
                  className="p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-all duration-200 active:scale-95"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <FiMenu className="h-5 w-5" />
                </button>
              )}
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                {/* Page title with icon */}
                {(() => {
                  const currentNav = navigation.find(nav => isActivePath(nav.href))
                  if (currentNav) {
                    const Icon = currentNav.icon
                    return (
                      <>
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <span>{currentNav.name}</span>
                      </>
                    )
                  }
                  return <span>JobbyAI</span>
                })()}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content with better responsive padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-gray-50/50 via-white/50 to-gray-100/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleMobileNavClick}
        />
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isMobileMenuAnimating ? 'transition-transform' : ''}`}>
          {/* Mobile sidebar content */}
          <div className="flex flex-col h-full">
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
                onClick={handleMobileNavClick}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 active:scale-95"
                aria-label="Close navigation menu"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = isActivePath(item.href)
                return (
                  <RouterLink
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 hover:shadow-md active:scale-95'
                      }`}
                    onClick={handleMobileNavClick}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-lg mr-4 ${isActive
                      ? 'bg-white/20'
                      : 'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50'
                      } transition-all duration-200`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color} transition-all duration-200`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium tracking-wide block truncate">{item.name}</span>
                      <span className={`text-xs block truncate transition-colors duration-200 ${isActive
                        ? 'text-white/80'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400'
                        }`}>
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full opacity-80" />
                    )}
                  </RouterLink>
                )
              })}
            </nav>

            {/* Mobile user section */}
            <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20">
              <div className="flex items-center px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-700/60">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
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
    </div>
  )
}

export default Layout
