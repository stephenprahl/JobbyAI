import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { isRememberMeEnabled, loadCredentials } from '../../utils/encryption'

export const useAutoLogin = () => {
  const { login, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const hasAttemptedAutoLogin = useRef(false)

  useEffect(() => {
    // Don't auto-login if user is on login/register pages (they might be manually logging in)
    // Also don't auto-login on home page to prevent redirect loops
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
      return
    }

    // Only attempt auto-login once and if user is not already authenticated
    if (hasAttemptedAutoLogin.current || isAuthenticated || isLoading) {
      return
    }

    // Check if remember me is enabled and credentials are available
    if (isRememberMeEnabled()) {
      const credentials = loadCredentials()

      if (credentials && credentials.email && credentials.password) {
        hasAttemptedAutoLogin.current = true

        // Attempt silent login
        login(credentials).catch((error) => {
          // If auto-login fails, we silently ignore the error
          // The user will need to manually log in
          console.log('Auto-login failed:', error.message)
        })
      }
    }
  }, [login, isAuthenticated, isLoading, location.pathname])
}
