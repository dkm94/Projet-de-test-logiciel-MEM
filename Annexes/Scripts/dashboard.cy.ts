describe('Dashboard', () => {
    const baseURL = Cypress.config("baseUrl");

    before(() => {
        cy.visit(baseURL || "mariage-en-main.com");
        
        // The login form si already filled with the valid user credentials
        cy.openLoginForm();
        cy.url().should('eq', 'https://mariage-en-main.com/login');

        cy.loginViaAPI();
    });

    it('should have "Voir détails" buttons that redirects to main features (QASM-TC-87, QASM-TC-88, QASM-TC-89, QASM-TC-90, QASM-TC-91)', () => {
      const sidebar = cy.get(".custom-sidebar-menu");
      sidebar.should("be.visible");
      sidebar.should("contain", "Tableau de bord");

      // INVITES redirects to "/invites"
      const invitesBtn = cy.get(
        ":nth-child(1) > #dashboard-cards > .dashbord-view-details > a > .MuiButtonBase-root"
      );
      invitesBtn.click();
      cy.url().should("include", "/invites");

      const dashboardHref = cy.get(
        '.custom-sidebar-menu > [href="/mariage/660832cdb68f18004dd08894/tableau-de-bord"]'
      );
      dashboardHref.should("be.visible").click();

      // TABLES redirects to "/tables"
      const tablesBtn = cy.get(
        ":nth-child(2) > #dashboard-cards > .dashbord-view-details > a > .MuiButtonBase-root"
      );
      tablesBtn.click();
      cy.url().should("include", "/tables");

      dashboardHref.click();

      // RECEPTION redirects to "/carte"
      const receptionBtn = cy.get(
        ":nth-child(3) > #dashboard-cards > .dashbord-view-details > a > .MuiButtonBase-root"
      );
      receptionBtn.click();
      cy.url().should("include", "/carte");

      dashboardHref.click();

      // TASKS redirects to "/taches"
      const tasksBtn = cy.get(
        ":nth-child(4) > #dashboard-cards > .dashbord-view-details > a > .MuiButtonBase-root"
      );
      tasksBtn.click();
      cy.url().should("include", "/taches");

      dashboardHref.click();

      // EXPENSES redirects to "/budget"
      const expensesBtn = cy.get(
        ":nth-child(5) > #dashboard-cards > .dashbord-view-details > a > .MuiButtonBase-root"
      );
      expensesBtn.click();
      cy.url().should("include", "/budget");

      dashboardHref.click();
      cy.url().should("include", "/tableau-de-bord");
    });
});