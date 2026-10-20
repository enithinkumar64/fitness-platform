// Server-only: imported exclusively by route handlers, never by Client Components.
import { deduplicate } from './core.ts';
import { foodId, normalizeFood, searchQuery, UnsupportedNutritionBasisError } from './usda.ts';
import { Budget, boundedJson, PROXY_LIMITS } from './proxy-protection.ts';
type Kind='search'|'food';
type Result={status:number;body:unknown;retry?:number};
type Dependencies={now?:()=>number;fetch?:typeof fetch;getKey?:()=>string|undefined};
export function createNutritionHandler(dependencies:Dependencies={}){
    const now=dependencies.now??Date.now,getKey=dependencies.getKey??(()=>process.env.FDC_API_KEY);
    const incoming=new Budget(),upstream=new Budget();
    const cache=new Map<string,{until:number;value:unknown;bytes:number}>();
    const pending=new Map<string,Promise<Result>>();
    let cacheBytes=0,active=0,cooldown=0;
    function limited(retry:number):Result{return {status:429,retry:Math.max(1,Math.ceil(retry)),body:{error:'USDA search is busy or its request limit was reached. Please wait and try again, or use the starter catalog.'}};}
    function respond(result:Result):Response{
        return Response.json(result.body,{status:result.status,headers:{'Cache-Control':'private, no-store',...(result.retry?{'Retry-After':String(result.retry)}:{})}});
    }
    function remember(id:string,value:unknown,ttl:number){
        const bytes=new TextEncoder().encode(JSON.stringify(value)).byteLength;
        if(bytes>PROXY_LIMITS.cacheBytes)return;
        for(const [key,item] of cache)if(item.until<=now()){cache.delete(key);cacheBytes-=item.bytes;}
        while(cache.size>=PROXY_LIMITS.cacheEntries || cacheBytes+bytes>PROXY_LIMITS.cacheBytes){
            const first=cache.entries().next().value;if(!first)break;cache.delete(first[0]);cacheBytes-=first[1].bytes;
        }
        cache.set(id,{until:now()+ttl,value,bytes});cacheBytes+=bytes;
    }
    async function retrieve(kind:Kind,value:string,key:string,id:string):Promise<Result>{
        try{
            const endpoint=kind==='search'?`foods/search?query=${encodeURIComponent(value)}&pageSize=12`:`food/${value}?format=full`;
            const signal=AbortSignal.timeout(PROXY_LIMITS.timeoutMs);
            const response=await (dependencies.fetch??fetch)(`https://api.nal.usda.gov/fdc/v1/${endpoint}`,{headers:{'X-Api-Key':key},signal,cache:'no-store'});
            if(!response.ok){
                await response.body?.cancel();
                if(response.status===429){
                    const header=response.headers.get('retry-after');
                    const seconds=header && /^\d+$/.test(header)?Number(header):60;
                    const retry=Number.isFinite(seconds)?Math.max(1,Math.min(3600,seconds)):60;
                    cooldown=Math.max(cooldown,now()+retry*1000);return limited(retry);
                }
                if(response.status===404 && kind==='food')return {status:404,body:{error:'This USDA food could not be found. Choose another food or the starter catalog.'}};
                return {status:502,body:{error:'USDA is temporarily unavailable. Please use the starter catalog.'}};
            }
            const raw=await boundedJson(response,signal) as Parameters<typeof normalizeFood>[0] & {foods?:unknown[]};
            let payload:unknown;
            if(kind==='food')payload={food:normalizeFood(raw)};
            else{
                if(!raw || !Array.isArray(raw.foods))throw Error('Invalid response');
                type SearchFood={fdcId?:number;description?:string;dataType?:string;brandOwner?:string;brandName?:string};
                payload={foods:deduplicate((raw.foods.slice(0,12) as SearchFood[])
                    .filter(f=>f && Number.isSafeInteger(f.fdcId) && f.fdcId!>0 && f.fdcId!<=999999999 && typeof f.description==='string')
                    .map(f=>({sourceId:String(f.fdcId),name:f.description!.slice(0,500),dataType:typeof f.dataType==='string'?f.dataType.slice(0,100):'Unknown',brand:typeof (f.brandOwner??f.brandName)==='string'?(f.brandOwner??f.brandName)!.slice(0,200):''})))};
            }
            remember(id,payload,kind==='food'?86400000:300000);
            return {status:200,body:payload};
        }catch(error){
            if(error instanceof UnsupportedNutritionBasisError)return {status:422,body:{error:error.message}};
            return {status:502,body:{error:'USDA could not provide complete nutrition details. Try another food or the starter catalog.'}};
        }finally{active--;pending.delete(id);}
    }
    return async function nutritionRequest(request:Request,kind:Kind):Promise<Response>{
        // Count all requests, including invalid inputs/cache hits; do not trust client IP headers.
        const wait=incoming.take(now(),[{name:'incoming',duration:60000,limit:PROXY_LIMITS.incomingPerMinute}]);
        if(wait)return respond(limited(wait));
        let value:string;
        try{
            const url=new URL(request.url);
            value=kind==='search'?searchQuery(url.searchParams.get('q')):foodId(url.searchParams.get('id'));
        }catch{return respond({status:400,body:{error:kind==='search'?'Search must contain 2–80 characters.':'Invalid USDA food identifier.'}});}
        const key=getKey();
        if(!key)return respond({status:503,body:{error:'USDA search is unavailable: FDC_API_KEY is not configured. The starter catalog still works.'}});
        const id=`${kind}:${value.toLowerCase()}`,existing=cache.get(id);
        if(existing && existing.until>now())return respond({status:200,body:existing.value});
        const shared=pending.get(id);if(shared)return respond(await shared);
        if(cooldown>now())return respond(limited((cooldown-now())/1000));
        if(active>=PROXY_LIMITS.concurrency)return respond(limited(1));
        const retry=upstream.take(now(),[{name:'minute',duration:60000,limit:PROXY_LIMITS.upstreamPerMinute},{name:'hour',duration:3600000,limit:PROXY_LIMITS.upstreamPerHour}]);
        if(retry)return respond(limited(retry));
        active++;
        // Defer execution so pending is installed even if a mocked fetch throws synchronously.
        const work=Promise.resolve().then(()=>retrieve(kind,value,key,id));pending.set(id,work);
        return respond(await work);
    };
}
// Share across route bundles using this globalThis. Other workers/isolates/instances have separate state.
const state=globalThis as typeof globalThis & {__formfuelNutritionProxyV1?:ReturnType<typeof createNutritionHandler>};
export const nutritionRequest=state.__formfuelNutritionProxyV1??=createNutritionHandler();
