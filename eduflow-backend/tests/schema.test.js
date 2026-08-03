import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const schemaPath = path.join(process.cwd(), 'sql', 'schema.sql')

test('database schema defines recent_searches table and index', () => {
  const sql = fs.readFileSync(schemaPath, 'utf8')

  assert.match(sql, /CREATE TABLE IF NOT EXISTS recent_searches/i)
  assert.match(sql, /UNIQUE \(role, route_path\)/i)
  assert.match(sql, /CREATE INDEX IF NOT EXISTS recent_searches_role_created_idx/i)
})
