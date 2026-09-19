import { pool } from '../db/pool.js'

export class HostelController {
  static async getHostels(req, res) {
    try {
      const { institutionId } = req.params
      const result = await pool.query('SELECT * FROM hostels WHERE institution_id = $1', [institutionId])
      res.json(result.rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async allocateRoom(req, res) {
    // Logic for Ultra Pro+ hostel room allocation
    res.json({ message: 'Room allocated successfully. Features are locked to Ultra Pro+.' })
  }
}
