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

function createMockDb() {
  const rows = [
    {
      role: 'admin',
      query: 'Backup Management',
      routePath: '/admin-dashboard/backup-management',
      createdAt: new Date('2026-05-08T10:00:00.000Z').toISOString(),
    },
    {
      role: 'admin',
      query: 'System Health',
      routePath: '/admin-dashboard/system-health',
      createdAt: new Date('2026-05-08T09:30:00.000Z').toISOString(),
    },
  ]

  return {
    query: async (sql) => {
      if (sql.includes('FROM recent_searches')) {
        return { rows }
      }

      return { rows: [] }
    },
  }
}

test('backup routes expose status and snapshots', async () => {
  const { server, baseUrl } = await startServer(createApp({ db: createMockDb() }))

  try {
    const created = await fetch(`${baseUrl}/api/v1/backup/snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: 'nightly' }),
    })
    const createdBody = await created.json()

    assert.equal(created.status, 201)
    assert.equal(createdBody.snapshot.recordCount, 2)

    const statusResponse = await fetch(`${baseUrl}/api/v1/backup/status`)
    const statusBody = await statusResponse.json()

    assert.equal(statusResponse.status, 200)
    assert.equal(statusBody.snapshotCount, 1)
    assert.equal(statusBody.rowCount, 2)

    const exportResponse = await fetch(`${baseUrl}/api/v1/backup/export/${createdBody.snapshot.id}`)
    const exportBody = await exportResponse.json()

    assert.equal(exportResponse.status, 200)
    assert.match(exportBody.export, /Backup Management/)
  } finally {
    server.close()
  }
})