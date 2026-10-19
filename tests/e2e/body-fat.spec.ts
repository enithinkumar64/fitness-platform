import { expect, test, type Page } from "@playwright/test";

const form = (page: Page) => page.getByRole("form", { name: "Body fat calculator", exact: true });
const results = (page: Page) => page.getByRole("region", { name: "Your body fat estimates", exact: true });
async function fillMale(page: Page) {
  for (const [label, value] of [["Age (years)", "30"], ["Weight (kg)", "70"], ["Height (cm)", "175"], ["Neck circumference (cm)", "38"], ["Waist circumference (cm)", "85"]]) await form(page).getByLabel(label, { exact: true }).fill(value);
}
async function calculate(page: Page) {
  await form(page).getByRole("button", { name: "Calculate body fat", exact: true }).click();
  await expect(results(page)).toBeFocused();
}
test.beforeEach(async ({ page }) => { await page.goto("/calculators/body-fat"); });

test("page, metadata, homepage discovery, and related links work", async ({ page }) => {
  await expect(page).toHaveTitle("Free Adult Body Fat Calculator | FormFuel");
  await expect(page.getByRole("heading", { name: "Body fat calculator", exact: true })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Related calculators" });
  for (const [label, href] of [["Adult BMI calculator", "/calculators/bmi"], ["TDEE & daily calorie calculator", "/calculators/tdee"], ["Goal-guided macro calculator", "/calculators/macros"]]) await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  await page.goto("/");
  await page.getByRole("link", { name: "Free body fat calculator", exact: true }).click();
  await expect(page).toHaveURL(/\/calculators\/body-fat$/);
});

test("male metric results, masses, comparison, visualization, and DOM order are correct", async ({ page }) => {
  await fillMale(page); await calculate(page);
  const region = results(page);
  await expect(region.getByTestId("navy-percentage")).toHaveText("17.0%");
  await expect(region.getByTestId("fat-mass")).toHaveText("11.9 kg");
  await expect(region.getByTestId("fat-free-mass")).toHaveText("58.1 kg");
  await expect(region.getByTestId("bmi-percentage")).toHaveText("18.1%");
  await expect(region.getByRole("img")).toHaveAccessibleName("Estimated fat 17.0 percent; fat-free mass 83.0 percent.");
  await expect.poll(() => region.getByTestId("fat-segment").evaluate((el) => parseFloat((el as HTMLElement).style.width))).toBeCloseTo(17.0077191723, 4);
  expect(await region.evaluate((element) => !!(element.compareDocumentPosition(document.querySelector('form[aria-label="Body fat calculator"]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await form(page).getByLabel("Waist circumference (cm)", { exact: true }).fill("90");
  await expect(region.getByTestId("navy-percentage")).toHaveCount(0);
});

test("female equation conditionally requires hips and calculates the separate coefficients", async ({ page }) => {
  await expect(form(page).getByLabel("Hip circumference (cm)", { exact: true })).toHaveCount(0);
  await fillMale(page);
  await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("female");
  await form(page).getByRole("button", { name: "Calculate body fat", exact: true }).click();
  await expect(form(page).getByLabel("Hip circumference (cm)", { exact: true })).toHaveAttribute("aria-invalid", "true");
  for (const [label, value] of [["Weight (kg)", "65"], ["Height (cm)", "165"], ["Neck circumference (cm)", "32"], ["Waist circumference (cm)", "74"], ["Hip circumference (cm)", "98"]]) await form(page).getByLabel(label, { exact: true }).fill(value);
  await calculate(page);
  await expect(results(page).getByTestId("navy-percentage")).toHaveText("28.7%");
  await expect(results(page).getByTestId("fat-mass")).toHaveText("18.7 kg");
  await expect(results(page).getByTestId("fat-free-mass")).toHaveText("46.3 kg");
  await expect(results(page).getByTestId("bmi-percentage")).toHaveText("30.2%");
  await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("male");
  await expect(form(page).getByLabel("Hip circumference (cm)", { exact: true })).toHaveCount(0);
  await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("female");
  await expect(form(page).getByLabel("Hip circumference (cm)", { exact: true })).toHaveValue("98");
});

test("metric and imperial toggles retain full precision, including hip circumference", async ({ page }) => {
  await fillMale(page);
  await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("female");
  await form(page).getByLabel("Hip circumference (cm)", { exact: true }).fill("98");
  for (let i = 0; i < 3; i++) {
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await expect(form(page).getByLabel("Weight (lb)", { exact: true })).toHaveValue("154.323584");
    await expect(form(page).getByLabel("Neck circumference (in)", { exact: true })).toHaveValue("14.96063");
    await expect(form(page).getByLabel("Hip circumference (in)", { exact: true })).toHaveValue("38.582677");
    await form(page).getByLabel("Metric", { exact: true }).check();
    await expect(form(page).getByLabel("Height (cm)", { exact: true })).toHaveValue("175");
    await expect(form(page).getByLabel("Neck circumference (cm)", { exact: true })).toHaveValue("38");
    await expect(form(page).getByLabel("Hip circumference (cm)", { exact: true })).toHaveValue("98");
  }
  await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("male");
  await calculate(page);
  await expect(results(page).getByTestId("navy-percentage")).toHaveText("17.0%");
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await expect(results(page).getByTestId("fat-mass")).toHaveText("26.2 lb");
  await expect(results(page).getByTestId("navy-percentage")).toHaveText("17.0%");
});

test("direct imperial input uses inches for circumferences and feet plus inches for height", async ({ page }) => {
  await form(page).getByLabel("Imperial", { exact: true }).check();
  for (const [label, value] of [["Age (years)", "25"], ["Weight (lb)", "165"], ["Height (feet)", "5"], ["Height (inches)", "10"], ["Neck circumference (in)", "15"], ["Waist circumference (in)", "34"]]) await form(page).getByLabel(label, { exact: true }).fill(value);
  await calculate(page);
  await expect(results(page).getByTestId("navy-percentage")).toHaveText("17.5%");
  await expect(results(page).getByTestId("fat-mass")).toHaveText("28.9 lb");
  await expect(results(page).getByTestId("bmi-percentage")).toHaveText("18.0%");
});

test("invalid inputs and logarithm combinations show accessible errors", async ({ page }) => {
  await form(page).getByRole("button", { name: "Calculate body fat", exact: true }).click();
  await expect(form(page).getByRole("alert")).toBeFocused();
  for (const label of ["Age (years)", "Weight (kg)", "Height (cm)", "Neck circumference (cm)", "Waist circumference (cm)"]) await expect(form(page).getByLabel(label, { exact: true })).toHaveAttribute("aria-invalid", "true");
  await fillMale(page);
  await form(page).getByLabel("Age (years)", { exact: true }).fill("19");
  await form(page).getByRole("button", { name: "Calculate body fat", exact: true }).click();
  await expect(form(page).getByText(/Enter a whole-number age from 20 to 100/)).toBeVisible();
  await form(page).getByLabel("Age (years)", { exact: true }).fill("30");
  await form(page).getByLabel("Waist circumference (cm)", { exact: true }).fill("38");
  await form(page).getByRole("button", { name: "Calculate body fat", exact: true }).click();
  await expect(form(page).getByRole("alert")).toContainText("Waist must be greater than neck");
  await expect(results(page).getByTestId("navy-percentage")).toHaveCount(0);
  await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("female");
  await form(page).getByLabel("Neck circumference (cm)", { exact: true }).fill("80");
  await form(page).getByLabel("Waist circumference (cm)", { exact: true }).fill("30");
  await form(page).getByLabel("Hip circumference (cm)", { exact: true }).fill("40");
  await form(page).getByRole("button", { name: "Calculate body fat", exact: true }).click();
  await expect(form(page).getByRole("alert")).toContainText("Waist plus hip must be greater than neck");
});

test("impossible Navy estimates are withheld without replacing the BMI comparison", async ({ page }) => {
  await fillMale(page);
  await form(page).getByLabel("Waist circumference (cm)", { exact: true }).fill("39");
  await calculate(page);
  await expect(results(page).getByText("Navy estimate withheld", { exact: true })).toBeVisible();
  await expect(results(page).getByText(/outside the physically meaningful/)).toBeVisible();
  await expect(results(page).getByTestId("fat-mass")).toHaveCount(0);
  await expect(results(page).getByRole("img")).toHaveCount(0);
  await expect(results(page).getByTestId("bmi-percentage")).toHaveText("18.1%");
  await form(page).getByLabel("Height (cm)", { exact: true }).fill("100");
  await form(page).getByLabel("Neck circumference (cm)", { exact: true }).fill("20");
  await form(page).getByLabel("Waist circumference (cm)", { exact: true }).fill("250");
  await calculate(page);
  await expect(results(page).getByText(/Extreme estimate/).first()).toBeVisible();
});

test("keyboard submission, visible focus, and reset work", async ({ page }) => {
  await fillMale(page);
  await form(page).getByLabel("Waist circumference (cm)", { exact: true }).focus();
  await page.keyboard.press("Tab");
  const button = form(page).getByRole("button", { name: "Calculate body fat", exact: true });
  await expect(button).toBeFocused(); await expect(button).toHaveCSS("outline-style", "solid"); await expect(button).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter"); await expect(results(page)).toBeFocused();
  await form(page).getByRole("button", { name: "Reset", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(form(page).getByLabel("Age (years)", { exact: true })).toBeFocused();
  await expect(form(page).getByLabel("Neck circumference (cm)", { exact: true })).toHaveValue("");
  await expect(results(page).getByTestId("navy-percentage")).toHaveCount(0);
});

test("responsive form and visualization fit at mobile and desktop widths", async ({ page, isMobile }, testInfo) => {
  await fillMale(page); await calculate(page);
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(results(page).getByRole("img")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await results(page).screenshot({ path: testInfo.outputPath(`body-fat-${width}.png`) });
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("female");
    await expect(form(page).getByLabel("Hip circumference (in)", { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await form(page).getByLabel("Metric", { exact: true }).check();
    await form(page).getByLabel("Equation coefficient set", { exact: true }).selectOption("male");
    await calculate(page);
  }
});
