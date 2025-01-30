import { expect } from "@playwright/test";
import { test } from "./fixtures";
import environment from "../../environment";

test.describe("Pruebas de Registro", () => {
  test("Registro exitoso debería redirigir al login", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/register");

    await unauthenticatedPage
      .getByTestId("register-userName")
      .fill(environment.userNewUserName);
    await unauthenticatedPage
      .getByTestId("register-firstName")
      .fill(environment.userNewFirstName);
    await unauthenticatedPage
      .getByTestId("register-lastName")
      .fill(environment.userNewLastName);
    await unauthenticatedPage
      .getByTestId("register-email")
      .fill(environment.userNewEmail);
    await unauthenticatedPage
      .getByTestId("register-password")
      .fill(environment.userPassword);
    await unauthenticatedPage
      .getByRole("button", { name: "Registrarse" })
      .click();

    await expect(unauthenticatedPage).toHaveURL("/login", { timeout: 10000 });
  });

  test("Registro fallido debería mostrar un mensaje de error y continuar con el registro", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/register");

    await unauthenticatedPage
      .getByTestId("register-email")
      .fill(environment.userUsedEmail);
    await unauthenticatedPage
      .getByTestId("register-password")
      .fill(environment.userPassword);
    await unauthenticatedPage
      .getByTestId("register-userName")
      .fill(environment.userNewUserName);
    await unauthenticatedPage
      .getByTestId("register-firstName")
      .fill(environment.userNewFirstName);
    await unauthenticatedPage
      .getByTestId("register-lastName")
      .fill(environment.userNewLastName);
    await unauthenticatedPage
      .getByRole("button", { name: "Registrarse" })
      .click();

    await expect(
      unauthenticatedPage.getByText("User already exists")
    ).toBeVisible();
    await expect(unauthenticatedPage).toHaveURL("/register");
  });
});
