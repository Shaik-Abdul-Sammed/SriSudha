import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { examSchedule } from '../../utils/studentMockData'

const typeColor = { unit: '#2563EB', midterm: '#F59E0B', practical: '#10B981' }
const typeBg = { unit: '#2563EB12', midterm: '#F59E0B12', practical: '#10B98112' }
const typeLabel = { unit: 'Unit Test', midterm: 'Mid-Term', practical: 'Practical' }

const daysUntil = (dateStr) => Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))

export default function Page() {
  const [filter, setFilter] = useState('all')
  const upcoming = examSchedule.filter(e => e.upcoming)
  const past = examSchedule.filter(e => !e.upcoming)

  const filtered = filter === 'all' ? upcoming : upcoming.filter(e => e.type === filter)

  return (
    <RolePageTemplate role="Student" title="Exam Schedule" description="View upcoming exam dates, halls, and past result scores.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Upcoming', value: upcoming.length, color: '#2563EB', icon: '📅' },
            { label: 'Unit Tests', value: upcoming.filter(e => e.type === 'unit').length, color: '#2563EB', icon: '📝' },
            { label: 'Practicals', value: upcoming.filter(e => e.type === 'practical').length, color: '#10B981', icon: '🧪' },
            { label: 'Mid-Terms', value: upcoming.filter(e => e.type === 'midterm').length, color: '#F59E0B', icon: '🏆' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'unit', 'midterm', 'practical'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '0.45rem 1rem', borderRadius: '2rem', border: `2px solid ${filter === f ? '#2563EB' : 'var(--border-color)'}`, background: filter === f ? '#2563EB15' : 'var(--card-bg)', color: filter === f ? '#2563EB' : '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All Types' : typeLabel[f]}
            </button>
          ))}
        </div>

        {/* Upcoming Exams */}
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.875rem' }}>📅 Upcoming Exams</h2>
          <div style={{ display: 'grid', gap: '0.875rem' }}>
            {filtered.map(exam => {
              const days = daysUntil(exam.date)
              const color = typeColor[exam.type]
              const urgency = days <= 3 ? '#EF4444' : days <= 7 ? '#F59E0B' : '#10B981'
              return (
                <div key={exam.id} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem', borderLeft: `4px solid ${color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{exam.name}</span>
                        <span style={{ padding: '0.2rem 0.7rem', borderRadius: '2rem', background: typeBg[exam.type], color, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{typeLabel[exam.type]}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>📚 {exam.subject}</span>
                        <span>📅 {exam.date}</span>
                        <span>⏰ {exam.time}</span>
                        <span>🏫 {exam.hall}</span>
                        <span>⌛ {exam.duration}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.6rem 1rem', borderRadius: '0.875rem', background: `${urgency}12`, border: `1px solid ${urgency}25`, flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '1.5rem', color: urgency, lineHeight: 1 }}>{days}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Days Left</div>
                    </div>
                  </div>
                  {days <= 7 && (
                    <div style={{ marginTop: '0.875rem', padding: '0.6rem 0.875rem', borderRadius: '0.75rem', background: '#F59E0B10', border: '1px solid #F59E0B25', fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>
                      ⚡ Start revision now! {days <= 3 ? 'Less than 3 days remaining!' : 'Exam within a week.'}
                    </div>
                  )}
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
                <div style={{ fontWeight: 600 }}>No upcoming exams for this filter.</div>
              </div>
            )}
          </div>
        </div>

        {/* Past Exams */}
        {past.length > 0 && (
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.875rem' }}>📜 Past Exams & Results</h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {past.map(exam => {
                const scorePct = exam.scored != null ? Math.round((exam.scored / exam.max) * 100) : null
                const c = scorePct >= 75 ? '#10B981' : scorePct >= 50 ? '#F59E0B' : '#EF4444'
                return (
                  <div key={exam.id} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem 1.5rem', opacity: 0.85 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{exam.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📚 {exam.subject} • 📅 {exam.date}</div>
                      </div>
                      {scorePct != null && (
                        <div style={{ textAlign: 'center', padding: '0.5rem 0.875rem', borderRadius: '0.75rem', background: `${c}12` }}>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: c }}>{exam.scored}/{exam.max}</div>
                          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{scorePct}%</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </RolePageTemplate>
  )
}
