describe(`Login`, () => {

  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it(`without an active login, the application redirects to the login page`, () => {
    cy.url().should('contain', 'login');
  });

  describe(`with invalid credentials`, () => {
    it(`displays an error message`, () => {
      cy.intercept('POST', '/api/login', { statusCode: 401 }).as('login');

      cy.get(`[data-test-id="login credentials error"]`)
        .should('not.exist');

      cy.fillCredentials('Oregano', 'basil')
        .login();
      cy.get(`[data-test-id="login credentials error"]`)
        .should('be.visible')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    });
  });

  describe(`with valid credentials`, () => {
    it(`navigates the user to the dashboard`, () => {
      cy.intercept('POST', '/api/login', { body: { accessToken: `${new Date().getTime()}`} }).as('login');

      cy.get(`[data-test-id="login credentials error"]`)
        .should('not.exist');

      cy.fillCredentials('Oregano', 'basil')
        .login();
      cy.url().should('contain', '/admin/dashboard');
    });

  });


});
