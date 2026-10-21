import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("footer presents the brand, mission, and copyright", async ({ page }) => {
  const footer = page.getByRole("contentinfo");
  await expect(footer).toHaveCount(1);
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport();
  for (const text of [
    "VAJRYA",
    "Train smarter. Fuel better. Stay free.",
    "Making fitness and nutrition accessible to everyone.",
    "© 2026 VAJRYA. All rights reserved.",
    "Free at the core.",
  ]) {
    await expect(footer.getByText(text, { exact: true })).toBeVisible();
  }
});

test("footer tools link to implemented features without obsolete placeholders", async ({ page }) => {
  const footer = page.getByRole("contentinfo");
  const list = footer.getByRole("list", { name: "Tools", exact: true });
  await expect(footer.getByText("Coming Soon", { exact: true })).toHaveCount(0);
  for (const [label, href] of [["Workout Plans", "/workout-planner"], ["Nutrition Tracking", "/nutrition-tracker"], ["Progress Tracking", "/progress-tracker"]]) {
    const link = list.getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", href);
    await link.click(); await expect(page).toHaveURL(new RegExp(`${href}$`));
    await page.goto("/");
  }
});

for (const [label, href, target] of [
  ["Home", "/", "TRAIN SMARTER. FUEL BETTER. STAY FREE."],
  ["Our Vision", "/#our-vision", "Our vision"],
  ["Free Tools", "/#whats-coming", "Everything you need. Nothing behind a paywall."],
] as const) {
  test(`footer ${label} link navigates to its real destination`, async ({ page }) => {
    await page.goto("/?footer-test=navigation");
    const link = page.getByRole("contentinfo").getByRole("navigation", { name: "Explore", exact: true }).getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", href);
    await link.click();
    await expect(page).toHaveURL(new URL(href, "http://127.0.0.1:3100").href);
    const region = page.getByRole("region", { name: target, exact: true });
    await expect(region.getByRole("heading", { name: target, exact: true })).toBeInViewport();
  });
}

test("footer links follow keyboard order and show focus", async ({ page }) => {
  const nav = page.getByRole("contentinfo").getByRole("navigation", { name: "Explore", exact: true });
  await nav.getByRole("link", { name: "Home", exact: true }).focus();
  for (const [index, label] of ["Home", "Our Vision", "Free Tools"].entries()) {
    if (index > 0) await page.keyboard.press("Tab");
    const link = nav.getByRole("link", { name: label, exact: true });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
    await expect(link).toHaveCSS("outline-width", "3px");
    await expect(link).toHaveCSS("outline-color", "rgb(199, 255, 66)");
  }
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#whats-coming$/);
  await expect(page.getByRole("region", { name: "Everything you need. Nothing behind a paywall.", exact: true })).toBeFocused();
});

test("footer adapts to mobile and desktop without overflow", async ({ page, isMobile }, testInfo) => {
  const footer = page.getByRole("contentinfo");
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeInViewport();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    const nav = await footer.getByRole("navigation", { name: "Explore", exact: true }).boundingBox();
    const upcoming = await footer.getByRole("list", { name: "Tools", exact: true }).boundingBox();
    expect(nav).not.toBeNull();
    expect(upcoming).not.toBeNull();
    if (width < 640) expect(upcoming!.y).toBeGreaterThan(nav!.y + nav!.height);
    else expect(upcoming!.x).toBeGreaterThan(nav!.x);
    await footer.screenshot({ path: testInfo.outputPath(`footer-${width}.png`) });
  }
});
