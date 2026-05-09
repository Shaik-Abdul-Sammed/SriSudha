import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseTracks, studentDummyIds } from '../../utils/studentCatalog'

const instituteName = 'Sri Sudha'

const roleCards = [
  { role: 'student', title: 'Student Portal', desc: 'Academic progress, assignments, fees, and mentor connect.', icon: '👨‍🎓', color: '#2563EB', lightColor: 'rgba(37,99,235,0.08)', gradClass: 'portal-card-student' },
  { role: 'faculty', title: 'Faculty Portal', desc: 'Attendance, marks entry, class analytics, and resources.', icon: '👨‍🏫', color: '#10B981', lightColor: 'rgba(16,185,129,0.08)', gradClass: 'portal-card-faculty' },
  { role: 'parent',  title: 'Parent Portal',  desc: 'Child performance, parent communication, alerts, and dues.', icon: '👨‍👩‍👧', color: '#F59E0B', lightColor: 'rgba(245,158,11,0.08)', gradClass: 'portal-card-parent' },
  { role: 'admin',   title: 'Admin Console',  desc: 'Institution-wide operations, reports, and controls.', icon: '⚙️', color: '#7C3AED', lightColor: 'rgba(124,58,237,0.08)', gradClass: 'portal-card-admin' },
]

const features = [
  { icon: '🔐', title: 'Secure Auth',       desc: 'JWT-based role access control', color: '#2563EB' },
  { icon: '🌍', title: 'Multilingual',       desc: 'English, Hindi & Telugu support', color: '#10B981' },
  { icon: '🔍', title: 'Global Search',      desc: 'Fuzzy matching across modules', color: '#06B6D4' },
  { icon: '🌙', title: 'Dark Mode',          desc: 'Persistent theme preference', color: '#8B5CF6' },
  { icon: '⚡', title: 'High Performance',   desc: 'Redis caching for fast loads', color: '#F59E0B' },
  { icon: '📱', title: 'PWA Ready',          desc: 'Offline-capable web app', color: '#EF4444' },
  { icon: '♿', title: 'Accessible',          desc: 'WCAG 2.1 AA compliant', color: '#10B981' },
  { icon: '📊', title: 'Analytics',          desc: 'Built-in event tracking', color: '#2563EB' },
]

const stats = [
  { value: '500+', label: 'Students Enrolled',  icon: '👨‍🎓', color: '#2563EB' },
  { value: '40+',  label: 'Faculty Members',     icon: '👨‍🏫', color: '#10B981' },
  { value: '30+',  label: 'Active Modules',      icon: '📦', color: '#F59E0B' },
  { value: '99.9%',label: 'Uptime SLA',          icon: '⚡', color: '#EF4444' },
]

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    const numeric = parseInt(value.replace(/\D/g, ''), 10)
    if (isNaN(numeric)) { setTimeout(() => setDisplay(value), 0); return }
    let start = 0
    const step = Math.ceil(numeric / 40)
    const timer = setInterval(() => {
      start = Math.min(start + step, numeric)
      setDisplay(value.replace(/\d+/, start))
      if (start >= numeric) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [value])
  return <>{display}</>
}

export default function EntryPage() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])

  return (
    <div className="container py-5 page-shell" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}>

      {/* ── Hero ── */}
      <div className="entry-hero card border-0 mb-5" style={{ padding: '0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: '2rem', padding: '3rem 3rem',
          alignItems: 'center',
        }} className="flex-column flex-lg-row">
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: '2rem',
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.25)',
              color: '#2563EB',
              fontSize: '0.8rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '1.25rem',
            }}>
              🚀 Next Generation ERP Platform
            </span>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem',
            }}>
              <span className="text-gradient">{instituteName}</span>
              <br />
              <span style={{ color: 'var(--iitb-navy)' }}>Educational ERP</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--app-text-muted)', maxWidth: 540, marginBottom: '2rem', lineHeight: 1.7 }}>
              A comprehensive, modern ERP platform designed for educational institutions. Streamline operations, enhance learning, and empower stakeholders with intuitive interfaces.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link
                className="btn btn-primary"
                to="/login"
                style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}
              >
                🔓 Access Portal
              </Link>
              <Link
                className="btn btn-outline-primary"
                to="/directory"
                style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}
              >
                📚 Explore Modules
              </Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="d-none d-lg-flex" style={{
            width: 220, height: 220, flexShrink: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))',
            border: '2px solid rgba(37,99,235,0.15)',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '0.5rem',
            animation: 'float 5s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '5rem' }}>🏫</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563EB' }}>Sri Sudha ERP</span>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="row g-3 mb-5" style={{ animation: 'fadeInUp 0.7s ease 0.1s both' }}>
        {stats.map((stat, i) => (
          <div key={stat.label} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{
                fontSize: '2rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '0.35rem',
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                <AnimatedNumber value={stat.value} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <div className="mb-5" style={{ animation: 'fadeInUp 0.7s ease 0.2s both' }}>
        <div className="text-center mb-4">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <span className="text-gradient">Powerful Features</span>
          </h2>
          <p style={{ color: 'var(--app-text-muted)', fontSize: '0.95rem' }}>Everything your institution needs in one platform</p>
        </div>
        <div className="row g-3">
          {features.map((feature, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="feature-card">
                <div style={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', margin: '0 auto 1rem',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: feature.color, marginBottom: '0.4rem' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginBottom: 0, lineHeight: 1.5 }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Role Cards ── */}
      <div className="mb-5" style={{ animation: 'fadeInUp 0.7s ease 0.3s both' }}>
        <div className="text-center mb-4">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <span className="text-gradient">Choose Your Portal</span>
          </h2>
          <p style={{ color: 'var(--app-text-muted)', fontSize: '0.95rem' }}>Each role gets a fully tailored dashboard experience</p>
        </div>
        <div className="row g-4">
          {roleCards.map(item => (
            <div key={item.role} className="col-12 col-md-6">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <div className={`card border-0 shadow-sm portal-card ${item.gradClass}`}>
                  <div className="card-body p-4">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '16px', flexShrink: 0,
                        background: item.lightColor,
                        border: `1px solid ${item.color}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem',
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: item.color, marginBottom: '0.35rem' }}>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--app-text-muted)', marginBottom: 0, lineHeight: 1.6 }}>
                          {item.desc}
                        </p>
                      </div>
                      <span style={{ marginLeft: 'auto', color: item.color, fontSize: '1.1rem', flexShrink: 0 }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── Demo & Tracks ── */}
      <div className="row g-4 mb-5" style={{ animation: 'fadeInUp 0.7s ease 0.4s both' }}>
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2563EB', marginBottom: '0.25rem' }}>
                👥 Try Demo Access
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--app-text-muted)', marginBottom: '1.25rem' }}>
                Login with these test credentials to explore the platform
              </p>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {studentDummyIds.map(student => (
                  <div key={student.id} style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(37,99,235,0.04)',
                    border: '1px solid rgba(37,99,235,0.12)',
                    borderRadius: '0.75rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.25)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.04)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.12)' }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--app-text-muted)' }}>{student.stream} · {student.section}</div>
                    </div>
                    <span style={{
                      background: 'linear-gradient(135deg,#2563EB,#06B6D4)',
                      color: 'white', padding: '0.25rem 0.7rem',
                      borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {student.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10B981', marginBottom: '0.25rem' }}>
                🎯 Academic Tracks
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--app-text-muted)', marginBottom: '1.25rem' }}>
                Available entrance exam preparation programs
              </p>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {courseTracks.map(track => (
                  <div key={track.title} style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(16,185,129,0.05)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: '0.75rem',
                    transition: 'all 0.2s ease', cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.05)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.15)' }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{track.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--app-text-muted)', marginTop: '0.2rem' }}>{track.stream} · {track.section}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.2rem', fontWeight: 600 }}>✓ {track.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div style={{
        borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 50%, #0891b2 100%)',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeInUp 0.7s ease 0.5s both',
      }}>
        <div style={{
          position: 'absolute', top: '-30%', right: '-5%', width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
            Ready to Get Started?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.75rem', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.75rem' }}>
            Login to your portal for personalized dashboards, real-time updates, and powerful academic tools.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.9rem 2.25rem', borderRadius: '0.875rem',
              background: 'white', color: '#1e3a8a',
              textDecoration: 'none', fontWeight: 800, fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(0,0,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
          >
            🔓 Login Now →
          </Link>
        </div>
      </div>
    </div>
  )
}
