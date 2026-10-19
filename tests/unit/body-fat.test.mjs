import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBodyFat, validateBodyFatInput, screenBodyFatEstimate } from '../../src/lib/calculators/body-fat.ts';
import { imperialToCm, poundsToKg } from '../../src/lib/calculators/tdee.ts';

const male = { age: 30, coefficient: 'male', weightKg: 70, heightCm: 175, neckCm: 38, waistCm: 85 };
const female = { age: 30, coefficient: 'female', weightKg: 65, heightCm: 165, neckCm: 32, waistCm: 74, hipCm: 98 };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} differs from ${expected}`);

test('published male inch equation: 70-inch height, 15-inch neck, 34-inch abdomen', () => {
  const result = calculateBodyFat({ ...male, age: 25, weightKg: poundsToKg(165), heightCm: imperialToCm(5, 10), neckCm: imperialToCm(0, 15), waistCm: imperialToCm(0, 34) });
  close(result.navy.percentage, 17.51308539731425);
  close(result.fatMassKg, 13.107273153777266);
  close(result.fatFreeMassKg, 61.73546789622274);
});

test('published female inch equation: 65-inch height, 13-inch neck, 29-inch waist, 38-inch hips', () => {
  const result = calculateBodyFat({ ...female, weightKg: poundsToKg(140), heightCm: imperialToCm(5, 5), neckCm: imperialToCm(0, 13), waistCm: imperialToCm(0, 29), hipCm: imperialToCm(0, 38) });
  close(result.navy.percentage, 27.2556952416069);
  close(result.fatMassKg, 17.308165560893475);
  close(result.fatFreeMassKg, 46.19476623910653);
});

test('known metric examples retain full precision and conserve mass', () => {
  const result = calculateBodyFat(male);
  close(result.navy.percentage, 17.007719172310537);
  close(result.fatMassKg, 11.905403420617377);
  close(result.fatFreeMassKg, 58.094596579382625);
  close(result.fatMassKg + result.fatFreeMassKg, 70);
  close(calculateBodyFat(female).navy.percentage, 28.734014509620664);
  assert.equal(result.navy.warning, null);
  assert.notEqual(result.navy.percentage, 17.0);
});

test('metric and equivalent imperial measurements give the same estimates for both sets', () => {
  for (const input of [male, female]) {
    const converted = { ...input, weightKg: poundsToKg(input.weightKg / .45359237) };
    for (const key of ['heightCm', 'neckCm', 'waistCm', ...(input.coefficient === 'female' ? ['hipCm'] : [])]) converted[key] = imperialToCm(0, input[key] / 2.54);
    const result = calculateBodyFat(converted), original = calculateBodyFat(input);
    close(result.navy.percentage, original.navy.percentage);
    close(result.bmiComparison.percentage, original.bmiComparison.percentage);
  }
});

test('BMI-based comparison uses the separate adult Deurenberg coefficients', () => {
  close(calculateBodyFat(male).bmi, 22.857142857142858);
  close(calculateBodyFat(male).bmiComparison.percentage, 18.12857142857143);
  close(calculateBodyFat(female).bmiComparison.percentage, 30.150137741046834);
  // Age changes the BMI-based method, but not the Navy percentage.
  const older = calculateBodyFat({ ...male, age: 40 });
  close(older.navy.percentage, 17.007719172310537);
  close(older.bmiComparison.percentage, 20.42857142857143);
});

test('adult and measurement bounds accept exact endpoints; reject invalid inputs', () => {
  for (const age of [20, 100]) assert.deepEqual(validateBodyFatInput({ ...male, age }), {});
  for (const [key, bounds] of Object.entries({ weightKg: [20, 400], heightCm: [100, 250], neckCm: [20, 80], waistCm: [30, 250], hipCm: [40, 250] })) {
    for (const value of bounds) assert.equal(validateBodyFatInput({ ...female, [key]: value })[key], undefined);
    for (const value of [bounds[0] - .01, bounds[1] + .01, 0, -1, NaN, Infinity, -Infinity, undefined, '', 'abc', '70']) {
      assert.ok(validateBodyFatInput({ ...female, [key]: value })[key]);
      assert.throws(() => calculateBodyFat({ ...female, [key]: value }), RangeError);
    }
  }
  for (const age of [19, 101, 20.1, undefined, NaN, Infinity, '', '30']) assert.throws(() => calculateBodyFat({ ...male, age }), RangeError);
  for (const coefficient of ['', undefined, 'toString']) assert.throws(() => calculateBodyFat({ ...male, coefficient }), RangeError);
});

test('required hip is conditional; all nonpositive logarithm differences are rejected', () => {
  assert.deepEqual(validateBodyFatInput({ ...male, hipCm: NaN }), {});
  assert.ok(validateBodyFatInput({ ...female, hipCm: undefined }).hipCm);
  for (const waistCm of [38, 37]) {
    const input = { ...male, waistCm };
    assert.match(validateBodyFatInput(input).formula, /Waist must be greater/);
    assert.throws(() => calculateBodyFat(input), RangeError);
  }
  for (const neckCm of [70, 80]) {
    const input = { ...female, neckCm, waistCm: 30, hipCm: 40 };
    assert.match(validateBodyFatInput(input).formula, /Waist plus hip/);
    assert.throws(() => calculateBodyFat(input), RangeError);
  }
});

test('impossible estimates are withheld independently; no clamping or derived masses', () => {
  for (const percentage of [NaN, Infinity, -Infinity, -1, 0, 100, 101]) assert.equal(screenBodyFatEstimate(percentage).percentage, null);
  const negative = calculateBodyFat({ ...male, neckCm: 38, waistCm: 39 });
  assert.equal(negative.navy.percentage, null);
  assert.equal(negative.fatMassKg, null); assert.equal(negative.fatFreeMassKg, null);
  close(negative.bmiComparison.percentage, 18.12857142857143);
  const high = calculateBodyFat({ ...female, heightCm: 100, waistCm: 250, hipCm: 250, neckCm: 20 });
  assert.equal(high.navy.percentage, null); assert.match(high.navy.warning, /withheld/);
  const invalidBmi = calculateBodyFat({ ...male, age: 20, weightKg: 20, heightCm: 250, waistCm: 100 });
  assert.equal(invalidBmi.bmiComparison.percentage, null);
  assert.ok(invalidBmi.navy.percentage > 0); assert.ok(invalidBmi.fatMassKg > 0);
});

test('explicit extreme-result warnings preserve raw percentages without clinical claims', () => {
  for (const percentage of [0.5, 1.99, 60.01, 99]) {
    const estimate = screenBodyFatEstimate(percentage);
    assert.equal(estimate.percentage, percentage);
    assert.match(estimate.warning, /not clinical/);
  }
  for (const percentage of [2, 60]) assert.deepEqual(screenBodyFatEstimate(percentage), { percentage, warning: null });
  const extreme = calculateBodyFat({ ...male, heightCm: 100, waistCm: 250, neckCm: 20 });
  assert.ok(extreme.navy.percentage > 60); assert.match(extreme.navy.warning, /Extreme/);
});
