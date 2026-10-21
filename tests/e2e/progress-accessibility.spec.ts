import {expect,test,type Page} from '@playwright/test';
import {createRequire} from 'node:module';
// Already present in the locked dependency tree; no additional package is needed.
const axePath=createRequire(`${process.cwd()}/package.json`).resolve('axe-core/axe.min.js');
const weight=(p:Page)=>p.getByRole('region',{name:'Body Weight',exact:true});
const measurements=(p:Page)=>p.getByRole('region',{name:'Body Measurements',exact:true});
const strength=(p:Page)=>p.getByRole('region',{name:'Strength Progress',exact:true});
async function addWeight(p:Page,value:string){
 const section=weight(p);await section.getByLabel('Weight',{exact:true}).fill(value);await section.getByLabel('Date',{exact:true}).fill('2026-10-01');await section.getByRole('button',{name:'Add weight',exact:true}).click();await expect(section.getByLabel('Weight',{exact:true})).toHaveValue('');
}
async function populate(p:Page){
 await addWeight(p,'80');
 const m=measurements(p);await m.getByLabel('Waist',{exact:true}).fill('80');await m.getByLabel('Chest',{exact:true}).fill('100');await m.getByLabel('Date',{exact:true}).fill('2026-10-01');await m.getByRole('button',{name:'Add measurements',exact:true}).click();await expect(m.getByRole('listitem')).toHaveCount(1);
 const s=strength(p);await s.getByRole('combobox',{name:'Exercise',exact:true}).selectOption('ex-barbell-bench-press');await s.getByLabel('Sets',{exact:true}).fill('3');await s.getByLabel('Repetitions per set',{exact:true}).fill('8');await s.getByLabel('Weight used',{exact:true}).fill('60');await s.getByRole('button',{name:'Add strength',exact:true}).click();await expect(s.getByRole('listitem')).toHaveCount(1);
}
test.beforeEach(async({page})=>{await page.goto('/progress-tracker');await expect(weight(page)).toBeVisible();});

test('FF-10: populated summaries retain valid term/value groups and pass available axe checks',async({page},testInfo)=>{
 await populate(page);
 await expect(weight(page).getByText('Latest logged weight',{exact:true}).locator('..').getByRole('definition')).toContainText('80.00 kg');
 await expect(weight(page).getByText('Latest logged weight',{exact:true}).locator('..').getByRole('definition')).toContainText('2026-10-01');
 await expect(measurements(page).locator('dl').first().getByText('Waist',{exact:true}).locator('..').getByRole('definition')).toContainText('Latest 2026-10-01 · Change 0.00 cm');
 await expect(measurements(page).locator('dl').first().getByText('Hips',{exact:true}).locator('..').getByRole('definition')).toHaveText('Not recorded');
 await expect(strength(page).getByRole('definition')).toHaveText(['60.00 kg','60.00 kg','76.00 kg']);
 await expect(page.locator('main dl > div > :not(dt):not(dd)')).toHaveCount(0);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Progress Tracker');
 await page.addScriptTag({path:axePath});
 for(const width of [320,1440]){
  await page.setViewportSize({width,height:900});
  const results=await page.evaluate(async()=>{
   const axe=(window as unknown as {axe:typeof import('axe-core')}).axe;
   return axe.run(document.querySelector('main')!);
  });
  await testInfo.attach(`progress-axe-${width}.json`,{body:Buffer.from(JSON.stringify({version:results.testEngine.version,violations:results.violations,incomplete:results.incomplete})),contentType:'application/json'});
  expect(results.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await page.getByRole('main').screenshot({path:testInfo.outputPath(`progress-populated-${width}.png`)});
 }
});

test('charts, data tables, edit/delete controls and validation remain keyboard accessible',async({page})=>{
 await populate(page);await page.keyboard.press('Tab');
 for(const section of [weight(page),measurements(page),strength(page)]){
  await expect(section.getByRole('img')).toHaveAccessibleName(/logged point.*Latest:/);
  const summary=section.locator('summary');await summary.focus();await expect(summary).toBeFocused();await expect(summary).toHaveCSS('outline-width','3px');
  await page.keyboard.press('Enter');await expect(section.getByRole('table')).toBeVisible();await expect(section.getByRole('columnheader',{name:/Value/})).toBeVisible();
  await page.keyboard.press('Space');await expect(section.getByRole('table')).toBeHidden();
 }
 const s=weight(page);const edit=s.getByRole('button',{name:'Edit weight 2026-10-01 entry 1',exact:true});await edit.focus();await expect(edit).toHaveCSS('outline-width','3px');await page.keyboard.press('Enter');await expect(s.getByRole('heading',{name:'Body Weight',exact:true})).toBeFocused();
 await s.getByLabel('Weight',{exact:true}).fill('-1');await s.getByRole('button',{name:'Save weight changes',exact:true}).focus();await page.keyboard.press('Enter');await expect(s.getByRole('alert')).toBeFocused();
 await s.getByLabel('Weight',{exact:true}).fill('81');await s.getByRole('button',{name:'Save weight changes',exact:true}).focus();await page.keyboard.press('Enter');await expect(s.getByRole('listitem')).toContainText('81.00 kg');
 const remove=s.getByRole('button',{name:'Delete weight 2026-10-01 entry 1',exact:true});await remove.focus();page.once('dialog',d=>d.dismiss());await page.keyboard.press('Enter');await expect(s.getByRole('listitem')).toHaveCount(1);
 await remove.focus();page.once('dialog',d=>d.accept());await page.keyboard.press('Enter');await expect(s.getByRole('listitem')).toHaveCount(0);await expect(s.getByRole('heading',{name:'Body Weight',exact:true})).toBeFocused();
});

test('FF-11: repeated saves and deletes create live-region updates without changing stored records',async({page})=>{
 await addWeight(page,'80');
 const status=page.getByRole('status').filter({hasText:'Progress entry saved.'});await expect(status).toBeVisible();
 await status.evaluate(el=>{
  const w=window as typeof window & {progressStatusMutations?:number};w.progressStatusMutations=0;
  new MutationObserver(records=>{w.progressStatusMutations!+=records.length;}).observe(el,{subtree:true,childList:true,characterData:true});
 });
 await addWeight(page,'81');await expect(weight(page).getByRole('listitem')).toHaveCount(2);
 await expect.poll(()=>page.evaluate(()=>(window as typeof window & {progressStatusMutations:number}).progressStatusMutations)).toBeGreaterThan(0);
 const originalIds=await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-progress-v1')!).weights.map((entry:{id:string})=>entry.id).sort());
 for(const value of ['82','83']){
  await page.evaluate(()=>{(window as typeof window & {progressStatusMutations:number}).progressStatusMutations=0;});
  await weight(page).getByRole('button',{name:'Edit weight 2026-10-01 entry 1',exact:true}).click();await weight(page).getByLabel('Weight',{exact:true}).fill(value);await weight(page).getByRole('button',{name:'Save weight changes',exact:true}).click();
  await expect(weight(page).getByRole('listitem').first()).toContainText(`${value}.00 kg`);
  await expect.poll(()=>page.evaluate(()=>(window as typeof window & {progressStatusMutations:number}).progressStatusMutations)).toBeGreaterThan(0);
 }
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-progress-v1')!).weights.map((entry:{id:string})=>entry.id).sort())).toEqual(originalIds);
 page.once('dialog',d=>d.accept());await weight(page).getByRole('button',{name:'Delete weight 2026-10-01 entry 1',exact:true}).click();await expect(weight(page).getByRole('listitem')).toHaveCount(1);
 await page.evaluate(()=>{(window as typeof window & {progressStatusMutations:number}).progressStatusMutations=0;});
 page.once('dialog',d=>d.accept());await weight(page).getByRole('button',{name:'Delete weight 2026-10-01 entry 2',exact:true}).click();await expect(weight(page).getByRole('listitem')).toHaveCount(0);
 await expect.poll(()=>page.evaluate(()=>(window as typeof window & {progressStatusMutations:number}).progressStatusMutations)).toBeGreaterThan(0);
 const store=await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-progress-v1')!));expect(store.version).toBe(1);expect(Object.keys(store).sort()).toEqual(['measurements','strength','version','weights']);
});

test('conflict alerts and repeated blocked-save notifications preserve the draft and saved data',async({page,context})=>{
 await addWeight(page,'80');const other=await context.newPage();await other.goto('/progress-tracker');await expect(weight(other)).toBeVisible();
 for(const p of [page,other])await weight(p).getByRole('button',{name:'Edit weight 2026-10-01 entry 1',exact:true}).click();
 await weight(page).getByLabel('Weight',{exact:true}).fill('81');await weight(other).getByLabel('Weight',{exact:true}).fill('82');
 await weight(page).getByRole('button',{name:'Save weight changes',exact:true}).click();await expect(weight(other).getByRole('listitem')).toContainText('81.00 kg');
 await weight(other).getByRole('button',{name:'Save weight changes',exact:true}).click();await expect(other.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');
 const status=other.getByRole('status').filter({hasText:'Progress change not saved. Review the message above; your input was kept.'});await expect(status).toBeVisible();
 await status.evaluate(el=>{
  const w=window as typeof window & {blockedStatusMutations?:number};w.blockedStatusMutations=0;
  new MutationObserver(records=>{w.blockedStatusMutations!+=records.length;}).observe(el,{subtree:true,childList:true,characterData:true});
 });
 await weight(other).getByRole('button',{name:'Save weight changes',exact:true}).focus();await other.keyboard.press('Enter');
 await expect.poll(()=>other.evaluate(()=>(window as typeof window & {blockedStatusMutations:number}).blockedStatusMutations)).toBeGreaterThan(0);
 await expect(weight(other).getByLabel('Weight',{exact:true})).toHaveValue('82');
 const saved=await other.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-progress-v1')!));expect(saved.weights).toHaveLength(1);expect(saved.weights[0].weightKg).toBe(81);
});
