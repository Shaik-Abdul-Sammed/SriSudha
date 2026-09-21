import { GoogleGenerativeAI } from '@google/generative-ai'
import { BaseProvider } from './BaseProvider.js'

export class GeminiProvider extends BaseProvider {
  constructor() {
    super()
    if (!process.env.AI_API_KEY) throw new Error('AI_API_KEY is required for Gemini provider')
    this.client = new GoogleGenerativeAI(process.env.AI_API_KEY)
    this.modelName = process.env.AI_MODEL || 'gemini-flash-latest'
  }

  async chat(messages, systemPrompt = '') {
    const model = this.client.getGenerativeModel({ model: this.modelName, systemInstruction: systemPrompt })
    const history = messages.slice(0, -1).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
    const chatSession = model.startChat({ history })
    const lastMsg = messages[messages.length - 1]
    const result = await chatSession.sendMessage(lastMsg.content)
    return result.response.text()
  }

  async *chatStream(messages, systemPrompt = '') {
    const model = this.client.getGenerativeModel({ model: this.modelName, systemInstruction: systemPrompt })
    const history = messages.slice(0, -1).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
    const chatSession = model.startChat({ history })
    const lastMsg = messages[messages.length - 1]
    const result = await chatSession.sendMessageStream(lastMsg.content)
    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) yield text
    }
  }

  async extractStructured(text, schema) {
    const model = this.client.getGenerativeModel({ model: this.modelName })
    const prompt = `Extract structured information from the following text and return ONLY valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}\n\nText:\n${text}\n\nRespond with ONLY the JSON object, no explanation.`
    const result = await model.generateContent(prompt)
    const raw = result.response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(raw)
  }

  async generateCode(spec) {
    const model = this.client.getGenerativeModel({ model: this.modelName })
    const prompt = `You are an expert Flutter developer following Clean Architecture.\nGenerate Flutter code for the following specification:\n${JSON.stringify(spec, null, 2)}\nReturn a JSON array of {filename, content} objects. Return ONLY the JSON array.`
    const result = await model.generateContent(prompt)
    const raw = result.response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(raw)
  }

  async analyzeAndRepair(errorLog, codeFiles) {
    const model = this.client.getGenerativeModel({ model: this.modelName })
    const prompt = `You are an expert Flutter developer. Fix the following build error.\n\nError:\n${errorLog}\n\nCode Files:\n${JSON.stringify(codeFiles, null, 2)}\n\nReturn the fixed files as a JSON array of {filename, content} objects. Return ONLY the JSON array.`
    const result = await model.generateContent(prompt)
    const raw = result.response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(raw)
  }
}
