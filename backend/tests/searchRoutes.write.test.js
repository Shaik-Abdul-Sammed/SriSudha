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

test('POST recent searches persists and trims payload', async () => {
  const calls = []
  const db = {
    query: async (sql, params) => {
      calls.push({ sql, params })
      return { rows: [] }
    },
  }

  const { server, baseUrl } = await startServer(createApp({ db }))

  try {
    const response = await fetch(`${baseUrl}/api/search/recent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'student',
        query: 'Attendance Overview',
        routePath: '/student-dashboard/attendance-overview',
      }),
    })

    assert.equal(response.status, 201)
    assert.equal(calls.length, 2)
    assert.match(calls[0].sql, /INSERT INTO recent_searches/)
    assert.match(calls[1].sql, /DELETE FROM recent_searches/)
  } finally {
    server.close()
  }
})
