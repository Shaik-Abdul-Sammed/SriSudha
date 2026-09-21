// API configuration - resolves at runtime, not module load time
let apiBaseURL = null

export function getApiBaseURL() {
  if (apiBaseURL) return apiBaseURL
  
  let metaEnv
  try {
    metaEnv = new Function('try { return import.meta.env } catch { return undefined }')()
  } catch {
    metaEnv = undefined
  }

  if (metaEnv && metaEnv.VITE_API_BASE_URL) {
    apiBaseURL = metaEnv.VITE_API_BASE_URL
  } else if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
    apiBaseURL = process.env.VITE_API_BASE_URL
  } else {
    // Default fallback for development
    apiBaseURL = 'http://localhost:3000/api'
  }
  
  return apiBaseURL
}
