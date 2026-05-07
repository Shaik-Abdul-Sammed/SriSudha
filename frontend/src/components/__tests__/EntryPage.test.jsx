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

    expect(screen.getByText(/Sri Sudha ERP Experience/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Continue to Login/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /Explore Modules/i })).toHaveAttribute('href', '/directory')
  })
})
