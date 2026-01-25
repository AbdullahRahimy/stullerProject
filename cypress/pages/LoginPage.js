/**
 * LoginPage - Page Object for Stuller Login Page
 * Contains methods to interact with login functionality
 */
class LoginPage {
  selectors = {
    accountLink: '#Account',
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="log-in"]'
  };

  visitLoginPage() {
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

  openLoginPopup() {
    cy.get(this.selectors.accountLink)
      .should('be.visible')
      .click();

    cy.get(this.selectors.usernameInput, { timeout: 15000 })
      .should('be.visible');

    return this;
  }

  enterUsername(username) {
    cy.get(this.selectors.usernameInput, { timeout: 10000 })
      .should('be.visible')
      .first()
      .clear()
      .type(username);
    return this;
  }

  enterPassword(password) {
    cy.get(this.selectors.passwordInput, { timeout: 10000 })
      .should('be.visible')
      .first()
      .clear()
      .type(password, { log: false }); // Don't log password
    return this;
  }

  clickLoginButton() {
    cy.get(this.selectors.loginButton, { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
    return this;
  }

  login(username, password) {
    this.openLoginPopup();
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
    return this;
  }

  verifySuccessfulLogin() {
    cy.get(this.selectors.usernameInput, { timeout: 5000 }).should('not.exist');
    return this;
  }

}

export default new LoginPage();
