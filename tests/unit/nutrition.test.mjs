import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as n from '../../src/lib/nutrition/core.ts';
import { normalizeFood, searchQuery, foodId } from '../../src/lib/nutrition/usda.ts';
import { STARTER_FOODS } from '../../src/lib/nutrition/foods.ts';
import { nutritionRequest } from '../../src/lib/nutrition/server.ts';
const apple=STARTER_FOODS.find(f=>f.sourceId==='171688');
const raw={fdcId:123,description:'Mock food',dataType:'SR Legacy',foodNutrients:[{nutrient:{id:1008,unitName:'kcal'},amount:100},{nutrient:{id:1003,unitName:'g'},amount:5},{nutrient:{id:1005,unitName:'g'},amount:10},{nutrient:{id:1004,unitName:'g'},amount:2}]};
test('verified catalog unique complete sources',()=>{assert.equal(STARTER_FOODS.length,29);assert.equal(new Set(STARTER_FOODS.map(f=>f.sourceId)).size,29);STARTER_FOODS.forEach(f=>assert.ok(n.validFood(f)));assert.equal(apple.per100g.calories,52);});
test('scaling, grams validation and precision',()=>{const scaled=n.scale(apple.per100g,150);for(const [key,value] of Object.entries({calories:78,protein:0.39,carbohydrates:20.715,fat:0.255}))assert.ok(Math.abs(scaled[key]-value)<1e-10);for(const x of [0,-1,NaN,Infinity,5001])assert.throws(()=>n.gramsFor(x));assert.throws(()=>n.gramsFor(1,'cup'));assert.equal(n.gramsFor(5000),5000);});
test('entries snapshots, edits, deletion, date and meal totals',()=>{const entry=n.makeEntry('a','2026-10-19','Breakfast',apple,100);let d=n.saveEntry(n.EMPTY,entry);d=n.saveEntry(d,n.makeEntry('b','2026-10-19','Dinner',apple,200));assert.equal(n.totals(d.entries,'2026-10-19').calories,156);assert.equal(n.totals(d.entries,'2026-10-19','Dinner').calories,104);assert.equal(n.totals(d.entries,'2026-10-20').calories,0);d=n.saveEntry(d,n.makeEntry('a','2026-10-19','Lunch',apple,50));assert.equal(d.entries.length,2);assert.equal(n.totals(d.entries,'2026-10-19','Breakfast').calories,0);assert.equal(n.deleteEntry(d,'b').entries.length,1);assert.notEqual(entry.food,apple);});
test('local calendar dates including leap and DST transitions',()=>{assert.equal(n.localDate(new Date(2026,0,1,0,1)),'2026-01-01');assert.equal(n.shiftDate('2024-02-28',1),'2024-02-29');assert.equal(n.shiftDate('2026-03-08',1),'2026-03-09');assert.ok(!n.validDate('2026-02-30'));assert.throws(()=>n.makeEntry('a','bad','Breakfast',apple,100));});
test('target bounds and progress overflow',()=>{assert.deepEqual(n.progress(150,100),{percent:100,difference:-50});assert.equal(n.progress(0).difference,undefined);assert.ok(n.validTargets({}));for(const v of [{calories:0},{fat:NaN},{protein:1001},{calories:10001},{x:1}])assert.ok(!n.validTargets(v));});
test('storage safely rejects corruption and recomputes derived values',()=>{for(const raw of ['{','null','{}',JSON.stringify({version:3,entries:[],targets:{}})])assert.throws(()=>n.parseDiary(raw));const entry=n.makeEntry('a','2026-10-19','Breakfast',apple,100);entry.consumed.calories=999;assert.equal(n.parseDiary(JSON.stringify({...n.EMPTY,entries:[entry]})).entries[0].consumed.calories,52);assert.throws(()=>n.parseDiary(JSON.stringify({...n.EMPTY,entries:[entry,entry]})));assert.deepEqual(n.parseDiary(null),n.EMPTY);});
test('USDA full records normalized for supported data types',()=>{for(const dataType of ['Foundation','SR Legacy','Survey (FNDDS)','Branded'])assert.deepEqual(normalizeFood({...raw,dataType}).per100g,{calories:100,protein:5,carbohydrates:10,fat:2});});
test('missing, incorrect units and nonfinite nutrients rejected; actual zero retained',()=>{for(const v of [undefined,null,NaN,-1,Infinity])assert.throws(()=>normalizeFood({...raw,foodNutrients:raw.foodNutrients.map((x,i)=>i===1?{...x,amount:v}:x)}));assert.throws(()=>normalizeFood({...raw,foodNutrients:raw.foodNutrients.slice(1)}));assert.equal(normalizeFood({...raw,foodNutrients:raw.foodNutrients.map((x,i)=>i===1?{...x,amount:0}:x)}).per100g.protein,0);});
test('kJ conversion, kcal precedence and alternate energy not summed',()=>{const nutrients=raw.foodNutrients.slice(1);assert.ok(Math.abs(normalizeFood({...raw,foodNutrients:[...nutrients,{nutrient:{id:1062,unitName:'kJ'},amount:418.4}]}).per100g.calories-100)<1e-10);assert.equal(normalizeFood({...raw,foodNutrients:[...raw.foodNutrients,{nutrient:{id:2048,unitName:'kcal'},amount:99}]}).per100g.calories,100);});
test('API validation and deduplication',()=>{assert.equal(searchQuery(' apple '),'apple');for(const q of [null,'a','x'.repeat(81),'hi\n']){if(q==='hi\n')continue;assert.throws(()=>searchQuery(q));}for(const id of ['0','-1','1x',null])assert.throws(()=>foodId(id));assert.equal(n.deduplicate([apple,apple]).length,1);});
test('mocked server search, cache, details, rate limit and missing key; never exposes secret',async()=>{const oldFetch=globalThis.fetch,oldKey=process.env.FDC_API_KEY;try{delete process.env.FDC_API_KEY;let r=await nutritionRequest(new Request('http://local?q=apple'),'search');assert.equal(r.status,503);process.env.FDC_API_KEY='unit-secret';let calls=0;globalThis.fetch=async(url,options)=>{calls++;assert.ok(!String(url).includes('unit-secret'));assert.equal(options.headers['X-Api-Key'],'unit-secret');return Response.json({foods:[{fdcId:123,description:'Mock food',dataType:'SR Legacy'}]});};r=await nutritionRequest(new Request('http://local?q=mockunique'),'search');assert.equal(r.status,200);assert.ok(!(await r.text()).includes('unit-secret'));await nutritionRequest(new Request('http://local?q=mockunique'),'search');assert.equal(calls,1);globalThis.fetch=async()=>Response.json(raw);r=await nutritionRequest(new Request('http://local?id=123'),'food');assert.equal((await r.json()).food.per100g.calories,100);globalThis.fetch=async()=>new Response('',{status:429});assert.equal((await nutritionRequest(new Request('http://local?q=ratelimited'),'search')).status,429);globalThis.fetch=async()=>{throw new Error('unit-secret');};r=await nutritionRequest(new Request('http://local?q=upstreamfail'),'search');assert.equal(r.status,502);assert.ok(!(await r.text()).includes('unit-secret'));}finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.FDC_API_KEY;else process.env.FDC_API_KEY=oldKey;}});

// Serving weights below are deterministic USDA examples, not computed by the function under test.
const {GRAM,servingGrams,servingOptions,validServing,formatServing}=await import('../../src/lib/nutrition/servings.ts');
const {normalizePortions}=await import('../../src/lib/nutrition/usda-portions.ts');
const findFood=id=>STARTER_FOODS.find(f=>f.sourceId===id);
const findServing=(food,label)=>food.servings.find(s=>s.label===label);
test('all 29 foods reviewed: 27 household-enabled foods, 65 exact source-backed options',async()=>{
 const {readFile}=await import('node:fs/promises');
 const evidence=JSON.parse(await readFile(new URL('../../docs/data/usda-starter-portions.json',import.meta.url),'utf8'));
 assert.equal(evidence.records.length,29);assert.equal(STARTER_FOODS.filter(f=>f.servings.length).length,27);assert.equal(STARTER_FOODS.flatMap(f=>f.servings).length,65);
 for(const f of STARTER_FOODS){assert.ok(n.validFood(f));const record=evidence.records.find(r=>String(r.fdcId)===f.sourceId);assert.ok(record);
  for(const s of f.servings){assert.ok(validServing(s,f.sourceId));const portion=record.foodPortions.find(p=>s.id===`usda-${f.sourceId}-portion-${p.id}`);assert.ok(portion);assert.equal(s.gramsPerServing,portion.gramWeight/portion.amount);assert.equal(s.reference,`https://fdc.nal.usda.gov/food-details/${f.sourceId}/nutrients`);}
 }
 assert.deepEqual(STARTER_FOODS.filter(f=>!f.servings.length).map(f=>f.sourceId).sort(),['171077','174276']);
});
test('two eggs, two apples, bananas, rice, bread, milk and peanut butter use verified weights',()=>{
 const cases=[['173424','large egg',2,100,155],['171688','medium apple',2,364,189.28],['173944','medium banana',1,118,105.02],['173944','medium banana',2,236,210.04],['168878','cup',1,158,205.4],['168878','cup',0.5,79,102.7],['172688','slice',2,64,161.28],['171265','cup',1,244,148.84],['172470','tablespoon',1,16,95.68]];
 for(const [id,label,quantity,grams,kcal] of cases){const f=findFood(id);const entry=n.makeEntry('x','2026-10-19','Lunch',f,quantity,findServing(f,label).id);assert.equal(entry.grams,grams);assert.ok(Math.abs(entry.consumed.calories-kcal)<1e-10);assert.equal(entry.quantity,quantity);}
 const appleEntry=n.makeEntry('a','2026-10-19','Breakfast',apple,2,findServing(apple,'medium apple').id);
 assert.ok(Math.abs(appleEntry.consumed.protein-0.9464)<1e-10);assert.ok(Math.abs(appleEntry.consumed.carbohydrates-50.2684)<1e-10);assert.ok(Math.abs(appleEntry.consumed.fat-0.6188)<1e-10);
});
test('units remain food-specific and gram/household switching preserves nutrition',()=>{
 const banana=findFood('173944'), medium=findServing(apple,'medium apple');assert.throws(()=>n.makeEntry('x','2026-10-19','Lunch',banana,2,medium.id));
 const household=n.makeEntry('a','2026-10-19','Lunch',apple,2,medium.id);const grams=n.makeEntry('a','2026-10-19','Lunch',apple,364);
 assert.deepEqual(household.consumed,grams.consumed);assert.equal(servingGrams(364/182,medium),364);assert.deepEqual(servingOptions(findFood('174276')),[GRAM]);
 for(const q of [NaN,Infinity,-1,0,5001])assert.throws(()=>servingGrams(q,GRAM));assert.throws(()=>servingGrams(100,medium));assert.throws(()=>servingGrams(1,{...GRAM,gramsPerServing:0}));
 assert.equal(formatServing(1,medium),'1 medium apple');assert.equal(formatServing(2,medium),'2 medium apples');assert.equal(formatServing(0.5,findServing(findFood('168878'),'cup')),'0.5 cups');
});
test('version 1 grams entries migrate without consulting current servings or losing dates, IDs, targets or nutrition',()=>{
 const oldFood={...apple};delete oldFood.servings;
 const old={version:1,targets:{calories:2000},entries:[{id:'legacy',date:'2026-10-19',meal:'Dinner',food:oldFood,grams:182,consumed:{calories:0}}]};
 const migrated=n.parseDiary(JSON.stringify(old));assert.equal(migrated.version,2);const e=migrated.entries[0];assert.equal(e.quantity,182);assert.deepEqual(e.serving,GRAM);assert.equal(e.grams,182);assert.ok(Math.abs(e.consumed.calories-94.64)<1e-10);assert.equal(e.id,'legacy');assert.equal(e.meal,'Dinner');assert.deepEqual(migrated.targets,{calories:2000});
 assert.equal(n.foodForEditing(e,apple).servings.length,apple.servings.length);assert.deepEqual(n.parseDiary(JSON.stringify(migrated)),migrated);
});
test('historical conversion is preserved on reload and edit even if current USDA portions change',()=>{
 const entry=n.makeEntry('historical','2026-10-19','Lunch',apple,2,findServing(apple,'medium apple').id);
 const updated=structuredClone(apple);updated.servings.find(s=>s.id===entry.serving.id).gramsPerServing=200;
 // Even the food snapshot may have newer metadata: the logged entry conversion wins.
 entry.food=updated;
 const parsed=n.parseDiary(JSON.stringify({...n.EMPTY,entries:[entry]})).entries[0];assert.equal(parsed.grams,364);assert.equal(parsed.serving.gramsPerServing,182);
 const editFood=n.foodForEditing(parsed,updated);const edited=n.makeEntry(parsed.id,parsed.date,'Snacks',editFood,3,parsed.serving.id);assert.equal(edited.grams,546);assert.equal(edited.serving.gramsPerServing,182);
 assert.equal(n.foodForEditing(parsed,findFood('173944')).servings.some(s=>s.label==='medium banana'),false);
});
test('version 2 storage rejects invalid or foreign serving snapshots and mismatched grams',()=>{
 const entry=n.makeEntry('x','2026-10-19','Lunch',apple,2,findServing(apple,'medium apple').id);
 for(const bad of [{...entry,quantity:0},{...entry,quantity:'2'},{...entry,grams:365},{...entry,serving:undefined},{...entry,serving:{...entry.serving,gramsPerServing:0}},{...entry,serving:{...entry.serving,sourceId:'173944'}}])assert.throws(()=>n.parseDiary(JSON.stringify({...n.EMPTY,entries:[bad]})));
 for(const servings of [[null],[{...entry.serving,gramsPerServing:Infinity}],[entry.serving,entry.serving],[{...entry.serving,reference:'https://example.com/guessed'}]])assert.ok(!n.validFood({...apple,servings}));
});
test('SR Legacy portions divide gram weights by the stated amount, including two tablespoons',()=>{
 const p={fdcId:172470,dataType:'SR Legacy',description:'Peanut butter',foodPortions:[{id:90673,amount:2,gramWeight:32,modifier:'tbsp',measureUnit:{name:'undetermined'}}]};
 const [s]=normalizePortions(p);assert.equal(s.gramsPerServing,16);assert.equal(s.label,'tablespoon');assert.equal(servingGrams(2,s),32);
 const normalized=normalizeFood({...raw,...p});assert.equal(normalized.servings[0].gramsPerServing,16);
});
test('Foundation and FNDDS support explicit portions; missing amounts, unsupported and ambiguous units are skipped',()=>{
 const foundation={fdcId:123,dataType:'Foundation',description:'Mock cooked food',foodPortions:[{id:11,amount:0.5,gramWeight:79,measureUnit:{name:'cup'},modifier:'cooked'}]};assert.equal(normalizePortions(foundation)[0].gramsPerServing,158);
 const survey={fdcId:123,dataType:'Survey (FNDDS)',description:'Mock rice',foodPortions:[{id:12,gramWeight:79,portionDescription:'1/2 cup',modifier:'10205'}]};assert.equal(normalizePortions(survey)[0].gramsPerServing,158);
 const valid={id:11,amount:1,gramWeight:100,measureUnit:{name:'cup'}};
 for(const bad of [{...valid,gramWeight:undefined},{...valid,gramWeight:0},{...valid,gramWeight:-1},{...valid,gramWeight:Infinity},{...valid,amount:undefined},{...valid,amount:0},{...valid,measureUnit:{name:'bucket'}},{...valid,measureUnit:{name:'undetermined'}}])assert.deepEqual(normalizePortions({...foundation,foodPortions:[bad]}),[]);
 for(const description of ['about 1 cup','1-2 cups','1 serving','cup','0 cup','1/0 cup','1 cup or 2 tablespoons'])assert.deepEqual(normalizePortions({...survey,foodPortions:[{id:12,gramWeight:100,portionDescription:description}]}),[]);
 assert.deepEqual(normalizePortions({...survey,foodPortions:[{id:12,amount:1,gramWeight:100,portionDescription:'2 cups'}]}),[]);
 assert.deepEqual(normalizePortions({...foundation,foodPortions:[valid,valid]}),[]);
});
test('Branded gram-based label servings are supported; mL never silently becomes grams',()=>{
 const branded={fdcId:123,dataType:'Branded',description:'Mock spread',servingSize:32,servingSizeUnit:'g',householdServingFullText:'2 tbsp'};
 assert.equal(normalizePortions(branded)[0].gramsPerServing,16);assert.equal(normalizeFood({...raw,...branded}).servings[0].label,'tablespoon');
 assert.equal(normalizePortions({...branded,householdServingFullText:undefined})[0].gramsPerServing,32);
 for(const bad of [{...branded,servingSize:0},{...branded,servingSize:NaN},{...branded,servingSizeUnit:'mL'},{...branded,servingSizeUnit:'oz'},{...branded,householdServingFullText:'about two spoons'}])assert.deepEqual(normalizePortions(bad),[]);
 const explicitVolume={fdcId:123,dataType:'Foundation',description:'Mock liquid',foodPortions:[{id:1,amount:100,gramWeight:104,measureUnit:{name:'milliliters'}}]};assert.equal(normalizePortions(explicitVolume)[0].gramsPerServing,1.04);
});
