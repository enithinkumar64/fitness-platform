import { expect, test, type Page } from "@playwright/test";
const form = (page: Page) => page.getByRole("form", { name: "TDEE calculator" });
const results = (page: Page) => page.getByRole("region", { name: "Your estimates", exact: true });
async function fillMetric(page: Page) {
  await form(page).getByLabel("Age (years)").fill("30");
  await form(page).getByLabel("Weight (kg)").fill("70");
  await form(page).getByLabel("Height (cm)").fill("175");
}
async function calculate(page: Page) { await form(page).getByRole("button", { name: "Calculate daily calories" }).click(); }
test.beforeEach(async ({ page }) => { await page.goto("/calculators/tdee"); });
test("page metadata, labels, and estimates", async ({ page }) => {
  await expect(page).toHaveTitle("Free TDEE & Daily Calorie Calculator | VAJRYA");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TDEE & daily calorie calculator");
  for (const label of ["Age (years)","Formula coefficient","Weight (kg)","Height (cm)","Activity level"]) await expect(form(page).getByLabel(label, { exact: true })).toBeVisible();
  await fillMetric(page); await calculate(page);
  await expect(results(page)).toBeFocused();
  await expect(results(page).getByText("1979 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByText("1649 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByText("1729 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByText("2229 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByText("2479 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByText(/Below the screening threshold/)).toHaveCount(1);
});
test("unit switches preserve measurements and results across repeated toggles", async ({ page }) => {
  await fillMetric(page);
  for (let i=0;i<5;i++) {
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await expect(form(page).getByLabel("Weight (lb)")).toHaveValue("154.323584");
    await form(page).getByLabel("Metric", { exact: true }).check();
    await expect(form(page).getByLabel("Weight (kg)")).toHaveValue("70");
    await expect(form(page).getByLabel("Height (cm)")).toHaveValue("175");
  }
  await calculate(page); await expect(results(page).getByText("1979 kcal/day", { exact: true })).toBeVisible();
});
test("imperial input converts into metric without relabeling", async ({ page }) => {
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await form(page).getByLabel("Age (years)").fill("30");
  await form(page).getByLabel("Weight (lb)").fill("200");
  await form(page).getByLabel("Height (feet)").fill("6");
  await form(page).getByLabel("Height (inches)").fill("0");
  await form(page).getByLabel("Metric", { exact: true }).check();
  await expect(form(page).getByLabel("Weight (kg)")).toHaveValue("90.718474");
  await expect(form(page).getByLabel("Height (cm)")).toHaveValue("182.88");
  await calculate(page); await expect(results(page).getByText("2286 kcal/day", { exact: true })).toBeVisible();
});
test("inline errors reject empty and out-of-range inputs", async ({ page }) => {
  await calculate(page);
  await expect(form(page).getByRole("alert")).toBeFocused();
  await expect(form(page).getByLabel("Age (years)")).toHaveAttribute("aria-invalid","true");
  await fillMetric(page);
  await form(page).getByLabel("Age (years)").fill("17");
  await form(page).getByLabel("Weight (kg)").fill("-1");
  await form(page).getByLabel("Height (cm)").fill("0");
  await calculate(page);
  await expect(form(page).getByText(/Enter a whole-number age/)).toBeVisible();
  await expect(form(page).getByText(/Enter a weight from/)).toBeVisible();
  await expect(form(page).getByText(/Enter a height from/)).toBeVisible();
  await expect(results(page).getByText(/kcal\/day/, { exact: false })).toHaveCount(1); // safeguard explanation only
});
test("activity changes clear stale results and coefficient changes affect screening", async ({ page }) => {
  await fillMetric(page); await calculate(page);
  await form(page).getByLabel("Activity level").selectOption("moderate");
  await expect(results(page).getByText("1979 kcal/day", { exact: true })).toHaveCount(0);
  await calculate(page); await expect(results(page).getByText("2556 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByText("2056 kcal/day", { exact: true })).toBeVisible();
  await form(page).getByLabel("Formula coefficient").selectOption("female");
  await form(page).getByLabel("Age (years)").fill("80");
  await form(page).getByLabel("Weight (kg)").fill("40");
  await form(page).getByLabel("Height (cm)").fill("140");
  await form(page).getByLabel("Activity level").selectOption("sedentary");
  await calculate(page);
  await expect(results(page).getByText(/Below the screening threshold/)).toHaveCount(2);
});
test("keyboard submits and mobile layout does not overflow", async ({ page, isMobile }, testInfo) => {
  await fillMetric(page);
  await form(page).getByRole("button").focus(); await page.keyboard.press("Enter");
  await expect(results(page)).toBeFocused();
  for (const width of isMobile ? [320,390,768] : [1024,1440]) {
    await page.setViewportSize({width,height:900});
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  }
  await page.screenshot({ path: testInfo.outputPath("tdee.png"),fullPage:true });
});
test("homepage offers one working calculator link without activating preview cards", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name:"Free TDEE & daily calorie calculator",exact:true });
  await expect(link).toHaveCount(1); await link.click();
  await expect(page).toHaveURL(/\/calculators\/tdee$/);
  await expect(page.getByRole("heading",{level:1})).toHaveText("TDEE & daily calorie calculator");
});

test("imperial height rejects invalid inches and incomplete unit switches", async ({ page }) => {
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await form(page).getByLabel("Age (years)").fill("30");
  await form(page).getByLabel("Weight (lb)").fill("200");
  await form(page).getByLabel("Height (feet)").fill("6");
  await form(page).getByLabel("Metric", { exact: true }).click();
  await expect(form(page).getByText("Complete or clear your measurements before switching units.")).toBeVisible();
  await expect(form(page).getByLabel("Imperial", { exact: true })).toBeChecked();
  await form(page).getByLabel("Height (inches)").fill("12");
  await calculate(page);
  await expect(form(page).getByLabel("Height (inches)")).toHaveAttribute("aria-invalid", "true");
  await form(page).getByLabel("Height (inches)").fill("0");
  await calculate(page);
  await expect(results(page).getByText("2286 kcal/day", { exact: true })).toBeVisible();
});
