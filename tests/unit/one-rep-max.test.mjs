import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateEpley, calculateBrzycki, calculateOneRepMax, calculateTrainingLoads, validateOneRepMaxInput } from '../../src/lib/calculators/one-rep-max.ts';
import { poundsToKg, kgToPounds } from '../../src/lib/calculators/tdee.ts';
const input = { weightKg: 60, repetitions: 8 };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} differs from ${expected}`);

test('Epley known examples retain full precision', () => {
  assert.equal(calculateEpley(input), 76);
  close(calculateEpley({ weightKg: 100, repetitions: 5 }), 116.66666666666667);
  close(calculateEpley({ weightKg: 100, repetitions: 10 }), 133.33333333333333);
  assert.notEqual(calculateEpley({ weightKg: 100, repetitions: 5 }), 116.7);
});

test('Brzycki is a separate comparison using the published denominator', () => {
  close(calculateBrzycki(input), 74.48275862068965);
  assert.equal(calculateBrzycki({ weightKg: 100, repetitions: 5 }), 112.5);
  close(calculateBrzycki({ weightKg: 100, repetitions: 10 }), 133.33333333333333);
  const result = calculateOneRepMax(input);
  assert.equal(result.epleyKg, 76); close(result.brzyckiKg, 74.48275862068965);
  assert.equal(result.weightKg, 60); assert.equal(result.repetitions, 8);
});

test('one repetition returns the exact lifted weight for both equations', () => {
  for (const weightKg of [.1, 60, 72.123456789, 1000]) {
    const result = calculateOneRepMax({ weightKg, repetitions: 1 });
    assert.equal(result.epleyKg, weightKg); assert.equal(result.brzyckiKg, weightKg);
    assert.equal(result.trainingLoads[0].weightKg, weightKg);
  }
});

test('all eleven percentages use the unrounded Epley estimate', () => {
  const loads = calculateOneRepMax(input).trainingLoads;
  assert.deepEqual(loads.map((load) => load.percentage), [100,95,90,85,80,75,70,65,60,55,50]);
  const expected = [76,72.2,68.4,64.6,60.8,57,53.2,49.4,45.6,41.8,38];
  loads.forEach((load, index) => close(load.weightKg, expected[index]));
  close(calculateOneRepMax({ weightKg: 100, repetitions: 5 }).trainingLoads[5].weightKg, 87.5);
  for (const value of [0, -1, NaN, Infinity, undefined, '76']) assert.throws(() => calculateTrainingLoads(value), RangeError);
});

test('metric and imperial calculations are equivalent without repeated conversion drift', () => {
  const result = calculateOneRepMax({ weightKg: poundsToKg(100), repetitions: 8 });
  close(result.epleyKg, 57.45503353333333);
  close(kgToPounds(result.epleyKg), 126.66666666666667);
  close(kgToPounds(result.brzyckiKg), 124.13793103448276);
  let kg = 60;
  for (let i = 0; i < 100; i++) kg = poundsToKg(kgToPounds(kg));
  close(calculateOneRepMax({ ...input, weightKg: kg }).epleyKg, 76);
});

test('invalid weights are rejected by every formula rather than clamped', () => {
  for (const weightKg of [0, -1, .099999, 1000.01, NaN, Infinity, -Infinity, undefined, '', 'abc', '60']) {
    const candidate = { ...input, weightKg };
    assert.ok(validateOneRepMaxInput(candidate).weightKg);
    for (const calculate of [calculateEpley, calculateBrzycki, calculateOneRepMax]) assert.throws(() => calculate(candidate), RangeError);
  }
});

test('repetitions must be whole numbers 1–12, including preventing denominator hazards', () => {
  for (const repetitions of [0, -1, 1.5, 13, 37, 38, NaN, Infinity, -Infinity, undefined, '', '8', 'abc']) {
    const candidate = { ...input, repetitions };
    assert.ok(validateOneRepMaxInput(candidate).repetitions);
    for (const calculate of [calculateEpley, calculateBrzycki, calculateOneRepMax]) assert.throws(() => calculate(candidate), RangeError);
  }
});

test('inclusive input boundaries produce positive finite results with no estimate clamping', () => {
  for (const weightKg of [.1, 1000]) for (const repetitions of [1, 12]) {
    assert.deepEqual(validateOneRepMaxInput({ weightKg, repetitions }), {});
    const result = calculateOneRepMax({ weightKg, repetitions });
    assert.ok(Number.isFinite(result.epleyKg) && Number.isFinite(result.brzyckiKg));
    assert.equal(result.trainingLoads.length, 11);
  }
  assert.equal(calculateOneRepMax({ weightKg: 1000, repetitions: 12 }).epleyKg, 1400);
  assert.equal(calculateOneRepMax({ weightKg: 1000, repetitions: 12 }).brzyckiKg, 1440);
});
