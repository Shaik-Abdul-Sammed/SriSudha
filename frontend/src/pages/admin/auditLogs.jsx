import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

const initialLogs = [
  { id: 1, timestamp: '2026-06-01 10:14:22', user: 'admin', role: 'Administrator', action: 'Created backup snapshot BK_8823', category: 'System', ip: '192.168.1.5', status: 'success' },
  { id: 2, timestamp: '2026-06-01 09:45:10', user: 'kavitha_faculty', role: 'Faculty', action: 'Published Maths Wave Optics marks', category: 'Academics', ip: '192.168.1.18', status: 'success' },
  { id: 3, timestamp: '2026-06-01 08:30:15', user: 'unknown', role: 'Visitor', action: 'Failed login attempt (invalid password)', category: 'Security', ip: '203.0.113.88', status: 'failed' },
  { id: 4, timestamp: '2026-05-31 16:20:44', user: 'admin', role: 'Administrator', action: 'Modified role permissions for Faculty', category: 'Security', ip: '192.168.1.5', status: 'success' },
  { id: 5, timestamp: '2026-05-31 14:10:00', user: 'ravi_faculty', role: 'Faculty', action: 'Created assignment "Wave Optics Problem Set"', category: 'Academics', ip: '192.168.1.22', status: 'success' },
]

export default function Page() {
  const [logs, setLogs] = useState(initialLogs)
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? logs : logs.filter(l => l.category === filter)

  return (
    <RolePageTemplate role="Admin" title="Audit Logs" description="Real-time institutional system log of administrative, security, and academic activities.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Analytics mini summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total Logs', value: logs.length, color: PURPLE, icon: '📜' },
            { label: 'Security Alerts', value: logs.filter(l => l.category === 'Security' && l.status === 'failed').length, color: RED, icon: '⚠️' },
            { label: 'Successful Executions', value: logs.filter(l => l.status === 'success').length, color: GREEN, icon: '✓' },
            { label: 'Monitored IPs', value: new Set(logs.map(l => l.ip)).size, color: AMBER, icon: '🌐' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'System', 'Security', 'Academics'].map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{
                padding: '0.4rem 0.875rem', borderRadius: '2rem',
                border: `2px solid ${filter === c ? PURPLE : 'var(--border-color)'}`,
                background: filter === c ? `${PURPLE}15` : 'var(--card-bg)',
                color: filter === c ? PURPLE : '#64748b', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
              }}>
              {c} Logs
            </button>
          ))}
        </div>

        {/* Audit Log Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>System Transactions</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Timestamp', 'User', 'Role', 'Category', 'Action performed', 'IP Address', 'Status'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} style={{ borderLeft: l.status === 'failed' ? '3px solid #EF4444' : '3px solid transparent' }}>
                    <td style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>{l.timestamp}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 700 }}>{l.user}</td>
                    <td style={{ fontSize: '0.82rem', color: '#475569' }}>{l.role}</td>
                    <td>
                      <span className="badge text-bg-light" style={{ border: '1px solid var(--border-color)' }}>{l.category}</span>
                    </td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{l.action}</td>
                    <td style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{l.ip}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: l.status === 'success' ? '#10B98115' : '#EF444415',
                        color: l.status === 'success' ? GREEN : RED,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </RolePageTemplate>
  )
}
