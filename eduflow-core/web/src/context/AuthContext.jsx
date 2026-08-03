import { createContext, useMemo, useState, useEffect } from 'react'
import { loginWithRole, logout as apiLogout, registerInstitution } from '../services/authService'

const LANGUAGE_KEY = 'sri-sudha-language'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sri-sudha-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'))
  const [language, setLanguage] = useState(localStorage.getItem(LANGUAGE_KEY) || 'English')

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('accessToken')
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
    localStorage.setItem('sri-sudha-user', JSON.stringify(response.user))
    return response
  }

  async function register(registrationData) {
    const response = await registerInstitution(registrationData)
    setUser(response.user)
    setToken(response.token)
    localStorage.setItem('sri-sudha-user', JSON.stringify(response.user))
    return response
  }

  async function logout() {
    await apiLogout()
    setUser(null)
    setToken(null)
    localStorage.removeItem('sri-sudha-user')
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
