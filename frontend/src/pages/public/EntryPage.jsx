import { Link } from 'react-router-dom'
import { courseTracks, studentDummyIds } from '../../utils/studentCatalog'

const instituteName = 'Sri Sudha'

const roleCards = [
  { role: 'student', title: 'Student Portal', desc: 'Academic progress, assignments, fees, and mentor connect.' },
  { role: 'faculty', title: 'Faculty Portal', desc: 'Attendance, marks entry, class analytics, and resources.' },
  { role: 'parent', title: 'Parent Portal', desc: 'Child performance, parent communication, alerts, and dues.' },
  { role: 'admin', title: 'Admin Console', desc: 'Institution-wide operations, reports, and controls.' },
]

function EntryPage() {
  return (
    <div className="container py-5 page-shell">
      <div className="entry-hero card border-0 shadow-lg mb-4">
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-lg-row gap-4 align-items-lg-center justify-content-between">
          <div>
            <p className="text-uppercase small fw-semibold text-primary mb-2">Welcome</p>
            <h1 className="display-5 fw-bold mb-3">{instituteName} ERP Experience</h1>
            <p className="lead text-muted mb-4 mb-lg-0">
              Good to see you. Choose a portal to continue into the secure campus system.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-primary btn-lg" to="/login">
              Continue to Login
            </Link>
            <Link className="btn btn-outline-secondary btn-lg" to="/directory">
              Explore Modules
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {roleCards.map((item) => (
          <div key={item.role} className="col-12 col-md-6">
            <div className="card h-100 border-0 shadow-sm portal-card">
              <div className="card-body p-4">
                <h2 className="h5 mb-2">{item.title}</h2>
                <p className="text-muted mb-0">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Student Demo IDs</h2>
              <div className="d-grid gap-2">
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
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Entrance Exam Tracks</h2>
              <div className="d-grid gap-2">
                {courseTracks.map((track) => (
                  <div key={track.title} className="border rounded-3 p-3">
                    <div className="fw-semibold">{track.title}</div>
                    <div className="small text-muted">{track.stream} · {track.section}</div>
                    <div className="small">{track.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntryPage
