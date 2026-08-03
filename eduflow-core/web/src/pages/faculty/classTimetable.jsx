import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'


const PURPLE = '#7C3AED'
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const schedule = {
  Monday:    [{ time: '08:30', subject: 'Mathematics', section: 'MPC-A', room: 'LA 101' }, { time: '10:30', subject: 'Physics', section: 'MPC-B', room: 'LA 201' }],
  Tuesday:   [{ time: '09:30', subject: 'Chemistry', section: 'BIPC-A', room: 'LA 102' }, { time: '14:00', subject: 'Mathematics', section: 'MPC-B', room: 'LA 101' }],
  Wednesday: [{ time: '08:30', subject: 'Mathematics', section: 'MPC-A', room: 'LA 101' }, { time: '11:30', subject: 'Physics Lab', section: 'MPC-A', room: 'OSL' }],
  Thursday:  [{ time: '09:30', subject: 'Physics', section: 'MPC-A', room: 'LA 201' }, { time: '14:00', subject: 'Chemistry', section: 'BIPC-B', room: 'LA 102' }],
  Friday:    [{ time: '08:30', subject: 'Mathematics', section: 'MPC-B', room: 'LA 101' }, { time: '10:30', subject: 'Physics', section: 'MPC-A', room: 'LA 201' }],
  Saturday:  [{ time: '09:30', subject: 'Remedial Class', section: 'MPC-A', room: 'LA 101' }],
}

const subjectColors = {
  'Mathematics': '#2563EB', 'Physics': '#7C3AED', 'Chemistry': '#10B981',
  'Physics Lab': '#F59E0B', 'Chemistry Lab': '#EF4444', 'Remedial Class': '#94a3b8',
}

export default function Page() {
  const [activeDay, setActiveDay] = useState('Monday')
  const todaySchedule = schedule[activeDay] || []
  const totalClasses  = Object.values(schedule).flat().length

  return (
    <RolePageTemplate role="Faculty" title="Class Timetable" description="View your weekly teaching schedule and room assignments.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Weekly Classes', value: totalClasses, color: PURPLE },
            { label: 'Subjects', value: 3, color: '#2563EB' },
            { label: 'Sections', value: 4, color: '#10B981' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Day Tabs */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {days.map(d => (
                <button key={d} onClick={() => setActiveDay(d)} style={{
                  padding: '0.45rem 0.9rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                  background: activeDay === d ? `linear-gradient(135deg,${PURPLE},#2563EB)` : `${PURPLE}10`,
                  color: activeDay === d ? 'white' : PURPLE,
                  boxShadow: activeDay === d ? `0 4px 12px ${PURPLE}40` : 'none', transition: 'all 0.2s',
                }}>
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>

            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: PURPLE }}>📅 {activeDay}</h2>

            {todaySchedule.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>🎉 No classes scheduled for {activeDay}.</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {todaySchedule.map((cls, i) => {
                  const color = subjectColors[cls.subject] || '#64748b'
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem', borderRadius: '1rem',
                      background: `${color}08`, border: `1px solid ${color}25`,
                      borderLeft: `4px solid ${color}`,
                    }}>
                      <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 52 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color }}>{cls.time}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>START</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{cls.subject}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>👥 {cls.section} · 📍 {cls.room}</div>
                      </div>
                      <span style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: `${color}15`, color, fontWeight: 700, fontSize: '0.72rem', border: `1px solid ${color}25` }}>
                        50 min
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Full Week Grid */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>📊 Full Week Overview</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr>
                    {['Day', 'Period 1', 'Period 2', 'Period 3'].map(h => (
                      <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '0.5rem 0.75rem', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => {
                    const classes = schedule[day] || []
                    return (
                      <tr key={day} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.85rem' }}>{day.slice(0, 3)}</td>
                        {[0, 1, 2].map(i => {
                          const cls = classes[i]
                          const color = cls ? (subjectColors[cls.subject] || '#64748b') : '#e2e8f0'
                          return (
                            <td key={i} style={{ padding: '0.5rem 0.75rem' }}>
                              {cls ? (
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', background: `${color}15`, color, fontWeight: 700, fontSize: '0.75rem' }}>
                                  {cls.subject}
                                </span>
                              ) : (
                                <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
