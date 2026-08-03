import { Router } from 'express'
import { AIOrchestrator } from '../ai/AIOrchestrator.js'

/** @returns {import('express').Router} */
export function createAIRouter() {
  const router = Router()

  // POST /api/v1/ai/chat
  router.post('/chat', async (req, res) => {
    try {
      const { institutionId = 'anonymous', messages = [], digitalTwin = {} } = req.body
      if (!messages.length) return res.status(400).json({ error: 'messages array is required' })
      const orchestrator = new AIOrchestrator()
      const reply = await orchestrator.chat(institutionId, messages, digitalTwin)
      res.json({ reply, provider: process.env.AI_PROVIDER || 'gemini' })
    } catch (err) {
      console.error('AI chat error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  // POST /api/v1/ai/extract
  router.post('/extract', async (req, res) => {
    try {
      const { text } = req.body
      if (!text) return res.status(400).json({ error: 'text is required' })
      const orchestrator = new AIOrchestrator()
      const knowledge = await orchestrator.extractKnowledge(text)
      res.json({ knowledge, provider: process.env.AI_PROVIDER || 'gemini' })
    } catch (err) {
      console.error('AI extract error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  // GET /api/v1/ai/providers
  router.get('/providers', (_req, res) => {
    res.json({
      supported: ['gemini', 'openai', 'claude', 'ollama', 'lmstudio'],
      active: process.env.AI_PROVIDER || 'gemini',
      model: process.env.AI_MODEL || '(provider default)',
    })
  })

  return router
}
