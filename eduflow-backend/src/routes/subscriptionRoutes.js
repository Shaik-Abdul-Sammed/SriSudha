import { Router } from 'express'
import { pool } from '../db/pool.js'

export function createSubscriptionRouter() {
  const router = Router()

  /**
   * GET /api/v1/subscription/tier/:shortCode
   * Public route for the mobile app to fetch subscription data based on shortcode
   */
  router.get('/tier/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params
      const result = await pool.query(
        'SELECT name, short_code, subscription_tier, primary_color, secondary_color, logo_url FROM institutions WHERE short_code = $1',
        [shortCode]
      )
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Institution not found' })
      }

      res.json(result.rows[0])
    } catch (err) {
      console.error('Subscription Tier error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  /**
   * POST /api/v1/subscription/upgrade
   * Contact logic for upgrading
   */
  router.post('/upgrade', async (req, res) => {
    // 9010150809 is the centralized configuration number requested by the user
    res.json({
      message: 'Upgrade requested. Please contact the administrator at 9010150809.',
      supportContact: '9010150809'
    })
  })

  return router
}
