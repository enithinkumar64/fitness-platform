import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBmi, classifyBmi, validateBmiMeasurements, bmiMarker } from '../../src/lib/calculators/bmi.ts';
import { poundsToKg, kgToPounds, imperialToCm, cmToImperial } from '../../src/lib/calculators/tdee.ts';

const input = { age: 30, weightKg: 70, heightCm: 175 };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} differs from ${expected}`);

test('known BMI, Prime, Ponderal Index, and reference boundaries retain precision', () => {
  const result = calculateBmi(input);
  close(result.bmi, 22.857142857142858);
  assert.equal(result.category, 'Normal');
  close(result.prime, 0.9142857142857143);
  close(result.ponderalIndex, 13.061224489795919);
  assert.deepEqual(result.referenceWeightKg, { lower: 56.65625, upper: 76.5625 });
  assert.equal(calculateBmi({ ...input, weightKg: result.referenceWeightKg.lower }).category, 'Normal');
  assert.equal(calculateBmi({ ...input, weightKg: result.referenceWeightKg.upper }).category, 'Overweight');
});

test('all category boundaries are classified using unrounded values', () => {
  for (const [bmi, expected] of [[18.499999, 'Underweight'], [18.5, 'Normal'], [24.999999, 'Normal'], [25, 'Overweight'], [29.999999, 'Overweight'], [30, 'Obesity Class I'], [34.999999, 'Obesity Class I'], [35, 'Obesity Class II'], [39.999999, 'Obesity Class II'], [40, 'Obesity Class III'], [100, 'Obesity Class III']]) assert.equal(classifyBmi(bmi), expected);
  for (const bmi of [0, -1, NaN, Infinity, -Infinity, undefined, '25']) assert.throws(() => classifyBmi(bmi), RangeError);
});

test('imperial conversions reuse existing utilities and match a known example', () => {
  const result = calculateBmi({ age: 25, weightKg: poundsToKg(200), heightCm: imperialToCm(6, 0) });
  close(result.bmi, 27.124597979905836);
  assert.equal(result.category, 'Overweight');
  close(kgToPounds(result.referenceWeightKg.lower), 136.40755165259944);
  close(poundsToKg(1), 0.45359237);
  assert.equal(imperialToCm(1, 0), 30.48);
  let kg = 70, cm = 175;
  for (let i = 0; i < 100; i++) {
    kg = poundsToKg(kgToPounds(kg));
    const height = cmToImperial(cm);
    cm = imperialToCm(height.feet, height.inches);
  }
  close(kg, 70); close(cm, 175);
});

test('age eligibility is inclusive and independent of the BMI formula', () => {
  for (const age of [20, 100]) assert.deepEqual(validateBmiMeasurements({ ...input, age }), {});
  assert.equal(calculateBmi({ ...input, age: 20 }).bmi, calculateBmi({ ...input, age: 100 }).bmi);
  for (const age of [19, 101, 20.5, 0, -1, NaN, Infinity, undefined, '', '30']) {
    assert.ok(validateBmiMeasurements({ ...input, age }).age);
    assert.throws(() => calculateBmi({ ...input, age }), RangeError);
  }
});

test('measurement boundaries are inclusive; missing and nonfinite inputs are rejected', () => {
  for (const weightKg of [20, 400]) for (const heightCm of [100, 250]) assert.deepEqual(validateBmiMeasurements({ ...input, weightKg, heightCm }), {});
  for (const [key, invalid] of [['weightKg', [19.99, 400.01]], ['heightCm', [99.99, 250.01]]]) {
    for (const value of [...invalid, 0, -1, NaN, Infinity, -Infinity, undefined, '', 'abc', '70']) {
      assert.ok(validateBmiMeasurements({ ...input, [key]: value })[key]);
      assert.throws(() => calculateBmi({ ...input, [key]: value }), RangeError);
    }
  }
});

test('chart is linear and clamps only the marker, with explicit overflow information', () => {
  assert.deepEqual(bmiMarker(10), { percent: 0, overflow: null });
  assert.deepEqual(bmiMarker(27.5), { percent: 50, overflow: null });
  assert.deepEqual(bmiMarker(45), { percent: 100, overflow: null });
  assert.deepEqual(bmiMarker(3.2), { percent: 0, overflow: 'below' });
  assert.deepEqual(bmiMarker(400), { percent: 100, overflow: 'above' });
  close(bmiMarker(18.5).percent, 24.285714285714285);
  for (const bmi of [NaN, Infinity, 0]) assert.throws(() => bmiMarker(bmi), RangeError);
});
