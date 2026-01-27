/**
 * Custom Commands - Global Methods
 * All reusable actions are defined here and implemented through Page Objects.
 */

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';

Cypress.Commands.add('logStep', (stepDescription) => {
  cy.log(`**STEP: ${stepDescription}**`);
  Cypress.log({
    name: 'STEP',
    message: stepDescription,
    consoleProps: () => ({ step: stepDescription })
  });
});

Cypress.Commands.add('login', (username, password, options = {}) => {
  const { useSession = true } = options;

  const performLogin = () => {
    LoginPage.visitLoginPage();
    LoginPage.login(username, password);
    LoginPage.verifySuccessfulLogin();
  };

  if (useSession) {
    cy.session([username], performLogin, {
      validate() {
        cy.visit('/');
        cy.get('body').should('exist');
      },
      cacheAcrossSpecs: true
    });
  } else {
    performLogin();
  }
});

Cypress.Commands.add('searchProduct', (searchTerm) => {
  HomePage.visitHomepage();
  HomePage.searchProduct(searchTerm);
});

Cypress.Commands.add('verifySearchResult', (productSkuId) => {
  ProductPage.verifyProductInResults(productSkuId);
});

Cypress.Commands.add('getStullerCredentials', () => {
  const username = Cypress.env('STULLER_USERNAME');
  const password = Cypress.env('STULLER_PASSWORD');

  if (!username || !password) {
    throw new Error('Missing STULLER_USERNAME/STULLER_PASSWORD. Configure CI secrets or set Cypress env vars.');
  }

  return cy.wrap({ username, password }, { log: false });
});

Cypress.Commands.add('addSpecialInstructions', (instructions) => {
  ProductPage.enterSpecialInstructions(instructions);
});

Cypress.Commands.add('addToCart', (options = {}) => {
  const { quantity = 1 } = options;
  if (quantity !== 1) {
    ProductPage.setQuantity(quantity);
  }
  ProductPage.addToCart();
});

Cypress.Commands.add('visitCartPage', () => {
  CartPage.visitCartPage();
});

Cypress.Commands.add('verifyCartCount', (expectedCount) => {
  CartPage.verifyCartCount(expectedCount);
});

Cypress.Commands.add('verifyItemInCart', (itemNumber, expectedItemDescription = '') => {
  CartPage.verifyCartDetails({
    itemNumber,
    expectedItemDescription
  });
});


Cypress.Commands.add('verifySpecialInstructionsInCart', (expectedInstructions) => {
  CartPage.verifySpecialInstructions(expectedInstructions);
});
