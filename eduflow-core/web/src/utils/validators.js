// Form validation utilities for consistent client-side validation

export const validators = {
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) ? null : 'Invalid email address'
  },
  
  password: (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter'
    if (!/[0-9]/.test(value)) return 'Password must contain number'
    return null
  },
  
  required: (value) => {
    return value && value.trim() ? null : 'This field is required'
  },
  
  minLength: (min) => (value) => {
    return value && value.length >= min ? null : `Minimum ${min} characters required`
  },
  
  maxLength: (max) => (value) => {
    return value && value.length <= max ? null : `Maximum ${max} characters allowed`
  },
  
  phone: (value) => {
    const pattern = /^[0-9]{10}$/
    return pattern.test(value?.replace(/\D/g, '')) ? null : 'Invalid phone number'
  },
  
  url: (value) => {
    try {
      new URL(value)
      return null
    } catch {
      return 'Invalid URL'
    }
  },

  match: (otherValue) => (value) => {
    return value === otherValue ? null : 'Values do not match'
  },
}

export function validateForm(formData, schema) {
  const errors = {}
  
  for (const [field, validator] of Object.entries(schema)) {
    if (validator) {
      const error = validator(formData[field])
      if (error) errors[field] = error
    }
  }
  
  return Object.keys(errors).length === 0 ? null : errors
}
