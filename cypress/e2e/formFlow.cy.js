// Test form filling with details
describe('Resume form filling flow', ()=> {
    beforeEach(() => {
        cy.visit('http://localhost:5173/builder')

    });

    it('should fill the data in sections', () => {
        cy.get('input[placeholder="Enter first name..."]').type('Tushar');
        cy.get('input[placeholder="Enter last name..."]').type('Soni');
        cy.get('input[placeholder="email..."]').type('tushargsoni17@gmail.com');
        cy.get('input[placeholder="number..."]').type('9327584894');
        cy.contains('Next').click();
        cy.get('input[placeholder="Enter college..."]').type('Woolf');
        cy.get('input[placeholder="Enter course name..."]').type('CS');
        cy.get('input[placeholder="Enter location..."]').type('USA');
        cy.get('input[placeholder="2023-2025"]').type('2026')
        cy.contains('Next').click();
        cy.get('input[placeholder="Enter name..."]').type('JAS');
        cy.get('input[placeholder="Enter role name..."]').type('HOF EXECUTIVE');
        cy.get('input[placeholder="Enter location..."]').type('SURAT');
        cy.get('input[placeholder="2023-2025"]').type('2026');
        cy.contains('Add field').click()
        cy.contains('Next').click();    
        cy.get('input[placeholder="Enter name..."]').type('RESUME BUILDER');
        cy.get('[data-testid="tech-stack"]').type('REDUX,REACT');
        cy.get('input[placeholder="Add Link..."]').type('vercel.com');
        cy.get('input[placeholder="Mar-2024"]').type('mar-2024');
        cy.contains('Next').click();
        cy.get('input[placeholder="Enter skill..."]').type('Communication skills');
        cy.contains('Submit').click();
        cy.wait(2000);
        cy.contains('Save & Download').click();
    }) 
})


// Form validation testing 
describe('Check validations in form', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/builder')
    });

    it('should check the validation errors in sections', () => {
        cy.wait(2500);
        cy.get('input[placeholder="Enter first name..."]').type(' ');
        cy.get('input[placeholder="Enter last name..."]').type(' ');
        cy.get('input[placeholder="email..."]').type(' ');
        cy.get('input[placeholder="number..."]').type(' ');
        cy.contains('Next').click();
        cy.contains('First name is required');
        cy.contains('Last name is required');
        cy.contains('Email is required');
        cy.contains('Contact is required');
    })

    
})