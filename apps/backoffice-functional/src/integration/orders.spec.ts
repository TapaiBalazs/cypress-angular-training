import AUTWindow = Cypress.AUTWindow;

describe(`Orders page`, () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/orders', { fixture: 'orders.json' });

    cy.visit('/admin/orders', {
      onBeforeLoad: (window: AUTWindow) => {
        window.sessionStorage.setItem('AUTH_TOKEN', `${new Date().getTime()}`);
      }
    });
  });

  it(`displays the orders`, () => {
    cy.get(`[data-test-id="order item 1"]`)
      .should('be.visible')
      .find('summary')
      .should('contain', '$26.90, CARD - Address: Gotham, Crime Alley 32.');

    cy.get(`[data-test-id="order item 2"]`)
      .should('be.visible')
      .find('summary')
      .should('contain', '$13.45, CASH - Address: Gotham, Arkham street 92');
  });

  it(`the orders contain the ordered pizzas`, () => {
    cy.get(`[data-test-id="order item 1"]`)
      .should('be.visible')
      .find('summary')
      .click();
    cy.get(`[data-test-id="order item 1"]`)
      .find(`[data-test-id="Diavola"]`)
      .should('be.visible');
  });
});
