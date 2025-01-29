// @ts-check

// import { expect } from "@playwright/test";
// import { test } from "./fixtures";

// test.describe("Pruebas de Perfil", () => {
//   test("Editar el perfil", async ({ authenticatedPage }) => {
//     await authenticatedPage.goto("/disciplines");
//     await expect(authenticatedPage).toHaveURL("/disciplines");

//     await authenticatedPage.goto("/profile");

//     await expect(authenticatedPage).toHaveURL("/profile");

//     await authenticatedPage
//       .getByTestId("profile-firstname")
//       .fill("Nuevo Nombre2");

//     await authenticatedPage.getByTestId("profile-submit").click();

//     await authenticatedPage.waitForURL("/profile");

//     await expect(authenticatedPage).toHaveURL("/profile");

//     await expect(
//       authenticatedPage.getByTestId("profile-firstname")
//     ).toHaveValue("Nuevo Nombre2");
//   });
// });
