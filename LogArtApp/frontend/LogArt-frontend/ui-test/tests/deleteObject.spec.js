// @ts-check

import { expect } from "@playwright/test";
import { test } from "./fixtures";
import { fillObjectFormUpdate, fillObjectFormCreate } from "./helpers";

test.describe("Pruebas de Borrado de Objetos", () => {
  test("Borrar un objeto exitosamente", async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(10000);
    await authenticatedPage.goto("/disciplines");

    const newObject = {
      name: "Objeto de Prueba3",
      description: "Descripción del objeto de prueba 3",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };

    await authenticatedPage.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(authenticatedPage, newObject);
    await authenticatedPage
      .getByRole("button", { name: "Crear", exact: true })
      .click();

    await expect(
      authenticatedPage.getByRole("link", { name: "Objeto de Prueba3" }).first()
    ).toBeVisible({ timeout: 15000 });

    authenticatedPage.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });

    await authenticatedPage
      .getByText("Objeto de Prueba3Descripción")
      .getByTestId("delete-object-button")
      .click();

    await authenticatedPage.waitForURL("/disciplines");

    await expect(authenticatedPage).toHaveURL("/disciplines");

    await expect(
      authenticatedPage.getByRole("link", { name: "Objeto de Prueba3" })
    ).toHaveCount(0);
  });
});
