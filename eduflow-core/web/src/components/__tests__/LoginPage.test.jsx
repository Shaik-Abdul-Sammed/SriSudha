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
  it.each([
    ['student', 'ss26', 'student123'],
    ['faculty', 'faculty', 'faculty123'],
    ['parent', 'parent', 'parent123'],
    ['admin', 'admin', 'admin123'],
  ])('loads the %s demo credentials', async (roleName, expectedUsername, expectedPassword) => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    if (roleName !== 'student') {
      await user.click(screen.getByRole('button', { name: new RegExp(roleName, 'i') }))
    }

    expect(screen.getByText(/Username \/ ID/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toHaveValue(expectedPassword)
    expect(screen.getByDisplayValue(expectedUsername)).toBeInTheDocument()
  })

  it('submits login after switching role', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /faculty/i }))

    expect(screen.getByPlaceholderText(/••••••••/i)).toHaveValue('faculty123')
    expect(screen.getByDisplayValue('faculty')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Login Securely/i }))

    expect(mockLogin).toHaveBeenCalledWith({ role: 'faculty', username: 'faculty', password: 'faculty123' })
  })
})
