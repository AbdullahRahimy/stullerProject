/**
 * HomePage - Page Object for Stuller Homepage
 * Contains methods to interact with homepage elements
 */
class HomePage {

  selectors = {
    searchInput: 'form.header-search-autocomplete-wrapper input[placeholder="Search..."]',
    accountLink: '#Account'
  };

  visitHomepage() {
    this.visit('/');
    this.waitForPageLoad();
    return this;
  }

  visit(path = '/') {
    cy.visit(path);
    return this;
  }

  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

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
