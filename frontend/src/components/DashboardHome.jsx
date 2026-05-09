import { useAuth } from '../hooks/useAuth'
import { instituteStats } from '../utils/mockData'
import StudentAcademyPanel from './StudentAcademyPanel'

const roleConfig = {
  student: {
    bannerClass: 'welcome-banner-student',
    accentColor: '#2563EB',
    icon: '👨‍🎓',
    greeting: 'Study smart, achieve more!',
    widgets: [
      { title: 'Upcoming Classes', data: ['09:30 AM - Mathematics (LA 101)', '11:00 AM - Physics Lab (OSL)'] },
      { title: 'Pending Assignments', data: ['Wave Optics Problem Set (Due Today)', 'Chemistry Lab Report (Due Tomorrow)'] }
    ]
  },
  faculty: {
    bannerClass: 'welcome-banner-faculty',
    accentColor: '#10B981',
    icon: '👨‍🏫',
    greeting: 'Inspire, teach, transform!',
    widgets: [
      { title: 'Today\'s Schedule', data: ['08:30 AM - Mathematics (MPC-A)', '10:30 AM - Physics (MPC-B)'] },
      { title: 'Pending Approvals', data: ['3 Leave Requests', '2 Assignment Submissions'] }
    ]
  },
  parent: {
    bannerClass: 'welcome-banner-parent',
    accentColor: '#F59E0B',
    icon: '👨‍👩‍👧',
    greeting: 'Stay informed, stay connected!',
    widgets: [
      { title: 'Recent Updates', data: ['Attendance dropped in Physics', 'New Notice: Annual Day Rehearsal'] },
      { title: 'Upcoming Fees', data: ['Term 2 Tuition - ₹45,000 (Due in 15 days)'] }
    ]
  },
  admin: {
    bannerClass: 'welcome-banner-admin',
    accentColor: '#7C3AED',
    icon: '⚙️',
    greeting: 'Manage, monitor, lead!',
    widgets: [
      { title: 'System Alerts', data: ['High CPU Load on Server 2', 'Database Backup Completed'] },
      { title: 'Pending Approvals', data: ['5 Faculty Leave Requests', '2 New Admissions'] }
    ]
  },
}

export default function DashboardHome({ role, routes }) {
  const { user } = useAuth()
  const config = roleConfig[role] || roleConfig.student

  return (
    <div style={{ animation: 'fadeInUp 0.45s ease' }}>

      {/* Welcome Banner */}
      <div
        className={`welcome-banner ${config.bannerClass} mb-4`}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              {config.icon} {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </p>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', margin: 0 }}>
              {config.greeting}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '1rem', padding: '0.75rem 1.25rem',
            backdropFilter: 'blur(8px)',
            display: 'flex', gap: '1rem', alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.1 }}>{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
            </div>
            <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.1 }}>{routes.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Modules</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {instituteStats.map(stat => (
          <div key={stat.label} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: config.accentColor, lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: '0.3rem', letterSpacing: '0.04em' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access & Widgets */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          {/* Charts/Main Data Placeholder */}
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Performance Overview</h2>
              <div style={{ 
                height: 240, borderRadius: '1rem', 
                background: '#f8fafc', border: '1px dashed #cbd5e1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', color: '#94a3b8'
              }}>
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Interactive Analytics Chart</span>
                <span style={{ fontSize: '0.75rem' }}>(Attendance & Grades vs. Class Average)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-lg-4">
          <div style={{ display: 'grid', gap: '1rem', height: '100%' }}>
            {config.widgets.map((widget, i) => (
              <div key={i} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', flex: 1 }}>
                <div className="card-body p-4">
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: config.accentColor }}>{widget.title}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {widget.data.map((item, j) => (
                      <div key={j} style={{ 
                        padding: '0.6rem 0.875rem', borderRadius: '0.625rem', 
                        background: '#f1f5f9', borderLeft: `3px solid ${config.accentColor}`,
                        fontSize: '0.82rem', fontWeight: 500, color: '#334155'
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student-only Academy Panel */}
      {role === 'student' && (
        <div className="mb-4">
          <StudentAcademyPanel />
        </div>
      )}
    </div>
  )
}
