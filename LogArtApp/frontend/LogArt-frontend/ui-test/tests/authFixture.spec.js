// @ts-check
import { test, expect } from '@playwright/test';
import environment from '../../environment';
test.use({

  baseURL: 'https://localhost:5173',
  ignoreHTTPSErrors: true
});

test('Generar storageState después de iniciar sesión', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('login-email').fill(environment.userEmail);
  await page.getByTestId('login-password').fill(environment.userPassword);

  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL('/disciplines');

  await page.context().storageState({ path: 'storageState.json' });
});
