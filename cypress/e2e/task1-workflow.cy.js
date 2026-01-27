/**
 * Task 1 - End-to-End Workflow Automation
 * 
 * This test automates a realistic e-commerce flow on stuller.com:
 * 1. Visit homepage
 * 2. Login using provided credentials
 * 3. Search for product using custom command
 * 4. Make note of item number
 * 5. Enter special instructions
 * 6. Add product to cart
 * 7. Visit cart page
 * 8. Verify cart count is 1
 * 9. Verify item number and special instructions match
 * 
 * Additional enhancements for robustness:
 * - Session caching for login efficiency
 * - Comprehensive assertions
 * - Screenshot on key steps
 * - Detailed logging
 */

import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';

describe('Task 1: E2E Workflow Automation', () => {
  before(() => {
    cy.log('**=== Task 1: E2E Workflow Test ===**');
  });

  it('Complete E2E workflow from search to cart verification', function () {
    cy.getStullerCredentials().then(({ username, password }) => {// create on method in command and use it over the automation suite
      cy.fixture('products').then((products) => {
        const productSkuId = products.task1Product.sku;
        const specialInstructions = products.task1Product.specialInstructions;
        const expectedItemDescription = products.task1Product.expectedItemDescription;

        cy.logStep('Login with provided credentials');
        cy.login(username, password, { useSession: false });

        cy.logStep(`Search for product: ${productSkuId}`);
        cy.searchProduct(productSkuId);
        cy.verifySearchResult(productSkuId);

        cy.logStep('Capture item number from product page');
        ProductPage.waitForProductLoad();
        ProductPage.getItemNumber().should('contain', productSkuId);

        cy.logStep(`Enter special instructions: ${specialInstructions}`);
        cy.addSpecialInstructions(specialInstructions);

        cy.logStep('Add product to cart');
        cy.addToCart({ quantity: 1 });
        cy.verifyCartCount(1);

        cy.logStep('Open cart and verify details');
        cy.visitCartPage();
        CartPage.verifyCartPageLoaded();
        cy.verifyItemInCart(productSkuId, expectedItemDescription);
        cy.verifySpecialInstructionsInCart(specialInstructions);

        cy.logStep('Remove all items from cart');
        CartPage.removeAllItems();
      });
    });
  });
});
