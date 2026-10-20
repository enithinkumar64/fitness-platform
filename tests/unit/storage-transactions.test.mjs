import {test} from 'node:test';
import assert from 'node:assert/strict';
import {commitChange,unchanged,StorageConflict} from '../../src/lib/storage/transactions.ts';
import * as nutrition from '../../src/lib/nutrition/core.ts';
import {STARTER_FOODS} from '../../src/lib/nutrition/foods.ts';
import * as progress from '../../src/lib/progress/tracker.ts';
function memory(initial={}){const data=new Map(Object.entries(initial));return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
test('commit reads latest records rather than a stale document; keys stay isolated',()=>{
 const storage=memory();const first={id:'a',sequence:1,date:'2026-10-01',note:'',weightKg:80};
 commitChange(storage,'progress',progress.parseStore,s=>progress.saveEntry(s,'weights',first));
 commitChange(storage,'progress',progress.parseStore,s=>progress.saveEntry(s,'weights',{...first,id:'b',sequence:2,weightKg:81}));
 commitChange(storage,'nutrition',nutrition.parseDiary,s=>({...s,targets:{calories:2000}}));
 assert.equal(progress.parseStore(storage.getItem('progress')).weights.length,2);
 assert.equal(nutrition.parseDiary(storage.getItem('nutrition')).targets.calories,2000);
});
test('stale edits/deletes and deleted-record recreation are rejected without writing',()=>{
 const before={id:'a',weightKg:80},after={id:'a',weightKg:81};const storage=memory({data:JSON.stringify({entries:[after]})});
 const raw=storage.getItem('data');
 assert.throws(()=>commitChange(storage,'data',JSON.parse,s=>{unchanged(s.entries[0],before);return {entries:[]};}),StorageConflict);
 assert.equal(storage.getItem('data'),raw);
 assert.throws(()=>unchanged(undefined,before),StorageConflict);
 assert.throws(()=>unchanged(after,undefined),StorageConflict);
 unchanged(after,{weightKg:81,id:'a'});
 unchanged({values:{waist:80,chest:100}},{values:{chest:100,waist:80}});
});
test('snapshot checks detect changed targets and preparation-time noncooperating writes',()=>{
 assert.throws(()=>unchanged({calories:2200},{calories:2000}),StorageConflict);
 const storage=memory({data:'{"value":1}'});
 assert.throws(()=>commitChange(storage,'data',JSON.parse,s=>{storage.setItem('data','{"value":2}');return {...s,value:3};}),StorageConflict);
 assert.equal(storage.getItem('data'),'{"value":2}');
});
test('malformed storage and storage failures do not silently reset stored records',()=>{
 const storage=memory({data:'{bad'});
 assert.throws(()=>commitChange(storage,'data',nutrition.parseDiary,s=>s));assert.equal(storage.getItem('data'),'{bad');
 assert.throws(()=>commitChange({...storage,getItem:()=>{throw Error('denied');}},'data',nutrition.parseDiary,s=>s));
 assert.throws(()=>commitChange({...storage,getItem:()=>null,setItem:()=>{throw Error('full');}},'data',nutrition.parseDiary,s=>s));
});
test('legacy nutrition migration retains stable IDs, targets, grams and serving snapshots',()=>{
 const food=STARTER_FOODS.find(f=>f.sourceId==='171688');const entry=nutrition.makeEntry('stable','2026-10-01','Breakfast',food,100,'g');
 const storage=memory({data:JSON.stringify({version:1,entries:[entry],targets:{protein:90}})});
 const next=commitChange(storage,'data',nutrition.parseDiary,s=>({...s,targets:{...s.targets,calories:2000}}));
 assert.equal(next.version,2);assert.equal(next.entries[0].id,'stable');assert.equal(next.entries[0].grams,100);assert.equal(next.targets.protein,90);
 const snapshot=next.entries[0].serving;
 const latest=commitChange(storage,'data',nutrition.parseDiary,s=>({...s,targets:{...s.targets,fat:60}}));
 assert.deepEqual(latest.entries[0].serving,snapshot);
});
test('all progress sections preserve canonical values and original IDs on commit',()=>{
 const storage=memory();const base={sequence:1,date:'2026-10-01',note:''};
 commitChange(storage,'p',progress.parseStore,s=>progress.saveEntry(s,'weights',{...base,id:'w',weightKg:45.359237}));
 commitChange(storage,'p',progress.parseStore,s=>progress.saveEntry(s,'measurements',{...base,id:'m',sequence:2,values:{waist:81.28}}));
 const result=commitChange(storage,'p',progress.parseStore,s=>progress.saveEntry(s,'strength',{...base,id:'s',sequence:3,exerciseId:null,exerciseName:'Custom row',sets:3,repetitions:8,loadKg:20}));
 assert.equal(result.version,1);assert.equal(result.weights[0].weightKg,45.359237);assert.equal(result.measurements[0].values.waist,81.28);assert.equal(result.strength[0].id,'s');
});

test('a proposed state that violates the existing schema is never persisted',()=>{
 const storage=memory();
 assert.throws(()=>commitChange(storage,'progress',progress.parseStore,s=>({...s,weights:[{id:'broken'}]})));
 assert.equal(storage.getItem('progress'),null);
});
