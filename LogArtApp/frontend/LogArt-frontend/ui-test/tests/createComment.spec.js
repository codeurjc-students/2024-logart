// @ts-check

import { test } from './fixtures';
import { expect } from '@playwright/test';

test.describe('Pruebas de Añadir Comentarios', () => {
  
  test('Crear un nuevo comentario exitosamente', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/disciplines');

    await authenticatedPage.getByRole('link', { name: 'Cien Años de Soledad' }).first().click();
    await authenticatedPage.waitForURL(/objects\/[0-9]+/);
    await expect(authenticatedPage.getByText('Cien Años de SoledadUna')).toBeVisible();

    await authenticatedPage.getByTestId('create-comment-textarea').fill('Comentario de Prueba');

    await authenticatedPage.getByTestId('create-comment-button').click();

    await authenticatedPage.waitForTimeout(2000);

    await expect(authenticatedPage.getByText('Comentario añadido')).toBeVisible();
  });
});