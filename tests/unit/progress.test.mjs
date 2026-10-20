import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as p from '../../src/lib/progress/tracker.ts';
const base=(id='a',date='2026-10-19',sequence=1)=>({id,date,sequence,note:''});
const weight=(id='a',date='2026-10-19',sequence=1,weightKg=80)=>({...base(id,date,sequence),weightKg});
const measure=(id='m',date='2026-10-19',sequence=2,values={waist:80})=>({...base(id,date,sequence),values});
const strength=(id='s',date='2026-10-19',sequence=3,extra={})=>({...base(id,date,sequence),exerciseId:'ex-barbell-bench-press',exerciseName:'Barbell Bench Press',sets:3,repetitions:8,loadKg:60,...extra});
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`);
test('canonical kg/lb and cm/in conversions are exact to floating-point tolerance',()=>{
 close(p.toCanonical(100,'lb'),45.359237);close(p.fromCanonical(45.359237,'lb'),100);close(p.toCanonical(10,'in'),25.4);close(p.fromCanonical(25.4,'in'),10);assert.equal(p.toCanonical(60,'kg'),60);assert.equal(p.fromCanonical(80,'cm'),80);
 for(const value of [NaN,Infinity,-Infinity])assert.throws(()=>p.toCanonical(value,'kg'));assert.throws(()=>p.fromCanonical(10,'stone'));
});
test('numeric parsing rejects empty, negative, nonfinite and nondecimal input',()=>{for(const text of ['',' ','-1','Infinity','NaN','0x10','1,2','abc'])assert.ok(Number.isNaN(p.parseNumber(text)));assert.equal(p.parseNumber(' 80.5 '),80.5);assert.equal(p.parseNumber('.5'),0.5);});
test('local dates validate calendar days and broad supported years',()=>{assert.ok(p.progressDate('2024-02-29'));for(const date of ['2026-02-29','2026-02-30','2026-13-01','2026-2-01','1899-12-31','2101-01-01',null])assert.ok(!p.progressDate(date));assert.equal(p.localDate(new Date(2026,0,1,0,1)),'2026-01-01');});
test('date sorting and stable same-day sequence do not use array insertion order',()=>{
 const entries=[weight('late','2026-10-20',1,78),weight('same-b','2026-10-01',3,82),weight('same-a','2026-10-01',2,80)];
 assert.deepEqual(p.sorted(entries).map(e=>e.id),['same-a','same-b','late']);const summary=p.valueSummary(entries,e=>e.weightKg);assert.equal(summary.first.value,80);assert.equal(summary.latest.value,78);assert.equal(summary.change,-2);assert.equal(entries[0].id,'late');
 assert.deepEqual(p.sorted([weight('b','2026-10-01',1),weight('a','2026-10-01',1)]).map(e=>e.id),['a','b']);assert.equal(p.valueSummary([],e=>e.weightKg),null);
});
test('measurement summaries never turn unmeasured areas into zero',()=>{
 const entries=[measure('a','2026-10-01',1,{waist:80}),measure('b','2026-10-05',2,{chest:100}),measure('c','2026-10-10',3,{waist:82})];
 assert.equal(p.valueSummary(entries,e=>e.values.waist).change,2);const chest=p.valueSummary(entries,e=>e.values.chest);assert.equal(chest.latest.value,100);assert.equal(chest.change,0);assert.equal(p.valueSummary(entries,e=>e.values.hips),null);
});
test('add, edit, date change and delete retain IDs and original sequences',()=>{
 let store=p.saveEntry(p.EMPTY,'weights',weight());store=p.saveEntry(store,'measurements',measure());assert.equal(p.nextSequence(store),3);
 store=p.saveEntry(store,'weights',{...store.weights[0],date:'2026-09-01',weightKg:79});assert.equal(store.weights.length,1);assert.equal(store.weights[0].sequence,1);assert.equal(store.weights[0].weightKg,79);
 assert.throws(()=>p.saveEntry(store,'weights',{...store.weights[0],sequence:99}));assert.throws(()=>p.saveEntry(store,'strength',strength('a')));
 assert.equal(p.removeEntry(store,'weights','a').weights.length,0);assert.equal(p.EMPTY.weights.length,0);
});
test('body weight and measurement software bounds reject invalid and empty values',()=>{
 for(const value of [undefined,null,NaN,Infinity,-1,0,9.99,501,'80'])assert.throws(()=>p.validateEntry('weights',{...weight(),weightKg:value}));
 for(const value of [10,500])assert.doesNotThrow(()=>p.validateEntry('weights',weight('x','2026-10-19',1,value)));
 for(const values of [{},{waist:0},{waist:Infinity},{upperArm:101},{thigh:-1},{unknown:10},{hips:null}])assert.throws(()=>p.validateEntry('measurements',measure('m','2026-10-19',1,values)));
 assert.doesNotThrow(()=>p.validateEntry('measurements',measure('m','2026-10-19',1,{upperArm:30,waist:80})));
});
test('exercise-specific history and normalized custom names stay distinct from library entries',()=>{
 const a=strength(),b=strength('b','2026-10-20',4,{exerciseId:null,exerciseName:' My   Press '}),c=strength('c','2026-10-21',5,{exerciseId:null,exerciseName:'my press'}),d=strength('d','2026-10-22',6,{exerciseId:null,exerciseName:'Barbell Bench Press'});
 assert.equal(p.exerciseKey(b),p.exerciseKey(c));assert.equal(p.strengthHistory([a,b,c,d],p.exerciseKey(b)).length,2);assert.equal(p.strengthHistory([a,b,c,d],p.exerciseKey(a)).length,1);assert.notEqual(p.exerciseKey(a),p.exerciseKey(d));
});
test('heaviest load, best at exact reps and best estimated 1RM have separate definitions',()=>{
 const entries=[strength(),strength('b','2026-10-20',4,{loadKg:70,repetitions:5}),strength('c','2026-10-21',5,{loadKg:65,repetitions:8})];
 const records=p.strengthRecords(entries,p.exerciseKey(entries[0]),8);assert.equal(records.heaviestLoadKg,70);assert.equal(records.bestAtRepsKg,65);close(records.estimatedMaxKg,82.33333333333333);assert.equal(p.estimatedMax(entries[0]),76);assert.equal(p.strengthRecords(entries,p.exerciseKey(entries[0]),10).bestAtRepsKg,null);
});
test('estimates reuse one-rep special case and exclude unsupported exercises and repetition counts',()=>{
 assert.equal(p.estimatedMax(strength('x','2026-10-19',1,{repetitions:1})),60);
 for(const extra of [{exerciseId:'ex-push-up',exerciseName:'Push-Up',loadKg:20},{exerciseId:'ex-assisted-pull-up',exerciseName:'Assisted Pull-Up'},{exerciseId:'ex-dumbbell-bench-press',exerciseName:'Dumbbell Bench Press'},{exerciseId:null,exerciseName:'Custom lift'},{repetitions:13},{loadKg:0}])assert.equal(p.estimatedMax(strength('x','2026-10-19',1,extra)),null);
 assert.throws(()=>p.validateEntry('strength',strength('x','2026-10-19',1,{exerciseId:'ex-forearm-plank',exerciseName:'Forearm Plank'})));
 assert.equal(p.TRACKABLE_EXERCISES.some(e=>e.id==='ex-brisk-walking'),false);
 for(const id of p.ESTIMATED_MAX_EXERCISES)assert.ok(p.TRACKABLE_EXERCISES.some(e=>e.id===id));
});
test('assistance and bands are not misreported as heaviest lifted weights',()=>{
 const entries=[strength('a','2026-10-19',1,{exerciseId:'ex-assisted-pull-up',exerciseName:'Assisted Pull-Up',loadKg:40}),strength('b','2026-10-20',2,{exerciseId:'ex-assisted-pull-up',exerciseName:'Assisted Pull-Up',loadKg:35})];
 const records=p.strengthRecords(entries,p.exerciseKey(entries[0]),8);assert.equal(records.heaviestLoadKg,null);assert.equal(records.bestAtRepsKg,35);assert.equal(records.estimatedMaxKg,null);
 assert.throws(()=>p.validateEntry('strength',strength('b','2026-10-19',1,{exerciseId:'ex-band-row',exerciseName:'Band Row',loadKg:10})));
 assert.doesNotThrow(()=>p.validateEntry('strength',strength('b','2026-10-19',1,{exerciseId:'ex-push-up',exerciseName:'Push-Up',loadKg:0})));
});
test('invalid strength fields and custom exercise names are rejected',()=>{
 for(const extra of [{sets:0},{sets:21},{sets:1.5},{repetitions:0},{repetitions:101},{repetitions:1.5},{loadKg:-1},{loadKg:Infinity},{loadKg:0.01},{loadKg:1001},{exerciseId:'invented',exerciseName:'Nope'},{exerciseId:null,exerciseName:''},{exerciseId:null,exerciseName:'x'.repeat(101)}])assert.throws(()=>p.validateEntry('strength',strength('x','2026-10-19',1,extra)));
 assert.doesNotThrow(()=>p.validateEntry('strength',strength('x','2026-10-19',1,{exerciseId:null,exerciseName:'Custom row',repetitions:100,sets:20,loadKg:1000})));
});
test('storage validates version, arrays, IDs, dates, notes, sequences and canonical values',()=>{
 const store={version:1,weights:[weight()],measurements:[measure()],strength:[strength()]};assert.deepEqual(p.parseStore(JSON.stringify(store)),store);assert.deepEqual(p.parseStore(null),p.EMPTY);
 for(const raw of ['','{','null','[]','{}',JSON.stringify({...store,version:2}),JSON.stringify({...store,weights:[weight(),weight()]}),JSON.stringify({...store,strength:[strength('a')]}),JSON.stringify({...store,weights:[{...weight(),date:'2026-02-30'}]}),JSON.stringify({...store,weights:[{...weight(),note:'x'.repeat(501)}]}),JSON.stringify({...store,weights:[{...weight(),sequence:0}]}),JSON.stringify({...store,measurements:[null]})])assert.throws(()=>p.parseStore(raw));
 const stripped=p.parseStore(JSON.stringify({...store,browserMetadata:'secret',weights:[{...weight(),apiKey:'not-progress'}]}));assert.equal(stripped.browserMetadata,undefined);assert.equal(stripped.weights[0].apiKey,undefined);
});
test('CSV escapes quotes, commas and line breaks and neutralizes spreadsheet formulas in text',()=>{
 assert.equal(p.csvCell('hello, "world"\nnext'),'"hello, ""world""\nnext"');assert.equal(p.csvCell('=1+1'),'"\'=1+1"');assert.equal(p.csvCell('\t@SUM(A1)'),'"\'\t@SUM(A1)"');assert.equal(p.csvCell(80.25),'"80.25"');assert.equal(p.csvCell('2026-10-19'),'"2026-10-19"');
});
test('CSV exports only recorded canonical progress with explicit units and blanks for missing measurements',()=>{
 const store={version:1,weights:[{...weight(),note:'Actual, "note"\nsecond line'}],measurements:[measure()],strength:[strength()]};const csv=p.exportCsv(store);
 assert.ok(csv.startsWith('"section","entry_id","date","same_day_sequence"'));assert.ok(csv.includes('"body_weight_kg"'));assert.ok(csv.includes('"upper_arm_cm"'));assert.ok(csv.includes('"estimated_epley_1rm_kg"'));assert.ok(csv.includes('"80"'));assert.ok(csv.includes('"76"'));assert.ok(csv.includes('Actual, ""note""\nsecond line'));assert.ok(csv.includes('"80","","","",""'));assert.ok(!csv.includes('localStorage'));assert.ok(csv.endsWith('\r\n'));assert.equal(p.exportCsv(p.EMPTY).split('\r\n').length,2);
});
