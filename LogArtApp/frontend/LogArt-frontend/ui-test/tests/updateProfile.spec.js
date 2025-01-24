// @ts-check

import { expect, test } from "@playwright/test";

test.describe("Pruebas de Perfil", () => {
  test("Editar el perfil exitosamente sin imagen", async ({ page }) => {
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    await page.goto("/profile");

    await expect(page).toHaveURL("/profile");

    await page.getByTestId("profile-firstname").fill("Nuevo Nombre");
    await page.getByTestId("profile-lastname").fill("Nuevo Apellido");
    await page.getByTestId("profile-username").fill("Nuevo Username");
    await page.getByTestId("profile-email").fill("NuevoEmail1@gmail.com");
    await page.getByTestId("profile-bio").fill("Nueva Biografia");

    await page.getByTestId("profile-submit").click();

    await page.waitForURL("/profile");

    await expect(page).toHaveURL("/profile");

    await expect(page.getByTestId("profile-firstname")).toHaveValue(
      "Nuevo Nombre"
    );
    await expect(page.getByTestId("profile-lastname")).toHaveValue(
      "Nuevo Apellido"
    );
    await expect(page.getByTestId("profile-username")).toHaveValue(
      "Nuevo Username"
    );
    await expect(page.getByTestId("profile-email")).toHaveValue(
      "nuevoemail1@gmail.com"
    );
    await expect(page.getByTestId("profile-bio")).toHaveValue(
      "Nueva Biografia"
    );
  });

  test("Editar el perfil exitosamente con imagen", async ({ page }) => {
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    await page.goto("/profile");

    await expect(page).toHaveURL("/profile");

    const profileImageBefore = page.getByTestId("profile-image-src");
    const srcBefore = await profileImageBefore.getAttribute("src");

    await page.getByTestId("profile-firstname").fill("Nuevo Nombre2");
    await page.getByTestId("profile-lastname").fill("Nuevo Apellido2");
    await page.getByTestId("profile-username").fill("Nuevo Username2");
    await page.getByTestId("profile-email").fill("NuevoEmail2@gmail.com");
    await page.getByTestId("profile-bio").fill("Nueva Biografia2");
    await page
      .getByTestId("profile-image")
      .setInputFiles("./public/images/er.jpg");

    await page.getByTestId("profile-submit").click();

    await page.waitForURL("/profile");

    await expect(page).toHaveURL("/profile");

    await expect(page.getByTestId("profile-firstname")).toHaveValue(
      "Nuevo Nombre2"
    );
    await expect(page.getByTestId("profile-lastname")).toHaveValue(
      "Nuevo Apellido2"
    );
    await expect(page.getByTestId("profile-username")).toHaveValue(
      "Nuevo Username2"
    );
    await expect(page.getByTestId("profile-email")).toHaveValue(
      "nuevoemail2@gmail.com"
    );
    await expect(page.getByTestId("profile-bio")).toHaveValue(
      "Nueva Biografia2"
    );

    const profileImageAfter = page.getByTestId("profile-image-src");
    await expect(profileImageAfter).toBeVisible();
    const srcAfter = await profileImageAfter.getAttribute("src");
    expect(srcAfter).not.toBe(srcBefore);
    expect(srcAfter).toMatch(
      /^https:\/\/localhost:443\/public\/images.*\.(jpg|jpeg|png|gif)$/
    );
  });
});
