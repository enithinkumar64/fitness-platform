import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateIdealWeight, validateIdealWeightInput, FIVE_FEET_CM } from '../../src/lib/calculators/ideal-weight.ts';
import { imperialToCm, cmToImperial, kgToPounds } from '../../src/lib/calculators/tdee.ts';
import { calculateBmi } from '../../src/lib/calculators/bmi.ts';

const input = { age: 30, heightCm: 177.8, coefficient: 'male' };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} differs from ${expected}`);

test('all four formulas at the exact five-foot baseline, for both coefficient sets', () => {
  assert.equal(FIVE_FEET_CM, 152.4);
  assert.deepEqual(calculateIdealWeight({ ...input, heightCm: 152.4 }).estimatesKg, { robinson: 52, miller: 56.2, devine: 50, hamwi: 48 });
  assert.deepEqual(calculateIdealWeight({ ...input, heightCm: 152.4, coefficient: 'female' }).estimatesKg, { robinson: 49, miller: 53.1, devine: 45.5, hamwi: 45.5 });
});

test('known 70-inch examples evaluate all supplied coefficients without averaging', () => {
  assert.deepEqual(calculateIdealWeight(input).estimatesKg, { robinson: 71, miller: 70.3, devine: 73, hamwi: 75 });
  assert.deepEqual(calculateIdealWeight({ ...input, coefficient: 'female' }).estimatesKg, { robinson: 66, miller: 66.7, devine: 68.5, hamwi: 67.5 });
});

test('BMI reference interval preserves precision and matches the existing BMI calculator', () => {
  const result = calculateIdealWeight({ ...input, heightCm: 175 });
  assert.deepEqual(result.referenceWeightKg, { lower: 56.65625, upper: 76.5625 });
  assert.deepEqual(result.referenceWeightKg, calculateBmi({ age: 30, weightKg: 70, heightCm: 175 }).referenceWeightKg);
  assert.equal(calculateBmi({ age: 30, weightKg: result.referenceWeightKg.lower, heightCm: 175 }).category, 'Normal');
  assert.equal(calculateBmi({ age: 30, weightKg: result.referenceWeightKg.upper, heightCm: 175 }).category, 'Overweight');
  assert.deepEqual(calculateIdealWeight({ ...input, heightCm: 175, coefficient: 'female' }).referenceWeightKg, result.referenceWeightKg);
});

test('metric and imperial inputs are equivalent, with unrounded pounds conversion', () => {
  const metric = calculateIdealWeight(input);
  const imperial = calculateIdealWeight({ ...input, heightCm: imperialToCm(5, 10) });
  assert.deepEqual(imperial, metric);
  close(kgToPounds(imperial.estimatesKg.devine), 160.93745139496062);
  let height = 175;
  for (let i = 0; i < 100; i++) {
    const parts = cmToImperial(height);
    height = imperialToCm(parts.feet, parts.inches);
  }
  close(height, 175);
  close(calculateIdealWeight({ ...input, heightCm: height }).estimatesKg.robinson, 68.90551181102362);
});

test('adult age is inclusive and never changes any output', () => {
  assert.deepEqual(calculateIdealWeight({ ...input, age: 20 }), calculateIdealWeight({ ...input, age: 100 }));
  for (const age of [19, 101, 20.5, 0, -1, NaN, Infinity, undefined, '', '30']) {
    assert.ok(validateIdealWeightInput({ ...input, age }).age);
    assert.throws(() => calculateIdealWeight({ ...input, age }), RangeError);
  }
});

test('height software bounds and coefficient selection reject invalid values', () => {
  for (const heightCm of [100, 250]) assert.deepEqual(validateIdealWeightInput({ ...input, heightCm }), {});
  for (const heightCm of [99.99, 250.01, 0, -1, NaN, Infinity, -Infinity, undefined, '', 'abc', '175']) {
    assert.ok(validateIdealWeightInput({ ...input, heightCm }).heightCm);
    assert.throws(() => calculateIdealWeight({ ...input, heightCm }), RangeError);
  }
  for (const coefficient of ['toString', '', undefined]) assert.throws(() => calculateIdealWeight({ ...input, coefficient }), RangeError);
});

test('below five feet withholds all four formulas while preserving the BMI interval', () => {
  for (const heightCm of [100, 140, 152.399999]) {
    const result = calculateIdealWeight({ ...input, heightCm });
    assert.equal(result.estimatesKg, null);
    assert.match(result.formulaNotice, /withheld below five feet/);
    assert.ok(result.referenceWeightKg.lower > 0);
  }
  close(calculateIdealWeight({ ...input, heightCm: 140 }).referenceWeightKg.lower, 36.26);
  close(calculateIdealWeight({ ...input, heightCm: 140 }).referenceWeightKg.upper, 49);
  assert.ok(calculateIdealWeight({ ...input, heightCm: 152.400001 }).estimatesKg.robinson > 52);
});

test('fractional heights retain precision and upper-bound results remain finite', () => {
  const result = calculateIdealWeight({ ...input, heightCm: 175 });
  close(result.estimatesKg.devine, 70.46456692913387);
  assert.notEqual(result.estimatesKg.devine, 70.5);
  for (const coefficient of ['male', 'female']) {
    for (const value of Object.values(calculateIdealWeight({ ...input, heightCm: 250, coefficient }).estimatesKg)) assert.ok(Number.isFinite(value) && value > 0);
  }
});
