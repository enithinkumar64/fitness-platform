import { expect, test, type Page } from "@playwright/test";

const form = (page: Page) => page.getByRole("form", { name: "Calories burned calculator", exact: true });
const results = (page: Page) => page.getByRole("region", { name: "Your activity calorie estimate", exact: true });
async function fillSession(page: Page) {
  await form(page).getByLabel("Body weight (kg)", { exact: true }).fill("70");
  await form(page).getByLabel("Minutes", { exact: true }).fill("30");
}
async function calculate(page: Page) {
  await form(page).getByRole("button", { name: "Calculate calories burned", exact: true }).click();
  await expect(results(page)).toBeFocused();
}
test.beforeEach(async ({ page }) => { await page.goto("/calculators/calories-burned"); });

test("page metadata, homepage navigation, and contextual link work", async ({ page }) => {
  await expect(page).toHaveTitle("Free Calories Burned Calculator | FormFuel");
  await expect(page.getByRole("heading", { name: "Calories burned calculator", exact: true })).toBeVisible();
  await expect(form(page).getByRole("spinbutton")).toHaveCount(3);
  await expect(page.getByRole("navigation", { name: "Related calculators" }).getByRole("link")).toHaveAttribute("href", "/calculators/tdee");
  await page.goto("/");
  await page.getByRole("link", { name: "Free calories burned calculator", exact: true }).click();
  await expect(page).toHaveURL(/\/calculators\/calories-burned$/);
});

test("known metric session shows gross calories, rates, and accessible visual summary above the form", async ({ page }) => {
  await fillSession(page); await calculate(page);
  await expect(results(page).getByTestId("gross-calories")).toHaveText("103");
  await expect(results(page).getByTestId("calories-per-minute")).toHaveText("3.43 kcal/min");
  await expect(results(page).getByTestId("calories-per-hour")).toHaveText("206 kcal/hour");
  await expect(results(page).getByRole("img")).toHaveAccessibleName("Session summary: Walking — 2.0–2.4 mph, level firm ground; 30 minutes; 70.0 kg; 2.8 MET; 103 kcal gross.");
  await expect(results(page).getByRole("link", { name: "2024 Adult Compendium, code 17152" })).toHaveAttribute("href", "https://pacompendium.com/walking/");
  expect(await results(page).evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('form[aria-label="Calories burned calculator"]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
});

test("activity and intensity selection update METs and clear stale results", async ({ page }) => {
  await fillSession(page); await calculate(page);
  await form(page).getByLabel("Intensity or pace", { exact: true }).selectOption("walking-brisk");
  await expect(results(page).getByTestId("gross-calories")).toHaveCount(0);
  await calculate(page);
  await expect(results(page).getByTestId("gross-calories")).toHaveText("176");
  await form(page).getByLabel("Activity", { exact: true }).selectOption("Running");
  await expect(form(page).getByLabel("Intensity or pace", { exact: true })).toHaveValue("running-4mph");
  await form(page).getByLabel("Intensity or pace", { exact: true }).selectOption("running-5mph");
  await calculate(page);
  await expect(results(page).getByTestId("gross-calories")).toHaveText("312");
  await expect(results(page).getByTestId("calories-per-minute")).toHaveText("10.41 kcal/min");
  await form(page).getByLabel("Activity", { exact: true }).selectOption("Soccer");
  await expect(form(page).getByLabel("Intensity or pace", { exact: true }).getByRole("option")).toHaveCount(1);
});

test("imperial input, hours and minutes, and repeated unit conversions work", async ({ page }) => {
  await form(page).getByLabel("Imperial (lb)", { exact: true }).check();
  await form(page).getByLabel("Activity", { exact: true }).selectOption("Cycling");
  await form(page).getByLabel("Body weight (lb)", { exact: true }).fill("200");
  await form(page).getByLabel("Hours", { exact: true }).fill("1");
  await form(page).getByLabel("Minutes", { exact: true }).fill("30");
  await calculate(page);
  await expect(results(page).getByTestId("gross-calories")).toHaveText("572");
  await expect(results(page).getByTestId("calories-per-minute")).toHaveText("6.35 kcal/min");
  await expect(results(page).getByTestId("calories-per-hour")).toHaveText("381 kcal/hour");
  for (let i = 0; i < 3; i++) {
    await form(page).getByLabel("Metric (kg)", { exact: true }).check();
    await expect(form(page).getByLabel("Body weight (kg)", { exact: true })).toHaveValue("90.718474");
    await form(page).getByLabel("Imperial (lb)", { exact: true }).check();
    await expect(form(page).getByLabel("Body weight (lb)", { exact: true })).toHaveValue("200");
  }
  await expect(results(page).getByTestId("gross-calories")).toHaveText("572");
});

test("weight edits and duration edits require recalculation", async ({ page }) => {
  await fillSession(page); await calculate(page);
  await form(page).getByLabel("Hours", { exact: true }).fill("1");
  await expect(results(page).getByTestId("gross-calories")).toHaveCount(0);
  await calculate(page);
  await expect(results(page).getByTestId("gross-calories")).toHaveText("309");
  await form(page).getByLabel("Body weight (kg)", { exact: true }).fill("80");
  await expect(results(page).getByTestId("gross-calories")).toHaveCount(0);
});

test("validation handles missing, zero, fractional, and out-of-range inputs accessibly", async ({ page }) => {
  await form(page).getByRole("button", { name: "Calculate calories burned", exact: true }).click();
  await expect(form(page).getByRole("alert")).toBeFocused();
  await expect(form(page).getByLabel("Body weight (kg)", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(form(page).getByLabel("Minutes", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await fillSession(page);
  await form(page).getByLabel("Minutes", { exact: true }).fill("0");
  await form(page).getByRole("button", { name: "Calculate calories burned", exact: true }).click();
  await expect(form(page).getByText(/Enter a session longer than zero/)).toBeVisible();
  await form(page).getByLabel("Hours", { exact: true }).fill("12");
  await form(page).getByLabel("Minutes", { exact: true }).fill("1");
  await form(page).getByRole("button", { name: "Calculate calories burned", exact: true }).click();
  await expect(form(page).getByLabel("Hours", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await form(page).getByLabel("Hours", { exact: true }).fill("0.5");
  await form(page).getByLabel("Minutes", { exact: true }).fill("60");
  await form(page).getByLabel("Body weight (kg)", { exact: true }).fill("0");
  await form(page).getByRole("button", { name: "Calculate calories burned", exact: true }).click();
  for (const label of ["Hours", "Minutes", "Body weight (kg)"]) await expect(form(page).getByLabel(label, { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(results(page).getByTestId("gross-calories")).toHaveCount(0);
});

test("keyboard submission, visible focus, and reset work", async ({ page }) => {
  await fillSession(page);
  await form(page).getByLabel("Minutes", { exact: true }).focus();
  await page.keyboard.press("Tab");
  const button = form(page).getByRole("button", { name: "Calculate calories burned", exact: true });
  await expect(button).toBeFocused(); await expect(button).toHaveCSS("outline-style", "solid"); await expect(button).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter"); await expect(results(page)).toBeFocused();
  await form(page).getByRole("button", { name: "Reset", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(form(page).getByLabel("Activity", { exact: true })).toBeFocused();
  await expect(form(page).getByLabel("Body weight (kg)", { exact: true })).toHaveValue("");
  await expect(form(page).getByLabel("Hours", { exact: true })).toHaveValue("0");
  await expect(form(page).getByLabel("Minutes", { exact: true })).toHaveValue("");
  await expect(results(page).getByTestId("gross-calories")).toHaveCount(0);
});

test("form and visual summary fit mobile and desktop widths without overflow", async ({ page, isMobile }, testInfo) => {
  await fillSession(page); await calculate(page);
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(results(page).getByRole("img")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await results(page).screenshot({ path: testInfo.outputPath(`calories-burned-${width}.png`) });
    await form(page).getByLabel("Imperial (lb)", { exact: true }).check();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await form(page).screenshot({ path: testInfo.outputPath(`calories-burned-form-${width}.png`) });
    await form(page).getByLabel("Metric (kg)", { exact: true }).check();
  }
});
