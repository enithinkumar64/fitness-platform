import { test, expect, type Page } from '@playwright/test';
const weight=(p:Page)=>p.getByRole('region',{name:'Body Weight',exact:true});
const breakfast=(p:Page)=>p.getByRole('article',{name:'Breakfast',exact:true});
async function open(p:Page,path:string){await p.goto(path);await expect(p.getByRole('button',{name:path==='/progress-tracker'?'Reload saved progress':'Reload saved diary',exact:true})).toBeVisible();}
async function apple(p:Page){await p.getByLabel('Search foods',{exact:true}).fill('Apples');await p.getByRole('button',{name:/^Apples, raw/}).click();}
async function addApple(p:Page){await apple(p);await p.getByRole('button',{name:'Add food',exact:true}).click();await expect(breakfast(p).getByRole('listitem')).toHaveCount(1);}
async function fillWeight(p:Page,value:string){await weight(p).getByLabel('Weight',{exact:true}).fill(value);}
async function addWeight(p:Page,value:string){await fillWeight(p,value);await weight(p).getByRole('button',{name:'Add weight',exact:true}).click();}
async function targets(p:Page,value:string){await p.getByText('Edit daily targets',{exact:true}).click();await p.getByLabel('Calories target (kcal)',{exact:true}).fill(value);}

test('two real tabs synchronize nutrition additions and merge simultaneous distinct additions',async({page,context})=>{
 await open(page,'/nutrition-tracker');const b=await context.newPage();await open(b,'/nutrition-tracker');
 await Promise.all([apple(page),apple(b)]);
 await Promise.all([page.getByRole('button',{name:'Add food',exact:true}).click(),b.getByRole('button',{name:'Add food',exact:true}).click()]);
 for(const p of [page,b])await expect(breakfast(p).getByRole('listitem')).toHaveCount(2);
 await b.reload();await expect(breakfast(b).getByRole('listitem')).toHaveCount(2);
});

test('nutrition concurrent edits and deletion preserve draft without overwriting or recreating records',async({page,context})=>{
 await open(page,'/nutrition-tracker');await addApple(page);const b=await context.newPage();await open(b,'/nutrition-tracker');
 for(const p of [page,b])await breakfast(p).getByRole('button',{name:/^Edit Apples/}).click();
 await page.getByLabel('Quantity',{exact:true}).fill('2');await b.getByLabel('Quantity',{exact:true}).fill('3');
 await page.getByRole('button',{name:'Save entry',exact:true}).click();await expect(breakfast(b)).toContainText('2 medium apples');
 await b.getByRole('button',{name:'Save entry',exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');await expect(b.getByLabel('Quantity',{exact:true})).toHaveValue('3');
 await breakfast(page).getByRole('button',{name:/^Delete Apples/}).click();await expect(breakfast(b).getByRole('listitem')).toHaveCount(0);
 await b.getByRole('button',{name:'Save entry',exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');
 await b.reload();await expect(breakfast(b).getByRole('listitem')).toHaveCount(0);
});

test('nutrition targets synchronize without replacing drafts and provide explicit recovery',async({page,context})=>{
 await open(page,'/nutrition-tracker');const b=await context.newPage();await open(b,'/nutrition-tracker');
 await targets(page,'2000');await targets(b,'2300');await page.getByRole('button',{name:'Save targets',exact:true}).click();
 await expect(b.getByRole('article',{name:'Calories summary',exact:true})).toContainText('Target 2000');await expect(b.getByLabel('Calories target (kcal)',{exact:true})).toHaveValue('2300');
 await b.getByRole('button',{name:'Save targets',exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');
 await b.getByRole('button',{name:'Use latest saved targets',exact:true}).click();await expect(b.getByLabel('Calories target (kcal)',{exact:true})).toHaveValue('2000');
 await b.getByLabel('Calories target (kcal)',{exact:true}).fill('2100');await b.getByRole('button',{name:'Save targets',exact:true}).click();await expect(page.getByRole('article',{name:'Calories summary',exact:true})).toContainText('Target 2100');
});

test('clear synchronizes and an open nutrition editor cannot restore a cleared entry',async({page,context})=>{
 await open(page,'/nutrition-tracker');await addApple(page);const b=await context.newPage();await open(b,'/nutrition-tracker');await breakfast(b).getByRole('button',{name:/^Edit Apples/}).click();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Clear stored diary and targets',exact:true}).click();await expect(breakfast(b).getByRole('listitem')).toHaveCount(0);
 await b.getByRole('button',{name:'Save entry',exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');
 expect(await page.evaluate(()=>localStorage.getItem('formfuel-nutrition-v1'))).toBeNull();
});

test('progress additions in both tabs survive; all three sections synchronize',async({page,context})=>{
 await open(page,'/progress-tracker');const b=await context.newPage();await open(b,'/progress-tracker');
 await Promise.all([fillWeight(page,'80'),fillWeight(b,'81')]);await Promise.all([weight(page).getByRole('button',{name:'Add weight',exact:true}).click(),weight(b).getByRole('button',{name:'Add weight',exact:true}).click()]);
 for(const p of [page,b])await expect(weight(p).getByRole('listitem')).toHaveCount(2);
 const m=page.getByRole('region',{name:'Body Measurements',exact:true});await m.getByLabel('Waist',{exact:true}).fill('80');await m.getByRole('button',{name:'Add measurements',exact:true}).click();await expect(b.getByRole('region',{name:'Body Measurements',exact:true}).getByRole('listitem')).toHaveCount(1);
 const s=b.getByRole('region',{name:'Strength Progress',exact:true});await s.getByRole('combobox',{name:'Exercise',exact:true}).selectOption('custom');await s.getByLabel('Custom exercise name',{exact:true}).fill('Custom row');await s.getByLabel('Sets',{exact:true}).fill('3');await s.getByLabel('Repetitions per set',{exact:true}).fill('8');await s.getByLabel('Weight used',{exact:true}).fill('30');await s.getByRole('button',{name:'Add strength',exact:true}).click();await expect(page.getByRole('region',{name:'Strength Progress',exact:true}).getByRole('listitem')).toHaveCount(1);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-progress-v1')!));expect(new Set([...saved.weights,...saved.measurements,...saved.strength].map((e:{sequence:number})=>e.sequence)).size).toBe(4);
});

test('progress stale editor cannot overwrite edits or resurrect a deleted record',async({page,context})=>{
 await open(page,'/progress-tracker');await addWeight(page,'80');await expect(weight(page).getByRole('listitem')).toHaveCount(1);const b=await context.newPage();await open(b,'/progress-tracker');
 for(const p of [page,b])await weight(p).getByRole('button',{name:/^Edit weight /}).click();
 await fillWeight(page,'81');await fillWeight(b,'82');await weight(page).getByRole('button',{name:'Save weight changes',exact:true}).click();await expect(weight(b).getByRole('listitem')).toContainText('81.00 kg');
 await weight(b).getByRole('button',{name:'Save weight changes',exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');await expect(weight(b).getByLabel('Weight',{exact:true})).toHaveValue('82');
 page.once('dialog',d=>d.accept());await weight(page).getByRole('button',{name:/^Delete weight /}).click();await expect(weight(b).getByRole('listitem')).toHaveCount(0);
 await weight(b).getByRole('button',{name:'Save weight changes',exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');
 await b.reload();await expect(weight(b).getByRole('listitem')).toHaveCount(0);
});

test('stale writes are guarded even when storage and focus events do not reach the tab',async({page,context})=>{
 await open(page,'/progress-tracker');const b=await context.newPage();await b.addInitScript(()=>{window.addEventListener('storage',e=>e.stopImmediatePropagation());window.addEventListener('focus',e=>e.stopImmediatePropagation());});await open(b,'/progress-tracker');
 await addWeight(page,'80');await expect(weight(page).getByRole('listitem')).toHaveCount(1);await addWeight(b,'81');await expect(weight(b).getByRole('listitem')).toHaveCount(2);await expect(weight(page).getByRole('listitem')).toHaveCount(2);
});

test('nutrition and progress changes stay isolated and session-only records are not overwritten by synchronization',async({page,context})=>{
 await open(page,'/nutrition-tracker');await addApple(page);const b=await context.newPage();await open(b,'/progress-tracker');await addWeight(b,'80');await expect(weight(b).getByRole('listitem')).toHaveCount(1);await expect(breakfast(page).getByRole('listitem')).toHaveCount(1);
 const c=await context.newPage();await open(c,'/nutrition-tracker');await c.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Quota');};});await apple(c);await c.getByRole('button',{name:'Add food',exact:true}).click();await expect(breakfast(c).getByRole('listitem')).toHaveCount(2);await expect(c.getByRole('main').getByRole('alert')).toContainText('session only');
 await apple(page);await page.getByRole('button',{name:'Add food',exact:true}).click();await expect(breakfast(page).getByRole('listitem')).toHaveCount(2);await expect(c.getByRole('main').getByRole('alert')).toContainText('session-only changes were kept');await expect(breakfast(c).getByRole('listitem')).toHaveCount(2);
});

test('without Web Locks writes fail closed and preserve input and existing saved data',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:undefined}));await open(page,'/progress-tracker');await addWeight(page,'80');await expect(page.getByRole('main').getByRole('alert')).toContainText('Safe saving requires Web Locks');await expect(weight(page).getByLabel('Weight',{exact:true})).toHaveValue('80');expect(await page.evaluate(()=>localStorage.getItem('formfuel-progress-v1'))).toBeNull();
});

for(const kind of ['measurement','strength'] as const){
 test(`${kind} editors retain input when another tab updates or deletes their record`,async({page,context})=>{
  await open(page,'/progress-tracker');
  const regionName=kind==='measurement'?'Body Measurements':'Strength Progress';
  const section=(p:Page)=>p.getByRole('region',{name:regionName,exact:true});
  const editName=kind==='measurement'?/^Edit measurements /:/^Edit strength /;
  const deleteName=kind==='measurement'?/^Delete measurements /:/^Delete strength /;
  const saveName=kind==='measurement'?'Save measurement changes':'Save strength changes';
  const fieldName=kind==='measurement'?'Waist':'Weight used';
  if(kind==='measurement'){
   await section(page).getByLabel('Waist',{exact:true}).fill('80');await section(page).getByRole('button',{name:'Add measurements',exact:true}).click();
  }else{
   await section(page).getByRole('combobox',{name:'Exercise',exact:true}).selectOption('custom');await section(page).getByLabel('Custom exercise name',{exact:true}).fill('Custom row');await section(page).getByLabel('Sets',{exact:true}).fill('3');await section(page).getByLabel('Repetitions per set',{exact:true}).fill('8');await section(page).getByLabel('Weight used',{exact:true}).fill('40');await section(page).getByRole('button',{name:'Add strength',exact:true}).click();
  }
  await expect(section(page).getByRole('listitem')).toHaveCount(1);const b=await context.newPage();await open(b,'/progress-tracker');
  for(const p of [page,b]){await section(p).getByRole('button',{name:editName}).click();await section(p).getByLabel(fieldName,{exact:true}).fill(p===page?'85':'90');}
  await page.getByRole('region',{name:regionName,exact:true}).getByRole('button',{name:saveName,exact:true}).click();
  await expect(section(b).getByRole('listitem')).toContainText(kind==='measurement'?'85.00 cm':'85.00 kg');
  await section(b).getByRole('button',{name:saveName,exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');await expect(section(b).getByLabel(fieldName,{exact:true})).toHaveValue('90');
  page.once('dialog',d=>d.accept());await section(page).getByRole('button',{name:deleteName}).click();await expect(section(b).getByRole('listitem')).toHaveCount(0);
  await section(b).getByRole('button',{name:saveName,exact:true}).click();await expect(b.getByRole('main').getByRole('alert')).toContainText('changed or was deleted');await b.reload();await expect(section(b).getByRole('listitem')).toHaveCount(0);
 });
}

test('a queued clear cannot erase a newer save committed while waiting for the lock',async({page,context})=>{
 await open(page,'/nutrition-tracker');await addApple(page);const b=await context.newPage();await open(b,'/nutrition-tracker');await apple(b);
 await page.evaluate(()=>{
  const w=window as typeof window & {releaseAuditLock?:()=>void};
  void navigator.locks.request('formfuel:formfuel-nutrition-v1',()=>new Promise<void>(resolve=>{w.releaseAuditLock=resolve;}));
 });
 await expect.poll(()=>page.evaluate(()=>typeof (window as typeof window & {releaseAuditLock?:()=>void}).releaseAuditLock)).toBe('function');
 await b.getByRole('button',{name:'Add food',exact:true}).click();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Clear stored diary and targets',exact:true}).click();
 await page.evaluate(()=>(window as typeof window & {releaseAuditLock:()=>void}).releaseAuditLock());
 await expect(page.getByRole('main').getByRole('alert')).toContainText('Nothing was cleared');
 for(const p of [page,b])await expect(breakfast(p).getByRole('listitem')).toHaveCount(2);
});
