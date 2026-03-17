import { test, expect } from "@playwright/test";

test.describe("Cross-App Navigation", () => {
  test("navigate from main site to admin SPA", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/admin/"]');
    await expect(page.locator("h1")).toHaveText("Admin Dashboard");
  });

  test("navigate from main site to portal SPA", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/portal/"]');
    await expect(page.locator("h1")).toHaveText("Dashboard");
  });

  test("all three apps are accessible", async ({ page }) => {
    // Main site
    let response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // Admin SPA
    response = await page.goto("/admin/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Admin Dashboard");

    // Portal SPA
    response = await page.goto("/portal/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Dashboard");
  });
});
