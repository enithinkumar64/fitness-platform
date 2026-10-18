import { expect, test, type Page } from "@playwright/test";
const form = (page: Page) => page.getByRole("form", { name: "Macro calculator", exact: true });
const results = (page: Page) => page.getByRole("region", { name: "Your Daily Macro Targets", exact: true });
async function submit(page: Page) {
  await form(page).getByRole("button", { name: "Calculate macros", exact: true }).click();
}
async function measurements(page: Page) {
  await form(page).getByLabel("Age (years)").fill("30");
  await form(page).getByLabel("Weight (kg)").fill("70");
  await form(page).getByLabel("Height (cm)").fill("175");
}
test.beforeEach(async ({ page }) => { await page.goto("/calculators/macros"); });

test("body measurements automatically produce BMR, TDEE, and macros", async ({ page }) => {
  await expect(page).toHaveTitle("Free Goal-Guided Macro Calculator | FormFuel");
  await expect(form(page).getByLabel("Daily calorie target (kcal)")).toHaveCount(0);
  await measurements(page); await submit(page);
  await expect(results(page)).toBeFocused();
  for (const text of ["1648.8 kcal/day","1978.5 kcal/day","123.7 g/day","247.3 g/day","55.0 g/day","494.6 kcal/day · 25% of calories","989.3 kcal/day · 50% of calories"])
    await expect(results(page).getByText(text, { exact: true }).first()).toBeVisible();
  await expect(results(page).getByRole("figure", { name: "Daily macro distribution" })).toBeVisible();
});

test("goals retain their original example split as the initial Balanced plan", async ({ page }) => {
  await measurements(page);
  for (const [goal,split,calories] of [
    ["Gradual fat loss","Goal example: 30% protein, 40% carbs, 30% fat.","1728.5 kcal/day"],
    ["Gradual weight gain / muscle-building support","Goal example: 30% protein, 45% carbs, 25% fat.","2228.5 kcal/day"],
    ["Maintain weight","Goal example: 25% protein, 50% carbs, 25% fat.","1978.5 kcal/day"],
  ]) {
    await form(page).getByLabel(goal, { exact: true }).check();
    await submit(page);
    await expect(results(page).getByRole("tab",{name:"Balanced",exact:true})).toHaveAttribute("aria-selected","true");
    await expect(results(page).getByText(split,{exact:true})).toBeVisible();
    await expect(results(page).getByText(calories,{exact:true}).first()).toBeVisible();
  }
});

test("plan tabs change allocations without changing calories or goal", async ({ page }) => {
  await measurements(page); await submit(page);
  for (const [plan,grams] of [["Low Fat","272.0 g/day"],["Low Carb","87.9 g/day"],["High Protein","173.1 g/day"],["Balanced","247.3 g/day"]]) {
    const tab=results(page).getByRole("tab",{name:plan,exact:true}); await tab.click();
    await expect(tab).toHaveAttribute("aria-selected","true");
    await expect(results(page).getByText(grams,{exact:true}).first()).toBeVisible();
    await expect(results(page).getByText("1978.5 kcal/day",{exact:true})).toHaveCount(2);
    await expect(results(page).getByText("8278.0 kJ/day",{exact:true})).toBeVisible();
    await expect(results(page).getByText("Fitness goal: Maintain weight",{exact:true})).toBeVisible();
  }
});

test("Create Your Own validates custom percentages and hides stale allocations", async ({ page }) => {
  await measurements(page); await submit(page);
  await results(page).getByRole("tab",{name:"Create Your Own",exact:true}).click();
  const custom=page.getByRole("form",{name:"Custom macro percentages",exact:true});
  await custom.getByLabel("Protein (%)",{exact:true}).fill("40");
  await expect(results(page).getByRole("article")).toHaveCount(0);
  await custom.getByRole("button",{name:"Apply custom percentages"}).click();
  await expect(custom.getByRole("alert")).toBeFocused();
  await expect(custom.getByText(/must total 100%/)).toBeVisible();
  // Re-clicking the active tab must not restore stale targets.
  await results(page).getByRole("tab",{name:"Create Your Own",exact:true}).click();
  await expect(results(page).getByRole("article")).toHaveCount(0);
  await custom.getByLabel("Carbs (%)",{exact:true}).fill("35");
  await custom.getByRole("button",{name:"Apply custom percentages"}).click();
  await expect(results(page).getByText("197.8 g/day",{exact:true})).toBeVisible();
  await expect(results(page).getByText("173.1 g/day",{exact:true})).toBeVisible();
  await expect(results(page).getByText("55.0 g/day",{exact:true})).toBeVisible();
  await expect(results(page).getByText("1978.5 kcal/day",{exact:true})).toHaveCount(2);
  await custom.getByLabel("Protein (%)",{exact:true}).fill("");
  await custom.getByRole("button",{name:"Apply custom percentages"}).click();
  await expect(custom.getByLabel("Protein (%)",{exact:true})).toHaveAttribute("aria-invalid","true");
  await expect(results(page).getByRole("article")).toHaveCount(0);
});

test("activity changes clear stale results and preserve measurement workflow", async ({ page }) => {
  await measurements(page); await submit(page);
  await form(page).getByLabel("Activity level").selectOption("moderate");
  await expect(results(page).getByRole("article")).toHaveCount(0);
  await submit(page);
  await expect(results(page).getByText("2555.6 kcal/day",{exact:true})).toHaveCount(2);
});

test("metric and imperial switches preserve measurements and estimates", async ({ page }) => {
  await measurements(page);
  for (let i=0; i<3; i++) {
    await form(page).getByLabel("Imperial", { exact: true }).check();
    await expect(form(page).getByLabel("Weight (lb)")).toHaveValue("154.323584");
    await form(page).getByLabel("Metric", { exact: true }).check();
    await expect(form(page).getByLabel("Height (cm)")).toHaveValue("175");
  }
  await form(page).getByLabel("Imperial", { exact: true }).check();
  await form(page).getByLabel("Weight (lb)").fill("200");
  await form(page).getByLabel("Height (feet)").fill("6");
  await form(page).getByLabel("Height (inches)").fill("0");
  await submit(page);
  await expect(results(page).getByText("2286.2 kcal/day", { exact: true }).first()).toBeVisible();
});

test("invalid measurements still show accessible errors", async ({ page }) => {
  await submit(page);
  await expect(form(page).getByRole("alert")).toBeFocused();
  await expect(form(page).getByLabel("Age (years)")).toHaveAttribute("aria-invalid","true");
  await measurements(page);
  await form(page).getByLabel("Age (years)").fill("17");
  await submit(page);
  await expect(form(page).getByRole("alert")).toBeFocused();
  await expect(form(page).getByText(/whole-number age from 18/)).toBeVisible();
  await expect(results(page).getByRole("article")).toHaveCount(0);
});

test("screened gradual loss displays resting estimates but no actionable targets", async ({ page }) => {
  await form(page).getByLabel("Age (years)").fill("80");
  await form(page).getByLabel("Weight (kg)").fill("40");
  await form(page).getByLabel("Height (cm)").fill("140");
  await form(page).getByLabel("Formula coefficient").selectOption("female");
  await form(page).getByLabel("Gradual fat loss", { exact: true }).check();
  await submit(page);
  await expect(results(page).getByText(/This gradual fat-loss estimate is below/)).toBeVisible();
  await expect(results(page).getByText("714.0 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByText("856.8 kcal/day", { exact: true })).toBeVisible();
  await expect(results(page).getByRole("figure")).toHaveCount(0);
  await expect(results(page).getByText(/g\/day/)).toHaveCount(0);
  await expect(results(page).getByText("606.8 kcal/day", { exact: true })).toHaveCount(0);
  for(const name of ["Balanced","Low Fat","Low Carb","High Protein","Create Your Own"]) {
    await results(page).getByRole("tab",{name,exact:true}).click();
    await expect(results(page).getByRole("article")).toHaveCount(0);
    await expect(results(page).getByRole("figure")).toHaveCount(0);
    await expect(results(page).getByText("606.8 kcal/day",{exact:true})).toHaveCount(0);
    await expect(results(page).getByText(/This gradual fat-loss estimate is below/)).toBeVisible();
  }
});

test("TDEE links to revised workflow without personal or calorie URL data", async ({ page }) => {
  await page.goto("/calculators/tdee");
  const tdee=page.getByRole("form",{name:"TDEE calculator"});
  await tdee.getByLabel("Age (years)").fill("30");
  await tdee.getByLabel("Weight (kg)").fill("70");
  await tdee.getByLabel("Height (cm)").fill("175");
  await tdee.getByRole("button").click();
  const link=page.getByRole("link",{name:"Open goal-guided Macro Calculator",exact:true});
  await expect(link).toHaveAttribute("href","/calculators/macros");
  await link.click();
  await expect(page).toHaveURL(/\/calculators\/macros$/);
  await expect(form(page).getByLabel("Age (years)")).toHaveValue("");
  await page.goto("/calculators/macros?calories=2400&age=99");
  await expect(form(page).getByLabel("Age (years)")).toHaveValue("");
  await expect(results(page).getByRole("figure")).toHaveCount(0);
});

test("homepage navigation and keyboard submission work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name:"Free goal-guided macro calculator",exact:true }).click();
  await measurements(page);
  const button=form(page).getByRole("button",{name:"Calculate macros"});
  await form(page).getByLabel("Maintain weight", { exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-style","solid");
  await page.keyboard.press("Enter");
  await expect(results(page)).toBeFocused();
});

test("responsive results have no overflow and honor reduced motion", async ({ page, isMobile }, testInfo) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await measurements(page); await submit(page);
  for (const width of isMobile ? [320,390,768] : [1024,1440]) {
    await page.setViewportSize({width,height:900});
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await results(page).screenshot({path:testInfo.outputPath(`macros-${width}.png`)});
  }
});

test("nutrition tabs support arrow keys, Home, End, and visible focus", async ({ page }) => {
  await measurements(page); await submit(page);
  await expect(results(page)).toBeFocused();
  const balanced=results(page).getByRole("tab",{name:"Balanced",exact:true});
  await balanced.focus(); await page.keyboard.press("ArrowRight");
  const low=results(page).getByRole("tab",{name:"Low Fat",exact:true});
  await expect(low).toBeFocused(); await expect(low).toHaveAttribute("aria-selected","true");
  await expect(low).toHaveCSS("outline-style","solid");
  await page.keyboard.press("End");
  await expect(results(page).getByRole("tab",{name:"Create Your Own",exact:true})).toBeFocused();
  await expect(page.getByRole("form",{name:"Custom macro percentages"})).toBeVisible();
  await page.keyboard.press("Home");
  await expect(balanced).toBeFocused(); await expect(balanced).toHaveAttribute("aria-selected","true");
  await page.keyboard.press("Tab");
  await expect(results(page).getByRole("tabpanel")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(form(page).getByLabel("Metric",{exact:true})).toBeFocused();
});
