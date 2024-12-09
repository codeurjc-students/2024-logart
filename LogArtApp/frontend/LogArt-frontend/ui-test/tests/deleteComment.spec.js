// @ts-check

import { comment } from 'postcss';
import { test } from './fixtures';
import { expect } from '@playwright/test';

test.describe('Pruebas de Borrado de Comentarios', () => {
  
  test('Borrar un comentario exitosamente', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/disciplines');

    await authenticatedPage.getByRole('link', { name: 'Cien Años de Soledad' }).first().click();
    await authenticatedPage.waitForURL(/objects\/[0-9]+/);
    await expect(authenticatedPage.getByText('Cien Años de SoledadUna')).toBeVisible();

    await authenticatedPage.getByTestId('create-comment-textarea').fill('Comentario Para Borrar');

    await authenticatedPage.getByTestId('create-comment-button').click();

    authenticatedPage.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    
    const comment = authenticatedPage.locator(`text=Comentario Para Borrar`);
    await expect(comment).toBeVisible();

    const commentContainer = comment.locator('xpath=..');
    await commentContainer.getByTestId('delete-comment-button').click();

    await authenticatedPage.waitForURL(/objects\/[0-9]+/);

    await expect(authenticatedPage).toHaveURL(/objects\/[0-9]+/);

    await expect(authenticatedPage.getByText('Comentario Para Borrar')).toHaveCount(0);
  });
});