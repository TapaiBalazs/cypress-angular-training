describe(`Cart`, () => {

  beforeEach(() => {
    // We intercept the list request
    cy.intercept('GET', '/api/pizza/list', { fixture: 'pizzas.json' }).as('pizzas');
    // We intercept the pizza image requests and we stub with one image, so the image will be visible!
    // intercept can intercept image requests as well, and you can provide an image as a fixture
    cy.intercept('GET', '/api/pizza/images/*.jpg', { fixture: 'pizza.jpg' }).as('pizzaImage');
  });

  describe(`from the pizzas page`, () => {
    beforeEach(() => {
      // we start the tests
      cy.visit('/pizza');
      // we wait for the response to arrive before executing the tests in this test file
      cy.wait('@pizzas');
    });

    it(`clicking on the cart button navigates to the /cart page`, () => {
      cy.get(`[data-test-id="cart button"]`)
        .should('be.visible')
        .click();
      cy.url().should('contain', '/cart');
    });

    it(`the cart button should always be visible`, () => {
      // we also test if the price gets converted to dollar amounts
      cy.get(`[data-test-id="cart button"]`)
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
      cy.get(`[data-test-id="cart button"]`)
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
      cy.get(`[data-test-id="cart button"]`)
        .should('be.visible')
        .and('contain', '$27.70');
    });
  });

  describe('the cart page', () => {
    describe(`with an empty cart`, () => {

      beforeEach(() => {
        cy.visit('/cart');
      });

      it(`asks the user to put a pizza into the cart`, () => {
        cy.get(`[data-test-id="empty order message"]`)
          .should('be.visible')
          .and('contain', 'Please, place an order first.');
      });

      it(`The 'Place order' button should be disabled`, () => {
        cy.get(`[data-test-id="place order"]`)
          .should('be.visible')
          .and('be.disabled');
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
        window.localStorage.setItem('cart', JSON.stringify(MOCK_CART_CONTENT));
        // we start the tests
        cy.visit('/cart');
      });

      it(`without an address, the 'Place order' button should be disabled`, () => {
        cy.get(`[data-test-id="place order"]`)
          .should('be.visible')
          .and('be.disabled');
      });

      it(`should display the summed value`, () => {
        cy.get(`[data-test-id="cart button"]`)
          .should('be.visible')
          .and('contain', '$26.90');
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

        it(`a successful order navigates to the /success page and clears the cart contents`,() => {
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

        it(`when an error occurs, user should be redirected to the error page with the cart contents kept`,() => {
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
            .and('contain', 'Sorry, an unexpected error occurred. Please try again later.')

          cy.get(`[data-test-id="cart button"]`)
            .should('be.visible')
            .and('have.css', 'opacity', '1')
            .and('contain', '$26.90');
        });
      });
    });
  });
});
