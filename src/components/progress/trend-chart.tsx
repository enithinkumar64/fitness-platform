import { useId } from 'react';
export type TrendPoint={id:string;date:string;value:number};
function day(date:string){return Date.parse(`${date}T00:00:00Z`)/86400000;}
export function TrendChart({title,unit,points}:{title:string;unit:string;points:TrendPoint[]}) {
  const id=useId();
  if(!points.length)return <div className="mt-5 rounded-control border border-border p-4"><h3 className="text-heading-5">{title}</h3><p className="mt-2 text-secondary">No entries for this trend yet.</p></div>;
  const values=points.map(p=>p.value),low=Math.min(...values),high=Math.max(...values),padding=Math.max((high-low)*0.1,0.5);
  const min=low-padding,max=high+padding,first=day(points[0].date),last=day(points[points.length-1].date);
  const coordinates=points.map(p=>({x:first===last?330:70+(day(p.date)-first)/(last-first)*480,y:185-(p.value-min)/(max-min)*155}));
  const latest=points[points.length-1];
  return <figure className="mt-6 min-w-0 rounded-control border border-border p-3 sm:p-5">
    <figcaption id={`${id}-title`} className="font-semibold">{title}</figcaption>
    <p id={`${id}-description`} className="mt-2 text-sm text-secondary">{points.length} logged {points.length===1?'point':'points'}. Latest: {latest.value.toFixed(2)} {unit} on {latest.date}. Vertical axis is auto-ranged. Same-day points share a date position; lines join logged points only.</p>
    <p className="mt-3 text-xs text-secondary">Displayed vertical range: {min.toFixed(2)}–{max.toFixed(2)} {unit}. Dates: {points[0].date} to {latest.date}.</p>
    <svg className="mt-3 block h-44 w-full text-primary sm:h-64" viewBox="0 0 600 205" preserveAspectRatio="none" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <path d="M70 25V185H550" stroke="var(--color-border-control)" fill="none"/>
      {points.length>1&&<polyline points={coordinates.map(p=>`${p.x},${p.y}`).join(' ')} stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" fill="none"/>}
      {coordinates.map((p,i)=><circle key={points[i].id} cx={p.x} cy={p.y} r="6" fill="currentColor" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"><title>{points[i].date}: {points[i].value.toFixed(2)} {unit}</title></circle>)}
    </svg>
    <div aria-hidden="true" className="flex flex-wrap justify-between gap-2 font-mono text-xs text-secondary"><span>{points[0].date}</span><span>{latest.date}</span></div>
    <details className="mt-3"><summary className="cursor-pointer text-sm font-semibold">View {title.toLowerCase()} data table</summary><table className="mt-3 w-full table-fixed text-left text-sm"><caption className="sr-only">{title} logged values in chronological order</caption><thead><tr><th scope="col" className="py-2">Date</th><th scope="col" className="py-2">Value ({unit})</th></tr></thead><tbody>{points.map(p=><tr key={p.id} className="border-t border-border"><th scope="row" className="break-words py-2 font-normal">{p.date}</th><td className="break-words py-2 font-mono">{p.value.toFixed(2)}</td></tr>)}</tbody></table></details>
  </figure>;
}
