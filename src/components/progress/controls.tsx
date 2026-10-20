import { parseNumber, toCanonical, fromCanonical, type Unit } from '@/lib/progress/tracker';
import { useState } from 'react';
export const INPUT='mt-2 block min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-2';
export const PANEL='min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-7';
export const BUTTON='min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary';
export const SECONDARY='min-h-control rounded-control border border-border-control bg-background px-4 py-2 text-foreground';
/** Canonical numbers survive unit switches and untouched edits without repeated display rounding. */
export function useUnitFields(initialUnit:Unit) {
  const [unit,setUnit]=useState(initialUnit);
  const [values,setValues]=useState<Record<string,number>>({});
  const [texts,setTexts]=useState<Record<string,string>>({});
  function change(key:string,text:string) {
    setTexts(old=>({...old,[key]:text}));
    setValues(old=>{const next={...old};if(!text.trim())delete next[key];else {const n=parseNumber(text);next[key]=Number.isFinite(n)?toCanonical(n,unit):NaN;}return next;});
  }
  function switchUnit(next:Unit) {
    if((['kg','lb'].includes(unit))!==(['kg','lb'].includes(next)))return;
    setTexts(old=>Object.fromEntries(Object.keys(old).map(k=>[k,Number.isFinite(values[k])?String(fromCanonical(values[k],next)):old[k]])));
    setUnit(next);
  }
  function load(next:Record<string,number>) {setValues({...next});setTexts(Object.fromEntries(Object.entries(next).map(([k,v])=>[k,String(fromCanonical(v,unit))])));}
  function clear(){setValues({});setTexts({});}
  return {unit,values,texts,change,switchUnit,load,clear};
}
export function CommonFields({prefix,date,note,onDate,onNote}:{prefix:string;date:string;note:string;onDate:(v:string)=>void;onNote:(v:string)=>void}) {
  return <><label htmlFor={`${prefix}-date`} className="block">Date<input id={`${prefix}-date`} className={INPUT} type="date" min="1900-01-01" max="2100-12-31" value={date} onChange={e=>onDate(e.target.value)}/></label>
    <label htmlFor={`${prefix}-note`} className="block sm:col-span-2">Note (optional)<textarea id={`${prefix}-note`} className={INPUT} maxLength={500} rows={2} value={note} onChange={e=>onNote(e.target.value)}/></label></>;
}
export function UnitControl({label,unit,onChange,measurement=false}:{label:string;unit:Unit;onChange:(unit:Unit)=>void;measurement?:boolean}) {
  return <label className="block">{label}<select className={INPUT} value={unit} onChange={e=>onChange(e.target.value as Unit)}>{(measurement?['cm','in']:['kg','lb']).map(u=><option key={u} value={u}>{u==='in'?'inches':u}</option>)}</select></label>;
}
