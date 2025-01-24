// @ts-check

import { expect } from "@playwright/test";
import { test } from "./fixtures";

test.describe("Pruebas de Editar Comentarios", () => {
  test("Editar un comentario exitosamente", async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(4000);
    await authenticatedPage.goto("/disciplines");
    await expect(authenticatedPage).toHaveURL("/disciplines");

    await authenticatedPage
      .getByRole("link", { name: "Cien Años de Soledad" })
      .first()
      .click();
    await authenticatedPage.waitForURL(/objects\/[0-9]+/);
    await expect(
      authenticatedPage.getByText("Cien Años de SoledadUna")
    ).toBeVisible();

    await authenticatedPage.getByTestId("edit-comment-button").first().click();

    await authenticatedPage
      .getByTestId("edit-comment-textarea")
      .fill("Comentario Editado");

    await authenticatedPage.getByTestId("edit-comment-button-save").click();

    await expect(
      authenticatedPage.getByText("Comentario editado").first()
    ).toBeVisible();
  });
});
