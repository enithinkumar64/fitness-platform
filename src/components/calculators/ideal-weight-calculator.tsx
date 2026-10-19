"use client";

import { useRef, useState, type FormEvent } from "react";
import { calculateIdealWeight, FORMULAS, validateIdealWeightInput, type IdealWeightErrors, type IdealWeightResult } from "@/lib/calculators/ideal-weight";
import { cmToImperial, imperialToCm, kgToPounds, type Coefficient } from "@/lib/calculators/tdee";

type Units = "metric" | "imperial";
const parse = (value: string) => value.trim() === "" ? NaN : Number(value);
const display = (value: number) => Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
const fieldStyle = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";

export function IdealWeightCalculator() {
  const [units, setUnits] = useState<Units>("metric");
  const [age, setAge] = useState("");
  const [coefficient, setCoefficient] = useState<Coefficient>("male");
  const [heightCm, setHeightCm] = useState(NaN);
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [errors, setErrors] = useState<IdealWeightErrors>({});
  const [unitError, setUnitError] = useState("");
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);

  function edited() { setResult(null); setErrors({}); setUnitError(""); }
  function switchUnits(next: Units) {
    if (next === units) return;
    if ((height !== "" || feet !== "" || inches !== "") && !Number.isFinite(heightCm)) {
      setUnitError("Complete or clear your height before switching units."); return;
    }
    if (next === "metric") { setHeight(display(heightCm)); setFeet(""); setInches(""); }
    else if (Number.isFinite(heightCm)) {
      const converted = cmToImperial(heightCm);
      const rounded = display(converted.inches);
      setFeet(String(converted.feet + (rounded === "12" ? 1 : 0)));
      setInches(rounded === "12" ? "0" : rounded);
    } else { setFeet(""); setInches(""); }
    if (next === "imperial") setHeight("");
    // Only display strings change. Canonical height and results retain precision.
    setUnits(next); setUnitError("");
  }
  function updateImperialHeight(nextFeet: string, nextInches: string) {
    setFeet(nextFeet); setInches(nextInches);
    const f = parse(nextFeet), i = parse(nextInches);
    setHeightCm(Number.isInteger(f) && f >= 0 && i >= 0 && i < 12 ? imperialToCm(f, i) : NaN);
    edited();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { age: parse(age), heightCm, coefficient };
    const nextErrors = validateIdealWeightInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setResult(null); requestAnimationFrame(() => errorRef.current?.focus()); return; }
    setResult(calculateIdealWeight(input));
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function reset() {
    setUnits("metric"); setAge(""); setCoefficient("male"); setHeightCm(NaN); setHeight(""); setFeet(""); setInches(""); edited();
    requestAnimationFrame(() => ageRef.current?.focus());
  }
  const error = (key: keyof IdealWeightErrors) => errors[key] ? <p id={`iw-error-${key}`} className="mt-2 text-sm text-error">{errors[key]}</p> : null;
  const numericProps = (key: keyof IdealWeightErrors) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `iw-error-${key}` : undefined });
  const mass = (kg: number) => `${(units === "metric" ? kg : kgToPounds(kg)).toFixed(1)} ${units === "metric" ? "kg" : "lb"}`;
  const axisMaxKg = result?.estimatesKg ? Math.ceil(Math.max(...Object.values(result.estimatesKg)) / 10) * 10 : 0;

  const form = <form key="measurements" aria-label="Ideal weight calculator" onSubmit={submit} noValidate className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 className="text-heading-4">Your height and formula choice</h2>
    <fieldset className="mt-6"><legend className="text-sm font-semibold">Unit system</legend><div className="mt-2 flex flex-wrap gap-5">{(["metric", "imperial"] as const).map((unit) => <label key={unit} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="iw-units" checked={units === unit} onChange={() => switchUnits(unit)} />{unit === "metric" ? "Metric" : "Imperial"}</label>)}</div><p className="mt-2 text-xs leading-6 text-secondary">Unit changes convert your height and displayed weights without rounding the height used in calculations.</p>{unitError && <p role="alert" className="mt-2 text-sm text-error">{unitError}</p>}</fieldset>
    {Object.keys(errors).length > 0 && <p ref={errorRef} role="alert" tabIndex={-1} className="mt-4 rounded-control text-error">Please correct the highlighted fields.</p>}
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <div><label htmlFor="iw-age" className="text-sm font-medium">Age (years)</label><input ref={ageRef} id="iw-age" type="number" min="20" max="100" step="1" required value={age} onChange={(e) => { setAge(e.target.value); edited(); }} className={fieldStyle} {...numericProps("age")} />{error("age")}</div>
      <div><label htmlFor="iw-coefficient" className="text-sm font-medium">Formula coefficient set</label><select id="iw-coefficient" value={coefficient} onChange={(e) => { setCoefficient(e.target.value as Coefficient); edited(); }} className={fieldStyle} aria-describedby="iw-coefficient-help"><option value="male">Male-based formulas</option><option value="female">Female-based formulas</option></select><p id="iw-coefficient-help" className="mt-2 text-xs leading-6 text-secondary">This selects the published equation coefficients, not a determination of gender identity. Seek qualified guidance if you are unsure how these historical formulas relate to your circumstances.</p></div>
      {units === "metric" ? <div><label htmlFor="iw-height" className="text-sm font-medium">Height (cm)</label><input id="iw-height" type="number" step="any" required value={height} onChange={(e) => { setHeight(e.target.value); setHeightCm(parse(e.target.value)); edited(); }} className={fieldStyle} {...numericProps("heightCm")} />{error("heightCm")}</div> : <div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="iw-feet" className="text-sm font-medium">Height (feet)</label><input id="iw-feet" type="number" step="1" required value={feet} onChange={(e) => updateImperialHeight(e.target.value, inches)} className={fieldStyle} {...numericProps("heightCm")} /></div><div><label htmlFor="iw-inches" className="text-sm font-medium">Height (inches)</label><input id="iw-inches" type="number" step="any" min="0" max="11.999999" required value={inches} onChange={(e) => updateImperialHeight(feet, e.target.value)} className={fieldStyle} {...numericProps("heightCm")} /></div></div><p className="mt-2 text-xs text-secondary">Use whole feet and inches from 0 up to, but not including, 12.</p>{error("heightCm")}</div>}
    </div>
    <p className="mt-5 text-xs leading-6 text-secondary">Supported inputs: whole-number age 20–100 and height 100–250 cm, including converted imperial heights. The four formulas require at least five feet (152.4 cm); shorter heights receive only the separate BMI-based interval. Age checks adult eligibility and does not change the formula estimates. No current weight is needed.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-active">Calculate estimates</button><button type="button" onClick={reset} className="min-h-control rounded-control border border-border-control px-5 py-3 text-foreground hover:bg-surface-hover">Reset</button></div>
  </form>;

  const results = <section key="results" ref={resultRef} tabIndex={-1} aria-labelledby="iw-results-heading" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 id="iw-results-heading" className="text-heading-4">Your Height-Based Weight Estimates</h2>
    <p role="status" className="mt-2 text-sm text-secondary">{result ? "Calculation complete. Review the reference estimates and their limitations below." : "Enter your height and calculate to compare the reference estimates."}</p>
    {result && <>
      {result.formulaNotice && <p className="mt-6 rounded-control border border-border-control p-4 text-sm leading-7 text-warning">{result.formulaNotice}</p>}
      {result.estimatesKg && <>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">{FORMULAS.map((formula) => <div key={formula.id} className="min-w-0 rounded-control border border-border bg-background p-5"><dt className="text-sm text-secondary">{formula.label}</dt><dd data-testid={`estimate-${formula.id}`} className="mt-3 break-words font-mono text-3xl font-bold text-foreground">{mass(result.estimatesKg![formula.id])}</dd></div>)}</dl>
        <figure className="mt-8" aria-labelledby="iw-comparison-caption"><figcaption id="iw-comparison-caption" className="text-sm font-semibold">Four historical formulas · common weight scale</figcaption><p className="mt-2 text-xs leading-6 text-secondary">All bars start at zero and share the same scale. Their order does not indicate which formula is better.</p><div className="mt-5 space-y-5">{FORMULAS.map((formula) => <div key={formula.id}><p className="mb-2 flex flex-wrap justify-between gap-2 text-sm"><span>{formula.label}</span><span className="font-mono">{mass(result.estimatesKg![formula.id])}</span></p><div role="img" aria-label={`${formula.label}: ${mass(result.estimatesKg![formula.id])}. Scale zero to ${mass(axisMaxKg)}.`} className="h-3 overflow-hidden rounded-full border border-border-control bg-background"><div data-testid={`bar-${formula.id}`} aria-hidden="true" className="h-full bg-primary" style={{ width: `${result.estimatesKg![formula.id] / axisMaxKg * 100}%` }} /></div></div>)}</div><div aria-hidden="true" className="mt-3 flex justify-between gap-2 font-mono text-xs text-secondary"><span>0</span><span>{mass(axisMaxKg)}</span></div></figure>
      </>}
      <div className="mt-8 border-t border-border pt-6"><h3 className="text-heading-5">BMI-based reference-weight interval</h3><p className="mt-2 text-sm leading-7 text-secondary">Adult reference BMI: 18.5 to below 25 kg/m².</p><dl className="mt-4 grid gap-5 sm:grid-cols-2"><div><dt className="text-sm text-secondary">Lower boundary (inclusive)</dt><dd data-testid="reference-lower" className="mt-2 font-mono text-xl">{mass(result.referenceWeightKg.lower)}</dd></div><div><dt className="text-sm text-secondary">Upper boundary (exclusive)</dt><dd data-testid="reference-upper" className="mt-2 font-mono text-xl">{mass(result.referenceWeightKg.upper)}</dd></div></dl><p className="mt-4 text-xs leading-6 text-secondary">Boundaries are 18.5 × height (m)² and 25 × height (m)². The exact upper boundary is excluded; displayed weights are rounded to one decimal. This population-level interval is not a personalized healthy-weight prescription.</p></div>
    </>}
    <p className="mt-6 text-sm leading-7 text-secondary">No single ideal weight exists for everyone. These historical estimates do not account for muscle mass, body composition, or individual health circumstances. They are references, not target weights, medical recommendations, or medication-dosing instructions.</p>
  </section>;
  return <div className="flex min-w-0 flex-col gap-8">{result ? [results, form] : [form, results]}</div>;
}
