import express from 'express'
import cors from 'cors'
import { createSearchRouter } from './routes/searchRoutes.js'

// Security headers middleware
function securityHeadersMiddleware(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'")
  next()
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error('API Error:', err.message)
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ error: message, status })
}

export function createApp({ db } = {}) {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(securityHeadersMiddleware)

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'sri-sudha-backend', version: '1.0.0', timestamp: new Date().toISOString() })
  })

  // API v1 routes
  app.use('/api/v1/search', createSearchRouter(db))
  // Backward compatibility: also mount on /api/search
  app.use('/api/search', createSearchRouter(db))

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path })
  })

  // Error handler
  app.use(errorHandler)

  return app
}
