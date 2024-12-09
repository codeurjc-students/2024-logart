// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './ui-test/tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    ignoreHTTPSErrors: true,

    trace: 'on-first-retry',
  },
  

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

  ],
});

