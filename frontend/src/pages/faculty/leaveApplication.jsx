import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const ROSE = '#EF4444'

const leaveTypes = ['Casual Leave', 'Medical Leave', 'Earned Leave', 'On-Duty Leave', 'Special Leave']

const leaveBalance = [
  { type: 'Casual Leave',   total: 12, used: 4 },
  { type: 'Medical Leave',  total: 10, used: 2 },
  { type: 'Earned Leave',   total: 30, used: 8 },
  { type: 'On-Duty Leave',  total: 15, used: 6 },
]

const leaveHistory = [
  { id: 1, type: 'Casual Leave',  from: '2026-04-10', to: '2026-04-11', days: 2, reason: 'Personal work',              status: 'approved' },
  { id: 2, type: 'Medical Leave', from: '2026-03-22', to: '2026-03-24', days: 3, reason: 'Fever and rest',             status: 'approved' },
  { id: 3, type: 'Earned Leave',  from: '2026-02-15', to: '2026-02-19', days: 5, reason: 'Family function',            status: 'approved' },
  { id: 4, type: 'On-Duty Leave', from: '2026-05-20', to: '2026-05-21', days: 2, reason: 'Workshop at IIT Hyderabad', status: 'pending'  },
]

const statusStyle = {
  approved: { color: '#10B981', bg: '#10B98112', border: '#10B98128' },
  pending:  { color: '#F59E0B', bg: '#F59E0B12', border: '#F59E0B28' },
  rejected: { color: '#EF4444', bg: '#EF444412', border: '#EF444428' },
}

export default function Page() {
  const [form, setForm] = useState({ type: 'Casual Leave', from: '', to: '', reason: '', alternate: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <RolePageTemplate role="Faculty" title="Leave Application" description="Apply for leave and track your leave balance and application status.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Leave Balance Cards */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>📊 Leave Balance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.75rem' }}>
              {leaveBalance.map(lb => {
                const remaining = lb.total - lb.used
                const pct = Math.round((lb.used / lb.total) * 100)
                const color = pct > 75 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#10B981'
                return (
                  <div key={lb.type} style={{ padding: '1rem', borderRadius: '0.875rem', background: `${color}08`, border: `1px solid ${color}20` }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{lb.type}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color }}>{remaining}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/ {lb.total} days</span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>{lb.used} used</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="row-cols-1 row-cols-lg-2">

          {/* Application Form */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: ROSE }}>📋 New Application</h2>
              {submitted ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', background: '#10B98110', borderRadius: '0.875rem', border: '1px solid #10B98130' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                  <div style={{ fontWeight: 700, color: '#065f46' }}>Application Submitted!</div>
                  <div style={{ fontSize: '0.8rem', color: '#10B981', marginTop: '0.25rem' }}>Your leave request is pending HOD approval.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>LEAVE TYPE</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                      {leaveTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>FROM DATE *</label>
                      <input required type="date" className="form-control" value={form.from} onChange={e => setForm(p => ({...p, from: e.target.value}))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>TO DATE *</label>
                      <input required type="date" className="form-control" value={form.to} onChange={e => setForm(p => ({...p, to: e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>REASON *</label>
                    <textarea required className="form-control" rows={3} placeholder="Reason for leave..." value={form.reason} onChange={e => setForm(p => ({...p, reason: e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>ALTERNATE ARRANGEMENT</label>
                    <input className="form-control" placeholder="Who will cover your classes?" value={form.alternate} onChange={e => setForm(p => ({...p, alternate: e.target.value}))} />
                  </div>
                  <button type="submit" className="btn" style={{ background: `linear-gradient(135deg,${ROSE},#F97316)`, color: 'white', border: 'none', fontWeight: 700, borderRadius: '0.875rem', boxShadow: `0 4px 14px ${ROSE}40` }}>
                    📤 Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* History */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>🕑 Application History</h2>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {leaveHistory.map(lh => {
                  const st = statusStyle[lh.status]
                  return (
                    <div key={lh.id} style={{ padding: '0.875rem 1rem', borderRadius: '0.875rem', background: `${st.color}08`, border: `1px solid ${st.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{lh.type}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lh.from} → {lh.to} · {lh.days} days</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{lh.reason}</div>
                        </div>
                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', background: st.bg, color: st.color, fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${st.border}`, flexShrink: 0 }}>
                          {lh.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
