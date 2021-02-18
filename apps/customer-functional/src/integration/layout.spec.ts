describe(`Application layout`, () => {
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

  describe(`desktop layout`, () => {
    it(`should have a title 'Oregano and Basil`, () => {
      cy.get('h1')
        .should('be.visible')
        .and('contain', 'Oregano and Basil');
    });
  });

  describe(`mobile layout`,
    // we override the config here
    {
      // The resolution of an iPhone SE 2020
      viewportHeight: 667,
      viewportWidth: 375
    },
    () => {
      it(`the title should be shortened to O&B`, () => {
        cy.get('h1')
          .should('be.visible')
          .and('contain', 'O&B');
      });

      it(`on mobile, it should NOT display the Margherita pizza image with the rest of the pizza`, () => {
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
