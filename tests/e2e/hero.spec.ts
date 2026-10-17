import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero presents the FormFuel vision and categories", async ({ page }) => {
  const hero = page.getByRole("region", { name: "TRAIN SMARTER. FUEL BETTER. STAY FREE.", exact: true });
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText("TRAIN SMARTER. FUEL BETTER. STAY FREE.");
  await expect(hero.getByText("STAY FREE.", { exact: true })).toHaveCSS("color", "rgb(199, 255, 66)");
  await expect(hero.getByText("YOUR FITNESS. NO PAYWALLS.", { exact: true })).toBeVisible();
  await expect(hero.getByText("Your all-in-one fitness platform for smarter workouts, better nutrition, and meaningful progress. Built to make fitness accessible to everyone.", { exact: true })).toBeVisible();
  const categories = page.getByRole("list", { name: "Fitness categories" });
  await expect(categories.getByRole("listitem")).toHaveCount(3);
  for (const category of ["Workouts", "Nutrition", "Progress"]) {
    await expect(categories.getByText(category, { exact: false })).toBeVisible();
  }
  await expect(categories.getByRole("link")).toHaveCount(0);
  await expect(page.getByText(/These tools aren't available yet/)).toBeVisible();
});

for (const [label, hash, destination] of [
  ["Explore Our Vision", "#our-vision", "Our vision"],
  ["See What's Coming", "#whats-coming", "What's coming"],
] as const) {
  test(`${label} works as a keyboard-accessible in-page link`, async ({ page }) => {
    const link = page.getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", hash);
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    const target = page.getByRole("region", { name: destination, exact: true });
    await expect(target).toBeInViewport();
    await expect(target).toBeFocused();
    await expect(target.getByRole("heading", { name: destination, exact: true })).toBeVisible();
  });
}

test("hero remains readable and within the viewport", async ({ page, isMobile }, testInfo) => {
  for (const width of isMobile ? [320, 375, 390, 768] : [1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )).toBeLessThanOrEqual(0);
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    const box = await heading.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    // Ignored artifacts for visual review, without brittle screenshot baselines.
    await page.screenshot({ path: testInfo.outputPath(`hero-${width}.png`), fullPage: true });
  }
});

test("hero anchors work with reduced motion enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("link", { name: "See What's Coming", exact: true }).click();
  await expect(page.getByRole("region", { name: "What's coming", exact: true })).toBeInViewport();
});
