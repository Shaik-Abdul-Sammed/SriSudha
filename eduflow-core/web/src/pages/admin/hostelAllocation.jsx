import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const BLUE = '#2563EB'

const initialAllocations = [
  { id: 1, student: 'Arjun Reddy', block: 'Block B', room: '204', roommates: ['Rahul Varma', 'Sai Charan'] },
  { id: 2, student: 'Sneha Patel', block: 'Block A', room: '102', roommates: ['Kavya Naidu', 'Deepika Rao'] },
  { id: 3, student: 'Vijay Krishna', block: 'Block B', room: '105', roommates: ['Amit Kumar'] },
  { id: 4, student: 'Sunita Sharma', block: 'Block A', room: '208', roommates: ['Ananya Joshi', 'Meera Iyer'] },
]

export default function Page() {
  const [allocations, setAllocations] = useState(initialAllocations)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ student: '', block: 'Block B', room: '', roommates: '' })

  function handleAllocate(e) {
    e.preventDefault()
    const mates = form.roommates ? form.roommates.split(',').map(m => m.trim()) : []
    setAllocations(prev => [...prev, { id: Date.now(), student: form.student, block: form.block, room: form.room, roommates: mates }])
    setShowForm(false)
    setForm({ student: '', block: 'Block B', room: '', roommates: '' })
  }

  function handleEvict(id) {
    setAllocations(prev => prev.filter(a => a.id !== id))
  }

  return (
    <RolePageTemplate role="Admin" title="Hostel Allocation" description="Manage dorm room assignments, view block occupancy charts, and track residential details.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Capacity dashboard stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Hostel Blocks', value: '2 (A & B)', color: PURPLE, icon: '🏢' },
            { label: 'Total Capacity', value: '300 beds', color: BLUE, icon: '🛏️' },
            { label: 'Beds Occupied', value: `${allocations.reduce((acc, a) => acc + 1 + a.roommates.length, 0)} slots`, color: GREEN, icon: '👥' },
            { label: 'Vacancies', value: `${300 - allocations.reduce((acc, a) => acc + 1 + a.roommates.length, 0)} beds`, color: AMBER, icon: '🔑' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action card */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Residential Allocations</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Assign rooms, group roommates harmoniously, or process dorm evacuations.</p>
            </div>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                + Allocate Room
              </button>
            )}
          </div>
        </div>

        {/* Allocate Room Form */}
        {showForm && (
          <form onSubmit={handleAllocate} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>🏠 Assign Student Room</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>STUDENT NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Harsha Vardhan" value={form.student} onChange={e => setForm(p => ({ ...p, student: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>BLOCK</label>
                <select className="form-select form-select-sm" value={form.block} onChange={e => setForm(p => ({ ...p, block: e.target.value }))}>
                  <option>Block A</option>
                  <option>Block B</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ROOM NUMBER</label>
                <input required className="form-control form-control-sm" placeholder="e.g. 204" value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ROOMMATES (COMMA SEPARATED)</label>
                <input className="form-control form-control-sm" placeholder="e.g. Sai Charan, Amit Kumar" value={form.roommates} onChange={e => setForm(p => ({ ...p, roommates: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">Allocate Room</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Allocations table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Block', 'Room No', 'Primary Resident', 'Roommates', 'Total Occupants', 'Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocations.map(a => (
                  <tr key={a.id}>
                    <td><span className="badge text-bg-secondary">{a.block}</span></td>
                    <td style={{ fontWeight: 800, fontSize: '0.875rem' }}>Room {a.room}</td>
                    <td style={{ fontWeight: 700 }}>{a.student}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{a.roommates.join(', ') || 'None'}</td>
                    <td><span className="badge text-bg-light" style={{ border: '1px solid var(--border-color)' }}>{a.roommates.length + 1} residents</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleEvict(a.id)} style={{ fontSize: '0.72rem' }}>
                        Evict / Vacate 🗑️
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
