import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const INDIGO = '#4338CA'

const projects = [
  {
    id: 1, title: 'Smart Attendance System using Face Recognition',
    domain: 'Computer Vision', collaborators: 'Dr. K. Sharma, Prof. R. Rao',
    startDate: '2025-08-01', status: 'in-progress', publications: 1,
    description: 'Developing a real-time face recognition system for automating attendance in classrooms using OpenCV and deep learning.',
    funding: '₹2.5 Lakhs (AICTE)',
  },
  {
    id: 2, title: 'Predicting Student Performance Using ML',
    domain: 'Machine Learning / EdTech', collaborators: 'Prof. S. Mehta',
    startDate: '2025-11-15', status: 'in-progress', publications: 0,
    description: 'Building predictive models to identify at-risk students early using historical academic data and attendance records.',
    funding: 'Institute Seed Grant',
  },
  {
    id: 3, title: 'IoT-based Smart Lab Monitoring',
    domain: 'IoT / Embedded Systems', collaborators: 'Solo',
    startDate: '2024-06-01', status: 'completed', publications: 2,
    description: 'Designed a cost-effective IoT solution for real-time lab equipment monitoring and safety alerts.',
    funding: '₹80K (DST)',
  },
]

const publications = [
  { title: 'Face Recognition in Constrained Environments', journal: 'IEEE Access', year: '2025', status: 'published', citations: 12 },
  { title: 'IoT-based Lab Safety System', journal: 'Elsevier IoT Journal', year: '2024', status: 'published', citations: 5 },
  { title: 'ML Models for Student Dropout Prediction', journal: 'Computers & Education', year: '2026', status: 'under-review', citations: 0 },
]

const statusColor = { 'in-progress': '#F59E0B', completed: '#10B981', planned: '#2563EB' }
const pubStatusColor = { published: '#10B981', 'under-review': '#F59E0B', rejected: '#EF4444' }

export default function Page() {
  const [activeTab, setActiveTab] = useState('projects')
  const [expanded, setExpanded]   = useState(null)

  return (
    <RolePageTemplate role="Faculty" title="Research Tracker" description="Track your research projects, publications, and funding status.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Projects', value: projects.length, color: INDIGO },
            { label: 'In Progress', value: projects.filter(p => p.status === 'in-progress').length, color: '#F59E0B' },
            { label: 'Publications', value: publications.filter(p => p.status === 'published').length, color: '#10B981' },
            { label: 'Total Citations', value: publications.reduce((a, p) => a + p.citations, 0), color: '#7C3AED' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['projects', 'publications'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '0.45rem 1.1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize',
              background: activeTab === t ? `linear-gradient(135deg,${INDIGO},#2563EB)` : `${INDIGO}10`,
              color: activeTab === t ? 'white' : INDIGO, transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>

        {/* Projects */}
        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gap: '0.875rem' }}>
            {projects.map(p => {
              const color = statusColor[p.status] || '#94a3b8'
              return (
                <div key={p.id} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', borderLeft: `4px solid ${color}`, cursor: 'pointer' }}
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.title}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span>🔬 {p.domain}</span>
                          <span>👥 {p.collaborators}</span>
                          <span>📅 Since {p.startDate}</span>
                          <span>💰 {p.funding}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexShrink: 0 }}>
                        {p.publications > 0 && <span style={{ padding: '0.25rem 0.6rem', borderRadius: '2rem', background: '#10B98112', color: '#10B981', fontSize: '0.7rem', fontWeight: 700 }}>{p.publications} pub{p.publications > 1 ? 's' : ''}</span>}
                        <span style={{ padding: '0.25rem 0.7rem', borderRadius: '2rem', background: `${color}12`, color, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${color}25` }}>{p.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    {expanded === p.id && (
                      <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #f1f5f9', fontSize: '0.875rem', color: '#475569', lineHeight: 1.65 }}>
                        {p.description}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Publications */}
        {activeTab === 'publications' && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {publications.map((pub, i) => {
              const sc = pubStatusColor[pub.status] || '#94a3b8'
              return (
                <div key={i} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1.1rem 1.25rem', borderLeft: `4px solid ${sc}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{pub.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span>📰 {pub.journal}</span>
                        <span>📅 {pub.year}</span>
                        {pub.citations > 0 && <span>🔖 {pub.citations} citations</span>}
                      </div>
                    </div>
                    <span style={{ padding: '0.25rem 0.7rem', borderRadius: '2rem', background: `${sc}12`, color: sc, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${sc}25`, flexShrink: 0 }}>
                      {pub.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </RolePageTemplate>
  )
}
