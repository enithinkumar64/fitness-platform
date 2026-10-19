import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITIES, ACTIVITY_GROUPS, findActivity, calculateCaloriesBurned, durationToMinutes, validateCaloriesBurnedInput } from '../../src/lib/calculators/calories-burned.ts';
import { poundsToKg, kgToPounds } from '../../src/lib/calculators/tdee.ts';
const input = { activityId: 'walking-slow', weightKg: 70, hours: 0, minutes: 30 };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} differs from ${expected}`);

test('known MET calculation preserves precision and reports rates and session inputs', () => {
  const result = calculateCaloriesBurned(input);
  close(result.grossCalories, 102.9); close(result.caloriesPerMinute, 3.43); close(result.caloriesPerHour, 205.8);
  assert.equal(result.durationMinutes, 30); assert.equal(result.weightKg, 70);
  assert.equal(result.activity.name, 'Walking — 2.0–2.4 mph, level firm ground');
  assert.equal(result.activity.met, 2.8);
  assert.notEqual(result.grossCalories, Math.round(result.grossCalories));
});

test('2024 source-code and MET pairs match the verified catalog, with unique stable IDs', () => {
  const verified = { '17152': 2.8, '17190': 3.8, '17200': 4.8, '17080': 6, '12028': 6.5, '12030': 8.5, '12050': 9.3, '01010': 4, '01030': 8, '01040': 10, '18240': 5.8, '18230': 9.8, '02054': 3.5, '02050': 6, '02056': 3, '02057': 6.5, '02071': 5, '02072': 7.5, '02048': 5, '02049': 9, '02150': 2.3, '02160': 4, '03040': 3, '03030': 5.5, '15040': 8, '15610': 7, '15690': 8 };
  assert.equal(ACTIVITIES.length, 27);
  assert.equal(new Set(ACTIVITIES.map((item) => item.id)).size, 27);
  assert.deepEqual(Object.fromEntries(ACTIVITIES.map((item) => [item.sourceCode, item.met])), verified);
  for (const item of ACTIVITIES) {
    assert.ok(item.name && item.category && item.intensity);
    assert.match(item.sourceUrl, /^https:\/\/pacompendium.com\/[a-z-]+\/$/);
  }
  assert.equal(ACTIVITY_GROUPS.length, 14);
});

test('activity lookup rejects unknown and prototype-like IDs', () => {
  assert.equal(findActivity('yoga-hatha').sourceCode, '02150');
  for (const activityId of ['', 'unknown', 'toString', '__proto__', undefined]) {
    assert.equal(findActivity(activityId), undefined);
    assert.ok(validateCaloriesBurnedInput({ ...input, activityId }).activityId);
    assert.throws(() => calculateCaloriesBurned({ ...input, activityId }), RangeError);
  }
});

test('duration conversion requires whole components and sessions of 1–720 minutes', () => {
  assert.equal(durationToMinutes(0, 1), 1); assert.equal(durationToMinutes(1, 30), 90);
  assert.equal(durationToMinutes(11, 59), 719); assert.equal(durationToMinutes(12, 0), 720);
  for (const [hours, minutes] of [[0, 0], [12, 1], [13, 0], [-1, 1], [0, 60], [0, -1], [.5, 0], [0, .5], [NaN, 0], [0, Infinity], [undefined, 30], [0, '30']]) assert.throws(() => durationToMinutes(hours, minutes), RangeError);
});

test('imperial weights and repeated conversions match deterministic calorie values', () => {
  close(poundsToKg(200), 90.718474);
  const result = calculateCaloriesBurned({ activityId: 'cycling-leisure', weightKg: poundsToKg(200), hours: 1, minutes: 30 });
  close(result.grossCalories, 571.5263862); close(result.caloriesPerMinute, 6.35029318); close(result.caloriesPerHour, 381.0175908);
  let kg = 70;
  for (let i = 0; i < 100; i++) kg = poundsToKg(kgToPounds(kg));
  close(calculateCaloriesBurned({ ...input, weightKg: kg }).grossCalories, 102.9);
});

test('weight and duration software boundaries and invalid inputs are enforced', () => {
  for (const weightKg of [20, 400]) assert.deepEqual(validateCaloriesBurnedInput({ ...input, weightKg }), {});
  for (const weightKg of [19.99, 400.01, 0, -1, NaN, Infinity, undefined, '', '70', 'abc']) assert.throws(() => calculateCaloriesBurned({ ...input, weightKg }), RangeError);
  for (const key of ['hours', 'minutes']) for (const value of [NaN, Infinity, -Infinity, undefined, '', '0', 'abc', -1, .5]) {
    assert.ok(validateCaloriesBurnedInput({ ...input, [key]: value })[key]);
    assert.throws(() => calculateCaloriesBurned({ ...input, [key]: value }), RangeError);
  }
  assert.ok(validateCaloriesBurnedInput({ ...input, hours: 12, minutes: 1 }).duration);
  assert.ok(validateCaloriesBurnedInput({ ...input, hours: 0, minutes: 0 }).duration);
});

test('activity intensity changes energy while time scales total, not rates', () => {
  close(calculateCaloriesBurned({ ...input, activityId: 'walking-brisk' }).grossCalories, 176.4);
  const running = calculateCaloriesBurned({ ...input, activityId: 'running-5mph' });
  close(running.grossCalories, 312.375); close(running.caloriesPerMinute, 10.4125); close(running.caloriesPerHour, 624.75);
  const longer = calculateCaloriesBurned({ ...input, hours: 1, minutes: 30 });
  close(longer.grossCalories, 308.7); close(longer.caloriesPerMinute, 3.43); close(longer.caloriesPerHour, 205.8);
});

test('all catalog activities produce finite estimates at input limits and results copy metadata', () => {
  for (const activity of ACTIVITIES) for (const weightKg of [20, 400]) {
    const result = calculateCaloriesBurned({ activityId: activity.id, weightKg, hours: 12, minutes: 0 });
    assert.ok(Number.isFinite(result.grossCalories) && result.grossCalories > 0);
  }
  const result = calculateCaloriesBurned(input);
  result.activity.met = 999;
  assert.equal(findActivity('walking-slow').met, 2.8);
});
