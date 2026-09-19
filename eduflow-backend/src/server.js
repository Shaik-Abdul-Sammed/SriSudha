import dotenv from 'dotenv'
import { createApp } from './app.js'
import { Server } from 'socket.io'

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
      const server = await listenOnPort(port)
      
      // Initialize Socket.io for Live User GPS tracking
      const io = new Server(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      })
      
      io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`)
        
        // Mock user GPS movement generator
        let lat = 17.3850
        let lng = 78.4867
        const interval = setInterval(() => {
          lat += (Math.random() - 0.5) * 0.0005
          lng += (Math.random() - 0.5) * 0.0005
          socket.emit('user_location_update', { 
            userId: 'U1001', 
            name: 'Shaik Abdul Sammed', 
            role: 'Student', 
            lat, 
            lng, 
            timestamp: new Date() 
          })
        }, 5000)
        
        socket.on('chat_message', (msg) => {
          // Broadcast to everyone (in a real app, use rooms per user)
          io.emit('chat_message', { ...msg, timestamp: new Date() })
        })

        socket.on('disconnect', () => {
          clearInterval(interval)
          console.log(`Socket disconnected: ${socket.id}`)
        })
      })

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
