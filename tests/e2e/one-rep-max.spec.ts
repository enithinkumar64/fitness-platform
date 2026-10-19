import { expect, test, type Page } from "@playwright/test";

const form = (page: Page) => page.getByRole("form", { name: "One-rep max calculator", exact: true });
const results = (page: Page) => page.getByRole("region", { name: "Your estimated one-rep max", exact: true });
async function fillSet(page: Page) {
  await form(page).getByLabel("Weight lifted (kg)", { exact: true }).fill("60");
  await form(page).getByLabel("Completed repetitions", { exact: true }).fill("8");
}
async function calculate(page: Page) {
  await form(page).getByRole("button", { name: "Calculate 1RM", exact: true }).click();
  await expect(results(page)).toBeFocused();
}
test.beforeEach(async ({ page }) => { await page.goto("/calculators/one-rep-max"); });

test("page metadata, homepage navigation, and related links work", async ({ page }) => {
  await expect(page).toHaveTitle("Free One-Rep Max (1RM) Calculator | FormFuel");
  await expect(page.getByRole("heading", { name: "One-rep max calculator", exact: true })).toBeVisible();
  await expect(form(page).getByRole("spinbutton")).toHaveCount(2);
  const nav = page.getByRole("navigation", { name: "Related calculators" });
  await expect(nav.getByRole("link", { name: "Activity calories burned calculator" })).toHaveAttribute("href", "/calculators/calories-burned");
  await page.goto("/");
  await page.getByRole("link", { name: "Free one-rep max calculator", exact: true }).click();
  await expect(page).toHaveURL(/\/calculators\/one-rep-max$/);
});

test("60 kg for eight repetitions shows both formulas and moves results above the form", async ({ page }) => {
  await fillSet(page); await calculate(page);
  await expect(results(page).getByTestId("epley-estimate")).toHaveText("76.0 kg");
  await expect(results(page).getByTestId("brzycki-estimate")).toHaveText("74.5 kg");
  await expect(results(page).getByTestId("entered-set")).toHaveText("60.0 kg × 8 reps");
  expect(await results(page).evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('form[aria-label="One-rep max calculator"]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await form(page).getByLabel("Completed repetitions", { exact: true }).fill("9");
  await expect(results(page).getByTestId("epley-estimate")).toHaveCount(0);
});

test("percentage table contains all eleven deterministic Epley loads and labeled bars", async ({ page }) => {
  await fillSet(page); await calculate(page);
  const table = results(page).getByRole("table", { name: /Training-load percentage references/ });
  await expect(table.getByRole("row")).toHaveCount(12);
  for (const [percentage, load] of [[100,"76.0"],[95,"72.2"],[90,"68.4"],[85,"64.6"],[80,"60.8"],[75,"57.0"],[70,"53.2"],[65,"49.4"],[60,"45.6"],[55,"41.8"],[50,"38.0"]]) {
    await expect(table.getByTestId(`load-${percentage}`)).toHaveText(`${load} kg`);
    await expect(table.getByRole("img", { name: `${percentage}% of the Epley estimate: ${load} kg.`, exact: true })).toBeVisible();
    await expect(table.getByTestId(`bar-${percentage}`)).toHaveAttribute("style", `width: ${percentage}%;`);
  }
});

test("one repetition preserves the entered load and higher reps show an uncertainty note", async ({ page }) => {
  await fillSet(page);
  await form(page).getByLabel("Completed repetitions", { exact: true }).fill("1");
  await calculate(page);
  await expect(results(page).getByTestId("epley-estimate")).toHaveText("60.0 kg");
  await expect(results(page).getByTestId("brzycki-estimate")).toHaveText("60.0 kg");
  await expect(results(page).getByText(/both outputs equal your entered load/)).toBeVisible();
  await form(page).getByLabel("Completed repetitions", { exact: true }).fill("12");
  await calculate(page);
  await expect(results(page).getByTestId("epley-estimate")).toHaveText("84.0 kg");
  await expect(results(page).getByTestId("brzycki-estimate")).toHaveText("86.4 kg");
  await expect(results(page).getByText(/Higher-repetition estimate/)).toBeVisible();
});

test("unit switching preserves measurements and updates every result unit; direct pounds work", async ({ page }) => {
  await fillSet(page); await calculate(page);
  for (let i = 0; i < 3; i++) {
    await form(page).getByLabel("Pounds (lb)", { exact: true }).check();
    await expect(form(page).getByLabel("Weight lifted (lb)", { exact: true })).toHaveValue("132.277357");
    await expect(results(page).getByTestId("epley-estimate")).toHaveText("167.6 lb");
    await expect(results(page).getByTestId("load-50")).toHaveText("83.8 lb");
    await form(page).getByLabel("Kilograms (kg)", { exact: true }).check();
    await expect(form(page).getByLabel("Weight lifted (kg)", { exact: true })).toHaveValue("60");
  }
  await expect(results(page).getByTestId("epley-estimate")).toHaveText("76.0 kg");
  await form(page).getByLabel("Pounds (lb)", { exact: true }).check();
  await form(page).getByLabel("Weight lifted (lb)", { exact: true }).fill("100");
  await calculate(page);
  await expect(results(page).getByTestId("epley-estimate")).toHaveText("126.7 lb");
  await expect(results(page).getByTestId("brzycki-estimate")).toHaveText("124.1 lb");
  await expect(results(page).getByTestId("entered-set")).toHaveText("100.0 lb × 8 reps");
});

test("invalid inputs show accessible errors and cannot leave stale results", async ({ page }) => {
  await form(page).getByRole("button", { name: "Calculate 1RM", exact: true }).click();
  await expect(form(page).getByRole("alert")).toBeFocused();
  for (const label of ["Weight lifted (kg)", "Completed repetitions"]) await expect(form(page).getByLabel(label, { exact: true })).toHaveAttribute("aria-invalid", "true");
  await fillSet(page); await calculate(page);
  for (const [weight, repetitions] of [["0","0"],["-1","13"],["1001","1.5"]]) {
    await form(page).getByLabel("Weight lifted (kg)", { exact: true }).fill(weight);
    await form(page).getByLabel("Completed repetitions", { exact: true }).fill(repetitions);
    await form(page).getByRole("button", { name: "Calculate 1RM", exact: true }).click();
    await expect(form(page).getByText(/Enter a lifted weight from 0.1 to 1,000/)).toBeVisible();
    await expect(form(page).getByText(/Enter a whole number of completed repetitions/)).toBeVisible();
    await expect(results(page).getByTestId("epley-estimate")).toHaveCount(0);
  }
});

test("keyboard submission, visible focus, and reset work", async ({ page }) => {
  await fillSet(page);
  await form(page).getByLabel("Completed repetitions", { exact: true }).focus();
  await page.keyboard.press("Tab");
  const button = form(page).getByRole("button", { name: "Calculate 1RM", exact: true });
  await expect(button).toBeFocused(); await expect(button).toHaveCSS("outline-style", "solid"); await expect(button).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter"); await expect(results(page)).toBeFocused();
  await form(page).getByRole("button", { name: "Reset", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(form(page).getByLabel("Weight lifted (kg)", { exact: true })).toBeFocused();
  await expect(form(page).getByLabel("Weight lifted (kg)", { exact: true })).toHaveValue("");
  await expect(form(page).getByLabel("Completed repetitions", { exact: true })).toHaveValue("");
  await expect(results(page).getByRole("table")).toHaveCount(0);
});

test("results, table, and form fit mobile and desktop without overflow", async ({ page, isMobile }, testInfo) => {
  await fillSet(page); await calculate(page);
  for (const width of isMobile ? [320, 390, 768] : [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(results(page).getByRole("img")).toHaveCount(11);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await results(page).screenshot({ path: testInfo.outputPath(`one-rep-max-${width}.png`) });
    await form(page).getByLabel("Pounds (lb)", { exact: true }).check();
    await expect(results(page).getByTestId("load-100")).toHaveText("167.6 lb");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await form(page).screenshot({ path: testInfo.outputPath(`one-rep-max-form-${width}.png`) });
    await form(page).getByLabel("Kilograms (kg)", { exact: true }).check();
  }
});
