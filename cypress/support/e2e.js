/**
 * E2E Support File
 * Global configuration and hooks for all E2E tests
 */

// Import commands
import './commands';

// Hide fetch/XHR requests from command log to reduce noise (optional)
// Cypress.Server.defaults({ ignore: (xhr) => true });

// Global before hook - runs once before all tests
before(() => {
  cy.log('**=== Starting Test Suite ===**');
  
  // Clear any existing session data (optional - uncomment if needed)
  // cy.clearAllCookies();
  // cy.clearAllLocalStorage();
  // cy.clearAllSessionStorage();
});

// Global beforeEach hook - runs before each test
beforeEach(() => {
  // Set viewport for consistent testing
  cy.viewport(1920, 1080);
  
  // Log the test being run
  const testTitle = Cypress.currentTest?.title || 'Unknown Test';
  cy.log(`**Starting test: ${testTitle}**`);
});

// Global afterEach hook - runs after each test
afterEach(function() {
  // Capture screenshot on failure
  if (this.currentTest?.state === 'failed') {
    const testName = this.currentTest.title.replace(/\s+/g, '-');
    cy.screenshot(`FAILED-${testName}`, { capture: 'fullPage' });
  }
});

// Global after hook - runs once after all tests
after(() => {
  cy.log('**=== Test Suite Complete ===**');
});

// Prevent Cypress from failing tests on uncaught exceptions from application
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error for debugging
  console.error('Uncaught Exception:', err.message);
  
  // Return false ONLY if you want to ignore specific errors. 
  // Returning true (or doing nothing) will fail the test, which is best practice.
  // if (err.message.includes('known-3rd-party-error')) {
  //   return false;
  // }
});

// Log failed assertions for debugging
Cypress.on('fail', (error, runnable) => {
  console.error('Test Failed:', error.message);
  console.error('Test:', runnable.title);
  throw error; // Re-throw to fail the test
});
