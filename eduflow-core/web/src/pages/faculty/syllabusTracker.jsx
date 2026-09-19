import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English']

const syllabusData = {
  Physics: [
    { unit: 'Unit 1', topic: 'Physical World & Measurement', chapters: 4, covered: 4 },
    { unit: 'Unit 2', topic: 'Kinematics', chapters: 3, covered: 3 },
    { unit: 'Unit 3', topic: 'Laws of Motion', chapters: 3, covered: 2 },
    { unit: 'Unit 4', topic: 'Work, Energy & Power', chapters: 3, covered: 1 },
    { unit: 'Unit 5', topic: 'Rotational Motion', chapters: 4, covered: 0 },
  ],
  Chemistry: [
    { unit: 'Unit 1', topic: 'Basic Concepts of Chemistry', chapters: 3, covered: 3 },
    { unit: 'Unit 2', topic: 'Structure of Atom', chapters: 4, covered: 4 },
    { unit: 'Unit 3', topic: 'Classification of Elements', chapters: 3, covered: 2 },
    { unit: 'Unit 4', topic: 'Chemical Bonding', chapters: 5, covered: 2 },
    { unit: 'Unit 5', topic: 'States of Matter', chapters: 3, covered: 0 },
  ],
  Mathematics: [
    { unit: 'Unit 1', topic: 'Sets, Relations & Functions', chapters: 3, covered: 3 },
    { unit: 'Unit 2', topic: 'Algebra & Complex Numbers', chapters: 4, covered: 4 },
    { unit: 'Unit 3', topic: 'Coordinate Geometry', chapters: 5, covered: 3 },
    { unit: 'Unit 4', topic: 'Calculus', chapters: 6, covered: 2 },
    { unit: 'Unit 5', topic: 'Statistics & Probability', chapters: 4, covered: 0 },
  ],
  Biology: [
    { unit: 'Unit 1', topic: 'Diversity of Living Organisms', chapters: 4, covered: 4 },
    { unit: 'Unit 2', topic: 'Structural Organisation', chapters: 3, covered: 3 },
    { unit: 'Unit 3', topic: 'Cell Structure & Function', chapters: 4, covered: 2 },
    { unit: 'Unit 4', topic: 'Plant Physiology', chapters: 5, covered: 1 },
    { unit: 'Unit 5', topic: 'Human Physiology', chapters: 5, covered: 0 },
  ],
  English: [
    { unit: 'Unit 1', topic: 'Reading Comprehension', chapters: 2, covered: 2 },
    { unit: 'Unit 2', topic: 'Grammar & Usage', chapters: 3, covered: 3 },
    { unit: 'Unit 3', topic: 'Writing Skills', chapters: 3, covered: 2 },
    { unit: 'Unit 4', topic: 'Literature — Prose', chapters: 4, covered: 1 },
    { unit: 'Unit 5', topic: 'Literature — Poetry', chapters: 3, covered: 0 },
  ],
}

const TEAL = '#10B981'

export default function Page() {
  const [subject, setSubject] = useState('Physics')
  const data = syllabusData[subject]
  const totalChapters = data.reduce((a, u) => a + u.chapters, 0)
  const coveredChapters = data.reduce((a, u) => a + u.covered, 0)
  const overallPct = Math.round((coveredChapters / totalChapters) * 100)

  function statusColor(covered, total) {
    const p = covered / total
    if (p === 0) return '#EF4444'
    if (p < 0.5) return '#F59E0B'
    if (p < 1)   return '#2563EB'
    return TEAL
  }

  function statusLabel(covered, total) {
    if (covered === 0) return 'Not Started'
    if (covered === total) return 'Completed'
    return 'In Progress'
  }

  return (
    <RolePageTemplate role="Faculty" title="Syllabus Tracker" description="Monitor topic coverage and keep your syllabus completion on track.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Subject Tabs */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Subject</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {subjects.map(s => (
                <button key={s} onClick={() => setSubject(s)} style={{
                  padding: '0.5rem 1.1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                  background: subject === s ? `linear-gradient(135deg,${TEAL},#0EA5E9)` : `${TEAL}10`,
                  color: subject === s ? 'white' : TEAL,
                  boxShadow: subject === s ? `0 4px 12px ${TEAL}40` : 'none', transition: 'all 0.2s',
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>📊 {subject} — Overall Coverage</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>{coveredChapters} of {totalChapters} chapters completed</p>
              </div>
              <span style={{
                fontSize: '1.75rem', fontWeight: 900,
                background: `linear-gradient(135deg,${TEAL},#0EA5E9)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{overallPct}%</span>
            </div>
            <div style={{ height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${overallPct}%`,
                background: `linear-gradient(90deg,${TEAL},#0EA5E9)`, borderRadius: 6,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Unit-by-unit */}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {data.map(unit => {
            const pct   = Math.round((unit.covered / unit.chapters) * 100)
            const color = statusColor(unit.covered, unit.chapters)
            const label = statusLabel(unit.covered, unit.chapters)
            return (
              <div key={unit.unit} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem 1.25rem', borderLeft: `4px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color, background: `${color}15`, padding: '0.2rem 0.55rem', borderRadius: '0.375rem', border: `1px solid ${color}25` }}>{unit.unit}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{unit.topic}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{unit.covered} / {unit.chapters} chapters done</div>
                  </div>
                  <span style={{ padding: '0.25rem 0.7rem', borderRadius: '2rem', background: `${color}12`, color, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${color}25` }}>{label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color, minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </RolePageTemplate>
  )
}
