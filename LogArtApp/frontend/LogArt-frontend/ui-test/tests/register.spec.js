// // @ts-check
// import { expect } from "@playwright/test";
// import { test } from "./fixtures";
// import environment from "../../environment";

// test.use({
//   baseURL: "https://localhost:5173",
//   ignoreHTTPSErrors: true,
// });

// test.describe("Pruebas de Registro", () => {
//   test("Registro exitoso debería redirigir al login", async ({
//     unAuthenticatedPage,
//   }) => {
//     await unAuthenticatedPage.goto("/register");

//     await unAuthenticatedPage
//       .getByTestId("register-userName")
//       .fill(environment.userNewUserName);
//     await unAuthenticatedPage
//       .getByTestId("register-firstName")
//       .fill(environment.userNewFirstName);
//     await unAuthenticatedPage
//       .getByTestId("register-lastName")
//       .fill(environment.userNewLastName);
//     await unAuthenticatedPage
//       .getByTestId("register-email")
//       .fill(environment.userNewEmail);
//     await unAuthenticatedPage
//       .getByTestId("register-password")
//       .fill(environment.userPassword);
//     await unAuthenticatedPage
//       .getByRole("button", { name: "Registrarse" })
//       .click();

//     await expect(unAuthenticatedPage).toHaveURL("/login");
//   });

//   test("Registro fallido debería mostrar un mensaje de error y continuar con el registro", async ({
//     unAuthenticatedPage,
//   }) => {
//     await unAuthenticatedPage.goto("/register");

//     await unAuthenticatedPage
//       .getByTestId("register-email")
//       .fill(environment.userEmail);
//     await unAuthenticatedPage
//       .getByTestId("register-password")
//       .fill(environment.userPassword);
//     await unAuthenticatedPage
//       .getByTestId("register-userName")
//       .fill(environment.userNewUserName);
//     await unAuthenticatedPage
//       .getByTestId("register-firstName")
//       .fill(environment.userNewFirstName);
//     await unAuthenticatedPage
//       .getByTestId("register-lastName")
//       .fill(environment.userNewLastName);
//     await unAuthenticatedPage
//       .getByRole("button", { name: "Registrarse" })
//       .click();

//     await expect(
//       unAuthenticatedPage.getByText("User already exists")
//     ).toBeVisible();
//     await expect(unAuthenticatedPage).toHaveURL("/register");
//   });
// });
