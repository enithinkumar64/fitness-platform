import {expect,test,type Page,type Locator} from '@playwright/test';
import {createRequire} from 'node:module';
const axePath=createRequire(`${process.cwd()}/package.json`).resolve('axe-core/axe.min.js');
const breakfast=(p:Page)=>p.getByRole('article',{name:'Breakfast',exact:true});
async function chooseApple(p:Page){await p.getByLabel('Search foods',{exact:true}).fill('Apples');await p.getByRole('button',{name:/^Apples, raw/}).click();}
async function addApple(p:Page){await chooseApple(p);await p.getByRole('button',{name:'Add food',exact:true}).click();await expect(p.getByRole('heading',{name:'Select a food to log',exact:true})).toBeVisible();}
async function observe(locator:Locator,name:string){await locator.evaluate((el,key)=>{
 const w=window as typeof window & {nutritionMutations?:Record<string,number>};w.nutritionMutations??={};w.nutritionMutations[key]=0;
 new MutationObserver(records=>{w.nutritionMutations![key]+=records.length;}).observe(el,{subtree:true,childList:true,characterData:true});
},name);}
async function changed(p:Page,name:string){await expect.poll(()=>p.evaluate(key=>(window as typeof window & {nutritionMutations:Record<string,number>}).nutritionMutations[key],name)).toBeGreaterThan(0);}
test.beforeEach(async({page})=>{await page.goto('/nutrition-tracker');await expect(page.getByRole('heading',{name:'Daily nutrition summary',exact:true})).toBeVisible();});

test('FF-11 repeated additions update the live region',async({page})=>{
 await addApple(page);const notice=page.getByRole('status').filter({hasText:/^Food added\.$/});await expect(notice).toBeVisible();await observe(notice,'add');
 await addApple(page);await expect(breakfast(page).getByRole('listitem')).toHaveCount(2);await changed(page,'add');
});

test('repeated edits and deletes refresh notices while preserving record IDs and serving snapshots',async({page})=>{
 await addApple(page);await addApple(page);
 const originals=await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-nutrition-v1')!).entries.map((e:{id:string;serving:unknown})=>({id:e.id,serving:e.serving})));
 const entry=breakfast(page).getByRole('listitem').first();
 await entry.getByRole('button',{name:/^Edit Apples/}).click();await page.getByLabel('Quantity',{exact:true}).fill('2');await page.getByRole('button',{name:'Save entry',exact:true}).click();await expect(breakfast(page)).toContainText('2 medium apples');
 const notice=page.getByRole('status').filter({hasText:/^Entry updated\.$/});await observe(notice,'edit');
 await breakfast(page).getByRole('listitem').filter({hasText:'2 medium apples'}).getByRole('button',{name:/^Edit Apples/}).click();await page.getByLabel('Quantity',{exact:true}).fill('3');await page.getByRole('button',{name:'Save entry',exact:true}).click();await changed(page,'edit');
 const edited=await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-nutrition-v1')!).entries);
 expect(edited.map((e:{id:string})=>e.id).sort()).toEqual(originals.map((e:{id:string})=>e.id).sort());
 for(const original of originals)expect(edited.find((e:{id:string})=>e.id===original.id).serving).toEqual(original.serving);
 await breakfast(page).getByRole('button',{name:/^Delete Apples/}).first().click();await expect(breakfast(page).getByRole('listitem')).toHaveCount(1);
 const deleted=page.getByRole('status').filter({hasText:/^Entry deleted\.$/});await observe(deleted,'delete');
 await breakfast(page).getByRole('button',{name:/^Delete Apples/}).click();await changed(page,'delete');await expect(breakfast(page).getByRole('listitem')).toHaveCount(0);
});

test('repeated validation and target errors are announced and preserve input',async({page})=>{
 await chooseApple(page);await page.getByLabel('Quantity',{exact:true}).fill('0');await page.getByRole('button',{name:'Add food',exact:true}).click();
 const error=page.getByRole('main').getByRole('alert');await expect(error).toBeFocused();await observe(error,'invalid');
 await page.getByRole('button',{name:'Add food',exact:true}).focus();await page.keyboard.press('Enter');await changed(page,'invalid');await expect(error).toBeFocused();await expect(page.getByLabel('Quantity',{exact:true})).toHaveValue('0');
 await page.getByLabel('Quantity',{exact:true}).fill('1');await page.getByText('Edit daily targets',{exact:true}).click();await page.getByLabel('Protein target (g)',{exact:true}).fill('-1');await page.getByRole('button',{name:'Save targets',exact:true}).click();
 const target=page.getByRole('main').getByRole('alert');await expect(target).toContainText('Use positive targets');await observe(target,'target-error');await page.getByRole('button',{name:'Save targets',exact:true}).click();await changed(page,'target-error');await expect(page.getByLabel('Protein target (g)',{exact:true})).toHaveValue('-1');
});

test('repeated synchronization and blocked edits are communicated without losing drafts',async({page,context})=>{
 await addApple(page);const b=await context.newPage();await b.goto('/nutrition-tracker');await expect(breakfast(b).getByRole('listitem')).toHaveCount(1);
 await breakfast(b).getByRole('button',{name:/^Edit Apples/}).click();await b.getByLabel('Quantity',{exact:true}).fill('4');
 await addApple(page);await expect(breakfast(b).getByRole('listitem')).toHaveCount(2);
 const sync=b.getByRole('status').filter({hasText:/^Changes synchronized from another tab/});await expect(sync).toBeVisible();await observe(sync,'sync');
 await addApple(page);await expect(breakfast(b).getByRole('listitem')).toHaveCount(3);await changed(b,'sync');await expect(b.getByLabel('Quantity',{exact:true})).toHaveValue('4');
 // Change the exact record B opened, not just a different entry.
 const snapshot=await b.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-nutrition-v1')!).entries[0].id);
 const original=breakfast(page).getByRole('listitem').filter({hasText:'1 medium apple'}).first();await original.getByRole('button',{name:/^Edit Apples/}).click();await page.getByLabel('Quantity',{exact:true}).fill('2');await page.getByRole('button',{name:'Save entry',exact:true}).click();await expect(breakfast(b)).toContainText('2 medium apples');
 await b.getByRole('button',{name:'Save entry',exact:true}).click();const warning=b.getByRole('main').getByRole('alert');await expect(warning).toContainText('changed or was deleted');await observe(warning,'conflict');
 await b.getByRole('button',{name:'Save entry',exact:true}).focus();await b.keyboard.press('Enter');await changed(b,'conflict');await expect(b.getByLabel('Quantity',{exact:true})).toHaveValue('4');
 const stored=await b.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-nutrition-v1')!));expect(stored.entries.find((e:{id:string})=>e.id===snapshot).quantity).toBe(2);
});

test('storage failures and repeated clears have accessible feedback with unchanged local-only behavior',async({page})=>{
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Quota');};});
 await addApple(page);const warning=page.getByRole('main').getByRole('alert');await expect(warning).toContainText('session only');await observe(warning,'storage');
 await addApple(page);await changed(page,'storage');await expect(breakfast(page).getByRole('listitem')).toHaveCount(2);
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Clear stored diary and targets',exact:true}).click();await expect(breakfast(page).getByRole('listitem')).toHaveCount(2);
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Clear stored diary and targets',exact:true}).click();await expect(breakfast(page).getByRole('listitem')).toHaveCount(0);
 const cleared=page.getByRole('status').filter({hasText:/^Stored diary and targets cleared\.$/});await expect(cleared).toBeVisible();await observe(cleared,'clear');
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Clear stored diary and targets',exact:true}).click();await changed(page,'clear');
 expect(await page.evaluate(()=>localStorage.getItem('formfuel-nutrition-v1'))).toBeNull();
});

test('repeated target saves announce completion; populated/error states retain keyboard access and pass axe',async({page},testInfo)=>{
 await page.getByText('Edit daily targets',{exact:true}).click();await page.getByLabel('Calories target (kcal)',{exact:true}).fill('2000');await page.getByRole('button',{name:'Save targets',exact:true}).click();
 const saved=page.getByRole('status').filter({hasText:/^Daily targets saved\.$/});await expect(saved).toBeVisible();await observe(saved,'targets');await page.getByRole('button',{name:'Save targets',exact:true}).click();await changed(page,'targets');
 await chooseApple(page);await page.keyboard.press('Tab');await page.getByLabel('Quantity',{exact:true}).focus();await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:'Serving size',exact:true})).toBeFocused();await expect(page.getByRole('combobox',{name:'Serving size',exact:true})).toHaveCSS('outline-width','3px');
 await page.getByRole('button',{name:'Add food',exact:true}).focus();await page.keyboard.press('Enter');await expect(breakfast(page).getByRole('listitem')).toHaveCount(1);
 await chooseApple(page);await page.getByLabel('Quantity',{exact:true}).fill('0');await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toBeFocused();
 await page.addScriptTag({path:axePath});
 for(const width of [320,1440]){
  await page.setViewportSize({width,height:900});const result=await page.evaluate(async()=> (window as unknown as {axe:typeof import('axe-core')}).axe.run(document.querySelector('main')!));
  await testInfo.attach(`nutrition-axe-${width}.json`,{body:Buffer.from(JSON.stringify({violations:result.violations,incomplete:result.incomplete})),contentType:'application/json'});
  expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
 }
});
