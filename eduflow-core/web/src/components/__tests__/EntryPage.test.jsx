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
    expect(screen.getByRole('link', { name: /Register Institution/i })).toHaveAttribute('href', '/register-institution')
    expect(screen.getByRole('link', { name: /Access Workspace/i })).toHaveAttribute('href', '/login')
  })
})
