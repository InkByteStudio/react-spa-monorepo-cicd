import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Portal SPA", () => {
  test("loads successfully", async ({ page }) => {
    const response = await page.goto("/portal/");
    expect(response?.status()).toBe(200);
  });

  test("displays dashboard heading", async ({ page }) => {
    await page.goto("/portal/");
    await expect(page.locator("h1")).toHaveText("Dashboard");
  });

  test("displays stat cards on dashboard", async ({ page }) => {
    await page.goto("/portal/");
    await expect(page.getByText("Active Projects")).toBeVisible();
    await expect(page.getByText("Tasks Completed")).toBeVisible();
    await expect(page.getByText("Open Tickets")).toBeVisible();
  });

  test("navigates to projects page", async ({ page }) => {
    await page.goto("/portal/");
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page.locator("h1")).toHaveText("Projects");
    await expect(page.getByText("Website Redesign")).toBeVisible();
  });

  test("navigates to billing page", async ({ page }) => {
    await page.goto("/portal/");
    await page.getByRole("link", { name: "Billing" }).click();
    await expect(page.locator("h1")).toHaveText("Billing");
  });

  test("navigates to support page with contact form", async ({ page }) => {
    await page.goto("/portal/");
    await page.getByRole("link", { name: "Support" }).click();
    await expect(page.locator("h1")).toHaveText("Support");
    const button = page.getByRole("button", { name: "Send Message" });
    await expect(button).toBeVisible();
  });

  test("navigates to account page", async ({ page }) => {
    await page.goto("/portal/");
    await page.getByRole("link", { name: "Account" }).click();
    await expect(page.locator("h1")).toHaveText("Account Settings");
  });

  test("has no accessibility violations", async ({ page }) => {
    await page.goto("/portal/");
    await page.locator("h1").waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("visual regression - portal dashboard", async ({ page }) => {
    await page.goto("/portal/");
    await expect(page).toHaveScreenshot("portal-spa-dashboard.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});
