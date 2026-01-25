/**
 * HomePage - Page Object for Stuller Homepage
 * Contains methods to interact with homepage elements
 */
class HomePage {
  // Selectors
  selectors = {
    searchInput: 'form.header-search-autocomplete-wrapper input[placeholder="Search..."]',
    accountLink: '#Account'
  };

  /**
   * Visit Stuller homepage
   */
  visitHomepage() {
    this.visit('/');
    this.waitForPageLoad();
    return this;
  }

  /**
   * Navigate to a specific URL
   * @param {string} path - The URL path to visit
   */
  visit(path = '/') {
    cy.visit(path);
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
   * Search for a product using the search bar
   * @param {string} searchTerm - Product SKU or search term
   */
  searchProduct(searchTerm) {
    cy.get(this.selectors.searchInput, { timeout: 15000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .scrollIntoView()
      .click()
      .clear()
      .type(searchTerm)
      .type('{enter}');

    return this;
  }

}

export default new HomePage();
