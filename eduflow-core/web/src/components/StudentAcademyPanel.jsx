import { useContext, useState } from 'react'
import {
  courseTracks,
  referenceLibrary,
  sectionMap,
  studentDummyIds,
  weeklyExamSchedule,
} from '../utils/studentCatalog'
import { AuthContext } from '../context/AuthContext'

function Card({ title, children }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default function StudentAcademyPanel() {
  const authContext = useContext(AuthContext) || {}
  const { login = async () => {} } = authContext
  const [selected, setSelected] = useState(studentDummyIds[0]?.id || '')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handlePreview() {
    setMessage('')
    setBusy(true)
    try {
      await login({ role: 'student', username: selected, password: 'student123' })
      setMessage(`Previewing as ${selected}`)
    } catch (err) {
      setMessage(err.message || 'Failed to preview')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card border-0 shadow-sm bg-primary-subtle">
          <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
            <div>
              <p className="text-uppercase small fw-semibold text-primary mb-2">Student Academy</p>
              <h2 className="h3 mb-2">Competitive streams, references, weekly exams, and section planning</h2>
              <p className="text-muted mb-0">Dummy student IDs and study routes for MPC, BIPC, MBIPC, JEE Mains, and NEET preparation.</p>
            </div>
            <div className="text-end">
              <div className="fs-2 fw-bold text-primary">{studentDummyIds.length}</div>
              <div className="small text-muted">sample student IDs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-6">
        <Card title="Dummy Student IDs">
          <div className="d-grid gap-2">
            <div className="d-flex gap-2 align-items-center mb-2">
              <select className="form-select me-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
                {studentDummyIds.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.id}</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handlePreview} disabled={busy}>
                {busy ? 'Previewing…' : 'Preview as student'}
              </button>
            </div>

            {message && <div className="small text-success mb-2">{message}</div>}

            {studentDummyIds.map((student) => (
              <div key={student.id} className="border rounded-3 p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div className="fw-semibold">{student.name}</div>
                  <div className="small text-muted">{student.stream} · {student.section}</div>
                </div>
                <span className="badge text-bg-light border">{student.id}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-12 col-xl-6">
        <Card title="Course Tracks">
          <div className="row g-3">
            {courseTracks.map((track) => (
              <div key={track.title} className="col-12 col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <div className="fw-semibold">{track.title}</div>
                      <div className="small text-muted">{track.stream} · {track.section}</div>
                    </div>
                    <span className="badge text-bg-primary">Track</span>
                  </div>
                  <div className="small text-muted">{track.focus}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-12 col-lg-4">
        <Card title="Weekly Exams">
          <div className="d-grid gap-2">
            {weeklyExamSchedule.map((exam) => (
              <div key={`${exam.day}-${exam.title}`} className="border rounded-3 p-3">
                <div className="fw-semibold">{exam.day} - {exam.title}</div>
                <div className="small text-muted">{exam.section}</div>
                <div className="small">{exam.topic}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-12 col-lg-4">
        <Card title="References Hub">
          <div className="d-grid gap-2">
            {referenceLibrary.map((reference) => (
              <div key={reference.title} className="border rounded-3 p-3">
                <div className="fw-semibold">{reference.title}</div>
                <div className="small text-muted">{reference.tag}</div>
                <div className="small">{reference.format}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-12 col-lg-4">
        <Card title="Sections">
          <div className="d-grid gap-2">
            {sectionMap.map((section) => (
              <div key={section.code} className="border rounded-3 p-3 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{section.code}</div>
                  <div className="small text-muted">{section.stream}</div>
                </div>
                <span className="badge text-bg-secondary">{section.capacity} seats</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}