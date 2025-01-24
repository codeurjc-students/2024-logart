// @ts-check

import { expect, test } from "@playwright/test";

test.describe("Pruebas de Visualización de Objetos", () => {
  test("Visualizar un objeto exitosamente", async ({ page }) => {
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    await page
      .getByRole("link", { name: "Cien Años de Soledad" })
      .first()
      .click();
    await page.waitForURL(/objects\/[0-9]+/);
    await expect(page.getByText("Cien Años de SoledadUna")).toBeVisible();
  });
});
