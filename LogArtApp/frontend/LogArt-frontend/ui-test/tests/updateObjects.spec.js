// @ts-check

import { expect } from "@playwright/test";
import { test } from "./fixtures";
import { fillObjectFormUpdate, fillObjectFormCreate } from "./helpers";

test.describe("Pruebas de Actualización de Objetos", () => {
  test("Actualizar un objeto exitosamente", async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(4000);
    await authenticatedPage.goto("/disciplines");
    await expect(authenticatedPage).toHaveURL("/disciplines");
    await authenticatedPage.waitForTimeout(2000);

    const newObject = {
      name: "Objeto de Prueba5",
      description: "Descripción del objeto de prueba 5",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };

    await authenticatedPage.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(authenticatedPage, newObject);
    await authenticatedPage
      .getByRole("button", { name: "Crear", exact: true })
      .click();

    await expect(
      authenticatedPage.getByRole("link", { name: "Objeto de Prueba5" }).first()
    ).toBeVisible({ timeout: 10000 });

    await authenticatedPage.getByTestId("edit-object-button").first().click();

    const updatedObject = {
      name: "Objeto Actualizado 5",
      description: "Descripción del objeto actualizado",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };

    await fillObjectFormUpdate(authenticatedPage, updatedObject);
    await authenticatedPage.getByTestId("edit-object-submit").click();
    await authenticatedPage.waitForTimeout(7000);
    await expect(authenticatedPage).toHaveURL("/disciplines");
    await expect(
      authenticatedPage.getByText(updatedObject.name).first()
    ).toBeVisible({ timeout: 10000 });

    authenticatedPage.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await authenticatedPage.getByTestId("delete-object-button").first().click();

    await authenticatedPage.waitForURL("/disciplines");
  });

  test("Actualizar un objeto exitosamente, sin imagen", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.waitForTimeout(6000);
    await authenticatedPage.goto("/disciplines");
    await expect(authenticatedPage).toHaveURL("/disciplines");
    await authenticatedPage.waitForTimeout(2000);

    const newObject = {
      name: "Objeto de Prueba4",
      description: "Descripción del objeto de prueba 2",
      discipline: "Libros",
      imageUrl: "./public/images/bat1.png",
    };

    await authenticatedPage.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(authenticatedPage, newObject);
    await authenticatedPage
      .getByRole("button", { name: "Crear", exact: true })
      .click();

    await expect(
      authenticatedPage.getByRole("link", { name: "Objeto de Prueba4" }).first()
    ).toBeVisible({ timeout: 10000 });

    await authenticatedPage.getByTestId("edit-object-button").first().click();

    const updatedObject = {
      name: "Objeto Actualizado 4",
      description: "Descripción del objeto actualizado",
      discipline: "Libros",
    };

    await fillObjectFormUpdate(authenticatedPage, updatedObject);
    await authenticatedPage.getByTestId("edit-object-submit").click();
    await authenticatedPage.waitForTimeout(2000);
    await expect(authenticatedPage).toHaveURL("/disciplines");
    await expect(
      authenticatedPage.getByText(updatedObject.name).first()
    ).toBeVisible({ timeout: 10000 });

    authenticatedPage.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await authenticatedPage.getByTestId("delete-object-button").first().click();

    await authenticatedPage.waitForURL("/disciplines");
  });
});
