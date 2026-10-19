// Server-only: imported exclusively by route handlers, never by Client Components.
import { deduplicate } from './core.ts';
import { foodId, normalizeFood, searchQuery } from './usda.ts';
const cache = new Map<string, {
    until: number;
    value: unknown;
}>();
export async function nutritionRequest(request: Request, kind: 'search' | 'food'): Promise<Response> {
    const headers = { 'Cache-Control': 'private, no-store' };
    const url = new URL(request.url);
    let value: string;
    try {
        value = kind === 'search' ? searchQuery(url.searchParams.get('q')) : foodId(url.searchParams.get('id'));
    }
    catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 400, headers });
    }
    const key = process.env.FDC_API_KEY;
    if (!key)
        return Response.json({ error: 'USDA search is unavailable: FDC_API_KEY is not configured. The starter catalog still works.' }, { status: 503, headers });
    const cacheId = `${kind}:${value.toLowerCase()}`;
    const existing = cache.get(cacheId);
    if (existing && existing.until > Date.now())
        return Response.json(existing.value, { headers });
    try {
        const endpoint = kind === 'search' ? `foods/search?query=${encodeURIComponent(value)}&pageSize=12` : `food/${value}?format=full`;
        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/${endpoint}`, { headers: { 'X-Api-Key': key }, signal: AbortSignal.timeout(8000), cache: 'no-store' });
        if (!response.ok)
            return Response.json({ error: response.status === 429 ? 'USDA request limit reached. Please try again later or use the starter catalog.' : 'USDA is temporarily unavailable. Please use the starter catalog.' }, { status: response.status === 429 ? 429 : 502, headers });
        const raw = await response.json();
        let payload: unknown;
        if (kind === 'food')
            payload = { food: normalizeFood(raw) };
        else {
            if (!Array.isArray(raw.foods))
                throw new Error('Invalid upstream response');
            payload = { foods: deduplicate(raw.foods.slice(0, 12).filter((f: {
                    fdcId?: number;
                    description?: string;
                }) => Number.isSafeInteger(f.fdcId) && typeof f.description === 'string').map((f: {
                    fdcId: number;
                    description: string;
                    dataType?: string;
                    brandOwner?: string;
                    brandName?: string;
                }) => ({ sourceId: String(f.fdcId), name: f.description.slice(0, 500), dataType: f.dataType ?? 'Unknown', brand: (f.brandOwner ?? f.brandName ?? '').slice(0, 200) }))) };
        }
        if (cache.size >= 100)
            cache.delete(cache.keys().next().value!);
        cache.set(cacheId, { until: Date.now() + (kind === 'food' ? 86400000 : 300000), value: payload });
        return Response.json(payload, { headers });
    }
    catch {
        return Response.json({ error: 'USDA could not provide complete nutrition details. Try another food or the starter catalog.' }, { status: 502, headers });
    }
}
