import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../../pages/public/LoginPage'

const mockLogin = jest.fn(async () => ({ token: 'demo', user: { role: 'student', name: 'Ananya' } }))
const mockNavigate = jest.fn()

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
      useNavigate: () => mockNavigate,
  }
})

describe('LoginPage', () => {
  it('prefills demo credentials and submits login', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/LDAP Username/i)).toHaveValue('student')
    expect(screen.getByLabelText(/^Password$/i)).toHaveValue('student123')

    await user.click(screen.getByRole('button', { name: /Secure Login/i }))

    expect(mockLogin).toHaveBeenCalledWith({ role: 'student', username: 'student', password: 'student123' })
  })
})
