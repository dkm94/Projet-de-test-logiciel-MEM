describe('Homepage', () => {
    beforeEach(() => {
        cy.visit('https://mariage-en-main.com/');
    });

    it('should display the home page', () => {
        cy.contains('Prêts').should('be.visible');
    });
  });