import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GlobalSearch from './GlobalSearch'
import { useI18n } from '../i18n'

export default function NavBar({ routes }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('sri-sudha-theme') || 'light')
  const { t, locale, setLanguage } = useI18n()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sri-sudha-theme', theme)
  }, [theme])

  const pageCount = routes?.length || 0

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm mb-3">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/directory">{t('brand')}</Link>

        <button className="navbar-toggler" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/directory">{t('directory')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/entry">{t('entry')}</NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to={`/${user.role}-dashboard`}>{t('dashboard')}</NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 240 }} className="me-2 d-none d-md-block">
              <GlobalSearch routes={routes} currentRole={user?.role} />
            </div>
            <div className="small text-muted d-none d-md-inline">{t('pages')}: {pageCount}</div>
            <div className="btn-group me-2" role="group">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Theme</button>
            </div>

            <select aria-label={t('language')} className="form-select form-select-sm" value={locale} onChange={(e) => setLanguage(e.target.value)} style={{ width: 110 }}>
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>

            {user ? (
              <>
                <div className="small text-muted d-none d-md-inline">{user.name}</div>
                <button className="btn btn-sm btn-outline-danger ms-2" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link className="btn btn-sm btn-primary" to="/login">{t('login')}</Link>
            )}
          </div>
        </div>

        {mobileOpen && <div className="offcanvas-backdrop fade show" onClick={() => setMobileOpen(false)} />}
        <div className={`offcanvas offcanvas-start ${mobileOpen ? 'show d-block' : ''}`} tabIndex="-1" aria-modal={mobileOpen ? 'true' : 'false'} role="dialog">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">{t('brand')}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setMobileOpen(false)} />
          </div>
          <div className="offcanvas-body d-grid gap-3">
            <GlobalSearch routes={routes} currentRole={user?.role} />
            <NavLink className="btn btn-outline-primary text-start" to="/directory" onClick={() => setMobileOpen(false)}>{t('directory')}</NavLink>
            <NavLink className="btn btn-outline-primary text-start" to="/entry" onClick={() => setMobileOpen(false)}>{t('entry')}</NavLink>
            {user && <NavLink className="btn btn-outline-primary text-start" to={`/${user.role}-dashboard`} onClick={() => setMobileOpen(false)}>{t('dashboard')}</NavLink>}
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Theme</button>
              {user ? <button className="btn btn-outline-danger" onClick={logout}>Logout</button> : <Link className="btn btn-primary" to="/login" onClick={() => setMobileOpen(false)}>{t('login')}</Link>}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
