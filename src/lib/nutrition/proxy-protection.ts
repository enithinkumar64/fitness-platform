// Rolling, process-local budgets. Not a distributed or per-client limiter.
export const PROXY_LIMITS = { incomingPerMinute:120, upstreamPerMinute:30, upstreamPerHour:600, concurrency:4, responseBytes:1048576, cacheEntries:100, cacheBytes:8388608, timeoutMs:8000 } as const;
export class Budget {
  private windows = new Map<string,number[]>();
  take(now:number, rules:readonly {name:string;duration:number;limit:number}[]):number {
    let retry=0;
    for(const rule of rules){
      const times=(this.windows.get(rule.name)??[]).filter(time=>time>now-rule.duration);
      this.windows.set(rule.name,times);
      if(times.length>=rule.limit)retry=Math.max(retry,Math.ceil((times[0]+rule.duration-now)/1000));
    }
    if(retry)return Math.max(1,retry);
    for(const rule of rules)this.windows.get(rule.name)!.push(now);
    return 0;
  }
}
export async function boundedJson(response:Response,signal:AbortSignal):Promise<unknown>{
  if(Number(response.headers.get('content-length'))>PROXY_LIMITS.responseBytes){await response.body?.cancel();throw Error('Response too large');}
  if(!response.body)throw Error('Empty response');
  const reader=response.body.getReader(),chunks:Uint8Array[]=[];
  let size=0;
  const abort=()=>{void reader.cancel().catch(()=>{});};
  signal.addEventListener('abort',abort,{once:true});
  try{
    while(true){
      signal.throwIfAborted();const {done,value}=await reader.read();signal.throwIfAborted();
      if(done)break;
      size+=value.byteLength;
      if(size>PROXY_LIMITS.responseBytes)throw Error('Response too large');
      chunks.push(value);
    }
    const bytes=new Uint8Array(size);let offset=0;
    for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    return JSON.parse(new TextDecoder().decode(bytes));
  }finally{signal.removeEventListener('abort',abort);await reader.cancel().catch(()=>{});reader.releaseLock();}
}
