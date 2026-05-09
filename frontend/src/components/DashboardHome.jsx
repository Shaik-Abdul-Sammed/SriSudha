import { NavLink } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { instituteStats } from '../utils/mockData'
import StudentAcademyPanel from './StudentAcademyPanel'

const roleTitle = {
  student: 'Student Dashboard',
  faculty: 'Faculty Dashboard',
  parent: 'Parent Dashboard',
  admin: 'Admin Dashboard',
}

function DashboardHome({ role, routes }) {
  const [query, setQuery] = useState('')

  const filteredRoutes = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return routes
    return routes.filter((route) => route.slug.replace(/-/g, ' ').toLowerCase().includes(term))
  }, [routes, query])

  const roleCountLabel = `${routes.length} modules`

  return (
    <div className="container py-4 page-shell">
      <div className="row g-3 mb-4">
        {instituteStats.map((stat) => (
          <div key={stat.label} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center h-100 metric-card">
              <div className="card-body p-3">
                <div className="fs-4 fw-bold text-primary mb-1">{stat.value}</div>
                <div className="small text-muted">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm dashboard-panel">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h1 className="h3 mb-2">{roleTitle[role]}</h1>
              <p className="text-muted mb-0">Select a module to continue into the sectioned page view.</p>
            </div>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2" style={{ minWidth: '280px' }}>
              <span className="badge text-bg-light border" style={{ padding: '0.5rem 0.9rem' }}>{roleCountLabel}</span>
              <input
                className="form-control"
                placeholder="Filter modules..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Filter modules"
              />
            </div>
          </div>

          <div className="row g-2">
            {filteredRoutes.map((route) => (
              <div key={route.routePath} className="col-12 col-md-6 col-xl-4">
                <NavLink
                  className={({ isActive }) => `btn w-100 text-start module-link ${isActive ? 'btn-primary' : 'btn-outline-primary'}`}
                  to={route.routePath}
                  style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem' }}
                >
                  {route.slug.replace(/-/g, ' ')}
                </NavLink>
              </div>
            ))}

            {filteredRoutes.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border mb-0">No modules match your filter.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <StudentAcademyPanel />
      </div>
    </div>
  )
}

export default DashboardHome
