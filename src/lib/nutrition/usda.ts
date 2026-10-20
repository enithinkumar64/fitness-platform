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
// Only this fixed, user-safe error is exposed by the route handler.
export class UnsupportedNutritionBasisError extends Error {
    constructor() {
        super("This food cannot be imported reliably because USDA does not establish a gram-based nutrition basis. Volume-based or unknown servings cannot be converted to grams safely. Choose another food or the starter catalog.");
    }
}
export function normalizeFood(raw: Raw): Food {
    if (!['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded'].includes(raw.dataType ?? ''))
        throw new Error("Unsupported USDA data type.");
    // USDA GBFPD standardizes Branded nutrients per 100 g OR 100 mL, according
    // to the submitted serving unit. A household portion alone does not establish
    // the nutrient denominator. Require a positive explicit gram serving; do not
    // infer density from names, label text, foodPortions, or labelNutrients.
    // https://fdc.nal.usda.gov/GBFPD_Documentation/
    if (raw.dataType === 'Branded' && (
        !['g', 'gram', 'grams'].includes(raw.servingSizeUnit?.trim().toLowerCase() ?? '') ||
        typeof raw.servingSize !== 'number' || !Number.isFinite(raw.servingSize) || raw.servingSize <= 0
    )) throw new UnsupportedNutritionBasisError();
    const get = (id: number, unit: string) => {
        const n = raw.foodNutrients?.filter(n => n.nutrient?.id === id && n.nutrient.unitName?.toLowerCase() === unit);
        return n?.length === 1 && typeof n[0].amount === 'number' && Number.isFinite(n[0].amount) && n[0].amount >= 0 ? n[0].amount : undefined;
    };
    // Foundation, SR Legacy and FNDDS full details use per 100 g; Branded is gated above.
    // Never use labelNutrients (per serving) or search nutrient summaries.
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
