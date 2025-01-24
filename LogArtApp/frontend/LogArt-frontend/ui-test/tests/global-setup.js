// ui-test/tests/global-setup.js
import { chromium } from "@playwright/test";
import environment from "../../environment.js";

export default async function globalSetup(config) {
  const browser = await chromium.launch({
    ignoreHTTPSErrors: true,
    headless: false,
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  await page.goto("https://localhost:5173/login");

  await page.getByTestId("login-email").fill(environment.userEmail);
  await page.getByTestId("login-password").fill(environment.userPassword);

  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  await page.waitForURL("https://localhost:5173/disciplines", {
    timeout: 60000,
  });

  await context.storageState({ path: "./ui-test/tests/storageState.json" });

  await browser.close();
}
