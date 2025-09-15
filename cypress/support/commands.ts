/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to login with test credentials
       * @example cy.login()
       */
      login(): Chainable<void>;

      /**
       * Custom command to create a test property
       * @example cy.createTestProperty()
       */
      createTestProperty(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("dataCy", (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("login", () => {
  // Mock login for testing - adjust based on your auth implementation
  cy.window().then((win) => {
    win.localStorage.setItem(
      "user",
      JSON.stringify({
        id: "test-user",
        name: "Test User",
        email: "test@example.com",
      })
    );
  });
});

Cypress.Commands.add("createTestProperty", () => {
  // Mock API call to create a test property
  cy.intercept("POST", "**/api/properties", {
    statusCode: 201,
    body: {
      id: "test-property-1",
      name: "Test Property",
      address: "123 Test St",
      price: 500000,
      image: "https://example.com/test.jpg",
      idOwner: "test-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }).as("createProperty");
});
