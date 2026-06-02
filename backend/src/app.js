import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { createSearchRouter } from './routes/searchRoutes.js'
import { createBackupRouter } from './routes/backupRoutes.js'
import { createTranslateRouter } from './routes/translateRoutes.js'

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
  const backupRouter = createBackupRouter(db)

  app.use(cors())
  app.use(express.json())
  app.use(securityHeadersMiddleware)

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'sri-sudha-backend', version: '1.0.0', timestamp: new Date().toISOString() })
  })

  // API v1 routes
  app.use('/api/v1/search', createSearchRouter(db))
  app.use('/api/v1/backup', backupRouter)
  // Backward compatibility: also mount on /api/search
  app.use('/api/search', createSearchRouter(db))
  app.use('/api/backup', backupRouter)
  app.use('/api/v1/translate', createTranslateRouter())

  // Serve frontend static build if available (e.g., frontend/dist)
  let servedFrontend = false
  try {
    const frontendDist = path.join(process.cwd(), 'frontend', 'dist')
    if (fs.existsSync(frontendDist)) {
      servedFrontend = true
      app.use(express.static(frontendDist))

      // Root path serves index.html
      app.get('/', (_req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'))
      })

      // For SPA client-side routing: serve index.html for non-API routes
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next()
        res.sendFile(path.join(frontendDist, 'index.html'))
      })
    }
  } catch (err) {
    // If any error, continue without static serving
    // eslint-disable-next-line no-console
    console.warn('Frontend static assets not served:', err?.message || err)
  }

  // If frontend not served, provide a simple root endpoint to avoid 404
  if (!servedFrontend) {
    app.get('/', (_req, res) => {
      res.json({ message: 'Backend running. Frontend assets not found. Build frontend into frontend/dist to serve the SPA.' })
    })
  }

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path })
  })

  // Error handler
  app.use(errorHandler)

  return app
}
