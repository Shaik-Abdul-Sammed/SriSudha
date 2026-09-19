import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const subjects = [
  { code: 'PHY101', name: 'Physics',     maxInternal: 30, maxExternal: 70 },
  { code: 'CHE101', name: 'Chemistry',   maxInternal: 30, maxExternal: 70 },
  { code: 'MAT101', name: 'Mathematics', maxInternal: 30, maxExternal: 70 },
  { code: 'BIO101', name: 'Biology',     maxInternal: 30, maxExternal: 70 },
]

const students = [
  { id: 'ss26', name: 'Sai Sree',       section: 'MPC-A' },
  { id: 'ss29', name: 'Anika Rao',      section: 'MPC-A' },
  { id: 'ss31', name: 'Pooja Sharma',   section: 'MPC-A' },
  { id: 'ss32', name: 'Ravi Teja',      section: 'MPC-A' },
]

const BLUE = '#2563EB'

function getGrade(score, max) {
  const pct = (score / max) * 100
  if (pct >= 90) return { label: 'A+', color: '#10B981' }
  if (pct >= 75) return { label: 'A',  color: '#2563EB' }
  if (pct >= 60) return { label: 'B',  color: '#F59E0B' }
  if (pct >= 45) return { label: 'C',  color: '#F97316' }
  return { label: 'F', color: '#EF4444' }
}

export default function Page() {
  const [subject, setSubject] = useState(subjects[0])
  const [marks, setMarks] = useState(() => {
    const init = {}
    students.forEach(s => { init[s.id] = { internal: '', external: '' } })
    return init
  })
  const [published, setPublished] = useState(false)

  function update(id, field, val) {
    setPublished(false)
    setMarks(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }))
  }

  const totalMax = subject.maxInternal + subject.maxExternal

  return (
    <RolePageTemplate role="Faculty" title="Marks Entry" description="Enter and publish continuous assessment and final examination marks.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Subject Tabs */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Select Subject</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {subjects.map(s => (
                <button key={s.code} onClick={() => setSubject(s)}
                  style={{
                    padding: '0.5rem 1.1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                    background: subject.code === s.code ? `linear-gradient(135deg,${BLUE},#06B6D4)` : 'rgba(37,99,235,0.08)',
                    color: subject.code === s.code ? 'white' : BLUE,
                    boxShadow: subject.code === s.code ? `0 4px 12px ${BLUE}40` : 'none',
                    transition: 'all 0.2s',
                  }}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>✏️ {subject.name} ({subject.code})</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>Internal: /{subject.maxInternal} · External: /{subject.maxExternal} · Total: /{totalMax}</p>
              </div>
              {published && <span style={{ padding: '0.35rem 0.85rem', borderRadius: '2rem', background: '#10B98115', color: '#10B981', fontWeight: 700, fontSize: '0.78rem', border: '1px solid #10B98130' }}>✓ Published</span>}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#', 'Student', 'Section', 'Internal', 'External', 'Total', 'Grade'].map(h => (
                      <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.6rem 0.75rem', textAlign: h === '#' ? 'center' : 'left', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, idx) => {
                    const m = marks[st.id]
                    const intern = parseInt(m.internal) || 0
                    const extern = parseInt(m.external) || 0
                    const total  = intern + extern
                    const grade  = m.internal !== '' || m.external !== '' ? getGrade(total, totalMax) : null
                    return (
                      <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>{idx + 1}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{st.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{st.id}</div>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.82rem', color: '#475569' }}>{st.section}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <input type="number" min="0" max={subject.maxInternal} value={m.internal}
                            onChange={e => update(st.id, 'internal', e.target.value)}
                            style={{ width: 64, padding: '0.4rem 0.5rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.88rem', textAlign: 'center' }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <input type="number" min="0" max={subject.maxExternal} value={m.external}
                            onChange={e => update(st.id, 'external', e.target.value)}
                            style={{ width: 64, padding: '0.4rem 0.5rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.88rem', textAlign: 'center' }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 800, fontSize: '1rem', color: grade ? grade.color : '#94a3b8' }}>{grade ? total : '—'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          {grade && (
                            <span style={{ padding: '0.25rem 0.6rem', borderRadius: '0.5rem', background: `${grade.color}15`, color: grade.color, fontWeight: 800, fontSize: '0.82rem', border: `1px solid ${grade.color}25` }}>
                              {grade.label}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setPublished(false)} className="btn btn-sm btn-outline-secondary">Save Draft</button>
              <button onClick={() => setPublished(true)} className="btn btn-sm" style={{ background: `linear-gradient(135deg,${BLUE},#06B6D4)`, color: 'white', border: 'none', fontWeight: 700, boxShadow: `0 4px 12px ${BLUE}40` }}>
                📤 Publish Marks
              </button>
            </div>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
