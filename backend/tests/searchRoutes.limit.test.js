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

test('GET recent searches uses the LIMIT 6 query', async () => {
  let queryText = ''
  const db = {
    query: async (sql) => {
      queryText = sql
      return { rows: [] }
    },
  }

  const { server, baseUrl } = await startServer(createApp({ db }))

  try {
    const response = await fetch(`${baseUrl}/api/search/recent?role=student`)
    assert.equal(response.status, 200)
    assert.match(queryText, /LIMIT 6/)
  } finally {
    server.close()
  }
})
