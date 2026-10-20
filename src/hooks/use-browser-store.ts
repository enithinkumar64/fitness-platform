'use client';
import { useEffect, useRef, useState } from 'react';
import { commitChange, StorageConflict, StorageWriteFailure, unchanged } from '@/lib/storage/transactions';

/** All cooperating writes/clears use the same origin-scoped exclusive Web Lock. */
export function useBrowserStore<T>(key: string, empty: T, parse: (raw: string | null) => T) {
  const [store, setStore] = useState(empty), [ready, setReady] = useState(false);
  const [warning, setWarning] = useState(''), [status, setStatus] = useState(''), [pending,setPending]=useState(false);
  const activeWrites=useRef(0);
  function writing(start:boolean){activeWrites.current+=start?1:-1;setPending(activeWrites.current>0);}
  const current = useRef(empty), observed = useRef<string | null>(null), sessionOnly = useRef(false);
  function display(next: T) { current.current = next; setStore(next); }
  function read(external = false) {
    try {
      const raw = localStorage.getItem(key);
      if (external && raw === observed.current) return true;
      if (external && sessionOnly.current) {
        setWarning('Another tab changed saved data. Your session-only changes were kept; reload saved data only after keeping a copy.');
        return false;
      }
      observed.current = raw;
      display(parse(raw));
      sessionOnly.current = false;
      setWarning('');
      if (external) setStatus('Changes synchronized from another tab. Unsaved form inputs were kept.');
      return true;
    } catch {
      sessionOnly.current = true;
      setWarning('Saved data could not be read. It has not been overwritten. Changes remain in this session only.');
      return false;
    }
  }
  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) { read(); setReady(true); } });
    const sync = (event: StorageEvent) => {
      try { if (event.storageArea === localStorage && (event.key === key || event.key === null)) read(true); } catch { setWarning('Browser storage is unavailable. Your current data and input were kept.'); }
    };
    const focus = () => read(true);
    window.addEventListener('storage', sync);
    window.addEventListener('focus', focus);
    return () => { active = false; window.removeEventListener('storage', sync); window.removeEventListener('focus', focus); };
    // key and parser are module constants. Readers never write, so no event loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  async function change(update: (latest: T) => T): Promise<boolean> {
    writing(true);
    try {
      if (!navigator.locks) {
        setWarning('Safe saving requires Web Locks, which this browser/context does not provide. Nothing was saved. Keep your input and use a supported browser over HTTPS or localhost.');
        return false;
      }
      return await navigator.locks.request(`formfuel:${key}`, {signal:AbortSignal.timeout(5000)}, () => {
        if (sessionOnly.current) { display(update(current.current)); return true; }
        let next: T | undefined;
        try {
          const saved = commitChange(localStorage, key, parse, latest => {
            next = update(latest);
            return next;
          });
          observed.current = localStorage.getItem(key);
          display(saved);
          setWarning('');
          setStatus('Changes saved in this browser.');
          return true;
        } catch (error) {
          if (error instanceof StorageConflict) { read(true); throw error; }
          if (error instanceof StorageWriteFailure && next !== undefined) {
            display(next); sessionOnly.current = true;
            setWarning('Browser storage is unavailable or full. Changes remain in this session only. Keep a copy before reloading.');
            return true;
          }
          setWarning('Saved data could not be read safely. Nothing was overwritten. Your input was kept; reload saved data and retry.');
          return false;
        }
      });
    } catch (error) {
      if (error instanceof StorageConflict) setWarning(error.message);
      else setWarning('Unable to acquire safe storage access. Nothing was saved. Your input was kept; retry or reload saved data.');
      return false;
    } finally { writing(false); }
  }
  async function clear(): Promise<boolean> {
    // Capture the version at confirmation time. A queued clear must not erase newer data.
    const expected = observed.current;
    writing(true);
    try {
      if (!navigator.locks) throw new Error('Locks unavailable');
      return await navigator.locks.request(`formfuel:${key}`, {signal:AbortSignal.timeout(5000)}, () => {
        unchanged(localStorage.getItem(key), expected);
        localStorage.removeItem(key);
        observed.current = null; sessionOnly.current = false;
        display(structuredClone(empty)); setWarning(''); setStatus('Stored data cleared.');
        return true;
      });
    } catch {
      setWarning('Unable to clear: saved data changed or storage is unavailable. Nothing was cleared. Reload saved data and review it first.');
      return false;
    } finally { writing(false); }
  }
  function reload() {
    if (sessionOnly.current && !window.confirm('Reload saved data and discard session-only records? Keep a copy first. Unsaved form inputs will be kept.')) return;
    if(read()) setStatus('Saved data reloaded. Unsaved form inputs were kept.');
  }
  return { store, ready, warning, status, pending, change, clear, reload };
}
