import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'
const BLUE = '#2563EB'

const initialExams = [
  { id: 1, exam: 'Maths Unit Test 1', classAvg: '78.5%', compiled: true, published: true, date: '2026-05-10' },
  { id: 2, exam: 'English Assessment', classAvg: '88.0%', compiled: true, published: true, date: '2026-05-18' },
  { id: 3, exam: 'Physics Weekly Sprint 22', classAvg: '80.0%', compiled: true, published: false, date: '2026-05-31' },
  { id: 4, exam: 'Chemistry Weekly Sprint 22', classAvg: '70.0%', compiled: true, published: false, date: '2026-05-31' },
  { id: 5, exam: 'IIT-JEE Part Mock 3', classAvg: '68.0%', compiled: false, published: false, date: '2026-04-28' },
]

export default function Page() {
  const [exams, setExams] = useState(initialExams)

  function handlePublish(id) {
    setExams(prev => prev.map(e => e.id === id ? { ...e, published: true } : e))
  }

  function handleCompile(id) {
    setExams(prev => prev.map(e => e.id === id ? { ...e, compiled: true, classAvg: '74.2%' } : e))
  }

  return (
    <RolePageTemplate role="Admin" title="Result Publishing" description="Compile competitive exam answers, audit margins, and release marks directly to student/parent portals.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Results counters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Exams Run This Term', value: exams.length, color: PURPLE, icon: '📝' },
            { label: 'Compiled Marksheets', value: exams.filter(e => e.compiled).length, color: BLUE, icon: '📊' },
            { label: 'Published to Portals', value: exams.filter(e => e.published).length, color: GREEN, icon: '📢' },
            { label: 'Pending Compilation', value: exams.filter(e => !e.compiled).length, color: AMBER, icon: '⏳' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Exam marksheet release table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Institutional Examinations Marksheets</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Exam Title', 'Execution Date', 'Class Average', 'Syllabus Compiled', 'Status', 'Publish Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exams.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{e.exam}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{e.date}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 800, color: BLUE }}>{e.classAvg || '—'}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: e.compiled ? `${GREEN}12` : `${AMBER}12`,
                        color: e.compiled ? GREEN : AMBER,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {e.compiled ? '✓ Compiled' : '⏳ Processing'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: e.published ? `${GREEN}12` : `${RED}12`,
                        color: e.published ? GREEN : RED,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {e.published ? '📢 Published' : '🔒 Internal'}
                      </span>
                    </td>
                    <td>
                      {!e.compiled ? (
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleCompile(e.id)} style={{ fontSize: '0.72rem' }}>
                          Compile Marks 📊
                        </button>
                      ) : !e.published ? (
                        <button className="btn btn-sm btn-primary" onClick={() => handlePublish(e.id)} style={{ fontSize: '0.72rem' }}>
                          Publish to Portal 🚀
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: GREEN, fontWeight: 700 }}>✓ Released to Portal</span>
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
