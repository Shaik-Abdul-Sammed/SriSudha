import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const GREEN = '#10B981'
const AMBER = '#F59E0B'
const BLUE = '#2563EB'

const stageColor = {
  inquiry: '#64748b',
  applied: '#3b82f6',
  review: '#f59e0b',
  offered: '#8b5cf6',
  admitted: '#10b981',
}

const initialApplicants = [
  { id: 'APP001', name: 'Rahul Varma', stream: 'MPC', score: 92, stage: 'admitted', date: '2026-05-28' },
  { id: 'APP002', name: 'Sneha Patel', stream: 'BIPC', score: 88, stage: 'offered', date: '2026-05-29' },
  { id: 'APP003', name: 'Sai Charan', stream: 'MPC', score: 85, stage: 'review', date: '2026-05-30' },
  { id: 'APP004', name: 'Kavya Naidu', stream: 'MBIPC', score: 94, stage: 'review', date: '2026-06-01' },
  { id: 'APP005', name: 'Vikram Seth', stream: 'MPC', score: 72, stage: 'applied', date: '2026-06-01' },
]

export default function Page() {
  const [applicants, setApplicants] = useState(initialApplicants)
  const [filter, setFilter] = useState('all')

  function advanceStage(id) {
    setApplicants(prev => prev.map(a => {
      if (a.id !== id) return a
      const nextStage = a.stage === 'applied' ? 'review' : a.stage === 'review' ? 'offered' : a.stage === 'offered' ? 'admitted' : a.stage
      return { ...a, stage: nextStage }
    }))
  }

  const filtered = filter === 'all' ? applicants : applicants.filter(a => a.stage === filter)

  return (
    <RolePageTemplate role="Admin" title="Admissions Pipeline" description="Track application flow from inquiry to institutional enrollment.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        
        {/* Conversion Funnel Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Applied', value: applicants.filter(a => a.stage === 'applied').length, color: stageColor.applied },
            { label: 'Under Review', value: applicants.filter(a => a.stage === 'review').length, color: stageColor.review },
            { label: 'Offered', value: applicants.filter(a => a.stage === 'offered').length, color: stageColor.offered },
            { label: 'Admitted', value: applicants.filter(a => a.stage === 'admitted').length, color: stageColor.admitted },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.4rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'applied', 'review', 'offered', 'admitted'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '2rem',
                border: `2px solid ${filter === f ? PURPLE : 'var(--border-color)'}`,
                background: filter === f ? `${PURPLE}15` : 'var(--card-bg)',
                color: filter === f ? PURPLE : '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
              }}>
              {f === 'all' ? 'All Applications' : f}
            </button>
          ))}
        </div>

        {/* Applicants Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Applicants list</h2>
            <span className="badge text-bg-light">{filtered.length} total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['App ID', 'Name', 'Stream', 'Score', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id}>
                    <td style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>{app.id}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{app.name}</td>
                    <td><span className="badge text-bg-primary">{app.stream}</span></td>
                    <td style={{ fontWeight: 700 }}>{app.score}%</td>
                    <td>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', background: `${stageColor[app.stage]}15`, color: stageColor[app.stage], fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {app.stage}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{app.date}</td>
                    <td>
                      {app.stage !== 'admitted' ? (
                        <button className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.75rem' }} onClick={() => advanceStage(app.id)}>
                          Advance ➡️
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: GREEN, fontWeight: 700 }}>✅ Enrolled</span>
                      )}
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
