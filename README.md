# Stuller Cypress Assessment

This repo is a clean Cypress setup for the Stuller.com assessment. Tests are split by task, Page Objects hold locators and actions, fixtures hold test data, and global commands wrap common steps.

## Quick setup

1) Install dependencies
- `npm install`

2) Add credentials (required for price and cart actions)
Create `cypress.env.json` in the project root:
```json
{
  "STULLER_USERNAME": "your-username",
  "STULLER_PASSWORD": "your-password"
}
```

## Run tests

- Open runner: `npm run cy:open`
- Run all: `npm test`
- Task 1 only: `npm run test:task1`
- Task 2 only: `npm run test:task2`
- Task 3 only: `npm run test:task3`

## Structure (short version)

```
cypress/
  e2e/              # task specs
  fixtures/         # test data
  pages/            # POM: selectors + page actions
  support/          # commands + global hooks
```

### Why this structure
- POM keeps selectors and UI actions in one place
- Fixtures keep test data out of test logic
- Commands provide clean, reusable test steps

## Task coverage

### Task 1 (workflow)
- End‑to‑end flow in a single test to avoid cross‑test coupling
- Uses `cy.searchProduct()` as required
- Validates item number, special instructions, cart count, and cleans up cart

### Task 2 (API + UI)
- Uses Basic Auth on the Stuller API
- Verifies HTTP 200, SKU, price, description, and status with exact matches
- Logs in on UI to ensure price is visible

### Task 3 (debugging)
- Refactored to remove hard waits and brittle selectors
- Uses POM methods and Cypress retries
- Adds two extra tests (image + title checks)
- Used secrets in Github to store credentials like Username and Password

## Debugging Notes (Task 3)

**What was wrong**
- Hard waits (`cy.wait`) instead of waiting for elements
- Indexbased selectors (`cy.get('input').eq(8)`) that break on DOM changes
- Direct cart navigation without waiting for cart update

**Why it was flaky**
- Fixed waits race with network speed
- DOM order changes cause wrong elements to be targeted
- Cart update is async and not guaranteed before navigation
- Quantity field starts with a default value (e.g., 1). If not fully cleared, typing 5 appends to the existing value (ending up as 15).
- without loging in the verification of added item was not possible, used secrets to store credentials a
  used it accross all tasks

**How it was fixed**
- Wait on `readyState` and element visibility
- Use stable selectors in POM
- Verify cart badge and product presence before assertions
- Updated quantity input selector to `[data-test="quantity"]` and re‑queried the visible input to avoid stale DOM updates
- Clear the quantity input with select‑all and then adding the new value 5
- Load fixtures once in `before()` and reuse across Task 3 tests to reduce repeated I/O and keep tests consistent
- Reuse `searchUrl` in `beforeEach()` for consistent navigation across Task 3 tests
- Assert quantity input value after updating before adding to cart
- Clear cart items after the add-to-cart test to keep later tests isolated

**New test cases added**
- Product image loads (natural width > 0)
- Product title is visible and not empty

## Requirements checklist (from PDF)
- Cypress 13+ and Node 20+
- Three specs: Task 1 workflow, Task 2 API+UI, Task 3 debug
- Custom search command from homepage
- Do not attempt checkout/payment
- Basic Auth API request and UI validation
- Debugging notes included

## Assumptions & future improvements
- Some selectors are class or text‑based because stable `data-test` hooks were not available
- If stable `data-test` hooks become available, replace those selectors
- Add more negative tests around search and cart validation
