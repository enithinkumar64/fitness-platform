import { expect, test, type Page } from "@playwright/test";

const sections = ["Calculators"];
const mobileMenu = (page: Page) =>
  page.getByRole("navigation", { name: "Primary mobile", exact: true });
const toggle = (page: Page) =>
  page.getByRole("button", { name: /^(Open|Close) navigation menu$/ });

async function openMobileMenu(page: Page) {
  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
  await expect(mobileMenu(page)).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});

test("homepage loads with its main content and VAJRYA header", async ({ page }) => {
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("link", { name: "VAJRYA home", exact: true })).toBeVisible();
});

test("logo navigates back to Home", async ({ page }) => {
  // A query distinguishes the starting URL without requiring a second app page.
  await page.goto("/?navigation-test=logo");
  const logo = page.getByRole("link", { name: "VAJRYA home", exact: true });
  await expect(logo).toHaveAttribute("href", "/");
  await logo.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("main")).toBeVisible();
});

test("desktop navigation is visible and Home is active", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop layout only");
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  await expect(nav).toBeVisible();
  await expect(toggle(page)).toBeHidden();
  const home = nav.getByRole("link", { name: "Home", exact: true });
  await expect(home).toHaveAttribute("aria-current", "page");
  await expect(home).toHaveCSS("color", "rgb(199, 255, 66)");
  await expect(nav.getByText("Coming Soon", { exact: true })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Exercises", exact: true })).toHaveAttribute("href", "/exercises");
  for (const section of sections) {
    await expect(nav.getByText(section, { exact: true })).toBeVisible();
  }
});

test("calculator disclosure provides seven working destinations and keyboard controls", async ({ page, isMobile }) => {
  if (isMobile) await openMobileMenu(page);
  const nav = page.getByRole("navigation", { name: isMobile ? "Primary mobile" : "Primary", exact: true });
  const summary = nav.locator("summary");
  await summary.focus();
  await expect(summary).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter");
  const links = nav.locator("details").getByRole("link");
  await expect(links).toHaveCount(7);
  const destinations = ["tdee", "macros", "bmi", "body-fat", "ideal-weight", "calories-burned", "one-rep-max"];
  for (const [index, slug] of destinations.entries()) {
    await expect(links.nth(index)).toHaveAttribute("href", `/calculators/${slug}`);
    expect((await page.request.get(`/calculators/${slug}`)).status()).toBe(200);
  }
  await page.keyboard.press("Tab");
  await expect(links.first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(summary).toBeFocused();
  await expect(links.first()).toBeHidden();
  if (isMobile) await expect(nav).toBeVisible();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/calculators\/tdee$/);
  if (isMobile) {
    await expect(mobileMenu(page)).toBeHidden();
    await openMobileMenu(page);
  }
  await nav.locator("summary").click();
  await expect(nav.getByRole("link", { name: "TDEE & Daily Calories", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByText("Coming Soon", { exact: true })).toHaveCount(0);
  if (isMobile) {
    await toggle(page).click();
    await openMobileMenu(page);
    await expect(nav.locator("details")).not.toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
  }
});

test.describe("mobile navigation", () => {
  test.beforeEach(async ({ isMobile }) => {
    test.skip(!isMobile, "Mobile layout only");
  });

  test("menu toggle opens and closes its controlled navigation", async ({ page }) => {
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(mobileMenu(page)).toBeHidden();
    await openMobileMenu(page);
    const controls = await toggle(page).getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    await expect(mobileMenu(page)).toHaveAttribute("id", controls!);
    await expect(mobileMenu(page).getByRole("link", { name: "Home", exact: true }))
      .toHaveAttribute("aria-current", "page");
    await toggle(page).click();
    await expect(mobileMenu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("keyboard opens the menu and Escape restores focus", async ({ page }) => {
    await toggle(page).focus();
    await page.keyboard.press("Enter");
    await expect(mobileMenu(page)).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(mobileMenu(page).getByRole("link", { name: "Home", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(mobileMenu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(toggle(page)).toBeFocused();
    await expect(toggle(page)).toHaveCSS("outline-style", "solid");
    await expect(toggle(page)).toHaveCSS("outline-width", "3px");
  });

  test("Home navigates and closes the menu", async ({ page }) => {
    await page.goto("/?navigation-test=home");
    await openMobileMenu(page);
    await mobileMenu(page).getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(mobileMenu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(toggle(page)).toBeFocused();
  });

  for (const width of [320, 375, 390, 768]) {
    test(`no horizontal overflow at ${width}px with menu closed or open`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const overflow = () => page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      await expect.poll(overflow).toBeLessThanOrEqual(0);
      await openMobileMenu(page);
      await expect.poll(overflow).toBeLessThanOrEqual(0);
      await mobileMenu(page).locator("summary").click();
      await expect(mobileMenu(page).getByRole("link", { name: "One-Rep Max Calculator", exact: true })).toBeVisible();
      await expect.poll(overflow).toBeLessThanOrEqual(0);
    });
  }
});
