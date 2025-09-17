import { expect, test } from "@playwright/test";

test.describe("Website E2E Tests", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Website/);
  });

  test("should navigate to different pages", async ({ page }) => {
    await page.goto("/");

    // Test navigation
    const aboutLink = page.getByRole("link", { name: /about/i });
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page.url()).toContain("/about");
    }
  });
});
