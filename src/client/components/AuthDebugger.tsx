import React from 'react'

const AuthDebugger: React.FC = () => {
  const clearAuth = () => {
    localStorage.removeItem('auth_tokens')
    window.location.reload()
  }

  const showAuthInfo = () => {
    const tokens = localStorage.getItem('auth_tokens')
    console.log('Stored tokens:', tokens)
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens)
        console.log('Parsed tokens:', parsed)
        console.log('Access token length:', parsed?.accessToken?.length)
        console.log('Access token preview:', parsed?.accessToken?.substring(0, 50))
      } catch (e) {
        console.error('Error parsing tokens:', e)
      }
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 text-sm">
      <div className="text-red-800 dark:text-red-200 font-semibold mb-2">
        Auth Debug Helper
      </div>
      <div className="space-y-2">
        <button
          onClick={showAuthInfo}
          className="block w-full px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Show Auth Info
        </button>
        <button
          onClick={clearAuth}
          className="block w-full px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Clear Auth & Reload
        </button>
      </div>
    </div>
  )
}

export default AuthDebugger
