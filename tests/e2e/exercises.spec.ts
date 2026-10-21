import { expect, test, type Page } from "@playwright/test";

import { EXERCISES } from "../../src/lib/exercises/exercises";

const results = (page: Page) => page.getByRole("region", { name: "Exercise guides", exact: true });
const filters = (page: Page) => page.getByRole("search", { name: "Filter exercise library", exact: true });
test.beforeEach(async ({ page }) => { await page.goto("/exercises"); });

test("directory metadata, all 100 cards, and visible matching count render", async ({ page }) => {
  await expect(page).toHaveTitle("Free Exercise Library | VAJRYA");
  await expect(page.getByRole("heading", { name: "Exercise Library", exact: true, level: 1 })).toBeVisible();
  await expect(results(page).getByRole("article")).toHaveCount(100);
  await expect(results(page).getByRole("status")).toHaveText("100 exercises found");
  const card = results(page).getByRole("article", { name: "Goblet Squat", exact: true });
  for (const text of ["Legs", "Dumbbells", "beginner"]) await expect(card.getByText(text, { exact: true })).toBeVisible();
  await expect(card.getByRole("link", { name: "Goblet Squat", exact: true })).toHaveAttribute("href", "/exercises/goblet-squat");
});

test("case-insensitive name search tolerates whitespace", async ({ page }) => {
  await filters(page).getByRole("searchbox").fill("  PuSh-Up  ");
  await expect(results(page).getByRole("article")).toHaveCount(4);
  await expect(results(page).getByRole("status")).toHaveText("4 exercises found");
  await expect(results(page).getByRole("link", { name: "Push-Up", exact: true })).toBeVisible();
  await expect(results(page).getByRole("link", { name: "Incline Push-Up", exact: true })).toBeVisible();
});

test("each filter works independently", async ({ page }) => {
  await filters(page).getByLabel("Muscle group", { exact: true }).selectOption("Back");
  await expect(results(page).getByRole("article")).toHaveCount(14);
  await filters(page).getByRole("button", { name: "Clear all filters" }).click();
  await filters(page).getByLabel("Equipment", { exact: true }).selectOption("Rack");
  await expect(results(page).getByRole("article")).toHaveCount(7);
  await filters(page).getByRole("button", { name: "Clear all filters" }).click();
  await filters(page).getByLabel("Difficulty", { exact: true }).selectOption("advanced");
  await expect(results(page).getByRole("article")).toHaveCount(5);
  await expect(results(page).getByRole("link", { name: "Barbell Back Squat", exact: true })).toBeVisible();
});

test("filters combine with search and clear resets every control", async ({ page }) => {
  await filters(page).getByLabel("Muscle group", { exact: true }).selectOption("Arms");
  await filters(page).getByLabel("Equipment", { exact: true }).selectOption("Dumbbells");
  await filters(page).getByLabel("Difficulty", { exact: true }).selectOption("beginner");
  await expect(results(page).getByRole("article")).toHaveCount(4);
  await filters(page).getByRole("searchbox").fill("hammer");
  await expect(results(page).getByRole("status")).toHaveText("1 exercise found");
  await expect(results(page).getByRole("link", { name: "Hammer Curl", exact: true })).toBeVisible();
  await filters(page).getByRole("button", { name: "Clear all filters" }).click();
  await expect(filters(page).getByRole("searchbox")).toBeFocused();
  await expect(filters(page).getByRole("searchbox")).toHaveValue("");
  for (const name of ["Directory category", "Muscle group", "Equipment", "Difficulty"]) await expect(filters(page).getByLabel(name, { exact: true })).toHaveValue("");
  await expect(results(page).getByRole("article")).toHaveCount(100);
});

test("empty state explains no matches and can restore the directory", async ({ page }) => {
  await filters(page).getByRole("searchbox").fill("does-not-exist");
  await expect(results(page).getByRole("status")).toHaveText("0 exercises found");
  await expect(results(page).getByRole("heading", { name: "No exercises match" })).toBeVisible();
  await results(page).getByRole("button", { name: "Reset filters" }).click();
  await expect(filters(page).getByRole("searchbox")).toBeFocused();
  await expect(results(page).getByRole("article")).toHaveCount(100);
});

test("card navigation opens a complete detail guide with dynamic metadata and related links", async ({ page }) => {
  await results(page).getByRole("link", { name: "Goblet Squat", exact: true }).click();
  await expect(page).toHaveURL(/\/exercises\/goblet-squat$/);
  await expect(page).toHaveTitle("Goblet Squat: Technique & Safety | VAJRYA");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /A squat with one dumbbell/);
  await expect(page.getByRole("heading", { name: "Goblet Squat", level: 1, exact: true })).toBeVisible();
  const instructions = page.getByRole("region", { name: "How to perform", exact: true });
  await expect(instructions.locator("ol > li")).toHaveCount(3);
  for (const name of ["Technique tips", "Common mistakes to avoid", "Safety considerations", "Related exercise guides"]) await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await page.getByRole("region", { name: "Related exercise guides" }).getByRole("link", { name: "Bodyweight Squat", exact: true }).click();
  await expect(page).toHaveURL(/\/exercises\/bodyweight-squat$/);
  await page.getByRole("link", { name: "Back to Exercise Library" }).click();
  await expect(page).toHaveURL(/\/exercises$/);
});

test("unknown exercise slug responds with a useful 404 and directory recovery link", async ({ page }) => {
  const response = await page.goto("/exercises/this-guide-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "That exercise guide isn’t here", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Browse Exercise Library", exact: true }).click();
  await expect(page).toHaveURL(/\/exercises$/);
});

test("homepage and header link to the library with correct active navigation", async ({ page, isMobile }) => {
  await page.goto("/");
  const homepage = page.getByRole("main");
  await expect(homepage.getByText("Explore 100 free exercise guides with step-by-step instructions, technique tips, safety notes, and YouTube demonstrations where available.", { exact: false })).toBeVisible();
  await expect(homepage).not.toContainText(/\b30\s+(?:free\s+)?(?:written\s+)?(?:exercise\s+)?(?:exercises|guides)\b/i);
  // All seven existing working calculator links stay discoverable.
  for (const slug of ["tdee", "macros", "bmi", "body-fat", "ideal-weight", "calories-burned", "one-rep-max"]) await expect(page.getByRole("main").locator(`a[href='/calculators/${slug}']`)).toHaveCount(1);
  await page.getByRole("main").getByRole("link", { name: "Browse Exercise Library", exact: true }).click();
  await expect(page).toHaveURL(/\/exercises$/);
  if (isMobile) await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("navigation", { name: isMobile ? "Primary mobile" : "Primary", exact: true });
  await expect(nav.getByRole("link", { name: "Exercises", exact: true })).toHaveAttribute("aria-current", "page");
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Open navigation menu" }).click();
  await nav.getByRole("link", { name: "Exercises", exact: true }).click();
  await expect(page).toHaveURL(/\/exercises$/);
  if (isMobile) await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
});

test("keyboard users can filter, see focus, and activate a card", async ({ page }) => {
  const search = filters(page).getByRole("searchbox");
  await search.focus();
  await page.keyboard.type("Goblet");
  await expect(results(page).getByRole("article")).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(filters(page).getByLabel("Directory category", { exact: true })).toBeFocused();
  for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
  const clear = filters(page).getByRole("button", { name: "Clear all filters" });
  await expect(clear).toBeFocused();
  await expect(clear).toHaveCSS("outline-style", "solid");
  await expect(clear).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Tab");
  await expect(results(page).getByRole("link", { name: "Goblet Squat", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/exercises\/goblet-squat$/);
});

test("directory and detail layouts fit mobile and desktop, including reduced motion", async ({ page, isMobile }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    const boxes = await results(page).getByRole("article").evaluateAll((elements) => elements.map((el) => { const { x, y } = el.getBoundingClientRect(); return { x, y }; }));
    expect(new Set(boxes.filter((box) => Math.abs(box.y - boxes[0].y) < 1).map((box) => box.x)).size).toBe(width >= 1024 ? 3 : width >= 640 ? 2 : 1);
    await filters(page).screenshot({ path: testInfo.outputPath(`exercise-filters-${width}.png`) });
    await results(page).getByRole("article").first().screenshot({ path: testInfo.outputPath(`exercise-card-${width}.png`) });
  }
  await page.goto("/exercises/overhead-dumbbell-triceps-extension");
  for (const width of isMobile ? [320, 390] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("heading", { name: "Overhead Dumbbell Triceps Extension", exact: true, level: 1 })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await page.getByRole("main").screenshot({ path: testInfo.outputPath(`exercise-detail-${width}.png`) });
  }
});

for (const category of new Set(EXERCISES.filter((item) => item.video).map((item) => item.category))) {
  test(`referenced ${category} guides show attribution and secure external destinations`, async ({ page }) => {
    for (const exercise of EXERCISES.filter((item) => item.video && item.category === category)) {
      const video = exercise.video!;
      await page.goto(`/exercises/${exercise.slug}`);
      const section = page.getByRole("region", { name: "Watch Exercise Demonstration", exact: true });
      await expect(section.getByRole("heading", { name: video.title, exact: true })).toBeVisible();
      await expect(section.getByText(`Creator: ${video.creator}`, { exact: true })).toBeVisible();
      await expect(section.getByText(video.description, { exact: true })).toBeVisible();
      const link = section.getByRole("link", { name: "Watch on YouTube (opens in a new tab)", exact: true });
      await expect(link).toHaveAttribute("href", video.url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(section).toContainText("does not imply the creator endorses VAJRYA");
      await expect(page.locator("iframe, video")).toHaveCount(0);
    }
  });
}

test("guides without verified videos keep written instructions and related exercises", async ({ page }) => {
  await page.goto("/exercises/glute-bridge");
  await expect(page.getByRole("region", { name: "Watch Exercise Demonstration", exact: true })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "How to perform", exact: true }).locator("ol > li")).toHaveCount(3);
  await expect(page.getByRole("region", { name: "Safety considerations", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Related exercise guides", exact: true }).getByRole("link")).not.toHaveCount(0);
});

test("video link supports keyboard activation in a separate tab", async ({ page, context }) => {
  // Stub only the external destination: verify link behavior without depending on
  // YouTube consent screens, playback, network access, or third-party availability.
  const url = "https://www.youtube.com/watch?v=ZdAHe9_HeEw";
  await context.route(url, (route) => route.fulfill({ contentType: "text/html", body: "<title>External destination test</title>" }));
  await page.goto("/exercises/bird-dog");
  const link = page.getByRole("link", { name: "Watch on YouTube (opens in a new tab)", exact: true });
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-style", "solid");
  await expect(link).toHaveCSS("outline-width", "3px");
  const popupPromise = context.waitForEvent("page");
  await page.keyboard.press("Enter");
  const popup = await popupPromise;
  await expect(popup).toHaveURL(url);
  await expect.poll(() => popup.evaluate(() => window.opener === null)).toBe(true);
  await expect(page).toHaveURL(/\/exercises\/bird-dog$/);
  await popup.close();
});

test("video references fit narrow mobile and desktop layouts", async ({ page, isMobile }, testInfo) => {
  await page.goto("/exercises/dumbbell-romanian-deadlift");
  for (const width of isMobile ? [320, 390] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const section = page.getByRole("region", { name: "Watch Exercise Demonstration", exact: true });
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("link")).toBeInViewport();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await section.screenshot({ path: testInfo.outputPath(`exercise-video-${width}.png`) });
  }
});

test("all ten directory categories have accurate counts and filters combine", async ({ page }) => {
  const category = filters(page).getByLabel("Directory category", { exact: true });
  for (const [name, count] of [["Chest", 12], ["Back", 14], ["Legs and quads", 12], ["Glutes and hamstrings", 12], ["Shoulders", 12], ["Biceps", 8], ["Triceps", 8], ["Core and abs", 10], ["Full body", 6], ["Cardio and conditioning", 6]] as const) {
    await category.selectOption(name);
    await expect(results(page).getByRole("article")).toHaveCount(count);
    await expect(results(page).getByRole("status")).toHaveText(`${count} exercises found`);
  }
  await category.selectOption("Glutes and hamstrings");
  await filters(page).getByLabel("Equipment", { exact: true }).selectOption("Machine");
  await expect(results(page).getByRole("article")).toHaveCount(2);
  await filters(page).getByRole("searchbox").fill("seated");
  await expect(results(page).getByRole("status")).toHaveText("1 exercise found");
  await results(page).getByRole("link", { name: "Seated Leg Curl", exact: true }).click();
  await expect(page).toHaveURL(/\/exercises\/seated-leg-curl$/);
});

for (const [slug, name] of [
  ["barbell-bench-press", "Barbell Bench Press"],
  ["chin-up", "Chin-Up"],
  ["leg-extension", "Leg Extension"],
  ["seated-leg-curl", "Seated Leg Curl"],
  ["cable-lateral-raise", "Cable Lateral Raise"],
  ["preacher-curl", "Preacher Curl"],
  ["diamond-push-up", "Diamond Push-Up"],
  ["reverse-crunch", "Reverse Crunch"],
  ["dumbbell-thruster", "Dumbbell Thruster"],
  ["rowing-ergometer", "Rowing Ergometer"],
] as const) {
  test(`expanded guide ${name} has unique metadata, instructions, and working related links`, async ({ page }) => {
    const response = await page.goto(`/exercises/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${name}: Technique & Safety | VAJRYA`);
    await expect(page.getByRole("heading", { name, exact: true, level: 1 })).toBeVisible();
    await expect(page.getByRole("region", { name: "How to perform", exact: true }).locator("ol > li")).toHaveCount(3);
    const related = page.getByRole("region", { name: "Related exercise guides", exact: true }).getByRole("link").first();
    const href = await related.getAttribute("href");
    await related.click();
    await expect(page).toHaveURL(new URL(href!, "http://127.0.0.1:3100").href);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}
