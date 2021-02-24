describe(`Exercise 6 - Order list page`, () => {
  /**
   * Exercise 6 - Authenticated navigation
   * The goal of this exercise is to practice UI side auth handling in functional tests.
   *
   * There are 3 requirements that need to be covered in this exercise
   * 1. The '/admin/orders' page retrieves the placed orders and displays the order data
   *    (total, paymentType, address)
   * 2. An order can be expanded, and it displays the pizzas
   * 3. If the orders request returns with a status 403, the user is redirected to the
   *    login page and the previous token is removed from sessionStorage
   *
   * This application is only a demo application, it simulates authentication with a simple
   * `new Date().getTime()`.
   * It is not an industry best practice, it is just for the training. In real life one would
   * use a JWT, or handle authentication with cookies to be secure.
   *
   * Step 1 - Write a test that can navigate to the '/admin/orders' page with an active
   *          login and verify that the orders are present. (use '../fixtures/orders.json')
   *          On the '/dasbhoard' page, there is only one '<mat-card>' element which is
   *          clickable and navigates to the '/admin/orders' page.
   * Step 2 - Write a test that opens one of the order details and verifies that the pizzas
   *          are present
   * Step 3 - These tests take too long, refactor them in a way that you don't need to start
   *          every test from the login page.
   *          The 'AUTH_TOKEN' gets stored in the sessionStorage after a successful login.
   * Step 4 - Write a test that simulates that the user's token has expired before they visited
   *          the orders page, to verify that the application redirects and clears sessionStorage
   *
   * Make sure you use best practices, like asserting visibility and structuring your test files.
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/orders', { fixture: 'orders.json' }).as('orders');

    cy.visit('/admin/orders', {
      onBeforeLoad: (window: AUTWindow) => {
        window.sessionStorage.setItem('AUTH_TOKEN', `${new Date().getTime()}`);
      }
    });
    cy.wait('@orders');
  });

  it(`displays the orders`, () => {
    cy.get(`[data-test-id="order item 1"]`)
      .should('be.visible')
      .find('summary')
      .should('contain', '$26.90, CARD - Address: Gotham, Crime Alley 32.');

    cy.get(`[data-test-id="order item 2"]`)
      .should('be.visible')
      .find('summary')
      .should('contain', '$13.45, CASH - Address: Gotham, Arkham street 92');
  });

  it(`the orders contain the ordered pizzas`, () => {
    cy.get(`[data-test-id="order item 1"]`)
      .should('be.visible')
      .find('summary')
      .click();
    cy.get(`[data-test-id="order item 1"]`)
      .find(`[data-test-id="Diavola"]`)
      .should('be.visible');
  });

});
