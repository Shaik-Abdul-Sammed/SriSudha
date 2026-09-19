import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { sectionMap } from '../../utils/studentCatalog'

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English']

const allStudents = [
  { id: 'ss26', name: 'Sai Sree',       stream: 'MPC',   section: 'MPC-A' },
  { id: 'ss27', name: 'Sahana Reddy',   stream: 'BIPC',  section: 'BIPC-B' },
  { id: 'ss28', name: 'Sriram Kumar',   stream: 'MBIPC', section: 'MBIPC-A' },
  { id: 'ss29', name: 'Anika Rao',      stream: 'MPC',   section: 'MPC-B' },
  { id: 'ss30', name: 'Harsha Vardhan', stream: 'BIPC',  section: 'BIPC-A' },
  { id: 'ss31', name: 'Pooja Sharma',   stream: 'MPC',   section: 'MPC-A' },
  { id: 'ss32', name: 'Ravi Teja',      stream: 'MPC',   section: 'MPC-A' },
  { id: 'ss33', name: 'Divya Sri',      stream: 'BIPC',  section: 'BIPC-B' },
]

const GREEN = '#10B981'

export default function Page() {
  const [selectedSection, setSelectedSection] = useState('MPC-A')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [attendance, setAttendance] = useState(() => {
    const init = {}
    allStudents.forEach(s => { init[s.id] = 'present' })
    return init
  })
  const [saved, setSaved] = useState(false)

  const sectionStudents = allStudents.filter(s => s.section === selectedSection)
  const presentCount = sectionStudents.filter(s => attendance[s.id] === 'present').length
  const absentCount  = sectionStudents.length - presentCount

  function toggleStatus(id) {
    setSaved(false)
    setAttendance(prev => ({ ...prev, [id]: prev[id] === 'present' ? 'absent' : 'present' }))
  }
  function markAll(status) { setSaved(false); setAttendance(prev => { const n = {...prev}; sectionStudents.forEach(s => { n[s.id] = status }); return n }) }


  return (
    <RolePageTemplate role="Faculty" title="Attendance Entry" description="Record and update student attendance for each class session.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Controls */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Section</label>
                <select className="form-select" value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                  {sectionMap.map(s => <option key={s.code} value={s.code}>{s.code} — {s.stream}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Subject</label>
                <select className="form-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Date</label>
                <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Total Students', value: sectionStudents.length, color: '#2563EB' },
            { label: 'Present',        value: presentCount,           color: GREEN },
            { label: 'Absent',         value: absentCount,            color: '#EF4444' },
          ].map(stat => (
            <div key={stat.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Attendance Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>📋 {selectedSection} — {selectedSubject}</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => markAll('present')} className="btn btn-sm" style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, fontWeight: 600 }}>✓ All Present</button>
                <button onClick={() => markAll('absent')}  className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}>✗ All Absent</button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {sectionStudents.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No students in this section.</p>
              ) : sectionStudents.map((student, idx) => {
                const isPresent = attendance[student.id] === 'present'
                return (
                  <div key={student.id} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.875rem 1rem', borderRadius: '0.875rem',
                    background: isPresent ? `${GREEN}08` : 'rgba(239,68,68,0.05)',
                    border: `1px solid ${isPresent ? GREEN + '25' : 'rgba(239,68,68,0.2)'}`,
                    transition: 'all 0.2s ease',
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', width: 24, textAlign: 'right', flexShrink: 0 }}>{idx + 1}</span>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: isPresent ? `${GREEN}20` : 'rgba(239,68,68,0.15)',
                      color: isPresent ? GREEN : '#EF4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.85rem',
                    }}>
                      {student.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.id} · {student.stream}</div>
                    </div>
                    <button
                      onClick={() => toggleStatus(student.id)}
                      style={{
                        padding: '0.4rem 1.1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                        background: isPresent ? GREEN : '#EF4444', color: 'white',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isPresent ? '✓ Present' : '✗ Absent'}
                    </button>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSaved(true)}
                className="btn"
                style={{
                  background: `linear-gradient(135deg, ${GREEN}, #0EA5E9)`,
                  color: 'white', border: 'none', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '0.875rem',
                  boxShadow: `0 4px 14px ${GREEN}40`,
                }}
              >
                {saved ? '✓ Saved!' : '💾 Save Attendance'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
