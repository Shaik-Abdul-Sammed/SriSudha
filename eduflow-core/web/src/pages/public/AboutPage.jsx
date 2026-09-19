import { useState } from 'react'
import { LazyMotionDiv } from '../../components/LazyMotion'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const institutionInfo = {
    overview: {
      title: 'About EduFlow Institution',
      icon: '🏫',
      content: [
        'EduFlow is a premier educational institution dedicated to fostering academic excellence and holistic development of students.',
        'Established with a vision to create a community of learners, we combine traditional educational values with modern pedagogical approaches.',
        'Our institution serves over 2,000+ students across various academic streams and programs.'
      ]
    },
    mission: {
      title: 'Mission & Vision',
      icon: '🎯',
      content: [
        'Mission: To provide quality education that develops critical thinking, creativity, and compassion in our students.',
        'Vision: To be a beacon of educational excellence, creating responsible global citizens equipped for the challenges of tomorrow.',
        'Values: Integrity, Excellence, Innovation, Inclusivity, and Sustainability'
      ]
    },
    academics: {
      title: 'Academic Programs',
      icon: '📚',
      content: [
        'MPC (Mathematics, Physics, Chemistry) - Science stream for engineering aspirants',
        'BIPC (Biology, Physics, Chemistry) - Science stream for medical aspirants',
        'MBIPC (Mathematics, Biology, Physics, Chemistry) - Combined science stream',
        'Competitive exam coaching for JEE Mains, NEET, and other national level exams'
      ]
    },
    facilities: {
      title: 'Facilities & Infrastructure',
      icon: '🏛️',
      content: [
        '🔬 Advanced science laboratories with modern equipment',
        '🖥️ Computer labs with high-speed internet connectivity',
        '📖 Well-stocked library with 10,000+ books and digital resources',
        '🏃 Sports complex with facilities for cricket, badminton, basketball, and more',
        '🏥 Medical room with qualified healthcare staff',
        '🏨 Hostel facilities for both boys and girls',
        '🍽️ Nutritious meals provided at the cafeteria'
      ]
    },
    achievements: {
      title: 'Achievements & Accolades',
      icon: '🏆',
      content: [
        '95%+ success rate in competitive exams over the past 5 years',
        'Ranked among top 50 educational institutions in the region',
        '500+ students enrolled in premier colleges and universities',
        'Faculty recognition from national education bodies',
        '100% digital classroom infrastructure',
        'Awards for excellence in STEM education and innovation'
      ]
    },
    contact: {
      title: 'Get In Touch',
      icon: '📞',
      content: [
          'Address: EduFlow Educational Complex, Hyderabad, Telangana',
        'Phone: +91-40-XXXX-XXXX',
        'Email: info@eduflow.edu.in',
        'Hours: Monday - Saturday: 8:00 AM - 6:00 PM',
        'Visit our campus for a guided tour and counseling session'
      ]
    }
  }

  const tabs = ['overview', 'mission', 'academics', 'facilities', 'achievements', 'contact']

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Navigation */}
      <nav style={{ position: 'sticky', top: 0, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(148,163,184,0.2)', zIndex: 100 }}>
        <div className="container-fluid px-3 px-lg-4" style={{ display: 'flex', alignItems: 'center', height: '64px' }}>
          <a href="/entry" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem' }}>🏫</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg,#2563EB,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduFlow</span>
          </a>
        </div>
      </nav>

      <div className="container py-5">
        {/* Hero Section */}
        <LazyMotionDiv style={{ textAlign: 'center', marginBottom: '3rem', color: 'white' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>
            About EduFlow Institution
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Nurturing minds, shaping futures, transforming lives
          </p>
        </LazyMotionDiv>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {tabs.map(tab => {
            const info = institutionInfo[tab]
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: activeTab === tab ? 'linear-gradient(135deg,#2563EB,#06B6D4)' : 'rgba(148,163,184,0.1)',
                  color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.7)',
                  fontWeight: activeTab === tab ? 700 : 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === tab ? '0 4px 16px rgba(37,99,235,0.3)' : 'none'
                }}
              >
                {info.icon} {info.title.split(' ')[0]}
              </button>
            )
          })}
        </div>

        {/* Content Section */}
        <LazyMotionDiv style={{ maxWidth: '800px', margin: '0 auto' }}>
          {tabs.map(tab => activeTab === tab && (
            <div key={tab} style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div className="card border-0 shadow-lg" style={{ borderRadius: '1.5rem', background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(148,163,184,0.2)', overflow: 'hidden' }}>
                <div style={{
                  height: '4px',
                  background: 'linear-gradient(90deg, #2563EB, #06B6D4)'
                }} />
                <div className="card-body p-5">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>
                    {institutionInfo[tab].icon} {institutionInfo[tab].title}
                  </h2>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {institutionInfo[tab].content.map((item, idx) => (
                      <div key={idx} style={{
                        padding: '1rem',
                        borderLeft: '3px solid #2563EB',
                        background: 'rgba(37,99,235,0.05)',
                        borderRadius: '0.5rem'
                      }}>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </LazyMotionDiv>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1.5rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(6,182,212,0.1))', border: '1px solid rgba(37,99,235,0.3)', maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>Ready to Join Us?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
              Take the first step towards your academic excellence journey
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/entry" className="btn" style={{ background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: 'white', border: 'none', fontWeight: 700, borderRadius: '0.875rem', padding: '0.7rem 1.5rem', textDecoration: 'none' }}>
                📖 Explore Roles
              </a>
              <a href="mailto:info@eduflow.edu.in" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, borderRadius: '0.875rem', padding: '0.7rem 1.5rem', textDecoration: 'none' }}>
                📧 Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
