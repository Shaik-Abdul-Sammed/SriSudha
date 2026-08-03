import { pool } from '../db/pool.js'

export class TransportController {
  static async getRoutes(req, res) {
    try {
      const { institutionId } = req.params
      const result = await pool.query('SELECT * FROM transport_routes WHERE institution_id = $1', [institutionId])
      res.json(result.rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async getGPSLiveLocation(req, res) {
    // Logic for Ultra Pro+ transport GPS tracking
    res.json({ message: 'GPS Tracking is a locked feature for Ultra Pro+.' })
  }
}
