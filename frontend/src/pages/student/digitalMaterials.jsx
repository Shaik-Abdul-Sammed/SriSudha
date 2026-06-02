import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { digitalMaterials } from '../../utils/studentMockData'

const typeIcon = { PDF: '📄', PPT: '📊', Video: '🎬', DOC: '📝' }
const typeColor = { PDF: '#EF4444', PPT: '#F59E0B', Video: '#8B5CF6', DOC: '#2563EB' }

export default function Page() {
  const [subFilter, setSubFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [downloaded, setDownloaded] = useState([])

  const subjects = ['all', ...new Set(digitalMaterials.map(m => m.subject))]
  const types = ['all', ...new Set(digitalMaterials.map(m => m.type))]

  const filtered = digitalMaterials.filter(m => {
    const matchSub = subFilter === 'all' || m.subject === subFilter
    const matchType = typeFilter === 'all' || m.type === typeFilter
    return matchSub && matchType
  })

  function handleDownload(id) {
    setDownloaded(prev => [...prev, id])
    setTimeout(() => setDownloaded(prev => prev.filter(d => d !== id)), 2500)
  }

  return (
    <RolePageTemplate role="Student" title="Digital Materials" description="Access notes, slides, and video lectures shared by your faculty.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Total', value: digitalMaterials.length, color: '#2563EB', icon: '📁' },
            { label: 'New', value: digitalMaterials.filter(m => m.isNew).length, color: '#10B981', icon: '🆕' },
            { label: 'PDFs', value: digitalMaterials.filter(m => m.type === 'PDF').length, color: '#EF4444', icon: '📄' },
            { label: 'Videos', value: digitalMaterials.filter(m => m.type === 'Video').length, color: '#8B5CF6', icon: '🎬' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {subjects.map(s => (
              <button key={s} onClick={() => setSubFilter(s)}
                style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: `2px solid ${subFilter === s ? '#2563EB' : 'var(--border-color)'}`, background: subFilter === s ? '#2563EB15' : 'var(--card-bg)', color: subFilter === s ? '#2563EB' : '#64748b', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                {s === 'all' ? 'All Subjects' : s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '2rem', border: `1px solid ${typeFilter === t ? (typeColor[t] || '#2563EB') : 'var(--border-color)'}`, background: typeFilter === t ? `${typeColor[t] || '#2563EB'}15` : 'var(--card-bg)', color: typeFilter === t ? (typeColor[t] || '#2563EB') : '#94a3b8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                {t === 'all' ? 'All Types' : `${typeIcon[t] || ''} ${t}`}
              </button>
            ))}
          </div>
        </div>

        {/* Materials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
          {filtered.map(m => {
            const color = typeColor[m.type] || '#2563EB'
            const isDownloading = downloaded.includes(m.id)
            return (
              <div key={m.id} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ width: 42, height: 42, borderRadius: '0.75rem', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                      {typeIcon[m.type] || '📁'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {m.isNew && (
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: '#10B98115', color: '#10B981', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>🆕 New</span>
                      )}
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: `${color}12`, color, fontSize: '0.65rem', fontWeight: 700 }}>{m.type}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', lineHeight: 1.4 }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.875rem' }}>
                    <span>📚 {m.subject}</span>
                    <span>👨‍🏫 {m.faculty}</span>
                    <span>📅 {m.uploadedOn} • {m.size}</span>
                  </div>
                  <button onClick={() => handleDownload(m.id)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '0.75rem', border: 'none', background: isDownloading ? `${color}20` : `linear-gradient(135deg, ${color}, ${color}cc)`, color: isDownloading ? color : 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                    {isDownloading ? '✅ Downloaded!' : `⬇️ Download ${m.type}`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
            <div style={{ fontWeight: 600 }}>No materials found for this filter.</div>
          </div>
        )}
      </div>
    </RolePageTemplate>
  )
}
