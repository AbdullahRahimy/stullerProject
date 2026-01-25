/**
 * ProductPage - Page Object for Stuller Product/Search Results Page
 * Contains methods to interact with product details and search results
 */
class ProductPage {
  // Selectors - Will need to be updated based on actual website
  selectors = {
    // Product details
    itemNumber: 'span[data-test="item-number"]',
    productTitle: '.productDescription',
    productPrice: '[data-test="usd-price"]',
    productStatus: '[data-test="status-message"]',
    shipDate: 'Ready to Ship',
    
    // Quantity and Cart
    quantityInput: '[data-test="quantity"]',
    addToCartButton: 'span[data-bind="text: Product().ButtonText"]',
    
    // Special instructions
    specialInstructionsInput: '[placeholder="Reviewed Prior to Shipping"]',
    
  };

  /**
   * Wait for product page to load
   */
  waitForProductLoad() {
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
   * Get item number text
   * @returns {Cypress.Chainable}
   */
  getItemNumber() {
    return cy.get(this.selectors.itemNumber).first().invoke('text');
  }

  /**
   * Get product title
   * @returns {Cypress.Chainable}
   */
  getProductTitle() {
    return cy.get(this.selectors.productTitle).first().invoke('text');
  }

  /**
   * Get product price
   * @returns {Cypress.Chainable}
   */
  getProductPrice() {
    return cy.get(this.selectors.productPrice).first().invoke('text');
  }

  /**
   * Verify price is displayed (not empty)
   */
  verifyPriceDisplayed() {
    this.getProductPrice().then((text) => {
      expect(text.trim()).to.not.equal('');
    });
    return this;
  }

  /**
   * Get product status/availability
   * @returns {Cypress.Chainable}
   */
  getProductStatus() {
    return cy.get(this.selectors.productStatus).first().invoke('text');
  }

  /**
   * Enter special instructions for the product
   * @param {string} instructions - Special instruction text
   */
  enterSpecialInstructions(instructions) {
    cy.get(this.selectors.specialInstructionsInput, { timeout: 15000 })
      .filter(':visible')
      .first()
      .should('be.visible');

    cy.get(this.selectors.specialInstructionsInput)
      .filter(':visible')
      .first()
      .scrollIntoView()
      .click()
      .clear()
      .type(instructions);
    return this;
  }

  /**
   * Set product quantity
   * @param {number|string} quantity - Quantity to set
   */
  setQuantity(quantity) {
    cy.get(this.selectors.quantityInput, { timeout: 15000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .and('not.be.disabled');

    cy.get(this.selectors.quantityInput)
      .filter(':visible')
      .first()
      .clear({ force: true });

    cy.get(this.selectors.quantityInput)
      .filter(':visible')
      .first()
      .type(quantity.toString(), { force: true });
    return this;
  }

  /**
   * Verify product quantity value
   * @param {number|string} expectedQuantity
   */
  verifyQuantityValue(expectedQuantity) {
    cy.get(this.selectors.quantityInput)
      .filter(':visible')
      .first()
      .should('have.value', expectedQuantity.toString());
    return this;
  }

  /**
   * Click Add to Cart button
   */
  addToCart() {
    cy.get(this.selectors.addToCartButton, { timeout: 10000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .click();

    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

  /**
   * Verify ship date is visible
   */
  verifyShipDateVisible() {
    cy.contains('Ready to Ship')
      .should('be.visible');
    return this;
  }

  /**
   * Verify product is displayed in search results
   * @param {string} productIdentifier - Product SKU or name
   */
  verifyProductInResults(productIdentifier) {
    cy.get(this.selectors.itemNumber)
      .should('be.visible');

    cy.get(this.selectors.itemNumber)
      .first()
      .invoke('text')
      .should('contain', productIdentifier);
    return this;
  }

}

export default new ProductPage();
