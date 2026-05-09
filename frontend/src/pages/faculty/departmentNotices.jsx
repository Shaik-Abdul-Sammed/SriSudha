import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const INDIGO = '#4F46E5'

const notices = [
  { id: 1, title: 'Mid-Term Exam Schedule Released',       date: '2026-05-08', category: 'Exam', priority: 'high',   body: 'Mid-term examinations will begin from 12 Sept 2026. Timetable is pinned on the faculty portal.', author: 'HOD Physics', read: false },
  { id: 2, title: 'Staff Meeting — Friday 3 PM',           date: '2026-05-07', category: 'Admin', priority: 'medium', body: 'All faculty members are requested to attend the staff meeting in Room 201 on Friday.', author: 'Principal', read: false },
  { id: 3, title: 'Annual Day Cultural Event Volunteers',  date: '2026-05-06', category: 'Event', priority: 'low',    body: 'Faculty volunteers for Annual Day cultural programme are requested to register by May 10.', author: 'Cultural Committee', read: true },
  { id: 4, title: 'New Marking Scheme for Practicals',    date: '2026-05-05', category: 'Academic', priority: 'high', body: 'Revised practical marking scheme (40+10 format) is in effect from this semester.', author: 'Academic Council', read: true },
  { id: 5, title: 'Holiday on 15 May — Budget Day',       date: '2026-05-04', category: 'Admin', priority: 'low',    body: 'The institution will remain closed on 15 May 2026 in observance of the State Budget Day.', author: 'Admin Office', read: true },
]

const catColors = { Exam: '#EF4444', Admin: '#2563EB', Event: '#F59E0B', Academic: '#10B981' }
const priColors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }

export default function Page() {
  const [noticeList, setNoticeList] = useState(notices)
  const [filter, setFilter]         = useState('All')
  const [showCompose, setShowCompose] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Academic', priority: 'medium', body: '' })
  const [expanded, setExpanded] = useState(null)

  const categories = ['All', 'Exam', 'Admin', 'Event', 'Academic']
  const filtered = filter === 'All' ? noticeList : noticeList.filter(n => n.category === filter)
  const unreadCount = noticeList.filter(n => !n.read).length

  function markRead(id) {
    setNoticeList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function postNotice(e) {
    e.preventDefault()
    setNoticeList(prev => [{
      id: Date.now(), ...form,
      date: new Date().toISOString().split('T')[0],
      author: 'You', read: true,
    }, ...prev])
    setForm({ title: '', category: 'Academic', priority: 'medium', body: '' })
    setShowCompose(false)
  }

  return (
    <RolePageTemplate role="Faculty" title="Department Notices" description="Read and post notices for your department and classes.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '0.4rem 0.9rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
                background: filter === c ? INDIGO : `${INDIGO}10`,
                color: filter === c ? 'white' : INDIGO, transition: 'all 0.2s',
              }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <span style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: '#EF444415', color: '#EF4444', fontWeight: 700, fontSize: '0.75rem', border: '1px solid #EF444430' }}>
                {unreadCount} Unread
              </span>
            )}
            <button onClick={() => setShowCompose(v => !v)} className="btn" style={{
              background: `linear-gradient(135deg,${INDIGO},#2563EB)`, color: 'white', border: 'none',
              fontWeight: 700, borderRadius: '0.875rem', boxShadow: `0 4px 14px ${INDIGO}40`,
            }}>
              {showCompose ? '✕ Cancel' : '📢 Post Notice'}
            </button>
          </div>
        </div>

        {/* Compose */}
        {showCompose && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', border: `1px solid ${INDIGO}25` }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: INDIGO }}>📢 Compose Notice</h2>
              <form onSubmit={postNotice}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>TITLE *</label>
                    <input required className="form-control" placeholder="Notice title..." value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>CATEGORY</label>
                    <select className="form-select" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                      {['Academic','Exam','Admin','Event'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>PRIORITY</label>
                    <select className="form-select" value={form.priority} onChange={e => setForm(p => ({...p, priority: e.target.value}))}>
                      <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>CONTENT *</label>
                    <textarea required className="form-control" rows={4} placeholder="Notice body..." value={form.body} onChange={e => setForm(p => ({...p, body: e.target.value}))} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn" style={{ background: `linear-gradient(135deg,${INDIGO},#2563EB)`, color: 'white', border: 'none', fontWeight: 700, borderRadius: '0.875rem' }}>
                    📤 Post Notice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notices List */}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>No notices in this category.</div>
          )}
          {filtered.map(n => (
            <div key={n.id}
              className="card border-0 shadow-sm"
              style={{ borderRadius: '1rem', borderLeft: `4px solid ${catColors[n.category] || '#94a3b8'}`, opacity: n.read ? 0.85 : 1, cursor: 'pointer' }}
              onClick={() => { setExpanded(expanded === n.id ? null : n.id); markRead(n.id) }}
            >
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', flexShrink: 0, display: 'inline-block' }} />}
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{n.title}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span>📅 {n.date}</span><span>👤 {n.author}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: '0.375rem', background: `${catColors[n.category]}15`, color: catColors[n.category], fontSize: '0.7rem', fontWeight: 700 }}>{n.category}</span>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: '0.375rem', background: `${priColors[n.priority]}15`, color: priColors[n.priority], fontSize: '0.7rem', fontWeight: 700 }}>{n.priority}</span>
                  </div>
                </div>
                {expanded === n.id && (
                  <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #f1f5f9', fontSize: '0.875rem', color: '#475569', lineHeight: 1.65 }}>
                    {n.body}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RolePageTemplate>
  )
}
