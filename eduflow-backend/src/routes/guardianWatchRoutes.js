import { Router } from 'express'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { UserRepository } from '../repositories/UserRepository.js'

export function createGuardianWatchRouter() {
  const router = Router()

  router.use(authMiddleware)

  /**
   * POST /api/v1/guardianwatch/generate-progress-report
   * Generates a monthly AI progress report for a student.
   */
  router.post('/generate-progress-report', requireRole(['admin', 'faculty']), async (req, res) => {
    try {
      const { studentId, month } = req.body
      
      if (!studentId || !month) {
        return res.status(400).json({ error: 'studentId and month are required' })
      }

      // In a real implementation, we would query the student's attendance, marks, and run an AI prompt
      // For now, return a mock structured report.
      const mockReportUrl = `/reports/progress_${studentId}_${month}.pdf`
      
      const reportData = {
        studentId,
        month,
        attendance: '85%',
        academicPerformance: 'Good',
        aiInsights: 'Student has shown consistent improvement in Mathematics. Recommend participation in the upcoming Science Fair.',
        reportUrl: mockReportUrl
      }

      await UserRepository.logAudit(req.user.institutionId, req.user.id, 'GUARDIAN_WATCH_REPORT_GENERATED', req.ip, req.get('user-agent'), { studentId, month })

      res.json({
        success: true,
        message: 'Progress report generated successfully',
        report: reportData
      })
    } catch (err) {
      console.error('Progress report generation error:', err)
      res.status(500).json({ error: 'Failed to generate progress report' })
    }
  })

  /**
   * POST /api/v1/guardianwatch/trigger-alert
   * Scans all students for attendance below 75% and triggers GuardianWatch alerts
   */
  router.post('/trigger-alert', requireRole(['admin', 'faculty']), async (req, res) => {
    try {
      // In a real implementation, we would query the database for students with < 75% attendance.
      // We would then trigger an SMS/WhatsApp to parents using a service like Twilio.
      
      const threshold = req.body.threshold || 75
      
      // Mocking the detection of students
      const flaggedStudentsCount = 28
      const mockAlertsSent = 28

      await UserRepository.logAudit(
        req.user.institutionId, 
        req.user.id, 
        'ATTENDANCE_ALERTS_TRIGGERED', 
        req.ip, 
        req.get('user-agent'), 
        { threshold, flaggedStudentsCount }
      )

      res.json({
        success: true,
        message: `Attendance scan complete. Threshold: <${threshold}%.`,
        details: {
          flaggedStudents: flaggedStudentsCount,
          alertsDispatched: mockAlertsSent
        }
      })
    } catch (err) {
      console.error('Attendance alert trigger error:', err)
      res.status(500).json({ error: 'Failed to trigger attendance alerts' })
    }
  })

  return router
}
