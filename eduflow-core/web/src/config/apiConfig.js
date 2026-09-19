// API configuration - resolves at runtime, not module load time
let apiBaseURL = null

export function getApiBaseURL() {
  if (apiBaseURL) return apiBaseURL
  
  // Priority: VITE_API_BASE_URL environment variable, then fallback
  // This works in browser (via Vite import.meta.env) and Node/Jest (via process.env)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    apiBaseURL = import.meta.env.VITE_API_BASE_URL
  } else if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
    apiBaseURL = process.env.VITE_API_BASE_URL
  } else {
    // Default fallback for development
    apiBaseURL = 'http://localhost:4000/api'
  }
  
  return apiBaseURL
}
