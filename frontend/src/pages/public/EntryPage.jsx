import { Link } from 'react-router-dom'
import { courseTracks, studentDummyIds } from '../../utils/studentCatalog'

const instituteName = 'Sri Sudha'

const roleCards = [
  { 
    role: 'student', 
    title: 'Student Portal', 
    desc: 'Academic progress, assignments, fees, and mentor connect.',
    icon: '👨‍🎓'
  },
  { 
    role: 'faculty', 
    title: 'Faculty Portal', 
    desc: 'Attendance, marks entry, class analytics, and resources.',
    icon: '👨‍🏫'
  },
  { 
    role: 'parent', 
    title: 'Parent Portal', 
    desc: 'Child performance, parent communication, alerts, and dues.',
    icon: '👨‍👩‍👧'
  },
  { 
    role: 'admin', 
    title: 'Admin Console', 
    desc: 'Institution-wide operations, reports, and controls.',
    icon: '⚙️'
  },
]

const features = [
  { icon: '🔐', title: 'Secure Authentication', desc: 'JWT-based authentication with role-based access control' },
  { icon: '🌍', title: 'Multilingual Support', desc: 'English, Hindi, and Marathi language options' },
  { icon: '🔍', title: 'Global Search', desc: 'Powerful search across all modules with fuzzy matching' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes with persistent theme preferences' },
  { icon: '⚡', title: 'High Performance', desc: 'Redis caching for 10-100x faster response times' },
  { icon: '📱', title: 'PWA Ready', desc: 'Offline-capable progressive web application' },
  { icon: '♿', title: 'Accessible', desc: 'WCAG 2.1 AA compliant with screen reader support' },
  { icon: '📊', title: 'Analytics', desc: 'Built-in analytics and event tracking' },
]

function EntryPage() {
  return (
    <div className="container py-5 page-shell">
      <div className="entry-hero card border-0 mb-5">
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-lg-row gap-5 align-items-lg-center justify-content-between">
          <div className="flex-grow-1">
            <p className="text-uppercase small fw-bold text-info mb-2">🚀 Next Generation ERP</p>
            <h1 className="display-4 fw-bold mb-4">
              <span className="text-gradient">{instituteName}</span> Educational System
            </h1>
            <p className="fs-5 text-secondary mb-4 mb-lg-5">
              A comprehensive, modern ERP platform designed for educational institutions. Streamline operations, enhance learning, and empower stakeholders with intuitive interfaces and powerful features.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link className="btn btn-primary btn-lg fw-bold" to="/login">
                🔓 Access Portal
              </Link>
              <Link className="btn btn-outline-primary btn-lg fw-bold" to="/directory">
                📚 Explore Features
              </Link>
            </div>
          </div>
          <div className="text-center d-none d-lg-block">
            <div className="display-1">🏫</div>
            <p className="text-muted mt-3">Sri Sudha ERP</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-5">
        <h2 className="display-6 fw-bold mb-4 text-center">
          <span className="text-gradient">Powerful Features</span>
        </h2>
        <div className="row g-3">
          {features.map((feature, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm" style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              >
                <div className="card-body p-4 text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                  <h3 className="h6 fw-bold mb-2" style={{ color: '#2563EB' }}>{feature.title}</h3>
                  <p className="text-muted small mb-0">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Cards */}
      <div className="mb-5">
        <h2 className="display-6 fw-bold mb-4 text-center">
          <span className="text-gradient">Choose Your Role</span>
        </h2>
        <div className="row g-4">
          {roleCards.map((item) => (
            <div key={item.role} className="col-12 col-md-6">
              <div className="card h-100 border-0 shadow-sm portal-card" style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(37, 99, 235, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              >
                <div className="card-body p-4">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                  <h2 className="h5 fw-bold mb-2" style={{ color: '#2563EB' }}>{item.title}</h2>
                  <p className="text-muted mb-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo & Tracks Section */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold mb-4" style={{ color: '#2563EB' }}>
                👥 Try Demo Access
              </h2>
              <p className="text-muted small mb-3">Login with these test credentials:</p>
              <div className="d-grid gap-2">
                {studentDummyIds.map((student) => (
                  <div key={student.id} className="border-2 rounded-3 p-3 d-flex justify-content-between align-items-center flex-wrap gap-2" style={{
                    backgroundColor: '#f8fafc',
                    borderColor: '#e2e8f0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.borderColor = '#0EA5E9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  >
                    <div>
                      <div className="fw-bold">{student.name}</div>
                      <div className="small text-muted">{student.stream} · {student.section}</div>
                    </div>
                    <span className="badge bg-primary text-white fw-bold">{student.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold mb-4" style={{ color: '#2563EB' }}>
                🎯 Academic Tracks
              </h2>
              <p className="text-muted small mb-3">Available entrance exam preparation programs:</p>
              <div className="d-grid gap-2">
                {courseTracks.map((track) => (
                  <div key={track.title} className="border-2 rounded-3 p-3" style={{
                    backgroundColor: '#f0fdf4',
                    borderColor: '#dcfce7',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dcfce7';
                    e.currentTarget.style.borderColor = '#22c55e';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                    e.currentTarget.style.borderColor = '#dcfce7';
                  }}
                  >
                    <div className="fw-bold">{track.title}</div>
                    <div className="small text-muted mt-1">{track.stream} · {track.section}</div>
                    <div className="small text-success mt-1">✓ {track.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-5 text-center p-4 rounded-3" style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(6, 182, 212, 0.08))'
      }}>
        <h3 className="fw-bold mb-2">Ready to Get Started?</h3>
        <p className="text-muted mb-3">Login to your portal to access personalized dashboards and features</p>
        <Link className="btn btn-primary btn-lg fw-bold" to="/login">
          🚀 Login Now
        </Link>
      </div>
    </div>
  )
}

export default EntryPage
