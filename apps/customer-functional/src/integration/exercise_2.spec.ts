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

  describe(`when there is`, () => {
    describe(`an empty pizza list response`, () => {
      beforeEach(() => {
        cy.intercept('GET', '/api/pizza/list', { body: [] }).as('emptyList');
        // we start the test
        cy.visit('/');
        // we wait for the response to arrive before executing the tests in this test file
        cy.wait('@emptyList');
      });

      it(`a message should be displayed`, () => {
        // we get the whole pizza row which has the data-test-id
        cy.get(`[data-test-id="no delivery"]`)
          .should('exist')
          .and('be.visible')
          .and('contain', 'Sorry, but we are not delivering pizzas at the moment.');
      });
    });

    describe(`a proper pizza list response`, () => {
      beforeEach(() => {
        // We intercept the list request
        cy.intercept('GET', '/api/pizza/list', { fixture: 'pizzas.json' }).as('pizzas');
        // We intercept the pizza image requests and we stub with one image, so the image will be visible!
        // intercept can intercept image requests as well, and you can provide an image as a fixture
        cy.intercept('GET', '/api/pizza/images/*.jpg', { fixture: 'pizza.jpg' }).as('pizzaImage');

        // we start the test
        cy.visit('/pizza');
        // we wait for the response to arrive before executing the tests in this test file
        cy.wait('@pizzas');
      });

      it(`should display the Margherita pizza`, () => {
        // we get the whole pizza row which has the data-test-id
        cy.get(`[data-test-id="Margherita"]`)
          .as('margherita')
          .should('be.visible');

        // we search for the img tag inside the component.
        cy.get('@margherita')
          .find(`img`)
          // ensures that the tag is present in the DOM
          .should('exist')
          // if we don't stub the /api/pizza/images/*.jpg call, this would fail the test
          .and('be.visible')
          .and('have.attr', 'src', '/api/pizza/images/1.jpg');

        // We check the add to cart button as well, and make sure it is not disabled
        cy.get('@margherita')
          .find('[data-test-id="add to cart button"]')
          .should('be.visible')
          .and('not.be.disabled');
      });

      it(`on mobile, it should NOT display the Margherita pizza image with the rest of the pizza`,
        {
          // The resolution of an iPhone SE 2020
          viewportHeight: 667,
          viewportWidth: 375
        },
        () => {
          // we get the whole pizza row which has the data-test-id
          cy.get(`[data-test-id="Margherita"]`)
            .as('margherita')
            .should('be.visible');

          // we search for the img tag inside the component.
          cy.get('@margherita')
            .find(`img`)
            // ensures that the tag is NOT present in the DOM
            .should('not.exist');

          // We check the add to cart button as well, and make sure it is not disabled
          cy.get('@margherita')
            .find('[data-test-id="add to cart button"]')
            .should('be.visible')
            .and('not.be.disabled');
        });
    });
  });

  describe(`when an error occurs`, () => {
    it(`as an unknown server error`, () => {
      cy.intercept('GET', '/api/pizza/list', { statusCode: 500 }).as('serverError');
      // we start the test
      cy.visit('/');
      // we wait for the response to arrive before executing the tests in this test file
      cy.wait('@serverError');

      cy.get(`[data-test-id="server error"]`)
        .should('exist')
        .and('be.visible')
        .and('contain', 'Sorry, an unexpected error occurred!');
    });

    it(`as a network error`, () => {
      cy.intercept('GET', '/api/pizza/list', { forceNetworkError: true }).as('networkError');
      // we start the test
      cy.visit('/');
      // we wait for the response to arrive before executing the tests in this test file
      cy.wait('@networkError');

      // we check the server error
      cy.get(`[data-test-id="server error"]`)
        .should('exist')
        .and('be.visible')
        .and('contain', 'Sorry, an unexpected error occurred!');
    });
  });
});
