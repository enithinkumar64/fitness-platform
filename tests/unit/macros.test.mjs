import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GOALS, PLAN_KEYS, nutritionPlanPercentages, applyNutritionPlan, kcalToKilojoules, calculateMacros, validateMacroInput, calculateGoalMacros, parseNumericInput, formatMacroAmount, percentageTotal } from '../../src/lib/calculators/macros.ts';
import { calculateTdee, poundsToKg, imperialToCm, validateMeasurements } from '../../src/lib/calculators/tdee.ts';
const input = { calories: 2400, goal: 'maintenance', percentages: { protein: 25, carbohydrates: 50, fat: 25 } };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9);
test('all three explicit goal presets', () => {
  assert.deepEqual(GOALS.maintenance.percentages, {protein:25,carbohydrates:50,fat:25});
  assert.deepEqual(GOALS['fat-loss'].percentages, {protein:30,carbohydrates:40,fat:30});
  assert.deepEqual(GOALS['muscle-gain'].percentages, {protein:30,carbohydrates:45,fat:25});
});
test('known maintenance allocation and conversion factors', () => {
  const result = calculateMacros(input);
  assert.equal(result.calories,2400);
  assert.deepEqual(result.percentages,input.percentages);
  assert.equal(result.goal,'maintenance');
  assert.deepEqual(result.macros.protein,{calories:600,grams:150});
  assert.deepEqual(result.macros.carbohydrates,{calories:1200,grams:300});
  assert.equal(result.macros.fat.calories,600); close(result.macros.fat.grams,66.66666666666667);
});
test('fat loss and muscle gain keep calories unchanged', () => {
  const loss = calculateMacros({...input,goal:'fat-loss',percentages:{protein:30,carbohydrates:40,fat:30}});
  assert.equal(loss.calories,2400); assert.equal(loss.macros.protein.grams,180); assert.equal(loss.macros.carbohydrates.grams,240); assert.equal(loss.macros.fat.grams,80);
  const gain = calculateMacros({...input,goal:'muscle-gain',percentages:{protein:30,carbohydrates:45,fat:25}});
  assert.equal(gain.calories,2400); assert.equal(gain.macros.carbohydrates.grams,270);
});
test('custom proportions, boundaries, and zero allocations', () => {
  for (const calories of [1200,6000]) assert.equal(calculateMacros({...input,calories}).calories,calories);
  const result = calculateMacros({...input,percentages:{protein:0,carbohydrates:0,fat:100}});
  assert.equal(result.macros.protein.grams,0); close(result.macros.fat.grams,266.6666666666667);
  assert.equal(calculateMacros({...input,percentages:{protein:40,carbohydrates:35,fat:25}}).macros.protein.grams,240);
});
test('reject invalid, missing, nonnumeric, and out-of-range calories', () => {
  for (const calories of [undefined,'', 'abc',NaN,Infinity,-Infinity,-1,0,1199.99,6000.01]) {
    assert.ok(validateMacroInput({...input,calories}).calories);
    assert.throws(() => calculateMacros({...input,calories}),RangeError);
  }
  assert.ok(Number.isNaN(parseNumericInput(''))); assert.ok(Number.isNaN(parseNumericInput('abc')));
  assert.ok(Number.isNaN(parseNumericInput('  ')));
});
test('percentages are finite, in range, and total 100 without normalization', () => {
  for (const key of ['protein','carbohydrates','fat']) {
    for (const value of [NaN,Infinity,-Infinity,-1,101,undefined,'','abc']) {
      const candidate={...input,percentages:{...input.percentages,[key]:value}};
      assert.ok(validateMacroInput(candidate)[key]); assert.throws(()=>calculateMacros(candidate),RangeError);
    }
  }
  for (const fat of [24,26]) assert.ok(validateMacroInput({...input,percentages:{protein:25,carbohydrates:50,fat}}).total);
  assert.throws(()=>calculateMacros({...input,goal:'toString'}),RangeError);
});
test('floating point tolerance accepts noise only and preserves percentages', () => {
  const percentages={protein:33.3333333,carbohydrates:33.3333333,fat:33.3333334};
  assert.deepEqual(validateMacroInput({...input,percentages}),{});
  const noisy={protein:25,carbohydrates:50,fat:25.0000005};
  assert.deepEqual(validateMacroInput({...input,percentages:noisy}),{});
  assert.equal(calculateMacros({...input,percentages:noisy}).percentages.fat,25.0000005);
  assert.ok(validateMacroInput({...input,percentages:{...noisy,fat:25.000002}}).total);
  assert.equal(percentageTotal(input.percentages),100);
});
test('full precision allocations, display rounding, and defensive result copy', () => {
  const result=calculateMacros(input);
  assert.equal(formatMacroAmount(result.macros.fat.grams),'66.7');
  assert.equal(formatMacroAmount(0),'0.0');
  close(result.macros.protein.calories+result.macros.carbohydrates.calories+result.macros.fat.calories,2400);
  close(result.macros.protein.grams*4+result.macros.carbohydrates.grams*4+result.macros.fat.grams*9,2400);
  assert.notEqual(150*4+300*4+66.7*9,2400);
  result.percentages.protein=99; assert.equal(input.percentages.protein,25);
});
const adult = {age:30,weightKg:70,heightCm:175,coefficient:'male',activity:'sedentary'};
test('measurement workflow reuses TDEE and selects unrounded goal estimates', () => {
  const energy = calculateTdee(adult);
  const maintain = calculateGoalMacros(energy,'maintenance',GOALS.maintenance.percentages);
  assert.equal(maintain.bmr,1648.75); assert.equal(maintain.maintenance,1978.5);
  assert.equal(maintain.macros.calories,1978.5); assert.equal(maintain.macros.macros.protein.grams,123.65625);
  const loss = calculateGoalMacros(energy,'fat-loss',GOALS['fat-loss'].percentages);
  assert.equal(loss.macros.calories,1728.5); close(loss.macros.macros.protein.grams,129.6375);
  const gain = calculateGoalMacros(energy,'muscle-gain',GOALS['muscle-gain'].percentages);
  assert.equal(gain.macros.calories,2228.5); close(gain.macros.macros.carbohydrates.grams,250.70625);
});
test('imperial measurements and activity feed existing energy functions', () => {
  const energy=calculateTdee({...adult,weightKg:poundsToKg(200),heightCm:imperialToCm(6,0)});
  close(energy.bmr,1905.18474); close(energy.maintenance,2286.221688);
  const active=calculateGoalMacros(calculateTdee({...adult,activity:'moderate'}),'maintenance',input.percentages);
  assert.equal(active.macros.calories,2555.5625);
  assert.ok(validateMeasurements({...adult,age:17}).age);
  assert.throws(()=>calculateTdee({...adult,weightKg:NaN}),RangeError);
});
test('withheld gradual loss never creates calorie or macro targets', () => {
  for (const coefficient of ['male','female']) {
    const energy=calculateTdee({...adult,age:80,weightKg:40,heightCm:140,coefficient});
    const result=calculateGoalMacros(energy,'fat-loss',GOALS['fat-loss'].percentages);
    assert.equal(result.macros,null); assert.match(result.reason,/screening threshold/);
    assert.ok(Number.isFinite(result.bmr)); assert.ok(Number.isFinite(result.maintenance));
  }
});
test('automatic calorie guardrails and invalid custom splits remain enforced', () => {
  const high=calculateTdee({...adult,weightKg:300,heightCm:230,age:18,activity:'extra'});
  const result=calculateGoalMacros(high,'maintenance',input.percentages);
  assert.equal(result.macros,null); assert.match(result.reason,/supported/);
  assert.throws(()=>calculateGoalMacros(calculateTdee(adult),'maintenance',{protein:50,carbohydrates:50,fat:50}),RangeError);
});

test('nutrition plans total 100 and document deterministic example splits', () => {
  assert.deepEqual(nutritionPlanPercentages('low-fat','maintenance',input.percentages),{protein:25,carbohydrates:55,fat:20});
  assert.deepEqual(nutritionPlanPercentages('low-carb','maintenance',input.percentages),{protein:30,carbohydrates:30,fat:40});
  assert.deepEqual(nutritionPlanPercentages('high-protein','maintenance',input.percentages),{protein:35,carbohydrates:40,fat:25});
  for(const goal of ['maintenance','fat-loss','muscle-gain']) {
    assert.deepEqual(nutritionPlanPercentages('balanced',goal,input.percentages),GOALS[goal].percentages);
    for(const plan of PLAN_KEYS) assert.equal(percentageTotal(nutritionPlanPercentages(plan,goal,input.percentages)),100);
  }
});
test('plan changes preserve approved energy and fitness goal', () => {
  const base=calculateGoalMacros(calculateTdee(adult),'fat-loss',GOALS['fat-loss'].percentages);
  for(const plan of PLAN_KEYS) {
    const result=applyNutritionPlan(base,plan,input.percentages);
    assert.equal(result.bmr,1648.75); assert.equal(result.maintenance,1978.5);
    assert.equal(result.macros.calories,1728.5); assert.equal(result.macros.goal,'fat-loss');
  }
  const high=applyNutritionPlan(calculateGoalMacros(calculateTdee(adult),'maintenance',input.percentages),'high-protein',input.percentages);
  close(high.macros.macros.protein.grams,173.11875);
  assert.equal(formatMacroAmount(high.macros.macros.protein.grams),'173.1');
  assert.equal(base.macros.percentages.protein,30);
});
test('custom plans validate without normalizing', () => {
  const base=calculateGoalMacros(calculateTdee(adult),'maintenance',input.percentages);
  const custom={protein:40,carbohydrates:35,fat:25};
  const result=applyNutritionPlan(base,'custom',custom);
  close(result.macros.macros.protein.grams,197.85);
  assert.deepEqual(result.macros.percentages,custom);
  assert.throws(()=>applyNutritionPlan(base,'custom',{protein:40,carbohydrates:50,fat:25}),RangeError);
  assert.throws(()=>applyNutritionPlan(base,'custom',{protein:NaN,carbohydrates:50,fat:25}),RangeError);
});
test('all plan tabs preserve withheld calorie safeguard', () => {
  const energy=calculateTdee({...adult,age:80,weightKg:40,heightCm:140,coefficient:'female'});
  const base=calculateGoalMacros(energy,'fat-loss',GOALS['fat-loss'].percentages);
  for(const plan of PLAN_KEYS) {
    const result=applyNutritionPlan(base,plan,input.percentages);
    assert.equal(result.macros,null); assert.equal(result.reason,base.reason);
  }
});
test('kilojoules use 4.184 with unrounded calories', () => {
  assert.equal(kcalToKilojoules(0),0);
  close(kcalToKilojoules(2400),10041.6);
  close(kcalToKilojoules(1978.5),8278.044);
  assert.equal(formatMacroAmount(kcalToKilojoules(1978.5)),'8278.0');
});
