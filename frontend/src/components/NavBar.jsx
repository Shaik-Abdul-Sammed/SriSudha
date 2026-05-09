import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GlobalSearch from './GlobalSearch'
import { useI18n } from '../i18n'

export default function NavBar({ routes }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langDropdown, setLangDropdown] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('sri-sudha-theme') || 'light')
  const { t, locale, setLanguage } = useI18n()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sri-sudha-theme', theme)
  }, [theme])

  const pageCount = routes?.length || 0

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', googleCode: 'en' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', googleCode: 'hi' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳', googleCode: 'te' },
  ]

  const handleGoogleTranslate = (langCode) => {
    const currentUrl = window.location.href
    const googleTranslateUrl = `https://translate.google.com/translate?hl=${langCode}&sl=auto&tl=${langCode}&u=${encodeURIComponent(currentUrl)}`
    // Use navigation instead of window.open to avoid popup blocker
    window.location.href = googleTranslateUrl
  }

  const isDark = theme === 'dark'
  const navSurface = isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)'
  const navBorder = isDark ? '1px solid rgba(148, 163, 184, 0.25)' : '1px solid rgba(255, 255, 255, 0.5)'
  const navShadow = isDark ? '0 8px 24px rgba(2, 6, 23, 0.45)' : '0 8px 24px rgba(15, 23, 42, 0.08)'
  const navText = isDark ? '#e2e8f0' : '#1e293b'
  const chipBg = isDark ? 'rgba(59, 130, 246, 0.18)' : 'rgba(37, 99, 235, 0.08)'
  const dropdownBg = isDark ? '#0f172a' : '#ffffff'
  const dropdownBorder = isDark ? '1px solid rgba(148, 163, 184, 0.3)' : '1px solid rgba(37, 99, 235, 0.3)'
  const dropdownText = isDark ? '#e2e8f0' : '#1e293b'

  return (
    <nav className="glass-panel" style={{
      background: navSurface,
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: navBorder,
      boxShadow: navShadow,
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="navbar navbar-expand-lg" style={{ padding: '0.75rem 0' }}>
          <Link className="navbar-brand fw-bold" to="/directory" aria-label="Sri Sudha" style={{
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.05em'
          }}>
            <span aria-hidden>🏫</span>
            <span className="brand-text">{t('brand')}</span>
          </Link>

          <button className="navbar-toggler border-0" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" style={{
            fontSize: '1.25rem'
          }}>
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item">
                <NavLink className={({isActive}) => `nav-link fw-500 ${isActive ? 'active' : ''}`} to="/directory" style={{
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  color: navText
                }}>
                  📚 {t('directory')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive}) => `nav-link fw-500 ${isActive ? 'active' : ''}`} to="/entry" style={{
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  color: navText
                }}>
                  ℹ️ {t('entry')}
                </NavLink>
              </li>
              {user && (
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link fw-500 ${isActive ? 'active' : ''}`} to={`/${user.role}-dashboard`} style={{
                    transition: 'all 0.3s ease',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    color: navText
                  }}>
                    📊 {t('dashboard')}
                  </NavLink>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 240 }} className="d-none d-md-block">
                <GlobalSearch routes={routes} currentRole={user?.role} />
              </div>
              
              <div className="small text-muted d-none d-lg-inline" style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: chipBg,
                borderRadius: '0.5rem',
                fontWeight: '500',
                color: isDark ? '#cbd5e1' : '#475569'
              }}>
                {pageCount} 📄
              </div>

              <button 
                className="btn btn-sm" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Theme"
                style={{
                  background: 'rgba(37, 99, 235, 0.1)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.8rem',
                  transition: 'all 0.2s ease',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 99, 235, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)';
                }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-sm"
                  onClick={() => setLangDropdown(!langDropdown)}
                  aria-label="Language"
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    color: '#2563EB',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.8rem',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(37, 99, 235, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)';
                  }}
                >
                  🌐 {locale.toUpperCase()}
                </button>

                {langDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: dropdownBg,
                    border: dropdownBorder,
                    borderRadius: '0.75rem',
                    boxShadow: navShadow,
                    minWidth: '200px',
                    zIndex: 1050
                  }}>
                    <div style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', padding: '0.5rem 0.75rem', letterSpacing: '0.05em' }}>
                        🔄 App Language
                      </div>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code)
                            setLangDropdown(false)
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.65rem 0.75rem',
                            border: 'none',
                            background: locale === lang.code ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                            color: dropdownText,
                            fontSize: '0.9rem',
                            fontWeight: locale === lang.code ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            borderRadius: '0.5rem',
                            margin: '0.25rem 0'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = locale === lang.code ? 'rgba(37, 99, 235, 0.1)' : 'transparent';
                          }}
                        >
                          <span>{lang.flag}</span>
                          <span style={{ flex: 1, textAlign: 'left' }}>{lang.name}</span>
                          {locale === lang.code && <span>✓</span>}
                        </button>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', padding: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', padding: '0.5rem 0.75rem', letterSpacing: '0.05em' }}>
                        🌍 Google Translate
                      </div>
                      {languages.map((lang) => (
                        <button
                          key={`gt-${lang.code}`}
                          onClick={() => {
                            handleGoogleTranslate(lang.googleCode)
                            setLangDropdown(false)
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.65rem 0.75rem',
                            border: 'none',
                            background: 'transparent',
                            color: '#2563EB',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            borderRadius: '0.5rem',
                            margin: '0.25rem 0'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span>{lang.flag}</span>
                          <span style={{ flex: 1, textAlign: 'left' }}>{lang.name}</span>
                          <span style={{ fontSize: '0.75rem' }}>↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {user ? (
                <>
                  <div className="small d-none d-md-inline" style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(6, 182, 212, 0.08)',
                    borderRadius: '0.5rem',
                    color: isDark ? '#67e8f9' : '#06B6D4',
                    fontWeight: '600'
                  }}>
                    👤 {user.name}
                  </div>
                  <button 
                    className="btn btn-sm fw-bold" 
                    onClick={logout}
                    aria-label="Logout"
                    style={{
                      background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                    }}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link 
                  className="btn btn-sm fw-bold" 
                  to="/login"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  🔓 {t('login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && <div className="offcanvas-backdrop fade show" onClick={() => setMobileOpen(false)} />}
      <div className={`offcanvas offcanvas-start ${mobileOpen ? 'show d-block' : ''}`} tabIndex="-1" aria-modal={mobileOpen ? 'true' : 'false'} role="dialog" style={{
        background: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold" style={{
            background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏫 {t('brand')}
          </h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setMobileOpen(false)} />
        </div>
        <div className="offcanvas-body d-grid gap-3">
          <div>
            <GlobalSearch routes={routes} currentRole={user?.role} />
          </div>
          <NavLink 
            className="btn fw-bold" 
            to="/directory" 
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'rgba(37, 99, 235, 0.1)',
              color: '#2563EB',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem'
            }}
          >
            📚 {t('directory')}
          </NavLink>
          <NavLink 
            className="btn fw-bold" 
            to="/entry" 
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'rgba(37, 99, 235, 0.1)',
              color: '#2563EB',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem'
            }}
          >
            ℹ️ {t('entry')}
          </NavLink>
          {user && (
            <NavLink 
              className="btn fw-bold" 
              to={`/${user.role}-dashboard`} 
              onClick={() => setMobileOpen(false)}
              style={{
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#2563EB',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem'
              }}
            >
              📊 {t('dashboard')}
            </NavLink>
          )}
          <hr />
          <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button 
              className="btn flex-grow-1 fw-bold" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#2563EB',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: '0.75rem'
              }}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', padding: '0.5rem', letterSpacing: '0.05em' }}>
                🌐 Languages
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setMobileOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.75rem',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      background: locale === lang.code ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.05)',
                      color: '#2563EB',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{lang.name}</span>
                    {locale === lang.code && <span>✓</span>}
                  </button>
                ))}
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', padding: '0.5rem 0', marginTop: '0.25rem', letterSpacing: '0.05em' }}>
                  🌍 Google Translate
                </div>
                {languages.map((lang) => (
                  <button
                    key={`gt-mobile-${lang.code}`}
                    onClick={() => {
                      handleGoogleTranslate(lang.googleCode)
                      setMobileOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.75rem',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                      background: 'rgba(37, 99, 235, 0.05)',
                      color: '#2563EB',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{lang.name}</span>
                    <span style={{ fontSize: '0.7rem' }}>↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr />
          <div className="d-flex gap-2">
            {user ? (
              <button 
                className="btn flex-grow-1 fw-bold" 
                onClick={logout}
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  color: '#DC2626',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: '0.75rem'
                }}
              >
                🚪 Logout
              </button>
            ) : (
              <Link 
                className="btn flex-grow-1 fw-bold" 
                to="/login" 
                onClick={() => setMobileOpen(false)}
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem'
                }}
              >
                🔓 {t('login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// single export already declared at function definition above
