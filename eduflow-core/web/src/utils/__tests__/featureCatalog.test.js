import { adminFeatures, facultyFeatures, parentFeatures, studentFeatures } from '../featureCatalog'

describe('featureCatalog', () => {
  it('contains rich feature lists for each role', () => {
    expect(studentFeatures.length).toBeGreaterThan(10)
    expect(facultyFeatures.length).toBeGreaterThan(10)
    expect(parentFeatures.length).toBeGreaterThan(10)
    expect(adminFeatures.length).toBeGreaterThan(10)
    expect(studentFeatures).toContain('Attendance Overview')
    expect(adminFeatures).toContain('Audit Logs')
  })
})
