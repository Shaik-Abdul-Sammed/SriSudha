import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import ProtectedRoute from '../ProtectedRoute'

const mockAuthState = { isAuthenticated: false, user: null }

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}))

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    mockAuthState.isAuthenticated = false
    mockAuthState.user = null

    render(
      <MemoryRouter initialEntries={['/student-dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/student-dashboard" element={<div>Student Area</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument()
  })

  it('allows matching authenticated users through', () => {
    mockAuthState.isAuthenticated = true
    mockAuthState.user = { role: 'student' }

    render(
      <MemoryRouter initialEntries={['/student-dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/student-dashboard" element={<div>Student Area</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/entry" element={<div>Entry Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/Student Area/i)).toBeInTheDocument()
  })
})
