import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'sri-sudha-dev-secret-key'
const JWT_EXPIRES_IN = '24h'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export function generateTokens(user) {
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email,
  }

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  })

  return { accessToken, refreshToken, expiresIn: JWT_EXPIRES_IN }
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function refreshAccessToken(refreshToken) {
  const decoded = verifyToken(refreshToken)
  if (!decoded) return null

  return generateTokens(decoded)
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.slice(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = decoded
  next()
}
