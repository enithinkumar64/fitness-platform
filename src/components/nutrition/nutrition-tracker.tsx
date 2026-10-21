'use client';
import Link from 'next/link';
import { foodSourceLabel } from '@/lib/branding';
import { USDA_FOOD_SEARCH_URL } from '@/lib/nutrition/attribution';
import { useBrowserStore } from '@/hooks/use-browser-store';
import { unchanged } from '@/lib/storage/transactions';
import { FoodQuantityFields } from './food-quantity-fields';
import { GRAM, formatServing, servingOptions } from '@/lib/nutrition/servings';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { EMPTY, KEYS, MEALS, STORAGE_KEY, deleteEntry, foodForEditing, localDate, makeEntry, parseDiary, progress, saveEntry, shiftDate, totals, validDate, validFood, validTargets, type Diary, type Food, type Meal } from '@/lib/nutrition/core';
import { STARTER_FOODS } from '@/lib/nutrition/foods';
const control = 'mt-2 block min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-2';
const panel = 'min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-7';
const labels = { calories: 'Calories', protein: 'Protein', carbohydrates: 'Carbohydrates', fat: 'Fat' };
type SearchResult = {
    sourceId: string;
    name: string;
    dataType: string;
    brand: string;
};
// Presentation-only identities; none of these counters enter diary storage.
function useNoticeText() {
    const [notice,setNotice]=useState({text:'',sequence:0});
    return [notice.text,(text:string)=>setNotice(previous=>({text,sequence:previous.sequence+1})),notice.sequence] as const;
}
function NutritionNotice({text,revision}:{text:string;revision:unknown}) {
    const [previous,setPrevious]=useState({text,revision,sequence:0});
    // Adjust only local render identity when inputs change, before committing the DOM.
    // No effect, timer, data mutation, or extra intermediate announcement is needed.
    if(previous.text!==text || previous.revision!==revision)
        setPrevious({text,revision,sequence:previous.sequence+1});
    return <span key={previous.sequence}>{text}</span>;
}
export function NutritionTracker() {
    const {store:diary,ready,warning:storageMessage,status,pending,change:update,clear,reload}=useBrowserStore(STORAGE_KEY,EMPTY,parseDiary);
    const [date,setDate]=useState(localDate);
    const [message,setMessage,messageRevision]=useNoticeText();
    const [error,setError,errorRevision]=useNoticeText();
    const [query, setQuery] = useState(''), [remote, setRemote] = useState<SearchResult[]>([]), [loading, setLoading] = useState(false);
    const [usdaError,setUsdaError,usdaRevision]=useNoticeText();
    const [food, setFood] = useState<Food | null>(null), [quantity, setQuantity] = useState('100'), [servingId, setServingId] = useState('g'), [meal, setMeal] = useState<Meal>('Breakfast'), [editing, setEditing] = useState<string | null>(null);
    const [targetInputs, setTargetInputs] = useState<Record<string, string>>({});
    const [targetError,setTargetError,targetRevision]=useNoticeText();
    const [attemptRevision,setAttemptRevision]=useState(0),[externalRevision,setExternalRevision]=useState(0);
    const formHeading = useRef<HTMLHeadingElement>(null), alert = useRef<HTMLParagraphElement>(null);
    const requestVersion = useRef(0);
    const editingSnapshot = useRef<Diary['entries'][number] | undefined>(undefined);
    const targetBaseline = useRef<Diary['targets'] | undefined>(undefined);
    useEffect(() => {
        if (!ready) return;
        let active=true;
        queueMicrotask(()=>{
            if(active && targetBaseline.current===undefined)
                setTargetInputs(Object.fromEntries(KEYS.map(k=>[k,diary.targets[k]?.toString()??''])));
        });
        return ()=>{active=false;};
    },[ready,diary.targets]);
    useEffect(()=>{
        const notice=(event:StorageEvent)=>{
            // Observe notifications only; the existing shared hook still owns every data read/write.
            try { if(event.storageArea===localStorage && (event.key===STORAGE_KEY || event.key===null)) setExternalRevision(value=>value+1); } catch { /* Storage warning is owned by the shared hook. */ }
        };
        window.addEventListener('storage',notice);
        return ()=>window.removeEventListener('storage',notice);
    },[]);
    async function changeDiary(operation:(latest:Diary)=>Diary) {
        const accepted=await update(operation);
        setAttemptRevision(value=>value+1);
        if(!accepted)setMessage(''); // The assertive storage/conflict alert carries the failure, once.
        return accepted;
    }
    async function clearDiary() {
        const accepted=await clear();
        setAttemptRevision(value=>value+1);
        if(!accepted)setMessage('');
        return accepted;
    }
    function changeDate(next: string) { if (validDate(next)) {
            requestVersion.current++;
            setLoading(false);
        setDate(next);
        setEditing(null);
        setFood(null);
        setError('');
    } }
    function chooseFood(next: Food) {
        setFood(next);
        setEditing(null);
        const serving=servingOptions(next)[0];
        setServingId(serving.id);
        setQuantity(serving.id === 'g' ? '100' : '1');
        setError('');
    }
    function changeServing(nextId: string) {
        const options=servingOptions(food ?? {});
        const current=options.find(s=>s.id===servingId) ?? GRAM;
        const next=options.find(s=>s.id===nextId);
        if (!next) return;
        const value=quantity.trim() === '' ? NaN : Number(quantity);
        if (Number.isFinite(value) && value > 0) setQuantity(String(value*current.gramsPerServing/next.gramsPerServing));
        setServingId(nextId);
        setError('');
    }
    async function usda(id?: string) {
        const version = ++requestVersion.current;
        setLoading(true);
        setUsdaError('');
        try {
            const response = await fetch(id ? `/api/nutrition/food?id=${encodeURIComponent(id)}` : `/api/nutrition/search?q=${encodeURIComponent(query.trim())}`);
            const data = await response.json();
            if (version !== requestVersion.current)
                return;
            if (!response.ok)
                throw new Error(data.error ?? 'USDA request failed.');
            if (id) {
                if (!validFood(data.food))
                    throw new Error('Complete nutrition is unavailable.');
                chooseFood(data.food);
            }
            else {
                setRemote(data.foods);
                if (data.foods.length === 0)
                    setUsdaError('No USDA matches. Try a different search.');
            }
        }
        catch (e) {
            if (version === requestVersion.current)
                setUsdaError(e instanceof Error ? e.message : 'USDA is unavailable.');
        }
        finally {
            if (version === requestVersion.current)
                setLoading(false);
        }
    }
    async function submit(e: FormEvent) {
        e.preventDefault();
        setError('');
        try {
            if (!food)
                throw new Error('Select a food first.');
            const entry = makeEntry(editing ?? crypto.randomUUID(), date, meal, food, quantity.trim() === '' ? NaN : Number(quantity), servingId);
            const expected=editing ? editingSnapshot.current : undefined;
            if(!await changeDiary(latest=>{
                unchanged(latest.entries.find(e=>e.id===entry.id),expected);
                return saveEntry(latest,entry);
            })) return;
            setMessage(editing ? 'Entry updated.' : 'Food added.');
            setEditing(null);
            setFood(null);
        }
        catch (e) {
            setError((e as Error).message);
            requestAnimationFrame(() => alert.current?.focus());
        }
    }
    // Specific action notices already cover local saves/clears; keep external/reload notices.
    const storageStatus=['Changes saved in this browser.','Stored data cleared.'].includes(status)?'':status;
    const daily = totals(diary.entries, date);
    const local = STARTER_FOODS.filter(f => f.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12);
    if (!ready)
        return <p role="status" className="mt-8">Loading your browser diary…</p>;
    return <div className="mt-10 space-y-8">
    <div className={panel}><h2 className="text-heading-4">Your browser, your diary</h2><p className="mt-3 text-sm text-secondary">Entries and targets are stored only in this browser using localStorage. They are not encrypted, backed up to the cloud, or synchronized across devices. Clearing browser data removes them. Food searches send search terms to USDA only when you request them; your diary is not sent.</p>{storageMessage && <p role="alert" className="mt-3 text-warning"><NutritionNotice text={storageMessage} revision={`${attemptRevision}:${externalRevision}`}/></p>}<p role="status" className="mt-3 text-secondary"><NutritionNotice text={storageMessage?'':storageStatus} revision={diary}/></p><button type="button" disabled={pending} onClick={()=>{reload();setAttemptRevision(value=>value+1);}} className="mt-3 border-border-control bg-background text-foreground">Reload saved diary</button><button type="button" className="mt-4 border-border-control bg-background text-foreground" disabled={pending} onClick={async () => {
        if(!window.confirm('Clear all stored diary entries and targets in this browser? This cannot be undone.'))return;
        if(await clearDiary()){
            targetBaseline.current=undefined;
            editingSnapshot.current=undefined;
            setEditing(null);setFood(null);setQuantity('100');setServingId('g');setError('');setTargetError('');
            requestVersion.current++;setLoading(false);
            setTargetInputs({});setMessage('Stored diary and targets cleared.');
        }
    }}>Clear stored diary and targets</button></div>
    <section aria-label="Diary date" className="flex flex-wrap items-end gap-3"><button type="button" onClick={() => changeDate(shiftDate(date, -1))}>Previous day</button><label className="min-w-0">Diary date<input className={control} type="date" value={date} onChange={e => changeDate(e.target.value)}/></label><button type="button" onClick={() => changeDate(shiftDate(date, 1))}>Next day</button><button type="button" onClick={() => changeDate(localDate())}>Today</button></section>
    <section aria-labelledby="summary-heading"><h2 id="summary-heading" className="text-heading-3">Daily nutrition summary</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{KEYS.map(k => { const p = progress(daily[k], diary.targets[k]); return <article key={k} className={panel} aria-label={`${labels[k]} summary`}><h3 className="text-heading-5">{labels[k]}</h3><p className="mt-3 font-mono text-2xl text-primary">{daily[k].toFixed(1)} <span className="text-sm">{k === 'calories' ? 'kcal' : 'g'}</span></p><p className="mt-2 text-sm text-secondary">{p.difference === undefined ? 'No target set' : `Target ${diary.targets[k]} · ${Math.abs(p.difference).toFixed(1)} ${k === 'calories' ? 'kcal' : 'g'} ${p.difference >= 0 ? 'remaining' : 'above target'}`}</p><div role="progressbar" aria-label={labels[k]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.percent} aria-valuetext={`${daily[k].toFixed(1)} consumed; ${diary.targets[k] ?? 'no'} target`} className="mt-4 h-2 overflow-hidden rounded-full bg-background"><div className="h-full bg-primary" style={{ width: `${p.percent}%` }}/></div></article>; })}</div></section>
    <details className={panel}><summary className="cursor-pointer font-semibold">Edit daily targets</summary><p className="mt-3 text-sm text-secondary">Optional personal reference targets, applied across dates. A value within these software bounds is not an assurance of safety. Use the <Link href="/calculators/tdee">TDEE Calculator</Link> and <Link href="/calculators/macros">Macro Calculator</Link> for educational estimates.</p><form noValidate onSubmit={async e => { e.preventDefault(); const expected=targetBaseline.current??diary.targets; const t = Object.fromEntries(KEYS.filter(k => targetInputs[k]?.trim()).map(k => [k, Number(targetInputs[k])])); if (!validTargets(t)) {
        setTargetError('Use positive targets: up to 10,000 kcal and 1,000 g per macro, or leave blank.');
        return;
    } if(await changeDiary(latest=>{unchanged(latest.targets,expected);return {...latest,targets:t};})){targetBaseline.current=undefined;setTargetError('');setMessage('Daily targets saved.');} }}><fieldset disabled={pending} className="min-w-0"><div className="mt-4 grid gap-4 sm:grid-cols-2">{KEYS.map(k => <label key={k}>{labels[k]} target ({k === 'calories' ? 'kcal' : 'g'})<input className={control} inputMode="decimal" value={targetInputs[k] ?? ''} aria-describedby={targetError ? 'target-error' : undefined} onChange={e => {targetBaseline.current??=diary.targets;setTargetInputs({ ...targetInputs, [k]: e.target.value });}}/></label>)}</div>{targetError && <p id="target-error" role="alert" className="mt-3 text-error"><NutritionNotice text={targetError} revision={targetRevision}/></p>}<button className="mt-4 min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary">Save targets</button><button type="button" className="mt-4 ml-2 border-border-control bg-background text-foreground" onClick={()=>{targetBaseline.current=undefined;setTargetInputs(Object.fromEntries(KEYS.map(k=>[k,diary.targets[k]?.toString()??''])));setTargetError('');}}>Use latest saved targets</button></fieldset></form></details>
    <div className="grid items-start gap-8 lg:grid-cols-2"><section className={panel} aria-labelledby="food-heading"><h2 id="food-heading" ref={formHeading} tabIndex={-1} className="text-heading-3">{editing ? 'Edit diary entry' : 'Find a food'}</h2><label className="mt-4 block">Search foods<input className={control} value={query} maxLength={80} onChange={e => { setQuery(e.target.value); setRemote([]); requestVersion.current++; setLoading(false); }}/></label><p className="mt-3 text-sm text-secondary">VAJRYA starter catalog · USDA-sourced · {STARTER_FOODS.length} foods. Showing up to 12 matches; refine your search. Raw and cooked records are distinct.</p><ul className="mt-4 space-y-2">{local.map(f => <li key={f.id}><button type="button" className="w-full break-words border-border-control bg-background text-left text-sm text-foreground" onClick={() => { requestVersion.current++; setLoading(false); chooseFood(f); }}>{f.name}</button></li>)}</ul>{local.length === 0 && <p className="mt-4">No starter foods match.</p>}<button type="button" disabled={loading || query.trim().length < 2} className="mt-5 min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary" onClick={() => usda()}>Search USDA FoodData Central</button><p className="mt-3 text-sm text-secondary">Optional: requires server configuration. USDA details are checked before you can add a food.</p>{loading && <p role="status">Loading USDA foods…</p>}<p role="status" className={usdaError?"mt-3 text-warning":"sr-only"}><NutritionNotice text={usdaError} revision={usdaRevision}/></p><ul className="mt-4 space-y-2">{remote.filter(r => !local.some(f => f.sourceId === r.sourceId)).map(r => <li key={r.sourceId}><button type="button" disabled={loading} className="w-full break-words border-border-control bg-background text-left text-foreground" onClick={() => usda(r.sourceId)}>{r.name} · {r.dataType}{r.brand ? ` · ${r.brand}` : ''} · USDA FoodData Central</button></li>)}</ul>
      <form onSubmit={submit} noValidate className="mt-6 border-t border-border pt-5"><fieldset disabled={pending} className="min-w-0"><h3 className="text-heading-4">{food ? food.name : 'Select a food to log'}</h3>{food && <p className="mt-3 break-words text-sm text-secondary">{foodSourceLabel(food.source)} · {food.dataType} · FDC ID {food.sourceId} · <a href={USDA_FOOD_SEARCH_URL} target="_blank" rel="noopener noreferrer">Find food on USDA</a> (opens Food Search; search by food name and match this ID) · Per 100 g: {food.per100g.calories} kcal, {food.per100g.protein} g protein, {food.per100g.carbohydrates} g carbs, {food.per100g.fat} g fat.</p>}<FoodQuantityFields food={food} quantity={quantity} servingId={servingId} onQuantity={value=>{setQuantity(value);setError('');}} onServing={changeServing} error={error} /><label className="mt-4 block">Meal<select className={control} value={meal} onChange={e => setMeal(e.target.value as Meal)}>{MEALS.map(m => <option key={m}>{m}</option>)}</select></label>{error && <p id="entry-error" ref={alert} tabIndex={-1} role="alert" className="mt-3 text-error"><NutritionNotice text={error} revision={errorRevision}/></p>}<button className="mt-5 min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary">{editing ? 'Save entry' : 'Add food'}</button>{editing && <button type="button" className="ml-2 mt-3 bg-background text-foreground" onClick={() => { setEditing(null); setFood(null); }}>Cancel edit</button>}</fieldset></form></section>
      <section aria-label="Daily meals" className="space-y-5">{MEALS.map(m => { const entries = diary.entries.filter(e => e.date === date && e.meal === m), t = totals(diary.entries, date, m); return <article className={panel} key={m} aria-label={m}><h2 className="text-heading-4">{m}</h2><p className="mt-2 text-sm text-secondary">{t.calories.toFixed(1)} kcal · P {t.protein.toFixed(1)} g · C {t.carbohydrates.toFixed(1)} g · F {t.fat.toFixed(1)} g</p>{entries.length === 0 ? <p className="mt-4 text-secondary">No foods logged yet.</p> : <ul className="mt-4 space-y-5">{entries.map(e => <li key={e.id} className="min-w-0 border-t border-border pt-4"><p className="break-words font-semibold">{e.food.name}</p><p className="mt-2 text-sm">{formatServing(e.quantity,e.serving)} · {Number(e.grams.toFixed(3))} g · {e.consumed.calories.toFixed(1)} kcal</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" aria-label={`Edit ${e.food.name}`} className="border-border-control bg-background text-foreground" onClick={() => { requestVersion.current++; setLoading(false); setEditing(e.id); editingSnapshot.current=e; setFood(foodForEditing(e,STARTER_FOODS.find(f=>f.sourceId===e.food.sourceId))); setQuantity(String(e.quantity)); setServingId(e.serving.id); setMeal(e.meal); setError(''); formHeading.current?.focus(); }}>Edit</button><button type="button" aria-label={`Delete ${e.food.name}`} className="border-border-control bg-background text-foreground" onClick={async () => { if(!await changeDiary(latest=>{unchanged(latest.entries.find(entry=>entry.id===e.id),e);return deleteEntry(latest,e.id);}))return; if (editing === e.id) {
        setEditing(null);
        setFood(null);
    } setMessage('Entry deleted.'); }}>Delete</button></div></li>)}</ul>}</article>; })}</section></div>
    <p role="status" className="text-primary"><NutritionNotice text={message} revision={messageRevision}/></p><section className={panel}><h2 className="text-heading-4">Estimates, with context</h2><p className="mt-3 text-sm text-secondary">Nutrition values are estimates. Brands, preparation, and USDA data types affect results. Only complete per-100-g records can be logged; serving conventions differ. Household portions use food-specific USDA gram conversions; size and preparation matter. Grams remain available for weighed portions. Nutrients are multiplied by grams ÷ 100, preserving precision internally; displays round to one decimal. Targets are your references, and exceeding one is not a medical warning. This is general nutrition tracking, not medical advice.</p></section>
  </div>;
}
