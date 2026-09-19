import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { STUDENT } from '../../utils/studentMockData'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const BLUE = '#2563EB'

const initialStudents = [
  { id: 'S001', name: STUDENT.name, roll: STUDENT.roll, section: STUDENT.section, stream: 'MPC', year: STUDENT.year, contact: STUDENT.bus.phone },
  { id: 'S002', name: 'Priya Singh', roll: '2024BIPC012', section: 'BIPC-A', stream: 'BIPC', year: 2, contact: '9876543233' },
  { id: 'S003', name: 'Sneha Patel', roll: '2024BIPC005', section: 'BIPC-B', stream: 'BIPC', year: 2, contact: '9876543234' },
  { id: 'S004', name: 'Kavya Naidu', roll: '2024MBIPC03', section: 'MBIPC-A', stream: 'MBIPC', year: 1, contact: '9876543235' },
  { id: 'S005', name: 'Rahul Varma', roll: '2024MPC009', section: 'MPC-A', stream: 'MPC', year: 2, contact: '9876543236' },
]

export default function Page() {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', roll: '', section: 'MPC-A', stream: 'MPC', year: 1, contact: '' })

  function handleCreate(e) {
    e.preventDefault()
    setStudents(prev => [...prev, { ...form, id: `S00${prev.length + 1}` }])
    setShowForm(false)
    setForm({ name: '', roll: '', section: 'MPC-A', stream: 'MPC', year: 1, contact: '' })
  }

  function handleDelete(id) {
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase()))

  return (
    <RolePageTemplate role="Admin" title="Student Management" description="Register new students, assign streams, group classrooms, and maintain directories.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Dynamic counters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total Enrollment', value: students.length, color: PURPLE, icon: '👨‍🎓' },
            { label: 'MPC Stream', value: students.filter(s => s.stream === 'MPC').length, color: BLUE, icon: '📐' },
            { label: 'BIPC Stream', value: students.filter(s => s.stream === 'BIPC').length, color: GREEN, icon: '🌿' },
            { label: 'MBIPC Stream', value: students.filter(s => s.stream === 'MBIPC').length, color: AMBER, icon: '🔬' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Directory Controls */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div style={{ display: 'flex', gap: '0.5rem', width: '300px' }}>
              <input className="form-control form-control-sm" placeholder="🔍 Search name or roll number..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                + Enroll Student
              </button>
            )}
          </div>
        </div>

        {/* Enroll form */}
        {showForm && (
          <form onSubmit={handleCreate} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>👨‍🎓 Enroll New Student Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>FULL NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Harsha Vardhan" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ROLL NUMBER</label>
                <input required className="form-control form-control-sm" placeholder="e.g. 2024MPC030" value={form.roll} onChange={e => setForm(p => ({ ...p, roll: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>SECTION CODE</label>
                <input required className="form-control form-control-sm" placeholder="e.g. MPC-B" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ACADEMIC STREAM</label>
                <select className="form-select form-select-sm" value={form.stream} onChange={e => setForm(p => ({ ...p, stream: e.target.value }))}>
                  <option>MPC</option>
                  <option>BIPC</option>
                  <option>MBIPC</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ACADEMIC YEAR</label>
                <input type="number" className="form-control form-control-sm" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>PARENT CONTACT PHONE</label>
                <input required className="form-control form-control-sm" placeholder="e.g. 9876543236" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">Enroll Student</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Directory table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Student ID', 'Full Name', 'Roll Number', 'Section', 'Stream', 'Year', 'Parent Contact', 'Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>{s.id}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.name}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 600, color: BLUE }}>{s.roll}</td>
                    <td><span className="badge text-bg-light" style={{ border: '1px solid var(--border-color)' }}>{s.section}</span></td>
                    <td><span className="badge text-bg-secondary">{s.stream}</span></td>
                    <td style={{ fontWeight: 700 }}>Year {s.year}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>📞 {s.contact}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)} style={{ fontSize: '0.72rem' }}>
                        Dismiss 🗑️
                      </button>
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
