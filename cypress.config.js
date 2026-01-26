const { defineConfig } = require('cypress');

const isCI = process.env.CI === 'true' || process.env.CI === '1';

module.exports = defineConfig({
  // Project metadata
  projectId: 'stuller-cypress-assessment',

  // E2E Configuration
  e2e: {
    // Base URL for the application under test
    baseUrl: 'https://www.stuller.com',

    // Spec file pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Support file
    supportFile: 'cypress/support/e2e.js',

    // Fixtures folder
    fixturesFolder: 'cypress/fixtures',

    // Setup Node events
    setupNodeEvents(on, config) {
      // Register event listeners here
      
      // Log when test starts
      on('before:run', (details) => {
        console.log('Starting test run:', details.specs?.length || 0, 'specs');
      });

      // Log when test completes
      on('after:run', (results) => {
        console.log('Test run complete. Passed:', results.totalPassed, 'Failed:', results.totalFailed);
      });

      // Task for logging to Node console
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },

    // Experimental features
    experimentalRunAllSpecs: true,

    // Test isolation (must be inside e2e config)
    testIsolation: true,
  },

  // Browser preferences
  viewportWidth: 1920,
  viewportHeight: 1080,

  // Timeouts (increased for reliability)
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 60000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  execTimeout: 60000,
  taskTimeout: 60000,

  // Retries for flaky test prevention
  retries: {
    runMode: 2,      // Retry failed tests 2 times in CI
    openMode: 0      // No retries in interactive mode
  },

  // Video and screenshot settings - ONLY ON FAILURE
  video: isCI,                        // Record videos in CI to aid debugging
  videoUploadOnPasses: false,         // Only keep videos for failed runs
  screenshotOnRunFailure: true,      // Screenshot only when test fails
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',

  // Watchlist for file changes
  watchForFileChanges: true,

  // Number of tests to run in parallel (for run mode)
  numTestsKeptInMemory: 50,

  // Chrome preferences for better stability
  chromeWebSecurity: false, // Allow cross-origin requests

  // Environment variables (defaults - override in cypress.env.json or CLI)
  env: {
    // Credentials should be set via cypress.env.json or --env flag
    // STULLER_USERNAME: 'your-username',
    // STULLER_PASSWORD: 'your-password',
    
    // API Configuration
    API_BASE_URL: 'https://api.stuller.com',
    
    // Feature flags
    ENABLE_SCREENSHOTS: true,
    ENABLE_VIDEO: true,
    
    // Timeouts (can be overridden)
    ELEMENT_TIMEOUT: 15000,
    PAGE_LOAD_TIMEOUT: 30000
  },

  // Reporter configuration
  reporter: 'spec',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    toConsole: true
  }
});
