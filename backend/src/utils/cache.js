import redis from 'redis'

let redisClient = null

export async function initializeRedis(options = {}) {
  const url = process.env.REDIS_URL || 'redis://localhost:6379'

  redisClient = redis.createClient({ url, ...options })

  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err)
  })

  await redisClient.connect()
  console.log('✅ Redis connected successfully')
  return redisClient
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initializeRedis first.')
  }
  return redisClient
}

export async function cacheGet(key) {
  try {
    const client = getRedisClient()
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Cache GET error:', error)
    return null
  }
}

export async function cacheSet(key, value, ttlSeconds = 3600) {
  try {
    const client = getRedisClient()
    await client.setEx(key, ttlSeconds, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Cache SET error:', error)
    return false
  }
}

export async function cacheDelete(key) {
  try {
    const client = getRedisClient()
    await client.del(key)
    return true
  } catch (error) {
    console.error('Cache DELETE error:', error)
    return false
  }
}

export async function cacheClear(pattern) {
  try {
    const client = getRedisClient()
    if (!pattern) {
      await client.flushDb()
    } else {
      const keys = await client.keys(pattern)
      if (keys.length > 0) {
        await client.del(keys)
      }
    }
    return true
  } catch (error) {
    console.error('Cache CLEAR error:', error)
    return false
  }
}

export function cacheMiddleware(ttlSeconds = 3600) {
  return async (req, res, next) => {
    const cacheKey = `${req.method}:${req.originalUrl}`

    // Only cache GET requests
    if (req.method !== 'GET') return next()

    const cachedResponse = await cacheGet(cacheKey)
    if (cachedResponse) {
      return res.json(cachedResponse)
    }

    // Override res.json to cache responses
    const originalJson = res.json.bind(res)
    res.json = (data) => {
      cacheSet(cacheKey, data, ttlSeconds)
      return originalJson(data)
    }

    next()
  }
}

export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
