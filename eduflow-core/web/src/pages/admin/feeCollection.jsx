import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'

const recentPayments = [
  { id: 'PAY001', student: 'Arjun Reddy', roll: '2024MPC001', term: 'Term 1 Tuition', amount: 45000, date: '2026-06-01', method: 'Online' },
  { id: 'PAY002', student: 'Priya Singh', roll: '2024BIPC012', term: 'Hostel Fee S1', amount: 25000, date: '2026-06-01', method: 'DD' },
  { id: 'PAY003', student: 'Amit Kumar', roll: '2024MPC008', term: 'Term 1 Tuition', amount: 45000, date: '2026-05-30', method: 'Online' },
  { id: 'PAY004', student: 'Sneha Patel', roll: '2024BIPC005', term: 'Lab Deposit', amount: 8000, date: '2026-05-28', method: 'Cash' },
]

export default function Page() {
  const [payments, setPayments] = useState(recentPayments)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ student: '', roll: '', term: 'Term 1 Tuition', amount: '', method: 'Online' })

  function handleRecord(e) {
    e.preventDefault()
    setPayments(prev => [{ ...form, id: `PAY00${prev.length + 1}`, date: new Date().toISOString().split('T')[0], amount: Number(form.amount) }, ...prev])
    setShowForm(false)
    setForm({ student: '', roll: '', term: 'Term 1 Tuition', amount: '', method: 'Online' })
  }

  return (
    <RolePageTemplate role="Admin" title="Fee Collection" description="Record incoming fee payments, track accounts receivable, and view revenue summaries.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Finance boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total Targeted Collection', value: '₹5,40,00,000', color: PURPLE, icon: '🏦' },
            { label: 'Total Fees Collected', value: '₹3,82,50,000', color: GREEN, icon: '💰' },
            { label: 'Pending Receivables', value: '₹1,57,50,000', color: RED, icon: '⏳' },
            { label: 'Collection Rate', value: '70.8%', color: AMBER, icon: '📈' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: s.color, lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Record payment action */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Fee Ledger</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Post checks, draft orders, cash allocations, or online remittances.</p>
            </div>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                + Record Manual Payment
              </button>
            )}
          </div>
        </div>

        {/* record form */}
        {showForm && (
          <form onSubmit={handleRecord} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>💸 Record Offline Fee Remittance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>STUDENT NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Arjun Reddy" value={form.student} onChange={e => setForm(p => ({ ...p, student: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ROLL NUMBER / ID</label>
                <input required className="form-control form-control-sm" placeholder="e.g. 2024MPC001" value={form.roll} onChange={e => setForm(p => ({ ...p, roll: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>PAYMENT TERM / CATEGORY</label>
                <select className="form-select form-select-sm" value={form.term} onChange={e => setForm(p => ({ ...p, term: e.target.value }))}>
                  <option>Term 1 Tuition</option>
                  <option>Term 2 Tuition</option>
                  <option>Hostel Fee S1</option>
                  <option>Hostel Fee S2</option>
                  <option>Lab Deposit</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>AMOUNT (₹)</label>
                <input required type="number" className="form-control form-control-sm" placeholder="e.g. 45000" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>PAYMENT MODE</label>
                <select className="form-select form-select-sm" value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}>
                  <option>Online</option>
                  <option>DD</option>
                  <option>Cash</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">Record Payment</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Ledger table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Recent Ledger Postings</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Receipt ID', 'Student', 'Roll', 'Description', 'Amount', 'Date', 'Mode'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>{p.id}</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{p.student}</td>
                    <td style={{ fontSize: '0.82rem', color: '#475569' }}>{p.roll}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.term}</td>
                    <td style={{ fontWeight: 800, color: GREEN }}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{p.date}</td>
                    <td><span className="badge text-bg-light" style={{ border: '1px solid var(--border-color)' }}>{p.method}</span></td>
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
