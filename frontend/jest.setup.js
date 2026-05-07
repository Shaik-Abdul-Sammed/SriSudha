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
