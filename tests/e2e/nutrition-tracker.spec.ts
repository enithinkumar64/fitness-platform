import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => { await page.goto('/nutrition-tracker'); await expect(page.getByRole('heading', { name: 'Daily nutrition summary' })).toBeVisible(); });
async function selectApple(page: import('@playwright/test').Page) {
    await page.getByLabel('Search foods', {exact:true}).fill('Apples');
    await page.getByRole('button', {name:/^Apples, raw/}).click();
    // Preserve original grams-workflow regression coverage despite the new household default.
    await page.getByRole('combobox', {name:'Serving size',exact:true}).selectOption('g');
    await page.getByLabel('Quantity',{exact:true}).fill('100');
}
test('starter meals, quantities, editing, deletion, totals and persistence', async ({ page }) => {
    for (const meal of ['Breakfast', 'Lunch', 'Dinner', 'Snacks']) {
        await selectApple(page);
        await page.getByRole('combobox', { name: 'Meal', exact: true }).selectOption(meal);
        await page.getByLabel('Quantity', { exact: true }).fill('100');
        await page.getByRole('button', { name: 'Add food', exact: true }).click();
    }
    const summary = page.getByRole('article', { name: 'Calories summary', exact: true });
    await expect(summary).toContainText('208.0');
    await page.reload();
    await expect(summary).toContainText('208.0');
    const breakfast = page.getByRole('article', { name: 'Breakfast', exact: true });
    await breakfast.getByRole('button', { name: /^Edit / }).click();
    await page.getByLabel('Quantity', { exact: true }).fill('200');
    await page.getByRole('combobox', { name: 'Meal', exact: true }).selectOption('Lunch');
    await page.getByRole('button', { name: 'Save entry', exact: true }).click();
    await expect(breakfast).toContainText('No foods logged');
    await expect(summary).toContainText('260.0');
    await page.getByRole('article', { name: 'Dinner', exact: true }).getByRole('button', { name: /^Delete / }).click();
    await expect(summary).toContainText('208.0');
    await page.getByRole('button', { name: 'Next day', exact: true }).click();
    await expect(summary).toContainText('0.0');
    await page.getByRole('button', { name: 'Previous day', exact: true }).click();
    await expect(summary).toContainText('208.0');
});
test('targets, invalid input and keyboard submission', async ({ page }) => { await page.getByText('Edit daily targets', { exact: true }).click(); await page.getByLabel('Calories target (kcal)', { exact: true }).fill('100'); await page.getByRole('button', { name: 'Save targets', exact: true }).click(); await selectApple(page); await page.getByLabel('Quantity', { exact: true }).fill('0'); await page.getByRole('button', { name: 'Add food', exact: true }).click(); await expect(page.getByRole('main').getByRole('alert')).toContainText('greater than 0'); await expect(page.getByRole('main').getByRole('alert')).toBeFocused(); await page.getByLabel('Quantity', { exact: true }).fill('300'); await page.getByRole('button', { name: 'Add food', exact: true }).focus(); await page.keyboard.press('Enter'); await expect(page.getByRole('article', { name: 'Calories summary' })).toContainText('56.0 kcal above target'); await expect(page.getByRole('progressbar', { name: 'Calories', exact: true })).toHaveAttribute('aria-valuenow', '100'); });
test('USDA unavailable and mocked detail flow', async ({ page }) => {
    await page.route('**/api/nutrition/search?*', r => r.fulfill({ status: 503, json: { error: 'USDA search is unavailable: FDC_API_KEY is not configured. The starter catalog still works.' } }));
    await page.getByLabel('Search foods', { exact: true }).fill('mock');
    await page.getByRole('button', { name: 'Search USDA FoodData Central', exact: true }).click();
    await expect(page.getByText(/FDC_API_KEY is not configured/)).toBeVisible();
    await page.route('**/api/nutrition/search?*', r => r.fulfill({ json: { foods: [{ sourceId: '999', name: 'Mock lentils', dataType: 'Foundation', brand: '' }] } }));
    await page.route('**/api/nutrition/food?*', r => r.fulfill({ json: { food: { id: 'usda-999', name: 'Mock lentils', source: 'USDA FoodData Central', sourceId: '999', dataType: 'Foundation', per100g: { calories: 100, protein: 8, carbohydrates: 15, fat: 2 } } } }));
    await page.getByRole('button', { name: 'Search USDA FoodData Central', exact: true }).click();
    await page.getByRole('button', { name: /Mock lentils · Foundation/ }).click();
    await expect(page.getByRole('heading', { name: 'Mock lentils', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Add food', exact: true }).click();
    await expect(page.getByRole('article', { name: 'Calories summary' })).toContainText('100.0');
});
test('corrupt storage is preserved and can be cleared', async ({ page }) => { await page.evaluate(() => localStorage.setItem('formfuel-nutrition-v1', '{bad')); await page.reload(); await expect(page.getByRole('main').getByRole('alert')).toContainText('has not been overwritten'); await selectApple(page); await page.getByRole('button', { name: 'Add food', exact: true }).click(); expect(await page.evaluate(() => localStorage.getItem('formfuel-nutrition-v1'))).toBe('{bad'); page.once('dialog',d=>d.accept()); await page.getByRole('button', { name: 'Clear stored diary and targets', exact: true }).click(); await expect(page.getByText('Stored diary and targets cleared.',{exact:true})).toBeVisible(); expect(await page.evaluate(() => localStorage.getItem('formfuel-nutrition-v1'))).toBeNull(); });
test('homepage and header navigation, 320px layout', async ({ page, isMobile }) => { await page.goto('/'); await page.getByRole('link', { name: 'Free Nutrition Tracker', exact: true }).click(); await expect(page).toHaveURL(/\/nutrition-tracker$/); if (isMobile)
    await page.getByRole('button', { name: 'Open navigation menu' }).click(); const nav = page.getByRole('navigation', { name: isMobile ? 'Primary mobile' : 'Primary', exact: true }); await expect(nav.getByRole('link', { name: 'Nutrition', exact: true })).toHaveAttribute('href', '/nutrition-tracker'); await page.setViewportSize({ width: 320, height: 850 }); await selectApple(page); await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0); });
test('invalid targets and incomplete USDA details never create diary entries',async({page})=>{
 await page.getByText('Edit daily targets',{exact:true}).click();await page.getByLabel('Protein target (g)',{exact:true}).fill('-2');await page.getByRole('button',{name:'Save targets',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('positive targets');
 await page.route('**/api/nutrition/search?*',r=>r.fulfill({json:{foods:[{sourceId:'900',name:'Incomplete food',dataType:'Branded',brand:'Test'}]}}));await page.route('**/api/nutrition/food?*',r=>r.fulfill({status:502,json:{error:'This record lacks complete per-100-g nutrition.'}}));await page.getByLabel('Search foods',{exact:true}).fill('incomplete');await page.getByRole('button',{name:'Search USDA FoodData Central',exact:true}).click();await page.getByRole('button',{name:/Incomplete food · Branded/}).click();await expect(page.getByText('This record lacks complete per-100-g nutrition.')).toBeVisible();await expect(page.getByRole('heading',{name:'Select a food to log',exact:true})).toBeVisible();
});
test('storage write failures retain current-session diary',async({page})=>{
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('Quota exceeded');};});await selectApple(page);await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('session only');await expect(page.getByRole('article',{name:'Calories summary'})).toContainText('52.0');
});
async function chooseFood(page:import('@playwright/test').Page, search:string, name:RegExp) {
 await page.getByLabel('Search foods',{exact:true}).fill(search);
 await page.getByRole('button',{name}).click();
}
test('two eggs and two apples use household units, live previews, editable quantities and persisted snapshots',async({page})=>{
 await chooseFood(page,'hard-boiled',/^Egg, whole, cooked, hard-boiled$/);
 const quantity=page.getByLabel('Quantity',{exact:true}),serving=page.getByRole('combobox',{name:'Serving size',exact:true});
 await expect(quantity).toHaveValue('1');await expect(serving).toHaveValue('usda-173424-portion-92500');
 await quantity.fill('2');const preview=page.getByRole('status',{name:'Nutrition preview'});await expect(preview).toContainText('100 g');await expect(preview).toContainText('155.0 kcal');await expect(preview).toContainText('12.6 g');
 await page.getByRole('button',{name:'Add food',exact:true}).click();const breakfast=page.getByRole('article',{name:'Breakfast',exact:true});await expect(breakfast).toContainText('2 large eggs · 100 g');
 await chooseFood(page,'Apples',/^Apples, raw/);await expect(serving).toHaveValue('usda-171688-portion-89193');await expect(serving.getByRole('option',{name:/egg/i})).toHaveCount(0);await quantity.fill('2');await expect(preview).toContainText('364 g');await expect(preview).toContainText('189.3 kcal');await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(breakfast).toContainText('2 medium apples · 364 g');
 await page.reload();await expect(breakfast).toContainText('2 large eggs');await expect(breakfast).toContainText('2 medium apples');await breakfast.getByRole('button',{name:/^Edit Apples/}).click();await expect(quantity).toHaveValue('2');await expect(serving).toHaveValue('usda-171688-portion-89193');await quantity.fill('1');await page.getByRole('button',{name:'Save entry',exact:true}).click();await expect(breakfast).toContainText('1 medium apple · 182 g');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-nutrition-v1')!));expect(stored.version).toBe(2);expect(stored.entries.find((e:{food:{sourceId:string}})=>e.food.sourceId==='171688').serving.gramsPerServing).toBe(182);
});
test('banana default, fractional rice cups and unit switching preserve gram equivalents',async({page})=>{
 const quantity=page.getByLabel('Quantity',{exact:true}),serving=page.getByRole('combobox',{name:'Serving size',exact:true}),preview=page.getByRole('status',{name:'Nutrition preview'});
 await chooseFood(page,'Bananas',/^Bananas, raw$/);await expect(serving).toHaveValue('usda-173944-portion-93515');await expect(preview).toContainText('118 g');await expect(preview).toContainText('105.0 kcal');await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(page.getByRole('article',{name:'Breakfast',exact:true})).toContainText('1 medium banana · 118 g');
 await chooseFood(page,'Rice',/^Rice, white, long-grain/);await quantity.fill('0.5');await expect(preview).toContainText('79 g');await expect(preview).toContainText('102.7 kcal');await serving.selectOption('g');await expect(quantity).toHaveValue('79');await serving.selectOption('usda-168878-portion-83928');await expect(quantity).toHaveValue('0.5');await quantity.fill('1');await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(page.getByRole('article',{name:'Breakfast',exact:true})).toContainText('1 cup · 158 g');
});
test('grams-only food, invalid household quantities, keyboard focus and 320px preview',async({page})=>{
 await page.setViewportSize({width:320,height:850});await chooseFood(page,'Soy protein',/^Soy protein isolate$/);const serving=page.getByRole('combobox',{name:'Serving size',exact:true}),quantity=page.getByLabel('Quantity',{exact:true});await expect(serving.getByRole('option')).toHaveCount(1);await expect(serving).toHaveValue('g');await expect(quantity).toHaveValue('100');
 await chooseFood(page,'hard-boiled',/^Egg, whole, cooked, hard-boiled$/);await quantity.fill('101');await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('5,000');await quantity.fill('2');await quantity.focus();await page.keyboard.press('Tab');await expect(serving).toBeFocused();await expect(serving).toHaveCSS('outline-width','3px');await serving.selectOption('g');await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:'Meal',exact:true})).toBeFocused();await expect(serving).toHaveValue('g');await expect(quantity).toHaveValue('100');await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});
test('mocked USDA details expose verified portions and preview before logging',async({page})=>{
 await page.route('**/api/nutrition/search?*',r=>r.fulfill({json:{foods:[{sourceId:'999',name:'Mock rice',dataType:'Survey (FNDDS)',brand:''}]}}));
 await page.route('**/api/nutrition/food?*',r=>r.fulfill({json:{food:{id:'usda-999',name:'Mock rice',source:'USDA FoodData Central',sourceId:'999',dataType:'Survey (FNDDS)',per100g:{calories:130,protein:2.69,carbohydrates:28.17,fat:0.28},servings:[{id:'usda-999-portion-1',label:'cup',pluralLabel:'cups',gramsPerServing:158,source:'USDA FoodData Central',sourceId:'999',reference:'https://fdc.nal.usda.gov/food-details/999/nutrients',qualifier:'Synthetic API test fixture: 1 cup = 158 g'}]}}}));
 await page.getByLabel('Search foods',{exact:true}).fill('mock rice');await page.getByRole('button',{name:'Search USDA FoodData Central',exact:true}).click();await page.getByRole('button',{name:/Mock rice · Survey/}).click();await expect(page.getByRole('status',{name:'Nutrition preview'})).toContainText('158 g');await expect(page.getByRole('link',{name:'Find food on USDA',exact:true})).toHaveAttribute('href','https://fdc.nal.usda.gov/food-search/');await expect(page.getByRole('link',{name:'Find portion source on USDA',exact:true})).toHaveAttribute('href','https://fdc.nal.usda.gov/food-search/');await expect(page.getByRole('main')).toContainText('FDC ID 999');await page.getByLabel('Quantity',{exact:true}).fill('0.5');await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(page.getByRole('article',{name:'Breakfast',exact:true})).toContainText('0.5 cups · 79 g');
});
test('legacy grams diary migrates and can be edited using supported household portions',async({page})=>{
 await page.evaluate(()=>localStorage.setItem('formfuel-nutrition-v1',JSON.stringify({version:1,targets:{},entries:[{id:'legacy',date:new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0'),meal:'Breakfast',food:{id:'starter-171688',name:'Apples, raw',source:'FormFuel starter catalog · USDA FoodData Central',sourceId:'171688',dataType:'SR Legacy',per100g:{calories:52,protein:0.26,carbohydrates:13.81,fat:0.17}},grams:100,consumed:{calories:52,protein:0.26,carbohydrates:13.81,fat:0.17}}]})));
 await page.reload();const breakfast=page.getByRole('article',{name:'Breakfast',exact:true});await expect(breakfast).toContainText('100 grams · 100 g');await breakfast.getByRole('button',{name:'Edit Apples, raw',exact:true}).click();await expect(page.getByLabel('Quantity',{exact:true})).toHaveValue('100');await page.getByRole('combobox',{name:'Serving size',exact:true}).selectOption('usda-171688-portion-89193');await page.getByLabel('Quantity',{exact:true}).fill('2');await page.getByRole('button',{name:'Save entry',exact:true}).click();await expect(breakfast).toContainText('2 medium apples · 364 g');await page.reload();await expect(breakfast).toContainText('2 medium apples · 364 g');
});

test('unsupported USDA nutrient basis cannot be selected or logged; starter catalog remains usable', async ({ page }) => {
    await page.route('**/api/nutrition/search?*', r => r.fulfill({ json: { foods: [
        { sourceId: '2133897', name: 'ORANGE JUICE', dataType: 'Branded', brand: '' },
    ] } }));
    await page.route('**/api/nutrition/food?*', r => r.fulfill({ status: 422, json: {
        error: 'This food cannot be imported reliably because USDA does not establish a gram-based nutrition basis. Volume-based or unknown servings cannot be converted to grams safely. Choose another food or the starter catalog.',
    } }));
    await page.getByLabel('Search foods', { exact: true }).fill('orange juice');
    await page.getByRole('button', { name: 'Search USDA FoodData Central', exact: true }).click();
    await page.getByRole('button', { name: /ORANGE JUICE · Branded/ }).click();
    await expect(page.getByText(/This food cannot be imported reliably/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Select a food to log', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Add food', exact: true }).click();
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Select a food first.');
    await expect(page.getByRole('article', { name: 'Calories summary', exact: true })).toContainText('0.0');
    await selectApple(page);
    await page.getByRole('button', { name: 'Add food', exact: true }).click();
    await expect(page.getByRole('article', { name: 'Calories summary', exact: true })).toContainText('52.0');
    await expect(page.getByRole('article', { name: 'Breakfast', exact: true })).not.toContainText('ORANGE JUICE');
});

test('USDA rate limit is explained separately and starter logging remains available',async({page})=>{
 await page.route('**/api/nutrition/search?*',route=>route.fulfill({status:429,headers:{'Retry-After':'60'},json:{error:'USDA search is busy or its request limit was reached. Please wait and try again, or use the starter catalog.'}}));
 await page.getByLabel('Search foods',{exact:true}).fill('apple');await page.getByRole('button',{name:'Search USDA FoodData Central',exact:true}).click();
 await expect(page.getByText(/USDA search is busy or its request limit was reached/)).toBeVisible();
 await selectApple(page);await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(page.getByRole('article',{name:'Calories summary',exact:true})).toContainText('52.0');
 await page.route('**/api/nutrition/search?*',route=>route.fulfill({json:{foods:[{sourceId:'999',name:'Mock protected food',dataType:'Foundation',brand:''}]}}));
 await page.route('**/api/nutrition/food?*',route=>route.fulfill({status:429,headers:{'Retry-After':'1'},json:{error:'USDA search is busy or its request limit was reached. Please wait and try again, or use the starter catalog.'}}));
 await page.getByRole('button',{name:'Search USDA FoodData Central',exact:true}).click();await page.getByRole('button',{name:/Mock protected food · Foundation/}).click();
 await expect(page.getByText(/USDA search is busy or its request limit was reached/)).toBeVisible();await expect(page.getByRole('heading',{name:'Select a food to log',exact:true})).toBeVisible();
});

test('real search and detail routes reject invalid inputs before any USDA request',async({request})=>{
 for(const path of ['/api/nutrition/search?q=a','/api/nutrition/food?id=0']){
  const response=await request.get(path);expect(response.status()).toBe(400);expect(response.headers()['cache-control']).toBe('private, no-store');
  const body=await response.json();expect(body.error).toMatch(/Search must|Invalid USDA food/);expect(body.food).toBeUndefined();
 }
});

test('FF-07 food and household attribution use clearly labeled USDA search without changing saved snapshots',async({page})=>{
 for(const [query,id] of [['Apples','171688'],['Bananas','173944'],['Rice, white','168878']]){
  await page.getByLabel('Search foods',{exact:true}).fill(query);
  await page.getByRole('button',{name:new RegExp(`^${query}`)}).click();
  await expect(page.getByRole('main')).toContainText(`FDC ID ${id}`);
  for(const name of ['Find food on USDA','Find portion source on USDA']){
   const link=page.getByRole('link',{name,exact:true});
   await expect(link).toHaveAttribute('href','https://fdc.nal.usda.gov/food-search/');
   await expect(link).toHaveAttribute('target','_blank');
   await expect(link).toHaveAttribute('rel','noopener noreferrer');
  }
  await expect(page.getByRole('main')).toContainText('opens Food Search; search by food name and match this ID');
  await expect(page.locator('main a[href*="/food-details/"]')).toHaveCount(0);
 }
 await page.getByLabel('Search foods',{exact:true}).fill('Apples');
 await page.getByRole('button',{name:/^Apples, raw/}).click();
 await page.getByLabel('Quantity',{exact:true}).fill('2');
 await page.getByRole('button',{name:'Add food',exact:true}).click();
 await expect(page.getByRole('button',{name:/^Edit Apples, raw/})).toBeVisible();
 const saved=await page.evaluate(()=>localStorage.getItem('formfuel-nutrition-v1'));
 const entry=JSON.parse(saved!).entries[0];
 expect(entry.food.sourceId).toBe('171688');expect(entry.grams).toBe(364);
 expect(entry.serving.gramsPerServing).toBe(182);
 expect(entry.serving.reference).toBe('https://fdc.nal.usda.gov/food-details/171688/nutrients');
 await page.reload();await page.getByRole('button',{name:/^Edit Apples, raw/}).click();
 await expect(page.getByRole('link',{name:'Find portion source on USDA',exact:true})).toHaveAttribute('href','https://fdc.nal.usda.gov/food-search/');
 expect(await page.evaluate(()=>localStorage.getItem('formfuel-nutrition-v1'))).toBe(saved);
});
