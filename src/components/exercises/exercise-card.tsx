import Link from "next/link";
import type { Exercise } from "@/lib/exercises/types";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return <article aria-labelledby={`card-${exercise.slug}`} className="flex min-w-0 flex-col rounded-panel border border-border bg-surface p-5 sm:p-6">
    <div className="mb-6 flex items-center justify-between gap-3">
      <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-control border border-primary/30 bg-background text-primary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" focusable="false"><path d="M4 5h6l2 2 2-2h6v14h-6l-2 2-2-2H4V5Zm8 2v14M7 9h2m-2 4h2m6-4h2m-2 4h2" /></svg></span>
      <span className="font-mono text-[10px] tracking-widest text-secondary">WRITTEN GUIDE</span>
    </div>
    <p className="text-xs font-semibold text-primary">{exercise.primaryMuscle}</p>
    {exercise.category !== exercise.primaryMuscle && <p className="mt-2 text-xs text-secondary">{exercise.category}</p>}
    <h3 id={`card-${exercise.slug}`} className="mt-3 text-heading-4"><Link href={`/exercises/${exercise.slug}`} className="inline-flex min-h-control items-center rounded-control text-foreground no-underline hover:text-primary">{exercise.name}</Link></h3>
    <p className="mt-3 text-sm leading-7 text-secondary">{exercise.description}</p>
    <dl className="mt-auto space-y-3 pt-6 text-xs"><div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border pt-4"><dt className="text-secondary">Equipment</dt><dd className="text-foreground">{exercise.equipment.join(" · ")}</dd></div><div className="flex flex-wrap justify-between gap-2"><dt className="text-secondary">Difficulty</dt><dd className="capitalize">{exercise.difficulty}</dd></div></dl>
  </article>;
}
