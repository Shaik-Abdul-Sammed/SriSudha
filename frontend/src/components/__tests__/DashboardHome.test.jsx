import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import DashboardHome from '../DashboardHome'

describe('DashboardHome', () => {
  it('shows metric cards and module links', () => {
    render(
      <MemoryRouter>
        <DashboardHome
          role="student"
          routes={[
            { slug: 'attendance-overview', routePath: '/student-dashboard/attendance-overview' },
            { slug: 'digital-materials', routePath: '/student-dashboard/digital-materials' },
          ]}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /attendance overview/i })).toHaveAttribute('href', '/student-dashboard/attendance-overview')
    expect(screen.getByRole('link', { name: /digital materials/i })).toHaveAttribute('href', '/student-dashboard/digital-materials')
  })
})
