// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    fillCredentials(email: string, password: string): Chainable<Subject>;

    login(): void
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('fillCredentials', (email, password) => {
  cy.get(`[data-test-id="login username"]`)
    .should('be.visible')
    .and('not.be.disabled')
    .type(email);
  cy.get(`[data-test-id="login password"]`)
    .should('be.visible')
    .and('not.be.disabled')
    .type(`${password}`);
  return cy.get(`[data-test-id="login button"]`)
    .should('be.visible')
    .and('not.be.disabled');
});

Cypress.Commands.add('login', { prevSubject: 'element' }, (subject) => {
  subject.click();
});

//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
