/**
 * ProductPage - Page Object for Stuller Product/Search Results Page
 * Contains methods to interact with product details and search results
 */
class ProductPage {

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

  waitForProductLoad() {
    this.waitForPageLoad();
    return this;
  }

  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

  getItemNumber() {
    return cy.get(this.selectors.itemNumber).first().invoke('text');
  }

  getProductTitle() {
    return cy.get(this.selectors.productTitle).first().invoke('text');
  }

  getProductPrice() {
    return cy.get(this.selectors.productPrice).first().invoke('text');
  }

  verifyPriceDisplayed() {
    this.getProductPrice().then((text) => {
      expect(text.trim()).to.not.equal('');
    });
    return this;
  }

  getProductStatus() {
    return cy.get(this.selectors.productStatus).first().invoke('text');
  }

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

  setQuantity(quantity) {
    const targetValue = quantity.toString();

    cy.intercept('POST', '**/cart/price/**').as('cartPriceSet');

    cy.get(this.selectors.quantityInput, { timeout: 15000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .and('not.be.disabled');

    // Set value directly via DOM to avoid re-render issues
    cy.get(this.selectors.quantityInput)
      .filter(':visible')
      .first()
      .focus()
      .invoke('val', '')
      .invoke('val', targetValue)
      .trigger('input', { force: true })
      .trigger('change', { force: true });

    cy.wait('@cartPriceSet', { timeout: 10000 });

    // Re-query and verify value stuck after XHR completes
    cy.get(this.selectors.quantityInput)
      .filter(':visible')
      .first()
      .should('have.value', targetValue);

    return this;
  }

  verifyQuantityValue(expectedQuantity) {
    cy.get(this.selectors.quantityInput)
      .filter(':visible')
      .first()
      .should('have.value', expectedQuantity.toString());
    return this;
  }

  addToCart() {
    cy.document().its('readyState').should('eq', 'complete');

    cy.get(this.selectors.addToCartButton, { timeout: 10000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .click({ force: true });

    // Wait for cart to update by checking the cart count badge appears/updates
    cy.get('[data-test="cart-count"]', { timeout: 10000 }).should('be.visible');
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

  verifyShipDateVisible() {
    cy.contains('Ready to Ship')
      .should('be.visible');
    return this;
  }

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
