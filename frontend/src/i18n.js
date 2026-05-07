import React, { createContext, useContext, useState } from 'react'

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
  mr: {
    brand: 'श्री सुधा',
    directory: 'निर्देशिका',
    entry: 'प्रवेश',
    login: 'लॉगिन',
    dashboard: 'डॅशबोर्ड',
    pages: 'पाने',
    search_placeholder: 'मॉड्यूल शोधा...',
    search_recent: 'अलीकडील शोध',
    search_no_results: 'परिणाम नाहीत',
    language: 'भाषा'
  }
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const defaultLang = localStorage.getItem('sri-sudha-language') || 'en'
  const [locale, setLocale] = useState(defaultLang)

  function t(key) {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
  }

  function setLanguage(lang) {
    setLocale(lang)
    localStorage.setItem('sri-sudha-language', lang)
  }

  return React.createElement(I18nContext.Provider, { value: { t, locale, setLanguage } }, children)
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
