// @ts-check

import { test } from './fixtures';
import { expect } from '@playwright/test';

test.describe('Pruebas de Perfil', () => {
  
  test('Editar el perfil exitosamente sin imagen', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/disciplines');

    await authenticatedPage.goto('/profile');

    await expect(authenticatedPage).toHaveURL('/profile');

    await authenticatedPage.getByTestId('profile-firstname').fill('Nuevo Nombre');
    await authenticatedPage.getByTestId('profile-lastname').fill('Nuevo Apellido');
    await authenticatedPage.getByTestId('profile-username').fill('Nuevo Username');
    await authenticatedPage.getByTestId('profile-email').fill('NuevoEmail1@gmail.com');
    await authenticatedPage.getByTestId('profile-bio').fill('Nueva Biografia');

    await authenticatedPage.getByTestId('profile-submit').click();

    await authenticatedPage.waitForURL('/profile');

    await expect(authenticatedPage).toHaveURL('/profile');

    await expect(authenticatedPage.getByTestId('profile-firstname')).toHaveValue('Nuevo Nombre');
    await expect(authenticatedPage.getByTestId('profile-lastname')).toHaveValue('Nuevo Apellido');
    await expect(authenticatedPage.getByTestId('profile-username')).toHaveValue('Nuevo Username');
    await expect(authenticatedPage.getByTestId('profile-email')).toHaveValue('nuevoemail1@gmail.com');
    await expect(authenticatedPage.getByTestId('profile-bio')).toHaveValue('Nueva Biografia');
  });

  test('Editar el perfil exitosamente con imagen', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/disciplines');

    await authenticatedPage.goto('/profile');

    await expect(authenticatedPage).toHaveURL('/profile');

    const profileImageBefore = authenticatedPage.getByTestId('profile-image-src');
    const srcBefore = await profileImageBefore.getAttribute('src');

    await authenticatedPage.getByTestId('profile-firstname').fill('Nuevo Nombre2');
    await authenticatedPage.getByTestId('profile-lastname').fill('Nuevo Apellido2');
    await authenticatedPage.getByTestId('profile-username').fill('Nuevo Username2');
    await authenticatedPage.getByTestId('profile-email').fill('NuevoEmail2@gmail.com');
    await authenticatedPage.getByTestId('profile-bio').fill('Nueva Biografia2');
    await authenticatedPage.getByTestId('profile-image').setInputFiles('./public/images/er.jpg');

    await authenticatedPage.getByTestId('profile-submit').click();

    await authenticatedPage.waitForURL('/profile');

    await expect(authenticatedPage).toHaveURL('/profile');

    await expect(authenticatedPage.getByTestId('profile-firstname')).toHaveValue('Nuevo Nombre2');
    await expect(authenticatedPage.getByTestId('profile-lastname')).toHaveValue('Nuevo Apellido2');
    await expect(authenticatedPage.getByTestId('profile-username')).toHaveValue('Nuevo Username2');
    await expect(authenticatedPage.getByTestId('profile-email')).toHaveValue('nuevoemail2@gmail.com');
    await expect(authenticatedPage.getByTestId('profile-bio')).toHaveValue('Nueva Biografia2');
    
    const profileImageAfter = authenticatedPage.getByTestId('profile-image-src');
    await expect(profileImageAfter).toBeVisible();
    const srcAfter = await profileImageAfter.getAttribute('src');
    expect(srcAfter).not.toBe(srcBefore);
    expect(srcAfter).toMatch(/^https:\/\/localhost:443\/public\/images.*\.(jpg|jpeg|png|gif)$/);

    
  });
});
