/**
 * Task 2 - API + UI Hybrid Validation
 * 
 * This test demonstrates validation between API and UI layers:
 * 1. Use cy.request() to fetch product data from Stuller API
 * 2. Use custom search command to find the same product in UI
 * 3. Compare and validate:
 *    - HTTP Response Code (should be 200)
 *    - SKU Validation (API SKU matches UI Item Number)
 */

import ProductPage from '../pages/ProductPage';

describe('Task 2: API + UI Hybrid Validation', () => {
  before(() => {
    cy.log('**=== Task 2: API + UI Validation Test ===**');
  });

  it('Validate SKU, price, description, and status between API and UI', function () {
    cy.getStullerCredentials().then(({ username, password }) => {
      cy.fixture('products').then((products) => {
        const productSkuId = products.task2Product.sku;
        const apiBaseUrl = (Cypress.env('API_BASE_URL') || '').replace(/\/$/, '');// remove a valid trailing slash from the end of a URL string.

        if (!apiBaseUrl) {
          throw new Error('Missing API_BASE_URL. Configure Cypress env vars (e.g., in cypress.config.js env).');
        }

      cy.logStep('Fetch product data from API (basic auth)');
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/v2/products?SKU=${encodeURIComponent(productSkuId)}`,// Encode SKU for URL safety like special characters ? & = etc.
        auth: {
          user: username,
          pass: password
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status, 'HTTP status should be 200').to.equal(200);

        const apiProduct = response.body?.Products?.[0];

        if (!apiProduct) {
          throw new Error('API response did not include Products[0].');
        }

        const apiSku = apiProduct.SKU || '';
        const apiPriceValue = Number(apiProduct.Price?.Value ?? NaN);
        const apiDescription = apiProduct.Description || '';
        const apiStatus = apiProduct.Status || '';

        cy.logStep('Login via UI and search product');
        cy.login(username, password, { useSession: true });
        cy.searchProduct(productSkuId);
        cy.verifySearchResult(productSkuId);
        ProductPage.waitForProductLoad();

        cy.logStep('Compare API and UI fields');
        ProductPage.getItemNumber().then((uiSkuText) => {
          expect(uiSkuText.trim()).to.equal(apiSku || productSkuId);
        });

        ProductPage.getProductPrice().then((uiPriceText) => {
          const uiPriceValue = Number(uiPriceText.replace(/[^0-9.]/g, ''));

          if (Number.isNaN(apiPriceValue)) {
            throw new Error('API price value is missing or invalid.');
          }

          expect(uiPriceValue.toFixed(2)).to.equal(apiPriceValue.toFixed(2));
        });

        ProductPage.getProductTitle().then((uiTitle) => {
          expect(uiTitle.trim()).to.equal(apiDescription);
        });

        ProductPage.getProductStatus().then((uiStatus) => {
          expect(uiStatus.trim()).to.equal(apiStatus);
        });
      });
    });
    });
  });
});
