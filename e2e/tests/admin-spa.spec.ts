import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Admin SPA", () => {
  test("loads successfully", async ({ page }) => {
    const response = await page.goto("/admin/");
    expect(response?.status()).toBe(200);
  });

  test("displays admin dashboard heading", async ({ page }) => {
    await page.goto("/admin/");
    await expect(page.locator("h1")).toHaveText("Admin Dashboard");
  });

  test("displays today's date", async ({ page }) => {
    await page.goto("/admin/");
    await expect(page.locator(".app-date")).toBeVisible();
  });

  test("displays stat cards on dashboard", async ({ page }) => {
    await page.goto("/admin/");
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("Active Projects")).toBeVisible();
    await expect(page.getByText("Monthly Revenue")).toBeVisible();
  });

  test("displays recent activity", async ({ page }) => {
    await page.goto("/admin/");
    await expect(page.getByText("Recent Activity")).toBeVisible();
  });

  test("navigates to users page", async ({ page }) => {
    await page.goto("/admin/");
    await page.getByRole("link", { name: "Users" }).click();
    await expect(page.locator("h1")).toHaveText("Users");
    await expect(page.getByText("Alice Johnson")).toBeVisible();
  });

  test("navigates to projects page", async ({ page }) => {
    await page.goto("/admin/");
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page.locator("h1")).toHaveText("Projects");
    await expect(page.getByText("Website Redesign")).toBeVisible();
  });

  test("navigates to settings page", async ({ page }) => {
    await page.goto("/admin/");
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page.locator("h1")).toHaveText("Settings");
  });

  test("has no accessibility violations", async ({ page }) => {
    await page.goto("/admin/");
    await page.locator("h1").waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("visual regression - admin dashboard", async ({ page }) => {
    await page.goto("/admin/");
    await expect(page).toHaveScreenshot("admin-spa-dashboard.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});
