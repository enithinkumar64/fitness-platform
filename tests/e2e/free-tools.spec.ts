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

test("implemented cards navigate while Healthy Recipes remains an honest preview", async ({ page }) => {
  const section = page.getByRole("region", { name: heading, exact: true });
  await expect(section.getByRole("article")).toHaveCount(6);
  await expect(section.getByText("Coming Soon", { exact: true })).toHaveCount(1);
  await expect(section.getByRole("link")).toHaveCount(5);
  const destinations: Record<string,string> = {
    "Fitness Calculators": "/calculators/tdee", "Workout Plans": "/workout-planner",
    "Exercise Library": "/exercises", "Nutrition Tracking": "/nutrition-tracker", "Progress Tracking": "/progress-tracker",
  };
  for (const [name, description] of tools) {
    const card = section.getByRole("article", { name, exact: true });
    await expect(card.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(card.getByText(description, { exact: true })).toBeVisible();
    if (name === "Healthy Recipes") {
      await expect(card.getByText("Coming Soon", { exact: true })).toBeVisible();
      await expect(card.locator("a, button, [tabindex], [onclick]")).toHaveCount(0);
      continue;
    }
    await expect(card.getByText("Coming Soon", { exact: true })).toHaveCount(0);
    const link = card.getByRole("link", { name: `Explore ${name}`, exact: true });
    await expect(link).toHaveAttribute("href", destinations[name]);
    await link.focus();
    await expect(link).toHaveCSS("outline-width", "3px");
    // Test the card's padded hit area, beyond the visible CTA text.
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.click(box!.x + 12, box!.y + 12);
    await expect(page).toHaveURL(new RegExp(`${destinations[name]}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/");
  }
  const link = section.getByRole("link", { name: "Explore Workout Plans", exact: true });
  await link.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/workout-planner$/);
});

test("hero CTA scrolls to the tools and the vision link still works", async ({ page }) => {
  await page.getByRole("link", { name: "Explore Free Tools", exact: true }).click();
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
