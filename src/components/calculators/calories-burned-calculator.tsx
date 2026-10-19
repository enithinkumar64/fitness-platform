"use client";

import { useRef, useState, type FormEvent } from "react";
import { ACTIVITIES, ACTIVITY_GROUPS, ACTIVITY_CATEGORIES, calculateCaloriesBurned, findActivity, validateCaloriesBurnedInput, type CaloriesBurnedErrors, type CaloriesBurnedResult } from "@/lib/calculators/calories-burned";
import { kgToPounds, poundsToKg } from "@/lib/calculators/tdee";

type Units = "metric" | "imperial";
const parse = (value: string) => value.trim() === "" ? NaN : Number(value);
const display = (value: number) => Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
const fieldStyle = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";

export function CaloriesBurnedCalculator() {
  const [activityId, setActivityId] = useState("walking-slow");
  const [units, setUnits] = useState<Units>("metric");
  const [weight, setWeight] = useState("");
  const [weightKg, setWeightKg] = useState(NaN);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("");
  const [errors, setErrors] = useState<CaloriesBurnedErrors>({});
  const [unitError, setUnitError] = useState("");
  const [result, setResult] = useState<CaloriesBurnedResult | null>(null);
  const activityRef = useRef<HTMLSelectElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const selected = findActivity(activityId)!;
  const variants = ACTIVITIES.filter((item) => item.group === selected.group);

  function edited() { setResult(null); setErrors({}); setUnitError(""); }
  function switchUnits(next: Units) {
    if (next === units) return;
    if (weight !== "" && !Number.isFinite(weightKg)) { setUnitError("Complete or clear your weight before switching units."); return; }
    // Preserve canonical kilograms; round only the converted display string.
    setWeight(display(next === "metric" ? weightKg : kgToPounds(weightKg)));
    setUnits(next); setUnitError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { activityId, weightKg, hours: parse(hours), minutes: parse(minutes) };
    const nextErrors = validateCaloriesBurnedInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setResult(null); requestAnimationFrame(() => errorRef.current?.focus()); return; }
    setResult(calculateCaloriesBurned(input));
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function reset() {
    setActivityId("walking-slow"); setUnits("metric"); setWeight(""); setWeightKg(NaN); setHours("0"); setMinutes(""); edited();
    requestAnimationFrame(() => activityRef.current?.focus());
  }
  const error = (key: keyof CaloriesBurnedErrors) => errors[key] ? <p id={`cb-error-${key}`} className="mt-2 text-sm text-error">{errors[key]}</p> : null;
  function numericProps(key: "weightKg" | "hours" | "minutes") {
    const durationError = key !== "weightKg" && !!errors.duration;
    return { "aria-invalid": !!errors[key] || durationError, "aria-describedby": [errors[key] && `cb-error-${key}`, durationError && "cb-error-duration"].filter(Boolean).join(" ") || undefined };
  }

  const form = <form key="form" aria-label="Calories burned calculator" onSubmit={submit} noValidate className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 className="text-heading-4">Your activity session</h2>
    {Object.keys(errors).length > 0 && <p ref={errorRef} role="alert" tabIndex={-1} className="mt-4 rounded-control text-error">Please correct the highlighted fields.</p>}
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <div><label htmlFor="cb-activity" className="text-sm font-medium">Activity</label><select ref={activityRef} id="cb-activity" value={selected.group} onChange={(e) => { setActivityId(ACTIVITIES.find((item) => item.group === e.target.value)!.id); edited(); }} className={`${fieldStyle} text-sm`} aria-invalid={!!errors.activityId} aria-describedby={errors.activityId ? "cb-error-activityId" : undefined}>{ACTIVITY_CATEGORIES.map((category) => <optgroup key={category} label={category}>{ACTIVITY_GROUPS.filter((group) => group.category === category).map(({ group }) => <option key={group} value={group}>{group}</option>)}</optgroup>)}</select>{error("activityId")}</div>
      <div><label htmlFor="cb-intensity" className="text-sm font-medium">Intensity or pace</label><select id="cb-intensity" value={activityId} onChange={(e) => { setActivityId(e.target.value); edited(); }} className={`${fieldStyle} text-sm`} aria-describedby="cb-source">{variants.map((item) => <option key={item.id} value={item.id}>{item.intensity}</option>)}</select><p id="cb-source" className="mt-2 text-xs leading-6 text-secondary">{selected.met} MET · 2024 Compendium code <a href={selected.sourceUrl}>{selected.sourceCode}</a>. Choose the closest description; these are fixed reference values.</p></div>
    </div>
    <fieldset className="mt-6"><legend className="text-sm font-semibold">Weight units</legend><div className="mt-2 flex flex-wrap gap-5">{(["metric", "imperial"] as const).map((unit) => <label key={unit} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="cb-units" checked={units === unit} onChange={() => switchUnits(unit)} />{unit === "metric" ? "Metric (kg)" : "Imperial (lb)"}</label>)}</div>{unitError && <p role="alert" className="mt-2 text-sm text-error">{unitError}</p>}</fieldset>
    <div className="mt-5 max-w-md"><label htmlFor="cb-weight" className="text-sm font-medium">Body weight ({units === "metric" ? "kg" : "lb"})</label><input id="cb-weight" type="number" step="any" required value={weight} onChange={(e) => { const value = e.target.value; setWeight(value); setWeightKg(units === "metric" ? parse(value) : poundsToKg(parse(value))); edited(); }} className={fieldStyle} {...numericProps("weightKg")} />{error("weightKg")}</div>
    <fieldset className="mt-6"><legend className="text-sm font-semibold">Activity duration</legend><div className="mt-2 grid max-w-md grid-cols-2 gap-3"><div><label htmlFor="cb-hours" className="text-sm font-medium">Hours</label><input id="cb-hours" type="number" min="0" max="12" step="1" required value={hours} onChange={(e) => { setHours(e.target.value); edited(); }} className={fieldStyle} {...numericProps("hours")} />{error("hours")}</div><div><label htmlFor="cb-minutes" className="text-sm font-medium">Minutes</label><input id="cb-minutes" type="number" min="0" max="59" step="1" required value={minutes} onChange={(e) => { setMinutes(e.target.value); edited(); }} className={fieldStyle} {...numericProps("minutes")} />{error("minutes")}</div></div>{error("duration")}<p className="mt-2 text-xs leading-6 text-secondary">Enter whole hours and minutes, including 0 where needed. Use time spent at the selected activity intensity; do not count breaks as if the activity continued.</p></fieldset>
    <p className="mt-5 text-xs leading-6 text-secondary">Software limits: weight 20–400 kg (including converted pounds), duration 1 minute to 12 hours. These limits are not exercise recommendations or guarantees of accuracy. The MET source primarily represents adults aged 19–59; estimates may fit older adults and other populations poorly.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-active">Calculate calories burned</button><button type="button" onClick={reset} className="min-h-control rounded-control border border-border-control px-5 py-3 text-foreground hover:bg-surface-hover">Reset</button></div>
  </form>;

  const results = <section key="results" ref={resultRef} tabIndex={-1} aria-labelledby="cb-results-heading" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 id="cb-results-heading" className="text-heading-4">Your activity calorie estimate</h2>
    <p role="status" className="mt-2 text-sm text-secondary">{result ? "Calculation complete. Your estimated gross energy expenditure is ready." : "Choose an activity and enter your weight and duration to see an estimate."}</p>
    {result && <>
      <div className="mt-6 rounded-control border border-primary/30 bg-background p-5"><p className="text-sm text-secondary">Estimated gross calories burned</p><p className="mt-3 break-words font-mono text-4xl font-bold text-primary sm:text-5xl"><span data-testid="gross-calories">{Math.round(result.grossCalories)}</span><span className="ml-2 text-lg">kcal</span></p><p className="mt-3 text-sm leading-6">{result.activity.name}</p></div>
      <figure className="mt-6" aria-labelledby="cb-summary-caption"><figcaption id="cb-summary-caption" className="text-sm font-semibold">Session at a glance</figcaption><div role="img" aria-label={`Session summary: ${result.activity.name}; ${result.durationMinutes} minutes; ${result.weightKg.toFixed(1)} kg; ${result.activity.met} MET; ${Math.round(result.grossCalories)} kcal gross.`} className="mt-4 grid gap-3 sm:grid-cols-3"><div aria-hidden="true" className="min-w-0 rounded-control border border-border bg-background p-4"><span className="text-xs text-secondary">Intensity</span><p className="mt-2 font-mono text-xl text-primary">{result.activity.met} MET</p></div><div aria-hidden="true" className="min-w-0 rounded-control border border-border bg-background p-4"><span className="text-xs text-secondary">Active duration</span><p className="mt-2 break-words font-mono text-xl">{result.durationMinutes} min</p></div><div aria-hidden="true" className="min-w-0 rounded-control border border-border bg-background p-4"><span className="text-xs text-secondary">Body weight</span><p className="mt-2 break-words font-mono text-xl">{(units === "metric" ? result.weightKg : kgToPounds(result.weightKg)).toFixed(1)} {units === "metric" ? "kg" : "lb"}</p></div></div></figure>
      <dl className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-2"><div><dt className="text-sm text-secondary">Average calories per minute</dt><dd data-testid="calories-per-minute" className="mt-2 font-mono text-2xl">{result.caloriesPerMinute.toFixed(2)} kcal/min</dd></div><div><dt className="text-sm text-secondary">Estimated calories per hour</dt><dd data-testid="calories-per-hour" className="mt-2 font-mono text-2xl">{Math.round(result.caloriesPerHour)} kcal/hour</dd></div></dl>
      <p className="mt-5 text-xs leading-6 text-secondary">Rate estimates assume the same activity intensity throughout; the hourly rate is not a recommendation to continue for an hour. Displayed values are rounded; calculations retain full precision.</p>
      <p className="mt-3 text-xs leading-6 text-secondary">Activity source: <a href={result.activity.sourceUrl}>2024 Adult Compendium, code {result.activity.sourceCode}</a>.</p>
    </>}
    <p className="mt-6 text-sm leading-7 text-secondary">Gross energy includes the energy you would expend at rest during this time. It is not the same as additional calories above rest. Do not automatically add it to TDEE or treat it as calories to eat back; daily activity may already be included in a TDEE estimate.</p>
  </section>;
  return <div className="flex min-w-0 flex-col gap-8">{result ? [results, form] : [form, results]}</div>;
}
