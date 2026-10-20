'use client';
import { useEffect, useState } from 'react';
import { EMPTY, STORAGE_KEY, exportCsv, localDate, parseStore, removeEntry, saveEntry, type Entries, type Kind, type ProgressStore } from '@/lib/progress/tracker';
import { WeightTracker } from './weight-tracker';
import { MeasurementTracker } from './measurement-tracker';
import { StrengthTracker } from './strength-tracker';
import { BUTTON, PANEL, SECONDARY } from './controls';
export function ProgressTracker() {
  const [store,setStore]=useState<ProgressStore>(EMPTY),[ready,setReady]=useState(false),[storageWarning,setStorageWarning]=useState(''),[message,setMessage]=useState(''),[resetKey,setResetKey]=useState(0);
  useEffect(()=>{
    let active=true;
    queueMicrotask(()=>{
      if(!active)return;
      try{setStore(parseStore(localStorage.getItem(STORAGE_KEY)));}
      catch{setStorageWarning('Saved progress could not be read. It has not been overwritten. You can continue in this session, or explicitly clear stored progress.');}
      setReady(true);
    });
    return ()=>{active=false;};
  },[]);
  function persist(next:ProgressStore) {
    setStore(next);
    if(storageWarning)return;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}
    catch{setStorageWarning('Browser storage is unavailable or full. Changes remain in this session only. Export CSV to keep a copy.');}
  }
  function save<K extends Kind>(kind:K,entry:Entries[K]) {
    persist(saveEntry(store,kind,entry));setMessage('Progress entry saved.');
  }
  function remove(kind:Kind,id:string):boolean {
    const entry=store[kind].find(e=>e.id===id);
    if(!entry||!window.confirm(`Delete this ${kind==='weights'?'body weight':kind==='measurements'?'body measurement':'strength'} entry for ${entry.date}? This cannot be undone.`))return false;
    persist(removeEntry(store,kind,id));setMessage('Progress entry deleted.');return true;
  }
  function download() {
    const url=URL.createObjectURL(new Blob([exportCsv(store)],{type:'text/csv;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download=`formfuel-progress-${localDate()}.csv`;document.body.appendChild(anchor);anchor.click();anchor.remove();
    // Delay revocation until the browser has consumed the download request.
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    setMessage('CSV export requested. It contains only your recorded progress.');
  }
  if(!ready)return <p role="status" className="mt-8">Loading your browser progress…</p>;
  return <div className="mt-9 space-y-8">
    <section aria-labelledby="storage-heading" className={PANEL}><h2 id="storage-heading" className="text-heading-4">Stored in this browser</h2><p className="mt-3 text-sm text-secondary">Your entries stay only in this browser using localStorage. They are not encrypted, backed up to the cloud, or synchronized across devices. Clearing site data may remove them. Shared-browser users can access this data. Export a CSV for your own copy; CSV import is not included.</p>{storageWarning&&<p role="alert" className="mt-3 text-warning">{storageWarning}</p>}<div className="mt-5 flex flex-wrap gap-3"><button type="button" className={BUTTON} onClick={download} disabled={!store.weights.length&&!store.measurements.length&&!store.strength.length}>Export progress CSV</button><button type="button" className={SECONDARY} onClick={()=>{if(!window.confirm('Clear all stored progress in this browser? This cannot be undone. Export first if you want a copy.'))return;try{localStorage.removeItem(STORAGE_KEY);setStorageWarning('');setStore(structuredClone(EMPTY));setResetKey(key=>key+1);setMessage('Stored progress cleared.');}catch{setStorageWarning('Unable to clear browser storage. Your current data remains available.');}}}>Clear stored progress</button></div></section>
    <nav aria-label="Progress sections" className="flex flex-wrap gap-3">{[['#body-weight','Body Weight'],['#body-measurements','Body Measurements'],['#strength-progress','Strength Progress']].map(([href,label])=><a key={href} href={href} className="inline-flex min-h-control items-center rounded-control border border-border px-4 py-2 font-semibold">{label}</a>)}</nav>
    <p role="status" className="min-h-6 text-primary">{message}</p>
    <WeightTracker key={`weight-${resetKey}`} store={store} onSave={entry=>save('weights',entry)} onDelete={id=>remove('weights',id)}/>
    <MeasurementTracker key={`measure-${resetKey}`} store={store} onSave={entry=>save('measurements',entry)} onDelete={id=>remove('measurements',id)}/>
    <StrengthTracker key={`strength-${resetKey}`} store={store} onSave={entry=>save('strength',entry)} onDelete={id=>remove('strength',id)}/>
    <section aria-labelledby="tracking-notes" className={PANEL}><h2 id="tracking-notes" className="text-heading-4">Reading your records</h2><p className="mt-3 text-sm text-secondary">Histories sort by entry date, then by original recording sequence for the same day. Editing keeps that sequence; changing a date moves the entry chronologically. Body-area summaries use only entries where that area was measured. Chart lines join logged points without inventing missing observations.</p><p className="mt-3 text-sm text-secondary">These are personal records and general estimates, not medical assessments or training prescriptions. Body weight and measurements can vary with conditions. Do not attempt a maximum lift solely because of an estimate, and do not train through pain. Software bounds are broad validation checks, not guidance on safe body sizes or loads. Future dates within 1900–2100 are accepted as entered; the tracker does not verify that a session occurred.</p></section>
  </div>;
}
