"use client";

import { useRef, useState, type FormEvent } from "react";
import { calculateOneRepMax, validateOneRepMaxInput, type OneRepMaxErrors, type OneRepMaxResult } from "@/lib/calculators/one-rep-max";
import { kgToPounds, poundsToKg } from "@/lib/calculators/tdee";

type Units = "kg" | "lb";
const parse = (value: string) => value.trim() === "" ? NaN : Number(value);
const display = (value: number) => Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
const fieldStyle = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";

export function OneRepMaxCalculator() {
  const [units, setUnits] = useState<Units>("kg");
  const [weight, setWeight] = useState("");
  const [weightKg, setWeightKg] = useState(NaN);
  const [repetitions, setRepetitions] = useState("");
  const [errors, setErrors] = useState<OneRepMaxErrors>({});
  const [unitError, setUnitError] = useState("");
  const [result, setResult] = useState<OneRepMaxResult | null>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  function edited() { setResult(null); setErrors({}); setUnitError(""); }
  function switchUnits(next: Units) {
    if (next === units) return;
    if (weight !== "" && !Number.isFinite(weightKg)) { setUnitError("Complete or clear your lifted weight before switching units."); return; }
    // Keep canonical kilograms unchanged; convert only the visible input string.
    setWeight(display(next === "kg" ? weightKg : kgToPounds(weightKg)));
    setUnits(next); setUnitError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { weightKg, repetitions: parse(repetitions) };
    const nextErrors = validateOneRepMaxInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setResult(null); requestAnimationFrame(() => errorRef.current?.focus()); return; }
    setResult(calculateOneRepMax(input));
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function reset() {
    setUnits("kg"); setWeight(""); setWeightKg(NaN); setRepetitions(""); edited();
    requestAnimationFrame(() => weightRef.current?.focus());
  }
  const mass = (kg: number) => `${(units === "kg" ? kg : kgToPounds(kg)).toFixed(1)} ${units}`;
  const error = (key: keyof OneRepMaxErrors) => errors[key] ? <p id={`orm-error-${key}`} className="mt-2 text-sm text-error">{errors[key]}</p> : null;
  const numericProps = (key: keyof OneRepMaxErrors) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `orm-error-${key}` : undefined });

  const form = <form key="form" aria-label="One-rep max calculator" onSubmit={submit} noValidate className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 className="text-heading-4">Your completed set</h2>
    <fieldset className="mt-6"><legend className="text-sm font-semibold">Load units</legend><div className="mt-2 flex flex-wrap gap-5">{(["kg", "lb"] as const).map((unit) => <label key={unit} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="orm-units" checked={units === unit} onChange={() => switchUnits(unit)} />{unit === "kg" ? "Kilograms (kg)" : "Pounds (lb)"}</label>)}</div><p className="mt-2 text-xs leading-6 text-secondary">Switching units converts the load and displayed results without rounding the kilograms used for calculation.</p>{unitError && <p role="alert" className="mt-2 text-sm text-error">{unitError}</p>}</fieldset>
    {Object.keys(errors).length > 0 && <p ref={errorRef} role="alert" tabIndex={-1} className="mt-4 rounded-control text-error">Please correct the highlighted fields.</p>}
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <div><label htmlFor="orm-weight" className="text-sm font-medium">Weight lifted ({units})</label><input ref={weightRef} id="orm-weight" type="number" step="any" required value={weight} onChange={(e) => { const value = e.target.value; setWeight(value); setWeightKg(units === "kg" ? parse(value) : poundsToKg(parse(value))); edited(); }} className={fieldStyle} {...numericProps("weightKg")} />{error("weightKg")}</div>
      <div><label htmlFor="orm-repetitions" className="text-sm font-medium">Completed repetitions</label><input id="orm-repetitions" type="number" min="1" max="12" step="1" required value={repetitions} onChange={(e) => { setRepetitions(e.target.value); edited(); }} className={fieldStyle} {...numericProps("repetitions")} />{error("repetitions")}</div>
    </div>
    <p className="mt-5 text-xs leading-6 text-secondary">Use a challenging set you have already completed with good technique, counting only completed repetitions. Do not perform a maximal or failure test just to use this tool. Software limits: 0.1–1,000 kg of lifted load (including converted pounds), and 1–12 whole repetitions. These bounds do not indicate safe or achievable loads.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-active">Calculate 1RM</button><button type="button" onClick={reset} className="min-h-control rounded-control border border-border-control px-5 py-3 text-foreground hover:bg-surface-hover">Reset</button></div>
  </form>;

  const results = <section key="results" ref={resultRef} tabIndex={-1} aria-labelledby="orm-results-heading" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 id="orm-results-heading" className="text-heading-4">Your estimated one-rep max</h2>
    <p role="status" className="mt-2 text-sm text-secondary">{result ? "Calculation complete. Review both estimates and the mathematical load references below." : "Enter a completed set to see your estimates."}</p>
    {result && <>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2"><div className="min-w-0 rounded-control border border-primary/30 bg-background p-5"><dt className="text-sm text-secondary">Epley · primary estimate</dt><dd data-testid="epley-estimate" className="mt-3 break-words font-mono text-4xl font-bold text-primary">{mass(result.epleyKg)}</dd></div><div className="min-w-0 rounded-control border border-border bg-background p-5"><dt className="text-sm text-secondary">Brzycki · separate comparison</dt><dd data-testid="brzycki-estimate" className="mt-3 break-words font-mono text-3xl font-bold">{mass(result.brzyckiKg)}</dd></div></dl>
      <p className="mt-5 text-sm text-secondary">Entered set: <span data-testid="entered-set" className="font-mono text-foreground">{mass(result.weightKg)} × {result.repetitions} {result.repetitions === 1 ? "rep" : "reps"}</span>.</p>
      {result.repetitions === 1 && <p className="mt-3 text-sm leading-7 text-secondary">For one repetition, both outputs equal your entered load without extrapolation. A completed single does not establish that it was your maximum.</p>}
      {result.repetitions >= 10 && <p className="mt-3 text-sm leading-7 text-warning">Higher-repetition estimate: endurance differences can increase uncertainty. Treat these values cautiously; neither formula guarantees a successful lift.</p>}
      <p className="mt-4 text-sm leading-7 text-secondary">Epley is the display convention here, not a claim of universal accuracy. The formulas are not averaged. Values are rounded to one decimal for display; the percentage table uses the unrounded Epley estimate.</p>
      <table className="mt-7 w-full table-fixed text-left text-sm"><caption className="pb-4 text-left"><span className="font-semibold text-foreground">Training-load percentage references</span><span className="mt-2 block text-xs leading-6 text-secondary">Mathematical percentages of the Epley estimate, not a personalized training prescription. Bars share a zero-to-100% scale.</span></caption><thead><tr className="border-b border-border text-xs text-secondary"><th scope="col" className="w-1/4 py-3 pr-2 font-medium">Percent</th><th scope="col" className="w-2/5 py-3 pr-2 font-medium">Load ({units})</th><th scope="col" className="py-3 font-medium">Relative load</th></tr></thead><tbody>{result.trainingLoads.map((load) => <tr key={load.percentage} className="border-b border-border"><th scope="row" className="py-4 pr-2 font-mono font-medium">{load.percentage}%</th><td data-testid={`load-${load.percentage}`} className="break-words py-4 pr-2 font-mono">{mass(load.weightKg)}</td><td className="py-4"><div role="img" aria-label={`${load.percentage}% of the Epley estimate: ${mass(load.weightKg)}.`} className="h-3 overflow-hidden rounded-full border border-border-control bg-background"><div aria-hidden="true" data-testid={`bar-${load.percentage}`} className="h-full bg-primary" style={{ width: `${load.percentage}%` }} /></div></td></tr>)}</tbody></table>
    </>}
    <p className="mt-6 text-sm leading-7 text-secondary">Estimated loads are not guaranteed safe or achievable. Exercise choice, fatigue, experience, and technique affect performance. Do not attempt maximal lifts solely on the basis of this estimate.</p>
  </section>;
  return <div className="flex min-w-0 flex-col gap-8">{result ? [results, form] : [form, results]}</div>;
}
