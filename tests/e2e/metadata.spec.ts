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

  const verification = page.locator('head meta[name="google-site-verification"]');
  await expect(verification).toHaveCount(1);
  await expect(verification).toHaveAttribute(
    "content",
    "Pqe3iOhMcMEIxfPdxFP0sociuwzobgmZDVcUmLYnYrA",
  );
  // Check server-rendered HTML too: the tag must not depend on browser JavaScript.
  const response = await page.request.get("/");
  const head = (await response.text()).split("</head>")[0];
  expect(head).toContain(
    '<meta name="google-site-verification" content="Pqe3iOhMcMEIxfPdxFP0sociuwzobgmZDVcUmLYnYrA"',
  );
});
