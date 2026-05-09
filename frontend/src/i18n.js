import React, { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    brand: 'Sri Sudha',
    directory: 'Directory',
    entry: 'Entry',
    login: 'Login',
    dashboard: 'Dashboard',
    pages: 'Pages',
    search_placeholder: 'Search modules...',
    search_recent: 'Recent searches',
    search_no_results: 'No results',
    language: 'Language'
  },
  hi: {
    brand: 'श्री सुधा',
    directory: 'निर्देशिका',
    entry: 'प्रवेश',
    login: 'लॉगिन',
    dashboard: 'डैशबोर्ड',
    pages: 'पृष्ठ',
    search_placeholder: 'मॉड्यूल खोजें...',
    search_recent: 'हाल की खोज',
    search_no_results: 'कोई परिणाम नहीं',
    language: 'भाषा'
  },
  te: {
    brand: 'శ్రీ సుధ',
    directory: 'డైరెక్టరీ',
    entry: 'ఎంట్రీ',
    login: 'లాగిన్',
    dashboard: 'డ్యాష్‌బోర్డ్',
    pages: 'పేజీలు',
    search_placeholder: 'మాడ్యూల్‌లను శోధించండి...',
    search_recent: 'ఇటీవల శోధనలు',
    search_no_results: 'ఫలితాలు లేవు',
    language: 'భాష'
  }
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const saved = localStorage.getItem('sri-sudha-language')
    // If saved language is no longer supported, default to 'en'
    if (saved && ['en', 'hi', 'te'].includes(saved)) {
      return saved
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('sri-sudha-language', locale)
    document.documentElement.lang = locale
  }, [locale])

  const t = (key) => {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
  }

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLocaleState(lang)
    }
  }

  const value = { t, locale, setLanguage }

  return React.createElement(I18nContext.Provider, { value }, children)
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
