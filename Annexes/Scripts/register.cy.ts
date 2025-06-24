describe('Register form', () => {
    const baseURL = "https://mariage-en-main.com";

    beforeEach(() => {
        cy.visit(baseURL);
    });
    
    it('should open the registration form and match the URL "/register" (QASM-TC-7)', () => {
        cy.openRegisterForm();
        cy.url().should('eq', `${baseURL}/register`);
    });

    it('should match the base URL "/" when the form is closed (QASM-TC-10)', () => {
        cy.openLoginForm();
        cy.get("#signup-box-form > button").click();
        cy.url().should("eq", `${baseURL}/`);
    });
    
    // it('should submit the form with valid data', () => {    
    //     cy.get('[data-test=register-form]').within(() => {
    //         cy.get('[data-test=email]').type('test@example.com');
    //         cy.get('[data-test=password]').type('password123');
    //         cy.get('[data-test=confirm-password]').type('password123');
    //     });
    //     cy.get('[data-test=register-button]').click();
    //     cy.contains('Votre compte a bien été créé. Vous pouvez vous connecter maintenant.');
    // });
});