import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Breadcrumbs from '../Breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders a compact trail for long paths', () => {
    render(
      <MemoryRouter initialEntries={['/student-dashboard/attendance-overview/unit-test/topic-1']}>
        <Breadcrumbs />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Directory/i })).toBeInTheDocument()
    expect(screen.getByText('…')).toBeInTheDocument()
    expect(screen.getByText('Topic 1')).toBeInTheDocument()
  })
})
