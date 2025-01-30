// ui-test/tests/fixtures.js
import { test as base } from "@playwright/test";

export const test = base.extend({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      storageState: "./ui-test/tests/storageState.json",
    });
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },

  unauthenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
    });
    await use(context);
    await context.close();
  },

  unauthenticatedPage: async ({ unauthenticatedContext }, use) => {
    const page = await unauthenticatedContext.newPage();
    await use(page);
    await page.close();
  },
});
