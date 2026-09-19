import { useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, NavLink } from 'react-router-dom'
import { I18nProvider } from './i18n'
import DashboardHome from './components/DashboardHome'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import EntryPage from './pages/public/EntryPage'
import LoginPage from './pages/public/LoginPage'
import AboutPage from './pages/public/AboutPage'
import InstitutionRegister from './pages/public/InstitutionRegister'
import './App.css'
import Layout from './components/Layout'
import VisitorDashboard from './components/VisitorDashboard'
import ProfilePage from './pages/common/ProfilePage'
import { ToastProvider } from './components/ToastProvider'
import AITerminal from './pages/ai/AITerminal'
import DigitalTwinManager from './pages/ai/DigitalTwinManager'
import BuildManager from './pages/ai/BuildManager'
import OfficersDashboard from './pages/ai/OfficersDashboard'
import AccreditationOfficer from './pages/ai/officers/AccreditationOfficer'
import StudentSuccessOfficer from './pages/ai/officers/StudentSuccessOfficer'
import OfficerPlaceholder from './pages/ai/officers/OfficerPlaceholder'

const instituteName = 'EduFlow'

const roleColorClass = {
  student: 'text-bg-primary',
  faculty: 'text-bg-success',
  parent: 'text-bg-warning',
  admin: 'text-bg-danger',
}

const roleDisplay = {
  student: 'Student',
  faculty: 'Faculty',
  parent: 'Parent',
  admin: 'Admin',
}

const toKebabCase = (value) =>
  value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()

const toTitleCase = (value) =>
  value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

const pageModules = import.meta.glob('./pages/*/*.jsx', { eager: true })

const generatedRoutes = Object.entries(pageModules)
  .map(([filePath, module]) => {
    const match = filePath.match(/\.\/pages\/([^/]+)\/([^/]+)\.jsx$/)
    if (!match) {
      return null
    }

    const [, role, fileName] = match
    const slug = toKebabCase(fileName)
    const routePath = `/${role}-dashboard/${slug}`

    return {
      role,
      fileName,
      slug,
      routePath,
      Component: module.default,
    }
  })
  .filter(Boolean)

function HomeDirectory() {
  const [filter, setFilter] = useState('')
  const groupedRoutes = generatedRoutes.reduce((acc, route) => {
    if (!acc[route.role]) {
      acc[route.role] = []
    }
    acc[route.role].push(route)
    return acc
  }, {})

  const roleOrder = ['student', 'faculty', 'parent', 'admin']

  const filtered = (arr) =>
    (arr || []).filter((r) => r.slug.toLowerCase().includes(filter.trim().toLowerCase()))

  return (
    <div className="container py-4 page-shell">
      <header className="hero-strip card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row gap-4 align-items-md-center justify-content-between">
          <div>
            <p className="text-uppercase small fw-semibold text-primary mb-2">Module Directory</p>
            <h1 className="display-6 fw-bold mb-2">{instituteName} ERP Module Directory</h1>
            <p className="text-muted mb-0">Explore every role dashboard and module page from a single navigation surface.</p>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <input className="form-control" placeholder="Search modules..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            <Link className="btn btn-outline-secondary" to="/login">Login</Link>
          </div>
        </div>
      </header>

      <div className="row g-3">
        {roleOrder.map((role) => (
          <div key={role} className="col-12 col-lg-6">
            <section className="card border-0 shadow-sm h-100 role-summary-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="h5 mb-0">{roleDisplay[role]} Dashboard</h2>
                  <span className={`badge ${roleColorClass[role]}`}>{filtered(groupedRoutes[role])?.length ?? 0} Pages</span>
                </div>

                <p className="text-muted small mb-3">Tap a module to open the full sectioned page for this role.</p>

                <ul className="list-group list-group-flush module-list" onKeyDown={(e) => {
                  const links = Array.from(e.currentTarget.querySelectorAll('.directory-link'))
                  if (!links.length) return
                  const active = document.activeElement
                  const idx = links.indexOf(active)
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    if (idx === -1) links[0].focus()
                    else links[Math.min(idx + 1, links.length - 1)].focus()
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    if (idx === -1) links[0].focus()
                    else links[Math.max(idx - 1, 0)].focus()
                  }
                }}>
                  {filtered(groupedRoutes[role]).map((route) => (
                    <li key={route.routePath} className="list-group-item px-0">
                      <NavLink className={({isActive}) => `directory-link ${isActive ? 'text-primary fw-bold' : ''}`} to={route.routePath} tabIndex={0}>
                        {toTitleCase(route.slug)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  )
}

function RedirectHome() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/entry" replace />
  }

  return <Navigate to={`/${user.role}-dashboard`} replace />
}

function NotFoundPage() {
  return (
    <div className="container py-5 text-center page-shell">
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '640px' }}>
        <div className="card-body p-4 p-md-5">
          <p className="text-uppercase small fw-semibold text-primary mb-2">404</p>
          <h1 className="h3 mb-2">Page Not Found</h1>
          <p className="text-muted mb-4">The requested route is not available.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link className="btn btn-primary" to="/directory">
              Open Directory
            </Link>
            <Link className="btn btn-outline-secondary" to="/entry">
              Back to Entry
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const groupedRoutes = generatedRoutes.reduce((acc, route) => {
    if (!acc[route.role]) {
      acc[route.role] = []
    }
    acc[route.role].push(route)
    return acc
  }, {})

  return (
    <BrowserRouter>
      <I18nProvider>
      <ToastProvider>
        <Routes>
          <Route path="/ai-terminal" element={<AITerminal />} />
          <Route path="/digital-twin" element={<DigitalTwinManager />} />
          <Route path="/build-manager" element={<BuildManager />} />
          <Route path="/officers-dashboard" element={<OfficersDashboard />} />
          <Route path="/officer/accreditation" element={<AccreditationOfficer />} />
          <Route path="/officer/student-success" element={<StudentSuccessOfficer />} />
          <Route path="/officer/timetable" element={<OfficerPlaceholder officerName="AI Timetable Officer" icon="📅" color="#2563EB" desc="Conflict-free timetable generation considering faculty workload, room availability, labs, and semester constraints." features={['Faculty workload balancing','Room & lab conflict resolution','Auto-regeneration on changes','Multi-department scheduling','Export to PDF & Excel']} />} />
          <Route path="/officer/admissions" element={<OfficerPlaceholder officerName="AI Admission Officer" icon="🎓" color="#10B981" desc="End-to-end admissions automation from enquiry to enrollment." features={['WhatsApp query automation','Document verification','Eligibility checking','Counselling scheduling','Conversion prediction']} />} />
          <Route path="/officer/finance" element={<OfficerPlaceholder officerName="AI Finance Officer" icon="💰" color="#F59E0B" desc="Automated fee reconciliation, UPI matching, and financial reporting." features={['UPI transaction matching','Bank statement reconciliation','Pending fee prediction','Scholarship tracking','Automated receipts']} />} />

          <Route element={<Layout routes={generatedRoutes} />}>
            <Route path="/" element={<RedirectHome />} />
            <Route path="/entry" element={<EntryPage />} />
              <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-institution" element={<InstitutionRegister />} />
            <Route path="/profile" element={<ProfilePage />} />

        <Route element={<ProtectedRoute role="student" />}>
          <Route
            path="/student-dashboard"
            element={<DashboardHome role="student" routes={groupedRoutes.student || []} />}
          />
        </Route>

        <Route element={<ProtectedRoute role="faculty" />}>
          <Route
            path="/faculty-dashboard"
            element={<DashboardHome role="faculty" routes={groupedRoutes.faculty || []} />}
          />
        </Route>

        <Route element={<ProtectedRoute role="parent" />}>
          <Route
            path="/parent-dashboard"
            element={<DashboardHome role="parent" routes={groupedRoutes.parent || []} />}
          />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route
            path="/admin-dashboard"
            element={<DashboardHome role="admin" routes={groupedRoutes.admin || []} />}
          />
        </Route>

          <Route path="/visitor-dashboard" element={<VisitorDashboard />} />

        <Route path="/directory" element={<HomeDirectory />} />

        {generatedRoutes.map((route) => (
          <Route key={route.routePath} element={<ProtectedRoute role={route.role} />}>
            <Route path={route.routePath} element={<route.Component />} />
          </Route>
        ))}

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ToastProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}

export default App
