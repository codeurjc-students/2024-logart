import { test as base } from '@playwright/test';

const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './storageState.json',
      ignoreHTTPSErrors: true,
      baseURL: 'https://localhost:5173'
    });
    const page = await context.newPage();
    await page.goto('/disciplines');
    await use(page);
    await context.close();
  },
});

export { test };
    
  