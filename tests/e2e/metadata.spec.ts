import { expect, test } from "@playwright/test";

test("homepage has the VAJRYA document title and meta description", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("VAJRYA | Free Fitness & Nutrition Tools");

  const description = page.locator('head meta[name="description"]');
  await expect(description).toHaveCount(1);
  await expect(description).toHaveAttribute(
    "content",
    "Discover VAJRYA's vision for free fitness and nutrition tools, including workout plans, fitness calculators, and progress tracking.",
  );
});
