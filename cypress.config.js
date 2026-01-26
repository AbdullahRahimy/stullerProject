const { defineConfig } = require('cypress');

const isCI = process.env.CI === 'true' || process.env.CI === '1';

module.exports = defineConfig({
  projectId: 'stuller-cypress-assessment',

  e2e: {
    baseUrl: 'https://www.stuller.com',

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    supportFile: 'cypress/support/e2e.js',

    fixturesFolder: 'cypress/fixtures',

    setupNodeEvents(on, config) {
      on('before:run', (details) => {
        console.log('Starting test run:', details.specs?.length || 0, 'specs');
      });

      // Log when test completes
      on('after:run', (results) => {
        console.log('Test run complete. Passed:', results.totalPassed, 'Failed:', results.totalFailed);
      });

      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },
    // Enable experimental run all specs feature for faster runs
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
    runMode: 2,      
    openMode: 0      
  },

  // Video and screenshot settings - ONLY ON FAILURE
  video: isCI,                        
  videoUploadOnPasses: false,       
  screenshotOnRunFailure: true,      
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',

  // Watch for file changes in interactive mode
  watchForFileChanges: true,

  // Number of tests to run in parallel (for run mode)
  numTestsKeptInMemory: 50,

  // Chrome preferences for better stability
  chromeWebSecurity: false,

  // Environment variables (defaults - override in cypress.env.json or CLI)
  env: {
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
