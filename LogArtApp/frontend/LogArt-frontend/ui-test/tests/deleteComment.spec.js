// @ts-check

import { comment } from "postcss";
import { expect, test } from "@playwright/test";

test.describe("Pruebas de Borrado de Comentarios", () => {
  test("Borrar un comentario exitosamente", async ({ page }) => {
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
      .fill("Comentario Para Borrar");

    await page.getByTestId("create-comment-button").click();

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });

    const comment = page.locator(`text=Comentario Para Borrar`);
    await expect(comment).toBeVisible();

    const commentContainer = comment.locator("xpath=..");
    await commentContainer.getByTestId("delete-comment-button").click();

    await page.waitForURL(/objects\/[0-9]+/);

    await expect(page).toHaveURL(/objects\/[0-9]+/);

    await expect(page.getByText("Comentario Para Borrar")).toHaveCount(0);
  });
});
