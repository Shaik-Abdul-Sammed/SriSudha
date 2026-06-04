import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { STUDENT, busSchedule } from '../../utils/studentMockData'

const AMBER = '#F59E0B'

export default function Page() {
  const [calling, setCalling] = useState(false)

  function startCall() {
    setCalling(true)
    setTimeout(() => setCalling(false), 2000)
  }

  return (
    <RolePageTemplate role="Parent" title="Bus Tracking" description="Monitor your child's bus route, real-time stops timetable, and driver profiles.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Live Status Banner */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden', background: 'linear-gradient(135deg, #1E293B, #F59E0B)', color: 'white' }}>
          <div className="card-body p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge text-bg-light text-warning mb-2" style={{ fontWeight: 700 }}>LIVE TRANSIT STATUS</span>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{STUDENT.name}'s Bus ({STUDENT.bus.busNo})</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Current Route: <strong>{STUDENT.bus.route}</strong> • Next Stop: <strong>Nagole</strong></p>
            </div>
            <span style={{ padding: '0.4rem 1rem', borderRadius: '2rem', background: '#10B981', color: 'white', fontSize: '0.8rem', fontWeight: 800 }}>
              🟢 IN TRANSIT
            </span>
          </div>
        </div>

        {/* Driver Profile & Map mockup */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          {/* Driver Card */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Driver Assignment</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                👨‍✈️
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{STUDENT.bus.driver}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Route 7 Captain</div>
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.82rem', marginBottom: '1rem' }}>
              📞 <strong>Phone:</strong> {STUDENT.bus.phone}
            </div>
            <button className="btn btn-outline-primary w-100" onClick={startCall} disabled={calling}>
              {calling ? 'Connecting Call...' : '📞 Call Driver'}
            </button>
          </div>

          {/* Stops List */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Stops & Timeline</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {busSchedule.map((s) => {
                const isMyStop = s.stop === STUDENT.bus.stop
                return (
                  <div key={s.stop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', background: isMyStop ? '#F59E0B12' : '#F8FAFC', border: isMyStop ? `1px solid ${AMBER}` : '1px solid #E2E8F0' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: isMyStop ? AMBER : 'var(--app-text)' }}>
                        {s.stop} {isMyStop && '🎯 (Pickup Stop)'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Arrival: {s.arrival}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{s.departure}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </RolePageTemplate>
  )
}
