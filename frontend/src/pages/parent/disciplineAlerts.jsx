import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

const initialAlerts = [
  { id: 1, type: 'Late Arrival', date: '2026-05-28', desc: 'Arrived at assembly 20 minutes late. Second notice this week.', severity: 'medium', acknowledged: false },
  { id: 2, type: 'Dress Code Violation', date: '2026-05-15', desc: 'Attended chemistry lab without complete uniform and safety shoes.', severity: 'low', acknowledged: true },
]

export default function Page() {
  const [alerts, setAlerts] = useState(initialAlerts)

  function acknowledge(id) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
  }

  return (
    <RolePageTemplate role="Parent" title="Disciplinary Logs & Compliance" description="Review institutional compliance notes, uniform checks, and attendance timings.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Status indicator */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden', background: alerts.some(a => !a.acknowledged) ? 'linear-gradient(135deg, #1E293B, #EF4444)' : 'linear-gradient(135deg, #1E293B, #10B981)', color: 'white' }}>
          <div className="card-body p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge text-bg-light mb-2" style={{ fontWeight: 700 }}>COMPLIANCE RATING</span>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                {alerts.some(a => !a.acknowledged) ? 'Requires Immediate Review' : 'Excellent Institutional Standing'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                Ensure your child adheres to strict uniform codes and laboratory safety procedures daily.
              </p>
            </div>
            <span style={{ padding: '0.5rem 1.25rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem', fontWeight: 800 }}>
              {alerts.some(a => !a.acknowledged) ? '⚠️ Alert Pending' : '✓ Verified'}
            </span>
          </div>
        </div>

        {/* Alerts feed */}
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {alerts.map(a => {
            const isHigh = a.severity === 'high' || a.severity === 'medium'
            return (
              <div key={a.id} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem', borderLeft: `4px solid ${a.acknowledged ? GREEN : isHigh ? RED : AMBER}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="badge text-bg-light" style={{ border: '1px solid var(--border-color)', marginRight: '0.5rem' }}>{a.type}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📅 {a.date}</span>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '2rem',
                    background: a.acknowledged ? `${GREEN}12` : `${RED}12`,
                    color: a.acknowledged ? GREEN : RED,
                    fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                  }}>
                    {a.acknowledged ? 'Acknowledged' : 'New Warning'}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.875rem', lineHeight: 1.5 }}>{a.desc}</p>
                {!a.acknowledged && (
                  <button className="btn btn-sm btn-outline-danger align-self-start" onClick={() => acknowledge(a.id)} style={{ fontSize: '0.72rem' }}>
                    ✍️ Acknowledge warning receipt
                  </button>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </RolePageTemplate>
  )
}
