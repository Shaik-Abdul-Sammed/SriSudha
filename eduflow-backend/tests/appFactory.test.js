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

test('createApp wires injected database into search routes', async () => {
  const db = {
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

  const { server, baseUrl } = await startServer(createApp({ db }))

  try {
    const response = await fetch(`${baseUrl}/api/search/recent?role=student`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.items[0].routePath, '/student-dashboard/attendance-overview')
  } finally {
    server.close()
  }
})
