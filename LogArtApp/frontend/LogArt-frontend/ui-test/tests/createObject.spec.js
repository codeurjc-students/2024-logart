// @ts-check
import { test } from './fixtures';
import { expect } from '@playwright/test';
import { fillObjectForm } from './helpers';
test.describe('Pruebas de Creación y Gestión de Objetos', () => {
  
  test('Crear un nuevo objeto exitosamente', async ({ authenticatedPage }) => {

    const newObject = {
      name: 'Objeto de Prueba7',
      description: 'Descripción del objeto de prueba',
      discipline: 'Libros',
      imageUrl: './public/images/er.jpg',
    };
    await expect(authenticatedPage).toHaveURL('/disciplines');

    await authenticatedPage.getByLabel('Crear nuevo objeto').click();
    await fillObjectForm(authenticatedPage, newObject);
    await authenticatedPage.getByRole('button', { name: 'Crear', exact: true }).click();

    await expect(authenticatedPage).toHaveURL('/disciplines');



    
  });

  
});
