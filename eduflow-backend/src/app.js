import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { createSearchRouter } from './routes/searchRoutes.js'
import { createBackupRouter } from './routes/backupRoutes.js'
import { createTranslateRouter } from './routes/translateRoutes.js'
import { createAIRouter } from './routes/aiRoutes.js'
import { createOfficerRouter } from './routes/officerRoutes.js'
import { createAuthRouter } from './routes/authRoutes.js'
import { createAdminRouter } from './routes/adminRoutes.js'
import { createStudentRouter } from './routes/studentRoutes.js'
import { createCareerRouter } from './routes/careerRoutes.js'
import { createGuardianWatchRouter } from './routes/guardianWatchRoutes.js'
import { createDigitalTwinRouter } from './routes/digitalTwinRoutes.js'
import { createUserRouter } from './routes/userRoutes.js'
import { createInstitutionRouter } from './routes/institutionRoutes.js'
import { createCareerForgeRouter } from './routes/careerForgeRoutes.js'
import { createSubscriptionRouter } from './routes/subscriptionRoutes.js'

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

  // Global rate limiter
  // const globalLimiter = rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  //   standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  //   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  //   message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
  // })
  // app.use('/api', globalLimiter)

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'eduflow-backend', version: '1.0.0', timestamp: new Date().toISOString() })
  })

  // API v1 routes
  app.use('/api/v1/search', createSearchRouter(db))
  app.use('/api/v1/auth', createAuthRouter())
  app.use('/api/v1/backup', backupRouter)
  // Backward compatibility: also mount on /api/search
  app.use('/api/search', createSearchRouter(db))
  app.use('/api/backup', backupRouter)
  app.use('/api/v1/translate', createTranslateRouter())
  app.use('/api/v1/ai', createAIRouter())
  app.use('/api/v1/officers', createOfficerRouter())
  app.use('/api/v1/admin', createAdminRouter())
  app.use('/api/v1/student', createStudentRouter())
  app.use('/api/v1/career', createCareerRouter())
  app.use('/api/v1/guardianwatch', createGuardianWatchRouter())
  app.use('/api/v1/digital-twin', createDigitalTwinRouter())
  app.use('/api/v1/user', createUserRouter())
  app.use('/api/v1/institutions', createInstitutionRouter())
  app.use('/api/v1/institution', createInstitutionRouter()) // alias for plan-config
  app.use('/api/v1/careerforge', createCareerForgeRouter())
  app.use('/api/v1/subscription', createSubscriptionRouter())
  app.use('/api/v1/ai-officer', createOfficerRouter()) // alias for officers

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
