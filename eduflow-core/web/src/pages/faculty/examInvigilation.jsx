import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PINK = '#DB2777'

const exams = [
  { id: 1, date: '2026-05-12', time: '09:00 AM', subject: 'Physics', section: 'MPC-A + MPC-B', hall: 'Exam Hall 1', students: 64, role: 'Chief Invigilator', status: 'upcoming' },
  { id: 2, date: '2026-05-13', time: '02:00 PM', subject: 'Chemistry', section: 'BIPC-A + BIPC-B', hall: 'Exam Hall 2', students: 48, role: 'Invigilator', status: 'upcoming' },
  { id: 3, date: '2026-05-09', time: '09:00 AM', subject: 'Mathematics', section: 'MPC-A', hall: 'Exam Hall 1', students: 32, role: 'Chief Invigilator', status: 'completed' },
  { id: 4, date: '2026-05-08', time: '02:00 PM', subject: 'Biology', section: 'BIPC-A', hall: 'Exam Hall 3', students: 28, role: 'Invigilator', status: 'completed' },
]

const guidelines = [
  'Arrive 30 minutes before exam start time to receive answer scripts.',
  'Verify student ID cards and hall tickets before seating.',
  'Announce rules and read instructions aloud before distributing question papers.',
  'Strictly maintain silence; no mobile phones inside the exam hall.',
  'Mark absentee students on the attendance sheet provided.',
  'Collect and count all answer scripts before leaving the hall.',
]

const statusColor = { upcoming: '#F59E0B', completed: '#10B981', cancelled: '#EF4444' }

export default function Page() {
  const [tab, setTab] = useState('upcoming')
  const shown = exams.filter(e => e.status === tab)

  return (
    <RolePageTemplate role="Faculty" title="Exam Invigilation" description="View your assigned invigilation duties and exam schedules.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Total Duties', value: exams.length, color: PINK },
            { label: 'Upcoming', value: exams.filter(e => e.status === 'upcoming').length, color: '#F59E0B' },
            { label: 'Completed', value: exams.filter(e => e.status === 'completed').length, color: '#10B981' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['upcoming', 'completed'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.45rem 1.1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize',
              background: tab === t ? `linear-gradient(135deg,${PINK},#F97316)` : `${PINK}10`,
              color: tab === t ? 'white' : PINK, transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>

        {/* Duty Cards */}
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {shown.map(exam => {
            const sc = statusColor[exam.status]
            return (
              <div key={exam.id} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', borderLeft: `4px solid ${sc}` }}>
                <div className="card-body p-4">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.875rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>{exam.subject}</span>
                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', background: `${sc}15`, color: sc, fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${sc}25` }}>
                          {exam.role}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem', display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                        <span>📅 {exam.date}</span>
                        <span>⏰ {exam.time}</span>
                        <span>🏛 {exam.hall}</span>
                        <span>👥 {exam.section}</span>
                        <span>🎓 {exam.students} students</span>
                      </div>
                    </div>
                    <span style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: `${sc}12`, color: sc, fontSize: '0.78rem', fontWeight: 700, border: `1px solid ${sc}25`, alignSelf: 'flex-start' }}>
                      {exam.status}
                    </span>
                  </div>
                  {exam.status === 'upcoming' && (
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: '#F59E0B08', border: '1px solid #F59E0B20', fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>
                      ⚠️ Report to {exam.hall} at least 30 minutes before exam start.
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {shown.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>No {tab} duties.</div>
          )}
        </div>

        {/* Guidelines */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: PINK }}>📋 Invigilation Guidelines</h2>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {guidelines.map((g, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.7rem 0.875rem', borderRadius: '0.75rem', background: `${PINK}06`, border: `1px solid ${PINK}12` }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${PINK}15`, color: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', flexShrink: 0 }}>{i+1}</span>
                  <span style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.55 }}>{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
