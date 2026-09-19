import { useState } from 'react'
import RolePageTemplate from '../../components/RolePageTemplate'

const PURPLE = '#7C3AED'
const AMBER = '#F59E0B'
const GREEN = '#10B981'
const BLUE = '#2563EB'

const initialExams = [
  { id: 1, name: 'Unit Test – I', subject: 'Mathematics', date: '2026-06-14', time: '9:00 AM', hall: 'Hall A', maxMarks: 50, type: 'unit' },
  { id: 2, name: 'Physics Unit Test', subject: 'Physics', date: '2026-06-20', time: '9:00 AM', hall: 'Lab 2', maxMarks: 50, type: 'unit' },
  { id: 3, name: 'Chemistry Practical', subject: 'Chemistry', date: '2026-06-25', time: '10:00 AM', hall: 'Chem Lab', maxMarks: 100, type: 'practical' },
  { id: 4, name: 'Mid-Term Exams', subject: 'All Subjects', date: '2026-07-05', time: '9:00 AM', hall: 'Main Block', maxMarks: 100, type: 'midterm' },
]

export default function Page() {
  const [exams, setExams] = useState(initialExams)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', subject: 'Mathematics', date: '', time: '9:00 AM', hall: 'Hall A', maxMarks: 50, type: 'unit' })

  function handleCreate(e) {
    e.preventDefault()
    setExams(prev => [...prev, { ...form, id: Date.now() }])
    setShowForm(false)
    setForm({ name: '', subject: 'Mathematics', date: '', time: '9:00 AM', hall: 'Hall A', maxMarks: 50, type: 'unit' })
  }

  function handleDelete(id) {
    setExams(prev => prev.filter(e => e.id !== id))
  }

  return (
    <RolePageTemplate role="Admin" title="Exam Setup" description="Create exam schedules, define grading schemes, assign halls, and set dates.">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Header Action card */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Exam Scheduler</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Configure new units, midterm slots, and final examinations.</p>
            </div>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg, ${PURPLE}, #EF4444)`, border: 'none' }}>
                + Schedule New Exam
              </button>
            )}
          </div>
        </div>

        {/* Schedule Exam Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>📅 Define New Exam Schedule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>EXAM NAME</label>
                <input required className="form-control form-control-sm" placeholder="e.g. Wave Optics Chapter Test" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>SUBJECT</label>
                <select className="form-select form-select-sm" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                  {['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>TYPE</label>
                <select className="form-select form-select-sm" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="unit">Unit Test</option>
                  <option value="midterm">Midterm</option>
                  <option value="practical">Practical</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>DATE</label>
                <input required type="date" className="form-control form-control-sm" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>START TIME</label>
                <input className="form-control form-control-sm" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>EXAM HALL</label>
                <input className="form-control form-control-sm" value={form.hall} onChange={e => setForm(p => ({ ...p, hall: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>MAX MARKS</label>
                <input type="number" className="form-control form-control-sm" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: Number(e.target.value) }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">Create Schedule</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Exams List Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Existing Schedules</h2>
            <span className="badge text-bg-light">{exams.length} configured</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ background: 'var(--surface-bg)' }}>
                  {['Name', 'Subject', 'Type', 'Date & Time', 'Exam Hall', 'Max Marks', 'Action'].map(h => (
                    <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id}>
                    <td style={{ fontSize: '0.875rem', fontWeight: 700 }}>{exam.name}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{exam.subject}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem',
                        background: exam.type === 'unit' ? `${BLUE}12` : exam.type === 'midterm' ? `${AMBER}12` : `${GREEN}12`,
                        color: exam.type === 'unit' ? BLUE : exam.type === 'midterm' ? AMBER : GREEN,
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {exam.type}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      📅 {exam.date} • ⏰ {exam.time}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>🏫 {exam.hall}</td>
                    <td style={{ fontWeight: 700 }}>{exam.maxMarks}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exam.id)} style={{ fontSize: '0.72rem' }}>
                        Delete 🗑️
                      </button>
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
