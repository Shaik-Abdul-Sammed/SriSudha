import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'

async function startServer(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address()
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      })
    })
  })
}

test('GET /api/search/recent validates role', async () => {
  const app = createApp({ db: { query: async () => ({ rows: [] }) } })
  const { server, baseUrl } = await startServer(app)

  try {
    const response = await fetch(`${baseUrl}/api/search/recent`)
    assert.equal(response.status, 400)
    const body = await response.json()
    assert.equal(body.error, 'role is required')
  } finally {
    server.close()
  }
})

test('GET /api/search/recent returns mapped items', async () => {
  const fakeDb = {
    query: async () => ({
      rows: [
        {
          role: 'student',
          query: 'Attendance Overview',
          routePath: '/student-dashboard/attendance-overview',
          createdAt: new Date().toISOString(),
        },
      ],
    }),
  }

  const app = createApp({ db: fakeDb })
  const { server, baseUrl } = await startServer(app)

  try {
    const response = await fetch(`${baseUrl}/api/search/recent?role=student`)
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(Array.isArray(body.items), true)
    assert.equal(body.items[0].title, 'Attendance Overview')
  } finally {
    server.close()
  }
})

test('POST /api/search/recent upserts and trims entries', async () => {
  const calls = []
  const fakeDb = {
    query: async (sql, params) => {
      calls.push({ sql, params })
      return { rows: [] }
    },
  }

  const app = createApp({ db: fakeDb })
  const { server, baseUrl } = await startServer(app)

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
