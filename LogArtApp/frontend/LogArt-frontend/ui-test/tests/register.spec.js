// @ts-check
import { test, expect } from '@playwright/test';
import environment from '../../environment';

test.use({
  baseURL: 'https://localhost:5173',
  ignoreHTTPSErrors: true
});

test.describe('Pruebas de Registro', () => {

  test('Registro exitoso debería redirigir al login' , async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('register-userName').fill(environment.userNewUserName);
    await page.getByTestId('register-firstName').fill(environment.userNewFirstName);
    await page.getByTestId('register-lastName').fill(environment.userNewLastName);
    await page.getByTestId('register-email').fill(environment.userNewEmail);
    await page.getByTestId('register-password').fill(environment.userPassword);
    await page.getByRole('button', { name: 'Registrarse' }).click();

    await expect(page).toHaveURL('/login');
  });

  test('Registro fallido debería mostrar un mensaje de error y continuar con el registro' , async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('register-email').fill(environment.userEmail);
    await page.getByTestId('register-password').fill(environment.userPassword);
    await page.getByTestId('register-userName').fill(environment.userNewUserName);
    await page.getByTestId('register-firstName').fill(environment.userNewFirstName);
    await page.getByTestId('register-lastName').fill(environment.userNewLastName);
    await page.getByRole('button', { name: 'Registrarse' }).click();
    

    await expect(page.getByText('User already exists')).toBeVisible();
    await expect(page).toHaveURL('/register');
  });

});