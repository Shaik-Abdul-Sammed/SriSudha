describe('Student roster picker', () => {
  it('selects a student from the roster and previews', () => {
    cy.visit('/')
    // navigate to dashboard if needed
    cy.get('nav').should('exist')
    // find the roster select and choose the second option
    cy.get('select').contains('—').then(($select) => {
      // pick first selectable option
      cy.wrap($select).select(1)
    })
    cy.contains('Preview as student').click()
    cy.contains('Previewing as').should('exist')
  })
})
