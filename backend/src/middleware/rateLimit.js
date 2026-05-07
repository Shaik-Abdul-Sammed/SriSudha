import rateLimit from 'express-rate-limit'

// Rate limiting configuration per role
export const rateLimiters = {
  global: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  api: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: 'API rate limit exceeded',
  }),

  search: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: 'Search rate limit exceeded',
    keyGenerator: (req) => req.user?.role || req.ip,
  }),

  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many authentication attempts',
    skipSuccessfulRequests: true,
  }),

  roleBasedLimiter: (requestsPerMinute = 60) =>
    rateLimit({
      windowMs: 60 * 1000,
      max: requestsPerMinute,
      keyGenerator: (req) => `${req.user?.role || 'anonymous'}-${req.ip}`,
    }),
}

export default rateLimiters
