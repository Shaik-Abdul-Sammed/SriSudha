import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'

function startServer(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address()
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` })
    })
  })
}

test('GET recent searches requires a role', async () => {
  const { server, baseUrl } = await startServer(createApp({ db: { query: async () => ({ rows: [] }) } }))

  try {
    const response = await fetch(`${baseUrl}/api/search/recent`)
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.error, 'role is required')
  } finally {
    server.close()
  }
})
