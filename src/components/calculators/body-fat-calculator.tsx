"use client";

import { useRef, useState, type FormEvent } from "react";
import { calculateBodyFat, validateBodyFatInput, type BodyFatErrors, type BodyFatResult } from "@/lib/calculators/body-fat";
import { INCH_TO_CM, cmToImperial, imperialToCm, kgToPounds, poundsToKg, type Coefficient } from "@/lib/calculators/tdee";

type Units = "metric" | "imperial";
type Measurement = "weightKg" | "heightCm" | "neckCm" | "waistCm" | "hipCm";
type Field = "weight" | "height" | "feet" | "inches" | "neck" | "waist" | "hip";
const emptyFields: Record<Field, string> = { weight: "", height: "", feet: "", inches: "", neck: "", waist: "", hip: "" };
const emptyMeasurements: Record<Measurement, number> = { weightKg: NaN, heightCm: NaN, neckCm: NaN, waistCm: NaN, hipCm: NaN };
const parse = (value: string) => value.trim() === "" ? NaN : Number(value);
const display = (value: number) => Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
const fieldStyle = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";
const circumferenceFields = [["neck", "neckCm", "Neck"], ["waist", "waistCm", "Waist"], ["hip", "hipCm", "Hip"]] as const;

export function BodyFatCalculator() {
  const [units, setUnits] = useState<Units>("metric");
  const [age, setAge] = useState("");
  const [coefficient, setCoefficient] = useState<Coefficient>("male");
  const [fields, setFields] = useState(emptyFields);
  const [measurements, setMeasurements] = useState(emptyMeasurements);
  const [errors, setErrors] = useState<BodyFatErrors>({});
  const [unitError, setUnitError] = useState("");
  const [result, setResult] = useState<BodyFatResult | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);

  function edited() { setResult(null); setErrors({}); setUnitError(""); }
  function update(field: Field, measurement: Measurement, value: string) {
    setFields((previous) => ({ ...previous, [field]: value }));
    const number = parse(value);
    const converted = units === "metric" ? number : measurement === "weightKg" ? poundsToKg(number) : number * INCH_TO_CM;
    setMeasurements((previous) => ({ ...previous, [measurement]: converted }));
    edited();
  }
  function updateImperialHeight(field: "feet" | "inches", value: string) {
    const next = { ...fields, [field]: value };
    setFields(next);
    const feet = parse(next.feet), inches = parse(next.inches);
    setMeasurements((previous) => ({ ...previous, heightCm: Number.isInteger(feet) && feet >= 0 && inches >= 0 && inches < 12 ? imperialToCm(feet, inches) : NaN }));
    edited();
  }
  function switchUnits(next: Units) {
    if (next === units) return;
    const incomplete = ([ ["weight", "weightKg"], ["neck", "neckCm"], ["waist", "waistCm"], ["hip", "hipCm"] ] as const).some(([field, key]) => fields[field] !== "" && !Number.isFinite(measurements[key]));
    if (incomplete || ((fields.height !== "" || fields.feet !== "" || fields.inches !== "") && !Number.isFinite(measurements.heightCm))) {
      setUnitError("Complete or clear your measurements before switching units."); return;
    }
    const converted = { ...emptyFields, weight: display(next === "metric" ? measurements.weightKg : kgToPounds(measurements.weightKg)) };
    for (const [field, key] of circumferenceFields) converted[field] = display(next === "metric" ? measurements[key] : measurements[key] / INCH_TO_CM);
    if (next === "metric") converted.height = display(measurements.heightCm);
    else if (Number.isFinite(measurements.heightCm)) {
      const height = cmToImperial(measurements.heightCm);
      const rounded = display(height.inches);
      converted.feet = String(height.feet + (rounded === "12" ? 1 : 0));
      converted.inches = rounded === "12" ? "0" : rounded;
    }
    // Conversion changes display strings only, retaining canonical precision and results.
    setFields(converted); setUnits(next); setUnitError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { ...measurements, age: parse(age), coefficient };
    const nextErrors = validateBodyFatInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setResult(null); requestAnimationFrame(() => errorRef.current?.focus()); return; }
    setResult(calculateBodyFat(input));
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function reset() {
    setUnits("metric"); setAge(""); setCoefficient("male"); setFields(emptyFields); setMeasurements(emptyMeasurements); edited();
    requestAnimationFrame(() => ageRef.current?.focus());
  }
  function error(key: keyof BodyFatErrors) { return errors[key] ? <p id={`bf-error-${key}`} className="mt-2 text-sm text-error">{errors[key]}</p> : null; }
  function numericProps(key: keyof BodyFatErrors, hint?: string) {
    const domainError = !!errors.formula && ["neckCm", "waistCm", "hipCm"].includes(key);
    return { "aria-invalid": !!errors[key] || domainError, "aria-describedby": [hint, errors[key] ? `bf-error-${key}` : ""].filter(Boolean).join(" ") || undefined };
  }
  const mass = (kg: number) => `${(units === "metric" ? kg : kgToPounds(kg)).toFixed(1)} ${units === "metric" ? "kg" : "lb"}`;

  const form = <form key="form" aria-label="Body fat calculator" onSubmit={submit} noValidate className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 className="text-heading-4">Your measurements</h2>
    <fieldset className="mt-6"><legend className="text-sm font-semibold">Unit system</legend><div className="mt-2 flex flex-wrap gap-5">{(["metric", "imperial"] as const).map((unit) => <label key={unit} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="bf-units" checked={units === unit} onChange={() => switchUnits(unit)} />{unit === "metric" ? "Metric" : "Imperial"}</label>)}</div><p className="mt-2 text-xs leading-6 text-secondary">Switching units converts measurements without rounding the values used in calculations. Circumferences use cm or inches; imperial height uses feet and inches.</p>{unitError && <p role="alert" className="mt-2 text-sm text-error">{unitError}</p>}</fieldset>
    {Object.keys(errors).length > 0 && <p ref={errorRef} role="alert" tabIndex={-1} className="mt-4 rounded-control text-error">Please correct the highlighted fields.{errors.formula && <span id="bf-error-formula" className="mt-2 block">{errors.formula}</span>}</p>}
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <div><label htmlFor="bf-age" className="text-sm font-medium">Age (years)</label><input ref={ageRef} id="bf-age" type="number" min="20" max="100" step="1" required value={age} onChange={(e) => { setAge(e.target.value); edited(); }} className={fieldStyle} {...numericProps("age")} />{error("age")}</div>
      <div><label htmlFor="bf-coefficient" className="text-sm font-medium">Equation coefficient set</label><select id="bf-coefficient" value={coefficient} onChange={(e) => { setCoefficient(e.target.value as Coefficient); edited(); }} className={fieldStyle} aria-describedby="bf-coefficient-help"><option value="male">Male-based equation</option><option value="female">Female-based equation</option></select><p id="bf-coefficient-help" className="mt-2 text-xs leading-6 text-secondary">These are the coefficient sets in the published methods, not a determination of gender identity. Ask a qualified professional if you are unsure which method fits your circumstances.</p></div>
      <div><label htmlFor="bf-weight" className="text-sm font-medium">Weight ({units === "metric" ? "kg" : "lb"})</label><input id="bf-weight" type="number" step="any" required value={fields.weight} onChange={(e) => update("weight", "weightKg", e.target.value)} className={fieldStyle} {...numericProps("weightKg")} />{error("weightKg")}</div>
      {units === "metric" ? <div><label htmlFor="bf-height" className="text-sm font-medium">Height (cm)</label><input id="bf-height" type="number" step="any" required value={fields.height} onChange={(e) => update("height", "heightCm", e.target.value)} className={fieldStyle} {...numericProps("heightCm")} />{error("heightCm")}</div> : <div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="bf-feet" className="text-sm font-medium">Height (feet)</label><input id="bf-feet" type="number" step="1" required value={fields.feet} onChange={(e) => updateImperialHeight("feet", e.target.value)} className={fieldStyle} {...numericProps("heightCm", "bf-height-help")} /></div><div><label htmlFor="bf-inches" className="text-sm font-medium">Height (inches)</label><input id="bf-inches" type="number" step="any" min="0" max="11.999999" required value={fields.inches} onChange={(e) => updateImperialHeight("inches", e.target.value)} className={fieldStyle} {...numericProps("heightCm", "bf-height-help")} /></div></div><p id="bf-height-help" className="mt-2 text-xs text-secondary">Whole feet; inches from 0 up to, but not including, 12.</p>{error("heightCm")}</div>}
      {circumferenceFields.filter(([field]) => field !== "hip" || coefficient === "female").map(([field, key, label]) => <div key={field}><label htmlFor={`bf-${field}`} className="text-sm font-medium">{label} circumference ({units === "metric" ? "cm" : "in"})</label><input id={`bf-${field}`} type="number" step="any" required value={fields[field]} onChange={(e) => update(field, key, e.target.value)} className={fieldStyle} {...numericProps(key, `bf-${field}-help`)} aria-describedby={[`bf-${field}-help`, errors[key] && `bf-error-${key}`, errors.formula && "bf-error-formula"].filter(Boolean).join(" ")} /><p id={`bf-${field}-help`} className="mt-2 text-xs leading-6 text-secondary">{field === "neck" ? "Measure just below the larynx, avoiding the prominence, with the tape slightly lower at the front. Relax your shoulders." : field === "waist" ? coefficient === "male" ? "Measure around the abdomen at navel level after a normal exhale, without drawing in your stomach." : "Measure around the narrowest part of the torso after a normal exhale, without drawing in your stomach." : "Measure horizontally around the widest part of the buttocks."}</p>{error(key)}</div>)}
    </div>
    <p className="mt-5 text-xs leading-6 text-secondary">Use a flexible, non-stretch tape against the skin without compressing it. Repeat at the same sites and under similar conditions. Supported software inputs: whole-number ages 20–100; weight 20–400 kg; height 100–250 cm; neck 20–80 cm; waist 30–250 cm; hips 40–250 cm, including converted imperial values. These bounds do not establish accuracy.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-active">Calculate body fat</button><button type="button" onClick={reset} className="min-h-control rounded-control border border-border-control px-5 py-3 text-foreground hover:bg-surface-hover">Reset</button></div>
  </form>;

  const results = <section key="results" ref={resultRef} tabIndex={-1} aria-labelledby="bf-results-heading" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
    <h2 id="bf-results-heading" className="text-heading-4">Your body fat estimates</h2>
    <p role="status" className="mt-2 text-sm text-secondary">{result ? "Calculation complete. Review the estimates and any method warnings below." : "Enter your measurements and calculate to see your estimates."}</p>
    {result && <>
      <div className="mt-6 rounded-control border border-primary/30 bg-background p-5"><p className="text-sm text-secondary">U.S. Navy circumference method</p>{result.navy.percentage === null ? <p className="mt-3 font-semibold text-warning">Navy estimate withheld</p> : <p className="mt-3 font-mono text-5xl font-bold text-primary" data-testid="navy-percentage">{result.navy.percentage.toFixed(1)}<span className="text-2xl">%</span></p>}</div>
      {result.navy.warning && <p className="mt-4 text-sm leading-7 text-warning">{result.navy.warning}</p>}
      {result.navy.percentage !== null && result.fatMassKg !== null && result.fatFreeMassKg !== null && <>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2"><div><dt className="text-sm text-secondary">Estimated fat mass</dt><dd className="mt-2 font-mono text-2xl" data-testid="fat-mass">{mass(result.fatMassKg)}</dd></div><div><dt className="text-sm text-secondary">Estimated fat-free mass</dt><dd className="mt-2 font-mono text-2xl" data-testid="fat-free-mass">{mass(result.fatFreeMassKg)}</dd></div></dl>
        <figure className="mt-6" aria-labelledby="bf-chart-caption"><figcaption id="bf-chart-caption" className="text-sm font-semibold">Estimated mass distribution · Navy method</figcaption><div role="img" aria-label={`Estimated fat ${result.navy.percentage.toFixed(1)} percent; fat-free mass ${(100 - result.navy.percentage).toFixed(1)} percent.`} className="mt-4 flex h-5 overflow-hidden rounded-full border border-border-control"><span aria-hidden="true" data-testid="fat-segment" className="bg-primary" style={{ width: `${result.navy.percentage}%` }} /><span aria-hidden="true" className="bg-secondary" style={{ width: `${100 - result.navy.percentage}%` }} /></div><div className="mt-3 flex flex-wrap justify-between gap-3 text-sm"><span>Fat: {result.navy.percentage.toFixed(1)}% · {mass(result.fatMassKg)}</span><span>Fat-free: {(100 - result.navy.percentage).toFixed(1)}% · {mass(result.fatFreeMassKg)}</span></div></figure>
        <p className="mt-3 text-xs leading-6 text-secondary">Fat-free mass includes muscle, water, bone, and organs; it is not a muscle-mass measurement.</p>
      </>}
      <div className="mt-8 border-t border-border pt-6"><h3 className="text-heading-5">Separate BMI-based comparison</h3><p className="mt-2 text-sm text-secondary">Deurenberg adult estimate, using BMI {result.bmi.toFixed(2)}, age, and the selected coefficient set.</p>{result.bmiComparison.percentage === null ? <p className="mt-3 font-semibold text-warning">BMI-based estimate withheld</p> : <p className="mt-3 font-mono text-2xl" data-testid="bmi-percentage">{result.bmiComparison.percentage.toFixed(1)}%</p>}{result.bmiComparison.warning && <p className="mt-3 text-sm leading-7 text-warning">{result.bmiComparison.warning}</p>}<p className="mt-3 text-sm leading-7 text-secondary">The two methods use different predictors and can disagree. Neither is a definitive body fat measurement. Values are rounded for display only.</p></div>
    </>}
    <p className="mt-6 text-sm leading-7 text-secondary">Educational estimates, not a diagnosis or an individualized body fat target. Measurement technique, body composition, age, and population differences affect accuracy. Seek qualified guidance for personal interpretation.</p>
  </section>;
  return <div className="flex min-w-0 flex-col gap-8">{result ? [results, form] : [form, results]}</div>;
}
