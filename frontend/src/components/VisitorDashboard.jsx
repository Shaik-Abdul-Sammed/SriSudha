import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n'

const instituteName = 'Sri Sudha'

const roleConfig = {
  visitor: {
    bannerClass: 'welcome-banner-visitor',
    accentColor: '#8B5CF6',
    icon: '👁️',
    greeting: 'Explore our institution',
    widgets: [
      { title: 'Quick Links', data: ['About Institution', 'Academic Programs', 'Campus Tour'] },
      { title: 'Helpful Resources', data: ['Prospectus', 'Admission Guidelines', 'FAQ'] }
    ]
  },
}

const visitormenu = [
  { label: 'About Institution', path: '/about', icon: '🏫' },
  { label: 'Academic Programs', path: '#', icon: '📚' },
  { label: 'Campus Facilities', path: '#', icon: '🏛️' },
  { label: 'Achievements', path: '#', icon: '🏆' },
  { label: 'Admissions', path: '#', icon: '📝' },
  { label: 'Contact Us', path: '#', icon: '📞' },
]

export default function VisitorDashboard() {
  const { t } = useI18n()
  const config = roleConfig.visitor

  return (
    <div style={{ animation: 'fadeInUp 0.45s ease' }}>

      {/* Welcome Banner */}
      <div
        className={`welcome-banner ${config.bannerClass} mb-4`}
        style={{
          background: `linear-gradient(135deg, ${config.accentColor}88, ${config.accentColor}44)`,
          borderRadius: '1.5rem',
          overflow: 'hidden',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              {config.icon} Visitor Portal
            </p>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
              Welcome to Sri Sudha!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', margin: 0 }}>
              {config.greeting}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '1rem',
            padding: '1rem',
            backdropFilter: 'blur(8px)',
            textAlign: 'center'
          }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '2rem', lineHeight: 1.1 }}>2000+</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Students</div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="row g-3 mb-4">
        {visitormenu.map((item, idx) => (
          <div key={idx} className="col-6 col-md-4 col-lg-3">
            <a href={item.path} style={{ textDecoration: 'none' }}>
              <div className="card border-0 shadow-sm h-100" style={{
                borderRadius: '1.25rem',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(139, 92, 246, 0.2)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{item.label}</div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Information Cards */}
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: config.accentColor }}>📋 Why Choose Sri Sudha?</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                {[
                  '✅ Excellence in academics and holistic development',
                  '✅ Expert faculty with years of experience',
                  '✅ State-of-the-art infrastructure and facilities',
                  '✅ 95%+ success rate in competitive exams',
                  '✅ Personalized mentoring and guidance',
                  '✅ Vibrant campus with cultural activities'
                ].map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: config.accentColor }}>🎯 Quick Facts</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Established', value: '2015' },
                  { label: 'Students', value: '2000+' },
                  { label: 'Faculty', value: '150+' },
                  { label: 'Success Rate', value: '95%+' },
                  { label: 'Streams', value: '4' },
                  { label: 'Rankings', value: 'Top 50' }
                ].map((fact, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '0.875rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{fact.label}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: config.accentColor }}>{fact.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', borderRadius: '1.25rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontWeight: 700 }}>Interested in Joining Us?</h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Take the next step in your educational journey</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/about" className="btn" style={{ background: `linear-gradient(135deg, ${config.accentColor}, #7C3AED)`, color: 'white', border: 'none', fontWeight: 700, borderRadius: '0.875rem', padding: '0.7rem 1.5rem', textDecoration: 'none' }}>
            📖 Learn More
          </a>
          <a href="mailto:admissions@srisudha.edu.in" className="btn" style={{ background: 'rgba(139, 92, 246, 0.1)', color: config.accentColor, border: `1px solid ${config.accentColor}30`, fontWeight: 700, borderRadius: '0.875rem', padding: '0.7rem 1.5rem', textDecoration: 'none' }}>
            📧 Admission Inquiry
          </a>
        </div>
      </div>
    </div>
  )
}
