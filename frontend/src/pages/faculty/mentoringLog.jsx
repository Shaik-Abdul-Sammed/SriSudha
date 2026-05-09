import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { studentDummyIds } from '../../utils/studentCatalog'

const VIOLET = '#7C3AED'

const sessions = [
  { id: 1, student: 'Sai Sree', date: '2026-05-07', type: 'Academic Concern', duration: '25 min', notes: 'Discussed weak performance in trigonometry. Suggested extra practice problems and reference to HC Verma.', action: 'Weekly check-in scheduled', followUp: '2026-05-14' },
  { id: 2, student: 'Anika Rao', date: '2026-05-05', type: 'Career Guidance', duration: '40 min', notes: 'Explored JEE Mains preparation strategy. Recommended joining the accelerator batch.', action: 'Enrolled in JEE sprint sessions', followUp: '2026-05-20' },
  { id: 3, student: 'Ravi Teja', date: '2026-04-29', type: 'Personal Wellbeing', duration: '30 min', notes: 'Student expressed stress around upcoming exams. Discussed time management and sleep hygiene.', action: 'Referred to counselling cell', followUp: '2026-05-10' },
]

const sessionTypes = ['Academic Concern', 'Career Guidance', 'Personal Wellbeing', 'Attendance Issue', 'General Check-in']

export default function Page() {
  const [logs, setLogs] = useState(sessions)
  const [expanded, setExpanded] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ student: studentDummyIds[0].name, type: 'General Check-in', duration: '30 min', notes: '', action: '', followUp: '' })

  function addSession(e) {
    e.preventDefault()
    setLogs(prev => [{ id: Date.now(), date: new Date().toISOString().split('T')[0], ...form }, ...prev])
    setForm({ student: studentDummyIds[0].name, type: 'General Check-in', duration: '30 min', notes: '', action: '', followUp: '' })
    setShowForm(false)
  }

  const typeColor = { 'Academic Concern': '#EF4444', 'Career Guidance': '#2563EB', 'Personal Wellbeing': '#10B981', 'Attendance Issue': '#F59E0B', 'General Check-in': VIOLET }

  return (
    <RolePageTemplate role="Faculty" title="Mentoring Log" description="Record and review mentoring sessions with your assigned students.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Total Sessions', value: logs.length, color: VIOLET },
            { label: 'This Month', value: logs.filter(s => s.date.startsWith('2026-05')).length, color: '#2563EB' },
            { label: 'Students Mentored', value: [...new Set(logs.map(s => s.student))].length, color: '#10B981' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add Session Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowForm(v => !v)} className="btn" style={{
            background: `linear-gradient(135deg,${VIOLET},#2563EB)`, color: 'white', border: 'none',
            fontWeight: 700, borderRadius: '0.875rem', boxShadow: `0 4px 14px ${VIOLET}40`,
          }}>
            {showForm ? '✕ Cancel' : '+ Log Session'}
          </button>
        </div>

        {/* Log Form */}
        {showForm && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', border: `1px solid ${VIOLET}25` }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: VIOLET }}>📝 New Mentoring Session</h2>
              <form onSubmit={addSession}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>STUDENT</label>
                    <select className="form-select" value={form.student} onChange={e => setForm(p => ({...p, student: e.target.value}))}>
                      {studentDummyIds.map(s => <option key={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>SESSION TYPE</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                      {sessionTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>DURATION</label>
                    <select className="form-select" value={form.duration} onChange={e => setForm(p => ({...p, duration: e.target.value}))}>
                      {['15 min','30 min','45 min','60 min'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>FOLLOW-UP DATE</label>
                    <input type="date" className="form-control" value={form.followUp} onChange={e => setForm(p => ({...p, followUp: e.target.value}))} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>SESSION NOTES *</label>
                    <textarea required className="form-control" rows={3} placeholder="What was discussed?" value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>ACTION TAKEN</label>
                    <input className="form-control" placeholder="Recommended steps..." value={form.action} onChange={e => setForm(p => ({...p, action: e.target.value}))} />
                  </div>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn" style={{ background: `linear-gradient(135deg,${VIOLET},#2563EB)`, color: 'white', border: 'none', fontWeight: 700, borderRadius: '0.875rem' }}>
                    💾 Save Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {logs.map(session => {
            const color = typeColor[session.type] || VIOLET
            return (
              <div key={session.id} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', cursor: 'pointer', borderLeft: `4px solid ${color}` }}
                onClick={() => setExpanded(expanded === session.id ? null : session.id)}>
                <div style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}20`, color, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>
                          {session.student.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{session.student}</span>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '0.375rem', background: `${color}12`, color, fontSize: '0.7rem', fontWeight: 700 }}>{session.type}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', paddingLeft: 40 }}>📅 {session.date} · ⏱ {session.duration}</div>
                    </div>
                    {session.followUp && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>FOLLOW-UP</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: VIOLET }}>{session.followUp}</div>
                      </div>
                    )}
                  </div>
                  {expanded === session.id && (
                    <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.65, margin: '0 0 0.6rem' }}>{session.notes}</p>
                      {session.action && <div style={{ fontSize: '0.8rem', fontWeight: 600, color, padding: '0.5rem 0.75rem', borderRadius: '0.625rem', background: `${color}10` }}>⚡ Action: {session.action}</div>}
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
