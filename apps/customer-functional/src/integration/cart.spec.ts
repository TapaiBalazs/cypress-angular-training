describe(`Cart`, () => {

  beforeEach(() => {
    // We intercept the list request
    cy.intercept('GET', '/api/pizza/list', { fixture: 'pizzas.json' }).as('pizzas');
    // We intercept the pizza image requests and we stub with one image, so the image will be visible!
    // intercept can intercept image requests as well, and you can provide an image as a fixture
    cy.intercept('GET', '/api/pizza/images/*.jpg', { fixture: 'pizza.jpg' }).as('pizzaImage');
  });

  describe(`in one session`, () => {
    beforeEach(() => {
      // we start the tests
      cy.visit('/pizza');
      // we wait for the response to arrive before executing the tests in this test file
      cy.wait('@pizzas');
    });

    it(`the cart button should be visible`, () => {
      // we also test if the price gets converted to dollar amounts
      cy.get(`[data-test-id="cart-button"]`)
        .should('be.visible')
        .and('have.css', 'opacity', '0.7')
        .and('contain', '$0');
    });

    it(`pizzas can be added to the cart which updates the css`, () => {
      // we get the whole pizza row which has the data-test-id
      cy.get(`[data-test-id="Margherita"]`)
        .should('be.visible')
        .find('[data-test-id="add to cart button"]')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.get(`[data-test-id="cart-button"]`)
        .should('be.visible')
        .and('have.css', 'opacity', '1')
        .and('contain', '$12.90');
    });

    it(`adding multiple pizzas sums up the order price`, () => {
      // we get the whole pizza row which has the data-test-id
      cy.get(`[data-test-id="Margherita"]`)
        .should('be.visible')
        .find('[data-test-id="add to cart button"]')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.get(`[data-test-id="Piccante"]`)
        .should('be.visible')
        .find('[data-test-id="add to cart button"]')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.get(`[data-test-id="cart-button"]`)
        .should('be.visible')
        .and('contain', '$27.70');
    });

    it(`refreshing a session keeps the cart`, () => {
      // we get the whole pizza row which has the data-test-id
      cy.get(`[data-test-id="Margherita"]`)
        .should('be.visible')
        .find('[data-test-id="add to cart button"]')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.get(`[data-test-id="Piccante"]`)
        .should('be.visible')
        .find('[data-test-id="add to cart button"]')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.get(`[data-test-id="cart-button"]`)
        .should('be.visible')
        .and('contain', '$27.70');
      cy.reload();
      cy.get(`[data-test-id="cart-button"]`)
        .should('be.visible')
        .and('contain', '$27.70');
    });
  });

  describe(`when the user refreshes`, () => {

    const MOCK_CART_CONTENT = [{
      id: 2,
      name: 'Prosciutto',
      price: 1345,
      imageUrl: '/api/pizza/images/2.jpg',
      description: 'Tomato sauce, ham, mozzarella, oregano'
    }];

    beforeEach(() => {
      window.localStorage.setItem('cart', JSON.stringify(MOCK_CART_CONTENT))
      // we start the tests
      cy.visit('/pizza');
      // we wait for the response to arrive before executing the tests in this test file
      cy.wait('@pizzas');
    });

    it(`should display the summed value`, () => {
      cy.get(`[data-test-id="cart-button"]`)
        .should('be.visible')
        .and('contain', '$13.45');
    })
  })
});
