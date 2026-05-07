import axios from 'axios'
import { getRecentSearches, saveRecentSearch } from '../searchService'

const mockApi = {
  get: jest.fn(async () => ({ data: { items: [{ routePath: '/student-dashboard/attendance-overview' }] } })),
  post: jest.fn(async () => ({ data: { ok: true } })),
}

jest.mock('axios', () => ({
  create: jest.fn(() => mockApi),
}))

describe('searchService', () => {
  it('loads recent searches for a role', async () => {
    const items = await getRecentSearches('student')

    expect(axios.create).toHaveBeenCalled()
    expect(mockApi.get).toHaveBeenCalledWith('/search/recent', { params: { role: 'student' } })
    expect(items[0].routePath).toBe('/student-dashboard/attendance-overview')
  })

  it('saves recent searches', async () => {
    await saveRecentSearch({ role: 'student', query: 'Attendance Overview', routePath: '/student-dashboard/attendance-overview' })

    expect(mockApi.post).toHaveBeenCalledWith('/search/recent', {
      role: 'student',
      query: 'Attendance Overview',
      routePath: '/student-dashboard/attendance-overview',
    })
  })
})
