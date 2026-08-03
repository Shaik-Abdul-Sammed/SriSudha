import { attendanceTrend, instituteStats, marksTrend, timetableRows } from '../mockData'

describe('mockData', () => {
  it('exposes metrics and preview rows used by the UI', () => {
    expect(instituteStats).toHaveLength(4)
    expect(timetableRows).toHaveLength(5)
    expect(marksTrend[0]).toHaveProperty('month', 'Jan')
    expect(attendanceTrend[0]).toHaveProperty('attendance', 95)
  })
})
