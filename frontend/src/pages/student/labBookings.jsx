import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'
import { labSlots } from '../../utils/studentMockData'

const BLUE = '#2563EB'

export default function Page() {
  const [slots, setSlots] = useState(labSlots)
  const [toast, setToast] = useState(null)

  function toggleBook(id) {
    setSlots(prev => prev.map(s => {
      if (s.id !== id) return s
      if (s.myBooking) {
        setToast('❌ Booking cancelled.')
        return { ...s, myBooking: false, booked: s.booked - 1 }
      }
      if (s.booked >= s.capacity) return s
      setToast('✅ Lab slot booked successfully!')
      return { ...s, myBooking: true, booked: s.booked + 1 }
    }))
    setTimeout(() => setToast(null), 3000)
  }

  const myBookings = slots.filter(s => s.myBooking)

  return (
    <RolePageTemplate role="Student" title="Lab Bookings" description="Browse and book available lab time slots for practical sessions.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {toast && (
          <div style={{ padding: '0.875rem 1.25rem', background: toast.startsWith('✅') ? '#10B98112' : '#EF444412', border: `1px solid ${toast.startsWith('✅') ? '#10B98130' : '#EF444430'}`, borderRadius: '0.875rem', fontWeight: 600, fontSize: '0.875rem', color: toast.startsWith('✅') ? '#065f46' : '#7f1d1d' }}>
            {toast}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'My Bookings', value: myBookings.length, color: BLUE, icon: '🔬' },
            { label: 'Available Slots', value: slots.filter(s => s.booked < s.capacity && !s.myBooking).length, color: '#10B981', icon: '✅' },
            { label: 'Full Slots', value: slots.filter(s => s.booked >= s.capacity).length, color: '#EF4444', icon: '❌' },
            { label: 'Total Slots', value: slots.length, color: '#8B5CF6', icon: '📅' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* My Bookings */}
        {myBookings.length > 0 && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem', borderLeft: '4px solid #2563EB' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.875rem', color: BLUE }}>📌 My Bookings</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {myBookings.map(s => (
                <div key={s.id} style={{ padding: '0.75rem 1rem', borderRadius: '0.875rem', background: '#2563EB12', border: '1px solid #2563EB30' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: BLUE }}>{s.lab}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>{s.date} • {s.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Slots */}
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.875rem' }}>🗓️ Available Lab Slots</h2>
          <div style={{ display: 'grid', gap: '0.875rem' }}>
            {slots.map(slot => {
              const available = slot.booked < slot.capacity
              const fillPct = Math.round((slot.booked / slot.capacity) * 100)
              const fillColor = fillPct >= 90 ? '#EF4444' : fillPct >= 60 ? '#F59E0B' : '#10B981'

              return (
                <div key={slot.id} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem', borderLeft: `4px solid ${slot.myBooking ? BLUE : fillColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{slot.lab}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                        <span>📅 {slot.date}</span>
                        <span>⏰ {slot.time}</span>
                        <span>👥 {slot.booked}/{slot.capacity} booked</span>
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, maxWidth: 200 }}>
                          <div style={{ height: '100%', width: `${fillPct}%`, background: fillColor, borderRadius: 3, transition: 'width 0.4s ease' }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: fillColor }}>{fillPct}%</span>
                      </div>
                    </div>
                    <div>
                      {!available && !slot.myBooking ? (
                        <span style={{ padding: '0.4rem 0.875rem', borderRadius: '0.75rem', background: '#EF444412', color: '#EF4444', fontWeight: 700, fontSize: '0.78rem' }}>❌ Full</span>
                      ) : (
                        <button onClick={() => toggleBook(slot.id)}
                          style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: slot.myBooking ? '1px solid #EF4444' : 'none', background: slot.myBooking ? 'transparent' : `linear-gradient(135deg, ${BLUE}, #06B6D4)`, color: slot.myBooking ? '#EF4444' : 'white', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          {slot.myBooking ? '✕ Cancel' : '+ Book Slot'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
