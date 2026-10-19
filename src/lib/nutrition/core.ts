import { GRAM, servingGrams, validServing, type Serving } from "./servings.ts";
export const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
export type Meal = typeof MEALS[number];
export type Nutrients = {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
};
export type Food = {
    id: string;
    name: string;
    source: string;
    sourceId: string;
    dataType: string;
    per100g: Nutrients;
    servings?: Serving[];
};
export type Entry = {
    id: string;
    date: string;
    meal: Meal;
    food: Food;
    grams: number;
    quantity: number;
    serving: Serving;
    consumed: Nutrients;
};
export type Diary = {
    version: 2;
    entries: Entry[];
    targets: Partial<Nutrients>;
};
export const EMPTY: Diary = { version: 2, entries: [], targets: {} };
export const KEYS = ["calories", "protein", "carbohydrates", "fat"] as const;
// Keep the existing key so version-1 entries are discovered and migrated safely.
export const STORAGE_KEY = "formfuel-nutrition-v1";
export function validNutrients(n: unknown): n is Nutrients {
    return !!n && typeof n === "object" && KEYS.every(k => typeof (n as Nutrients)[k] === "number" && Number.isFinite((n as Nutrients)[k]) && (n as Nutrients)[k] >= 0 && (n as Nutrients)[k] <= 10000);
}
export function validFood(f: unknown): f is Food {
    if (!f || typeof f !== "object")
        return false;
    const v = f as Food;
    return [v.id, v.name, v.source, v.sourceId, v.dataType].every(x => typeof x === "string" && x.length > 0 && x.length <= 500) && validNutrients(v.per100g)
        && (v.servings === undefined || (Array.isArray(v.servings) && v.servings.length <= 100
            && v.servings.every(s => validServing(s, v.sourceId) && s.id !== 'g')
            && new Set(v.servings.map(s => s.id)).size === v.servings.length));
}
export function localDate(date = new Date()): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function validDate(date: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
        return false;
    const d = new Date(`${date}T12:00:00`);
    return Number.isFinite(d.getTime()) && localDate(d) === date;
}
export function shiftDate(date: string, days: number): string {
    if (!validDate(date) || !Number.isInteger(days))
        throw new Error("Choose a valid date.");
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + days);
    return localDate(d);
}
export function gramsFor(quantity: number, unit = "g"): number {
    if (unit !== "g" || !Number.isFinite(quantity) || quantity <= 0 || quantity > 5000)
        throw new Error("Enter grams greater than 0 and no more than 5,000. Only grams are supported.");
    return quantity;
}
export function scale(n: Nutrients, grams: number): Nutrients {
    if (!validNutrients(n))
        throw new Error("Complete nutrition values are required.");
    gramsFor(grams);
    return Object.fromEntries(KEYS.map(k => [k, n[k] * grams / 100])) as Nutrients;
}
export function totals(entries: Entry[], date: string, meal?: Meal): Nutrients {
    return entries.filter(e => e.date === date && (!meal || e.meal === meal)).reduce((n, e) => Object.fromEntries(KEYS.map(k => [k, n[k] + e.consumed[k]])) as Nutrients, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
}
export function progress(consumed: number, target?: number) { return { percent: target ? Math.min(100, consumed / target * 100) : 0, difference: target === undefined ? undefined : target - consumed }; }
export function validTargets(t: unknown): t is Partial<Nutrients> {
    return !!t && typeof t === "object" && !Array.isArray(t) && Object.entries(t).every(([k, v]) => KEYS.includes(k as typeof KEYS[number]) && typeof v === "number" && Number.isFinite(v) && v > 0 && v <= (k === "calories" ? 10000 : 1000));
}
function entrySnapshot(id: string, date: string, meal: Meal, food: Food, quantity: number, serving: Serving): Entry {
    if (typeof id !== 'string' || !id || id.length > 200 || !validDate(date) || !MEALS.includes(meal) || !validFood(food) || !validServing(serving, food.sourceId))
        throw new Error("Choose a valid food, date, meal and food-specific serving.");
    const grams = servingGrams(quantity, serving);
    return { id, date, meal, food: structuredClone(food), quantity, serving: structuredClone(serving), grams, consumed: scale(food.per100g, grams) };
}
export function makeEntry(id: string, date: string, meal: Meal, food: Food, quantity: number, servingId = 'g'): Entry {
    const serving = servingId === 'g' ? GRAM : food.servings?.find(s => s.id === servingId);
    if (!serving) throw new Error("Choose a serving supported by this food.");
    return entrySnapshot(id,date,meal,food,quantity,serving);
}
/** Keep the logged conversion first; only supplement options from the same source record. */
export function foodForEditing(entry: Entry, currentFood?: Food): Food {
    const options = [entry.serving,...(entry.food.servings ?? []),...(currentFood?.sourceId === entry.food.sourceId ? currentFood.servings ?? [] : [])];
    const servings=options.filter((s,i)=>s.id !== 'g' && options.findIndex(other=>other.id===s.id)===i);
    return {...structuredClone(entry.food),servings:structuredClone(servings)};
}
export function saveEntry(diary: Diary, entry: Entry): Diary { return { ...diary, entries: [...diary.entries.filter(e => e.id !== entry.id), entry] }; }
export function deleteEntry(diary: Diary, id: string): Diary { return { ...diary, entries: diary.entries.filter(e => e.id !== id) }; }
export function parseDiary(raw: string | null): Diary {
    if (!raw)
        return structuredClone(EMPTY);
    const d = JSON.parse(raw);
    if (!d || (d.version !== 1 && d.version !== 2) || !Array.isArray(d.entries) || d.entries.length > 20000 || !validTargets(d.targets))
        throw new Error("Stored diary is invalid.");
    const ids = new Set<string>();
    const entries = d.entries.map((e: Entry) => {
        if (!e || typeof e.id !== "string" || ids.has(e.id)) throw new Error("Invalid entry ID.");
        ids.add(e.id);
        // Version 1 logged grams only. Never consult today's catalog when migrating old food snapshots.
        if (d.version === 1) return makeEntry(e.id,e.date,e.meal,e.food,e.grams);
        // The entry's frozen serving conversion takes priority over any later catalog update.
        const result = entrySnapshot(e.id,e.date,e.meal,e.food,e.quantity,e.serving);
        if (!Number.isFinite(e.grams) || Math.abs(result.grams-e.grams) > 1e-8 * Math.max(1,result.grams))
            throw new Error("Stored serving and gram equivalent disagree.");
        return result;
    });
    return { version: 2, entries, targets: d.targets };
}
export function deduplicate<T extends {
    sourceId: string;
}>(foods: T[]): T[] { return foods.filter((f, i) => foods.findIndex(x => x.sourceId === f.sourceId) === i); }
