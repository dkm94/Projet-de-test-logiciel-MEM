describe('Login Form', () => {
    const baseURL = Cypress.config("baseUrl");

    beforeEach(() => {
        cy.visit(baseURL || "mariage-en-main.com");
    });

    it('should open the login form when the "Connexion" button is clicked (QASM-TC-80)', () => {
        cy.openLoginForm();
    });

    it('should open the login form and match the URL "/login" (QASM-TC-6)', () => {
        cy.openLoginForm();
        cy.url().should('eq', `${baseURL}/login`);
    });

    it('should close the login form', () => {
        cy.openLoginForm();
        cy.get('.auth-modal-close > button').click();
        cy.contains('Se connecter').should('not.exist');
    });

    it('should match the base URL "/" when the form is closed (QASM-TC-9)', () => {
        cy.openLoginForm();
        cy.get(".auth-modal-close > button").click();
        cy.url().should("eq", `${baseURL}/`);
    });

    it('should switch from register to login form when the bottom link is clicked and match the URL "/login" (QASM-TC-8)', () => { 
        // BEWARE !! This is not a link but a button !
        cy.openRegisterForm();
        cy.url().should('eq', `${baseURL}/register`);

        const loginBtn = cy.get('.register__signup > button').contains('Connectez-vous');
        loginBtn.should('be.visible').click();
        cy.contains('Se connecter').should('be.visible');
        cy.url().should('eq', `${baseURL}/login`);
    });

    it('should allow user to login with valid credentials (QASM-TC-82)', () => {

        cy.openLoginForm();
        cy.url().should('eq', `${baseURL}/login`);

        // The inputs are already prefilled with the valid user credentials
        cy.loginViaUI();

        // Check redirection to the dashboard page
        cy.url().should("include", "/tableau-de-bord");
    });

    it('should not allow user to login with invalid credentials (QASM-TC-79)', () => {
        cy.openLoginForm();
        cy.url().should('eq', `${baseURL}/login`);

        cy.loginViaUI("unregistered@mail.com", "Azertyuiop123!");

        cy.contains("Echec connexion").should("be.visible");
        cy.url().should("eq", `${baseURL}/login`);
    });

    it('should redirect user to the homepage if unauthenticated (QASM-TC-78)', () => {
        cy.visit(`https://mariage-en-main.com/mariage/660832cdb68f18004dd08896/tableau-de-bord`);
        cy.url().should('eq', `${baseURL}/`);
    });

    it('should log out (QASM-TC-86)', () => {
        cy.openLoginForm();
        cy.url().should('eq', `${baseURL}/login`);

        cy.loginViaUI();
        cy.url().should("include", "/tableau-de-bord");

        cy.logout();
        cy.url().should('eq', `${baseURL}/`);
        cy.contains("Inscrivez-vous dès maintenant !").should("be.visible");
    });
});