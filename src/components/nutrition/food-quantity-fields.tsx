import { KEYS, scale, type Food } from '@/lib/nutrition/core';
import { servingGrams, servingOptions } from '@/lib/nutrition/servings';
const control = 'mt-2 block min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-2';
export function FoodQuantityFields({ food, quantity, servingId, onQuantity, onServing, error }: {
  food: Food | null;
  quantity: string;
  servingId: string;
  onQuantity: (value: string) => void;
  onServing: (id: string) => void;
  error: string;
}) {
  const options=servingOptions(food ?? {});
  const serving=options.find(s=>s.id===servingId);
  let preview;
  let previewError='';
  if(food && serving){
    try {
      const grams=servingGrams(quantity.trim() === '' ? NaN : Number(quantity),serving);
      preview={grams,nutrients:scale(food.per100g,grams)};
    } catch { previewError='Enter a positive quantity totaling no more than 5,000 g to see nutrition.'; }
  }
  return <div className="mt-4 space-y-4">
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <label htmlFor="food-quantity">Quantity
        <input id="food-quantity" className={control} inputMode="decimal" value={quantity} onChange={e=>onQuantity(e.target.value)} aria-invalid={!!error} aria-describedby={error?'entry-error':'quantity-help'} />
      </label>
      <label htmlFor="food-serving">Serving size
        <select id="food-serving" className={control} value={servingId} onChange={e=>onServing(e.target.value)} disabled={!food}>
          {options.map(s=><option key={s.id} value={s.id}>{s.id==='g'?'Grams':`${s.label} (${s.gramsPerServing} g)`}</option>)}
        </select>
      </label>
    </div>
    <p id="quantity-help" className="text-sm text-secondary">Fractions such as 0.5 are welcome. Switching serving units preserves the current gram equivalent. Use grams when your portion differs from the reference size.</p>
    {food && serving && serving.id!=='g' && <p className="break-words text-sm text-secondary">{serving.qualifier} · <a href={serving.reference} target="_blank" rel="noopener noreferrer">USDA portion source</a>{food.servings?.length?'':' · Historical conversion'}</p>}
    {food && <div role="status" aria-label="Nutrition preview" className="rounded-control border border-border p-4 text-sm">
      {preview ? <><p className="font-semibold text-primary">Estimated equivalent: {Number(preview.grams.toFixed(3))} g</p><dl className="mt-3 grid gap-2 sm:grid-cols-2">{KEYS.map(k=><div key={k}><dt className="inline">{{calories:'Calories',protein:'Protein',carbohydrates:'Carbohydrates',fat:'Fat'}[k]}: </dt><dd className="inline font-mono">{preview.nutrients[k].toFixed(1)} {k==='calories'?'kcal':'g'}</dd></div>)}</dl></> : <p>{previewError}</p>}
    </div>}
  </div>;
}
