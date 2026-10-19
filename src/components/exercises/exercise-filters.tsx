import type { RefObject } from "react";
import { DIRECTORY_CATEGORIES, MUSCLE_GROUPS, EQUIPMENT, DIFFICULTIES, type ExerciseFilters as Filters } from "@/lib/exercises/types";

const fieldStyle = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-sm text-foreground";
type Props = { filters: Filters; onChange: (filters: Filters) => void; onClear: () => void; searchRef: RefObject<HTMLInputElement | null> };

export function ExerciseFilters({ filters, onChange, onClear, searchRef }: Props) {
  return <form role="search" aria-label="Filter exercise library" onSubmit={(event) => event.preventDefault()} className="rounded-panel border border-border bg-surface p-5 sm:p-6">
    <div><label htmlFor="exercise-search" className="text-sm font-medium">Search by exercise name</label><input ref={searchRef} id="exercise-search" type="search" value={filters.search ?? ""} onChange={(event) => onChange({ ...filters, search: event.target.value })} className={fieldStyle} placeholder="Try squat, row, or press" aria-controls="exercise-results" /></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div><label htmlFor="exercise-category" className="text-sm font-medium">Directory category</label><select id="exercise-category" value={filters.category ?? ""} onChange={(event) => onChange({ ...filters, category: event.target.value as Filters["category"] })} className={fieldStyle} aria-controls="exercise-results"><option value="">All categories</option>{DIRECTORY_CATEGORIES.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
      <div><label htmlFor="exercise-muscle" className="text-sm font-medium">Muscle group</label><select id="exercise-muscle" value={filters.muscle ?? ""} onChange={(event) => onChange({ ...filters, muscle: event.target.value as Filters["muscle"] })} className={fieldStyle} aria-controls="exercise-results"><option value="">All muscle groups</option>{MUSCLE_GROUPS.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
      <div><label htmlFor="exercise-equipment" className="text-sm font-medium">Equipment</label><select id="exercise-equipment" value={filters.equipment ?? ""} onChange={(event) => onChange({ ...filters, equipment: event.target.value as Filters["equipment"] })} className={fieldStyle} aria-controls="exercise-results"><option value="">All equipment</option>{EQUIPMENT.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
      <div><label htmlFor="exercise-difficulty" className="text-sm font-medium">Difficulty</label><select id="exercise-difficulty" value={filters.difficulty ?? ""} onChange={(event) => onChange({ ...filters, difficulty: event.target.value as Filters["difficulty"] })} className={fieldStyle} aria-controls="exercise-results"><option value="">All difficulties</option>{DIFFICULTIES.map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></div>
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs leading-6 text-secondary">Filters combine. Directory categories organize the guides. Muscle group matches primary metadata; equipment matches any listed item.</p><button type="button" onClick={onClear} className="min-h-control rounded-control border border-border-control px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface-hover">Clear all filters</button></div>
  </form>;
}
