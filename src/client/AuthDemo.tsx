import React from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import EnhancedLoginPage from './pages/EnhancedLoginPage'
import EnhancedSignupPage from './pages/EnhancedSignupPage'
import LoginPageTailwind from './pages/LoginPage'

const AuthDemo: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Enhanced Auth Pages */}
        <Route path="/enhanced-login" element={<EnhancedLoginPage mode="login" />} />
        <Route path="/enhanced-signup" element={<EnhancedSignupPage />} />

        {/* Original Auth Pages for comparison */}
        <Route path="/original-login" element={<LoginPageTailwind mode="login" />} />
        <Route path="/original-signup" element={<LoginPageTailwind mode="register" />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/enhanced-login" replace />} />
      </Routes>
    </Router>
  )
}

export default AuthDemo
