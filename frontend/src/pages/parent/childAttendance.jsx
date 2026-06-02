import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { STUDENT, attendanceData } from '../../utils/studentMockData'

const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

export default function Page() {
  const [showModal, setShowModal] = useState(false)
  const [leaveReason, setLeaveReason] = useState('')

  function handleApply(e) {
    e.preventDefault()
    setShowModal(true)
    setTimeout(() => {
      setShowModal(false)
      setLeaveReason('')
    }, 2000)
  }

  return (
    <RolePageTemplate role="Parent" title="Child Attendance Status" description="Monitor your child's presence rates, subject metrics, and request student leaves.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Attendance Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          
          {/* Donut score */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>Overall Presence</h3>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 90, height: 90, borderRadius: '50%', background: `conic-gradient(${GREEN} ${attendanceData.overall}%, #f1f5f9 0)`, position: 'relative', margin: '0 auto 1rem' }}>
              <div style={{ width: 74, height: 74, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.35rem' }}>
                {attendanceData.overall}%
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Target: 75% for exam eligibility</div>
          </div>

          {/* Quick stats */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
            <div style={{ display: 'flex', justifyItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{attendanceData.subjects.reduce((a, b) => a + b.attended, 0)} / {attendanceData.subjects.reduce((a, b) => a + b.classes, 0)}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Lectures Attended</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🩺</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>1 Day</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Approved Medical Leave</div>
              </div>
            </div>
          </div>

        </div>

        {/* Apply for leave */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>📝 Quick Leave Request Form</h3>
          <form onSubmit={handleApply} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>REASON FOR ABSENCE</label>
              <input required className="form-control form-control-sm" placeholder="e.g. Suffering from fever. Doctor advised 2 days rest." value={leaveReason} onChange={e => setLeaveReason(e.target.value)} />
            </div>
            <button className="btn btn-sm btn-primary" type="submit" style={{ background: AMBER, border: 'none' }}>
              Submit Request
            </button>
          </form>
          {showModal && <div style={{ fontSize: '0.8rem', color: GREEN, fontWeight: 700, marginTop: '0.5rem' }}>✓ Leave request submitted to class mentor for authorization.</div>}
        </div>

        {/* Subject Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Subject-wise Lecture Attendance</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Subject Name', 'Lecture Faculty', 'Lectures Attended', 'Attendance Rate'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendanceData.subjects.map(s => (
                  <tr key={s.name}>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.name}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.faculty}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.attended} / {s.classes} classes</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 100, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                          <div style={{ width: `${s.pct}%`, height: '100%', background: s.pct >= 75 ? GREEN : RED, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.pct >= 75 ? GREEN : RED }}>{s.pct}%</span>
                      </div>
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
