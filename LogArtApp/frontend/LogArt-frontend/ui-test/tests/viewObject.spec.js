// @ts-check

import { expect } from "@playwright/test";
import { test } from "./fixtures";

test.describe("Pruebas de Visualización de Objetos", () => {
  test("Visualizar un objeto exitosamente", async ({ authenticatedPage }) => {
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
  });
});
