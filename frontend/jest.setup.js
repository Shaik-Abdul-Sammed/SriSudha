import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'node:util'

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder
}

// Mock import.meta for Jest
if (!globalThis.import) {
  globalThis.import = {}
}
if (!globalThis.import.meta) {
  globalThis.import.meta = {
    env: {
      VITE_API_BASE_URL: 'http://localhost:4000/api',
    },
  }
}

const originalConsoleError = console.error.bind(console)

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const [message] = args
      if (typeof message === 'string') {
        if (message.includes('not wrapped in act')) return
        if (message.includes('Dashboard error')) return
        if (message.includes('Database connection failed')) return
      }

      originalConsoleError(...args)
  })
})

afterAll(() => {
  console.error.mockRestore?.()
})
