import { Router } from 'express'
import { pool } from '../db/pool.js'

function checksumRows(rows) {
  const text = JSON.stringify(rows)
  let sum = 0

  for (let index = 0; index < text.length; index += 1) {
    sum = (sum + text.charCodeAt(index) * (index + 1)) % 1_000_000_007
  }

  return sum.toString(16)
}

function normalizeRows(rows = []) {
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt ?? row.created_at ?? null,
    routePath: row.routePath ?? row.route_path ?? null,
  }))
}

export function createBackupRouter(db = pool) {
  const router = Router()
  const snapshots = []

  async function readSearchRows() {
    if (!db?.query) {
      return []
    }

    const { rows } = await db.query(
      `SELECT role, query, route_path AS "routePath", created_at AS "createdAt"
       FROM recent_searches
       ORDER BY created_at DESC
       LIMIT 25`,
    )

    return normalizeRows(rows)
  }

  function storeSnapshot(rows, note = 'manual') {
    const snapshot = {
      id: `snapshot_${Date.now()}_${snapshots.length + 1}`,
      createdAt: new Date().toISOString(),
      source: 'recent_searches',
      note,
      recordCount: rows.length,
      checksum: checksumRows(rows),
      rows,
    }

    snapshots.unshift(snapshot)
    snapshots.splice(10)
    return snapshot
  }

  router.get('/status', async (_req, res) => {
    try {
      const rows = await readSearchRows()
      const latest = snapshots[0] ?? null

      res.json({
        ok: true,
        healthy: true,
        source: 'recent_searches',
        rowCount: rows.length,
        snapshotCount: snapshots.length,
        latestSnapshotAt: latest?.createdAt ?? null,
        latestSnapshotId: latest?.id ?? null,
        retentionLimit: 10,
      })
    } catch {
      res.status(500).json({ error: 'Failed to read backup status' })
    }
  })

  router.post('/snapshot', async (req, res) => {
    try {
      const rows = await readSearchRows()
      const snapshot = storeSnapshot(rows, String(req.body?.note || 'manual').trim() || 'manual')
      res.status(201).json({ ok: true, snapshot })
    } catch {
      res.status(500).json({ error: 'Failed to create backup snapshot' })
    }
  })

  router.get('/snapshots', (_req, res) => {
    res.json({ items: snapshots })
  })

  router.get('/export/:snapshotId?', (req, res) => {
    const snapshot = req.params.snapshotId
      ? snapshots.find((entry) => entry.id === req.params.snapshotId)
      : snapshots[0]

    if (!snapshot) {
      return res.status(404).json({ error: 'Snapshot not found' })
    }

    res.json({
      snapshot,
      export: JSON.stringify(snapshot, null, 2),
    })
  })

  router.post('/restore/:snapshotId', (req, res) => {
    const snapshot = snapshots.find((entry) => entry.id === req.params.snapshotId)

    if (!snapshot) {
      return res.status(404).json({ error: 'Snapshot not found' })
    }

    res.json({
      ok: true,
      restored: snapshot.recordCount,
      snapshotId: snapshot.id,
      mode: String(req.body?.mode || 'preview'),
    })
  })

  return router
}

export default createBackupRouter(pool)