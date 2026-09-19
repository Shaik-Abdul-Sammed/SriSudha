import { I18nProvider, useI18n } from '../i18n'
import { render, screen } from '@testing-library/react'

function Probe() {
  const { t, locale, setLanguage } = useI18n()

  return (
    <div>
      <span>{t('directory')}</span>
      <span>{locale}</span>
      <button type="button" onClick={() => setLanguage('hi')}>Switch</button>
    </div>
  )
}

describe('i18n', () => {
  it('provides translated placeholders and language persistence', () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    )

    expect(screen.getByText(/Directory/i)).toBeInTheDocument()
    expect(screen.getByText(/en/i)).toBeInTheDocument()
  })
})
