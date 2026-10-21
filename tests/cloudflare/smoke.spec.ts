import { test, expect } from '@playwright/test';
import { EXERCISES } from '../../src/lib/exercises/exercises';
test('all public routes work in workerd and unknown guides return 404',async({request})=>{
  const paths=['/',...['tdee','macros','bmi','body-fat','ideal-weight','calories-burned','one-rep-max'].map(slug=>`/calculators/${slug}`),'/exercises','/workout-planner','/nutrition-tracker','/progress-tracker',...EXERCISES.map(exercise=>`/exercises/${exercise.slug}`)];
  expect(paths).toHaveLength(112);
  for(const path of paths)expect((await request.get(path)).status(),path).toBe(200);
  expect((await request.get('/exercises/not-a-real-exercise')).status()).toBe(404);
});
test('both USDA endpoints fail safely without a key and retain validation',async({request})=>{
  for(const path of ['/api/nutrition/search?q=apple','/api/nutrition/food?id=171688']){
    const response=await request.get(path);expect(response.status()).toBe(503);expect((await response.json()).error).toContain('starter catalog still works');
  }
  expect((await request.get('/api/nutrition/food?id=bad')).status()).toBe(400);
});
test('unconfigured hostname keeps the Worker out of the index',async({page,request})=>{
  await page.goto('/');await expect(page).toHaveTitle(/VAJRYA/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('<loc>');
});
test('starter food logging persists in workerd at mobile width',async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.goto('/nutrition-tracker');
  await page.getByLabel('Search foods',{exact:true}).fill('Apples');await page.getByRole('button',{name:/^Apples, raw/}).click();
  await page.getByLabel('Quantity',{exact:true}).fill('2');await page.getByRole('button',{name:'Add food',exact:true}).click();
  await expect(page.getByRole('article',{name:'Breakfast',exact:true})).toContainText('364 g');
  await page.reload();await expect(page.getByRole('article',{name:'Breakfast',exact:true})).toContainText('364 g');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);
});
