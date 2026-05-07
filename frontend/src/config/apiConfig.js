/* eslint-disable no-undef */
// API configuration - resolves at runtime, not module load time
let apiBaseURL = null

export function getApiBaseURL() {
  if (apiBaseURL) return apiBaseURL
  
  // Priority: VITE_API_BASE_URL environment variable, then fallback
  // This works in both browser (via Vite) and Node/Jest (via process.env)
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
    apiBaseURL = process.env.VITE_API_BASE_URL
  } else {
    // Default fallback for development
    apiBaseURL = 'http://localhost:4000/api'
  }
  
  return apiBaseURL
}
