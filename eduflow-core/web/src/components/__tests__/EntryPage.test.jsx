import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import EntryPage from '../../pages/public/EntryPage'

describe('EntryPage', () => {
  it('renders institute heading and key actions', () => {
    render(
      <MemoryRouter>
        <EntryPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/AI Operating System/i)).toBeInTheDocument()
    const registerLinks = screen.getAllByRole('link', { name: /Register Institution/i })
    expect(registerLinks.length).toBeGreaterThanOrEqual(1)
    expect(registerLinks[0]).toHaveAttribute('href', '/register-institution')
    expect(screen.getByRole('link', { name: /Access Workspace/i })).toHaveAttribute('href', '/login')
  })
})
