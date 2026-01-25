/**
 * Custom Commands - Global Methods
 * All reusable actions are defined here and implemented through Page Objects.
 */

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';

/**
 * Log test step for better debugging
 * @param {string} stepDescription - Description of the test step
 */
Cypress.Commands.add('logStep', (stepDescription) => {
  cy.log(`**STEP: ${stepDescription}**`);
  Cypress.log({
    name: 'STEP',
    message: stepDescription,
    consoleProps: () => ({ step: stepDescription })
  });
});

/**
 * Login using Stuller popup flow
 * @param {string} username
 * @param {string} password
 * @param {Object} options
 * @param {boolean} options.useSession
 */
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

/**
 * Search for a product from the homepage
 * @param {string} searchTerm
 */
Cypress.Commands.add('searchProduct', (searchTerm) => {
  HomePage.visitHomepage();
  HomePage.searchProduct(searchTerm);
});

/**
 * Verify search results contain expected SKU
 * @param {string} expectedSku
 */
Cypress.Commands.add('verifySearchResult', (expectedSku) => {
  ProductPage.verifyProductInResults(expectedSku);
});

/**
 * Add special instructions on product page
 * @param {string} instructions
 */
Cypress.Commands.add('addSpecialInstructions', (instructions) => {
  ProductPage.enterSpecialInstructions(instructions);
});

/**
 * Add product to cart
 * @param {Object} options
 * @param {number} options.quantity
 */
Cypress.Commands.add('addToCart', (options = {}) => {
  const { quantity = 1 } = options;
  if (quantity !== 1) {
    ProductPage.setQuantity(quantity);
  }
  ProductPage.addToCart();
});

/**
 * Navigate to cart
 */
Cypress.Commands.add('visitCart', () => {
  CartPage.visitCartPage();
});

/**
 * Verify cart count in header badge
 * @param {number} expectedCount
 */
Cypress.Commands.add('verifyCartCount', (expectedCount) => {
  CartPage.verifyCartCount(expectedCount);
});

/**
 * Verify item and description in cart
 * @param {string} itemNumber
 * @param {string} expectedItemDescription
 */
Cypress.Commands.add('verifyItemInCart', (itemNumber, expectedItemDescription = '') => {
  CartPage.verifyCartDetails({
    itemNumber,
    expectedItemDescription
  });
});

/**
 * Verify special instructions in cart
 * @param {string} expectedInstructions
 */
Cypress.Commands.add('verifySpecialInstructionsInCart', (expectedInstructions) => {
  CartPage.verifySpecialInstructions(expectedInstructions);
});
