import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { feeData } from '../../utils/studentMockData'

const AMBER = '#F59E0B'
const RED = '#EF4444'

export default function Page() {
  const [paid, setPaid] = useState(false)

  return (
    <RolePageTemplate role="Parent" title="Due Alerts & Notices" description="Track pending fee schedules, library penalties, and outstanding institutional deposits.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Due alerts card */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden', background: paid ? 'linear-gradient(135deg, #1E293B, #10B981)' : 'linear-gradient(135deg, #1E293B, #EF4444)', color: 'white' }}>
          <div className="card-body p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge text-bg-light mb-2" style={{ fontWeight: 700 }}>ACCOUNTS SUMMARY</span>
              {paid ? (
                <>
                  <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>All Accounts Cleared</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Thank you! No due actions are outstanding on this student profile.</p>
                </>
              ) : (
                <>
                  <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>₹{feeData.pendingAmount.toLocaleString('en-IN')} Due Outstanding</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Next payment deadline: <strong>{feeData.nextDue}</strong> for <strong>Term 2 Tuition</strong>.</p>
                </>
              )}
            </div>
            {!paid && (
              <button className="btn btn-warning fw-bold" onClick={() => setPaid(true)} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem' }}>
                💳 Pay Outstanding Due
              </button>
            )}
          </div>
        </div>

        {/* Breakdown items */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Active Due Breakdowns</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            
            {/* item 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem', borderRadius: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div>
                <span className="badge text-bg-danger" style={{ marginBottom: '0.35rem' }}>OVERDUE</span>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Term 2 Tuition Fee</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Deadline: {feeData.nextDue}</div>
              </div>
              <strong style={{ fontSize: '1rem', color: RED }}>₹{feeData.nextDueAmount.toLocaleString('en-IN')}</strong>
            </div>

            {/* item 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem', borderRadius: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div>
                <span className="badge text-bg-warning" style={{ marginBottom: '0.35rem' }}>PENDING RELEASE</span>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Library Book Return</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>HC Verma Vol 1 (Overdue fine ₹2/day)</div>
              </div>
              <strong style={{ fontSize: '1rem', color: AMBER }}>₹24.00</strong>
            </div>

          </div>
        </div>

      </div>
    </RolePageTemplate>
  )
}
