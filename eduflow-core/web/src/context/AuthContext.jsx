import { createContext, useMemo, useState, useEffect } from 'react'
import { loginWithRole, logout as apiLogout, registerInstitution } from '../services/authService'

const STORAGE_KEY = 'sri-sudha-auth'
const LANGUAGE_KEY = 'sri-sudha-language'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY)
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth)
        if (parsed?.user) return parsed.user
      }
      const stored = localStorage.getItem('sri-sudha-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  
  const [token, setToken] = useState(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY)
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth)
        if (parsed?.token) return parsed.token
      }
      return localStorage.getItem('accessToken')
    } catch {
      return null
    }
  })
  const [language, setLanguage] = useState(localStorage.getItem(LANGUAGE_KEY) || 'English')

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('accessToken') || localStorage.getItem(STORAGE_KEY)
      if (!newToken && token) {
        // Logged out from another tab
        setUser(null)
        setToken(null)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [token])

  async function login(credentials) {
    const response = await loginWithRole(credentials)
    setUser(response.user)
    setToken(response.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: response.user, token: response.token }))
    localStorage.setItem('sri-sudha-user', JSON.stringify(response.user))
    if (response.token) {
      localStorage.setItem('accessToken', response.token)
    }
    return response
  }

  async function register(registrationData) {
    const response = await registerInstitution(registrationData)
    setUser(response.user)
    setToken(response.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: response.user, token: response.token }))
    localStorage.setItem('sri-sudha-user', JSON.stringify(response.user))
    if (response.token) {
      localStorage.setItem('accessToken', response.token)
    }
    return response
  }

  async function logout() {
    if (typeof apiLogout === 'function') {
      try {
        await apiLogout()
      } catch (e) {
        console.warn('API logout failed:', e)
      }
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('sri-sudha-user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  function updateLanguage(value) {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_KEY, value)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      language,
      login,
      register,
      logout,
      updateLanguage,
    }),
    [user, token, language],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
