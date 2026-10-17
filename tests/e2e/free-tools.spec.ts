import { expect, test } from "@playwright/test";

const heading = "Everything you need. Nothing behind a paywall.";
const tools = [
  ["Fitness Calculators", "Calories, macros, and TDEE."],
  ["Workout Plans", "Training plans tailored to your goals and schedule."],
  ["Exercise Library", "Learn exercises and proper technique."],
  ["Nutrition Tracking", "Track meals, calories, and macros."],
  ["Healthy Recipes", "Discover nutritious meal ideas."],
  ["Progress Tracking", "Monitor your fitness journey over time."],
];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("all six free tools are clearly labeled, non-interactive previews", async ({ page }) => {
  const section = page.getByRole("region", { name: heading, exact: true });
  await expect(section).toBeVisible();
  await expect(section.getByText("BUILT FOR YOUR FITNESS JOURNEY", { exact: true })).toBeVisible();
  await expect(section.getByText("Explore the free fitness tools we’re building for you.", { exact: true })).toBeVisible();
  await expect(section.getByRole("article")).toHaveCount(6);
  await expect(section.getByText("Coming Soon", { exact: true })).toHaveCount(6);
  await expect(section.getByRole("link")).toHaveCount(0);
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(section.locator("[tabindex='0'], [onclick], [href]")).toHaveCount(0);
  for (const [name, description] of tools) {
    const card = section.getByRole("article", { name, exact: true });
    await expect(card.getByRole("heading", { name, exact: true, level: 3 })).toBeVisible();
    await expect(card.getByText(description, { exact: true })).toBeVisible();
    await expect(card.getByText("Coming Soon", { exact: true })).toBeVisible();
    await card.getByRole("heading").click();
    await expect(page).toHaveURL(/\/$/);
  }
});

test("hero CTA scrolls to the tools and the vision link still works", async ({ page }) => {
  await page.getByRole("link", { name: "See What's Coming", exact: true }).click();
  await expect(page).toHaveURL(/#whats-coming$/);
  const section = page.getByRole("region", { name: heading, exact: true });
  await expect(section).toBeFocused();
  await expect(section.getByRole("heading", { name: heading, exact: true })).toBeInViewport();
  await page.getByRole("link", { name: "Explore Our Vision", exact: true }).click();
  await expect(page).toHaveURL(/#our-vision$/);
  await expect(page.getByRole("region", { name: "Our vision", exact: true })).toBeInViewport();
});

test("tools form a responsive grid without horizontal overflow", async ({ page, isMobile }, testInfo) => {
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const cards = page.getByRole("region", { name: heading, exact: true }).getByRole("article");
    await expect(cards).toHaveCount(6);
    const columns = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
    await expect.poll(async () => {
      const boxes = await cards.evaluateAll((elements) => elements.map((element) => {
        const { x, y } = element.getBoundingClientRect();
        return { x, y };
      }));
      return new Set(boxes.filter((box) => Math.abs(box.y - boxes[0].y) < 1).map((box) => box.x)).size;
    }).toBe(columns);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await page.getByRole("region", { name: heading, exact: true }).screenshot({ path: testInfo.outputPath(`free-tools-${width}.png`) });
  }
});
