import { Router } from 'express'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { pool } from '../db/pool.js'

export function createStudentRouter() {
  const router = Router()

  router.use(authMiddleware)

  /**
   * GET /api/v1/student/attendance
   * Fetch attendance and check for alerts (threshold < 75%)
   */
  router.get('/attendance', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT course_id, total_classes, attended_classes,
               (attended_classes::FLOAT / NULLIF(total_classes, 0)) * 100 as percentage
        FROM student_attendance
        WHERE student_id = $1 AND institution_id = $2
      `, [req.user.id, req.user.institutionId])
      
      const attendance = result.rows.map(r => ({
        courseId: r.course_id,
        totalClasses: r.total_classes,
        attendedClasses: r.attended_classes,
        percentage: parseFloat(r.percentage || 0).toFixed(2),
        alert: (r.percentage || 0) < 75.0
      }))

      res.json(attendance)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch attendance' })
    }
  })

  return router
}
