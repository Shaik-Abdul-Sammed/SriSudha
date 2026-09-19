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

test('POST recent searches normalizes role and trims text', async () => {
  let lastInsert = null
  const db = {
    query: async (sql, params) => {
      if (/INSERT INTO recent_searches/.test(sql)) {
        lastInsert = params
      }
      return { rows: [] }
    },
  }

  const { server, baseUrl } = await startServer(createApp({ db }))

  try {
    const response = await fetch(`${baseUrl}/api/search/recent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: ' STUDENT ',
        query: ' Attendance Overview ',
        routePath: ' /student-dashboard/attendance-overview ',
      }),
    })

    assert.equal(response.status, 201)
    assert.equal(lastInsert[0], 'student')
    assert.equal(lastInsert[1], 'Attendance Overview')
    assert.equal(lastInsert[2], '/student-dashboard/attendance-overview')
  } finally {
    server.close()
  }
})
