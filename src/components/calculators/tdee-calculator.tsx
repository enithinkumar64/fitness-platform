"use client";

import { useRef, useState, type FormEvent } from "react";
import { ACTIVITY_LEVELS, calculateTdee, cmToImperial, imperialToCm, kgToPounds, poundsToKg, validateMeasurements, type Activity, type Coefficient, type InputErrors } from "@/lib/calculators/tdee";

type Units = "metric" | "imperial";
const parse = (value: string) => value.trim() === "" ? NaN : Number(value);
const display = (value: number) => Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
const fieldStyle = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";

export function TdeeCalculator() {
  const [units, setUnits] = useState<Units>("metric");
  const [age, setAge] = useState("");
  const [coefficient, setCoefficient] = useState<Coefficient>("male");
  const [activity, setActivity] = useState<Activity>("sedentary");
  const [weightKg, setWeightKg] = useState(NaN);
  const [heightCm, setHeightCm] = useState(NaN);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [errors, setErrors] = useState<InputErrors>({});
  const [unitError, setUnitError] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateTdee> | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  function edited() { setResult(null); setErrors({}); setUnitError(""); }
  function switchUnits(next: Units) {
    if (next === units) return;
    // Never silently discard an incomplete measurement during a unit change.
    if ((weight !== "" && !Number.isFinite(weightKg)) ||
        ((height !== "" || feet !== "" || inches !== "") && !Number.isFinite(heightCm))) {
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
    const input = { age: parse(age), weightKg, heightCm, coefficient, activity };
    const nextErrors = validateMeasurements(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setResult(null);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setResult(calculateTdee(input));
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  const error = (key: keyof InputErrors) => errors[key] ? <p id={`error-${key}`} className="mt-2 text-sm text-error">{errors[key]}</p> : null;
  const numericProps = (key: keyof InputErrors) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `error-${key}` : undefined });
  const kcal = (value: number) => `${Math.round(value)} kcal/day`;

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-2">
      <form onSubmit={submit} noValidate className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8" aria-label="TDEE calculator">
        <h2 className="text-heading-4">Your daily energy estimate</h2>
        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-semibold">Unit system</legend>
          <div className="flex flex-wrap gap-5">
            {(["metric", "imperial"] as const).map((unit) => <label key={unit} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="units" value={unit} checked={units === unit} onChange={() => switchUnits(unit)} />{unit === "metric" ? "Metric" : "Imperial"}</label>)}
          </div>
          {unitError && <p role="alert" className="mt-2 text-sm text-error">{unitError}</p>}
          <p className="mt-2 text-xs leading-6 text-secondary">Switching units converts your measurements; calculations retain full precision.</p>
        </fieldset>
        {Object.keys(errors).length > 0 && <p ref={errorRef} tabIndex={-1} role="alert" className="mt-4 rounded-control text-error">Please correct the highlighted fields.</p>}
        <div className="mt-6 space-y-5">
          <div><label htmlFor="age" className="text-sm font-medium">Age (years)</label><input id="age" type="number" min="18" max="100" step="1" required value={age} onChange={(e) => { setAge(e.target.value); edited(); }} className={fieldStyle} {...numericProps("age")} />{error("age")}</div>
          <div><label htmlFor="coefficient" className="text-sm font-medium">Formula coefficient</label><select id="coefficient" value={coefficient} onChange={(e) => { setCoefficient(e.target.value as Coefficient); edited(); }} className={fieldStyle} aria-describedby="coefficient-help"><option value="male">Male-based (+5)</option><option value="female">Female-based (−161)</option></select><p id="coefficient-help" className="mt-2 text-xs leading-6 text-secondary">A choice between the original equation coefficients, not an assumption about gender identity. Ask a qualified professional if you are unsure which estimate is appropriate.</p></div>
          <div><label htmlFor="weight" className="text-sm font-medium">Weight ({units === "metric" ? "kg" : "lb"})</label><input id="weight" type="number" step="any" required value={weight} onChange={(e) => { const v = e.target.value; setWeight(v); setWeightKg(units === "metric" ? parse(v) : poundsToKg(parse(v))); edited(); }} className={fieldStyle} {...numericProps("weightKg")} />{error("weightKg")}</div>
          {units === "metric" ? <div><label htmlFor="height" className="text-sm font-medium">Height (cm)</label><input id="height" type="number" step="any" required value={height} onChange={(e) => { setHeight(e.target.value); setHeightCm(parse(e.target.value)); edited(); }} className={fieldStyle} {...numericProps("heightCm")} />{error("heightCm")}</div> : <div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="feet" className="text-sm font-medium">Height (feet)</label><input id="feet" type="number" step="1" required value={feet} onChange={(e) => updateImperialHeight(e.target.value, inches)} className={fieldStyle} {...numericProps("heightCm")} /></div><div><label htmlFor="inches" className="text-sm font-medium">Height (inches)</label><input id="inches" type="number" min="0" max="11.999999" step="any" required value={inches} onChange={(e) => updateImperialHeight(feet, e.target.value)} className={fieldStyle} {...numericProps("heightCm")} /></div></div><p className="mt-2 text-xs text-secondary">Use whole feet and inches from 0 up to (but not including) 12.</p>{error("heightCm")}</div>}
          <div><label htmlFor="activity" className="text-sm font-medium">Activity level</label><select id="activity" value={activity} onChange={(e) => { setActivity(e.target.value as Activity); edited(); }} className={`${fieldStyle} text-sm`} >{Object.entries(ACTIVITY_LEVELS).map(([key, item]) => <option key={key} value={key}>{item.label} (×{item.multiplier})</option>)}</select></div>
        </div>
        <p className="mt-5 text-xs leading-6 text-secondary">Supported input ranges: age 18–100, weight 30–300 kg, height 120–230 cm (including converted imperial measurements). These are input limits, not a guarantee of accuracy.</p>
        <button type="submit" className="mt-6 min-h-control w-full rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-active">Calculate daily calories</button>
      </form>
      <section ref={resultRef} tabIndex={-1} aria-labelledby="results-heading" className="min-w-0 self-start rounded-panel border border-border bg-surface p-5 sm:p-8">
        <h2 id="results-heading" className="text-heading-4">Your estimates</h2>
        <p role="status" className="mt-2 text-sm text-secondary">{result ? "Calculation complete. Daily calorie estimates are ready." : "Enter your measurements and calculate to see your estimates."}</p>
        {result && <>
          <dl className="mt-6"><div className="rounded-control border border-primary/30 bg-background p-5"><dt className="text-sm text-secondary">Maintenance calories (TDEE)</dt><dd className="mt-2 break-words font-mono text-3xl font-bold text-primary">{kcal(result.maintenance)}</dd></div><div className="mt-4 flex flex-wrap justify-between gap-2 border-b border-border pb-4"><dt>BMR</dt><dd className="font-mono">{kcal(result.bmr)}</dd></div></dl>
          <h3 className="mt-6 text-heading-5">Weight-goal estimates</h3>
          <p className="mt-2 text-sm leading-6 text-secondary">Illustrative adjustments, not a prescription. A deficit is not appropriate for everyone; discuss your goals with a qualified professional.</p>
          <dl className="mt-4 space-y-4">{([
            ["Gradual weight loss (−250)", result.gradualLoss], ["Moderate weight loss (−500)", result.moderateLoss],
            ["Gradual weight gain (+250)", result.gradualGain], ["Moderate weight gain (+500)", result.moderateGain],
          ] as const).map(([label, value]) => <div key={label} className="border-b border-border pb-3"><dt className="text-sm text-secondary">{label}</dt><dd className={`mt-1 ${value === null ? "text-sm text-warning" : "font-mono"}`}>{value === null ? "Below the screening threshold — consult a qualified professional. No calorie target shown." : kcal(value)}</dd></div>)}</dl>
        </>}
        <p className="mt-6 text-xs leading-6 text-secondary">Loss estimates below 1,200 kcal/day for the female-based equation or 1,500 for the male-based equation are withheld. These simplified screening safeguards are not individualized medical recommendations; values above them are not automatically suitable.</p>
      </section>
    </div>
  );
}
