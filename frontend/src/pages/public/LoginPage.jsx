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

const roleInfo = {
  student: { icon: '👨‍🎓', color: '#3B82F6', title: 'Student', desc: 'Access your academics' },
  faculty: { icon: '👨‍🏫', color: '#10B981', title: 'Faculty', desc: 'Manage your courses' },
  parent: { icon: '👨‍👩‍👧', color: '#F59E0B', title: 'Parent', desc: 'Monitor progress' },
  admin: { icon: '⚙️', color: '#EF4444', title: 'Admin', desc: 'System control' },
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [role, setRole] = useState('student')
  const [username, setUsername] = useState(roleDefaults.student.username)
  const [password, setPassword] = useState(roleDefaults.student.password)
  const [showPassword, setShowPassword] = useState(false)
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(6, 182, 212, 0.08)), linear-gradient(180deg, #f0f9ff, #ffffff)'
    }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="row justify-content-center"
        >
          <div className="col-12 col-md-10 col-lg-5">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center mb-5"
            >
              <Link to="/entry" className="text-decoration-none d-inline-block mb-4">
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1.2rem',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  borderRadius: '2rem',
                  color: '#2563EB',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                }}>
                  ← Back to Home
                </span>
              </Link>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Welcome Back
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                marginTop: '0.5rem'
              }}>
                Sign in to your {instituteName} account
              </p>
            </motion.div>

            {/* Main Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '1.5rem',
                padding: '3rem 2rem',
                boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)'
              }}
            >
              {/* Role Selection */}
              <div className="mb-5">
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem'
                }}>
                  Select Your Role
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {Object.entries(roleInfo).map(([roleKey, roleData]) => (
                    <motion.button
                      key={roleKey}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleChange(roleKey)}
                      style={{
                        padding: '1rem',
                        borderRadius: '1rem',
                        border: role === roleKey ? `2px solid ${roleData.color}` : '2px solid #e2e8f0',
                        background: role === roleKey ? `${roleData.color}15` : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        if (role !== roleKey) {
                          e.currentTarget.style.borderColor = roleData.color;
                          e.currentTarget.style.background = `${roleData.color}08`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (role !== roleKey) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.background = '#f8fafc';
                        }
                      }}
                    >
                      <span style={{ fontSize: '1.75rem' }}>{roleData.icon}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: role === roleKey ? roleData.color : '#64748b'
                      }}>
                        {roleData.title}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Username Input */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-4"
                >
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '0.5rem'
                  }}>
                    Username
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter your ID"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderRadius: '0.75rem',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </motion.div>

                {/* Password Input */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <label style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        fontSize: '0.8rem',
                        color: '#2563EB',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        textDecoration: 'underline'
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderRadius: '0.75rem',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      padding: '0.85rem 1rem',
                      marginBottom: '1.5rem',
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fecaca',
                      borderRadius: '0.75rem',
                      color: '#dc2626',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary w-100"
                  type="submit" 
                  disabled={loading}
                  style={{
                    padding: '0.9rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    borderRadius: '0.75rem',
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563EB, #06B6D4)',
                    border: 'none',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)',
                    marginTop: '1.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.boxShadow = '0 10px 28px rgba(37, 99, 235, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  {loading ? (
                    <span>🔄 Authenticating...</span>
                  ) : (
                    <span>🔓 Sign In</span>
                  )}
                </motion.button>
              </form>

              {/* Demo Info */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #dcfce7',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#15803d'
                }}>
                  <strong>💡 Demo Tip:</strong> Credentials are auto-filled for testing. Credentials change based on selected role.
                </div>
                {role === 'student' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#dbeafe',
                      border: '1px solid #93c5fd',
                      borderRadius: '0.75rem',
                      fontSize: '0.8rem',
                      color: '#1e40af'
                    }}
                  >
                    <strong>Sample IDs:</strong> {studentDummyIds.map((s) => s.id).join(', ')}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
