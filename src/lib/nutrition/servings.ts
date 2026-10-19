/** Food-specific conversion snapshots. Household weights always come from the linked food record. */
export type Serving = {
  id: string;
  label: string;
  pluralLabel: string;
  gramsPerServing: number;
  source: string;
  sourceId: string;
  reference: string;
  qualifier: string;
};
export const GRAM: Serving = {
  id: 'g', label: 'gram', pluralLabel: 'grams', gramsPerServing: 1,
  source: 'Metric mass unit', sourceId: 'unit:g', reference: '', qualifier: 'Measured food mass',
};
export function validServing(value: unknown, foodSourceId: string): value is Serving {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const s = value as Serving;
  if (s.id === 'g') return Object.keys(GRAM).every(k => s[k as keyof Serving] === GRAM[k as keyof Serving]);
  return [s.id,s.label,s.pluralLabel,s.source,s.sourceId,s.reference,s.qualifier].every(v => typeof v === 'string' && v.trim().length > 0 && v.length <= 1000)
    && s.sourceId === foodSourceId && /^[1-9]\d{0,8}$/.test(s.sourceId)
    && s.reference === `https://fdc.nal.usda.gov/food-details/${s.sourceId}/nutrients`
    && Number.isFinite(s.gramsPerServing) && s.gramsPerServing > 0 && s.gramsPerServing <= 5000;
}
export function servingOptions(food: {servings?: Serving[]}): Serving[] {
  return [...(food.servings ?? []), GRAM];
}
export function servingGrams(quantity: number, serving: Serving): number {
  const grams = quantity * serving.gramsPerServing;
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(grams) || grams <= 0 || grams > 5000 || !Number.isFinite(serving.gramsPerServing) || serving.gramsPerServing <= 0)
    throw new Error('Enter a quantity greater than 0 with a total weight of no more than 5,000 grams.');
  return grams;
}
export function formatServing(quantity: number, serving: Serving): string {
  return `${Number(quantity.toPrecision(12))} ${quantity === 1 ? serving.label : serving.pluralLabel}`;
}
