import { Router } from 'express'
import multer from 'multer'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { DigitalTwinController } from '../controllers/DigitalTwinController.js'

export function createDigitalTwinRouter() {
  const router = Router()

  // Configure multer for file uploads in memory
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      // Security: Only allow PDFs and specific document types, preventing executable uploads
      const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed.'))
      }
    }
  })

  router.use(authMiddleware)

  /**
   * POST /api/v1/digital-twin/ingest
   * Uploads a document (PDF, TXT, DOCX) and ingests it into the AI's knowledge base.
   */
  router.post('/ingest', requireRole(['admin']), upload.single('file'), DigitalTwinController.ingestDocument)

  return router
}
