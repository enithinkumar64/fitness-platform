import {test} from 'node:test';
import assert from 'node:assert/strict';
import {foodSourceLabel} from '../../src/lib/branding.ts';
import {parseDiary} from '../../src/lib/nutrition/core.ts';
test('legacy catalog labels display VAJRYA without changing saved snapshots or nutrition',()=>{
 const source='FormFuel starter catalog · USDA FoodData Central';
 const legacy={version:1,targets:{calories:2000},entries:[{id:'legacy-brand-id',date:'2026-10-19',meal:'Breakfast',food:{id:'starter-171688',name:'Apples, raw',source,sourceId:'171688',dataType:'SR Legacy',per100g:{calories:52,protein:0.26,carbohydrates:13.81,fat:0.17}},grams:100}]};
 const original=JSON.stringify(legacy);const diary=parseDiary(original);
 assert.equal(diary.entries[0].id,'legacy-brand-id');assert.equal(diary.entries[0].food.source,source);assert.equal(diary.entries[0].consumed.calories,52);assert.equal(diary.targets.calories,2000);
 assert.equal(foodSourceLabel(diary.entries[0].food.source),'VAJRYA starter catalog · USDA FoodData Central');
 assert.equal(JSON.stringify(legacy),original);assert.equal(diary.entries[0].food.source,source);
});
test('only known legacy catalog attribution is relabeled',()=>{
 for(const name of ['FormFuel','formfuel','Form Fuel'])assert.equal(foodSourceLabel(`${name} starter catalog · USDA FoodData Central`),'VAJRYA starter catalog · USDA FoodData Central');
 for(const source of ['USDA FoodData Central','VAJRYA starter catalog · USDA FoodData Central','A third-party source'])assert.equal(foodSourceLabel(source),source);
});
