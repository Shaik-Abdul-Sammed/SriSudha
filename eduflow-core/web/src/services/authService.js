import { getApiBaseURL } from '../config/apiConfig'

/**
 * Perform login using the real backend API.
 */
export async function loginWithRole({ role, username, password }) {
  const baseUrl = getApiBaseURL() + '/v1'
  
  // 1. Get default institution for MVP
  const instResponse = await fetch(`${baseUrl}/auth/default-institution`)
  if (!instResponse.ok) throw new Error('Could not find institution configuration')
  const instData = await instResponse.json()

  // 2. Perform actual login
  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      institutionId: instData.id,
      username,
      password,
      role
    })
  })

  const data = await loginResponse.json()

  if (!loginResponse.ok) {
    throw new Error(data.error || 'Invalid credentials')
  }

  // 3. Store tokens
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)

  return {
    token: data.accessToken,
    user: data.user
  }
}

/**
 * Register a new institution and admin user.
 */
export async function registerInstitution(registrationData) {
  const baseUrl = getApiBaseURL() + '/v1'
  
  const response = await fetch(`${baseUrl}/institutions/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationData)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }

  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)

  return {
    token: data.accessToken,
    user: data.user
  }
}

/**
 * Handle logout
 */
export async function logout() {
  const baseUrl = getApiBaseURL() + '/v1'
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })
    } catch (e) {
      console.error('Logout API failed:', e)
    }
  }
  
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

/**
 * Automatically fetch a new access token using the refresh token
 */
export async function refreshSession() {
  const baseUrl = getApiBaseURL() + '/v1'
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token available')

  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  })

  if (!response.ok) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    throw new Error('Session expired')
  }

  const data = await response.json()
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  
  return data.accessToken
}
