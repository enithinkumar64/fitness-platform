import { normalizePortions, type PortionRecord } from "./usda-portions.ts";
import { validFood, type Food } from "./core.ts";
export function searchQuery(value: string | null): string {
    const q = value?.trim() ?? "";
    if (q.length < 2 || q.length > 80 || /[\x00-\x1f]/.test(q))
        throw new Error("Search must contain 2–80 characters.");
    return q;
}
export function foodId(value: string | null): string {
    if (!value || !/^[1-9]\d{0,8}$/.test(value))
        throw new Error("Invalid USDA food identifier.");
    return value;
}
type Raw = PortionRecord & {
    fdcId?: number;
    description?: string;
    dataType?: string;
    foodNutrients?: {
        amount?: number;
        nutrient?: {
            id?: number;
            unitName?: string;
        };
    }[];
};
export function normalizeFood(raw: Raw): Food {
    if (!['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded'].includes(raw.dataType ?? ''))
        throw new Error("Unsupported USDA data type.");
    const get = (id: number, unit: string) => {
        const n = raw.foodNutrients?.filter(n => n.nutrient?.id === id && n.nutrient.unitName?.toLowerCase() === unit);
        return n?.length === 1 && typeof n[0].amount === 'number' && Number.isFinite(n[0].amount) && n[0].amount >= 0 ? n[0].amount : undefined;
    };
    // Full FDC foodNutrients amounts are per 100 g, including Branded. Never use labelNutrients (per serving).
    // Prefer total energy 1008, then Atwater specific 2048, then general 2047; never sum energy definitions.
    const calories = get(1008, 'kcal') ?? get(2048, 'kcal') ?? get(2047, 'kcal') ?? (get(1062, 'kj') === undefined ? undefined : get(1062, 'kj')! / 4.184);
    const protein = get(1003, 'g'), carbohydrates = get(1005, 'g'), fat = get(1004, 'g');
    if ([calories, protein, carbohydrates, fat].some(n => n === undefined))
        throw new Error("This record lacks complete, understood per-100-g nutrition. Choose another food.");
    const id = foodId(String(raw.fdcId));
    const food = { id: `usda-${id}`, name: raw.description, source: 'USDA FoodData Central', sourceId: id, dataType: raw.dataType, per100g: { calories, protein, carbohydrates, fat }, servings: normalizePortions(raw) };
    if (!validFood(food))
        throw new Error("Unsupported nutrition record.");
    return food;
}
