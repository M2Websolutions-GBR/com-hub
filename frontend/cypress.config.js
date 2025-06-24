import { defineConfig } from 'cypress';

export default defineConfig({
  videosFolder: 'cypress/videos',
  viewportWidth: 1440,
  chromeWebSecurity: false, // Check if it breaks because of other dependencies, comment it in/out
  experimentalFetchPolyfill: true,
  waitForAnimations: true,
  includeShadowDom: true,
  // uncaught:exception: false // Check if needed later and comment it in/out
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:run', (details) => {
        console.log('Preparing for test...');
      });
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    baseUrl: 'http://localhost:5173',
  },
});
