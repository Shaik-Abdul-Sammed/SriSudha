import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { sharedAssignments, studentSubmissions, STUDENT } from '../../utils/studentMockData'

const diffDays = (dateStr) => Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))

const getStatus = (a, subs) => {
  if (subs[a.id]) return 'submitted'
  if (a.status === 'closed') return 'closed'
  if (diffDays(a.due) < 0) return 'overdue'
  return 'pending'
}

const statusMeta = {
  submitted: { label: 'Submitted', color: '#10B981', bg: '#10B98112', icon: '✅' },
  pending:   { label: 'Pending',   color: '#2563EB', bg: '#2563EB12', icon: '⏳' },
  overdue:   { label: 'Overdue',   color: '#EF4444', bg: '#EF444412', icon: '🚨' },
  closed:    { label: 'Closed',    color: '#94a3b8', bg: '#94a3b812', icon: '🔒' },
}

export default function Page() {
  const [subs] = useState(studentSubmissions)
  const [filter, setFilter] = useState('all')

  const assignments = sharedAssignments.filter(a => a.section === STUDENT.section || a.section === 'All')

  const counts = { all: assignments.length, submitted: 0, pending: 0, overdue: 0, closed: 0 }
  assignments.forEach(a => { const s = getStatus(a, subs); counts[s] = (counts[s] || 0) + 1 })

  const filtered = filter === 'all' ? assignments : assignments.filter(a => getStatus(a, subs) === filter)

  const statCards = [
    { key: 'all',       label: 'Total',     icon: '📋', color: '#2563EB' },
    { key: 'submitted', label: 'Submitted', icon: '✅', color: '#10B981' },
    { key: 'pending',   label: 'Pending',   icon: '⏳', color: '#F59E0B' },
    { key: 'overdue',   label: 'Overdue',   icon: '🚨', color: '#EF4444' },
  ]

  const submittedOnTime = assignments.filter(a => subs[a.id] && diffDays(a.due) >= 0).length
  const submissionRate = assignments.length > 0 ? Math.round((counts.submitted / assignments.length) * 100) : 0

  return (
    <RolePageTemplate role="Student" title="Submission Status" description="Track all your assignment submissions — submitted, pending, and overdue.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {statCards.map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              style={{ padding: '1rem', borderRadius: '1rem', border: `2px solid ${filter === s.key ? s.color : 'transparent'}`, background: filter === s.key ? `${s.color}12` : 'var(--card-bg)', cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s ease' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: s.color, lineHeight: 1 }}>{counts[s.key] || 0}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* Submission Rate Bar */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Overall Submission Rate</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: submissionRate >= 75 ? '#10B981' : '#EF4444' }}>{submissionRate}%</span>
          </div>
          <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5 }}>
            <div style={{ height: '100%', width: `${submissionRate}%`, background: `linear-gradient(90deg, ${submissionRate >= 75 ? '#10B981' : '#EF4444'}, ${submissionRate >= 75 ? '#06B6D4' : '#F59E0B'})`, borderRadius: 5, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{submittedOnTime} on time</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{counts.overdue} overdue</span>
          </div>
        </div>

        {/* Assignment Status Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              {filter === 'all' ? 'All Assignments' : `${statusMeta[filter]?.label || filter} Assignments`}
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>#</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>Assignment</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>Subject</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>Faculty</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>Due Date</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>Marks</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => {
                  const st = getStatus(a, subs)
                  const meta = statusMeta[st]
                  const sub = subs[a.id]
                  return (
                    <tr key={a.id} style={{ borderLeft: st === 'overdue' ? '3px solid #EF4444' : st === 'submitted' ? '3px solid #10B981' : '3px solid transparent' }}>
                      <td style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--svc-navy)', maxWidth: 200 }}>
                        <div>{a.title}</div>
                        {sub?.feedback && <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>💬 {sub.feedback}</div>}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>{a.subject}</td>
                      <td style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>{a.faculty}</td>
                      <td style={{ fontSize: '0.82rem', color: st === 'overdue' ? '#EF4444' : '#475569', fontWeight: st === 'overdue' ? 700 : 500, whiteSpace: 'nowrap' }}>{a.due}</td>
                      <td style={{ fontSize: '0.82rem', fontWeight: 700, color: sub?.score != null ? '#10B981' : '#475569', whiteSpace: 'nowrap' }}>
                        {sub?.score != null ? `${sub.score}/${a.maxMarks}` : `—/${a.maxMarks}`}
                      </td>
                      <td>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', background: meta.bg, color: meta.color, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>{sub ? sub.submittedOn : '—'}</td>
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
