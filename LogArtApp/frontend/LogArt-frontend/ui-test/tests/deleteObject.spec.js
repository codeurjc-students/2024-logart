// @ts-check

import { expect, test } from "@playwright/test";
import { fillObjectFormUpdate, fillObjectFormCreate } from "./helpers";

test.describe("Pruebas de Borrado de Objetos", () => {
  test("Borrar un objeto exitosamente", async ({ page }) => {
    await page.goto("/disciplines");

    const newObject = {
      name: "Objeto de Prueba3",
      description: "Descripción del objeto de prueba 3",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };

    await page.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(page, newObject);
    await page.getByRole("button", { name: "Crear", exact: true }).click();

    await expect(
      page.getByRole("link", { name: "Objeto de Prueba3" }).first()
    ).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await page.getByTestId("delete-object-button").first().click();

    await page.waitForURL("/disciplines");

    await expect(page).toHaveURL("/disciplines");

    await expect(
      page.getByRole("link", { name: "Objeto de Prueba3" })
    ).toHaveCount(0);
  });
});
