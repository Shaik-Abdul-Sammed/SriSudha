import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { pool } from '../db/pool.js'

export function createUserRouter() {
  const router = Router()
  router.use(authMiddleware)

  /**
   * GET /api/v1/user/dashboard-perks
   * Returns active features and perks based on user role and institution plan.
   */
  router.get('/dashboard-perks', async (req, res) => {
    try {
      // In a real app, query the database based on institution plan
      const perks = [
        { icon: '📍', title: 'Live User Tracking', subtitle: 'Real-time location enabled.' },
        { icon: '📄', title: 'AI Reports', subtitle: 'Smart analytics activated.' },
        { icon: '🎯', title: 'Placement Radar', subtitle: 'Career matching active.' },
        { icon: '📈', title: 'Student Analytics', subtitle: 'Deep insights unlocked.' },
        { icon: '📚', title: 'Mock Interviews', subtitle: 'AI interview prep ready.' },
        { icon: '🧾', title: 'Resume Builder', subtitle: 'Auto CV generation on.' },
        { icon: '🤖', title: 'AI Assistant', subtitle: '24/7 administrative help.' }
      ]
      res.json({ perks })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch perks' })
    }
  })

  return router
}
