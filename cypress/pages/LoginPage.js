/**
 * LoginPage - Page Object for Stuller Login Page
 * Contains methods to interact with login functionality
 */
class LoginPage {
  // Selectors - Will need to be updated based on actual website
  selectors = {
    accountLink: '#Account',
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="log-in"]'
  };

  /**
   * Visit login page
   */
  visitLoginPage() {
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
   * Open login popup from header
   */
  openLoginPopup() {
    cy.get(this.selectors.accountLink)
      .should('be.visible')
      .click();

    cy.get(this.selectors.usernameInput, { timeout: 15000 })
      .should('be.visible');

    return this;
  }

  /**
   * Enter username/email
   * @param {string} username - Username or email
   */
  enterUsername(username) {
    cy.get(this.selectors.usernameInput, { timeout: 10000 })
      .should('be.visible')
      .first()
      .clear()
      .type(username);
    return this;
  }

  /**
   * Enter password
   * @param {string} password - Password
   */
  enterPassword(password) {
    cy.get(this.selectors.passwordInput, { timeout: 10000 })
      .should('be.visible')
      .first()
      .clear()
      .type(password, { log: false }); // Don't log password
    return this;
  }

  /**
   * Click login button
   */
  clickLoginButton() {
    cy.get(this.selectors.loginButton, { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
    return this;
  }

  /**
   * Perform complete login flow
   * @param {string} username - Username or email
   * @param {string} password - Password
   */
  login(username, password) {
    this.openLoginPopup();
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
    return this;
  }

  /**
   * Verify successful login by checking redirect
   */
  verifySuccessfulLogin() {
    cy.get(this.selectors.usernameInput, { timeout: 5000 }).should('not.exist');
    return this;
  }

}

export default new LoginPage();
