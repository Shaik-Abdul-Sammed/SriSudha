import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { sharedAssignments, studentSubmissions } from '../../utils/studentMockData'

const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

export default function Page() {
  const [filter, setFilter] = useState('all')

  const enriched = sharedAssignments.map(asm => {
    const sub = studentSubmissions[asm.id]
    let status = 'pending'
    if (sub) {
      status = 'submitted'
    } else if (new Date(asm.due) < new Date('2026-06-01')) {
      status = 'overdue'
    }
    return { ...asm, status, submission: sub }
  })

  const filtered = filter === 'all' ? enriched : enriched.filter(e => e.status === filter)

  return (
    <RolePageTemplate role="Parent" title="Daily Homework & Assignments" description="Track class homework, verify completion, and view faculty marks feedback.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Filter keys */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'submitted', 'overdue'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '2rem',
                border: `2px solid ${filter === f ? AMBER : 'var(--border-color)'}`,
                background: filter === f ? `${AMBER}15` : 'var(--card-bg)',
                color: filter === f ? AMBER : '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
              }}>
              {f} homework
            </button>
          ))}
        </div>

        {/* Homework list */}
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {filtered.map(asm => {
            const isSub = asm.status === 'submitted'
            const isOver = asm.status === 'overdue'
            return (
              <div key={asm.id} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem', borderLeft: `4px solid ${isSub ? GREEN : isOver ? RED : AMBER}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="badge text-bg-light" style={{ border: '1px solid var(--border-color)', marginRight: '0.5rem' }}>{asm.subject}</span>
                    <strong style={{ fontSize: '0.95rem' }}>{asm.title}</strong>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '2rem',
                    background: isSub ? `${GREEN}12` : isOver ? `${RED}12` : `${AMBER}12`,
                    color: isSub ? GREEN : isOver ? RED : AMBER,
                    fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                  }}>
                    {asm.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.75rem', lineHeight: 1.5 }}>{asm.description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                  <div>📅 Due: <strong>{asm.due}</strong> • Max: <strong>{asm.maxMarks} marks</strong> • Mentor: <strong>{asm.faculty}</strong></div>
                  
                  {isSub && asm.submission.score !== undefined && (
                    <div style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', background: '#F0FDF4', border: '1px solid #DCFCE7', color: GREEN, fontWeight: 700 }}>
                      ⭐ Scored: {asm.submission.score} / {asm.maxMarks} • feedback: "{asm.submission.feedback}"
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </RolePageTemplate>
  )
}
