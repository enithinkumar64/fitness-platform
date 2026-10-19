import { createHash } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EXERCISES, findExerciseBySlug, filterExercises, searchExercises, findRelatedExercises } from '../../src/lib/exercises/exercises.ts';
import { DIRECTORY_CATEGORIES, MUSCLE_GROUPS, EQUIPMENT, DIFFICULTIES } from '../../src/lib/exercises/types.ts';

test('catalog has exactly 100 exercises covering all requested categories', () => {
  assert.equal(EXERCISES.length, 100);
  assert.deepEqual(Object.fromEntries(DIRECTORY_CATEGORIES.map((group) => [group, EXERCISES.filter((item) => item.category === group).length])), { Chest: 12, Back: 14, 'Legs and quads': 12, 'Glutes and hamstrings': 12, Shoulders: 12, Biceps: 8, Triceps: 8, 'Core and abs': 10, 'Full body': 6, 'Cardio and conditioning': 6 });
  for (const equipment of ['Bodyweight', 'Dumbbells', 'Barbell', 'Cable', 'Machine', 'Resistance band', 'Kettlebell']) assert.ok(EXERCISES.some((item) => item.equipment.includes(equipment)));
});

test('IDs, slugs, and names are unique and URL slugs are readable', () => {
  assert.equal(new Set(EXERCISES.map((item) => item.name.toLowerCase())).size, 100);
  assert.equal(new Set(EXERCISES.map((item) => item.description)).size, 100);
  for (const key of ['id', 'slug', 'name']) assert.equal(new Set(EXERCISES.map((item) => item[key])).size, 100);
  for (const exercise of EXERCISES) {
    assert.match(exercise.id, /^ex-[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(exercise.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test('every guide has typed metadata, steps, tips, mistakes, and safety notes', () => {
  for (const exercise of EXERCISES) {
    for (const key of ['name', 'description', 'movementPattern']) assert.ok(typeof exercise[key] === 'string' && exercise[key].trim().length > 0);
    assert.ok(MUSCLE_GROUPS.includes(exercise.primaryMuscle));
    assert.ok(DIRECTORY_CATEGORIES.includes(exercise.category));
    assert.ok(DIFFICULTIES.includes(exercise.difficulty));
    assert.ok(exercise.equipment.length > 0);
    assert.equal(new Set(exercise.equipment).size, exercise.equipment.length);
    for (const equipment of exercise.equipment) assert.ok(EQUIPMENT.includes(equipment));
    assert.ok(exercise.instructions.length >= 3);
    for (const key of ['instructions', 'tips', 'mistakes', 'safety', 'secondaryMuscles']) {
      assert.ok(exercise[key].length > 0);
      for (const value of exercise[key]) assert.ok(typeof value === 'string' && value.trim().length > 0);
    }
  }
});

test('related exercises reference existing IDs without duplicates or self-reference', () => {
  const ids = new Set(EXERCISES.map((exercise) => exercise.id));
  for (const exercise of EXERCISES) {
    assert.equal(new Set(exercise.relatedIds).size, exercise.relatedIds.length);
    for (const id of exercise.relatedIds) { assert.ok(ids.has(id)); assert.notEqual(id, exercise.id); }
    assert.deepEqual(findRelatedExercises(exercise.id).map((item) => item.id), [...exercise.relatedIds]);
  }
  assert.deepEqual(findRelatedExercises('unknown'), []);
});

test('slug lookup is exact and unknown values do not select arbitrary exercises', () => {
  assert.equal(findExerciseBySlug('goblet-squat').name, 'Goblet Squat');
  for (const exercise of EXERCISES) assert.equal(findExerciseBySlug(exercise.slug).id, exercise.id);
  for (const slug of ['unknown', '', '../push-up', 'Push-Up', 'constructor', undefined]) assert.equal(findExerciseBySlug(slug), undefined);
});

test('name search handles case, surrounding whitespace, substrings, and empty queries', () => {
  assert.deepEqual(searchExercises('  PuSh-Up  ').map((item) => item.slug), ['push-up', 'incline-push-up', 'kneeling-push-up', 'diamond-push-up']);
  assert.deepEqual(searchExercises('curl').map((item) => item.slug), ['dumbbell-biceps-curl', 'hammer-curl', 'lying-leg-curl', 'seated-leg-curl', 'barbell-curl', 'ez-bar-curl', 'incline-dumbbell-curl', 'preacher-curl', 'cable-curl', 'concentration-curl']);
  assert.equal(searchExercises('  ').length, 100);
  assert.deepEqual(searchExercises('a nonexistent movement'), []);
  assert.deepEqual(searchExercises('['), []);
  assert.deepEqual(searchExercises(null), []);
  // Equipment is handled by its filter; name search does not search descriptions.
  assert.equal(searchExercises('Bodyweight').length, 1);
});

test('individual filters and intersections produce deterministic matches', () => {
  assert.equal(filterExercises({ muscle: 'Back' }).length, 14);
  assert.deepEqual(filterExercises({ difficulty: 'advanced' }).map((item) => item.slug), ['barbell-back-squat', 'barbell-front-squat', 'conventional-deadlift', 'ab-wheel-rollout', 'turkish-get-up']);
  assert.deepEqual(filterExercises({ equipment: 'Rack' }).map((item) => item.slug), ['barbell-back-squat', 'barbell-overhead-press', 'barbell-bench-press', 'incline-barbell-bench-press', 'inverted-row', 'barbell-front-squat', 'close-grip-bench-press']);
  assert.deepEqual(filterExercises({ muscle: 'Core', equipment: 'Bodyweight', difficulty: 'beginner' }).map((item) => item.slug), ['dead-bug', 'forearm-plank', 'bird-dog', 'reverse-crunch']);
  assert.deepEqual(filterExercises({ search: ' press ', equipment: 'Dumbbells', difficulty: 'intermediate' }).map((item) => item.slug), ['dumbbell-bench-press', 'seated-dumbbell-shoulder-press', 'incline-dumbbell-bench-press', 'arnold-press', 'standing-dumbbell-shoulder-press']);
});

test('empty matches and invalid filter values never widen the search', () => {
  assert.deepEqual(filterExercises({ muscle: 'Chest', equipment: 'Kettlebell' }), []);
  for (const key of ['category', 'muscle', 'equipment', 'difficulty']) for (const value of ['unknown', 'toString', 'constructor', 0, false, null]) assert.deepEqual(filterExercises({ [key]: value }), []);
  assert.deepEqual(filterExercises({ search: 42 }), []);
  assert.equal(filterExercises().length, 100);
  assert.equal(filterExercises({ search: '', muscle: '', equipment: '', difficulty: '' }).length, 100);
});

test('search and filtering do not mutate the canonical catalog', () => {
  const original = EXERCISES.map((exercise) => exercise.id);
  const matches = filterExercises({ muscle: 'Legs' });
  matches.reverse();
  assert.deepEqual(EXERCISES.map((exercise) => exercise.id), original);
});

test('optional videos have complete attribution and verified individual YouTube destinations', () => {
  // Fixed review inventory, not URLs generated from exercise names or search queries.
  const verified = {
    'incline-push-up': '0JUrOH--Kdk',
    'seated-cable-row': 'xQNrFHEMhI4',
    'dumbbell-romanian-deadlift': 'QFbZevA7dps',
    'dumbbell-lateral-raise': 'XPPfnSEATJA',
    'cable-face-pull': 'eTCBSFlCJ_s',
    'cable-triceps-pushdown': 'HIKzvHkibWc',
    'forearm-plank': 'xhk1JkbF2lg',
    'bird-dog': 'ZdAHe9_HeEw',
  };
  const referenced = EXERCISES.filter((exercise) => exercise.video);
  assert.equal(referenced.length, 77);
  assert.equal(EXERCISES.filter((exercise) => !exercise.video).length, 23);
  assert.equal(referenced.length + EXERCISES.filter((exercise) => !exercise.video).length, 100);
  for (const [slug, id] of Object.entries(verified)) assert.equal(findExerciseBySlug(slug).video.url, `https://www.youtube.com/watch?v=${id}`);
  for (const exercise of referenced) {
    const { video } = exercise;
    for (const key of ['url', 'title', 'creator']) assert.ok(typeof video[key] === 'string' && video[key].trim().length > 0);
    assert.ok(typeof video.description === 'string' && video.description.trim().length > 0);
    const url = new URL(video.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'www.youtube.com');
    assert.equal(url.pathname, '/watch');
    assert.deepEqual([...url.searchParams.keys()], ['v']);
    assert.match(url.searchParams.get('v'), /^[A-Za-z0-9_-]{11}$/);
    if (verified[exercise.slug]) assert.equal(url.searchParams.get('v'), verified[exercise.slug]);
    assert.equal(url.hash, '');
    assert.equal(url.username + url.password, '');
    assert.equal(findExerciseBySlug(exercise.slug).id, exercise.id);
    assert.match(video.verification.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(video.verification.notes.trim().length > 20);
  }
  // Existing relationship integrity and exact slug tests also cover these entries.
});


test('original 30 identities and written guidance remain unchanged', () => {
  const preserved = EXERCISES.slice(0, 30).map((exercise) => { const original = { ...exercise }; delete original.category; delete original.video; return original; });
  assert.equal(createHash('sha256').update(JSON.stringify(preserved)).digest('hex'), 'bce7131ffcc846187dac458b218e5329a9fcce53ee995387fc246f6bcef3bd2c');
});

test('new category filters combine with primary muscle, equipment, and name', () => {
  for (const category of DIRECTORY_CATEGORIES) assert.ok(filterExercises({ category }).every((exercise) => exercise.category === category));
  assert.deepEqual(filterExercises({ category: 'Glutes and hamstrings', equipment: 'Machine' }).map((exercise) => exercise.slug), ['lying-leg-curl', 'seated-leg-curl']);
  assert.deepEqual(filterExercises({ category: 'Biceps', search: 'cable', difficulty: 'beginner' }).map((exercise) => exercise.slug), ['cable-curl']);
  assert.deepEqual(filterExercises({ category: 'Chest', muscle: 'Back' }), []);
});


test('unreferenced exercises remain usable guides, without placeholder videos', () => {
  assert.equal(findExerciseBySlug('band-row').video, undefined);
  assert.equal(findExerciseBySlug('turkish-get-up').video, undefined);
  for (const exercise of EXERCISES.filter((item) => !item.video)) {
    assert.ok(exercise.instructions.length >= 3);
    assert.ok(findRelatedExercises(exercise.id).length > 0);
  }
});
