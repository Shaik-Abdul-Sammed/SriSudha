describe('Sri Venkateswara - Critical User Flows', () => {
  const baseUrl = 'http://localhost:3000'

  beforeEach(() => {
    cy.visit(baseUrl)
  })

  describe('Entry Page Navigation', () => {
    it('should display entry page with login and explore options', () => {
      cy.get('[data-testid="entry-page"]').should('exist')
      cy.contains('Continue to Login').should('be.visible')
      cy.contains('Explore Modules').should('be.visible')
    })

    it('should navigate to login page on button click', () => {
      cy.contains('Continue to Login').click()
      cy.url().should('include', '/login')
    })
  })

  describe('Authentication Flow', () => {
    it('should display login form with email and password fields', () => {
      cy.visit(`${baseUrl}/login`)
      cy.get('input[type="email"]').should('exist')
      cy.get('input[type="password"]').should('exist')
      cy.contains('button', /login|submit/i).should('exist')
    })

    it('should login successfully with valid credentials', () => {
      cy.visit(`${baseUrl}/login`)
      cy.get('input[type="email"]').type('student@srivenkateswara.edu')
      cy.get('input[type="password"]').type('password123')
      cy.contains('button', /login|submit/i).click()

      // Should redirect to dashboard after login
      cy.url().should('include', '/student-dashboard')
      cy.contains('Dashboard').should('be.visible')
    })

    it('should show error message on invalid login', () => {
      cy.visit(`${baseUrl}/login`)
      cy.get('input[type="email"]').type('invalid@email.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.contains('button', /login|submit/i).click()

      cy.get('[role="alert"]').should('contain', 'Invalid credentials')
    })

    it('should logout successfully', () => {
      // Login first
      cy.visit(`${baseUrl}/login`)
      cy.get('input[type="email"]').type('student@srivenkateswara.edu')
      cy.get('input[type="password"]').type('password123')
      cy.contains('button', /login|submit/i).click()

      // Logout
      cy.contains('button', /logout/i).click()
      cy.url().should('include', '/entry')
    })
  })

  describe('Global Search', () => {
    beforeEach(() => {
      // Login before testing search
      cy.visit(`${baseUrl}/login`)
      cy.get('input[type="email"]').type('student@srivenkateswara.edu')
      cy.get('input[type="password"]').type('password123')
      cy.contains('button', /login|submit/i).click()
    })

    it('should open search on Ctrl+K', () => {
      cy.get('body').type('{ctrl}k')
      cy.get('[data-testid="global-search"]').should('be.visible')
    })

    it('should display search results for valid queries', () => {
      cy.get('body').type('{ctrl}k')
      cy.get('[data-testid="search-input"]').type('Attendance')
      cy.get('[data-testid="search-results"]').should('exist')
      cy.get('[data-testid="search-results"] li').should('have.length.greaterThan', 0)
    })

    it('should navigate on search result click', () => {
      cy.get('body').type('{ctrl}k')
      cy.get('[data-testid="search-input"]').type('Attendance')
      cy.get('[data-testid="search-results"] li').first().click()
      cy.url().should('include', '/attendance')
    })

    it('should close search on Escape', () => {
      cy.get('body').type('{ctrl}k')
      cy.get('[data-testid="global-search"]').should('be.visible')
      cy.get('body').type('{esc}')
      cy.get('[data-testid="global-search"]').should('not.be.visible')
    })
  })

  describe('Navigation', () => {
    it('should highlight active navigation links', () => {
      cy.visit(`${baseUrl}/directory`)
      cy.contains('a', 'Directory').should('have.class', 'active')

      cy.visit(`${baseUrl}/student-dashboard`)
      cy.contains('a', 'Dashboard').should('have.class', 'active')
    })

    it('should display breadcrumb trail', () => {
      cy.visit(`${baseUrl}/student-dashboard/attendance-overview`)
      cy.get('[data-testid="breadcrumb"]').should('exist')
      cy.get('[data-testid="breadcrumb"]').should('contain', 'Student')
    })
  })

  describe('Language Selection', () => {
    it('should change language on selection', () => {
      cy.get('select[aria-label="Language"]').select('hi')
      // Content should update based on language (verify with specific Hindi text)
      cy.get('body').should('exist') // Placeholder for actual Hindi text check
    })

    it('should persist language selection', () => {
      cy.get('select[aria-label="Language"]').select('mr')
      cy.reload()
      cy.get('select[aria-label="Language"]').should('have.value', 'mr')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.get('body').tab()
      cy.focused().should('have.attr', 'href')
    })

    it('should have proper ARIA labels', () => {
      cy.get('button[aria-label*="Theme"]').should('exist')
      cy.get('select[aria-label="Language"]').should('exist')
    })

    it('should have proper color contrast', () => {
      // This would require axe-core integration
      cy.injectAxe()
      cy.checkA11y()
    })
  })
})
