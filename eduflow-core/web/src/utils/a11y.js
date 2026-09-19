// Accessibility utilities and ARIA helpers

export const a11y = {
  // ARIA labels for common patterns
  labels: {
    closeButton: 'Close',
    openMenu: 'Open menu',
    openSearch: 'Open search',
    toggleTheme: 'Toggle theme',
    selectLanguage: 'Select language',
  },

  // Keyboard navigation helpers
  KEYS: {
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    SPACE: ' ',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
  },

  // Focus management
  moveFocus(element) {
    if (element) {
      element.focus()
      // Announce to screen readers
      announceToScreenReader(`Moved focus to ${element.textContent || element.getAttribute('aria-label')}`)
    }
  },

  manageFocus(element, container = document) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const focusArray = Array.from(focusableElements)
    const focusedIndex = focusArray.indexOf(element)

    return {
      moveToPrevious: () => {
        const previousIndex = focusedIndex > 0 ? focusedIndex - 1 : focusArray.length - 1
        focusArray[previousIndex]?.focus()
      },
      moveToNext: () => {
        const nextIndex = focusedIndex < focusArray.length - 1 ? focusedIndex + 1 : 0
        focusArray[nextIndex]?.focus()
      },
      focusableCount: focusArray.length,
    }
  },

  // Screen reader announcements
  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => announcement.remove(), 1000)
  },

  // Color contrast checker (simplified)
  checkContrast(color1, color2) {
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16)
      const r = (rgb >> 16) & 255
      const g = (rgb >> 8) & 255
      const b = rgb & 255

      return (0.299 * r + 0.587 * g + 0.114 * b) / 255
    }

    const l1 = getLuminance(color1)
    const l2 = getLuminance(color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  },

  // Skip to main content link
  createSkipLink() {
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = 'Skip to main content'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: white;
      padding: 8px;
      z-index: 100;
    `
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0'
    })
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })
    return skipLink
  },
}

export function announceToScreenReader(message, priority = 'polite') {
  a11y.announceToScreenReader(message, priority)
}

export function useKeyboardNavigation(containerSelector) {
  const container = document.querySelector(containerSelector)
  if (!container) return

  container.addEventListener('keydown', (event) => {
    const { key } = event
    const focused = document.activeElement

    if (key === a11y.KEYS.ARROW_DOWN || key === a11y.KEYS.ARROW_RIGHT) {
      event.preventDefault()
      a11y.manageFocus(focused, container).moveToNext()
    } else if (key === a11y.KEYS.ARROW_UP || key === a11y.KEYS.ARROW_LEFT) {
      event.preventDefault()
      a11y.manageFocus(focused, container).moveToPrevious()
    }
  })
}
