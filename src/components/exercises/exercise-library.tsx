"use client";

import { useRef, useState } from "react";
import { filterExercises } from "@/lib/exercises/exercises";
import type { ExerciseFilters as Filters } from "@/lib/exercises/types";
import { ExerciseCard } from "./exercise-card";
import { ExerciseFilters } from "./exercise-filters";

export function ExerciseLibrary() {
  const [filters, setFilters] = useState<Filters>({});
  const searchRef = useRef<HTMLInputElement>(null);
  const matches = filterExercises(filters);
  function clear() { setFilters({}); requestAnimationFrame(() => searchRef.current?.focus()); }
  return <>
    <ExerciseFilters filters={filters} onChange={setFilters} onClear={clear} searchRef={searchRef} />
    <section id="exercise-results" aria-labelledby="exercise-results-heading" className="mt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 id="exercise-results-heading" className="text-heading-3">Exercise guides</h2><p role="status" aria-atomic="true" className="font-mono text-sm text-secondary">{matches.length} {matches.length === 1 ? "exercise" : "exercises"} found</p></div>
      {matches.length ? <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">{matches.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}</div> : <div className="rounded-panel border border-border bg-surface p-6 sm:p-8"><h3 className="text-heading-4">No exercises match</h3><p className="mt-3 text-sm leading-7 text-secondary">Try a shorter exercise name or remove a filter. Search checks exercise names, not muscle or equipment descriptions.</p><button type="button" onClick={clear} className="mt-5 min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover">Reset filters</button></div>}
    </section>
  </>;
}
