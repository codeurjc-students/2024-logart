import { expect } from "@playwright/test";
import { test } from "./fixtures";
import environment from "../../environment";

test.describe("Pruebas de Login", () => {
  test("Inicio de sesión exitoso debería redirigir a la galería", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/login");

    await unauthenticatedPage
      .getByTestId("login-email")
      .fill(environment.userEmail2);
    await unauthenticatedPage
      .getByTestId("login-password")
      .fill(environment.userPassword2);
    await unauthenticatedPage
      .getByRole("button", { name: "Iniciar sesión" })
      .click();

    await expect(unauthenticatedPage).toHaveURL("/disciplines");
    await unauthenticatedPage
      .getByRole("button", { name: "Cerrar sesión" })
      .click();
  });

  test("Inicio de sesión fallido debería mostrar un mensaje de error y continuar con el login", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/login");

    await unauthenticatedPage
      .getByTestId("login-email")
      .fill(environment.userAdmin2Email);
    await unauthenticatedPage
      .getByTestId("login-password")
      .fill(environment.userAdmin2Password);
    await unauthenticatedPage
      .getByRole("button", { name: "Iniciar sesión" })
      .click();

    await expect(
      unauthenticatedPage.getByText("Invalid credentials")
    ).toBeVisible();
    await expect(unauthenticatedPage).toHaveURL("/login");
  });

  test("Inicio de sesión fallido debería mostrar un mensaje de que es necesario validar el email", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/login");

    await unauthenticatedPage
      .getByTestId("login-email")
      .fill(environment.userNotVerified);
    await unauthenticatedPage
      .getByTestId("login-password")
      .fill(environment.userPassword2);
    await unauthenticatedPage
      .getByRole("button", { name: "Iniciar sesión" })
      .click();

    await expect(
      unauthenticatedPage.getByText(
        "Please verify your email before logging in"
      )
    ).toBeVisible();
    await expect(unauthenticatedPage).toHaveURL("/login");
  });

  test("Inicio de sesión fallido debería mostrar un error de usuario no encontrado", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/login");

    await unauthenticatedPage
      .getByTestId("login-email")
      .fill(environment.userWrongEmail);
    await unauthenticatedPage
      .getByTestId("login-password")
      .fill(environment.userPassword2);
    await unauthenticatedPage
      .getByRole("button", { name: "Iniciar sesión" })
      .click();

    await expect(unauthenticatedPage.getByText("User not found")).toBeVisible();
    await expect(unauthenticatedPage).toHaveURL("/login");
  });
});
