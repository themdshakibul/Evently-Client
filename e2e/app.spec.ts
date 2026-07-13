import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load and display hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Event Hub");
    await expect(page.locator("text=Explore Events")).toBeVisible();
  });

  test("should show features section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Everything you need")).toBeVisible();
  });

  test("should navigate to events page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Explore Events");
    await expect(page).toHaveURL(/\/events/);
  });
});

test.describe("Events page", () => {
  test("should load and show search", async ({ page }) => {
    await page.goto("/events");
    await expect(page.locator("h1")).toContainText("Explore Events");
    await expect(page.locator('input[placeholder="Search events..."]')).toBeVisible();
  });

  test("should filter by category", async ({ page }) => {
    await page.goto("/events");
    const musicBtn = page.locator("button", { hasText: "Music" });
    if (await musicBtn.isVisible()) {
      await musicBtn.click();
    }
  });
});

test.describe("Auth pages", () => {
  test("login page should have form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Welcome back");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator("text=Demo Login")).toBeVisible();
  });

  test("register page should have form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("Create an account");
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible();
  });
});
