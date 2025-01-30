// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./ui-test/tests",
  fullyParallel: true,
  reporter: "html",
  workers: 2,
  retries: 1,
  timeout: 120000,
  use: {
    ignoreHTTPSErrors: true,
    baseURL: "https://localhost:5173",
    trace: "on",
  },
  globalSetup: "./ui-test/tests/global-setup.js",

  webServer: {
    command: "npm run dev",
    url: "https://localhost:5173/login",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
