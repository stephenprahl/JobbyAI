// Enhanced encryption utility for storing sensitive data in localStorage
// Features:
// - Basic XOR cipher with base64 encoding for password obfuscation
// - Remember Me functionality with automatic expiration (30 days)
// - Timestamp tracking for credential age management
// - Automatic cleanup of expired or corrupted credentials
//
// Note: This is basic obfuscation, not true encryption. For production apps,
// consider using more secure methods or storing tokens server-side.

const SECRET_KEY = 'resume-plan-ai-remember-key'

export const encryptData = (data: string): string => {
  try {
    // Simple XOR cipher with base64 encoding
    const encrypted = data
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)))
      .join('')

    return btoa(encrypted)
  } catch (error) {
    console.error('Encryption failed:', error)
    return data
  }
}

export const decryptData = (encryptedData: string): string => {
  try {
    const decoded = atob(encryptedData)
    const decrypted = decoded
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)))
      .join('')

    return decrypted
  } catch (error) {
    console.error('Decryption failed:', error)
    return encryptedData
  }
}

// Utility functions for remember me functionality
export const saveCredentials = (email: string, password: string): void => {
  localStorage.setItem('remember_email', email)
  localStorage.setItem('remember_password', encryptData(password))
  localStorage.setItem('remember_me_enabled', 'true')
  localStorage.setItem('remember_me_timestamp', Date.now().toString())
}

export const loadCredentials = (): { email: string; password: string } | null => {
  const rememberMeEnabled = localStorage.getItem('remember_me_enabled')
  if (!rememberMeEnabled) return null

  const savedEmail = localStorage.getItem('remember_email')
  const savedPassword = localStorage.getItem('remember_password')
  const timestamp = localStorage.getItem('remember_me_timestamp')

  // Check if credentials are older than 30 days (configurable)
  const maxAgeInDays = 30
  if (timestamp) {
    const credentialAge = Date.now() - parseInt(timestamp)
    const maxAgeInMs = maxAgeInDays * 24 * 60 * 60 * 1000

    if (credentialAge > maxAgeInMs) {
      console.log('Remember me credentials expired, clearing...')
      clearCredentials()
      return null
    }
  }

  if (savedEmail && savedPassword) {
    try {
      return {
        email: savedEmail,
        password: decryptData(savedPassword)
      }
    } catch (error) {
      // If decryption fails, clear stored data
      console.error('Failed to decrypt saved credentials:', error)
      clearCredentials()
      return null
    }
  }

  return null
}

export const clearCredentials = (): void => {
  localStorage.removeItem('remember_email')
  localStorage.removeItem('remember_password')
  localStorage.removeItem('remember_me_enabled')
  localStorage.removeItem('remember_me_timestamp')
}

export const isRememberMeEnabled = (): boolean => {
  return localStorage.getItem('remember_me_enabled') === 'true'
}

export const getCredentialsSavedDate = (): Date | null => {
  const timestamp = localStorage.getItem('remember_me_timestamp')
  if (timestamp) {
    return new Date(parseInt(timestamp))
  }
  return null
}
