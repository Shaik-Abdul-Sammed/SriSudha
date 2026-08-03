import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

const auditList = [
  { id: 'AUD001', section: 'MPC-A', subject: 'Mathematics', date: '2026-06-01', present: 42, total: 45, status: 'regular', faculty: 'Dr. Kavitha Sharma' },
  { id: 'AUD002', section: 'BIPC-A', subject: 'Biology', date: '2026-06-01', present: 22, total: 40, status: 'low_attendance', faculty: 'Dr. Padma Rao' },
  { id: 'AUD003', section: 'MPC-B', subject: 'Physics', date: '2026-05-31', present: 30, total: 45, status: 'regular', faculty: 'Dr. Ravi Kumar' },
  { id: 'AUD004', section: 'MBIPC-A', subject: 'Chemistry', date: '2026-05-30', present: 33, total: 35, status: 'regular', faculty: 'Dr. Sujata Rao' },
  { id: 'AUD005', section: 'MPC-A', subject: 'English', date: '2026-05-29', present: 18, total: 45, status: 'extremely_low', faculty: 'Mrs. Anitha Reddy' },
]

export default function Page() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? auditList
    : auditList.filter(a => fmatches(a.status, filter))

  function fmatches(status, filter) {
    if (filter === 'discrepancy') return status.includes('low')
    return status === 'regular'
  }

  return (
    <RolePageTemplate role="Admin" title="Attendance Audit" description="Audit classroom presence logs, detect discrepancies, and view compliance status.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Audit status boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Audited Sessions', value: auditList.length, color: PURPLE, icon: '📋' },
            { label: 'Avg Presence Rate', value: '84.2%', color: GREEN, icon: '📊' },
            { label: 'Low Attendance Flags', value: auditList.filter(a => a.status.includes('low')).length, color: RED, icon: '🚨' },
            { label: 'Compliance Level', value: 'High', color: AMBER, icon: '🛡️' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color, lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'regular', 'discrepancy'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '2rem',
                border: `2px solid ${filter === f ? PURPLE : 'var(--border-color)'}`,
                background: filter === f ? `${PURPLE}15` : 'var(--card-bg)',
                color: filter === f ? PURPLE : '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
              }}>
              {f === 'discrepancy' ? '🚨 Discrepancies Only' : `${f} logs`}
            </button>
          ))}
        </div>

        {/* Audit Log Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Audited Classroom Records</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Section', 'Subject', 'Faculty', 'Date', 'Attendance Rate', 'Status'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(audit => {
                  const rate = Math.round((audit.present / audit.total) * 100)
                  const isLow = audit.status.includes('low')
                  return (
                    <tr key={audit.id}>
                      <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{audit.section}</td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{audit.subject}</td>
                      <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{audit.faculty}</td>
                      <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{audit.date}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: rate < 60 ? RED : 'var(--app-text)' }}>{audit.present}/{audit.total}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({rate}%)</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '2rem',
                          background: isLow ? `${RED}12` : `${GREEN}12`,
                          color: isLow ? RED : GREEN,
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                        }}>
                          {isLow ? '🚨 LOW FLAG' : '✓ OK'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </RolePageTemplate>
  )
}
