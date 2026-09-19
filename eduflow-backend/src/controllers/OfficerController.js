import { OfficerRepository } from '../repositories/OfficerRepository.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { AIService } from '../services/AIService.js'
import { CacheService } from '../services/CacheService.js'
import { calculateROI } from '../ai/officers/officerPrompts.js'

export class OfficerController {
  static async generateAccreditation(req, res) {
    try {
      const { reportType } = req.body
      if (!reportType) return res.status(400).json({ error: 'reportType is required' })

      const roi = calculateROI('accreditation', 'generate_report')

      await OfficerRepository.logSession(
        req.user.institutionId,
        'accreditation',
        [{ role: 'user', content: `Generate ${reportType}` }],
        { reply: `${reportType} has been successfully generated and saved.` },
        roi.hoursSaved,
        roi.moneySaved
      )

      const reply = await AIService.processPrompt('accreditation', `Generate ${reportType}`, { userRole: req.user.role })
      await UserRepository.logAudit(req.user.institutionId, req.user.id, 'ACCREDITATION_REPORT_GENERATED', req.ip, req.get('user-agent'), { reportType })

      res.json({
        success: true,
        message: `${reportType} generated successfully`,
        reply,
        reportUrl: `/reports/${reportType.toLowerCase().replace(/ /g, '-')}.pdf`,
        roi
      })
    } catch (err) {
      console.error('Accreditation generation error:', err.message)
      res.status(500).json({ error: 'Failed to generate report' })
    }
  }

  static async predictStudentRisk(req, res) {
    try {
      const { action = 'predict student risk' } = req.body

      const roi = calculateROI('student-success', 'predict_risk')

      await OfficerRepository.logSession(
        req.user.institutionId,
        'student-success',
        [{ role: 'user', content: action }],
        { reply: `Processed risk prediction for ${action}.` },
        roi.hoursSaved,
        roi.moneySaved
      )

      const reply = await AIService.processPrompt('student-success', action)
      await UserRepository.logAudit(req.user.institutionId, req.user.id, 'RISK_PREDICTION_RUN', req.ip, req.get('user-agent'), { action })

      res.json({ success: true, reply, roi })
    } catch (err) {
      console.error('Risk prediction error:', err.message)
      res.status(500).json({ error: 'Failed to predict risk' })
    }
  }

  static async generateTimetable(req, res) {
    try {
      const { action = 'generate timetable' } = req.body

      const roi = calculateROI('timetable', 'generate')

      await OfficerRepository.logSession(
        req.user.institutionId,
        'timetable',
        [{ role: 'user', content: action }],
        { reply: `Generated timetable for ${action}.` },
        roi.hoursSaved,
        roi.moneySaved
      )

      const reply = await AIService.processPrompt('timetable', action)
      await UserRepository.logAudit(req.user.institutionId, req.user.id, 'TIMETABLE_GENERATED', req.ip, req.get('user-agent'), { action })

      res.json({ success: true, reply, roi })
    } catch (err) {
      console.error('Timetable generation error:', err.message)
      res.status(500).json({ error: 'Failed to generate timetable' })
    }
  }

  static async predictAdmissionsYield(req, res) {
    try {
      const { action = 'predict admissions yield' } = req.body

      const roi = calculateROI('admissions', 'predict_yield')

      await OfficerRepository.logSession(
        req.user.institutionId,
        'admissions',
        [{ role: 'user', content: action }],
        { reply: `Predicted admissions yield for ${action}.` },
        roi.hoursSaved,
        roi.moneySaved
      )

      const reply = await AIService.processPrompt('admissions', action)
      await UserRepository.logAudit(req.user.institutionId, req.user.id, 'ADMISSION_YIELD_PREDICTED', req.ip, req.get('user-agent'), { action })

      res.json({ success: true, reply, roi })
    } catch (err) {
      console.error('Admission yield prediction error:', err.message)
      res.status(500).json({ error: 'Failed to predict admission yield' })
    }
  }

  static async reconcileFinance(req, res) {
    try {
      const { action = 'reconcile finances' } = req.body

      const roi = calculateROI('finance', 'reconcile_fees')

      await OfficerRepository.logSession(
        req.user.institutionId,
        'finance',
        [{ role: 'user', content: action }],
        { reply: `Reconciled finances for ${action}.` },
        roi.hoursSaved,
        roi.moneySaved
      )

      const reply = await AIService.processPrompt('finance', action)
      await UserRepository.logAudit(req.user.institutionId, req.user.id, 'FINANCE_RECONCILED', req.ip, req.get('user-agent'), { action })

      res.json({ success: true, reply, roi })
    } catch (err) {
      console.error('Finance reconciliation error:', err.message)
      res.status(500).json({ error: 'Failed to reconcile finances' })
    }
  }

  static async getOfficersSummary(req, res) {
    try {
      const VALID_OFFICERS = ['accreditation', 'timetable', 'admissions', 'finance', 'student-success']
      const cacheKey = `officers_summary_${req.user.institutionId}`
      
      const recentActivity = await CacheService.getOrSet(
        cacheKey, 
        () => OfficerRepository.getRecentActivity(req.user.institutionId, 10),
        60000 // Cache for 1 minute
      )
      
      res.json({
        officers: VALID_OFFICERS.map(id => {
          const lastAct = recentActivity.find(a => a.action === `OFFICER_CHAT_${id.toUpperCase()}`)
          return {
            id,
            endpoint: `/api/v1/officers/${id}/chat`,
            status: 'available',
            lastAction: lastAct ? `Performed action at ${new Date(lastAct.created_at).toLocaleTimeString()}` : 'No recent activity'
          }
        }),
        recentActivity: recentActivity.map(a => ({
          officer: a.action.replace('OFFICER_CHAT_', ''),
          time: a.created_at,
          metadata: a.metadata
        }))
      })
    } catch (err) {
      res.status(500).json({ error: 'Failed to get officers summary' })
    }
  }

  static async getROISummary(req, res) {
    try {
      const cacheKey = `roi_summary_${req.user.institutionId}`
      
      const summaryData = await CacheService.getOrSet(
        cacheKey,
        async () => {
          const summaryRows = await OfficerRepository.getROISummary(req.user.institutionId)
          
          let totalHoursSaved = 0
          let totalMoneySaved = 0
          const byOfficer = []

          for (const row of summaryRows) {
            const hours = parseFloat(row.total_hours) || 0
            const money = parseFloat(row.total_money) || 0
            totalHoursSaved += hours
            totalMoneySaved += money
            byOfficer.push({
              type: row.officer_type,
              hoursSaved: hours,
              moneySaved: money
            })
          }

          return {
            totalHoursSaved,
            totalMoneySaved,
            accreditationScore: 78, // Mocked for now (needs DigitalTwin logic)
            studentRiskAlerts: 12,  // Mocked for now (needs StudentSuccess logic)
            byOfficer,
          }
        },
        120000 // Cache for 2 minutes
      )

      res.json(summaryData)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to get ROI summary' })
    }
  }
}
