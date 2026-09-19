import { Router } from 'express'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { pool } from '../db/pool.js'

export function createCareerRouter() {
  const router = Router()

  router.use(authMiddleware)

  /**
   * POST /api/v1/career/lor-generator
   * Scaffold for LOR Generation
   */
  router.post('/lor-generator', requireRole(['student']), async (req, res) => {
    try {
      const { facultyId, targetUniversity, targetProgram } = req.body
      if (!facultyId || !targetUniversity || !targetProgram) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const result = await pool.query(`
        INSERT INTO lor_requests (institution_id, student_id, faculty_id, target_university, target_program)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, status
      `, [req.user.institutionId, req.user.id, facultyId, targetUniversity, targetProgram])

      res.status(201).json({ 
        message: 'LOR request submitted successfully',
        request: result.rows[0]
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to submit LOR request' })
    }
  })

  return router
}
