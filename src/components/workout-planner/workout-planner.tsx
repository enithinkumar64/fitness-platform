"use client";
import { useRef, useState, type FormEvent } from "react";
import { DIFFICULTIES, type Equipment } from "@/lib/exercises/types";
import { generatePlan, regeneratePlan } from "@/lib/workout-planner/generator";
import { availableSplits, splitStructure } from "@/lib/workout-planner/splits";
import { GYM_EQUIPMENT } from "@/lib/workout-planner/substitutions";
import { GOALS, EQUIPMENT_MODES, type PreferenceErrors, type WorkoutPlan } from "@/lib/workout-planner/types";
import { WorkoutPlanResults } from "./workout-plan-results";

type FormValues = { goal: string; experience: string; days: string; split: string; equipment: string; hasBench: boolean; hasBand: boolean; gymEquipment: Equipment[] };
const empty: FormValues = { goal: "", experience: "", days: "", split: "", equipment: "", hasBench: false, hasBand: false, gymEquipment: [] };
const field = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";
export function WorkoutPlanner() {
  const [values, setValues] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<PreferenceErrors>({});
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const goalRef = useRef<HTMLSelectElement>(null);
  function edited(patch: Partial<FormValues>) { setValues((previous) => ({ ...previous, ...patch })); setPlan(null); setErrors({}); setMessage(""); setNotice(""); }
  function edit(key: "goal" | "experience" | "days" | "split" | "equipment", value: string) {
    edited({ [key]: value, ...(key === "days" ? { split: "" } : {}), ...(key === "equipment" ? { hasBench: false, hasBand: false, gymEquipment: [] } : {}) });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const generated = generatePlan({ ...values, days: Number(values.days) });
    if (!generated.ok) { setPlan(null); setErrors(generated.errors); setMessage(generated.message); requestAnimationFrame(() => errorRef.current?.focus()); return; }
    setPlan(generated.plan); setErrors({}); setMessage(""); setNotice("Curated plan generated. Review equipment, workload and split trade-offs before training.");
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function regenerate() {
    if (!plan) return;
    const result = regeneratePlan(plan); setPlan(result.plan); setNotice(result.message);
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  const error = (key: keyof PreferenceErrors) => errors[key] ? <p id={`planner-error-${key}`} className="mt-2 text-sm leading-6 text-error">{errors[key]}</p> : null;
  const accessible = (key: keyof PreferenceErrors) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `planner-error-${key}` : undefined });
  const splits = availableSplits(Number(values.days));
  return <div className="space-y-8">
    {plan && <WorkoutPlanResults plan={plan} headingRef={resultRef} regenerate={regenerate} notice={notice} />}
    <form aria-label="Workout planner preferences" onSubmit={submit} noValidate className="rounded-panel border border-border bg-surface p-5 sm:p-8">
      <h2 className="text-heading-4">Choose your program</h2>
      {message && <p ref={errorRef} role="alert" tabIndex={-1} className="mt-5 rounded-control text-sm leading-7 text-error">{message}</p>}
      <fieldset className="mt-6"><legend className="font-semibold">1–3. Goal, experience and frequency</legend><div className="mt-4 grid gap-5 sm:grid-cols-3">{([
        ["goal", "Fitness goal", Object.entries(GOALS)], ["experience", "Experience", DIFFICULTIES.map((v) => [v, v[0].toUpperCase() + v.slice(1)])], ["days", "Training days per week", [2,3,4,5].map((v) => [String(v), `${v} days`])],
      ] as const).map(([key, label, options]) => <div key={key}><label htmlFor={`planner-${key}`} className="text-sm font-medium">{label}</label><select ref={key === "goal" ? goalRef : undefined} id={`planner-${key}`} value={values[key]} onChange={(event) => edit(key,event.target.value)} required {...accessible(key)} className={field}><option value="">Choose an option</option>{options.map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select>{error(key)}</div>)}</div></fieldset>
      <fieldset className="mt-8" {...accessible("split")}><legend className="font-semibold">4. Workout split</legend>
        {!splits.length ? <p className="mt-3 text-sm text-secondary">Choose training days to see the available splits.</p> : <><p className="mt-3 text-sm leading-7 text-secondary">Select a split explicitly. Recommended options are starting choices, not guarantees; five-day recommendations apply to experienced users. Valid alternatives remain selectable.</p><div className="mt-4 grid gap-4 lg:grid-cols-2">{splits.map((split) => <label key={split.id} className={`min-w-0 cursor-pointer rounded-panel border p-4 sm:p-5 ${values.split === split.id ? "border-primary bg-background" : split.recommended ? "border-primary/40 bg-background" : "border-border-control bg-background"}`}>
          <span className="flex items-start gap-3"><input type="radio" name="workout-split" value={split.id} aria-label={split.name} checked={values.split === split.id} onChange={() => edit("split",split.id)} required {...accessible("split")} className="mt-1 shrink-0" /><span className="min-w-0 text-sm font-semibold">{split.name}</span></span>
          <span className="mt-3 block font-mono text-xs text-primary">{split.recommended ? "RECOMMENDED STARTING OPTION" : "ALTERNATIVE / SPECIALIZED EMPHASIS"}</span>
          <span className="mt-3 block text-sm">{splitStructure(split)}</span><span className="mt-2 block text-sm leading-7 text-secondary">{split.description} {split.benefits}</span>
          <span className="mt-3 block text-sm leading-7 text-secondary"><strong className="font-medium text-foreground">Trade-off: </strong>{split.tradeoffs}</span><span className="mt-2 block text-xs leading-6 text-secondary">{split.suitability}</span>
        </label>)}</div></>}{error("split")}
      </fieldset>
      <fieldset className="mt-8"><legend className="font-semibold">5. Equipment you actually have</legend><div className="mt-4 max-w-xl"><label htmlFor="planner-equipment" className="text-sm font-medium">Equipment</label><select id="planner-equipment" value={values.equipment} onChange={(event) => edit("equipment",event.target.value)} required {...accessible("equipment")} className={field}><option value="">Choose an option</option>{Object.entries(EQUIPMENT_MODES).map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select>{error("equipment")}</div>
        {values.equipment === "dumbbells" && <div className="mt-5"><label className="flex min-h-control items-start gap-3 text-sm leading-7"><input type="checkbox" checked={values.hasBench} onChange={(event) => edited({ hasBench: event.target.checked })} {...accessible("hasBench")} className="mt-2" />I have a stable exercise bench</label><p className="mt-2 text-sm leading-7 text-secondary">The approved dumbbell rows need a bench. No cables, machines or barbells are assumed. Some secondary leg work uses bodyweight because weighted dumbbell lunge variations are not in the library.</p>{error("hasBench")}</div>}
        {values.equipment === "bodyweight" && <div className="mt-5"><label className="flex min-h-control items-start gap-3 text-sm leading-7"><input type="checkbox" checked={values.hasBand} onChange={(event) => edited({ hasBand: event.target.checked })} {...accessible("hasBand")} className="mt-2" />I have a resistance band and secure anchor</label><p className="mt-2 text-sm leading-7 text-secondary">Rows need the band and anchor. Home Full Body and Upper/Lower templates are supported; splits containing Push or Pull need approved shoulder/triceps/curl options that this home catalog does not provide. No weights or machines are used.</p>{error("hasBand")}</div>}
        {values.equipment === "gym" && <fieldset className="mt-5" {...accessible("gymEquipment")}><legend className="text-sm font-medium">Equipment available at my gym</legend><p className="mt-2 text-sm leading-7 text-secondary">Check only what is available. Bodyweight space is included. Leave the machine bundle unchecked unless all three machines are present; the planner can use other confirmed alternatives. Specialized equipment is not assumed.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{GYM_EQUIPMENT.map((option) => <label key={option.value} className="flex min-h-control items-start gap-3 text-sm leading-7"><input type="checkbox" checked={values.gymEquipment.includes(option.value)} onChange={(event) => edited({ gymEquipment: event.target.checked ? [...values.gymEquipment,option.value] : values.gymEquipment.filter((item) => item !== option.value) })} className="mt-2" />{option.label}</label>)}</div>{error("gymEquipment")}</fieldset>}
      </fieldset>
      <p className="mt-6 text-sm leading-7 text-secondary">Plans use explicitly curated slots and alternatives, not the entire exercise library. Changing a preference clears the previous result. Difficulty labels are skill guides, not individual clearance.</p>
      <div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover">Generate Plan</button><button type="button" onClick={() => { setValues(empty); setPlan(null); setErrors({}); setMessage(""); setNotice(""); requestAnimationFrame(() => goalRef.current?.focus()); }} className="min-h-control rounded-control border border-border-control px-5 py-3 hover:bg-surface-hover">Reset</button></div>
    </form>
  </div>;
}
