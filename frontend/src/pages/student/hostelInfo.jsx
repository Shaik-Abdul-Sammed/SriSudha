import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { hostelNotices, messMenu, STUDENT } from '../../utils/studentMockData'

const BLUE = '#2563EB'
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const today = daysOfWeek[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

export default function Page() {
  const [activeDay, setActiveDay] = useState(today)
  const [requestSent, setRequestSent] = useState(false)
  const [reqForm, setReqForm] = useState({ type: 'Plumbing', desc: '' })
  const { hostel } = STUDENT

  function sendRequest(e) {
    e.preventDefault()
    setRequestSent(true)
    setTimeout(() => setRequestSent(false), 3500)
    setReqForm({ type: 'Plumbing', desc: '' })
  }

  return (
    <RolePageTemplate role="Student" title="Hostel Information" description="Your hostel details, mess menu, notices, and maintenance requests.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Room Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', borderLeft: '4px solid #2563EB' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: BLUE }}>🏠 My Room Details</h2>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {[
                { label: 'Block', value: hostel.block },
                { label: 'Room No.', value: hostel.room },
                { label: 'Roommates', value: hostel.roommates.join(', ') },
              ].map(r => (
                <div key={r.label} style={{ padding: '0.65rem 0.875rem', borderRadius: '0.75rem', background: 'var(--surface-bg)', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontWeight: 700 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Request */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>🔧 Maintenance Request</h2>
            {requestSent ? (
              <div style={{ padding: '0.875rem', borderRadius: '0.875rem', background: '#10B98112', border: '1px solid #10B98130', color: '#065f46', fontWeight: 600, fontSize: '0.85rem' }}>
                ✅ Request sent! Maintenance team will reach out within 24 hours.
              </div>
            ) : (
              <form onSubmit={sendRequest} style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>ISSUE TYPE</label>
                  <select className="form-select" style={{ fontSize: '0.82rem' }} value={reqForm.type} onChange={e => setReqForm(p => ({...p, type: e.target.value}))}>
                    {['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'AC / Fan', 'Internet', 'Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>DESCRIPTION</label>
                  <textarea required className="form-control" rows={2} placeholder="Describe the issue..." style={{ fontSize: '0.82rem' }} value={reqForm.desc} onChange={e => setReqForm(p => ({...p, desc: e.target.value}))} />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">📤 Submit Request</button>
              </form>
            )}
          </div>
        </div>

        {/* Notices */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>📢 Hostel Notices</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {hostelNotices.map(n => (
              <div key={n.id} style={{ padding: '0.875rem 1rem', borderRadius: '0.875rem', background: 'var(--surface-bg)', borderLeft: '3px solid #F59E0B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{n.title}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.date}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{n.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mess Menu */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>🍽️ Weekly Mess Menu</h2>
          </div>
          <div style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {daysOfWeek.map(d => (
                <button key={d} onClick={() => setActiveDay(d)}
                  style={{ padding: '0.35rem 0.875rem', borderRadius: '2rem', border: `2px solid ${activeDay === d ? BLUE : 'var(--border-color)'}`, background: activeDay === d ? `${BLUE}15` : 'var(--card-bg)', color: activeDay === d ? BLUE : '#64748b', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  {d === today ? `${d.slice(0, 3)} ✦` : d.slice(0, 3)}
                </button>
              ))}
            </div>
            {messMenu[activeDay] && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
                {['breakfast', 'lunch', 'dinner'].map(meal => (
                  <div key={meal} style={{ padding: '1rem', borderRadius: '0.875rem', background: 'var(--surface-bg)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem' }}>
                      {meal === 'breakfast' ? '☀️' : meal === 'lunch' ? '🌤️' : '🌙'} {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </div>
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{messMenu[activeDay][meal]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
