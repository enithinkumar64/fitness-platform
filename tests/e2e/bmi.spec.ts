import { expect, test, type Page } from "@playwright/test";

const form = (page: Page) => page.getByRole("form", { name: "BMI calculator", exact: true });
const results = (page: Page) => page.getByRole("region", { name: "Your BMI results", exact: true });
async function fillMetric(page: Page, weight = "70", height = "175") {
  await form(page).getByLabel("Age (years)", { exact: true }).fill("30");
  await form(page).getByLabel("Weight (kg)", { exact: true }).fill(weight);
  await form(page).getByLabel("Height (cm)", { exact: true }).fill(height);
}
async function calculate(page: Page) {
  await form(page).getByRole("button", { name: "Calculate BMI", exact: true }).click();
  await expect(results(page)).toBeFocused();
}
test.beforeEach(async ({ page }) => { await page.goto("/calculators/bmi"); });

test("page metadata, discovery, and contextual navigation work", async ({ page }) => {
  await expect(page).toHaveTitle("Free Adult BMI Calculator | VAJRYA");
  await expect(page.getByRole("heading", { name: "Adult BMI calculator", exact: true })).toBeVisible();
  await expect(form(page).getByRole("combobox")).toHaveCount(0);
  const related = page.getByRole("navigation", { name: "Related calculators" });
  await expect(related.getByRole("link", { name: "TDEE & daily calorie calculator" })).toHaveAttribute("href", "/calculators/tdee");
  await expect(related.getByRole("link", { name: "Goal-guided macro calculator" })).toHaveAttribute("href", "/calculators/macros");
  await page.goto("/");
  await page.getByRole("link", { name: "Free adult BMI calculator", exact: true }).click();
  await expect(page).toHaveURL(/\/calculators\/bmi$/);
});

test("metric results show correct values, reference boundaries, and logical order", async ({ page }) => {
  await fillMetric(page); await calculate(page);
  const region = results(page);
  await expect(region.getByTestId("bmi-value")).toHaveText("22.86");
  await expect(region.getByText("Normal", { exact: true }).first()).toBeVisible();
  await expect(region.getByText("56.66 kg", { exact: true })).toBeVisible();
  await expect(region.getByText("76.56 kg", { exact: true })).toBeVisible();
  await expect(region.getByText("0.91", { exact: true })).toBeVisible();
  await expect(region.getByText("13.06 kg/m³", { exact: true })).toBeVisible();
  await expect(region.getByRole("list", { name: "Adult BMI classifications" }).getByRole("listitem")).toHaveCount(6);
  await expect(region.getByRole("img")).toHaveAccessibleName(/BMI 22.86: Normal/);
  expect(await region.evaluate((element) => !!(element.compareDocumentPosition(document.querySelector('form[aria-label="BMI calculator"]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  // Chromium serializes CSS percentages with fewer digits than the calculation.
  await expect.poll(() => region.getByTestId("bmi-marker").evaluate((el) => parseFloat((el as HTMLElement).style.left))).toBeCloseTo(36.7346938776, 4);
  await form(page).getByLabel("Weight (kg)", { exact: true }).fill("80");
  await expect(region.getByTestId("bmi-value")).toHaveCount(0);
});

test("imperial inputs and repeated unit switching preserve measurements and results", async ({ page }) => {
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await form(page).getByLabel("Age (years)", { exact: true }).fill("25");
  await form(page).getByLabel("Weight (lb)", { exact: true }).fill("200");
  await form(page).getByLabel("Height (feet)", { exact: true }).fill("6");
  await form(page).getByLabel("Height (inches)", { exact: true }).fill("0");
  await calculate(page);
  await expect(results(page).getByTestId("bmi-value")).toHaveText("27.12");
  await expect(results(page).getByText("136.41 lb", { exact: true })).toBeVisible();
  for (let i = 0; i < 3; i++) {
    await form(page).getByLabel("Metric", { exact: true }).check();
    await expect(form(page).getByLabel("Weight (kg)", { exact: true })).toHaveValue("90.718474");
    await expect(form(page).getByLabel("Height (cm)", { exact: true })).toHaveValue("182.88");
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await expect(form(page).getByLabel("Weight (lb)", { exact: true })).toHaveValue("200");
    await expect(form(page).getByLabel("Height (inches)", { exact: true })).toHaveValue("0");
  }
  await calculate(page);
  await expect(results(page).getByTestId("bmi-value")).toHaveText("27.12");
});

test("validation rejects empty, out-of-range, and incomplete imperial inputs accessibly", async ({ page }) => {
  await form(page).getByRole("button", { name: "Calculate BMI", exact: true }).click();
  await expect(form(page).getByRole("alert")).toBeFocused();
  for (const label of ["Age (years)", "Weight (kg)", "Height (cm)"]) await expect(form(page).getByLabel(label, { exact: true })).toHaveAttribute("aria-invalid", "true");
  await fillMetric(page, "0", "99");
  await form(page).getByLabel("Age (years)", { exact: true }).fill("19");
  await form(page).getByRole("button", { name: "Calculate BMI", exact: true }).click();
  await expect(form(page).getByText(/Enter a whole-number age from 20 to 100/)).toBeVisible();
  await expect(form(page).getByText(/Enter a weight from 20 to 400/)).toBeVisible();
  await expect(form(page).getByText(/Enter a height from 100 to 250/)).toBeVisible();
  await expect(results(page).getByTestId("bmi-value")).toHaveCount(0);
  await form(page).getByRole("button", { name: "Reset", exact: true }).click();
  await expect(form(page).getByLabel("Age (years)", { exact: true })).toBeFocused();
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await form(page).getByLabel("Height (feet)", { exact: true }).fill("5");
  await form(page).getByLabel("Metric", { exact: true }).click();
  await expect(form(page).getByRole("alert")).toHaveText("Complete or clear your measurements before switching units.");
  await expect(form(page).getByLabel("Imperial", { exact: true })).toBeChecked();
  await form(page).getByLabel("Height (inches)", { exact: true }).fill("12");
  await form(page).getByRole("button", { name: "Calculate BMI", exact: true }).click();
  await expect(form(page).getByLabel("Height (inches)", { exact: true })).toHaveAttribute("aria-invalid", "true");
});

test("chart handles results outside the scale without hiding actual values", async ({ page }) => {
  for (const [weight, height, value, edge, direction] of [["20", "250", "3.20", "0%", "below"], ["400", "100", "400.00", "100%", "above"]]) {
    await fillMetric(page, weight, height); await calculate(page);
    await expect(results(page).getByTestId("bmi-value")).toHaveText(value);
    await expect(results(page).getByTestId("bmi-marker")).toHaveAttribute("style", `left: ${edge};`);
    await expect(results(page).getByRole("img")).toHaveAccessibleName(new RegExp(`Result is ${direction} the visual scale`));
  }
});

test("keyboard submission, focus styling, and reset work", async ({ page }) => {
  await fillMetric(page);
  await form(page).getByLabel("Height (cm)", { exact: true }).focus();
  await page.keyboard.press("Tab");
  const button = form(page).getByRole("button", { name: "Calculate BMI", exact: true });
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter");
  await expect(results(page)).toBeFocused();
  await expect(results(page).getByTestId("bmi-value")).toHaveText("22.86");
  await form(page).getByRole("button", { name: "Reset", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(form(page).getByLabel("Age (years)", { exact: true })).toBeFocused();
  await expect(form(page).getByLabel("Weight (kg)", { exact: true })).toHaveValue("");
  await expect(results(page).getByTestId("bmi-value")).toHaveCount(0);
});

test("responsive form and results fit mobile and desktop without overflow", async ({ page, isMobile }, testInfo) => {
  await fillMetric(page); await calculate(page);
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(results(page).getByTestId("bmi-value")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await results(page).screenshot({ path: testInfo.outputPath(`bmi-${width}.png`) });
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await expect(form(page).getByLabel("Height (inches)", { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await form(page).getByLabel("Metric", { exact: true }).check();
  }
});
