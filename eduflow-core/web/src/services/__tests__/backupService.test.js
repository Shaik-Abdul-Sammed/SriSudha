import axios from 'axios'
import {
  createBackupSnapshot,
  exportBackupSnapshot,
  getBackupSnapshots,
  getBackupStatus,
  restoreBackupSnapshot,
} from '../backupService'

const mockApi = {
  get: jest.fn(async (path) => {
    if (path === '/backup/status') {
      return { data: { healthy: true, snapshotCount: 1, rowCount: 2, retentionLimit: 10 } }
    }

    if (path === '/backup/snapshots') {
      return { data: { items: [{ id: 'snapshot_1', recordCount: 2 }] } }
    }

    return {
      data: {
        snapshot: { id: path.split('/').pop(), recordCount: 2 },
        export: '{"snapshot":true}',
      },
    }
  }),
  post: jest.fn(async (_path, body) => ({
    data: {
      ok: true,
      snapshot: { id: 'snapshot_2', recordCount: 2, note: body.note },
      restored: 2,
      snapshotId: 'snapshot_2',
    },
  })),
}

jest.mock('axios', () => ({
  create: jest.fn(() => mockApi),
}))

describe('backupService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('reads backup status and snapshots', async () => {
    const status = await getBackupStatus()
    const snapshots = await getBackupSnapshots()

    expect(axios.create).toHaveBeenCalled()
    expect(status.snapshotCount).toBe(1)
    expect(snapshots).toHaveLength(1)
  })

  it('creates and exports snapshots', async () => {
    const snapshot = await createBackupSnapshot('nightly')
    const exported = await exportBackupSnapshot(snapshot.id)
    const restored = await restoreBackupSnapshot(snapshot.id)

    expect(mockApi.post).toHaveBeenCalledWith('/backup/snapshot', { note: 'nightly' })
    expect(exported.snapshot.id).toBe('snapshot_2')
    expect(restored.snapshotId).toBe('snapshot_2')
  })
})