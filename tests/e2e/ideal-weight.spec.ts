import { expect, test, type Page } from "@playwright/test";

const form = (page: Page) => page.getByRole("form", { name: "Ideal weight calculator", exact: true });
const results = (page: Page) => page.getByRole("region", { name: "Your Height-Based Weight Estimates", exact: true });
async function fillMetric(page: Page, height = "177.8") {
  await form(page).getByLabel("Age (years)", { exact: true }).fill("30");
  await form(page).getByLabel("Height (cm)", { exact: true }).fill(height);
}
async function calculate(page: Page) {
  await form(page).getByRole("button", { name: "Calculate estimates", exact: true }).click();
  await expect(results(page)).toBeFocused();
}
test.beforeEach(async ({ page }) => { await page.goto("/calculators/ideal-weight"); });

test("page metadata, homepage discovery, and contextual links work", async ({ page }) => {
  await expect(page).toHaveTitle("Free Ideal Weight Calculator | FormFuel");
  await expect(page.getByRole("heading", { name: "Ideal weight calculator", exact: true })).toBeVisible();
  await expect(form(page).getByLabel(/Weight/)).toHaveCount(0);
  const nav = page.getByRole("navigation", { name: "Related calculators" });
  await expect(nav.getByRole("link", { name: "Adult BMI calculator" })).toHaveAttribute("href", "/calculators/bmi");
  await expect(nav.getByRole("link", { name: "Body fat calculator" })).toHaveAttribute("href", "/calculators/body-fat");
  await page.goto("/");
  await page.getByRole("link", { name: "Free ideal weight calculator", exact: true }).click();
  await expect(page).toHaveURL(/\/calculators\/ideal-weight$/);
});

test("metric results show all four formulas, BMI boundaries, and accessible proportional bars", async ({ page }) => {
  await fillMetric(page); await calculate(page);
  const region = results(page);
  for (const [id, value] of [["robinson", "71.0 kg"], ["miller", "70.3 kg"], ["devine", "73.0 kg"], ["hamwi", "75.0 kg"]]) await expect(region.getByTestId(`estimate-${id}`)).toHaveText(value);
  await expect(region.getByTestId("reference-lower")).toHaveText("58.5 kg");
  await expect(region.getByTestId("reference-upper")).toHaveText("79.0 kg");
  await expect(region.getByRole("img")).toHaveCount(4);
  await expect(region.getByRole("img", { name: "Robinson (1983): 71.0 kg. Scale zero to 80.0 kg.", exact: true })).toBeVisible();
  await expect.poll(() => region.getByTestId("bar-robinson").evaluate((el) => parseFloat((el as HTMLElement).style.width))).toBeCloseTo(88.75, 4);
  expect(await region.evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('form[aria-label="Ideal weight calculator"]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
});

test("female selection changes coefficients while age leaves estimates unchanged", async ({ page }) => {
  await fillMetric(page);
  await form(page).getByLabel("Formula coefficient set", { exact: true }).selectOption("female");
  await calculate(page);
  for (const [id, value] of [["robinson", "66.0 kg"], ["miller", "66.7 kg"], ["devine", "68.5 kg"], ["hamwi", "67.5 kg"]]) await expect(results(page).getByTestId(`estimate-${id}`)).toHaveText(value);
  await form(page).getByLabel("Age (years)", { exact: true }).fill("100");
  await expect(results(page).getByTestId("estimate-robinson")).toHaveCount(0);
  await calculate(page);
  await expect(results(page).getByTestId("estimate-robinson")).toHaveText("66.0 kg");
  await expect(results(page).getByTestId("reference-upper")).toHaveText("79.0 kg");
});

test("imperial entry and repeated unit switches preserve height and estimates", async ({ page }) => {
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await form(page).getByLabel("Age (years)", { exact: true }).fill("20");
  await form(page).getByLabel("Height (feet)", { exact: true }).fill("5");
  await form(page).getByLabel("Height (inches)", { exact: true }).fill("10");
  await calculate(page);
  for (const [id, value] of [["robinson", "156.5 lb"], ["miller", "155.0 lb"], ["devine", "160.9 lb"], ["hamwi", "165.3 lb"]]) await expect(results(page).getByTestId(`estimate-${id}`)).toHaveText(value);
  for (let i = 0; i < 3; i++) {
    await form(page).getByLabel("Metric", { exact: true }).check();
    await expect(form(page).getByLabel("Height (cm)", { exact: true })).toHaveValue("177.8");
    await expect(results(page).getByTestId("estimate-devine")).toHaveText("73.0 kg");
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await expect(form(page).getByLabel("Height (inches)", { exact: true })).toHaveValue("10");
  }
  await expect(results(page).getByTestId("estimate-devine")).toHaveText("160.9 lb");
});

test("below five feet withholds formulas and chart but retains the separate BMI interval", async ({ page }) => {
  await fillMetric(page, "140"); await calculate(page);
  await expect(results(page).getByText(/withheld below five feet/)).toBeVisible();
  await expect(results(page).getByTestId("estimate-robinson")).toHaveCount(0);
  await expect(results(page).getByRole("img")).toHaveCount(0);
  await expect(results(page).getByTestId("reference-lower")).toHaveText("36.3 kg");
  await expect(results(page).getByTestId("reference-upper")).toHaveText("49.0 kg");
  await form(page).getByLabel("Height (cm)", { exact: true }).fill("152.4");
  await calculate(page);
  await expect(results(page).getByTestId("estimate-robinson")).toHaveText("52.0 kg");
  await expect(results(page).getByRole("img")).toHaveCount(4);
});

test("validation rejects empty inputs, nonadult ages, height bounds, and invalid imperial parts", async ({ page }) => {
  await form(page).getByRole("button", { name: "Calculate estimates", exact: true }).click();
  await expect(form(page).getByRole("alert")).toBeFocused();
  await expect(form(page).getByLabel("Age (years)", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(form(page).getByLabel("Height (cm)", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await fillMetric(page, "251");
  await form(page).getByLabel("Age (years)", { exact: true }).fill("19");
  await form(page).getByRole("button", { name: "Calculate estimates", exact: true }).click();
  await expect(form(page).getByText("Enter a whole-number age from 20 to 100.", { exact: true })).toBeVisible();
  await expect(form(page).getByText(/Enter a height from 100 to 250/)).toBeVisible();
  await form(page).getByRole("button", { name: "Reset", exact: true }).click();
  await expect(form(page).getByLabel("Age (years)", { exact: true })).toBeFocused();
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await form(page).getByLabel("Height (feet)", { exact: true }).fill("5");
  await form(page).getByLabel("Metric", { exact: true }).click();
  await expect(form(page).getByRole("alert")).toHaveText("Complete or clear your height before switching units.");
  await expect(form(page).getByLabel("Imperial", { exact: true })).toBeChecked();
  await form(page).getByLabel("Height (inches)", { exact: true }).fill("12");
  await form(page).getByRole("button", { name: "Calculate estimates", exact: true }).click();
  await expect(form(page).getByLabel("Height (inches)", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(results(page).getByRole("img")).toHaveCount(0);
});

test("keyboard submission, focus indicators, and reset work", async ({ page }) => {
  await fillMetric(page);
  await form(page).getByLabel("Height (cm)", { exact: true }).focus();
  await page.keyboard.press("Tab");
  const button = form(page).getByRole("button", { name: "Calculate estimates", exact: true });
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter");
  await expect(results(page)).toBeFocused();
  await form(page).getByRole("button", { name: "Reset", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(form(page).getByLabel("Age (years)", { exact: true })).toBeFocused();
  await expect(form(page).getByLabel("Age (years)", { exact: true })).toHaveValue("");
  await expect(form(page).getByLabel("Height (cm)", { exact: true })).toHaveValue("");
  await expect(results(page).getByTestId("estimate-robinson")).toHaveCount(0);
});

test("comparison and form fit mobile and desktop widths without overflow", async ({ page, isMobile }, testInfo) => {
  await fillMetric(page); await calculate(page);
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(results(page).getByRole("img")).toHaveCount(4);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await results(page).screenshot({ path: testInfo.outputPath(`ideal-weight-${width}.png`) });
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await expect(form(page).getByLabel("Height (inches)", { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await form(page).screenshot({ path: testInfo.outputPath(`ideal-weight-form-${width}.png`) });
    await form(page).getByLabel("Metric", { exact: true }).check();
  }
});
