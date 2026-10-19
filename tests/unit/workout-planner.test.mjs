import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EXERCISES } from '../../src/lib/exercises/exercises.ts';
import { generatePlan, regeneratePlan, validatePreferences, approvedCandidates, isCompatible, resolveGroup, prescription, formatDose, planSignature } from '../../src/lib/workout-planner/generator.ts';
import { SPLITS, availableSplits } from '../../src/lib/workout-planner/splits.ts';
import { TEMPLATES } from '../../src/lib/workout-planner/templates.ts';
import { SUBSTITUTIONS, GYM_EQUIPMENT } from '../../src/lib/workout-planner/substitutions.ts';
const allGym = GYM_EQUIPMENT.map((option) => option.value);
const base = { goal:'muscle',experience:'beginner',days:3,split:'fb-3',equipment:'gym',hasBench:false,hasBand:false,gymEquipment:allGym };
const e = (id) => EXERCISES.find((exercise) => exercise.id === `ex-${id}`);
const expected = {
  'fb-2':['full','full'], 'ul-2':['upper','lower'], 'fb-3':['full','full','full'],
  'ppl-3':['push','pull','legs'], 'uul-3':['upper','upper','lower'],
  'ul-4':['upper','lower','upper','lower'], 'pplfb-4':['push','pull','legs','full'], 'fbulfb-4':['full','upper','lower','full'],
  'uulul-5':['upper','upper','lower','upper','lower'], 'pplul-5':['push','pull','legs','upper','lower'], 'ulppl-5':['upper','lower','push','pull','legs'],
};

test('eleven stable splits have the exact requested structures and complete editorial metadata',()=>{
  assert.deepEqual(availableSplits(2).map(s=>s.id),['fb-2','ul-2']);
  assert.deepEqual(availableSplits(3).map(s=>s.id),['fb-3','ppl-3','uul-3']);
  assert.deepEqual(availableSplits(4).map(s=>s.id),['ul-4','pplfb-4','fbulfb-4']);
  assert.deepEqual(availableSplits(5).map(s=>s.id),['uulul-5','pplul-5','ulppl-5']);
  assert.deepEqual(availableSplits(6),[]);
  assert.equal(new Set(SPLITS.map(s=>s.id)).size,11);
  for(const split of SPLITS){assert.deepEqual(split.structure,expected[split.id]);assert.equal(split.days,split.structure.length);assert.ok(split.name.trim().length>0);for(const key of ['description','benefits','tradeoffs','suitability'])assert.ok(split[key].trim().length>15);}
  assert.match(SPLITS.find(s=>s.id==='ppl-3').tradeoffs,/once weekly/);
  assert.match(SPLITS.find(s=>s.id==='uul-3').tradeoffs,/lower body once/);
});

test('approved substitutions reference real IDs and preserve exact movement patterns and emphasis',()=>{
  assert.ok(Object.keys(TEMPLATES).includes('conditioning'));
  for(const [id,group] of Object.entries(SUBSTITUTIONS)){
    assert.ok(group.label && group.pattern);
    for(const options of Object.values(group.options)){
      assert.equal(new Set(options).size,options.length,id);
      for(const exerciseId of options){const exercise=EXERCISES.find(e=>e.id===exerciseId);assert.ok(exercise,exerciseId);assert.equal(exercise.movementPattern,group.pattern,exerciseId);assert.ok(group.categories.includes(exercise.category),exerciseId);}
    }
  }
  assert.ok(!Object.values(SUBSTITUTIONS).some(group=>Object.values(group.options).some(ids=>ids.includes('ex-turkish-get-up'))));
  assert.deepEqual(TEMPLATES.push.slots.map(s=>s.id),['press','overhead','shoulder','triceps']);
  assert.deepEqual(TEMPLATES.pull.slots.map(s=>s.id),['row','vertical-pull','curl','rear']);
});

test('297 complete-inventory combinations: 261 supported; 36 home Push/Pull combinations explicitly rejected',()=>{
  let supported=0,unsupported=0;
  for(const split of SPLITS)for(const goal of ['fitness','muscle','strength'])for(const experience of ['beginner','intermediate','advanced'])for(const equipment of ['bodyweight','dumbbells','gym']){
    const p={...base,split:split.id,days:split.days,goal,experience,equipment,hasBench:equipment==='dumbbells',hasBand:equipment==='bodyweight',gymEquipment:equipment==='gym'?allGym:[]};
    const result=generatePlan(p);
    if(equipment==='bodyweight'&&split.structure.some(id=>['push','pull'].includes(id))){assert.equal(result.ok,false);assert.match(result.message,/Choose Full Body or Upper\/Lower/);unsupported++;continue;}
    assert.equal(result.ok,true,JSON.stringify(p));supported++;
    const plan=result.plan;assert.equal(plan.version,2);assert.deepEqual(plan.preferences,p);
    assert.deepEqual(plan.workouts.map(w=>w.templateId),expected[split.id]);
    assert.equal(plan.schedule.filter(day=>day.workoutId).length,p.days);
    assert.equal(plan.schedule.length,7);
    const weekPatterns=new Set();
    for(const workout of plan.workouts){
      assert.ok(workout.exercises.length>=2&&workout.exercises.length<=6);
      assert.equal(new Set(workout.exercises.map(entry=>entry.exerciseId)).size,workout.exercises.length);
      assert.ok(workout.exercises.reduce((sum,entry)=>sum+entry.dose.sets,0)<=14);
      const slots=TEMPLATES[workout.templateId].slots;
      const indices=workout.exercises.map(entry=>slots.findIndex(s=>s.id===entry.slotId));assert.deepEqual(indices,[...indices].sort((a,b)=>a-b));
      for(const slot of slots.filter(s=>!s.optional))assert.ok(workout.exercises.some(entry=>entry.slotId===slot.id));
      for(const entry of workout.exercises){
        const exercise=EXERCISES.find(e=>e.id===entry.exerciseId);assert.ok(exercise);
        const group=SUBSTITUTIONS[entry.group];assert.ok(group.options[equipment].includes(exercise.id));assert.equal(exercise.movementPattern,group.pattern);weekPatterns.add(group.pattern);
        assert.ok(['beginner','intermediate','advanced'].indexOf(exercise.difficulty)<=['beginner','intermediate','advanced'].indexOf(experience));
        const allowed=equipment==='bodyweight'?['Bodyweight','Resistance band']:equipment==='dumbbells'?['Bodyweight','Dumbbells','Bench']:['Bodyweight',...allGym];assert.ok(exercise.equipment.every(item=>allowed.includes(item)));
        assert.ok(entry.dose.sets>=1&&entry.dose.sets<=3);
        for(const alternative of entry.alternatives){const other=EXERCISES.find(e=>e.id===alternative);assert.ok(group.options[equipment].includes(other.id));assert.equal(other.movementPattern,exercise.movementPattern);assert.ok(group.categories.includes(other.category));assert.ok(isCompatible(other,p));}
      }
    }
    for(const pattern of ['Squat','Horizontal push','Horizontal pull'])assert.ok(weekPatterns.has(pattern));
    assert.ok(weekPatterns.has('Hip hinge')||weekPatterns.has('Hip extension'));
  }
  assert.equal(supported,261);assert.equal(unsupported,36);
});

test('weekly schedules preserve order and separate repeated major movement families, including week boundaries',()=>{
  const families={full:['push','pull','legs'],upper:['push','pull'],lower:['legs'],legs:['legs'],push:['push'],pull:['pull']};
  for(const split of SPLITS){
    const plan=generatePlan({...base,split:split.id,days:split.days}).plan;
    const weekly=plan.schedule.map(day=>day.workoutId?plan.workouts.find(w=>w.id===day.workoutId).templateId:null);
    assert.deepEqual(weekly.filter(Boolean),expected[split.id]);
    for(let i=0;i<7;i++){const a=weekly[i],b=weekly[(i+1)%7];if(a&&b)assert.ok(!families[a].some(f=>families[b].includes(f)),split.id);}
    assert.ok(weekly.filter(x=>!x).length>=2);
  }
  const uulul=generatePlan({...base,days:5,split:'uulul-5'}).plan;
  assert.deepEqual(uulul.schedule.filter(d=>d.workoutId).map(d=>d.day),['Monday','Wednesday','Thursday','Friday','Sunday']);
});

test('beginner full gym A/B/A is the authored complete program, with no advanced substitutions',()=>{
  const plan=generatePlan(base).plan;
  assert.deepEqual(plan.workouts.map(w=>w.exercises.map(e=>e.exerciseId)),[
    ['ex-leg-press','ex-glute-bridge','ex-machine-chest-press','ex-seated-cable-row','ex-dead-bug'],
    ['ex-leg-press','ex-glute-bridge','ex-dumbbell-floor-press','ex-chest-supported-dumbbell-row','ex-dead-bug'],
    ['ex-leg-press','ex-glute-bridge','ex-machine-chest-press','ex-seated-cable-row','ex-dead-bug'],
  ]);
  assert.deepEqual(plan.workouts[0].exercises.map(e=>e.dose.sets),[2,2,2,2,2]);
  assert.deepEqual(plan.workouts[0].exercises.map(e=>e.dose.restSeconds),[120,120,120,120,60]);
  assert.match(plan.rotation,/Week 2: B \/ A \/ B/);
});

test('dumbbell program uses deliberate main/secondary ordering and exposes the absent vertical-pull slot',()=>{
  const p={...base,experience:'intermediate',equipment:'dumbbells',hasBench:true,gymEquipment:[],days:4,split:'ul-4'};
  const plan=generatePlan(p).plan;
  assert.deepEqual(plan.workouts[0].exercises.map(e=>e.exerciseId),['ex-dumbbell-bench-press','ex-one-arm-dumbbell-row','ex-dumbbell-lateral-raise','ex-dumbbell-biceps-curl']);
  assert.deepEqual(plan.workouts[0].exercises.map(e=>e.dose.sets),[3,3,2,2]);
  assert.deepEqual(plan.workouts[1].exercises.map(e=>e.slotId),['squat','hip','lunge','calf','core']);
  assert.ok(plan.workouts[0].omitted.some(note=>note.includes('vertical')));
});

test('goal doses, reduced high-frequency volume and hold formatting are transparent',()=>{
  const squat=e('goblet-squat');
  assert.deepEqual(prescription(squat,{...base,goal:'fitness'},'main').target,{unit:'reps',min:10,max:15});
  assert.deepEqual(prescription(squat,base,'main').target,{unit:'reps',min:8,max:12});
  const strength=prescription(squat,{...base,experience:'intermediate',goal:'strength'},'main');assert.deepEqual(strength.target,{unit:'reps',min:6,max:8});assert.equal(strength.restSeconds,180);assert.equal(strength.sets,3);
  assert.equal(prescription(squat,{...base,experience:'intermediate',days:5},'main').sets,2);
  assert.equal(formatDose(prescription(e('forearm-plank'),base,'secondary')),'2 sets × 15–25 seconds');
  assert.equal(prescription(e('dead-bug'),base,'secondary').target.unit,'reps');
  assert.equal(prescription(e('lat-pulldown'),base,'secondary').restSeconds,120);
  assert.equal(prescription(e('dumbbell-biceps-curl'),base,'accessory').restSeconds,60);
  assert.equal(resolveGroup(TEMPLATES.full.slots[1],base),'hip-extension');
  assert.equal(resolveGroup(TEMPLATES.full.slots[1],{...base,experience:'advanced'}),'hinge');
});

test('strength emphasis changes only authored priorities and respects difficulty',()=>{
  const p={...base,goal:'strength',experience:'advanced'};
  const plan=generatePlan(p).plan;
  assert.equal(plan.workouts[0].exercises[0].exerciseId,'ex-barbell-back-squat');
  assert.equal(plan.workouts[0].exercises[2].exerciseId,'ex-barbell-bench-press');
  assert.ok(!approvedCandidates('squat',{...p,experience:'beginner'}).some(e=>e.id==='ex-barbell-back-squat'));
});

test('controlled regeneration changes one approved slot, preserves order and keeps repeated A sessions identical',()=>{
  const first=generatePlan(base).plan;const snapshot=structuredClone(first);
  const next=regeneratePlan(first);assert.equal(next.changed,true);assert.match(next.message,/Approved substitution:/);
  assert.deepEqual(next,regeneratePlan(first));assert.notEqual(planSignature(next.plan),planSignature(first));assert.deepEqual(first,snapshot);
  assert.deepEqual(next.plan.preferences,first.preferences);assert.deepEqual(next.plan.schedule,first.schedule);
  const keys=new Set();
  for(const [i,w]of first.workouts.entries())for(const [j,entry]of w.exercises.entries()){
    const after=next.plan.workouts[i].exercises[j];assert.equal(after.slotId,entry.slotId);assert.equal(after.group,entry.group);
    if(after.exerciseId!==entry.exerciseId)keys.add(`${w.programKey}:${entry.slotId}`);
  }
  assert.equal(keys.size,1);
  assert.deepEqual(next.plan.workouts[0].exercises,next.plan.workouts[2].exercises);
  assert.deepEqual(generatePlan(base,5),generatePlan(base,5));
  const minimal=['leg-press','glute-bridge','machine-chest-press','seated-cable-row','dead-bug'].map(e);
  const limited=generatePlan(base,0,minimal);assert.equal(limited.ok,true);
  const unchanged=regeneratePlan(limited.plan,minimal);assert.equal(unchanged.changed,false);assert.deepEqual(unchanged.plan,limited.plan);assert.match(unchanged.message,/No eligible approved/);
});

test('missing equipment or required slots cannot silently produce partial sessions',()=>{
  assert.equal(generatePlan({...base,equipment:'dumbbells',hasBench:false,gymEquipment:[]}).ok,false);
  assert.equal(generatePlan({...base,equipment:'bodyweight',gymEquipment:[]}).ok,false);
  assert.equal(generatePlan({...base,gymEquipment:[]}).ok,false);
  const reduced=generatePlan({...base,gymEquipment:['Cable']});assert.equal(reduced.ok,false);assert.match(reduced.message,/Main squat/);
  const machinesAndCable=generatePlan({...base,gymEquipment:['Machine','Cable']});assert.equal(machinesAndCable.ok,true);assert.ok(machinesAndCable.plan.workouts.flatMap(w=>w.exercises).every(entry=>EXERCISES.find(e=>e.id===entry.exerciseId).equipment.every(item=>['Bodyweight','Machine','Cable'].includes(item))));
  const withoutRows=EXERCISES.filter(e=>e.movementPattern!=='Horizontal pull');assert.equal(generatePlan(base,0,withoutRows).ok,false);
  assert.equal(generatePlan(base,0,[]).ok,false);
});

test('invalid split/frequency, equipment confirmations and seeds are rejected',()=>{
  for(const input of [null,undefined,{},'bad',42,{...base,goal:'toString'},{...base,experience:'expert'},{...base,days:'3'},{...base,split:'ul-4'},{...base,split:''},{...base,equipment:'garage'},{...base,hasBench:true},{...base,hasBand:true},{...base,gymEquipment:['Cable','Cable']},{...base,gymEquipment:['Trap bar']},{...base,gymEquipment:null}])assert.equal(generatePlan(input).ok,false);
  for(const seed of [-1,NaN,Infinity,0.5,1_000_001,'1'])assert.equal(generatePlan(base,seed).ok,false);
  assert.deepEqual(validatePreferences(base,1_000_000),{});
});

test('a permitted repetition-to-hold substitution recalculates the dose without changing the anti-extension slot',()=>{
  const limited=['leg-press','glute-bridge','machine-chest-press','seated-cable-row','dead-bug','forearm-plank'].map(e);
  const first=generatePlan(base,0,limited).plan;
  const next=regeneratePlan(first,limited);
  assert.equal(next.changed,true);
  const core=next.plan.workouts[0].exercises.find(entry=>entry.slotId==='core');
  assert.equal(core.exerciseId,'ex-forearm-plank');assert.equal(core.group,'core');
  assert.deepEqual(core.dose.target,{unit:'seconds',min:15,max:25});
  assert.equal(formatDose(core.dose),'2 sets × 15–25 seconds');
  assert.deepEqual(next.plan.workouts[0].exercises,next.plan.workouts[2].exercises);
  assert.equal(next.plan.workouts[1].exercises.find(entry=>entry.slotId==='core').exerciseId,'ex-dead-bug');
});
