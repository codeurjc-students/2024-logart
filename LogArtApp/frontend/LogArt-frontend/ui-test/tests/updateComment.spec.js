// @ts-check

import { expect, test } from "@playwright/test";

test.describe("Pruebas de Editar Comentarios", () => {
  test("Editar un comentario exitosamente", async ({ page }) => {
    await page.goto("/disciplines");
    await expect(page).toHaveURL("/disciplines");

    await page
      .getByRole("link", { name: "Cien Años de Soledad" })
      .first()
      .click();
    await page.waitForURL(/objects\/[0-9]+/);
    await expect(page.getByText("Cien Años de SoledadUna")).toBeVisible();

    await page.getByTestId("edit-comment-button").first().click();

    await page.getByTestId("edit-comment-textarea").fill("Comentario Editado");

    await page.getByTestId("edit-comment-button-save").click();

    await page.waitForTimeout(2000);

    await expect(page.getByText("Comentario editado").first()).toBeVisible();
  });
});
