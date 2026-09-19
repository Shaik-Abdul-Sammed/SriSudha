import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

const initialParents = [
  { id: 'PAR001', name: 'Ramanathan Reddy', student: 'Arjun Reddy', relation: 'Father', email: 'ram@gmail.com', phone: '9876500001', active: true, lastLogin: '2026-06-01 08:30 AM' },
  { id: 'PAR002', name: 'Devendra Singh', student: 'Priya Singh', relation: 'Father', email: 'dev@gmail.com', phone: '9876500002', active: true, lastLogin: '2026-05-31 06:12 PM' },
  { id: 'PAR003', name: 'Meenakshi Iyer', student: 'Meera Iyer', relation: 'Mother', email: 'meena@gmail.com', phone: '9876500003', active: true, lastLogin: '2026-05-30 11:22 AM' },
  { id: 'PAR004', name: 'Satish Patel', student: 'Sneha Patel', relation: 'Father', email: 'satish@gmail.com', phone: '9876500004', active: false, lastLogin: '—' },
]

export default function Page() {
  const [parents, setParents] = useState(initialParents)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', student: '', relation: 'Father', email: '', phone: '' })

  function handleCreate(e) {
    e.preventDefault()
    setParents(prev => [...prev, { ...form, id: `PAR00${prev.length + 1}`, active: true, lastLogin: 'Just registered' }])
    setShowForm(false)
    setForm({ name: '', student: '', relation: 'Father', email: '', phone: '' })
  }

  function toggleActive(id) {
    setParents(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  return (
    <RolePageTemplate role="Admin" title="Parent Accounts" description="Manage parent portal credentials, links, contact details, and platform accessibility.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Analytics stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total Parents Linked', value: parents.length, color: PURPLE, icon: '👪' },
            { label: 'Active Portals', value: parents.filter(p => p.active).length, color: GREEN, icon: '🟢' },
            { label: 'Suspended Accounts', value: parents.filter(p => !p.active).length, color: RED, icon: '🔴' },
            { label: 'Avg Login Frequency', value: '3 / Wk', color: AMBER, icon: '📈' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action card */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Parent Registry</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Link guardians to enrolled children, authorize portals, or toggle suspensions.</p>
            </div>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                + Add Parent Account
              </button>
            )}
          </div>
        </div>

        {/* Link form */}
        {showForm && (
          <form onSubmit={handleCreate} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>👪 Link New Parent Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>PARENT/GUARDIAN NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Satish Patel" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>STUDENT TO LINK</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Sneha Patel" value={form.student} onChange={e => setForm(p => ({ ...p, student: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>RELATION</label>
                <select className="form-select form-select-sm" value={form.relation} onChange={e => setForm(p => ({ ...p, relation: e.target.value }))}>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Guardian</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>EMAIL ADDRESS</label>
                <input required type="email" className="form-control form-control-sm" placeholder="e.g. satish@gmail.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>MOBILE PHONE</label>
                <input required className="form-control form-control-sm" placeholder="e.g. 9876500004" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">Link Account</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Parent table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Parent ID', 'Guardian Name', 'Child Linked', 'Relation', 'Contact details', 'Last Login', 'Portal Access', 'Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parents.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>{p.id}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{p.name}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.student}</td>
                    <td><span className="badge text-bg-light" style={{ border: '1px solid var(--border-color)' }}>{p.relation}</span></td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      ✉️ {p.email} <br /> 📞 {p.phone}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>{p.lastLogin}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: p.active ? `${GREEN}12` : `${RED}12`,
                        color: p.active ? GREEN : RED,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {p.active ? 'Authorized' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <button className={`btn btn-sm ${p.active ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => toggleActive(p.id)} style={{ fontSize: '0.72rem' }}>
                        {p.active ? 'Revoke' : 'Authorize'}
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
