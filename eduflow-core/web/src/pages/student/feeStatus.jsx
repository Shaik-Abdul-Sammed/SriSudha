import RolePageTemplate from '../../components/RolePageTemplate'
import { feeData } from '../../utils/studentMockData'

const statusMeta = {
  paid:    { label: 'Paid',       color: '#10B981', bg: '#10B98112', icon: '✅' },
  pending: { label: 'Pending',    color: '#F59E0B', bg: '#F59E0B12', icon: '⏳' },
  failed:  { label: 'Failed',     color: '#EF4444', bg: '#EF444412', icon: '❌' },
}

export default function Page() {
  const { totalFee, paidAmount, pendingAmount, nextDue, nextDueAmount, transactions } = feeData
  const paidPct = Math.round((paidAmount / totalFee) * 100)
  const daysUntilDue = Math.ceil((new Date(nextDue) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <RolePageTemplate role="Student" title="Fee Status" description="View your fee payment summary, outstanding dues, and receipts.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total Fee', value: `₹${totalFee.toLocaleString('en-IN')}`, color: '#2563EB', icon: '🏦' },
            { label: 'Paid Amount', value: `₹${paidAmount.toLocaleString('en-IN')}`, color: '#10B981', icon: '✅' },
            { label: 'Pending Amount', value: `₹${pendingAmount.toLocaleString('en-IN')}`, color: '#EF4444', icon: '⚠️' },
            { label: 'Next Due', value: nextDue, color: '#F59E0B', icon: '📅' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Payment Progress */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Fee Payment Progress</h2>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#10B981' }}>{paidPct}%</span>
          </div>
          <div style={{ height: 12, background: '#e2e8f0', borderRadius: 6 }}>
            <div style={{ height: '100%', width: `${paidPct}%`, background: 'linear-gradient(90deg, #10B981, #06B6D4)', borderRadius: 6, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            <span>₹{paidAmount.toLocaleString('en-IN')} paid</span>
            <span>₹{pendingAmount.toLocaleString('en-IN')} remaining</span>
          </div>
        </div>

        {/* Next Due Alert */}
        {pendingAmount > 0 && (
          <div style={{ padding: '1rem 1.25rem', borderRadius: '1rem', background: daysUntilDue <= 15 ? '#EF444410' : '#F59E0B10', border: `1px solid ${daysUntilDue <= 15 ? '#EF444430' : '#F59E0B30'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: daysUntilDue <= 15 ? '#B91C1C' : '#92400e', fontSize: '0.9rem' }}>
                {daysUntilDue <= 0 ? '🚨 Payment Overdue!' : `⚠️ Payment Due in ${daysUntilDue} days`}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                ₹{nextDueAmount.toLocaleString('en-IN')} due on {nextDue} — Term 2 Tuition Fee
              </div>
            </div>
            <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: 'white', border: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
              💳 Pay Now
            </button>
          </div>
        )}

        {/* Transaction History */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Payment History</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Date', 'Description', 'Amount', 'Method', 'Status', 'Receipt'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const meta = statusMeta[tx.status]
                  return (
                    <tr key={tx.id}>
                      <td style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>{tx.date}</td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{tx.description}</td>
                      <td style={{ fontWeight: 700, color: tx.status === 'paid' ? '#10B981' : '#EF4444', whiteSpace: 'nowrap' }}>
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569' }}>{tx.method}</td>
                      <td>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', background: meta.bg, color: meta.color, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td>
                        {tx.receipt ? (
                          <button style={{ fontSize: '0.78rem', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                            📄 {tx.receipt}
                          </button>
                        ) : <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>—</span>}
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
