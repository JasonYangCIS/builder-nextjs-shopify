import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page is accessible and renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test("collection page lists products", async ({ page }) => {
  await page.goto("/collections/all");
  await expect(page.locator("h1")).toBeVisible();
});
