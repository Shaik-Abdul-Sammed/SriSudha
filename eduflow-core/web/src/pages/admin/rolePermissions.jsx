import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const BLUE = '#2563EB'

const initialRules = [
  { module: 'Admissions Pipeline', admin: { read: true, write: true }, faculty: { read: false, write: false }, parent: { read: false, write: false }, student: { read: false, write: false } },
  { module: 'Attendance Entry / Audits', admin: { read: true, write: true }, faculty: { read: true, write: true }, parent: { read: true, write: false }, student: { read: true, write: false } },
  { module: 'Exam marks & grading', admin: { read: true, write: true }, faculty: { read: true, write: true }, parent: { read: true, write: false }, student: { read: true, write: false } },
  { module: 'Timetable Configurations', admin: { read: true, write: true }, faculty: { read: true, write: false }, parent: { read: true, write: false }, student: { read: true, write: false } },
  { module: 'Financial Records / Fee Pay', admin: { read: true, write: true }, faculty: { read: false, write: false }, parent: { read: true, write: true }, student: { read: true, write: false } },
]

export default function Page() {
  const [rules, setRules] = useState(initialRules)

  function togglePermission(moduleName, role, type) {
    setRules(prev => prev.map(r => {
      if (r.module !== moduleName) return r
      return {
        ...r,
        [role]: { ...r[role], [type]: !r[role][type] }
      }
    }))
  }

  return (
    <RolePageTemplate role="Admin" title="Role Permissions" description="Define access control rules, restrict system read/write actions, and manage module security.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Matrix info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Configured Roles', value: '4 Main Roles', color: PURPLE, icon: '🛡️' },
            { label: 'Monitored Modules', value: rules.length, color: BLUE, icon: '📋' },
            { label: 'Active Permissions', value: '18 Granted', color: GREEN, icon: '🔑' },
            { label: 'Compliance Level', value: 'ISO 27001', color: AMBER, icon: '🔒' },
          ].map(s => (
            <div key={s.label} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Permissions Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>System Authorization Matrix</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table align-middle table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Module</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#7C3AED', textAlign: 'center' }}>Admin (R / W)</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#10B981', textAlign: 'center' }}>Faculty (R / W)</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#F59E0B', textAlign: 'center' }}>Parent (R / W)</th>
                  <th style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563EB', textAlign: 'center' }}>Student (R / W)</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(r => (
                  <tr key={r.module}>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{r.module}</td>
                    {/* Admin */}
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={r.admin.read} onChange={() => togglePermission(r.module, 'admin', 'read')} style={{ marginRight: 6 }} />
                      <input type="checkbox" checked={r.admin.write} onChange={() => togglePermission(r.module, 'admin', 'write')} />
                    </td>
                    {/* Faculty */}
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={r.faculty.read} onChange={() => togglePermission(r.module, 'faculty', 'read')} style={{ marginRight: 6 }} />
                      <input type="checkbox" checked={r.faculty.write} onChange={() => togglePermission(r.module, 'faculty', 'write')} />
                    </td>
                    {/* Parent */}
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={r.parent.read} onChange={() => togglePermission(r.module, 'parent', 'read')} style={{ marginRight: 6 }} />
                      <input type="checkbox" checked={r.parent.write} onChange={() => togglePermission(r.module, 'parent', 'write')} />
                    </td>
                    {/* Student */}
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={r.student.read} onChange={() => togglePermission(r.module, 'student', 'read')} style={{ marginRight: 6 }} />
                      <input type="checkbox" checked={r.student.write} onChange={() => togglePermission(r.module, 'student', 'write')} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </RolePageTemplate>
  )
}
