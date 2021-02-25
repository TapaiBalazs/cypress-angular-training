import AUTWindow = Cypress.AUTWindow;

describe(`Exercise 4 - The Cart page`, () => {
  /**
   * Exercise 4 part 1 - The Cart Page
   *
   * The goal of this exercise is to get acquainted with actions involving input
   * fields, selects and mocking localStorage values.
   *
   * There are 5 requirements that need to be covered in this exercise
   * 1. When there are no pizzas added to the cart, a message is displayed to the user
   * 2. The 'place order' button should be disabled until there are no pizzas and
   *    the form is not filled
   * 3. Cart content is not dropped, if the user reloads the page, it gets stored
   *    in localStorage.
   * 4. The cart button displays the summed value of the order items.
   * 5. Pizzas from the order can be removed with the remove-from-cart buttons
   *
   * Write the necessary tests to cover the above requirements. Use localStorage mocking
   * before the page loads to reduce overhead that would be caused by adding pizzas for
   * each and every test scenario.
   *
   * Step 1 - Write a test that verifies that when a completely empty cart page is
   *          opened, the place order button is disabled.
   * Step 2 - Write a test that verifies that when a completely empty cart page is
   *          opened, there is a message for the user.
   * Step 3 - Write a test that populates the cart from the '/pizza' page and then
   *          navigates to the cart page and reloads it. Make sure that the cart
   *          contents are kept after reload.
   * Step 4 - The previous test takes too long. Rewrite the test, so it does not
   *          need to open the '/pizza' page to populate the cart contents.
   * Step 5 - Write a test that verifies that when a cart is not empty, the place
   *          order button is disabled if the order form is empty.
   * Step 6 - Write a test that verifies that items can be removed from the cart
   * Step 7 - Write a test that verifies that a successfully placed order redirects
   *          the user to the /success page and the cart is cleared.
   * Step 8 - Write a test that verifies that when a server error occurs, the user
   *          gets redirected to the /error page, and the cart contents stay
   *
   * Make sure you use best practices, as always, you can modify the templates of the
   * application.
   */

  describe(`with an empty cart`, () => {
    beforeEach(() => {
      cy.visit('/cart');
    });

    it(`The 'Place order' button should be disabled`, () => {
      cy.get(`[data-test-id="place order"]`)
        .should('be.visible')
        .and('be.disabled');
    });

    it(`asks the user to put a pizza into the cart`, () => {
      cy.get(`[data-test-id="empty order message"]`)
        .should('be.visible')
        .and('contain', 'Please, place an order first.');
    });
  });

  describe(`with cart contents`, () => {

    const MOCK_CART_CONTENT = [
      {
        id: 2,
        name: 'Prosciutto',
        price: 1345,
        imageUrl: '/api/pizza/images/2.jpg',
        description: 'Tomato sauce, ham, mozzarella, oregano'
      },
      {
        id: 3,
        name: 'Diavola',
        price: 1345,
        imageUrl: '/api/pizza/images/3.jpg',
        description: 'Tomato sauce, Italian spicy salami, mozzarella'
      }
    ];

    beforeEach(() => {
      // we start the tests with setting a cart content up first
      cy.visit('/cart', {
        onBeforeLoad: (window: AUTWindow) => {
          window.localStorage.setItem('cart', JSON.stringify(MOCK_CART_CONTENT))
        }
      });
    });

    it(`without an address, the 'Place order' button should be disabled`, () => {
      cy.get(`[data-test-id="place order"]`)
        .should('be.visible')
        .and('be.disabled');
    });

    it(`refreshing the page should keep the cart contents`, () => {
      cy.get(`[data-test-id="cart button"]`)
        .should('be.visible')
        .and('contain', '$26.90');
      cy.reload();
      cy.get(`[data-test-id="cart button"]`)
        .should('be.visible')
        .and('contain', '$26.90');
    });

    it(`clicking on the Remove button removes the order`, () => {
      cy.get(`[data-test-id="order_Prosciutto"]`)
        .should('be.visible')
        .find('[data-test-id="remove from cart button"]')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.get(`[data-test-id="cart button"]`)
        .should('be.visible')
        .and('contain', '$13.45');
    });

    describe(`placing an order`, () => {

      beforeEach(() => {
        cy.get('#city')
          .should('be.visible')
          .and('not.disabled')
          .type(`Gotham`);

        cy.get('#street')
          .should('be.visible')
          .and('not.disabled')
          .type(`Crime Alley 32.`);

        cy.get('#payment_method')
          .should('be.visible')
          .and('not.disabled')
          .select('CARD');
      });

      it(`a successful order navigates to the /success page and clears the cart contents`, () => {
        cy.intercept('POST', '/api/order', { body: 1 }).as('orderRequest');

        cy.get(`[data-test-id="place order"]`)
          .should('be.visible')
          .and('not.be.disabled')
          .click();

        cy.wait('@orderRequest')
          .its('request.body').should('deep.include', {
          address: 'Gotham, Crime Alley 32.',
          paymentType: 'CARD'
        });
        cy.url().should('contain', '/success');

        cy.get(`[data-test-id="success message"]`)
          .should('be.visible')
          .and('contain', 'Your order is on its way!');

        cy.get(`[data-test-id="cart button"]`)
          .should('be.visible')
          .and('have.css', 'opacity', '0.7')
          .and('contain', '$0');
      });

      it(`when an error occurs, user should be redirected to the error page with the cart contents kept`, () => {
        cy.intercept('POST', '/api/order', { forceNetworkError: true }).as('orderRequest');

        cy.get(`[data-test-id="place order"]`)
          .should('be.visible')
          .and('not.be.disabled')
          .click();

        cy.wait('@orderRequest')
          .its('request.body').should('deep.include', {
          address: 'Gotham, Crime Alley 32.',
          paymentType: 'CARD'
        });

        cy.url().should('contain', '/error');

        cy.get(`[data-test-id="error message"]`)
          .should('be.visible')
          .and('contain', 'Sorry, an unexpected error occurred. Please try again later.');

        cy.get(`[data-test-id="cart button"]`)
          .should('be.visible')
          .and('have.css', 'opacity', '1')
          .and('contain', '$26.90');
      });
    });
  });
});
