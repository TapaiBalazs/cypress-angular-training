describe(`Pizzas page`, () => {

  describe(`when there is a proper pizza list response`, () => {
    beforeEach(() => {
      // We intercept the list request
      cy.intercept('GET', '/api/pizza/list', { fixture: 'pizzas.json' }).as('pizzas');
      // We intercept the pizza image requests and we stub with one image, so the image will be visible!
      // intercept can intercept image requests as well, and you can provide an image as a fixture
      cy.intercept('GET', '/api/pizza/images/*.jpg', { fixture: 'pizza.jpg' }).as('pizzaImage');

      // we start the test
      cy.visit('/');
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
  });

  describe(`when there is an empty pizza list response`, () => {
    beforeEach(() => {
      // We intercept the list request
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
