import { test, expect } from "@playwright/test";

test.describe("Main Site", () => {
  test("homepage loads successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("displays site header and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".nav-brand")).toBeVisible();
    await expect(page.locator(".nav-links")).toBeVisible();
  });

  test("has navigation links to SPAs", async ({ page }) => {
    await page.goto("/");
    const adminLink = page.locator('.nav-links a[href="/admin/"]');
    const portalLink = page.locator('.nav-links a[href="/portal/"]');
    await expect(adminLink).toBeVisible();
    await expect(portalLink).toBeVisible();
  });

  test("displays hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hero h1")).toHaveText("Multiapp Monorepo");
  });

  test("displays feature cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".feature-card");
    await expect(cards).toHaveCount(3);
  });

  test("visual regression - homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("main-site-homepage.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});
