"use client";

import { useRef, useState, type FormEvent } from "react";
import { BMI_CATEGORIES, BMI_SCALE_MIN, BMI_SCALE_MAX, bmiMarker, calculateBmi, validateBmiMeasurements, type BmiErrors, type BmiResult } from "@/lib/calculators/bmi";
import { cmToImperial, imperialToCm, kgToPounds, poundsToKg } from "@/lib/calculators/tdee";

type Units = "metric" | "imperial";
const parse = (value: string) => value.trim() === "" ? NaN : Number(value);
const display = (value: number) => Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
const fieldStyle = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";
const scaleColors = ["bg-secondary", "bg-success", "bg-warning", "bg-error/60", "bg-error/80", "bg-error"];
const scaleTicks = [10, 18.5, 25, 30, 35, 40, 45];

function BmiScale({ result }: { result: BmiResult }) {
  const marker = bmiMarker(result.bmi);
  return <figure className="mt-8" aria-labelledby="bmi-scale-caption">
    <figcaption id="bmi-scale-caption" className="text-sm font-semibold">Adult BMI category scale</figcaption>
    <div role="img" aria-label={`BMI ${result.bmi.toFixed(2)}: ${result.category}. Linear visual scale from 10 to 45.${marker.overflow ? ` Result is ${marker.overflow} the visual scale; marker is at the edge.` : ""}`} className="mx-2 mt-6 pb-8">
      <div className="relative">
        <div aria-hidden="true" className="flex h-4 overflow-hidden rounded-full">{BMI_CATEGORIES.map((category, index) => {
          const lower = index === 0 ? BMI_SCALE_MIN : BMI_CATEGORIES[index - 1].upper;
          const upper = Math.min(category.upper, BMI_SCALE_MAX);
          return <div key={category.label} className={scaleColors[index]} style={{ width: `${(upper - lower) / (BMI_SCALE_MAX - BMI_SCALE_MIN) * 100}%` }} />;
        })}</div>
        <span data-testid="bmi-marker" aria-hidden="true" style={{ left: `${marker.percent}%` }} className="absolute -top-2 h-8 w-1 -translate-x-1/2 rounded-full border border-background bg-foreground" />
        <div aria-hidden="true">{scaleTicks.map((tick, index) => <span key={tick} style={{ left: `${(tick - BMI_SCALE_MIN) / (BMI_SCALE_MAX - BMI_SCALE_MIN) * 100}%`, transform: index === 0 ? "none" : index === scaleTicks.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }} className="absolute top-6 font-mono text-[10px] text-secondary">{tick}</span>)}</div>
      </div>
    </div>
    <p className="text-xs leading-6 text-secondary">The scale displays BMI 10–45, with proportional category widths. {marker.overflow ? `Your BMI is ${marker.overflow} this visual range; the marker stays at the edge, not at your exact value.` : "The marker shows your unrounded BMI."}</p>
    <ul aria-label="Adult BMI classifications" className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">{BMI_CATEGORIES.map((category, index) => <li key={category.label} className="flex items-start gap-2"><span aria-hidden="true" className={`mt-1 h-2 w-2 shrink-0 rounded-full ${scaleColors[index]}`} /><span><span className="font-semibold text-foreground">{category.label}</span><span className="block text-secondary">{category.interval}</span></span></li>)}</ul>
  </figure>;
}

export function BmiCalculator() {
  const [units, setUnits] = useState<Units>("metric");
  const [age, setAge] = useState("");
  // Canonical measurements are never overwritten by rounded unit displays.
  const [weightKg, setWeightKg] = useState(NaN);
  const [heightCm, setHeightCm] = useState(NaN);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [errors, setErrors] = useState<BmiErrors>({});
  const [unitError, setUnitError] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);

  function edited() { setResult(null); setErrors({}); setUnitError(""); }
  function switchUnits(next: Units) {
    if (next === units) return;
    if ((weight !== "" && !Number.isFinite(weightKg)) || ((height !== "" || feet !== "" || inches !== "") && !Number.isFinite(heightCm))) {
      setUnitError("Complete or clear your measurements before switching units.");
      return;
    }
    setUnitError("");
    setWeight(display(next === "metric" ? weightKg : kgToPounds(weightKg)));
    if (next === "metric") { setHeight(display(heightCm)); setFeet(""); setInches(""); }
    else if (Number.isFinite(heightCm)) {
      const converted = cmToImperial(heightCm);
      const roundedInches = display(converted.inches);
      setFeet(String(converted.feet + (roundedInches === "12" ? 1 : 0)));
      setInches(roundedInches === "12" ? "0" : roundedInches);
    } else { setFeet(""); setInches(""); }
    if (next === "imperial") setHeight("");
    setUnits(next);
  }
  function updateImperialHeight(nextFeet: string, nextInches: string) {
    setFeet(nextFeet); setInches(nextInches);
    const f = parse(nextFeet), i = parse(nextInches);
    setHeightCm(Number.isInteger(f) && f >= 0 && i >= 0 && i < 12 ? imperialToCm(f, i) : NaN);
    edited();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { age: parse(age), weightKg, heightCm };
    const nextErrors = validateBmiMeasurements(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setResult(null);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setResult(calculateBmi(input));
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function reset() {
    setUnits("metric"); setAge(""); setWeight(""); setHeight(""); setFeet(""); setInches("");
    setWeightKg(NaN); setHeightCm(NaN); edited();
    requestAnimationFrame(() => ageRef.current?.focus());
  }
  const error = (key: keyof BmiErrors) => errors[key] ? <p id={`bmi-error-${key}`} className="mt-2 text-sm text-error">{errors[key]}</p> : null;
  const numericProps = (key: keyof BmiErrors) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `bmi-error-${key}` : undefined });
  const referenceWeight = (kg: number) => `${(units === "metric" ? kg : kgToPounds(kg)).toFixed(2)} ${units === "metric" ? "kg" : "lb"}`;

  const form = <form key="measurements" onSubmit={submit} noValidate aria-label="BMI calculator" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 className="text-heading-4">Your measurements</h2>
    <fieldset className="mt-6">
      <legend className="text-sm font-semibold">Unit system</legend>
      <div className="mt-2 flex flex-wrap gap-5">{(["metric", "imperial"] as const).map((unit) => <label key={unit} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="bmi-units" checked={units === unit} onChange={() => switchUnits(unit)} />{unit === "metric" ? "Metric" : "Imperial"}</label>)}</div>
      <p className="mt-2 text-xs leading-6 text-secondary">Unit changes convert your measurements while retaining full calculation precision.</p>
      {unitError && <p role="alert" className="mt-2 text-sm text-error">{unitError}</p>}
    </fieldset>
    {Object.keys(errors).length > 0 && <p ref={errorRef} tabIndex={-1} role="alert" className="mt-4 rounded-control text-error">Please correct the highlighted fields.</p>}
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <div><label htmlFor="bmi-age" className="text-sm font-medium">Age (years)</label><input ref={ageRef} id="bmi-age" type="number" min="20" max="100" step="1" required value={age} onChange={(e) => { setAge(e.target.value); edited(); }} className={fieldStyle} {...numericProps("age")} />{error("age")}</div>
      <div><label htmlFor="bmi-weight" className="text-sm font-medium">Weight ({units === "metric" ? "kg" : "lb"})</label><input id="bmi-weight" type="number" step="any" required value={weight} onChange={(e) => { const value = e.target.value; setWeight(value); setWeightKg(units === "metric" ? parse(value) : poundsToKg(parse(value))); edited(); }} className={fieldStyle} {...numericProps("weightKg")} />{error("weightKg")}</div>
      {units === "metric" ? <div><label htmlFor="bmi-height" className="text-sm font-medium">Height (cm)</label><input id="bmi-height" type="number" step="any" required value={height} onChange={(e) => { setHeight(e.target.value); setHeightCm(parse(e.target.value)); edited(); }} className={fieldStyle} {...numericProps("heightCm")} />{error("heightCm")}</div> : <div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="bmi-feet" className="text-sm font-medium">Height (feet)</label><input id="bmi-feet" type="number" step="1" required value={feet} onChange={(e) => updateImperialHeight(e.target.value, inches)} className={fieldStyle} {...numericProps("heightCm")} /></div><div><label htmlFor="bmi-inches" className="text-sm font-medium">Height (inches)</label><input id="bmi-inches" type="number" min="0" max="11.999999" step="any" required value={inches} onChange={(e) => updateImperialHeight(feet, e.target.value)} className={fieldStyle} {...numericProps("heightCm")} /></div></div><p className="mt-2 text-xs text-secondary">Use whole feet and inches from 0 up to (but not including) 12.</p>{error("heightCm")}</div>}
    </div>
    <p className="mt-5 text-xs leading-6 text-secondary">Supported inputs: whole-number age 20–100, weight 20–400 kg, height 100–250 cm, including converted imperial measurements. These are software limits, not health recommendations. Adult BMI uses no sex-based coefficient; age only checks eligibility.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-active">Calculate BMI</button><button type="button" onClick={reset} className="min-h-control rounded-control border border-border-control px-5 py-3 text-foreground hover:bg-surface-hover">Reset</button></div>
  </form>;

  const results = <section key="results" ref={resultRef} tabIndex={-1} aria-labelledby="bmi-results-heading" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 id="bmi-results-heading" className="text-heading-4">Your BMI results</h2>
    <p role="status" className="mt-2 text-sm text-secondary">{result ? "Calculation complete. Your BMI results are ready." : "Enter your measurements and calculate to see your results."}</p>
    {result && <>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-control border border-primary/30 bg-background p-5"><div><p className="text-sm text-secondary">Body mass index</p><p className="mt-2 font-mono text-5xl font-bold text-primary"><span data-testid="bmi-value">{result.bmi.toFixed(2)}</span><span className="ml-2 text-sm text-secondary">kg/m²</span></p></div><p className="rounded-control border border-border px-3 py-2 font-semibold">{result.category}</p></div>
      <p className="mt-3 text-xs leading-6 text-secondary">Values are rounded for display. Classification uses the full, unrounded BMI; a rounded number can appear on an adjacent category boundary. “Normal” is the reference category label, not a judgment of your health.</p>
      <BmiScale result={result} />
      <dl className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
        <div><dt className="text-sm text-secondary">Adult reference BMI interval</dt><dd className="mt-2 font-mono">18.5 to below 25 kg/m²</dd></div>
        <div><dt className="text-sm text-secondary">Height-based reference-weight interval</dt><dd className="mt-2 text-sm"><span className="block">Lower boundary (inclusive): <span className="font-mono">{referenceWeight(result.referenceWeightKg.lower)}</span></span><span className="mt-1 block">Upper boundary (exclusive): <span className="font-mono">{referenceWeight(result.referenceWeightKg.upper)}</span></span></dd></div>
        <div><dt className="text-sm text-secondary">BMI Prime</dt><dd className="mt-2 font-mono">{result.prime.toFixed(2)}</dd></div>
        <div><dt className="text-sm text-secondary">Ponderal Index</dt><dd className="mt-2 font-mono">{result.ponderalIndex.toFixed(2)} kg/m³</dd></div>
      </dl>
      <p className="mt-5 text-xs leading-6 text-secondary">The weight boundaries come from BMI 18.5 × height² and 25 × height², rounded here to two decimals. The exact upper boundary is excluded. This is a mathematical reference interval, not an individualized healthy-weight recommendation.</p>
    </>}
    <p className="mt-6 text-sm leading-7 text-secondary">BMI is a screening measure, not a diagnosis or a direct measure of body fat. It cannot determine your health on its own. Discuss concerns with a qualified healthcare professional.</p>
  </section>;
  // Results precede the form in both visual and DOM order after submission.
  return <div className="flex min-w-0 flex-col gap-8">{result ? [results, form] : [form, results]}</div>;
}
