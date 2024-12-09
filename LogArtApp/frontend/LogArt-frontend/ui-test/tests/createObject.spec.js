// @ts-check
import { test } from './fixtures';
import { expect } from '@playwright/test';
import { fillObjectFormCreate } from './helpers';
test.describe('Pruebas de Creación y Gestión de Objetos', () => {
  
  test('Crear un nuevo objeto exitosamente', async ({ authenticatedPage }) => {

    const newObject = {
      name: 'Objeto de Prueba2',
      description: 'Descripción del objeto de prueba',
      discipline: 'Libros',
      imageUrl: './public/images/er.jpg',
    };
    await expect(authenticatedPage).toHaveURL('/disciplines');

    await authenticatedPage.getByLabel('Crear nuevo objeto').click();
    await fillObjectFormCreate(authenticatedPage, newObject);
    await authenticatedPage.getByRole('button', { name: 'Crear', exact: true }).click();
    await authenticatedPage.waitForTimeout(2000);
    await expect(authenticatedPage).toHaveURL('/disciplines');
    await expect(authenticatedPage.getByText(newObject.name)).toBeVisible();



    
  });

  
});
