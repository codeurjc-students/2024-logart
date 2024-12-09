// @ts-check

import { test } from './fixtures';
import { expect } from '@playwright/test';

test.describe('Pruebas de Borrado de Objetos', () => {
  
  test('Borrar un objeto exitosamente', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/disciplines');


    await expect(authenticatedPage.getByRole('link', { name: 'Cien Años de Soledad' }).first()).toBeVisible();

    
    authenticatedPage.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    await authenticatedPage.getByTestId('delete-object-button').first().click();

    await authenticatedPage.waitForURL('/disciplines');

    await expect(authenticatedPage).toHaveURL('/disciplines');

    await expect(authenticatedPage.getByRole('link', { name: 'Cien Años de Soledad' })).toHaveCount(0);
  });
});
