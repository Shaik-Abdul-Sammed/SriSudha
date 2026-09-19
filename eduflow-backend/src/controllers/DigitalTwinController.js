import { DigitalTwinService } from '../services/DigitalTwinService.js'
import { UserRepository } from '../repositories/UserRepository.js'

export class DigitalTwinController {
  static async ingestDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const fileName = req.file.originalname
      const fileSize = req.file.size
      const mimeType = req.file.mimetype

      // Call Service Layer
      const result = await DigitalTwinService.ingestDocument(req.file.buffer, fileName, mimeType)

      // In a real application we would insert `result.embeddings` and `result.extractedText` into pgvector
      // For this phase, we log the ingestion.
      await UserRepository.logAudit(
        req.user.institutionId,
        req.user.id,
        'KNOWLEDGE_DOCUMENT_INGESTED',
        req.ip,
        req.get('user-agent'),
        { fileName, fileSize, mimeType, tokens: result.tokens }
      )

      res.json({
        success: true,
        message: `Successfully ingested ${fileName}`,
        details: {
          fileName,
          sizeBytes: fileSize,
          estimatedTokens: result.tokens,
          status: 'embedded',
          // extractedText: result.extractedText // Omitting large text in response
        }
      })
    } catch (err) {
      console.error('Digital Twin ingestion error:', err)
      res.status(500).json({ error: 'Failed to ingest knowledge document' })
    }
  }
}
