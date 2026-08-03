
import express from 'express'

export function createTranslateRouter() {
  const router = express.Router()

  async function translateWithTorouter({ q, html, target, source }) {
    const apiUrl = process.env.TOROUTER_API_URL || 'https://portal.torouter.ai/api/v1/chat/completions'
    const apiKey = process.env.TOROUTER_API_KEY

    if (!apiKey) {
      throw new Error('TOROUTER_API_KEY not configured')
    }

    const payload = {
      model: process.env.TOROUTER_MODEL || 'gpt-4o-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'You are a translation engine. Preserve meaning, HTML tags, attributes, URLs, and code blocks exactly. Return only the translated text or translated HTML, with no commentary.'
        },
        {
          role: 'user',
          content: html
            ? [
                `Translate the following HTML into ${target}.`,
                source ? `Source language: ${source}.` : '',
                'Keep the HTML structure unchanged and translate only visible text nodes.',
                html
              ].filter(Boolean).join('\n\n')
            : [
                `Translate the following text into ${target}.`,
                source ? `Source language: ${source}.` : '',
                Array.isArray(q) ? q.join('\n') : String(q)
              ].filter(Boolean).join('\n\n')
        }
      ]
    }

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(`Torouter API error (${resp.status}): ${text}`)
    }

    const data = await resp.json()
    const content = data?.choices?.[0]?.message?.content || ''
    return { content, raw: data }
  }

  // POST /api/v1/translate
  // Body options:
  // - q: string or [string]
  // - html: string (HTML content to translate)
  // - target: language code (default: en)
  // - source: optional source language
  router.post('/', async (req, res) => {
    const torouterConfigured = Boolean(process.env.TOROUTER_API_KEY)
    const serviceUrl = process.env.TRANSLATE_SERVICE_URL
    const key = process.env.GOOGLE_TRANSLATE_KEY
    const { q, html, target = 'en', source } = req.body || {}
    if (!q && !html) return res.status(400).json({ error: 'Missing text to translate. Provide `q` or `html`.' })

    try {
      if (torouterConfigured) {
        const result = await translateWithTorouter({ q, html, target, source })

        if (html) {
          return res.json({ html: result.content, provider: 'torouter' })
        }

        return res.json({ translations: [result.content], provider: 'torouter' })
      }

      if (serviceUrl) {
        // Proxy to Python microservice
        const resp = await fetch(`${serviceUrl.replace(/\/$/, '')}/v1/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q, html, target, source })
        })
        const data = await resp.json()
        return res.status(resp.status).json(data)
      }

      if (!key) {
        return res.status(501).json({ error: 'No translate provider configured. Set TOROUTER_API_KEY, TRANSLATE_SERVICE_URL, or GOOGLE_TRANSLATE_KEY in env.' })
      }

      const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`

      if (html) {
        const body = new URLSearchParams()
        body.append('q', html)
        body.append('target', target)
        body.append('mime_type', 'text/html')
        if (source) body.append('source', source)

        const resp = await fetch(url, { method: 'POST', body })
        if (!resp.ok) {
          const text = await resp.text()
          return res.status(resp.status).json({ error: 'Translate API error', details: text })
        }
        const data = await resp.json()
        const translation = data?.data?.translations?.[0]?.translatedText || html
        return res.json({ html: translation, translations: [translation] })
      }

      // Simple text translation path
      const body = new URLSearchParams()
      if (Array.isArray(q)) q.forEach(t => body.append('q', t))
      else body.append('q', q)
      body.append('target', target)
      if (source) body.append('source', source)

      const resp = await fetch(url, { method: 'POST', body })
      if (!resp.ok) {
        const text = await resp.text()
        return res.status(resp.status).json({ error: 'Translate API error', details: text })
      }
      const data = await resp.json()
      return res.json(data)
    } catch (err) {
      return res.status(500).json({ error: 'Translate proxy failed', message: err?.message })
    }
  })

  return router
}

export default createTranslateRouter
