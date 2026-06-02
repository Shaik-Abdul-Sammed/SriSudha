import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { STUDENT } from '../../utils/studentMockData'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'
const BLUE = '#2563EB'

const initialRoutes = [
  { id: 1, routeName: STUDENT.bus.route, busNo: STUDENT.bus.busNo, driver: STUDENT.bus.driver, phone: STUDENT.bus.phone, passengers: 38, capacity: 40, status: 'on_schedule' },
  { id: 2, routeName: 'Route 3', busNo: 'AP-09-AB-5678', driver: 'M. Venkatesh', phone: '9000056789', passengers: 42, capacity: 45, status: 'delayed' },
  { id: 3, routeName: 'Route 12', busNo: 'AP-09-AB-9012', driver: 'P. Yadagiri', phone: '9000090123', passengers: 28, capacity: 40, status: 'on_schedule' },
  { id: 4, routeName: 'Route 5', busNo: 'AP-09-AB-3456', driver: 'G. Mallaiah', phone: '9000034567', passengers: 35, capacity: 35, status: 'maintenance' },
]

export default function Page() {
  const [routes, setRoutes] = useState(initialRoutes)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ routeName: '', busNo: '', driver: '', phone: '', capacity: 40 })

  function handleCreate(e) {
    e.preventDefault()
    setRoutes(prev => [...prev, { ...form, id: Date.now(), passengers: 0, status: 'on_schedule' }])
    setShowForm(false)
    setForm({ routeName: '', busNo: '', driver: '', phone: '', capacity: 40 })
  }

  function handleStatusChange(id, status) {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  return (
    <RolePageTemplate role="Admin" title="Transport Routes" description="Manage institutional bus operations, route timelines, capacity alerts, and driver profiles.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Fleet metrics stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Active Fleet Buses', value: routes.length, color: PURPLE, icon: '🚌' },
            { label: 'Network Passengers', value: `${routes.reduce((acc, r) => acc + r.passengers, 0)} pupils`, color: BLUE, icon: '👥' },
            { label: 'Maintenance Delay', value: routes.filter(r => r.status === 'delayed').length, color: RED, icon: '⏰' },
            { label: 'Fuel/Compliance', value: '100% OK', color: GREEN, icon: '🛡️' },
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
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Fleet Operations Registry</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Configure bus routes, assign vehicles, track driver mobile lines, or log delay reports.</p>
            </div>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                + Register Bus Route
              </button>
            )}
          </div>
        </div>

        {/* Register route form */}
        {showForm && (
          <form onSubmit={handleCreate} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>🚌 Register Fleet Route Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ROUTE NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Route 15 (Dilshuknagar)" value={form.routeName} onChange={e => setForm(p => ({ ...p, routeName: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>BUS NUMBER</label>
                <input required className="form-control form-control-sm" placeholder="e.g. AP-09-AB-9999" value={form.busNo} onChange={e => setForm(p => ({ ...p, busNo: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>DRIVER FULL NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. K. Narayana" value={form.driver} onChange={e => setForm(p => ({ ...p, driver: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>DRIVER MOBILE PHONE</label>
                <input required className="form-control form-control-sm" placeholder="e.g. 9000012345" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>MAX CAPACITY</label>
                <input type="number" className="form-control form-control-sm" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">Register Route</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Fleet table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Route Target', 'Bus Number', 'Assigned Driver', 'Driver Mobile', 'Passengers / Capacity', 'Fleet Status', 'Action Status'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{r.routeName}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600, color: BLUE }}>{r.busNo}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>👨‍✈️ {r.driver}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>📞 {r.phone}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: r.passengers >= r.capacity ? RED : 'var(--app-text)' }}>{r.passengers}/{r.capacity}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>({Math.round((r.passengers / r.capacity) * 100)}%)</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: r.status === 'on_schedule' ? `${GREEN}12` : r.status === 'delayed' ? `${AMBER}12` : `${RED}12`,
                        color: r.status === 'on_schedule' ? GREEN : r.status === 'delayed' ? AMBER : RED,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <select className="form-select form-select-sm" style={{ width: 140, fontSize: '0.75rem' }} value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}>
                        <option value="on_schedule">On Schedule</option>
                        <option value="delayed">Delayed</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
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
