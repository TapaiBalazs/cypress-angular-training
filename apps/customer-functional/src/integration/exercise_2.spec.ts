describe(`Exercise 2 - Pizza interceptors`, () => {
  /**
   * Exercise 2 part 1 - Intercepting requests
   * The goal of this exercise is to get familiar with intercepting using fixtures
   * and/or static responses, updating the templates with data-test-id attributes
   * and aliasing.
   *
   * There are 3 requirements that need to be covered in this exercise
   * 1. Notify the user when there's no delivery with a message.
   * 2. When there is delivery, the pizzas are displayed with an image and an
   *    add-to-cart button
   * 3. On mobile view, the pizza images are not displayed.
   * 4. When an error occurs (either a network error or an unexpected server error)
   *    the user is notified about the error in a message.
   *
   * Write the necessary tests to cover the above requirements. Use the '../fixtures' folder
   * (relative to this file) for your fixtures or use static objects. A 'pizza.jpg' and a 'pizzas.json'
   * is provided for stubbing the pizza images. The pizza prices are in cents (e.g.: 1200 >> $12)
   *
   * You can modify the application's templates to add data-test-id properties, but make sure you follow best practices
   * with asserting visibility and enabled/disabled states. Use the cypress test runner to
   * check for API calls.
   *
   * Step 1 - Write a test to verify that a message is displayed when an empty array is sent back
   *          as the pizza list.
   * Step 2 - Write a test that verifies that the first pizza is displayed with an image, and
   *          an enabled Add to cart button. (Keep describe scopes in mind for intercept calls!)
   *          Use the '../fixtures/pizzas.json' as your fixture.
   * Step 3 - Write a test that verifies that on mobile the pizza image does not get displayed
   * Step 4 - Write two tests to check network and service error behavior.
   *          (Keep describe scopes in mind for intercept calls!)
   */

  describe(`when there is an empty pizza list response`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/pizza/list', { body: [] }).as('emptyList');
      cy.visit('/');
      cy.wait('@emptyList');
    });

    it(`a message should be displayed`, () => {
      cy.get(`[data-test-id="no delivery"]`)
        .should('exist')
        .and('be.visible')
        .and('contain', 'Sorry, but we are not delivering pizzas at the moment.');
    });
  });

  describe(`when there is a proper pizza list response`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/pizza/list', { fixture: 'pizzas.json' }).as('pizzas');
      cy.intercept('GET', '/api/pizza/images/*.jpg', { fixture: 'pizza.jpg' }).as('pizzaImage');
      cy.visit('/pizza');
      cy.wait('@pizzas');
    });

    it(`should display the Margherita pizza`, () => {
      cy.get(`[data-test-id="Margherita"]`)
        .as('margherita')
        .should('be.visible');

      cy.get('@margherita')
        .find(`img`)
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'src', '/api/pizza/images/1.jpg');

      cy.get('@margherita')
        .find('[data-test-id="add to cart button"]')
        .should('be.visible')
        .and('not.be.disabled');
    });

    it(`on mobile, it should NOT display the Margherita pizza image with the rest of the pizza`,
      {
        viewportHeight: 667,
        viewportWidth: 375
      },
      () => {
        cy.get(`[data-test-id="Margherita"]`)
          .as('margherita')
          .should('be.visible');

        cy.get('@margherita')
          .find(`img`)
          .should('not.exist');

        cy.get('@margherita')
          .find('[data-test-id="add to cart button"]')
          .should('be.visible')
          .and('not.be.disabled');
      });
  });
});
