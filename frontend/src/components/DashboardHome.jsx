import { NavLink } from 'react-router-dom'

import { instituteStats } from '../utils/mockData'
import StudentAcademyPanel from './StudentAcademyPanel'

const roleTitle = {
  student: 'Student Dashboard',
  faculty: 'Faculty Dashboard',
  parent: 'Parent Dashboard',
  admin: 'Admin Dashboard',
}

function DashboardHome({ role, routes }) {
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
          <h1 className="h3 mb-2">{roleTitle[role]}</h1>
          <p className="text-muted mb-4">Select a module to continue into the sectioned page view.</p>

          <div className="row g-2">
            {routes.map((route) => (
              <div key={route.routePath} className="col-12 col-md-6 col-xl-4">
                <NavLink className={({ isActive }) => `btn w-100 text-start module-link ${isActive ? 'btn-primary' : 'btn-outline-primary'}`} to={route.routePath}>
                  {route.slug.replace(/-/g, ' ')}
                </NavLink>
              </div>
            ))}
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
