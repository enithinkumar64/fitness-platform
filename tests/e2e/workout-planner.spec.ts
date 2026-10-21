import { expect, test, type Page } from "@playwright/test";
import { SPLITS } from "../../src/lib/workout-planner/splits";
const form = (page: Page) => page.getByRole("form",{name:"Workout planner preferences"});
const results = (page: Page) => page.getByRole("region",{name:"Your weekly workout plan",exact:true});
async function choose(page: Page, equipment="gym", splitId="fb-3", experience="beginner") {
  const split=SPLITS.find(s=>s.id===splitId)!;
  await form(page).getByLabel("Fitness goal",{exact:true}).selectOption("muscle");
  await form(page).getByLabel("Experience",{exact:true}).selectOption(experience);
  await form(page).getByLabel("Training days per week",{exact:true}).selectOption(String(split.days));
  await form(page).getByRole("radio",{name:split.name,exact:true}).check();
  await form(page).getByLabel("Equipment",{exact:true}).selectOption(equipment);
  if(equipment==="gym")for(const box of await form(page).getByRole("group",{name:"Equipment available at my gym",exact:true}).getByRole("checkbox").all())await box.check();
  else await form(page).getByRole("checkbox").check();
}
async function generate(page: Page){await form(page).getByRole("button",{name:"Generate Plan",exact:true}).click();}
test.beforeEach(async({page})=>{await page.goto("/workout-planner");});

test("metadata, homepage discovery, header navigation and calculator links are preserved",async({page,isMobile})=>{
  await expect(page).toHaveTitle("Free Workout Planner | VAJRYA");await page.goto("/");
  for(const slug of ["tdee","macros","bmi","body-fat","ideal-weight","calories-burned","one-rep-max"])await expect(page.getByRole("main").locator(`a[href='/calculators/${slug}']`)).toHaveCount(slug === "tdee" ? 2 : 1);
  await page.getByRole("main").getByRole("link",{name:"Free Workout Planner",exact:true}).click();
  if(isMobile)await page.getByRole("button",{name:"Open navigation menu"}).click();
  const nav=page.getByRole("navigation",{name:isMobile?"Primary mobile":"Primary",exact:true});
  await expect(nav.getByRole("link",{name:"Workouts",exact:true})).toHaveAttribute("aria-current","page");
  await nav.getByRole("link",{name:"Home",exact:true}).click();if(isMobile)await page.getByRole("button",{name:"Open navigation menu"}).click();await nav.getByRole("link",{name:"Workouts",exact:true}).click();await expect(page).toHaveURL(/\/workout-planner$/);
});

test("frequency reveals accessible split cards and changing days clears incompatible choices and results",async({page})=>{
  await expect(form(page).getByRole("radio")).toHaveCount(0);
  await choose(page);await generate(page);await expect(results(page)).toBeVisible();
  await form(page).getByLabel("Training days per week").selectOption("4");await expect(results(page)).toHaveCount(0);
  await expect(form(page).getByRole("radio")).toHaveCount(3);
  for(const radio of await form(page).getByRole("radio").all())await expect(radio).not.toBeChecked();
  await expect(form(page).getByRole("radio",{name:"Full Body A / B / A",exact:true})).toHaveCount(0);
  await generate(page);await expect(form(page).getByRole("alert")).toContainText("Choose a split");
  await form(page).getByRole("radio",{name:"Upper / Lower / Upper / Lower",exact:true}).check();await generate(page);await expect(results(page).getByTestId("selected-split")).toHaveText("Upper / Lower / Upper / Lower");
});

for(const split of SPLITS)test(`selected split ${split.id} is respected with all seven schedule days`,async({page})=>{
  await choose(page,"gym",split.id);await generate(page);
  await expect(results(page).getByTestId("selected-split")).toHaveText(split.name);
  const schedule=results(page).getByRole("region",{name:"Example seven-day schedule",exact:true});
  await expect(schedule.getByRole("listitem")).toHaveCount(7);await expect(schedule.getByRole("link")).toHaveCount(split.days);await expect(schedule.getByText("Recovery day",{exact:true})).toHaveCount(7-split.days);
  await expect(results(page).getByRole("article")).toHaveCount(split.days);
  await expect(results(page)).toContainText(split.tradeoffs);
});

test("curated A/B/A exercises, focus order and exercise detail links render correctly",async({page})=>{
  await choose(page);await generate(page);const heading=page.getByRole("heading",{name:"Your weekly workout plan",exact:true});await expect(heading).toBeFocused();
  const first=results(page).getByRole("article").first();
  await expect(first.getByTestId("program-exercise")).toHaveText(["Leg Press","Glute Bridge","Machine Chest Press","Seated Cable Row","Dead Bug"]);
  await expect(first).toContainText("2 sets × 8–12 reps");await expect(results(page)).toContainText("Week 2: B / A / B");await expect(results(page)).toContainText("not permanently saved");
  const positions=await page.evaluate(()=>[document.getElementById("plan-results-heading")!.getBoundingClientRect().top,document.querySelector("form")!.getBoundingClientRect().top]);expect(positions[0]).toBeLessThan(positions[1]);
  await first.getByTestId("program-exercise").first().click();await expect(page.getByRole("heading",{name:"Leg Press",exact:true,level:1})).toBeVisible();
});

test("home band plan works; missing band and unsupported Push templates explain exact gaps",async({page})=>{
  await choose(page,"bodyweight","fb-2");await form(page).getByRole("checkbox").uncheck();await generate(page);await expect(form(page).getByRole("alert")).toContainText("upper-body pulling");await expect(results(page)).toHaveCount(0);
  await form(page).getByRole("checkbox").check();await generate(page);await expect(results(page).getByTestId("program-exercise").filter({hasText:"Band Row"})).toHaveCount(2);
  const lines=await results(page).getByRole("article").locator("p").filter({hasText:"Equipment:"}).allTextContents();for(const line of lines)expect(line).toMatch(/Equipment: (Bodyweight|Resistance band)$/);
  await choose(page,"bodyweight","ppl-3");await generate(page);await expect(form(page).getByRole("alert")).toContainText("Choose Full Body or Upper/Lower");await expect(results(page)).toHaveCount(0);
});

test("dumbbell program asks for bench and uses only its approved ordered alternatives",async({page})=>{
  await choose(page,"dumbbells","ul-4","intermediate");await form(page).getByRole("checkbox").uncheck();await generate(page);await expect(form(page).getByRole("alert")).toContainText("stable exercise bench");await form(page).getByRole("checkbox").check();await generate(page);
  await expect(results(page).getByRole("article").first().getByTestId("program-exercise")).toHaveText(["Dumbbell Bench Press","One-Arm Dumbbell Row","Dumbbell Lateral Raise","Dumbbell Biceps Curl"]);
  const lines=await results(page).getByRole("article").locator("p").filter({hasText:"Equipment:"}).allTextContents();for(const line of lines)expect(line).not.toMatch(/Cable|Machine|Barbell|Rack/);
});

test("gym inventory is explicit and missing required equipment blocks a partial routine",async({page})=>{
  await choose(page);const inventory=form(page).getByRole("group",{name:"Equipment available at my gym",exact:true});
  for(const box of await inventory.getByRole("checkbox").all())await box.uncheck();await generate(page);await expect(form(page).getByRole("alert")).toContainText("equipment actually available");
  await inventory.getByRole("checkbox",{name:/Cable station/}).check();await generate(page);await expect(form(page).getByRole("alert")).toContainText("Main squat");await expect(results(page)).toHaveCount(0);
  await inventory.getByRole("checkbox",{name:/Chest press, leg press/}).check();await generate(page);await expect(results(page)).toBeVisible();await expect(results(page)).not.toContainText("Equipment: Dumbbells");
});

test("regeneration changes one approved slot, preserves split/order and shows meaningful alternatives",async({page})=>{
  await choose(page);await generate(page);
  const first=results(page).getByRole("article").first();const squat=first.getByTestId("program-slot").first();
  await squat.getByText("Approved alternatives for this slot",{exact:true}).click();await expect(squat.getByRole("link",{name:"Goblet Squat",exact:true})).toHaveAttribute("href","/exercises/goblet-squat");await expect(squat.getByRole("link",{name:"Barbell Back Squat",exact:true})).toHaveCount(0);
  const before=await results(page).getByTestId("program-exercise").allTextContents();await results(page).getByRole("button",{name:"Regenerate Variation"}).click();await expect(results(page).getByRole("status")).toContainText("Approved substitution: Leg Press → Goblet Squat");
  const after=await results(page).getByTestId("program-exercise").allTextContents();expect(after.map((name,index)=>name===before[index]?null:index).filter(index=>index!==null)).toEqual([0,10]);
  await expect(results(page).getByTestId("selected-split")).toHaveText("Full Body A / B / A");await expect(form(page).getByRole("radio",{name:"Full Body A / B / A",exact:true})).toBeChecked();
});

test("validation and reset clear preferences, split, inventory and stale results",async({page})=>{
  await generate(page);await expect(form(page).getByRole("alert")).toBeFocused();for(const label of ["Fitness goal","Experience","Equipment","Training days per week"])await expect(form(page).getByLabel(label,{exact:true})).toHaveAttribute("aria-invalid","true");
  await choose(page);await generate(page);await form(page).getByLabel("Fitness goal",{exact:true}).selectOption("strength");await expect(results(page)).toHaveCount(0);
  await form(page).getByRole("button",{name:"Reset",exact:true}).click();await expect(form(page).getByLabel("Fitness goal",{exact:true})).toBeFocused();for(const select of await form(page).getByRole("combobox").all())await expect(select).toHaveValue("");await expect(form(page).getByRole("radio")).toHaveCount(0);await expect(form(page).getByRole("checkbox")).toHaveCount(0);
});

test("keyboard split choice, results focus and 320px layout work with reduced motion",async({page,isMobile},testInfo)=>{
  await choose(page,"gym","pplul-5","intermediate");const firstRadio=form(page).getByRole("radio").first();await firstRadio.focus();await page.keyboard.press("ArrowRight");await expect(form(page).getByRole("radio").nth(1)).toBeChecked();await expect(form(page).getByRole("radio").nth(1)).toHaveCSS("outline-style","solid");
  for(const width of isMobile?[320,390]:[1024,1440]){await page.setViewportSize({width,height:900});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);await form(page).screenshot({path:testInfo.outputPath(`curated-form-${width}.png`)});}
  await form(page).getByRole("button",{name:"Generate Plan",exact:true}).focus();await page.keyboard.press("Enter");const heading=page.getByRole("heading",{name:"Your weekly workout plan",exact:true});await expect(heading).toBeFocused();await expect(heading).toHaveCSS("outline-style","solid");await page.emulateMedia({reducedMotion:"reduce"});
  for(const width of isMobile?[320,390,768]:[1024,1440]){await page.setViewportSize({width,height:900});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);await results(page).getByRole("article").first().screenshot({path:testInfo.outputPath(`curated-plan-${width}.png`)});}
});
