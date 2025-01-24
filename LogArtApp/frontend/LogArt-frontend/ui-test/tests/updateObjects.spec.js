// @ts-check

import { expect, test } from "@playwright/test";
import { fillObjectFormUpdate, fillObjectFormCreate } from "./helpers";

test.describe("Pruebas de Actualización de Objetos", () => {
  test("Actualizar un objeto exitosamente", async ({ page }) => {
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    const newObject = {
      name: "Objeto de Prueba5",
      description: "Descripción del objeto de prueba 5",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };

    await page.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(page, newObject);
    await page.getByRole("button", { name: "Crear", exact: true }).click();

    await expect(
      page.getByRole("link", { name: "Objeto de Prueba5" }).first()
    ).toBeVisible();

    await page.getByTestId("edit-object-button").first().click();

    const updatedObject = {
      name: "Objeto Actualizado 5",
      description: "Descripción del objeto actualizado",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };

    await fillObjectFormUpdate(page, updatedObject);
    await page.getByTestId("edit-object-submit").click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("/disciplines");
    await expect(page.getByText(updatedObject.name).first()).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await page.getByTestId("delete-object-button").first().click();

    await page.waitForURL("/disciplines");
  });

  test("Actualizar un objeto exitosamente, sin imagen", async ({ page }) => {
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    const newObject = {
      name: "Objeto de Prueba4",
      description: "Descripción del objeto de prueba 2",
      discipline: "Libros",
      imageUrl: "./public/images/bat1.png",
    };

    await page.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(page, newObject);
    await page.getByRole("button", { name: "Crear", exact: true }).click();

    await expect(
      page.getByRole("link", { name: "Objeto de Prueba4" }).first()
    ).toBeVisible();

    await page.getByTestId("edit-object-button").first().click();

    const updatedObject = {
      name: "Objeto Actualizado 4",
      description: "Descripción del objeto actualizado",
      discipline: "Libros",
    };

    await fillObjectFormUpdate(page, updatedObject);
    await page.getByTestId("edit-object-submit").click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("/disciplines");
    await expect(page.getByText(updatedObject.name).first()).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await page.getByTestId("delete-object-button").first().click();

    await page.waitForURL("/disciplines");
  });
});
