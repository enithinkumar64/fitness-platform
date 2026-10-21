import {expect,test} from '@playwright/test';
test('VAJRYA branding, accessible home link, footer and mobile menu preserve navigation',async({page,isMobile},testInfo)=>{
 for(const width of isMobile?[320,375]:[1440]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  const logo=page.getByRole('link',{name:'VAJRYA home',exact:true});await expect(logo).toHaveText('VAJRYA');await expect(logo).toHaveAttribute('href','/');
  await expect(page.getByRole('main')).toContainText("We're building VAJRYA");
  await expect(page.getByRole('contentinfo').getByText('VAJRYA',{exact:true})).toBeVisible();await expect(page.getByRole('contentinfo')).toContainText('© 2026 VAJRYA. All rights reserved.');await expect(page.getByRole('contentinfo')).toContainText('Train smarter. Fuel better. Stay free.');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content','VAJRYA');
  if(isMobile){await page.getByRole('button',{name:'Open navigation menu',exact:true}).click();const nav=page.getByRole('navigation',{name:'Primary mobile',exact:true});await expect(nav).toBeVisible();await nav.getByRole('link',{name:'Home',exact:true}).click();await expect(nav).toBeHidden();}
  await expect(page.getByRole('main')).not.toContainText(/form\s?fuel/i);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await page.getByRole('banner').screenshot({path:testInfo.outputPath(`vajrya-header-${width}.png`)});
 }
});
test('all existing page types and an exercise detail use the current metadata brand',async({page})=>{
 const routes=['/','/calculators/tdee','/calculators/macros','/calculators/bmi','/calculators/body-fat','/calculators/ideal-weight','/calculators/calories-burned','/calculators/one-rep-max','/exercises','/exercises/goblet-squat','/workout-planner','/nutrition-tracker','/progress-tracker'];
 for(const route of routes){const response=await page.goto(route);expect(response?.status()).toBe(200);await expect(page).toHaveTitle(/VAJRYA/);await expect(page).not.toHaveTitle(/form\s?fuel/i);await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content','VAJRYA');await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content',/form\s?fuel/i);const title=await page.title();await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',title);await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content',title);}
});
test('historical nutrition and progress data remain readable under unchanged keys',async({page})=>{
 await page.goto('/nutrition-tracker');await page.evaluate(()=>{
  const date=new Date();const local=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  localStorage.setItem('formfuel-nutrition-v1',JSON.stringify({version:1,targets:{calories:2000},entries:[{id:'legacy-brand-food',date:local,meal:'Breakfast',food:{id:'starter-171688',name:'Apples, raw',source:'FormFuel starter catalog · USDA FoodData Central',sourceId:'171688',dataType:'SR Legacy',per100g:{calories:52,protein:0.26,carbohydrates:13.81,fat:0.17}},grams:100}]}));
  localStorage.setItem('formfuel-progress-v1',JSON.stringify({version:1,weights:[{id:'legacy-brand-weight',sequence:1,date:'2026-10-01',note:'',weightKg:80}],measurements:[],strength:[]}));
 });
 const before=await page.evaluate(()=>localStorage.getItem('formfuel-nutrition-v1'));await page.reload();await page.getByRole('button',{name:'Edit Apples, raw',exact:true}).click();await expect(page.getByRole('main')).toContainText('VAJRYA starter catalog · USDA FoodData Central');await expect(page.getByRole('main')).not.toContainText(/form\s?fuel/i);expect(await page.evaluate(()=>localStorage.getItem('formfuel-nutrition-v1'))).toBe(before);
 await page.goto('/progress-tracker');await expect(page.getByRole('region',{name:'Body Weight',exact:true})).toContainText('80.00 kg');const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('formfuel-progress-v1')!));expect(stored.weights[0].id).toBe('legacy-brand-weight');expect(stored.weights[0].weightKg).toBe(80);
});
