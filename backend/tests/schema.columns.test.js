import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('schema defines the recent_searches table columns', () => {
  const schema = fs.readFileSync(path.join(process.cwd(), 'sql', 'schema.sql'), 'utf8')

  assert.match(schema, /role TEXT NOT NULL/i)
  assert.match(schema, /query TEXT NOT NULL/i)
  assert.match(schema, /route_path TEXT NOT NULL/i)
  assert.match(schema, /created_at TIMESTAMPTZ NOT NULL DEFAULT NOW\(\)/i)
})
