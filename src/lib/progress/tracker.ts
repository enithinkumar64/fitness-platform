import { EXERCISES } from '../exercises/exercises.ts';
import { calculateEpley, validateOneRepMaxInput } from '../calculators/one-rep-max.ts';
import { LB_TO_KG, INCH_TO_CM } from '../calculators/tdee.ts';
import { localDate, validDate } from '../nutrition/core.ts';
export { localDate };
export const STORAGE_KEY = 'formfuel-progress-v1';
export const AREAS = ['waist','chest','hips','upperArm','thigh'] as const;
export type Area = typeof AREAS[number];
export const AREA_LABELS: Record<Area,string> = {waist:'Waist',chest:'Chest',hips:'Hips',upperArm:'Upper arm',thigh:'Thigh'};
export const MEASUREMENT_LIMITS: Record<Area,readonly [number,number]> = {waist:[10,350],chest:[10,350],hips:[10,350],upperArm:[3,100],thigh:[5,200]};
export type Unit = 'kg'|'lb'|'cm'|'in';
export type BaseEntry = {id:string;date:string;sequence:number;note:string};
export type WeightEntry = BaseEntry & {weightKg:number};
export type MeasurementEntry = BaseEntry & {values:Partial<Record<Area,number>>};
export type StrengthEntry = BaseEntry & {exerciseId:string|null;exerciseName:string;sets:number;repetitions:number;loadKg:number};
export type ProgressStore = {version:1;weights:WeightEntry[];measurements:MeasurementEntry[];strength:StrengthEntry[]};
export type Kind = 'weights'|'measurements'|'strength';
export type Entries = {weights:WeightEntry;measurements:MeasurementEntry;strength:StrengthEntry};
export const EMPTY: ProgressStore = {version:1,weights:[],measurements:[],strength:[]};
export const TRACKABLE_EXERCISES = EXERCISES.filter(e=> e.category !== 'Cardio and conditioning' && !['ex-forearm-plank','ex-side-plank','ex-farmer-carry','ex-suitcase-carry','ex-band-lateral-walk'].includes(e.id));
// Conservative allowlist: bilateral free-weight lifts with an explicit TOTAL external load.
// Machines, dumbbell conventions, bodyweight, assistance, bands, timed work and custom names are not estimated.
export const ESTIMATED_MAX_EXERCISES = ['ex-barbell-bench-press','ex-incline-barbell-bench-press','ex-close-grip-bench-press','ex-barbell-back-squat','ex-barbell-front-squat','ex-conventional-deadlift','ex-trap-bar-deadlift','ex-barbell-romanian-deadlift','ex-barbell-overhead-press','ex-barbell-bent-over-row'] as const;
export function toCanonical(value:number, unit:Unit):number {
  if (!['kg','lb','cm','in'].includes(unit) || !Number.isFinite(value)) throw new Error('Enter a finite number and a supported unit.');
  return value*(unit==='lb'?LB_TO_KG:unit==='in'?INCH_TO_CM:1);
}
export function fromCanonical(value:number,unit:Unit):number {
  if (!['kg','lb','cm','in'].includes(unit) || !Number.isFinite(value)) throw new Error('Enter a finite number and a supported unit.');
  return value/(unit==='lb'?LB_TO_KG:unit==='in'?INCH_TO_CM:1);
}
export function parseNumber(text:string):number {
  const trimmed=text.trim();
  return /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed) ? Number(trimmed) : NaN;
}
export function progressDate(date:unknown):date is string {
  return typeof date==='string' && validDate(date) && date>='1900-01-01' && date<='2100-12-31';
}
export function sorted<T extends BaseEntry>(entries:readonly T[]):T[] {
  return [...entries].sort((a,b)=>a.date.localeCompare(b.date)||a.sequence-b.sequence||a.id.localeCompare(b.id));
}
function bounded(value:unknown,min:number,max:number):value is number {return typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;}
function validateBase(entry:BaseEntry) {
  if (!entry || typeof entry.id!=='string' || !entry.id.trim() || entry.id.length>200 || !progressDate(entry.date) || !Number.isSafeInteger(entry.sequence) || entry.sequence<1 || typeof entry.note!=='string' || entry.note.length>500)
    throw new Error('Choose a valid date from 1900–2100, an entry ID, and a note of at most 500 characters.');
}
export function loadKind(entry: Pick<StrengthEntry,'exerciseId'>):'external'|'bodyweight'|'assistance'|'band' {
  if (entry.exerciseId==='ex-assisted-pull-up'||entry.exerciseId==='ex-assisted-triceps-dip') return 'assistance';
  const exercise=EXERCISES.find(e=>e.id===entry.exerciseId);
  if(exercise?.equipment.includes('Resistance band')) return 'band';
  if(exercise && !exercise.equipment.some(e=>['Barbell','Dumbbells','Cable','Machine','Kettlebell','Trap bar','EZ bar'].includes(e))) return 'bodyweight';
  return 'external';
}
export function validateEntry<K extends Kind>(kind:K,entry:Entries[K]):void {
  validateBase(entry);
  if(kind==='weights') {
    if(!bounded((entry as WeightEntry).weightKg,10,500))throw new Error('Enter a body weight from 10 to 500 kg (or equivalent pounds).');
  } else if(kind==='measurements') {
    const values=(entry as MeasurementEntry).values;
    if(!values || typeof values!=='object' || Array.isArray(values) || Object.keys(values).length===0)throw new Error('Enter at least one body measurement. Leave unmeasured areas blank.');
    for(const [key,value] of Object.entries(values)) {
      if(!AREAS.includes(key as Area))throw new Error('Unknown measurement area.');
      const [min,max]=MEASUREMENT_LIMITS[key as Area];
      if(!bounded(value,min,max))throw new Error(`${AREA_LABELS[key as Area]} must be ${min}–${max} cm (or equivalent inches).`);
    }
  } else if(kind==='strength') {
    const e=entry as StrengthEntry;
    if(e.exerciseId!==null && (typeof e.exerciseId!=='string'||!TRACKABLE_EXERCISES.some(x=>x.id===e.exerciseId && x.name===e.exerciseName)))throw new Error('Choose a supported repetition-based exercise. Timed holds, carries and conditioning are outside this log.');
    if(typeof e.exerciseName!=='string'||e.exerciseName.trim().length<2||e.exerciseName.length>100)throw new Error('Choose an exercise or enter a custom name of 2–100 characters.');
    if(!Number.isInteger(e.sets)||e.sets<1||e.sets>20||!Number.isInteger(e.repetitions)||e.repetitions<1||e.repetitions>100)throw new Error('Use whole numbers: 1–20 sets and 1–100 repetitions per set.');
    if(!bounded(e.loadKg,0,1000)||(e.loadKg>0&&e.loadKg<0.1))throw new Error('Load must be 0 (unloaded) or 0.1–1,000 kg, or equivalent pounds.');
    if(loadKind(e)==='band'&&e.loadKg!==0)throw new Error('Band resistance is not a known kilogram load. Enter 0 and describe the band in notes.');
  } else throw new Error('Unsupported progress section.');
}
export function nextSequence(store:ProgressStore):number {
  return Math.max(0,...store.weights.map(e=>e.sequence),...store.measurements.map(e=>e.sequence),...store.strength.map(e=>e.sequence))+1;
}
export function saveEntry<K extends Kind>(store:ProgressStore,kind:K,entry:Entries[K]):ProgressStore {
  validateEntry(kind,entry);
  const all=[...store.weights,...store.measurements,...store.strength];
  const previous=all.find(e=>e.id===entry.id);
  if(previous && !(store[kind] as BaseEntry[]).some(e=>e.id===entry.id))throw new Error('This ID belongs to another tracking section.');
  if(previous&&previous.sequence!==entry.sequence)throw new Error('Editing must preserve the original entry sequence.');
  if(!previous && all.length>=10000)throw new Error('This browser diary supports up to 10,000 entries. Export before removing old entries.');
  const list=(store[kind] as Entries[K][]).filter(e=>e.id!==entry.id);
  return {...store,[kind]:[...list,structuredClone(entry)]};
}
export function removeEntry(store:ProgressStore,kind:Kind,id:string):ProgressStore {
  return {...store,[kind]:store[kind].filter(e=>e.id!==id)};
}
export function parseStore(raw:string|null):ProgressStore {
  if(raw===null)return structuredClone(EMPTY);
  const value=JSON.parse(raw);
  if(!value||value.version!==1||!['weights','measurements','strength'].every(k=>Array.isArray(value[k]))||value.weights.length+value.measurements.length+value.strength.length>10000)throw new Error('Invalid progress storage.');
  const result=structuredClone(EMPTY);const ids=new Set<string>();
  for(const kind of ['weights','measurements','strength'] as const) {
    for(const entry of value[kind]) {
      validateEntry(kind,entry);
      if(ids.has(entry.id))throw new Error('Duplicate entry ID.');ids.add(entry.id);
      // Explicit fields only: unrelated browser data never enters the store or CSV.
      const base={id:entry.id,date:entry.date,sequence:entry.sequence,note:entry.note};
      if(kind==='weights')result.weights.push({...base,weightKg:entry.weightKg});
      if(kind==='measurements')result.measurements.push({...base,values:Object.fromEntries(AREAS.filter(k=>entry.values[k]!==undefined).map(k=>[k,entry.values[k]]))});
      if(kind==='strength')result.strength.push({...base,exerciseId:entry.exerciseId,exerciseName:entry.exerciseName,sets:entry.sets,repetitions:entry.repetitions,loadKg:entry.loadKg});
    }
  }
  return result;
}
export function valueSummary<T extends BaseEntry>(entries:readonly T[], getValue:(entry:T)=>number|undefined) {
  const values=sorted(entries).flatMap(entry=>{const value=getValue(entry);return value===undefined?[]:[{entry,value}];});
  if(!values.length)return null;
  return {first:values[0],latest:values[values.length-1],change:values[values.length-1].value-values[0].value};
}
export function exerciseKey(entry:Pick<StrengthEntry,'exerciseId'|'exerciseName'>):string {
  return entry.exerciseId ? `library:${entry.exerciseId}` : `custom:${entry.exerciseName.normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase()}`;
}
export function strengthHistory(entries:StrengthEntry[],key:string):StrengthEntry[] {return sorted(entries.filter(e=>exerciseKey(e)===key));}
export function estimatedMax(entry:StrengthEntry):number|null {
  if(!(ESTIMATED_MAX_EXERCISES as readonly string[]).includes(entry.exerciseId??'')||Object.keys(validateOneRepMaxInput({weightKg:entry.loadKg,repetitions:entry.repetitions})).length)return null;
  return calculateEpley({weightKg:entry.loadKg,repetitions:entry.repetitions});
}
export function strengthRecords(entries:StrengthEntry[],key:string,repetitions:number) {
  const history=strengthHistory(entries,key);
  if(!history.length)return null;
  const kind=loadKind(history[0]);
  const atReps=history.filter(e=>e.repetitions===repetitions);
  return {kind,heaviestLoadKg:kind==='assistance'||kind==='band'?null:Math.max(...history.map(e=>e.loadKg)),
    bestAtRepsKg:atReps.length&&kind!=='band'?(kind==='assistance'?Math.min(...atReps.map(e=>e.loadKg)):Math.max(...atReps.map(e=>e.loadKg))):null,
    estimatedMaxKg:history.reduce<number|null>((best,e)=>{const value=estimatedMax(e);return value===null?best:Math.max(best??value,value);},null)};
}
/** Quoted cells preserve commas/quotes/newlines. Apostrophe-neutralize spreadsheet formulas in user text. */
export function csvCell(value:string|number):string {
  const text=String(value);const safe=typeof value==='string'&&/^[\s\u0000-\u001f]*[=+\-@]/.test(text)?`'${text}`:text;
  return `"${safe.replaceAll('"','""')}"`;
}
export function exportCsv(store:ProgressStore):string {
  const rows:(string|number)[][]=[['section','entry_id','date','same_day_sequence','exercise_id','exercise_name','body_weight_kg','waist_cm','chest_cm','hips_cm','upper_arm_cm','thigh_cm','sets','repetitions_per_set','external_load_or_assistance_kg','load_type','estimated_epley_1rm_kg','note']];
  const items=[...store.weights.map(e=>({kind:'weights' as const,e})),...store.measurements.map(e=>({kind:'measurements' as const,e})),...store.strength.map(e=>({kind:'strength' as const,e}))].sort((a,b)=>a.e.date.localeCompare(b.e.date)||a.e.sequence-b.e.sequence||a.e.id.localeCompare(b.e.id));
  for(const {kind,e} of items) {
    const weight=kind==='weights'?e as WeightEntry:null,measure=kind==='measurements'?e as MeasurementEntry:null,strength=kind==='strength'?e as StrengthEntry:null;
    rows.push([kind,e.id,e.date,e.sequence,strength?.exerciseId??'',strength?.exerciseName??'',weight?.weightKg??'',...AREAS.map(k=>measure?.values[k]??''),strength?.sets??'',strength?.repetitions??'',strength?.loadKg??'',strength?loadKind(strength):'',strength?estimatedMax(strength)??'':'',e.note]);
  }
  return rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
