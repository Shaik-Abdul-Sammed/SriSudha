import { NavLink } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'
import { useAuth } from '../hooks/useAuth'
import {
  adminFeatures,
  facultyFeatures,
  parentFeatures,
  studentFeatures,
} from '../utils/featureCatalog'
import { timetableRows } from '../utils/mockData'

const roleBadge = {
  Student: 'text-bg-primary',
  Faculty: 'text-bg-success',
  Parent: 'text-bg-warning',
  Admin: 'text-bg-danger',
}

const parentContacts = [
  { name: 'R. Sharma', phone: '+91 98765 43210', relation: 'UG 2nd Year Parent' },
  { name: 'S. Patil', phone: '+91 98765 43211', relation: 'PG 1st Year Parent' },
  { name: 'M. Deshmukh', phone: '+91 98765 43212', relation: 'UG 4th Year Parent' },
]

const linkedSystems = [
  'ASC Portal',
  'Moodle LMS',
  'Placement Portal',
  'Central Library',
  'Hostel Affairs',
]

const roleFeatureMap = {
  Student: studentFeatures,
  Faculty: facultyFeatures,
  Parent: parentFeatures,
  Admin: adminFeatures,
}

const roleSectionMap = {
  Student: [
    {
      title: 'Academic Overview',
      description: 'Attendance, marks, timetable, and assignments in one place.',
    },
    {
      title: 'Campus Services',
      description: 'Fees, hostel, transport, library, and lab operations.',
    },
    {
      title: 'Support and Growth',
      description: 'Mentoring, profiles, complaints, and student wellbeing tools.',
    },
  ],
  Faculty: [
    {
      title: 'Teaching Workflow',
      description: 'Attendance, lesson planning, timetable coordination, and class delivery.',
    },
    {
      title: 'Assessment and Communication',
      description: 'Marks entry, assignments, parent updates, and exam support.',
    },
    {
      title: 'Research and Governance',
      description: 'Research tracking, resource management, leave, and academic insights.',
    },
  ],
  Parent: [
    {
      title: 'Child Progress',
      description: 'Attendance, marks, homework, and exam visibility at a glance.',
    },
    {
      title: 'Alerts and Communication',
      description: 'Notices, discipline updates, messaging, and PTM coordination.',
    },
    {
      title: 'Payments and Services',
      description: 'Fee dashboard, scholarships, transport, health, and leave requests.',
    },
  ],
  Admin: [
    {
      title: 'Operations and Admissions',
      description: 'Student onboarding, faculty records, parent accounts, and admissions flow.',
    },
    {
      title: 'Finance and Compliance',
      description: 'Fee collection, payroll, audits, results, and policy controls.',
    },
    {
      title: 'Analytics and Infrastructure',
      description: 'Analytics, permissions, routes, systems health, and maintenance logs.',
    },
  ],
}

function splitItems(items, chunkCount) {
  const chunkSize = Math.ceil(items.length / chunkCount)

  return Array.from({ length: chunkCount }, (_, index) =>
    items.slice(index * chunkSize, (index + 1) * chunkSize),
  )
}

function RolePageTemplate({ role, title, description }) {
  const { user, language, updateLanguage, logout } = useAuth()
  const roleFeatures = roleFeatureMap[role] ?? []
  const sectionBlueprints = roleSectionMap[role] ?? []
  const sectionGroups = splitItems(roleFeatures, sectionBlueprints.length || 1)
  const currentSections = sectionBlueprints.map((section, index) => ({
    ...section,
    items: sectionGroups[index] ?? [],
  }))

  return (
    <div className="role-page container py-4 page-shell">
      <Breadcrumbs />
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
              <span className={`badge ${roleBadge[role]}`}>{role} Portal</span>
              <h1 className="h3 mt-2 mb-1">{title}</h1>
              <p className="text-muted mb-0">{description}</p>
            </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
              <select
                className="form-select form-select-sm"
                value={language}
                onChange={(event) => updateLanguage(event.target.value)}
                aria-label="Language selector"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>
              <NavLink className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-secondary' : 'btn-outline-secondary'}`} to={`/${role.toLowerCase()}-dashboard`}>
                Dashboard
              </NavLink>
              <NavLink className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`} to="/directory">
                All Pages
              </NavLink>
                <button className="btn btn-outline-danger btn-sm" onClick={logout} type="button">
                Logout
              </button>
            </div>
          </div>

          <div className="small text-muted mt-3">
            Logged in as {user?.name} ({user?.role})
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="fs-4 fw-bold text-primary mb-1">{roleFeatures.length}</div>
              <div className="small text-muted">Enabled modules</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="fs-4 fw-bold text-success mb-1">{currentSections.length}</div>
              <div className="small text-muted">Prepared sections</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="fs-4 fw-bold text-warning mb-1">{linkedSystems.length}</div>
              <div className="small text-muted">Integrated systems</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="fs-4 fw-bold text-danger mb-1">24/7</div>
              <div className="small text-muted">Portal availability target</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            <div>
              <h2 className="h5 mb-1">Prepared Sections</h2>
              <p className="text-muted mb-0">All module sections are expanded for the {title} page.</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <a className="btn btn-outline-secondary btn-sm" href="#overview">
                Overview
              </a>
              <a className="btn btn-outline-secondary btn-sm" href="#modules">
                Modules
              </a>
              <a className="btn btn-outline-secondary btn-sm" href="#integrations">
                Integrations
              </a>
              <a className="btn btn-outline-secondary btn-sm" href="#activity">
                Activity
              </a>
            </div>
          </div>

          <div className="row g-3" id="overview">
            {currentSections.map((section) => (
              <div key={section.title} className="col-12 col-lg-4">
                <div className="card border h-100">
                  <div className="card-body p-4">
                    <h3 className="h6 mb-2">{section.title}</h3>
                    <p className="small text-muted mb-3">{section.description}</p>
                    <ul className="list-unstyled mb-0 d-grid gap-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={item} className="d-flex align-items-start gap-2 small">
                          <span className="badge rounded-pill text-bg-light border mt-1">{String(itemIndex + 1).padStart(2, '0')}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

      <div className="row g-3" id="modules">
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Data Preview: {title}</h2>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Time / Period</th>
                      <th>Course Code</th>
                      <th>Faculty</th>
                      <th>Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetableRows.map((row) => (
                      <tr key={`${row.period}-${row.subject}`}>
                        <td>{row.period}</td>
                        <td>{row.subject}</td>
                        <td>{row.faculty}</td>
                        <td>{row.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="small text-muted mt-2">
                * This dummy operational snapshot keeps the module pages populated with consistent content.
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5" id="integrations">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Linked Institutional Systems</h2>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {linkedSystems.map((system) => (
                  <span key={system} className="badge rounded-pill text-bg-light border">
                    {system}
                  </span>
                ))}
              </div>

              {role === 'Parent' ? (
                <>
                  <h3 className="h6 mb-2">Parent Contact Network</h3>
                  <ul className="list-group list-group-flush">
                    {parentContacts.map((contact) => (
                      <li key={contact.phone} className="list-group-item px-0">
                        <div className="fw-semibold">{contact.name}</div>
                        <div className="small text-muted">{contact.relation}</div>
                        <div className="small">{contact.phone}</div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-muted mb-0">
                  This module is securely integrated with Sri Sudha core systems for seamless data flow via LDAP.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-0" id="activity">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Action Center</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0">Review the current module coverage and open each section for details.</li>
                <li className="list-group-item px-0">Use the dashboard link to switch between role-level overviews.</li>
                <li className="list-group-item px-0">Switch language, then verify the saved preference is reflected across pages.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Operational Notes</h2>
              <p className="text-muted mb-0">
                Every page that uses this shared template now exposes the full section set for the selected role,
                so the UI stays consistent even though the underlying page files are lightweight wrappers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RolePageTemplate
