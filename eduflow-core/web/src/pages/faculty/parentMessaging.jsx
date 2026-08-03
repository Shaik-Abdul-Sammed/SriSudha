import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { studentDummyIds } from '../../utils/studentCatalog'

const ORANGE = '#F97316'

const inbox = [
  { id: 1, parent: 'Mr. R. Sharma', student: 'Sai Sree', date: '2026-05-08', subject: 'Attendance concern in Physics', message: 'Dear Madam, I noticed Sai\'s attendance is dropping. Can we schedule a meeting to discuss?', read: false, replied: false },
  { id: 2, parent: 'Mrs. S. Patil', student: 'Sahana Reddy', date: '2026-05-06', subject: 'Request for extra coaching', message: 'Hello, Sahana is struggling with Organic Chemistry. Could you arrange additional sessions?', read: true, replied: true },
  { id: 3, parent: 'Mr. K. Rao', student: 'Anika Rao', date: '2026-05-04', subject: 'Assignment submission delay', message: 'Anika was unwell last week. Requesting an extension for the pending assignment.', read: true, replied: false },
]

export default function Page() {
  const [messages, setMessages] = useState(inbox)
  const [selected, setSelected]   = useState(null)
  const [reply, setReply]         = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [compose, setCompose] = useState({ to: studentDummyIds[0].name, subject: '', body: '' })
  const [sent, setSent] = useState(false)

  function open(msg) {
    setSelected(msg)
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    setReply('')
  }

  function sendReply(e) {
    e.preventDefault()
    setMessages(prev => prev.map(m => m.id === selected.id ? { ...m, replied: true } : m))
    setSelected(null)
    setReply('')
  }

  function sendBroadcast(e) {
    e.preventDefault()
    setSent(true)
    setCompose({ to: studentDummyIds[0].name, subject: '', body: '' })
    setShowCompose(false)
    setTimeout(() => setSent(false), 3000)
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <RolePageTemplate role="Faculty" title="Parent Messaging" description="Communicate with parents about student progress, attendance, and concerns.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {sent && (
          <div style={{ padding: '0.875rem', background: '#10B98110', border: '1px solid #10B98130', borderRadius: '0.875rem', color: '#065f46', fontWeight: 600, fontSize: '0.875rem' }}>
            ✅ Message sent to parent successfully.
          </div>
        )}

        {/* Stats + Compose */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { label: 'Inbox', value: messages.length, color: ORANGE },
              { label: 'Unread', value: unread, color: '#EF4444' },
              { label: 'Replied', value: messages.filter(m => m.replied).length, color: '#10B981' },
            ].map(s => (
              <div key={s.label} style={{ padding: '0.6rem 1rem', borderRadius: '0.875rem', background: `${s.color}10`, border: `1px solid ${s.color}25`, textAlign: 'center', minWidth: 70 }}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowCompose(v => !v)} className="btn" style={{
            background: `linear-gradient(135deg,${ORANGE},#EF4444)`, color: 'white', border: 'none',
            fontWeight: 700, borderRadius: '0.875rem', boxShadow: `0 4px 14px ${ORANGE}40`,
          }}>
            {showCompose ? '✕ Cancel' : '✉️ New Message'}
          </button>
        </div>

        {/* Compose */}
        {showCompose && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', border: `1px solid ${ORANGE}25` }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: ORANGE }}>✉️ Compose Message</h2>
              <form onSubmit={sendBroadcast} style={{ display: 'grid', gap: '0.875rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>TO (Student / Parent)</label>
                  <select className="form-select" value={compose.to} onChange={e => setCompose(p => ({...p, to: e.target.value}))}>
                    {studentDummyIds.map(s => <option key={s.id}>{s.name} (Parent)</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>SUBJECT *</label>
                  <input required className="form-control" placeholder="Message subject..." value={compose.subject} onChange={e => setCompose(p => ({...p, subject: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>MESSAGE *</label>
                  <textarea required className="form-control" rows={4} placeholder="Message content..." value={compose.body} onChange={e => setCompose(p => ({...p, body: e.target.value}))} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn" style={{ background: `linear-gradient(135deg,${ORANGE},#EF4444)`, color: 'white', border: 'none', fontWeight: 700, borderRadius: '0.875rem' }}>
                    📤 Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Inbox / Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: '1.25rem' }}>
          {/* Inbox List */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📥 Inbox</h2>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {messages.map(msg => (
                  <div key={msg.id}
                    onClick={() => open(msg)}
                    style={{
                      padding: '0.875rem 1rem', borderRadius: '0.875rem', cursor: 'pointer',
                      background: selected?.id === msg.id ? `${ORANGE}10` : msg.read ? 'transparent' : '#f0f9ff',
                      border: `1px solid ${selected?.id === msg.id ? ORANGE + '40' : msg.read ? '#f1f5f9' : '#bae6fd'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ fontWeight: msg.read ? 600 : 800, fontSize: '0.875rem', flex: 1 }}>{msg.subject}</div>
                      {!msg.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', flexShrink: 0, marginTop: 4 }} />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      👤 {msg.parent} · {msg.student} · 📅 {msg.date}
                    </div>
                    {msg.replied && <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>✓ Replied</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          {selected && (
            <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
              <div className="card-body p-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{selected.subject}</h2>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem' }}>✕</button>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                  From: <strong>{selected.parent}</strong> · Student: <strong>{selected.student}</strong> · {selected.date}
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.875rem', fontSize: '0.875rem', color: '#475569', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  {selected.message}
                </div>
                <form onSubmit={sendReply}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>REPLY</label>
                  <textarea required className="form-control" rows={4} placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} style={{ marginBottom: '0.875rem' }} />
                  <button type="submit" className="btn" style={{ background: `linear-gradient(135deg,${ORANGE},#EF4444)`, color: 'white', border: 'none', fontWeight: 700, borderRadius: '0.875rem', width: '100%' }}>
                    📤 Send Reply
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </RolePageTemplate>
  )
}
