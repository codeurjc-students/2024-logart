// @ts-check

import { expect } from "@playwright/test";
import { test } from "./fixtures";

test.describe("Pruebas de Añadir Comentarios", () => {
  test("Crear un nuevo comentario exitosamente", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.waitForTimeout(2000);
    await authenticatedPage.goto("/disciplines");
    await await expect(authenticatedPage).toHaveURL("/disciplines");

    await authenticatedPage
      .getByRole("link", { name: "Cien Años de Soledad" })
      .first()
      .click();
    await authenticatedPage.waitForURL(/objects\/[0-9]+/);
    await expect(
      authenticatedPage.getByText("Cien Años de SoledadUna")
    ).toBeVisible();

    await authenticatedPage
      .getByTestId("create-comment-textarea")
      .fill("Comentario de Prueba");

    await authenticatedPage.getByTestId("create-comment-button").click();

    await authenticatedPage.waitForTimeout(2000);

    await expect(
      authenticatedPage.getByText("Comentario añadido")
    ).toBeVisible();

    await authenticatedPage.goto("https://localhost:5173/disciplines");
  });
});
