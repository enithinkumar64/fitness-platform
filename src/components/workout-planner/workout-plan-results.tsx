import Link from "next/link";
import type { RefObject } from "react";
import { EXERCISES } from "@/lib/exercises/exercises";
import { formatDose } from "@/lib/workout-planner/generator";
import { SPLITS, splitStructure } from "@/lib/workout-planner/splits";
import { TEMPLATES } from "@/lib/workout-planner/templates";
import { GOALS, EQUIPMENT_MODES, type WorkoutPlan } from "@/lib/workout-planner/types";

export function WorkoutPlanResults({ plan, headingRef, regenerate, notice }: { plan: WorkoutPlan; headingRef: RefObject<HTMLHeadingElement | null>; regenerate: () => void; notice: string }) {
  const split = SPLITS.find((item) => item.id === plan.preferences.split)!;
  const usedEquipment = [...new Set(plan.workouts.flatMap((workout) => workout.exercises.flatMap((entry) => EXERCISES.find((e) => e.id === entry.exerciseId)!.equipment)))];
  return <section aria-labelledby="plan-results-heading" className="min-w-0 space-y-6">
    <div className="rounded-panel border border-primary/30 bg-surface p-5 sm:p-8">
      <p className="font-mono text-xs tracking-widest text-primary">CURATED STARTING PROGRAM</p>
      <h2 ref={headingRef} tabIndex={-1} id="plan-results-heading" className="mt-3 rounded-control text-heading-3">Your weekly workout plan</h2>
      <p data-testid="selected-split" className="mt-4 text-lg font-semibold">{split.name}</p><p className="mt-2 text-sm text-secondary">{splitStructure(split)}</p>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">{[["Goal",GOALS[plan.preferences.goal]], ["Experience",plan.preferences.experience], ["Equipment",EQUIPMENT_MODES[plan.preferences.equipment]], ["Training frequency",`${plan.preferences.days} days per week`]].map(([label,value]) => <div key={label}><dt className="text-secondary">{label}</dt><dd className="mt-1 capitalize">{value}</dd></div>)}</dl>
      <p className="mt-4 text-sm leading-7 text-secondary">Equipment used: {usedEquipment.join(" · ")}.{plan.preferences.hasBand && " A secure band anchor is also required."}</p>
      <p className="mt-3 text-sm leading-7 text-secondary">{split.benefits}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-secondary">{plan.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      <p className="mt-3 text-sm leading-7 text-secondary">{plan.rotation}</p>
      <p className="mt-3 text-sm leading-7 text-secondary">Plans remain only in this page’s memory. Refreshing or leaving this page clears them; they are not permanently saved.</p>
      <button type="button" onClick={regenerate} className="mt-5 min-h-control rounded-control border border-border-control px-4 py-3 font-semibold hover:bg-surface-hover">Regenerate Variation</button>
      <p role="status" aria-atomic="true" className="mt-3 text-sm leading-7 text-secondary">{notice}</p>
    </div>
    <section aria-labelledby="schedule-heading" className="rounded-panel border border-border bg-surface p-5 sm:p-8"><h3 id="schedule-heading" className="text-heading-4">Example seven-day schedule</h3><ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{plan.schedule.map(({day,workoutId}) => <li key={day} className="min-w-0 rounded-control border border-border bg-background p-4"><span className="block text-sm font-semibold">{day}</span>{workoutId ? <a href={`#${workoutId}`} className="mt-2 inline-block rounded-control text-sm">{plan.workouts.find((w) => w.id === workoutId)!.name}</a> : <span className="mt-2 block text-sm text-secondary">Recovery day</span>}</li>)}</ol></section>
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">{plan.workouts.map((workout) => <article key={workout.id} id={workout.id} tabIndex={-1} aria-labelledby={`${workout.id}-heading`} className="min-w-0 scroll-mt-8 rounded-panel border border-border bg-surface p-5 sm:p-7">
      <h3 id={`${workout.id}-heading`} className="text-heading-4">{workout.name} — {plan.schedule.find((day) => day.workoutId === workout.id)!.day}</h3>
      <p className="mt-3 text-xs leading-6 text-secondary">{TEMPLATES[workout.templateId].notes}</p>
      <p className="mt-3 text-xs leading-6 text-secondary">{workout.exercises[0].dose.effort}</p>
      <ol className="mt-5 space-y-5">{workout.exercises.map((entry) => {
        const exercise = EXERCISES.find((e) => e.id === entry.exerciseId)!;
        return <li key={entry.slotId} data-testid="program-slot" className="min-w-0 border-t border-border pt-4"><p className="text-xs text-secondary">{entry.label}</p><Link data-testid="program-exercise" href={`/exercises/${exercise.slug}`} className="mt-2 inline-block rounded-control font-semibold">{exercise.name}</Link>
          <p className="mt-2 font-mono text-sm">{formatDose(entry.dose)}</p><p className="mt-2 text-sm text-secondary">{entry.dose.restSeconds ? `Rest ${entry.dose.restSeconds} seconds between sets.` : "Steady easy pace; pause as needed."}</p>
          <p className="mt-2 text-xs leading-6 text-secondary">Primary: {exercise.primaryMuscle} · Equipment: {exercise.equipment.join(" · ")}</p>
          {entry.alternatives.length ? <details className="mt-3 text-xs leading-6"><summary className="min-h-control cursor-pointer rounded-control py-2 text-secondary">Approved alternatives for this slot</summary><ul className="mt-2 list-disc space-y-2 pl-5">{entry.alternatives.map((id) => { const alternative = EXERCISES.find((e) => e.id === id)!; return <li key={id}><Link href={`/exercises/${alternative.slug}`} className="rounded-control">{alternative.name}</Link><span className="text-secondary"> · {alternative.equipment.join(" · ")}</span></li>; })}</ul><p className="mt-2 text-secondary">Guide links are educational. Regenerate Variation changes one eligible slot and keeps the session order.</p></details> : <p className="mt-2 text-xs leading-6 text-secondary">No other approved alternative fits this slot and your confirmed equipment.</p>}
        </li>;
      })}</ol>
      {workout.omitted.length > 0 && <details className="mt-5 text-xs leading-6 text-secondary"><summary className="min-h-control cursor-pointer rounded-control py-2">Optional work not included</summary><ul className="list-disc space-y-2 pl-5">{workout.omitted.map((reason) => <li key={reason}>{reason}</li>)}</ul></details>}
    </article>)}</div>
  </section>;
}
