// @ts-check

import { test } from './fixtures';
import { expect } from '@playwright/test';
import { fillObjectFormUpdate, fillObjectFormCreate } from './helpers';

test.describe('Pruebas de Actualización de Objetos', () => {
  
  test('Actualizar un objeto exitosamente', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/disciplines');

    await expect(authenticatedPage.getByRole('link', { name: 'Cien Años de Soledad' }).first()).toBeVisible();
    
    await authenticatedPage.getByTestId('edit-object-button').first().click();

    const updatedObject = {
      name: 'Objeto Actualizado',
      description: 'Descripción del objeto actualizado',
      discipline: 'Libros',
      imageUrl: './public/images/er.jpg',
    };

    await fillObjectFormUpdate(authenticatedPage, updatedObject);
    await authenticatedPage.getByTestId('edit-object-submit').click();
    await authenticatedPage.waitForTimeout(2000);
    await expect(authenticatedPage).toHaveURL('/disciplines');
    await expect(authenticatedPage.getByText(updatedObject.name).first()).toBeVisible();
  });

  test('Actualizar un objeto exitosamente, sin imagen', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/disciplines');

    const newObject = {
      name: 'Objeto de Prueba2',
      description: 'Descripción del objeto de prueba 2',
      discipline: 'Libros',
      imageUrl: './public/images/er.jpg',
    };

    await authenticatedPage.getByLabel('Crear nuevo objeto').click();
    await fillObjectFormCreate(authenticatedPage, newObject);
    await authenticatedPage.getByRole('button', { name: 'Crear', exact: true }).click();

    await expect(authenticatedPage.getByRole('link', { name: 'Objeto de Prueba2' }).first()).toBeVisible();
    
    await authenticatedPage.getByTestId('edit-object-button').first().click();

    const updatedObject = {
      name: 'Objeto Actualizado 2',
      description: 'Descripción del objeto actualizado',
      discipline: 'Libros'
    };

    await fillObjectFormUpdate(authenticatedPage, updatedObject);
    await authenticatedPage.getByTestId('edit-object-submit').click();
    await authenticatedPage.waitForTimeout(2000);    
    await expect(authenticatedPage).toHaveURL('/disciplines');
    await expect(authenticatedPage.getByText(updatedObject.name).first()).toBeVisible();
  });

});