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

    expect(screen.getByText(/Educational ERP/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Access Portal/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /Explore Modules/i })).toHaveAttribute('href', '/directory')
  })
})
