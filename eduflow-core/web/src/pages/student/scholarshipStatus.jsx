import RolePageTemplate from '../../components/RolePageTemplate'
import { scholarshipData } from '../../utils/studentMockData'

export default function Page() {
  const { name, amount, disbursedAmount, status, stages, eligibility, documents } = scholarshipData
  const currentStageIdx = stages.filter(s => s.done).length - 1
  const allEligible = eligibility.every(e => e.met)

  return (
    <RolePageTemplate role="Student" title="Scholarship Status" description="Track your scholarship eligibility, approval stages, and disbursement.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Scholarship Header Card */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ height: 4, background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
          <div className="card-body p-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>Active Scholarship</div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--svc-navy)' }}>{name}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.25rem 0.875rem', borderRadius: '2rem', background: '#10B98115', color: '#10B981', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    ✅ {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>₹{disbursedAmount.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Disbursed</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>of ₹{amount.toLocaleString('en-IN')} total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem' }}>📋 Approval Progress</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {/* connector line */}
            <div style={{ position: 'absolute', top: 18, left: '10%', right: '10%', height: 3, background: '#e2e8f0', zIndex: 0 }}>
              <div style={{ height: '100%', width: `${(currentStageIdx / (stages.length - 1)) * 100}%`, background: 'linear-gradient(90deg, #10B981, #06B6D4)', transition: 'width 0.5s ease' }} />
            </div>
            {stages.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', zIndex: 1, flex: 1 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: s.done ? 'linear-gradient(135deg, #10B981, #06B6D4)' : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.done ? 'white' : '#94a3b8', fontSize: '0.85rem', fontWeight: 700,
                  boxShadow: s.done ? '0 4px 12px rgba(16,185,129,0.35)' : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  {s.done ? '✓' : i + 1}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: s.done ? '#10B981' : '#94a3b8' }}>{s.label}</div>
                  {s.date && <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{s.date}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Eligibility Criteria */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              🎯 Eligibility Criteria
              <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', borderRadius: '2rem', background: allEligible ? '#10B98115' : '#EF444415', color: allEligible ? '#10B981' : '#EF4444', fontSize: '0.65rem', fontWeight: 700 }}>
                {eligibility.filter(e => e.met).length}/{eligibility.length} Met
              </span>
            </h2>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {eligibility.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.875rem', borderRadius: '0.75rem', background: e.met ? '#10B98108' : '#EF444408', border: `1px solid ${e.met ? '#10B98125' : '#EF444425'}` }}>
                  <span style={{ fontSize: '1rem' }}>{e.met ? '✅' : '❌'}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: e.met ? '#065f46' : '#7f1d1d' }}>{e.criterion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>📁 Documents Submitted</h2>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {documents.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.875rem', borderRadius: '0.75rem', background: '#2563EB08', border: '1px solid #2563EB20' }}>
                  <span style={{ fontSize: '1rem' }}>📄</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e40af' }}>{doc}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#10B981', fontWeight: 700 }}>✓ Verified</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.75rem', background: '#10B98108', border: '1px solid #10B98120', fontSize: '0.78rem', color: '#065f46', fontWeight: 600 }}>
              ✅ All documents submitted and verified
            </div>
          </div>
        </div>
      </div>
    </RolePageTemplate>
  )
}
