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

    expect(screen.getByText(/Student Portal/i)).toBeInTheDocument()
    expect(screen.getByText(/Interactive Analytics Chart/i)).toBeInTheDocument()
    expect(screen.getByText(/Upcoming Classes/i)).toBeInTheDocument()
  })
})
