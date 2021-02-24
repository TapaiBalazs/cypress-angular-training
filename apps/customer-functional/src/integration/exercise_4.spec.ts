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

  it(`The 'Place order' button should be disabled`, () => {
    cy.visit('/cart');
    cy.get(`[data-test-id="place order"]`)
      .should('be.visible')
      .and('be.disabled');
  });

});
