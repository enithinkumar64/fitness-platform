import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createNutritionHandler} from '../../src/lib/nutrition/server.ts';
import {boundedJson,PROXY_LIMITS} from '../../src/lib/nutrition/proxy-protection.ts';
const food={fdcId:123,description:'Fixture food',dataType:'SR Legacy',foodNutrients:[{nutrient:{id:1008,unitName:'kcal'},amount:100},{nutrient:{id:1003,unitName:'g'},amount:5},{nutrient:{id:1005,unitName:'g'},amount:10},{nutrient:{id:1004,unitName:'g'},amount:2}]};
const req=(q,kind='search')=>new Request(`http://local/api/nutrition/${kind==='food'?'food?id=':'search?q='}${encodeURIComponent(q)}`);
function setup(fetcher){let time=0,calls=0;const handler=createNutritionHandler({now:()=>time,getKey:()=> 'synthetic-test-key',fetch:async(url,options)=>{calls++;assert.equal(options.headers['X-Api-Key'],'synthetic-test-key');assert.ok(!String(url).includes('synthetic-test-key'));return fetcher?fetcher(url,options):Response.json(String(url).includes('/food/')?food:{foods:[food]});}});return {handler,calls:()=>calls,advance:ms=>{time+=ms;}};}
test('normal search/detail, cache and bounded result count preserve safe nutrition',async()=>{
 const x=setup(()=>Response.json({foods:Array.from({length:30},(_,i)=>({...food,fdcId:i+1}))}));
 const result=await x.handler(req('apple'),'search');assert.equal(result.status,200);assert.equal((await result.json()).foods.length,12);
 await x.handler(req('APPLE'),'search');assert.equal(x.calls(),1);
 const y=setup();const detail=await y.handler(req('123','food'),'food');assert.equal(detail.status,200);assert.equal((await detail.json()).food.per100g.calories,100);
});
test('search and detail share a 30 upstream/minute budget and recover at its boundary',async()=>{
 const x=setup();for(let i=0;i<30;i++)assert.equal((await x.handler(req(i%2?String(i+1):`query${i}`,i%2?'food':'search'),i%2?'food':'search')).status,200);
 const blocked=await x.handler(req('uncached'),'search');assert.equal(blocked.status,429);assert.equal(blocked.headers.get('retry-after'),'60');assert.match((await blocked.json()).error,/starter catalog/);
 assert.equal((await x.handler(req('999','food'),'food')).status,429);assert.equal(x.calls(),30);
 x.advance(59000);assert.equal((await x.handler(req('later'),'search')).headers.get('retry-after'),'1');x.advance(1000);assert.equal((await x.handler(req('later'),'search')).status,200);
});
test('600/hour shared quota remains bounded across minute windows, then recovers',async()=>{
 const x=setup();for(let minute=0;minute<20;minute++){for(let i=0;i<30;i++)assert.equal((await x.handler(req(`food-${minute}-${i}`),'search')).status,200);x.advance(60000);}
 const blocked=await x.handler(req('extra'),'search');assert.equal(blocked.status,429);assert.equal(blocked.headers.get('retry-after'),'2400');assert.equal(x.calls(),600);x.advance(2400000);assert.equal((await x.handler(req('extra'),'search')).status,200);
});
test('120/minute incoming budget counts invalid requests and cached repeats without USDA calls',async()=>{
 const x=setup();for(let i=0;i<120;i++)assert.equal((await x.handler(req('x'),'search')).status,400);
 const blocked=await x.handler(req('123','food'),'food');assert.equal(blocked.status,429);assert.equal(blocked.headers.get('retry-after'),'60');assert.equal(x.calls(),0);x.advance(60000);assert.equal((await x.handler(req('123','food'),'food')).status,200);
 const y=setup();for(let i=0;i<120;i++)assert.equal((await y.handler(req('apple'),'search')).status,200);assert.equal(y.calls(),1);assert.equal((await y.handler(req('apple'),'search')).status,429);
});
test('identical in-flight requests coalesce while four distinct calls cap concurrency',async()=>{
 const releases=[];const x=setup(()=>new Promise(resolve=>releases.push(()=>resolve(Response.json({foods:[food]})))));
 const first=x.handler(req('same'),'search'),same=x.handler(req('same'),'search');const others=[1,2,3].map(i=>x.handler(req(`distinct${i}`),'search'));
 await Promise.resolve();assert.equal(x.calls(),4);const blocked=await x.handler(req('123','food'),'food');assert.equal(blocked.status,429);assert.equal(blocked.headers.get('retry-after'),'1');
 for(const release of releases)release();for(const r of await Promise.all([first,same,...others]))assert.equal(r.status,200);assert.equal(x.calls(),4);
});
test('upstream failures and cooldown are safe and do not leak credentials or error bodies',async()=>{
 let attempts=0;const x=setup(()=>{attempts++;return attempts===1?new Response('private upstream detail',{status:429,headers:{'Retry-After':'10'}}):Response.json({foods:[food]});});
 let r=await x.handler(req('a1'),'search');assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'10');assert.ok(!(await r.text()).includes('private'));assert.equal((await x.handler(req('123','food'),'food')).status,429);assert.equal(x.calls(),1);x.advance(10000);assert.equal((await x.handler(req('a1'),'search')).status,200);
 for(const response of [()=>new Response('private',{status:500}),()=>{throw Error('synthetic-test-key');},()=>new Response('{bad'),()=>Response.json({foods:null})]){const y=setup(response);r=await y.handler(req('a1'),'search');assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/synthetic-test-key|private/);}
});
test('invalid inputs and missing key make no upstream requests',async()=>{
 const x=setup();for(const q of ['a','x'.repeat(81),'ab\u0001cd'])assert.equal((await x.handler(req(q),'search')).status,400);
 for(const id of ['0','-1','123x','1000000000'])assert.equal((await x.handler(req(id,'food'),'food')).status,400);assert.equal(x.calls(),0);
 const missing=createNutritionHandler({getKey:()=>undefined,fetch:()=>{throw Error('must not call');}});
 for(const [value,kind] of [['apple','search'],['123','food']]){const r=await missing(req(value,kind),kind);assert.equal(r.status,503);assert.match((await r.json()).error,/starter catalog still works/);}
});
test('response byte limit rejects declared and streamed oversize data; aborted bodies stop reading',async()=>{
 const signal=new AbortController().signal;
 await assert.rejects(()=>boundedJson(new Response('{}',{headers:{'content-length':String(PROXY_LIMITS.responseBytes+1)}}),signal));
 let cancelled=false;
 const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(PROXY_LIMITS.responseBytes));c.enqueue(new Uint8Array(1));},cancel(){cancelled=true;}});
 await assert.rejects(()=>boundedJson(new Response(stream),signal));assert.ok(cancelled);
 const controller=new AbortController();const waiting=boundedJson(new Response(new ReadableStream({})),controller.signal);controller.abort();await assert.rejects(()=>waiting);
 const x=setup((_url,options)=>{assert.ok(options.signal instanceof AbortSignal);return new Response('x'.repeat(PROXY_LIMITS.responseBytes+1));});assert.equal((await x.handler(req('apple'),'search')).status,502);
});
test('failed calls release coalescing/concurrency slots; cache expiry triggers new calls',async()=>{
 let fail=true;const x=setup(()=>{if(fail)throw Error('upstream');return Response.json({foods:[food]});});
 for(let i=0;i<6;i++)assert.equal((await x.handler(req('apple'),'search')).status,502);fail=false;assert.equal((await x.handler(req('apple'),'search')).status,200);assert.equal(x.calls(),7);
 x.advance(300000);assert.equal((await x.handler(req('apple'),'search')).status,200);assert.equal(x.calls(),8);
});

test('missing foods, upstream timeouts and throttling have distinct safe responses',async()=>{
 const missing=setup(()=>new Response('private upstream detail',{status:404}));
 let r=await missing.handler(req('123','food'),'food');assert.equal(r.status,404);assert.match((await r.json()).error,/could not be found/);assert.equal(r.headers.get('retry-after'),null);
 const timed=setup(()=>{throw new DOMException('private timeout detail','TimeoutError');});
 r=await timed.handler(req('apple'),'search');assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/private timeout/);
 const limited=setup(()=>new Response('',{status:429}));r=await limited.handler(req('apple'),'search');assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'60');
});
test('rolling budgets retain calls across wall-clock minute boundaries',async()=>{
 const x=setup();x.advance(59000);for(let i=0;i<30;i++)assert.equal((await x.handler(req(`near-boundary-${i}`),'search')).status,200);
 x.advance(1000);let r=await x.handler(req('next-minute'),'search');assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'59');
 x.advance(59000);r=await x.handler(req('next-minute'),'search');assert.equal(r.status,200);
});
