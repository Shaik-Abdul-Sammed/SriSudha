import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GlobalSearch from '../GlobalSearch'
import { I18nProvider } from '../../i18n'

jest.mock('../../services/searchService', () => ({
  getRecentSearches: jest.fn(async () => []),
  saveRecentSearch: jest.fn(async () => ({})),
}))

describe('GlobalSearch', () => {
  it('shows fuzzy-matched results for query', async () => {
    const user = userEvent.setup()
    const routes = [
      { slug: 'attendance-overview', role: 'student', routePath: '/student-dashboard/attendance-overview' },
      { slug: 'digital-materials', role: 'student', routePath: '/student-dashboard/digital-materials' },
    ]

    render(
      <MemoryRouter>
        <I18nProvider>
          <GlobalSearch routes={routes} currentRole="student" />
        </I18nProvider>
      </MemoryRouter>,
    )

    const input = screen.getByLabelText('Global search')
    await user.type(input, 'att over')

    expect(await screen.findByText('Attendance Overview')).toBeInTheDocument()
  })
})
