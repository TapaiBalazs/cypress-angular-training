import AUTWindow = Cypress.AUTWindow;

describe(`Exercise 5 - Login`, () => {
  /**
   * Exercise 5 - Login
   * The goal of this exercise is to get familiar with edge-case handling and with custom
   * commands.
   *
   * There are 3 requirements that need to be covered in this exercise
   * 1. The application has an auth guard in place, so the '/dashboard' landing route
   *    should redirect to the '/login' page if the user is not authenticated.
   * 2. When the user fills the username and password fields with invalid credentials,
   *    login attempts should return with a statusCode of 401 and the user should be
   *    notified about the invalid credentials.
   * 3. When the user fills the username and password fields with valid credentials,
   *    the successful login should redirect them to the '/dashboard' route.
   *
   * Step 1 - Write a test that verifies that opening a guarded route redirects to the
   *          '/login' page.
   * Step 2 - Write a test that verifies that when the user tries to log in with invalid
   *          credentials, the application stays on the login page and displays a message.
   *          Make sure that the error message is not visible before the first failed attempt.
   * Step 3 - Write a test that verifies that when the user successfully logs in, the app
   *          redirects to the '/dashboard' page.
   * Step 4 - Extract repetitive code (e.g.: filling the credentials) into a custom Cypress Command
   *          Make sure to register it in '../support/command.ts'
   *
   * Make sure you use best practices, as always, you can modify the templates of the
   * application.
   */

  beforeEach(() => {
    cy.visit('/dashboard', {
      onBeforeLoad: (win: AUTWindow) => {
        win.sessionStorage.clear();
      }
    });
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
