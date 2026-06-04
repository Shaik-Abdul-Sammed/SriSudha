import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

const initialFaculty = [
  { id: 'FAC001', name: 'Dr. Kavitha Sharma', subject: 'Mathematics', stream: 'MPC/MBIPC', active: true, email: 'kavitha@srivenkateswara.ac.in', phone: '9876543210' },
  { id: 'FAC002', name: 'Dr. Ravi Kumar', subject: 'Physics', stream: 'MPC/BIPC', active: true, email: 'ravi@srivenkateswara.ac.in', phone: '9876543211' },
  { id: 'FAC003', name: 'Dr. Sujata Rao', subject: 'Chemistry', stream: 'All Streams', active: true, email: 'sujata@srivenkateswara.ac.in', phone: '9876543212' },
  { id: 'FAC004', name: 'Dr. Padma Rao', subject: 'Biology', stream: 'BIPC/MBIPC', active: true, email: 'padma@srivenkateswara.ac.in', phone: '9876543213' },
  { id: 'FAC005', name: 'Mrs. Anitha Reddy', subject: 'English', stream: 'All Streams', active: false, email: 'anitha@srivenkateswara.ac.in', phone: '9876543214' },
]

export default function Page() {
  const [faculty, setFaculty] = useState(initialFaculty)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', subject: 'Mathematics', stream: 'MPC', email: '', phone: '' })

  function handleCreate(e) {
    e.preventDefault()
    setFaculty(prev => [...prev, { ...form, id: `FAC00${prev.length + 1}`, active: true }])
    setShowForm(false)
    setForm({ name: '', subject: 'Mathematics', stream: 'MPC', email: '', phone: '' })
  }

  function toggleActive(id) {
    setFaculty(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f))
  }

  return (
    <RolePageTemplate role="Admin" title="Faculty Management" description="Monitor institutional teacher directories, stream assignments, and account statuses.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Analytics stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total Faculty', value: faculty.length, color: PURPLE, icon: '👨‍🏫' },
            { label: 'Active Faculty', value: faculty.filter(f => f.active).length, color: GREEN, icon: '🟢' },
            { label: 'Inactive Status', value: faculty.filter(f => !f.active).length, color: RED, icon: '🔴' },
            { label: 'Average Classes', value: '18 / Wk', color: AMBER, icon: '📅' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick add button */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Faculty Directory</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Search, recruit, and assign subjects to teachers.</p>
            </div>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                + Add Faculty Member
              </button>
            )}
          </div>
        </div>

        {/* recruit form */}
        {showForm && (
          <form onSubmit={handleCreate} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}> Recruit New Faculty</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>FULL NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Dr. Harish Prasad" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>SUBJECT SPECIALIZATION</label>
                <select className="form-select form-select-sm" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                  {['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>STREAM TARGETS</label>
                <input required className="form-control form-control-sm" placeholder="e.g. MPC/MBIPC" value={form.stream} onChange={e => setForm(p => ({ ...p, stream: e.target.value }))} />
              </div>
                <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>EMAIL ADDRESS</label>
                <input required type="email" className="form-control form-control-sm" placeholder="e.g. harish@srivenkateswara.ac.in" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>MOBILE PHONE</label>
                <input required className="form-control form-control-sm" placeholder="e.g. 9876543220" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">Recruit Faculty</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Faculty List Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['FAC ID', 'Faculty Name', 'Specialization', 'Streams', 'Contact Info', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faculty.map(fac => (
                  <tr key={fac.id}>
                    <td style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>{fac.id}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{fac.name}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{fac.subject}</td>
                    <td><span className="badge text-bg-secondary">{fac.stream}</span></td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      ✉️ {fac.email} <br /> 📞 {fac.phone}
                    </td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: fac.active ? `${GREEN}12` : `${RED}12`,
                        color: fac.active ? GREEN : RED,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {fac.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td>
                      <button className={`btn btn-sm ${fac.active ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => toggleActive(fac.id)} style={{ fontSize: '0.72rem' }}>
                        {fac.active ? 'Suspend' : 'Activate'}
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
