// @ts-check
import { test, expect } from '@playwright/test';
import environment from '../../environment';

test.use({
  baseURL: 'https://localhost:5173',
  ignoreHTTPSErrors: true
});

test.describe('Pruebas de Login', () => {

  test('Inicio de sesión exitoso debería redirigir a la galería' , async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill(environment.userEmail);
    await page.getByTestId('login-password').fill(environment.userPassword);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    await expect(page).toHaveURL('/disciplines');
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  });

  test('Inicio de sesión fallido debería mostrar un mensaje de error y continuar con el login' , async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill(environment.userEmail);
    await page.getByTestId('login-password').fill(environment.userWrongPassword);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login');
  }); 

  test('Inicio de sesión fallido debería mostrar un mensaje de que es necesario validar el email' , async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill(environment.userNotVerified);
    await page.getByTestId('login-password').fill(environment.userPassword);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    await expect(page.getByText('Please verify your email before logging in')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('Inicio de sesión fallido debería mostrar un error de usuario no encontrado' , async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill(environment.userWrongEmail);
    await page.getByTestId('login-password').fill(environment.userPassword);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    await expect(page.getByText('User not found')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
    
});