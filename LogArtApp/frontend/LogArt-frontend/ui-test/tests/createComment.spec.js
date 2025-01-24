// @ts-check

import { expect, test } from "@playwright/test";

test.describe("Pruebas de Añadir Comentarios", () => {
  test("Crear un nuevo comentario exitosamente", async ({ page }) => {
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    await page
      .getByRole("link", { name: "Cien Años de Soledad" })
      .first()
      .click();
    await page.waitForURL(/objects\/[0-9]+/);
    await expect(page.getByText("Cien Años de SoledadUna")).toBeVisible();

    await page
      .getByTestId("create-comment-textarea")
      .fill("Comentario de Prueba");

    await page.getByTestId("create-comment-button").click();

    await page.waitForTimeout(2000);

    await expect(page.getByText("Comentario añadido")).toBeVisible();

    await page.goto("https://localhost:5173/disciplines");
  });
});
