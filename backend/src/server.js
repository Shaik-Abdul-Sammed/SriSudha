import dotenv from 'dotenv'
import { createApp } from './app.js'

dotenv.config()

const app = createApp()
const BASE_PORT = Number(process.env.PORT || 4000)

function listenOnPort(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server))

    server.on('error', (error) => {
      server.close(() => reject(error))
    })
  })
}

async function startServer() {
  const maxAttempts = 5

  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const port = BASE_PORT + offset

    try {
      await listenOnPort(port)
      // eslint-disable-next-line no-console
      console.log(`Backend running on http://localhost:${port}`)
      return
    } catch (error) {
      if (error?.code !== 'EADDRINUSE' || offset === maxAttempts - 1) {
        throw error
      }

      // eslint-disable-next-line no-console
      console.warn(`Port ${port} is busy, trying ${port + 1}...`)
    }
  }
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start backend:', error.message)
  process.exit(1)
})
