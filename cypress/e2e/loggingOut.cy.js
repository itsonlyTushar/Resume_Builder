
describe('Log out from the app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/user')
    });

    it('Sign Out and redirect to landing page', () => {
        cy.contains('Sign out').click();
        cy.wait(3000)
        cy.contains('Signed out successfully!')
    })
})