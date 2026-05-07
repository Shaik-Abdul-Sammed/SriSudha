import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('schema defines unique and timestamp indexes', () => {
  const schema = fs.readFileSync(path.join(process.cwd(), 'sql', 'schema.sql'), 'utf8')

  assert.match(schema, /UNIQUE \(role, route_path\)/i)
  assert.match(schema, /CREATE INDEX IF NOT EXISTS recent_searches_role_created_idx/i)
})
