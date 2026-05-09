import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { studentDummyIds } from '../../utils/studentCatalog'

const instituteName = 'Sri Sudha'

const roleDefaults = {
  student: { username: studentDummyIds[0].id, password: 'student123' },
  faculty: { username: 'faculty', password: 'faculty123' },
  parent: { username: 'parent', password: 'parent123' },
  admin: { username: 'admin', password: 'admin123' },
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [role, setRole] = useState('student')
  const [username, setUsername] = useState(roleDefaults.student.username)
  const [password, setPassword] = useState(roleDefaults.student.password)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleRoleChange(nextRole) {
    setRole(nextRole)
    setUsername(roleDefaults[nextRole].username)
    setPassword(roleDefaults[nextRole].password)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login({ role, username, password })
      navigate(`/${role}-dashboard`, { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 login-shell"
    >
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="row justify-content-center"
        >
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card glass-card border-0 p-4 p-md-5 login-card">
              <div className="text-center mb-4">
                <Link to="/entry" className="text-decoration-none d-inline-block mb-3">
                  <span className="badge bg-light text-primary border px-3 py-2 rounded-pill">
                    <i className="bi bi-arrow-left me-1"></i> Back to Portal
                  </span>
                </Link>
                <h1 className="h3 fw-bold mb-2 text-gradient">Secure Central Login</h1>
                <p className="text-muted small">Access your {instituteName} services via secure authentication.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase tracking-wider" htmlFor="role">
                    Select Identity Role
                  </label>
                  <select
                    id="role"
                    className="form-select form-select-lg shadow-sm"
                    value={role}
                    onChange={(event) => handleRoleChange(event.target.value)}
                  >
                    <option value="student">🎓 Student Account</option>
                    <option value="faculty">👨‍🏫 Faculty Account</option>
                    <option value="parent">👪 Parent Account</option>
                    <option value="admin">🛡️ System Admin</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small" htmlFor="username">
                    LDAP Username / LDAP ID
                  </label>
                  <input
                    id="username"
                    className="form-control form-control-lg shadow-sm"
                    placeholder="Enter your LDAP ID"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold small mb-0" htmlFor="password">
                      Password
                    </label>
                    <a href="#" className="small text-decoration-none text-primary">Forgot Password?</a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="form-control form-control-lg shadow-sm mt-2"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                {error ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-danger py-2 small rounded-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                  </motion.div>
                ) : null}

                <button className="btn btn-primary btn-lg w-100 shadow mt-3 rounded-pill fw-bold" type="submit" disabled={loading}>
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Authenticating...</span>
                  ) : (
                    <span>Secure Login <i className="bi bi-lock-fill ms-1"></i></span>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-3 border-top text-center">
                <div className="small text-muted bg-light rounded p-2 border">
                  <strong>Demo Note:</strong> The selected role credentials have been auto-filled for ease of testing.
                </div>
                {role === 'student' ? (
                  <div className="small text-muted bg-light rounded p-2 border mt-2 text-start">
                    <strong>Sample student IDs:</strong> {studentDummyIds.map((student) => student.id).join(', ')}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
