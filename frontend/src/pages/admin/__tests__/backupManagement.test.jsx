import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '../backupManagement'
import * as backupService from '../../../services/backupService'

jest.mock('../../../services/backupService')

describe('BackupManagement page', () => {
  beforeEach(() => {
    backupService.getBackupStatus.mockResolvedValue({
      healthy: true,
      snapshotCount: 1,
      rowCount: 2,
      retentionLimit: 10,
    })
    backupService.getBackupSnapshots.mockResolvedValue([
      {
        id: 'snapshot_1',
        recordCount: 2,
        checksum: 'abc123',
        createdAt: new Date('2026-05-08T10:00:00.000Z').toISOString(),
      },
    ])
    backupService.createBackupSnapshot.mockResolvedValue({ id: 'snapshot_2' })
    backupService.exportBackupSnapshot.mockResolvedValue({ snapshot: { id: 'snapshot_1' } })
    backupService.restoreBackupSnapshot.mockResolvedValue({ snapshotId: 'snapshot_1', restored: 2 })
  })

  it('renders backup metrics and snapshot history', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByText(/Backup Management/i)).toBeInTheDocument()
      expect(screen.getByText(/Snapshots/i)).toBeInTheDocument()
      expect(screen.getByText('snapshot_1')).toBeInTheDocument()
    })
  })

  it('creates a snapshot from the page action', async () => {
    render(<Page />)

    await waitFor(() => expect(screen.getByRole('button', { name: /Create Snapshot/i })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Create Snapshot/i }))

    await waitFor(() => {
      expect(backupService.createBackupSnapshot).toHaveBeenCalled()
    })
  })
})