// @ts-check
import { expect } from "@playwright/test";
import { test } from "./fixtures";
import { fillObjectFormCreate } from "./helpers";

test.describe("Pruebas de Creación y Gestión de Objetos", () => {
  test("Crear un nuevo objeto exitosamente", async ({ authenticatedPage }) => {
    const newObject = {
      name: "Objeto de Prueba2",
      description: "Descripción del objeto de prueba",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };
    await authenticatedPage.waitForTimeout(2000);
    await authenticatedPage.goto("/disciplines");
    await expect(authenticatedPage).toHaveURL("/disciplines");

    await authenticatedPage.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(authenticatedPage, newObject);
    await authenticatedPage
      .getByRole("button", { name: "Crear", exact: true })
      .click();
    await authenticatedPage.waitForTimeout(2000);
    await expect(authenticatedPage).toHaveURL("/disciplines");
    await expect(authenticatedPage.getByText(newObject.name)).toBeVisible({
      timeout: 20000,
    });

    await authenticatedPage.goto("/disciplines");
    await expect(authenticatedPage).toHaveURL("/disciplines");
  });
});
