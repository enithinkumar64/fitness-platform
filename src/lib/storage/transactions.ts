// Snapshot checks supplement Web Locks; localStorage itself has no atomic CAS.
export class StorageConflict extends Error {
  constructor() { super('This record changed or was deleted in another tab. Your input was kept. Cancel this edit and reopen the latest record; deleted records cannot be saved again.'); }
}
function snapshot(value: unknown): string | undefined {
  return JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
}
export function unchanged(actual: unknown, expected: unknown): void {
  if (snapshot(actual) !== snapshot(expected)) throw new StorageConflict();
}
export class StorageWriteFailure extends Error {}
export type StoreAccess = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export function commitChange<T>(storage: StoreAccess, key: string, parse: (raw: string | null) => T, change: (latest: T) => T): T {
  const raw = storage.getItem(key);
  const next = change(parse(raw));
  const encoded=JSON.stringify(next);
  parse(encoded); // Never persist a state that the existing schema reader would reject.
  // Detect non-cooperating writers during preparation too. This check alone is NOT atomic.
  unchanged(storage.getItem(key), raw);
  try { storage.setItem(key, encoded); } catch { throw new StorageWriteFailure('Browser storage write failed.'); }
  return next;
}
