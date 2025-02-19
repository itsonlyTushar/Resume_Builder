// Auth Flow

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('should navigate to Sign In page', () => {
    cy.contains('Sign in').click(); // Click on Sign In button
    cy.url({ timeout: 10000 }).should('include', '/signin');
  });


  it('should navigate to Sign Up page', () => {
    cy.contains('Sign up').click(); // Click on Sign Up button
    cy.url({ timeout: 10000 }).should('include', '/signup');
  });

  // test sign in
  it('should sign in with valid credentials', () => {
    cy.contains('Sign in').click(); // Navigate to Sign In
    cy.get('input[placeholder="Enter Email"]').type('newcredentials@gmail.com');
    cy.get('input[placeholder="Enter Password"]').type('tushar123');
    cy.contains('Continue Sign In').click(); // Click on sign in button
    cy.url({ timeout: 10000 }).should('include', '/select_template');
  });

  // sign up with new credentials
  it('should sign up with valid credentials', () => {
    cy.contains('Sign up').click(); // Navigate to Sign Up
    cy.get('input[placeholder="Enter Email"]').type('onlytest@gmail.com');
    cy.get('input[placeholder="Enter Password"]').type('password123'); 
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    cy.contains('Continue Sign Up').click(); // Click on sign up button
    cy.url({ timeout: 10000 }).should('include', '/select_template');
  });


  // check validation on mistamatch error
  it('should show error for sign up with mismatched passwords', () => {
    cy.contains('Sign up').click(); // Navigate to Sign Up
    cy.get('input[placeholder="Enter Email"]').type('error@example.com');
    cy.get('input[placeholder="Enter Password"]').type('differentpassword');
    cy.get('input[placeholder="Confirm Password"]').type('differentupassword');
    cy.contains('Continue Sign Up').click(); // Click on sign up button
    cy.get('.text-red-500').should('contain', "Passwords do not match");
  });
});


