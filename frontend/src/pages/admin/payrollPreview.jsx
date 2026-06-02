import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const RED = '#EF4444'
const BLUE = '#2563EB'

const initialPayroll = [
  { id: 'PAY01', name: 'Dr. Kavitha Sharma', role: 'Mathematics Faculty', base: 95000, bonus: 5000, deductions: 2500, status: 'approved' },
  { id: 'PAY02', name: 'Dr. Ravi Kumar', role: 'Physics Faculty', base: 92000, bonus: 4000, deductions: 2200, status: 'approved' },
  { id: 'PAY03', name: 'Dr. Sujata Rao', role: 'Chemistry Faculty', base: 90000, bonus: 3500, deductions: 2100, status: 'approved' },
  { id: 'PAY04', name: 'Dr. Padma Rao', role: 'Biology Faculty', base: 88000, bonus: 4000, deductions: 2000, status: 'pending' },
  { id: 'PAY05', name: 'Mrs. Anitha Reddy', role: 'English Faculty', base: 65000, bonus: 0, deductions: 1500, status: 'hold' },
]

export default function Page() {
  const [payroll, setPayroll] = useState(initialPayroll)
  const [released, setReleased] = useState(false)

  function toggleStatus(id) {
    setPayroll(prev => prev.map(p => {
      if (p.id !== id) return p
      const nextStatus = p.status === 'approved' ? 'hold' : p.status === 'hold' ? 'pending' : 'approved'
      return { ...p, status: nextStatus }
    }))
  }

  const totalBase = payroll.reduce((acc, p) => acc + p.base, 0)
  const totalBonus = payroll.reduce((acc, p) => acc + p.bonus, 0)
  const totalDeducts = payroll.reduce((acc, p) => acc + p.deductions, 0)
  const netDisbursement = totalBase + totalBonus - totalDeducts

  return (
    <RolePageTemplate role="Admin" title="Payroll Preview" description="Review monthly faculty salaries, base wages, deductions, and release payments.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Financial metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Disbursement target', value: `₹${netDisbursement.toLocaleString('en-IN')}`, color: PURPLE, icon: '🏦' },
            { label: 'Base Salaries Sum', value: `₹${totalBase.toLocaleString('en-IN')}`, color: BLUE, icon: '💵' },
            { label: 'Performance Bonus', value: `₹${totalBonus.toLocaleString('en-IN')}`, color: GREEN, icon: '🎁' },
            { label: 'Tax Deductions', value: `₹${totalDeducts.toLocaleString('en-IN')}`, color: RED, icon: '📈' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: s.color, lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action card */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Salary Release Controls</h3>
              {released ? (
                <p style={{ margin: 0, fontSize: '0.85rem', color: GREEN, fontWeight: 700 }}>✅ Payroll successfully released and dispatched to bank server!</p>
              ) : (
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Release payments to all approved employee banking accounts.</p>
              )}
            </div>
            {!released && (
              <button className="btn btn-primary" onClick={() => setReleased(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                🚀 Approve & Release Payroll
              </button>
            )}
          </div>
        </div>

        {/* Payroll Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Emp ID', 'Employee Name', 'Role', 'Base Salary', 'Bonus', 'Deductions', 'Net Payable', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payroll.map(p => {
                  const net = p.base + p.bonus - p.deductions
                  return (
                    <tr key={p.id}>
                      <td style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>{p.id}</td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{p.role}</td>
                      <td style={{ fontSize: '0.875rem' }}>₹{p.base.toLocaleString('en-IN')}</td>
                      <td style={{ fontSize: '0.875rem', color: GREEN }}>₹{p.bonus.toLocaleString('en-IN')}</td>
                      <td style={{ fontSize: '0.875rem', color: RED }}>₹{p.deductions.toLocaleString('en-IN')}</td>
                      <td style={{ fontSize: '0.9rem', fontWeight: 800, color: BLUE }}>₹{net.toLocaleString('en-IN')}</td>
                      <td>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '2rem',
                          background: p.status === 'approved' ? `${GREEN}12` : p.status === 'hold' ? `${RED}12` : `${AMBER}12`,
                          color: p.status === 'approved' ? GREEN : p.status === 'hold' ? RED : AMBER,
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleStatus(p.id)} style={{ fontSize: '0.72rem' }}>
                          Toggle Status 🔄
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </RolePageTemplate>
  )
}
