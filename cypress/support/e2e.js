/**
 * E2E Support File
 * Global configuration and hooks for all E2E tests
 */

import './commands';

before(() => {
  cy.log('**=== Starting Test Suite ===**');
  
  // Clear any existing session data (optional - uncomment if needed)
  // cy.clearAllCookies();
  // cy.clearAllLocalStorage();
  // cy.clearAllSessionStorage();
});

beforeEach(() => {
  cy.viewport(1920, 1080);
  
  const testTitle = Cypress.currentTest?.title || 'Unknown Test';
  cy.log(`**Starting test: ${testTitle}**`);
});

afterEach(function() {
  if (this.currentTest?.state === 'failed') {
    const testName = this.currentTest.title.replace(/\s+/g, '-');
    cy.screenshot(`FAILED-${testName}`, { capture: 'fullPage' });
  }
});

after(() => {
  cy.log('**=== Test Suite Complete ===**');
});

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Uncaught Exception:', err.message);

});

Cypress.on('fail', (error, runnable) => {
  console.error('Test Failed:', error.message);
  console.error('Test:', runnable.title);
  throw error;
});
