// // @ts-check
// import { expect } from "@playwright/test";
// import { test } from "./fixtures";
// import environment from "../../environment";

// test.use({
//   baseURL: "https://localhost:5173",
//   ignoreHTTPSErrors: true,
// });

// test.describe("Pruebas de Login", () => {
//   test("Inicio de sesión exitoso debería redirigir a la galería", async ({
//     unAuthenticatedPage,
//   }) => {
//     await unAuthenticatedPage.goto("/login");

//     await unAuthenticatedPage
//       .getByTestId("login-email")
//       .fill(environment.userEmail);
//     await unAuthenticatedPage
//       .getByTestId("login-password")
//       .fill(environment.userPassword);
//     await unAuthenticatedPage
//       .getByRole("button", { name: "Iniciar sesión" })
//       .click();

//     await expect(unAuthenticatedPage).toHaveURL("/disciplines");
//     await unAuthenticatedPage
//       .getByRole("button", { name: "Cerrar sesión" })
//       .click();
//   });

//   test("Inicio de sesión fallido debería mostrar un mensaje de error y continuar con el login", async ({
//     unAuthenticatedPage,
//   }) => {
//     await unAuthenticatedPage.goto("/login");

//     await unAuthenticatedPage
//       .getByTestId("login-email")
//       .fill(environment.userEmail);
//     await unAuthenticatedPage
//       .getByTestId("login-password")
//       .fill(environment.userWrongPassword);
//     await unAuthenticatedPage
//       .getByRole("button", { name: "Iniciar sesión" })
//       .click();

//     await expect(
//       unAuthenticatedPage.getByText("Invalid credentials")
//     ).toBeVisible();
//     await expect(unAuthenticatedPage).toHaveURL("/login");
//   });

//   test("Inicio de sesión fallido debería mostrar un mensaje de que es necesario validar el email", async ({
//     unAuthenticatedPage,
//   }) => {
//     await unAuthenticatedPage.goto("/login");

//     await unAuthenticatedPage
//       .getByTestId("login-email")
//       .fill(environment.userNotVerified);
//     await unAuthenticatedPage
//       .getByTestId("login-password")
//       .fill(environment.userPassword);
//     await unAuthenticatedPage
//       .getByRole("button", { name: "Iniciar sesión" })
//       .click();

//     await expect(
//       unAuthenticatedPage.getByText(
//         "Please verify your email before logging in"
//       )
//     ).toBeVisible();
//     await expect(unAuthenticatedPage).toHaveURL("/login");
//   });

//   test("Inicio de sesión fallido debería mostrar un error de usuario no encontrado", async ({
//     unAuthenticatedPage,
//   }) => {
//     await unAuthenticatedPage.goto("/login");

//     await unAuthenticatedPage
//       .getByTestId("login-email")
//       .fill(environment.userWrongEmail);
//     await unAuthenticatedPage
//       .getByTestId("login-password")
//       .fill(environment.userPassword);
//     await unAuthenticatedPage
//       .getByRole("button", { name: "Iniciar sesión" })
//       .click();

//     await expect(unAuthenticatedPage.getByText("User not found")).toBeVisible();
//     await expect(unAuthenticatedPage).toHaveURL("/login");
//   });
// });
