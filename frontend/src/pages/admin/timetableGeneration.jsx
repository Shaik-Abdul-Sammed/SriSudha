import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const GREEN = '#10B981'
const BLUE = '#2563EB'
const RED = '#EF4444'

const initialSlots = [
  { id: 1, section: 'MPC-A', day: 'Monday', period: '1st (8:30–9:20)', subject: 'Mathematics', faculty: 'Dr. Kavitha Sharma', room: 'Room 101', status: 'valid' },
  { id: 2, section: 'MPC-A', day: 'Monday', period: '2nd (9:20–10:10)', subject: 'Physics', faculty: 'Dr. Ravi Kumar', room: 'Room 101', status: 'valid' },
  { id: 3, section: 'BIPC-A', day: 'Monday', period: '1st (8:30–9:20)', subject: 'Biology', faculty: 'Dr. Padma Rao', room: 'Room 102', status: 'valid' },
  { id: 4, section: 'MPC-B', day: 'Monday', period: '1st (8:30–9:20)', subject: 'Chemistry', faculty: 'Dr. Sujata Rao', room: 'Room 103', status: 'valid' },
  { id: 5, section: 'MPC-A', day: 'Tuesday', period: '1st (8:30–9:20)', subject: 'Mathematics', faculty: 'Dr. Kavitha Sharma', room: 'Room 101', status: 'conflict' },
]

export default function Page() {
  const [slots, setSlots] = useState(initialSlots)
  const [generating, setGenerating] = useState(false)

  function runOptimizer() {
    setGenerating(true)
    setTimeout(() => {
      setSlots(prev => prev.map(s => s.status === 'conflict' ? { ...s, status: 'valid', room: 'Room 104' } : s))
      setGenerating(false)
    }, 1500)
  }

  return (
    <RolePageTemplate role="Admin" title="Timetable Generation" description="Run heuristic slot scheduling, resolve faculty period conflicts, and preview weekly calendars.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Timetable status stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Weekly Period Slots', value: '48 Slots', color: PURPLE, icon: '📅' },
            { label: 'Configured Classes', value: slots.length, color: BLUE, icon: '🏫' },
            { label: 'Schedule Conflicts', value: slots.filter(s => s.status === 'conflict').length, color: RED, icon: '🚨' },
            { label: 'Optimal Index', value: '98.6%', color: GREEN, icon: '⚡' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Heuristic run card */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center bg-dark text-white">
            <div>
              <p className="text-uppercase small fw-semibold text-warning mb-2">Sri Venkateswara Heuristics Engine v2.0</p>
              <h2 className="h4 mb-2 text-white" style={{ fontWeight: 800 }}>Automated Schedule Optimizer</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', margin: 0 }}>Runs multi-constraint scheduling checks to automatically bypass overlapping faculty hours.</p>
            </div>
            <button className="btn btn-warning fw-bold" onClick={runOptimizer} disabled={generating} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>
              {generating ? '🧬 Resolving Overlaps…' : '⚡ Run Optimization Run'}
            </button>
          </div>
        </div>

        {/* Timetable schedule preview */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Generated Slot Matrix</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Section', 'Day', 'Period Slot', 'Subject', 'Assigned Teacher', 'Classroom', 'Audit Status'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontSize: '0.875rem', fontWeight: 800 }}>{s.section}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{s.day}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.period}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.subject}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.faculty}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 700 }}>{s.room}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: s.status === 'valid' ? `${GREEN}12` : `${RED}12`,
                        color: s.status === 'valid' ? GREEN : RED,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {s.status === 'valid' ? '✓ Validated' : '🚨 Conflict! Room/Hour'}
                      </span>
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
