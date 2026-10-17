import { expect, test } from "@playwright/test";

test("homepage has the FormFuel document title and meta description", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("FormFuel | Free Fitness & Nutrition Tools");

  const description = page.locator('head meta[name="description"]');
  await expect(description).toHaveCount(1);
  await expect(description).toHaveAttribute(
    "content",
    "Discover FormFuel's vision for free fitness and nutrition tools, including workout plans, fitness calculators, and progress tracking.",
  );
});
