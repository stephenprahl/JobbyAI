import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Import Tailwind pages
import DashboardPageTailwind from './pages/DashboardPageTailwind'
import JobAnalysisPage from './pages/JobAnalysisPageEnhanced'
import LandingPageTailwind from './pages/LandingPageTailwind'
import LoginPageTailwind from './pages/LoginPageTailwind'
import NotFoundPageTailwind from './pages/NotFoundPageTailwind'
import ProfilePage from './pages/ProfilePage'
import ResumeBuilderPageTailwind from './pages/ResumeBuilderPageTailwind'
import ResumePage from './pages/ResumePage'

// Import Tailwind layout
import AuthDebugger from './components/AuthDebugger'
import LayoutTailwind from './components/LayoutTailwind'

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
)

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    // Save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

const AppTailwind: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Debug helper - remove in production */}
        {process.env.NODE_ENV === 'development' && <AuthDebugger />}
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPageTailwind />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPageTailwind mode="login" />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <LoginPageTailwind mode="register" />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LayoutTailwind>
                  <DashboardPageTailwind />
                </LayoutTailwind>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LayoutTailwind>
                  <ProfilePage />
                </LayoutTailwind>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <LayoutTailwind>
                  <ResumePage />
                </LayoutTailwind>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/builder"
            element={
              <ProtectedRoute>
                <LayoutTailwind>
                  <ResumeBuilderPageTailwind />
                </LayoutTailwind>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <LayoutTailwind>
                  <JobAnalysisPage />
                </LayoutTailwind>
              </ProtectedRoute>
            }
          />

          {/* 404 page */}
          <Route path="*" element={<NotFoundPageTailwind />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default AppTailwind
