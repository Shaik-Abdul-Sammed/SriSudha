import { Router } from 'express'
import { AIOrchestrator } from '../ai/AIOrchestrator.js'
import { OFFICER_PROMPTS, calculateROI } from '../ai/officers/officerPrompts.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { OfficerRepository } from '../repositories/OfficerRepository.js'
import { OfficerController } from '../controllers/OfficerController.js'
import { UserRepository } from '../repositories/UserRepository.js'

const VALID_OFFICERS = ['accreditation', 'timetable', 'admissions', 'finance', 'student-success']

/** @returns {import('express').Router} */
export function createOfficerRouter() {
  const router = Router()

  // Apply auth to all officer routes
  router.use(authMiddleware)

  /**
   * POST /api/v1/officers/accreditation/generate
   * Generates a mock accreditation report and stores it in the database.
   */
  router.post('/accreditation/generate', requireRole(['admin', 'faculty']), OfficerController.generateAccreditation)

  /**
   * POST /api/v1/officers/student-success/predict-risk
   * Returns a mock risk prediction summary
   */
  router.post('/student-success/predict-risk', requireRole(['admin', 'faculty']), OfficerController.predictStudentRisk)

  /**
   * POST /api/v1/officers/timetable/generate
   * Generates conflict-free timetable
   */
  router.post('/timetable/generate', requireRole(['admin', 'faculty']), OfficerController.generateTimetable)

  /**
   * POST /api/v1/officers/admissions/predict-yield
   * Predicts admission conversion and yield rate
   */
  router.post('/admissions/predict-yield', requireRole(['admin', 'faculty']), OfficerController.predictAdmissionsYield)

  /**
   * POST /api/v1/officers/finance/reconcile
   * Reconciles fee payments against bank statements
   */
  router.post('/finance/reconcile', requireRole(['admin', 'faculty']), OfficerController.reconcileFinance)

  /**
   * POST /api/v1/officers/:type/chat
   * Chat with a specific AI Officer.
   * Body: { messages, digitalTwin, actionType }
   */
  router.post('/:type/chat', requireRole(['admin', 'faculty']), async (req, res) => {
    try {
      const { type } = req.params
      if (!VALID_OFFICERS.includes(type)) {
        return res.status(400).json({ error: `Unknown officer type: ${type}. Valid types: ${VALID_OFFICERS.join(', ')}` })
      }

      const { messages = [], digitalTwin = {}, actionType = 'default' } = req.body
      if (!messages.length) return res.status(400).json({ error: 'messages array is required' })

      // Build officer-specific system prompt
      const promptFn = OFFICER_PROMPTS[type]
      const systemPrompt = promptFn(digitalTwin)

      // Get AI provider and call with officer persona
      const { createAIProvider } = await import('../ai/providers/providerFactory.js')
      const provider = createAIProvider()
      const reply = await provider.chat(messages, systemPrompt)

      // Calculate ROI
      const roi = calculateROI(type, actionType)

      // Save to DB
      await OfficerRepository.logSession(
        req.user.institutionId,
        type,
        messages,
        { reply },
        roi.hoursSaved,
        roi.moneySaved
      )
      
      await UserRepository.logAudit(req.user.institutionId, req.user.id, `OFFICER_CHAT_${type.toUpperCase()}`, req.ip, req.get('user-agent'), { actionType })

      res.json({
        reply,
        officerType: type,
        provider: provider.lastSuccessfulProviderName || provider.name || provider.constructor.name || process.env.AI_PROVIDER || 'fallback',
        roi,
      })
    } catch (err) {
      console.error(`Officer [${req.params.type}] chat error:`, err.message)
      res.status(500).json({ error: err.message })
    }
  })

  /**
   * GET /api/v1/officers
   * List all available officers and their status.
   */
  router.get('/', OfficerController.getOfficersSummary)

  /**
   * GET /api/v1/officers/roi/summary
   * Return real ROI summary from DB
   */
  router.get('/roi/summary', OfficerController.getROISummary)

  return router
}
