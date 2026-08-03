import { createAIProvider } from '../ai/providers/providerFactory.js'

let aiProvider = null
try {
  aiProvider = createAIProvider()
} catch (e) {
  console.warn('AI Provider could not be initialized:', e.message)
}

export class AIService {
  /**
   * Processes a prompt through the AI model using OpenAI.
   * If OPENAI_API_KEY is missing, it falls back to a deterministic response.
   * 
   * @param {string} officerType - e.g., 'admissions', 'finance', 'accreditation'
   * @param {string} prompt - The user prompt
   * @param {object} context - Additional context (like digital twin data, student info)
   * @returns {Promise<string>} The generated AI response
   */
  static async processPrompt(officerType, prompt, context = {}) {
    if (aiProvider) {
      try {
        const systemMessage = `You are the ${officerType} AI Officer for EduFlow AI OS. Context: ${JSON.stringify(context)}`
        const response = await aiProvider.chat([{ role: 'user', content: prompt }], systemMessage)
        return response
      } catch (err) {
        console.error('AI Provider Error:', err)
        return `[AI Error] Failed to generate response: ${err.message}`
      }
    }

    // Fallback deterministic responses if OpenAI is not connected yet
    // Simulate network latency for the LLM call
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (officerType === 'admissions') {
      return `[AI Fallback] I have processed the admissions query regarding: "${prompt}". Based on your Digital Twin rules, the admission yield is looking strong.`
    }
    
    if (officerType === 'finance') {
      return `[AI Fallback] I have analyzed the financial records requested in: "${prompt}". The reconciliation is complete.`
    }

    if (officerType === 'accreditation') {
      return `[AI Fallback] Generating accreditation data for: "${prompt}". Your NAAC SSR draft is being updated with the latest research metrics.`
    }
    
    if (officerType === 'student-success') {
      return `[AI Fallback] Student Success analysis for: "${prompt}". We've identified 12 high-risk students based on recent attendance.`
    }

    if (officerType === 'timetable') {
      return `[AI Fallback] Timetable generation for: "${prompt}". All scheduling conflicts have been resolved.`
    }

    return `[AI Fallback] Processed prompt: "${prompt}" successfully.`
  }
}
