import RolePageTemplate from '../../components/RolePageTemplate'
import { busSchedule, STUDENT } from '../../utils/studentMockData'

const BLUE = '#2563EB'

export default function Page() {
  const { bus } = STUDENT
  const myStopIdx = busSchedule.findIndex(s => s.stop === bus.stop)

  return (
    <RolePageTemplate role="Student" title="Transport Tracking" description="Your assigned bus route, schedule, and estimated arrival times.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Bus Info Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Bus Number', value: bus.busNo, color: BLUE, icon: '🚌' },
            { label: 'Route', value: bus.route, color: '#10B981', icon: '🛣️' },
            { label: 'My Stop', value: bus.stop, color: '#F59E0B', icon: '📍' },
            { label: 'Driver', value: bus.driver, color: '#8B5CF6', icon: '👨‍✈️' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.3rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: s.color, lineHeight: 1.3, marginBottom: '0.2rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Driver Contact */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2563EB15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>👨‍✈️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{bus.driver}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bus Driver • {bus.busNo}</div>
            </div>
          </div>
          <a href={`tel:${bus.phone}`} className="btn btn-primary btn-sm" style={{ borderRadius: '2rem' }}>
            📞 {bus.phone}
          </a>
        </div>

        {/* Route Map (Visual) */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem' }}>🗺️ Route — {bus.route}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {busSchedule.map((stop, i) => {
              const isMyStop = stop.stop === bus.stop
              const isCampus = i === busSchedule.length - 1
              const isPast = i < myStopIdx
              const color = isCampus ? '#10B981' : isMyStop ? BLUE : isPast ? '#94a3b8' : '#475569'

              return (
                <div key={i} style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                  {/* Timeline column */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: isMyStop ? BLUE : isCampus ? '#10B981' : isPast ? '#e2e8f0' : '#f1f5f9',
                      border: `3px solid ${isMyStop ? BLUE : isCampus ? '#10B981' : '#e2e8f0'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: (isMyStop || isCampus) ? `0 4px 12px ${color}40` : 'none',
                      fontSize: '0.6rem', color: 'white', fontWeight: 700,
                    }}>
                      {isMyStop ? '★' : isCampus ? '🏫' : ''}
                    </div>
                    {i < busSchedule.length - 1 && (
                      <div style={{ flex: 1, width: 2, background: isPast ? '#94a3b8' : '#e2e8f0', minHeight: 32, marginTop: 2, marginBottom: 2 }} />
                    )}
                  </div>
                  {/* Stop Info */}
                  <div style={{ flex: 1, padding: '0.3rem 0 0.5rem' }}>
                    <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.75rem', background: isMyStop ? '#2563EB10' : isCampus ? '#10B98110' : 'transparent', border: isMyStop ? '1px solid #2563EB25' : 'none', marginBottom: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontWeight: isMyStop || isCampus ? 700 : 500, color, fontSize: '0.875rem' }}>{stop.stop}</span>
                          {isMyStop && <span style={{ marginLeft: '0.5rem', padding: '0.15rem 0.5rem', borderRadius: '2rem', background: BLUE, color: 'white', fontSize: '0.62rem', fontWeight: 700 }}>MY STOP</span>}
                          {isCampus && <span style={{ marginLeft: '0.5rem', padding: '0.15rem 0.5rem', borderRadius: '2rem', background: '#10B981', color: 'white', fontSize: '0.62rem', fontWeight: 700 }}>DESTINATION</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                          {stop.departure !== '—' && <span style={{ color: '#64748b' }}>🚌 Dep: <strong>{stop.departure}</strong></span>}
                          <span style={{ color: isCampus ? '#10B981' : '#64748b' }}>📍 Arr: <strong>{stop.arrival}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Info Notice */}
        <div style={{ padding: '0.875rem 1.25rem', borderRadius: '0.875rem', background: '#F59E0B10', border: '1px solid #F59E0B25', fontSize: '0.82rem', color: '#92400e', fontWeight: 600 }}>
          ℹ️ Live tracking is not yet enabled. Bus arrives at {bus.stop} at approximately 7:00 AM. Contact driver {bus.driver} at {bus.phone} for updates.
        </div>
      </div>
    </RolePageTemplate>
  )
}
