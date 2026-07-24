import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("blog listing renders and is accessible", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test("published blog article renders and is accessible when content exists", async ({ page }) => {
  await page.goto("/blog");
  const firstArticle = page.locator('[data-slot="blog-card-link"]').first();
  if (await firstArticle.count() === 0) test.skip(true, "No published Builder blog entries exist");
  await firstArticle.click();
  await expect(page.locator('[data-slot="blog-article-title"]')).toBeVisible();
  await expect(page.locator('[data-slot="blog-article-body"]')).toBeVisible();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test("blog article does not render Builder experiment JavaScript as text", async ({ page }) => {
  await page.goto("/blog/complete-deck-all-systems-profile");
  await expect(page.locator('[data-slot="blog-article-title"]')).toBeVisible();
  await expect(page.locator("body")).not.toContainText("window.builderIoAbTest = function");
});
