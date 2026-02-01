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
 * 
 * 5. Authentication HANDLING
 *   Problem: no authentication was done before accessing user-specific features
 *  Fix: Added login step with session caching
 */

/**
 * Task 3 - Debugging & Reliability Challenge (Refactored)
 */

import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';

describe('Task 3: Packaging Product Page (Refactored)', () => {
  let products;
  let productSkuId;
  let searchUrl;

  before(() => {
    cy.log('**=== Task 3: Debug & Reliability Challenge ===**');
    cy.fixture('products').then((data) => {
      products = data;
      productSkuId = products.task3Product.sku;
      searchUrl = `https://www.stuller.com/search/results?query=${encodeURIComponent(productSkuId)}`;
    });
  });

  beforeEach(() => {
    cy.visit(searchUrl);
    cy.document().its('readyState').should('eq', 'complete');
    cy.contains(productSkuId).should('be.visible');
  });

  it('should load product and show core details', () => {
    ProductPage.verifyPriceDisplayed();
    ProductPage.verifyShipDateVisible();
  });

  it('should update quantity and add product to cart', function () {
    cy.getStullerCredentials().then(({ username, password }) => {
      cy.login(username, password, { useSession: true });
      cy.visit(searchUrl);

      ProductPage.setQuantity(5);
      ProductPage.verifyQuantityValue(5);
      ProductPage.addToCart();
      CartPage.verifyCartCount(1);

      CartPage.visitCartPage();
      CartPage.verifyItemNumberInCart(productSkuId);
      CartPage.verifyCartCount(1);
      CartPage.removeAllItems();
    });
  });

  it('NEW: should show product image on the page', () => {
    cy.get('.carousel-item.active img.use-gesture-zoom',  { timeout: 10000 }).eq(0)
      .filter(':visible')
      .first()
      .should(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });// we could improve it by using hashing to verify exact image if needed
  });

  it('NEW: should display a product title', () => {
    ProductPage.getProductTitle()
      .then((title) => {
        expect(title.trim()).to.not.equal('');
      });
  });
});
