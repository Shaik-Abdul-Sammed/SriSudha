import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { attendanceTrend, marksTrend } from '../../utils/mockData'
import { studentDummyIds, sectionMap } from '../../utils/studentCatalog'

const BLUE = '#2563EB'

/* ─── Inline Bar Chart (pure CSS) ─── */
function BarChart({ data, valueKey, color, maxOverride }) {
  const max = maxOverride || Math.max(...data.map(d => d[valueKey]))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', height: 100, padding: '0 0.5rem' }}>
      {data.map(d => {
        const pct = Math.round((d[valueKey] / max) * 100)
        return (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color }}>{d[valueKey]}</span>
            <div style={{ width: '100%', height: `${pct}%`, background: `linear-gradient(180deg,${color},${color}88)`, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', minHeight: 4 }} />
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

const studentMetrics = studentDummyIds.map((s, i) => ({
  ...s,
  attendance: [95, 88, 92, 78, 90][i],
  avgMarks:   [82, 74, 88, 69, 85][i],
  assignments:[10, 8, 10, 7, 9][i],
  totalAssign: 10,
  risk:        [false, true, false, true, false][i],
}))

function riskColor(risk) { return risk ? '#EF4444' : '#10B981' }

export default function Page() {
  const [activeSection, setActiveSection] = useState('MPC-A')
  const sectionStudents = studentMetrics.filter(s => s.section === activeSection)

  const avgAttendance = sectionStudents.length
    ? Math.round(sectionStudents.reduce((a, s) => a + s.attendance, 0) / sectionStudents.length)
    : 0
  const avgMarks = sectionStudents.length
    ? Math.round(sectionStudents.reduce((a, s) => a + s.avgMarks, 0) / sectionStudents.length)
    : 0
  const atRisk = sectionStudents.filter(s => s.risk).length

  return (
    <RolePageTemplate role="Faculty" title="Academic Analytics" description="Monitor class-level and student-level academic performance trends.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Section Selector */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Section</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sectionMap.map(s => (
                <button key={s.code} onClick={() => setActiveSection(s.code)} style={{
                  padding: '0.45rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                  background: activeSection === s.code ? `linear-gradient(135deg,${BLUE},#06B6D4)` : `${BLUE}10`,
                  color: activeSection === s.code ? 'white' : BLUE,
                  boxShadow: activeSection === s.code ? `0 4px 12px ${BLUE}40` : 'none', transition: 'all 0.2s',
                }}>{s.code}</button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Students',       value: sectionStudents.length, color: BLUE,      icon: '👥' },
            { label: 'Avg Attendance', value: `${avgAttendance}%`,   color: '#10B981',  icon: '✅' },
            { label: 'Avg Marks',      value: `${avgMarks}/100`,      color: '#F59E0B',  icon: '📊' },
            { label: 'At-Risk',        value: atRisk,                 color: '#EF4444',  icon: '⚠️' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trend Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>📈 Attendance Trend (%)</h2>
              <BarChart data={attendanceTrend} valueKey="attendance" color="#10B981" maxOverride={100} />
            </div>
          </div>
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>📊 Average Score Trend</h2>
              <BarChart data={marksTrend} valueKey="score" color={BLUE} maxOverride={10} />
            </div>
          </div>
        </div>

        {/* Student Performance Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>🎓 Student Performance — {activeSection}</h2>
            {sectionStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No students in this section.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Student', 'Stream', 'Attendance', 'Avg Marks', 'Assignments', 'Status'].map(h => (
                        <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.75rem', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sectionStudents.map(st => {
                      const attColor = st.attendance < 80 ? '#EF4444' : st.attendance < 90 ? '#F59E0B' : '#10B981'
                      const markColor = st.avgMarks < 60 ? '#EF4444' : st.avgMarks < 75 ? '#F59E0B' : '#10B981'
                      return (
                        <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${riskColor(st.risk)}20`, color: riskColor(st.risk), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                                {st.name.charAt(0)}
                              </div>
                              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{st.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.82rem', color: '#64748b' }}>{st.stream}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, minWidth: 50 }}>
                                <div style={{ height: '100%', width: `${st.attendance}%`, background: attColor, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: attColor, minWidth: 36 }}>{st.attendance}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: markColor, fontSize: '0.875rem' }}>{st.avgMarks}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.82rem' }}>
                            <span style={{ fontWeight: 600 }}>{st.assignments}</span>
                            <span style={{ color: '#94a3b8' }}>/{st.totalAssign}</span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', background: `${riskColor(st.risk)}12`, color: riskColor(st.risk), fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${riskColor(st.risk)}25` }}>
                              {st.risk ? '⚠️ At-Risk' : '✅ On Track'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>📚 Subject Performance Breakdown</h2>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {[
                { subject: 'Mathematics', avg: 78, passed: 30, total: 32, color: BLUE },
                { subject: 'Physics',     avg: 72, passed: 28, total: 32, color: '#7C3AED' },
                { subject: 'Chemistry',   avg: 80, passed: 31, total: 32, color: '#10B981' },
              ].map(sub => (
                <div key={sub.subject} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: '0.875rem', background: `${sub.color}06`, border: `1px solid ${sub.color}15` }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', minWidth: 120 }}>{sub.subject}</span>
                  <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${sub.avg}%`, background: `linear-gradient(90deg,${sub.color},${sub.color}88)`, borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontWeight: 800, color: sub.color, fontSize: '0.875rem', minWidth: 40, textAlign: 'right' }}>{sub.avg}%</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', minWidth: 80, textAlign: 'right' }}>{sub.passed}/{sub.total} passed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
