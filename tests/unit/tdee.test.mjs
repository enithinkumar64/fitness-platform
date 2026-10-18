import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBmr, calculateTdee, validateMeasurements, poundsToKg, kgToPounds, imperialToCm, cmToImperial, screenLossTarget } from '../../src/lib/calculators/tdee.ts';
const example = { age: 30, weightKg: 70, heightCm: 175, coefficient: 'male', activity: 'sedentary' };
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} differs from ${b}`);
test('known male and female resting estimates', () => {
  assert.equal(calculateBmr(example), 1648.75);
  assert.equal(calculateBmr({ ...example, coefficient: 'female' }), 1482.75);
});
test('all five multipliers give deterministic TDEE values', () => {
  for (const [activity, expected] of [['sedentary',1978.5],['light',2267.03125],['moderate',2555.5625],['very',2844.09375],['extra',3132.625]])
    assert.equal(calculateTdee({ ...example, activity }).maintenance, expected);
});
test('exact conversion constants and imperial height', () => {
  assert.equal(poundsToKg(1), 0.45359237);
  assert.equal(imperialToCm(5, 10), 177.8);
  close(kgToPounds(70), 154.3235835294143);
  assert.deepEqual(cmToImperial(182.88), { feet: 6, inches: 0 });
});
test('repeated round-trip conversions retain precision', () => {
  let kg = 70.123456789, cm = 175.23456789;
  for (let i = 0; i < 100; i++) {
    kg = poundsToKg(kgToPounds(kg));
    const { feet, inches } = cmToImperial(cm); cm = imperialToCm(feet, inches);
  }
  close(kg, 70.123456789); close(cm, 175.23456789);
});
test('goal arithmetic retains fractions', () => {
  const result = calculateTdee(example);
  assert.equal(result.gradualLoss, 1728.5); assert.equal(result.moderateLoss, null);
  assert.equal(result.gradualGain, 2228.5); assert.equal(result.moderateGain, 2478.5);
  assert.equal(calculateTdee({ ...example, activity: 'moderate' }).moderateLoss, 2055.5625);
});
test('screening uses unrounded values and includes exact thresholds', () => {
  for (const [coefficient, threshold] of [['male',1500],['female',1200]]) {
    assert.equal(screenLossTarget(threshold - 0.01, coefficient), null);
    assert.equal(screenLossTarget(threshold, coefficient), threshold);
    assert.equal(screenLossTarget(threshold + 1, coefficient), threshold + 1);
  }
  const low = calculateTdee({ age: 80, weightKg: 40, heightCm: 140, coefficient: 'female', activity: 'sedentary' });
  assert.equal(low.gradualLoss, null); assert.equal(low.moderateLoss, null);
});
test('valid input boundaries', () => {
  for (const [age,weightKg,heightCm] of [[18,30,120],[100,300,230]])
    assert.deepEqual(validateMeasurements({ ...example, age, weightKg, heightCm }), {});
});
test('invalid inputs are rejected before arithmetic', () => {
  for (const key of ['age','weightKg','heightCm']) {
    const bad = key === 'age' ? [17,101,18.5] : key === 'weightKg' ? [29.99,300.01] : [119.99,230.01];
    for (const value of [...bad,NaN,Infinity,-Infinity,-1,0,undefined,'','abc']) {
      const input = { ...example, [key]: value };
      assert.ok(validateMeasurements(input)[key]); assert.throws(() => calculateTdee(input), RangeError);
    }
  }
  for (const input of [{...example,activity:'toString'},{...example,coefficient:'other'}]) assert.throws(() => calculateBmr(input), RangeError);
  assert.throws(() => screenLossTarget(NaN, 'female'), RangeError);
});
