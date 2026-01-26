/**
 * Task 3 - Debugging & Reliability Challenge
 * 
 * ORIGINAL FLAKY TEST (provided in assessment):
 * The original test had several issues causing flakiness and brittleness.
 * 
 * DEBUGGING NOTES:
 * See README.md for detailed explanation of:
 * - What was wrong
 * - Why it was failing/flaky
 * - How fixes improve stability
 * 
 * ISSUES IDENTIFIED AND FIXED:
 * 
 * 1. HARD-CODED WAITS (cy.wait(3000), cy.wait(2000), etc.)
 *    Problem: Hard waits are unreliable - page may load faster or slower
 *    Fix: Use Cypress's built-in retry-ability and proper assertions
 * 
 * 2. BRITTLE SELECTORS (cy.get('input').eq(8))
 *    Problem: Index-based selectors break when DOM structure changes
 *    Fix: Use semantic selectors, data-testid, or stable CSS selectors
 * 
 * 3. MISSING PAGE LOAD WAITS
 *    Problem: Test interacts with elements before page is ready
 *    Fix: Wait for document ready state and specific elements
 * 
 * 4. NO RETRY LOGIC FOR DYNAMIC CONTENT
 *    Problem: Elements may not be immediately available
 *    Fix: Use Cypress's should() for automatic retries
 */

/**
 * Task 3 - Debugging & Reliability Challenge (Refactored)
 */

import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';

describe('Task 3: Packaging Product Page (Refactored)', () => {
  let products;
  let sku;
  let searchUrl;

  before(() => {
    cy.log('**=== Task 3: Debug & Reliability Challenge ===**');
    cy.fixture('products').then((data) => {
      products = data;
      sku = products.task3Product.sku;
      searchUrl = `https://www.stuller.com/search/results?query=${encodeURIComponent(sku)}`;
    });
  });

  beforeEach(() => {
    cy.visit(searchUrl);
    cy.document().its('readyState').should('eq', 'complete');
    cy.contains(sku).should('be.visible');
  });

  it('should load product and show core details', () => {
    ProductPage.verifyPriceDisplayed();
    ProductPage.verifyShipDateVisible();
  });

  it('should update quantity and add product to cart', function () {
    const username = Cypress.env('STULLER_USERNAME');
    const password = Cypress.env('STULLER_PASSWORD');

    if (!username || !password) {
      const message = 'Missing STULLER_USERNAME/STULLER_PASSWORD. Configure CI secrets or set Cypress env vars.';
      if (Cypress.env('CI')) {
        throw new Error(message);
      }
      cy.log(message);
      this.skip();
    }

    cy.login(username, password, { useSession: true });
    cy.visit(searchUrl);

    ProductPage.setQuantity(5);
    ProductPage.verifyQuantityValue(5);
    ProductPage.addToCart();
    CartPage.verifyCartCount(1);

    CartPage.visitCartPage();
    CartPage.verifyItemNumberInCart(sku);
    CartPage.verifyCartCount(1);
    CartPage.removeAllItems();
  });

  it('NEW: should show product image on the page', () => {
    cy.get('.carousel-item.active img.use-gesture-zoom',  { timeout: 10000 }).eq(0)
      .filter(':visible')
      .first()
      .should(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });

  it('NEW: should display a product title', () => {
    ProductPage.getProductTitle()
      .then((title) => {
        expect(title.trim()).to.not.equal('');
      });
  });
});
