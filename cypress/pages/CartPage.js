/**
 * CartPage - Page Object for Stuller Cart Page
 * Contains methods to interact with shopping cart
 */
class CartPage {
  // Selectors - Will need to be updated based on actual website
  selectors = {
    // Cart items
    itemDescription: '[data-test="item-description"]',
    
    // Cart summary
    cartCount: '[data-test="cart-count"]',
    
    // Actions
    removeAllButton: '[data-test="remove-all-button"]',
    removeAllConfirmButton: '[data-test="remove-all-items"]',
    
    // Empty cart
    emptyCartMessage: '[data-test="empty-cart-message"]',

    // Header cart popout
    cartIconLabel: '[data-test="Cart"] > .d-block',
    goToCartLink: '[data-test="cart-buttons"] > .sbtn'
  };

  /**
   * Visit cart page
   */
  visitCartPage() {
    cy.get(this.selectors.cartIconLabel)
      .should('be.visible')
      .click();
    cy.get(this.selectors.goToCartLink)
      .filter(':visible')
      .first()
      .should('be.visible')
      .click();
    this.waitForPageLoad();
    return this;
  }

  /**
   * Wait for page to fully load
   */
  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

  /**
   * Verify cart page is loaded
   */
  verifyCartPageLoaded() {
    cy.url().should('include', '/cart');
    return this;
  }

  /**
   * Verify cart count matches expected
   * @param {number} expectedCount - Expected number of items
   */
  verifyCartCount(expectedCount) {
    cy.get(this.selectors.cartCount)
      .first()
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const count = parseInt(text.replace(/\D/g, ''), 10);
        expect(count).to.equal(expectedCount);
      });
    return this;
  }

  /**
   * Verify item number in cart
   * @param {string} expectedItemNumber - Expected item number/SKU
   */
  verifyItemNumberInCart(expectedItemNumber) {
    cy.contains('a', expectedItemNumber).should('be.visible');
    return this;
  }

  /**
   * Verify special instructions in cart
   * @param {string} expectedInstructions - Expected special instructions
   */
  verifySpecialInstructions(expectedInstructions) {
    cy.get('body').should('contain', expectedInstructions);
    return this;
  }

  /**
   * Remove all items from cart
   */
  removeAllItems() {
    cy.get('body').then(($body) => {
      if ($body.find(this.selectors.removeAllButton).length > 0) {
        cy.get(this.selectors.removeAllButton)
          .should('be.visible')
          .click();

        cy.get(this.selectors.removeAllConfirmButton)
          .should('be.visible')
          .click();
      }
    });
    return this;
  }

  /**
   * Verify cart is empty
   */
  verifyCartEmpty() {
    cy.get(this.selectors.emptyCartMessage)
      .should('be.visible')
      .and('contain.text', 'Your cart is empty');
    return this;
  }

  /**
   * Verify all cart details
   * @param {Object} expectedDetails - Expected details object
   * @param {string} expectedDetails.itemNumber - Expected item number
   * @param {string} expectedDetails.specialInstructions - Expected special instructions
   */
  verifyCartDetails(expectedDetails) {
    if (expectedDetails.itemNumber) {
      this.verifyItemNumberInCart(expectedDetails.itemNumber);
    }
    if (expectedDetails.specialInstructions) {
      this.verifySpecialInstructions(expectedDetails.specialInstructions);
    }
    if (expectedDetails.expectedItemDescription) {
      cy.get(this.selectors.itemDescription)
        .should('be.visible')
        .and('contain.text', expectedDetails.expectedItemDescription);
    }
    return this;
  }
}

export default new CartPage();
