describe(`Exercise 3 - The Cart button`, () => {
  /**
   * Exercise 3 - Component communication
   *
   * The goal of this exercise is to test the communication between components and
   * test some css and navigation!
   *
   * There are 5 requirements that need to be covered in this exercise
   * 1. Clicking on the cart button should navigate to the '/cart' page
   * 2. The cart button should always be visible (on the pizzas page as well)
   * 3. When the cart is empty, the cart button text has opacity 0.7 applied
   *    and it display $0 as the price.
   * 4. When the cart has content, the cart button text has opacity 1 applied.
   * 5. The cart button displays the sum of added pizzas in US dollars ($26.71)
   *
   * Write/reuse the necessary intercepts for the pizza list page, to be able to add
   * pizzas to the cart. Write tests to cover the above mentioned requirements.
   *
   * Step 1 - Set up a beforeEach hook which stubs everything for a fully functional
   *          '/pizza' page.
   * Step 2 - Write a test to verify that clicking on the cart button navigates
   *          to the '/cart' page.
   * Step 3 - Write a test that verifies that the cart button is visible and when
   *          empty, its text has opacity 0.7 css and has $0 as its value.
   * Step 4 - Write a test that verifies that when a pizza is added to the cart,
   *          the cart button text has opacity 1 css applied, and contains the
   *          proper price of the added pizza.
   * Step 5 - Write a test that verifies that when multiple pizzas are added to the
   *          cart, the price displays the sum.
   *
   * Make sure to use best practices, such as asserting visibility and waiting
   * for requests.
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/pizza/list', { fixture: 'pizzas.json' }).as('pizzas');
    cy.intercept('GET', '/api/pizza/images/*.jpg', { fixture: 'pizza.jpg' }).as('pizzaImage');
    cy.visit('/pizza');
    cy.wait('@pizzas');
  });

  it(`clicking on the cart button navigates to the /cart page`, () => {
    cy.get(`[data-test-id="cart button"]`)
      .should('be.visible')
      .click();
    cy.url().should('contain', '/cart');
  });

  it(`the cart button should always be visible`, () => {
    cy.get(`[data-test-id="cart button"]`)
      .should('be.visible')
      .and('have.css', 'opacity', '0.7')
      .and('contain', '$0');
  });

  it(`pizzas can be added to the cart which updates the css`, () => {
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
