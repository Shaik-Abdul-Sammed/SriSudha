import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { libraryData } from '../../utils/studentMockData'

const BLUE = '#2563EB'

const daysOverdue = (dueDate) => {
  const diff = Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}
const daysLeft = (dueDate) => Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))

export default function Page() {
  const [books, setBooks] = useState(libraryData.borrowed)
  const [renewed, setRenewed] = useState([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  function renew(id) {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b
      const newDue = new Date(new Date(b.dueDate).getTime() + 14 * 24 * 60 * 60 * 1000)
      return { ...b, dueDate: newDue.toISOString().split('T')[0], renewals: b.renewals + 1 }
    }))
    setRenewed(prev => [...prev, id])
    setToast('✅ Book renewed for 14 more days!')
    setTimeout(() => setToast(null), 3000)
  }

  const totalFine = books.reduce((acc, b) => acc + daysOverdue(b.dueDate) * libraryData.finePerDay, 0)
  const catFiltered = libraryData.catalogue.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.author.toLowerCase().includes(search.toLowerCase()))

  return (
    <RolePageTemplate role="Student" title="Library Account" description="Track borrowed books, due dates, renewals, and search the catalogue.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {toast && (
          <div style={{ padding: '0.875rem 1.25rem', background: '#10B98112', border: '1px solid #10B98135', borderRadius: '0.875rem', color: '#065f46', fontWeight: 600, fontSize: '0.875rem' }}>{toast}</div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Books Borrowed', value: books.length, color: BLUE, icon: '📚' },
            { label: 'Due Today', value: books.filter(b => daysLeft(b.dueDate) === 0).length, color: '#F59E0B', icon: '📅' },
            { label: 'Overdue', value: books.filter(b => daysOverdue(b.dueDate) > 0).length, color: '#EF4444', icon: '🚨' },
            { label: 'Total Fine', value: `₹${totalFine}`, color: totalFine > 0 ? '#EF4444' : '#10B981', icon: '💰' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Borrowed Books */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>📖 Currently Borrowed</h2>
          </div>
          <div style={{ padding: '1.25rem', display: 'grid', gap: '0.875rem' }}>
            {books.map(b => {
              const overdue = daysOverdue(b.dueDate)
              const left = daysLeft(b.dueDate)
              const fine = overdue * libraryData.finePerDay
              const isOverdue = overdue > 0
              const isRenewed = renewed.includes(b.id)
              return (
                <div key={b.id} style={{ padding: '1rem 1.25rem', borderRadius: '1rem', background: 'var(--surface-bg)', borderLeft: `3px solid ${isOverdue ? '#EF4444' : left <= 3 ? '#F59E0B' : '#10B981'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{b.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>✍️ {b.author} • 🔖 ID: {b.id}</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ color: isOverdue ? '#EF4444' : left <= 3 ? '#F59E0B' : '#10B981', fontWeight: 700 }}>
                          {isOverdue ? `🚨 ${overdue} days overdue` : `📅 Due in ${left} day${left !== 1 ? 's' : ''}`}
                        </span>
                        <span style={{ color: '#94a3b8', marginLeft: '0.75rem' }}>Due: {b.dueDate}</span>
                      </div>
                      {fine > 0 && <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600, marginTop: '0.15rem' }}>💸 Fine: ₹{fine}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Renewals: {b.renewals}/2</span>
                      {b.renewals < 2 && !isRenewed && (
                        <button onClick={() => renew(b.id)}
                          style={{ padding: '0.4rem 0.875rem', borderRadius: '0.625rem', border: `1px solid ${BLUE}`, background: 'transparent', color: BLUE, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                          🔄 Renew
                        </button>
                      )}
                      {(b.renewals >= 2 || isRenewed) && (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{isRenewed ? '✅ Renewed' : 'Max renewals reached'}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Catalogue Search */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🔍 Search Catalogue</h2>
          <input className="form-control" placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: '1rem' }} />
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {catFiltered.map((c, i) => (
              <div key={i} style={{ padding: '0.75rem 1rem', borderRadius: '0.875rem', background: 'var(--surface-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>✍️ {c.author}</div>
                </div>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', background: c.available ? '#10B98112' : '#EF444412', color: c.available ? '#10B981' : '#EF4444', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {c.available ? '✅ Available' : '❌ Checked Out'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
