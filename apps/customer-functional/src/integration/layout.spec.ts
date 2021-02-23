describe(`Application layout`, () => {
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

  it(`default navigation redirects to the pizza list page`, () => {
    cy.url().should('contain', '/pizza')
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
    });
});
