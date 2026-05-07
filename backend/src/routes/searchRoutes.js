import { Router } from 'express'
import { pool } from '../db/pool.js'

export function createSearchRouter(db = pool) {
  const router = Router()

  router.get('/recent', async (req, res) => {
    const role = String(req.query.role || '').trim().toLowerCase()
    if (!role) return res.status(400).json({ error: 'role is required' })

    try {
      const { rows } = await db.query(
        `SELECT role, query, route_path AS "routePath", created_at AS "createdAt"
         FROM recent_searches
         WHERE role = $1
         ORDER BY created_at DESC
         LIMIT 6`,
        [role],
      )

      const items = rows.map((row) => ({
        role: row.role,
        query: row.query,
        routePath: row.routePath,
        title: row.query,
        createdAt: row.createdAt,
      }))

      return res.json({ items })
    } catch {
      return res.status(500).json({ error: 'Failed to read recent searches' })
    }
  })

  router.post('/recent', async (req, res) => {
    const role = String(req.body.role || '').trim().toLowerCase()
    const query = String(req.body.query || '').trim()
    const routePath = String(req.body.routePath || '').trim()

    if (!role || !routePath) {
      return res.status(400).json({ error: 'role and routePath are required' })
    }

    try {
      await db.query(
        `INSERT INTO recent_searches (role, query, route_path)
         VALUES ($1, $2, $3)
         ON CONFLICT (role, route_path)
         DO UPDATE SET query = EXCLUDED.query, created_at = NOW()`,
        [role, query, routePath],
      )

      await db.query(
        `DELETE FROM recent_searches
         WHERE id IN (
           SELECT id FROM recent_searches
           WHERE role = $1
           ORDER BY created_at DESC
           OFFSET 6
         )`,
        [role],
      )

      return res.status(201).json({ ok: true })
    } catch {
      return res.status(500).json({ error: 'Failed to save recent search' })
    }
  })

  return router
}

export default createSearchRouter(pool)
