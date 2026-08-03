import dotenv from 'dotenv'
import pg from 'pg'
import { createMemoryPool } from './memoryPool.js'

dotenv.config()

const { Pool } = pg
const memoryPool = createMemoryPool()
const databaseUrl = String(process.env.DATABASE_URL || '').trim()
const useMemoryOnly = !databaseUrl || String(process.env.DB_MODE || '').trim().toLowerCase() === 'memory'

const realPool = useMemoryOnly
  ? null
  : new Pool({
      connectionString: databaseUrl,
      max: 50, // max connections in pool
      idleTimeoutMillis: 30000, // close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
      maxUses: 7500, // close a connection after it has been used 7500 times
    })

function isConnectionFailure(error) {
  const message = String(error?.message || '')
  return [
    'ECONNREFUSED',
    'ENOTFOUND',
    'ECONNRESET',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'connect ECONNREFUSED',
    'getaddrinfo ENOTFOUND',
  ].some((token) => message.includes(token) || error?.code === token)
}

export const pool = {
  async query(text, params = []) {
    if (useMemoryOnly) {
      return memoryPool.query(text, params)
    }

    try {
      return await realPool.query(text, params)
    } catch (error) {
      if (isConnectionFailure(error)) {
        return memoryPool.query(text, params)
      }

      throw error
    }
  },
  async end() {
    const tasks = [memoryPool.end()]

    if (realPool) {
      tasks.unshift(realPool.end().catch(() => {}))
    }

    return Promise.all(tasks)
  },
}
