// @ts-check
import { test, expect } from "@playwright/test";
import { fillObjectFormCreate } from "./helpers";

test.describe("Pruebas de Creación y Gestión de Objetos", () => {
  test("Crear un nuevo objeto exitosamente", async ({ page }) => {
    const newObject = {
      name: "Objeto de Prueba2",
      description: "Descripción del objeto de prueba",
      discipline: "Libros",
      imageUrl: "./public/images/er.jpg",
    };
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    await page.getByLabel("Crear nuevo objeto").click();
    await fillObjectFormCreate(page, newObject);
    await page.getByRole("button", { name: "Crear", exact: true }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("/disciplines");
    await expect(page.getByText(newObject.name)).toBeVisible();

    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");
  });
});
