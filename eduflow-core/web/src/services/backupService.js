import axios from 'axios'
import { getApiBaseURL } from '../config/apiConfig'

function getApi() {
  return axios.create({
    baseURL: getApiBaseURL(),
    timeout: 5000,
  })
}

export async function getBackupStatus() {
  const api = getApi()
  const response = await api.get('/backup/status')
  return response.data
}

export async function getBackupSnapshots() {
  const api = getApi()
  const response = await api.get('/backup/snapshots')
  return response.data?.items ?? []
}

export async function createBackupSnapshot(note = 'manual') {
  const api = getApi()
  const response = await api.post('/backup/snapshot', { note })
  return response.data?.snapshot ?? null
}

export async function exportBackupSnapshot(snapshotId) {
  const api = getApi()
  const response = await api.get(snapshotId ? `/backup/export/${snapshotId}` : '/backup/export')
  return response.data
}

export async function restoreBackupSnapshot(snapshotId, mode = 'preview') {
  const api = getApi()
  const response = await api.post(`/backup/restore/${snapshotId}`, { mode })
  return response.data
}