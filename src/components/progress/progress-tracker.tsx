'use client';
import { useState } from 'react';
import { useBrowserStore } from '@/hooks/use-browser-store';
import { unchanged } from '@/lib/storage/transactions';
import { EMPTY, STORAGE_KEY, exportCsv, localDate, parseStore, removeEntry, saveEntry, nextSequence, validateEntry, type Entries, type Kind } from '@/lib/progress/tracker';
import { WeightTracker } from './weight-tracker';
import { MeasurementTracker } from './measurement-tracker';
import { StrengthTracker } from './strength-tracker';
import { BUTTON, PANEL, SECONDARY } from './controls';
export function ProgressTracker() {
  const {store,ready,warning:storageWarning,status,pending,change,clear,reload}=useBrowserStore(STORAGE_KEY,EMPTY,parseStore);
  const [message,setMessage]=useState({text:'',sequence:0}),[resetKey,setResetKey]=useState(0);
  // Presentation-only identity: replace the status child for every operation, even repeated text.
  function announce(text:string){setMessage(previous=>({text,sequence:previous.sequence+1}));}
  async function save<K extends Kind>(kind:K,entry:Entries[K],expected?:Entries[K]) {
    validateEntry(kind,entry);
    const ok=await change(latest=>{
      unchanged(latest[kind].find(e=>e.id===entry.id),expected);
      return saveEntry(latest,kind,{...entry,sequence:expected?.sequence??nextSequence(latest)});
    });
    announce(ok?'Progress entry saved.':'Progress change not saved. Review the message above; your input was kept.');
    return ok;
  }
  async function remove(kind:Kind,id:string):Promise<boolean> {
    const entry=store[kind].find(e=>e.id===id);
    if(!entry||!window.confirm(`Delete this ${kind==='weights'?'body weight':kind==='measurements'?'body measurement':'strength'} entry for ${entry.date}? This cannot be undone.`))return false;
    const ok=await change(latest=>{unchanged(latest[kind].find(e=>e.id===id),entry);return removeEntry(latest,kind,id);});
    announce(ok?'Progress entry deleted.':'Progress change not saved. Review the message above; your input was kept.');return ok;
  }
  function download() {
    const url=URL.createObjectURL(new Blob([exportCsv(store)],{type:'text/csv;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download=`formfuel-progress-${localDate()}.csv`;document.body.appendChild(anchor);anchor.click();anchor.remove();
    // Delay revocation until the browser has consumed the download request.
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    announce('CSV export requested. It contains only your recorded progress.');
  }
  if(!ready)return <p role="status" className="mt-8">Loading your browser progress…</p>;
  return <div className="mt-9 space-y-8">
    <section aria-labelledby="storage-heading" className={PANEL}><h2 id="storage-heading" className="text-heading-4">Stored in this browser</h2><p className="mt-3 text-sm text-secondary">Your entries stay only in this browser using localStorage. They are not encrypted, backed up to the cloud, or synchronized across devices. Clearing site data may remove them. Shared-browser users can access this data. Export a CSV for your own copy; CSV import is not included.</p>{storageWarning&&<p role="alert" className="mt-3 text-warning">{storageWarning}</p>}<p role="status" className="mt-3 text-secondary">{status}</p><button type="button" className={SECONDARY} onClick={reload} disabled={pending}>Reload saved progress</button><div className="mt-5 flex flex-wrap gap-3"><button type="button" className={BUTTON} onClick={download} disabled={!store.weights.length&&!store.measurements.length&&!store.strength.length}>Export progress CSV</button><button type="button" className={SECONDARY} disabled={pending} onClick={async()=>{if(!window.confirm('Clear all stored progress in this browser? This cannot be undone. Export first if you want a copy.'))return;if(await clear()){setResetKey(key=>key+1);announce('Stored progress cleared.');}}}>Clear stored progress</button></div></section>
    <nav aria-label="Progress sections" className="flex flex-wrap gap-3">{[['#body-weight','Body Weight'],['#body-measurements','Body Measurements'],['#strength-progress','Strength Progress']].map(([href,label])=><a key={href} href={href} className="inline-flex min-h-control items-center rounded-control border border-border px-4 py-2 font-semibold">{label}</a>)}</nav>
    <p role="status" className="min-h-6 text-primary"><span key={message.sequence}>{message.text}</span></p>
    <WeightTracker key={`weight-${resetKey}`} store={store} pending={pending} onSave={(entry,expected)=>save('weights',entry,expected)} onDelete={id=>remove('weights',id)}/>
    <MeasurementTracker key={`measure-${resetKey}`} store={store} pending={pending} onSave={(entry,expected)=>save('measurements',entry,expected)} onDelete={id=>remove('measurements',id)}/>
    <StrengthTracker key={`strength-${resetKey}`} store={store} pending={pending} onSave={(entry,expected)=>save('strength',entry,expected)} onDelete={id=>remove('strength',id)}/>
    <section aria-labelledby="tracking-notes" className={PANEL}><h2 id="tracking-notes" className="text-heading-4">Reading your records</h2><p className="mt-3 text-sm text-secondary">Histories sort by entry date, then by original recording sequence for the same day. Editing keeps that sequence; changing a date moves the entry chronologically. Body-area summaries use only entries where that area was measured. Chart lines join logged points without inventing missing observations.</p><p className="mt-3 text-sm text-secondary">These are personal records and general estimates, not medical assessments or training prescriptions. Body weight and measurements can vary with conditions. Do not attempt a maximum lift solely because of an estimate, and do not train through pain. Software bounds are broad validation checks, not guidance on safe body sizes or loads. Future dates within 1900–2100 are accepted as entered; the tracker does not verify that a session occurred.</p></section>
  </div>;
}
