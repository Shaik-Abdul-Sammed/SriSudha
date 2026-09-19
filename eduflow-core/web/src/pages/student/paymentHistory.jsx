import RolePageTemplate from '../../components/RolePageTemplate'
import { feeData } from '../../utils/studentMockData'

const statusMeta = {
  paid:    { label: 'Paid',    color: '#10B981', bg: '#10B98112', icon: '✅' },
  pending: { label: 'Pending', color: '#F59E0B', bg: '#F59E0B12', icon: '⏳' },
  failed:  { label: 'Failed',  color: '#EF4444', bg: '#EF444412', icon: '❌' },
}

export default function Page() {
  const { transactions, totalFee, paidAmount } = feeData
  const paidTxns = transactions.filter(t => t.status === 'paid')
  const totalPaid = paidTxns.reduce((a, t) => a + t.amount, 0)

  return (
    <RolePageTemplate role="Student" title="Payment History" description="Complete log of all your fee transactions and receipts.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total Transactions', value: transactions.length, color: '#2563EB', icon: '📋' },
            { label: 'Total Paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, color: '#10B981', icon: '✅' },
            { label: 'Pending', value: `₹${(totalFee - paidAmount).toLocaleString('en-IN')}`, color: '#EF4444', icon: '⏳' },
            { label: 'Receipts Available', value: paidTxns.length, color: '#8B5CF6', icon: '📄' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: s.color, lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Transaction Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>All Transactions</h2>
            <button className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.78rem' }}>⬇️ Export PDF</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Txn ID', 'Date', 'Description', 'Amount', 'Method', 'Status', 'Receipt'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const meta = statusMeta[tx.status]
                  return (
                    <tr key={tx.id} style={{ borderLeft: tx.status === 'pending' ? '3px solid #F59E0B' : tx.status === 'failed' ? '3px solid #EF4444' : '3px solid transparent' }}>
                      <td style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>{tx.id}</td>
                      <td style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>{tx.date}</td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: 200 }}>{tx.description}</td>
                      <td style={{ fontWeight: 800, color: tx.status === 'paid' ? '#10B981' : '#F59E0B', whiteSpace: 'nowrap' }}>
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569' }}>{tx.method}</td>
                      <td>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', background: meta.bg, color: meta.color, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td>
                        {tx.receipt
                          ? <button style={{ fontSize: '0.78rem', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>📄 View</button>
                          : <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '2rem', background: 'var(--surface-bg)' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
              Total Paid: <strong style={{ color: '#10B981' }}>₹{totalPaid.toLocaleString('en-IN')}</strong>
            </span>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
