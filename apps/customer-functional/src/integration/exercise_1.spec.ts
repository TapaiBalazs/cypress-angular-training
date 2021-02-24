describe(`Exercise 1 - Routing and Title`, () => {
  /**
   * Exercise 1 - Getting familiar with cypress
   * The goal of this exercise is to get familiar with setting up a test file,
   * get DOM elements, write some basic assertions, and to use separate configuration
   * for certain test cases.
   *
   * There are 3 test scenarios in this file aimed at testing 3 requirements
   * 1. When the webpage is opened with '/', it automatically redirects to '/pizza'
   * 2. There is only one h1 element on the page, which contains the title
   * 3. The title is shortened when the page is opened on a mobile device
   *
   * Write the necessary tests to cover these requirements.
   *
   * Step 1 - Write a test which opens the route '/' and use cy.url() to check
   *          if the app is rerouted to the /pizza page.
   * Step 2 - Write a test that checks the only 'h1' tag on the page and its content.
   * Step 3 - Refactor your test file to reduce repetition.
   * Step 4 - Write a test that checks the 'h1' tag and its content in mobile view.
   *          An iPhone SE 2020's resolution is 375*667;
   * Step 5 - Write describe blocks to separate desktop and mobile view tests.
   */

  beforeEach(() => {
    cy.visit('/');
  });

  it(`default '/' navigation redirects to the pizza list page`, () => {
    cy.url().should('contain', '/pizza');
  });

  describe(`desktop layout`, () => {
    const TITLE = 'Oregano and Basil';

    it(`should have a title '${TITLE}'`, () => {
      cy.get('h1')
        .should('be.visible')
        .and('contain', TITLE);
    });
  });

  describe(`mobile layout`,
    {
      viewportWidth: 375,
      viewportHeight: 667
    },
    () => {
      const TITLE = 'O&B';

      it(`should have a title '${TITLE}'`, () => {
        cy.get('h1')
          .should('be.visible')
          .and('contain', TITLE);
      });
    });
});
