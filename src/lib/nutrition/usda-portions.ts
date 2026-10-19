import type { Serving } from './servings.ts';
export type UsdaPortion = {
  id?: number;
  amount?: number;
  gramWeight?: number;
  modifier?: string;
  portionDescription?: string;
  measureUnit?: { name?: string; abbreviation?: string };
};
export type PortionRecord = {
  fdcId?: number;
  description?: string;
  dataType?: string;
  foodPortions?: UsdaPortion[];
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
};
const units: Record<string, [string,string]> = {
  cup:['cup','cups'], cups:['cup','cups'], tbsp:['tablespoon','tablespoons'], tablespoon:['tablespoon','tablespoons'], tablespoons:['tablespoon','tablespoons'],
  tsp:['teaspoon','teaspoons'], teaspoon:['teaspoon','teaspoons'], teaspoons:['teaspoon','teaspoons'],
  slice:['slice','slices'], slices:['slice','slices'], egg:['egg','eggs'], eggs:['egg','eggs'],
  fillet:['fillet','fillets'], fillets:['fillet','fillets'], almond:['almond','almonds'], almonds:['almond','almonds'],
  leaf:['leaf','leaves'], leaves:['leaf','leaves'], stalk:['stalk','stalks'], spear:['spear','spears'],
  ml:['mL','mL'], milliliter:['mL','mL'], milliliters:['mL','mL'],
};
// In SR Legacy the unit is often "undetermined" and an entire food/size is in modifier.
// These exact food records were reviewed, so "large" can be resolved without inventing a unit.
const sizedFoods: Record<string,string> = {'171688':'apple','173944':'banana','173424':'egg','171287':'egg','172183':'egg white','170393':'carrot','169291':'zucchini'};
function measure(text: string): {label:string;pluralLabel:string} | undefined {
  if (/\b(?:about|approximately|unknown)\b|\bor\s+\d/i.test(text)) return;
  const match = text.trim().match(/^([a-z]+)(?=$|[\s,(])(.*)$/i);
  if (!match) return;
  const names = units[match[1].toLowerCase()];
  if (!names) return;
  const qualifier = match[2].trim().replace(/^,\s*/, '');
  const suffix = qualifier ? ` (${qualifier.replace(/^\(|\)$/g,'')})` : '';
  return {label:names[0]+suffix,pluralLabel:names[1]+suffix};
}
function described(text: string): {amount:number;label:string;pluralLabel:string} | undefined {
  // Only explicit positive decimal or simple fraction amounts; no "about", ranges or guessed counts.
  const m = text.trim().match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(.+)$/);
  if (!m) return;
  const [a,b] = m[1].split('/').map(Number);
  const amount = b === undefined ? a : a/b;
  const names = measure(m[2]);
  if (!names || !Number.isFinite(amount) || amount <= 0) return;
  return {amount,...names};
}
function sourceServing(record: PortionRecord, id: string, label: string, pluralLabel: string, grams: number, qualifier: string): Serving {
  const sourceId = String(record.fdcId);
  return {id,label,pluralLabel,gramsPerServing:grams,source:'USDA FoodData Central',sourceId,reference:`https://fdc.nal.usda.gov/food-details/${sourceId}/nutrients`,qualifier:`${record.description} · ${qualifier}`};
}
export function normalizePortions(record: PortionRecord): Serving[] {
  if (!Number.isSafeInteger(record.fdcId) || record.fdcId! <= 0 || !record.description) return [];
  if (record.dataType === 'Branded') {
    // Volume is not mass: never assume mL = g. For now only an explicit gram serving is accepted.
    if (!['g','gram','grams'].includes(record.servingSizeUnit?.toLowerCase() ?? '') || !Number.isFinite(record.servingSize) || record.servingSize! <= 0 || record.servingSize! > 5000) return [];
    const text = record.householdServingFullText?.trim();
    const portion = text ? described(text) : undefined;
    if (text && !portion) return []; // Unknown/ambiguous household text is not silently interpreted.
    const grams = record.servingSize! / (portion?.amount ?? 1);
    if (!Number.isFinite(grams) || grams <= 0 || grams > 5000) return [];
    return [sourceServing(record,`usda-${record.fdcId}-label`,portion?.label ?? 'label serving',portion?.pluralLabel ?? 'label servings',grams,`Label: ${text ?? '1 serving'}; servingSize ${record.servingSize} g`)];
  }
  if (!['Foundation','SR Legacy','Survey (FNDDS)'].includes(record.dataType ?? '') || !Array.isArray(record.foodPortions)) return [];
  const results: Serving[] = [];
  for (const p of record.foodPortions.slice(0,100)) {
    if (!p || !Number.isSafeInteger(p.id) || p.id! <= 0 || !Number.isFinite(p.gramWeight) || p.gramWeight! <= 0) continue;
    let amount=p.amount, names: {label:string;pluralLabel:string} | undefined;
    if (record.dataType === 'Survey (FNDDS)') {
      const description = described(p.portionDescription ?? '');
      if (!description || (amount !== undefined && amount !== description.amount)) continue;
      amount=description.amount; names=description;
    } else {
      const unit = p.measureUnit?.name?.trim() ?? '';
      if (unit && unit !== 'undetermined') {
        names=measure(`${unit}${p.modifier ? `, ${p.modifier}` : ''}`);
      } else if (record.dataType === 'SR Legacy') {
        names=measure(p.modifier ?? '');
        const size=p.modifier?.match(/^(extra small|small|medium|large|extra large|jumbo)(?=$|[\s(])(.*)$/i);
        const noun=sizedFoods[String(record.fdcId)];
        if (!names && size && noun) names={label:`${size[1]} ${noun}`,pluralLabel:`${size[1]} ${noun === 'egg white' ? 'egg whites' : noun+'s'}`};
      }
    }
    if (!names || !Number.isFinite(amount) || amount! <= 0) continue;
    const grams=p.gramWeight!/amount!;
    if (!Number.isFinite(grams) || grams <= 0 || grams > 5000) continue;
    const serving=sourceServing(record,`usda-${record.fdcId}-portion-${p.id}`,names.label,names.pluralLabel,grams,`Portion ${p.id}: ${amount} ${p.portionDescription ?? p.modifier ?? p.measureUnit?.name}; ${p.gramWeight} g`);
    results.push(serving);
  }
  // Conflicting duplicate IDs are discarded, not resolved by choosing an arbitrary conversion.
  return results.filter(s => results.filter(other => other.id === s.id).length === 1);
}
