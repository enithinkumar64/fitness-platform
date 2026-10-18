"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  GOALS, MACRO_KEYS, calculateGoalMacros, formatMacroAmount, parseNumericInput,
  percentageTotal, validateMacroPercentages, applyNutritionPlan, nutritionPlanPercentages, kcalToKilojoules, NUTRITION_PLANS, PLAN_KEYS,
  type Goal, type MacroErrors, type MacroKey, type GoalMacroResult, type NutritionPlan,
} from "@/lib/calculators/macros";

import { ACTIVITY_LEVELS, calculateTdee, validateMeasurements, cmToImperial, imperialToCm, kgToPounds, poundsToKg, type Activity, type Coefficient, type InputErrors } from "@/lib/calculators/tdee";

type Units = "metric" | "imperial";
const parse = parseNumericInput;
const display = (value: number) => Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
type FormErrors = MacroErrors & InputErrors;
type Draft = Record<MacroKey, string>;
const names: Record<MacroKey, string> = { protein: "Protein", carbohydrates: "Carbs", fat: "Fat" };
const barColors: Record<MacroKey, string> = { protein: "bg-primary", carbohydrates: "bg-secondary", fat: "bg-warning" };
const fieldClass = "mt-2 min-h-control w-full min-w-0 rounded-control border border-border-control bg-background px-3 py-3 text-foreground";
function presetDraft(goal: Goal): Draft {
  const preset = GOALS[goal].percentages;
  return { protein: String(preset.protein), carbohydrates: String(preset.carbohydrates), fat: String(preset.fat) };
}

export function MacroCalculator() {
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
  const [unitError, setUnitError] = useState("");
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [draft, setDraft] = useState<Draft>(presetDraft("maintenance"));
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan>("balanced");
  const [customDirty, setCustomDirty] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<GoalMacroResult | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const percentages = {
    protein: parseNumericInput(draft.protein),
    carbohydrates: parseNumericInput(draft.carbohydrates),
    fat: parseNumericInput(draft.fat),
  };
  const total = percentageTotal(percentages);

  function edited() { setErrors({}); setResult(null); setUnitError(""); }
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

  function changeGoal(next: Goal) {
    setGoal(next);
    setDraft(presetDraft(next));
    setSelectedPlan("balanced");
    setCustomDirty(false);
    setNotice(`${GOALS[next].label} preset applied. The calorie estimate will follow your selected goal.`);
    edited();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const measurements = { age: parse(age), weightKg, heightCm, coefficient, activity };
    const measurementErrors = validateMeasurements(measurements);
    // Reuse macro percentage validation before any energy calculation.
    const percentageErrors = validateMacroPercentages(GOALS[goal].percentages);
    const nextErrors = { ...measurementErrors, ...percentageErrors };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setResult(null);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setDraft(presetDraft(goal));
    setSelectedPlan("balanced");
    setCustomDirty(false);
    setResult(calculateGoalMacros(calculateTdee(measurements), goal, GOALS[goal].percentages));
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  const error = (key: keyof FormErrors) => errors[key] ? <p id={`macro-error-${key}`} className="mt-2 text-sm text-error">{errors[key]}</p> : null;

  const numericProps = (key: keyof InputErrors) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `macro-error-${key}` : undefined });
  const fieldStyle = fieldClass;
  const target = result?.macros ?? null;
  const macroResult = customDirty ? null : target;

  function choosePlan(plan: NutritionPlan) {
    if (!result || plan === selectedPlan) return;
    setSelectedPlan(plan);
    setErrors({});
    setCustomDirty(false);
    if (plan !== "custom") {
      const next = nutritionPlanPercentages(plan, goal, percentages);
      setDraft({ protein: String(next.protein), carbohydrates: String(next.carbohydrates), fat: String(next.fat) });
      setResult(applyNutritionPlan(result, plan, next));
    }
  }
  function applyCustom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateMacroPercentages(percentages);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => customErrorRef.current?.focus());
      return;
    }
    if (result) setResult(applyNutritionPlan(result, "custom", percentages));
    setCustomDirty(false);
  }
  const customErrorRef = useRef<HTMLParagraphElement>(null);

  const measurementForm = (
      <form key="measurements" aria-label="Macro calculator" onSubmit={submit} noValidate className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
        <h2 className="text-heading-4">Your measurements and goal</h2>
        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-semibold">Unit system</legend>
          <div className="flex flex-wrap gap-5">
            {(["metric", "imperial"] as const).map((unit) => <label key={unit} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="units" value={unit} checked={units === unit} onChange={() => switchUnits(unit)} />{unit === "metric" ? "Metric" : "Imperial"}</label>)}
          </div>
          {unitError && <p role="alert" className="mt-2 text-sm text-error">{unitError}</p>}
          <p className="mt-2 text-xs leading-6 text-secondary">Switching units converts your measurements; calculations retain full precision.</p>
        </fieldset>
        {["age", "weightKg", "heightCm", "coefficient", "activity"].some((key) => errors[key as keyof FormErrors]) && <p ref={errorRef} tabIndex={-1} role="alert" className="mt-4 rounded-control text-error">Please correct the highlighted fields.</p>}
        <div className="mt-6 space-y-5">
          <div><label htmlFor="age" className="text-sm font-medium">Age (years)</label><input id="age" type="number" min="18" max="100" step="1" required value={age} onChange={(e) => { setAge(e.target.value); edited(); }} className={fieldStyle} {...numericProps("age")} />{error("age")}</div>
          <div><label htmlFor="coefficient" className="text-sm font-medium">Formula coefficient</label><select id="coefficient" value={coefficient} onChange={(e) => { setCoefficient(e.target.value as Coefficient); edited(); }} className={fieldStyle} aria-describedby="coefficient-help"><option value="male">Male-based (+5)</option><option value="female">Female-based (−161)</option></select><p id="coefficient-help" className="mt-2 text-xs leading-6 text-secondary">A choice between the original equation coefficients, not an assumption about gender identity. Ask a qualified professional if you are unsure which estimate is appropriate.</p></div>
          <div><label htmlFor="weight" className="text-sm font-medium">Weight ({units === "metric" ? "kg" : "lb"})</label><input id="weight" type="number" step="any" required value={weight} onChange={(e) => { const v = e.target.value; setWeight(v); setWeightKg(units === "metric" ? parse(v) : poundsToKg(parse(v))); edited(); }} className={fieldStyle} {...numericProps("weightKg")} />{error("weightKg")}</div>
          {units === "metric" ? <div><label htmlFor="height" className="text-sm font-medium">Height (cm)</label><input id="height" type="number" step="any" required value={height} onChange={(e) => { setHeight(e.target.value); setHeightCm(parse(e.target.value)); edited(); }} className={fieldStyle} {...numericProps("heightCm")} />{error("heightCm")}</div> : <div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="feet" className="text-sm font-medium">Height (feet)</label><input id="feet" type="number" step="1" required value={feet} onChange={(e) => updateImperialHeight(e.target.value, inches)} className={fieldStyle} {...numericProps("heightCm")} /></div><div><label htmlFor="inches" className="text-sm font-medium">Height (inches)</label><input id="inches" type="number" min="0" max="11.999999" step="any" required value={inches} onChange={(e) => updateImperialHeight(feet, e.target.value)} className={fieldStyle} {...numericProps("heightCm")} /></div></div><p className="mt-2 text-xs text-secondary">Use whole feet and inches from 0 up to (but not including) 12.</p>{error("heightCm")}</div>}
          <div><label htmlFor="activity" className="text-sm font-medium">Activity level</label><select id="activity" value={activity} onChange={(e) => { setActivity(e.target.value as Activity); edited(); }} className={`${fieldStyle} text-sm`} >{Object.entries(ACTIVITY_LEVELS).map(([key, item]) => <option key={key} value={key}>{item.label} (×{item.multiplier})</option>)}</select></div>
        </div>
        <p className="mt-5 text-xs leading-6 text-secondary">Supported input ranges: age 18–100, weight 30–300 kg, height 120–230 cm (including converted imperial measurements). These are input limits, not a guarantee of accuracy.</p>
        <fieldset className="mt-6" aria-describedby="macro-goal-help">
          <legend className="text-sm font-semibold">Fitness goal</legend>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {(Object.entries(GOALS) as [Goal, typeof GOALS[Goal]][]).map(([key, item]) => (
              <label key={key} className="flex min-h-control items-center gap-2 text-sm"><input type="radio" name="macro-goal" value={key} checked={goal === key} onChange={() => changeGoal(key)} />{item.label}</label>
            ))}
          </div>
          <p id="macro-goal-help" className="mt-2 text-xs leading-6 text-secondary">Calculating again restores the selected goal&apos;s initial Balanced example. Calories are estimated automatically: maintain weight uses TDEE, gradual fat loss uses TDEE −250, and gradual gain uses TDEE +250 kcal/day. A screened-out loss estimate is withheld.</p>
          <p role="status" className="mt-2 text-sm text-secondary">{notice || "Calculate to see your goal-based split, compare nutrition plans, or customize percentages in the results."}</p>
        </fieldset>
        <button type="submit" className="mt-6 min-h-control w-full rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-active">Calculate macros</button>
      </form>
  );
  const resultsPanel = (
      <section key="results" ref={resultRef} tabIndex={-1} aria-labelledby="macro-results-heading" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
        <p className="font-mono text-xs tracking-widest text-primary">YOUR DAILY BREAKDOWN</p>
        <h2 id="macro-results-heading" className="mt-3 text-heading-3 font-bold">Your Daily Macro Targets</h2>
        <p role="status" className="mt-3 text-sm text-secondary">{result ? (customDirty ? "Percentages changed. Apply a valid allocation to update your targets." : target ? "Calculation complete. Macro estimates are ready." : "No actionable macro target is shown.") : "Enter your measurements and goal, then calculate."}</p>
        {result && <>
          <p className="mt-4 text-sm text-secondary">Fitness goal: {GOALS[goal].label}</p>
          <div role="tablist" aria-label="Nutrition plans" className="mt-6 flex flex-wrap gap-2">
            {PLAN_KEYS.map((plan, index) => <button
              key={plan} ref={(element) => { tabRefs.current[index] = element; }}
              id={`plan-tab-${plan}`} type="button" role="tab" aria-selected={selectedPlan === plan}
              aria-controls="nutrition-plan-panel" tabIndex={selectedPlan === plan ? 0 : -1}
              onClick={() => choosePlan(plan)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight") next = (index + 1) % PLAN_KEYS.length;
                else if (event.key === "ArrowLeft") next = (index - 1 + PLAN_KEYS.length) % PLAN_KEYS.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = PLAN_KEYS.length - 1;
                else return;
                event.preventDefault(); choosePlan(PLAN_KEYS[next]); tabRefs.current[next]?.focus();
              }}
              className={`min-h-control rounded-control border px-4 py-2 text-sm font-semibold ${selectedPlan === plan ? "border-primary bg-primary text-on-primary hover:bg-primary-hover" : "border-border-control bg-background text-foreground hover:bg-surface-hover"}`}
            >{NUTRITION_PLANS[plan].label}</button>)}
          </div>
          <div id="nutrition-plan-panel" role="tabpanel" aria-labelledby={`plan-tab-${selectedPlan}`} tabIndex={0} className="mt-4 rounded-control">
            <p className="text-sm text-secondary">{NUTRITION_PLANS[selectedPlan].description} Plans only change allocation, never calories or your fitness goal. These are illustrative examples, not recommended optimal ratios.</p>
            {selectedPlan === "balanced" && <p className="mt-2 text-sm text-secondary">Goal example: {GOALS[goal].percentages.protein}% protein, {GOALS[goal].percentages.carbohydrates}% carbs, {GOALS[goal].percentages.fat}% fat.</p>}
            {selectedPlan === "custom" && target && <form aria-label="Custom macro percentages" onSubmit={applyCustom} noValidate className="mt-5 rounded-control border border-border bg-background p-4 sm:p-6">
              {Object.keys(errors).length > 0 && <p ref={customErrorRef} role="alert" tabIndex={-1} className="rounded-control text-error">Please correct your macro percentages.</p>}
        <fieldset className="mt-6" aria-describedby={`macro-total${errors.total ? " macro-error-total" : ""}`}>
          <legend className="text-sm font-semibold">Macro percentages</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {MACRO_KEYS.map((key) => <div key={key} className="min-w-0">
              <label htmlFor={`macro-${key}`} className="text-sm font-medium">{names[key]} (%)</label>
              <input id={`macro-${key}`} type="number" min="0" max="100" step="any" required value={draft[key]} onChange={(e) => { const value = e.target.value; setDraft((previous) => ({ ...previous, [key]: value })); setCustomDirty(true); setErrors({}); }} className={fieldClass} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `macro-error-${key}` : undefined} />
              {error(key)}
            </div>)}
          </div>
          <p id="macro-total" role="status" className="mt-4 font-mono text-sm">Total allocation: {Number.isFinite(total) ? `${Number(total.toFixed(6))}%` : "incomplete"} / 100%</p>
          {error("total")}
        </fieldset>

              <button type="submit" className="mt-5 min-h-control rounded-control bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-hover">Apply custom percentages</button>
            </form>}
            {result.reason && <p role="status" className="mt-5 text-sm leading-7 text-warning">{result.reason}</p>}
            {macroResult && <>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {MACRO_KEYS.map((key) => <article key={key} aria-labelledby={`target-${key}`} className="min-w-0 rounded-panel border border-primary/20 bg-background p-5 sm:p-6">
                  <h3 id={`target-${key}`} className="text-heading-5 font-semibold">{names[key]}</h3>
                  <p className="mt-4 break-words font-mono text-3xl font-bold text-primary">{formatMacroAmount(macroResult.macros[key].grams)} <span className="text-sm font-normal text-secondary">g/day</span></p>
                  <p className="mt-3 text-sm text-secondary">{formatMacroAmount(macroResult.macros[key].calories)} kcal/day · {macroResult.percentages[key]}% of calories</p>
                </article>)}
              </div>
              <figure className="mt-7" aria-labelledby="macro-chart-caption">
                <figcaption id="macro-chart-caption" className="text-sm font-medium">Daily macro distribution</figcaption>
                <div aria-hidden="true" className="mt-3 flex h-6 w-full overflow-hidden rounded-full border border-border-control">
                  {MACRO_KEYS.map((key) => <span key={key} className={barColors[key]} style={{ width: `${macroResult.percentages[key]}%` }} />)}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-secondary">{MACRO_KEYS.map((key) => <li key={key}>{names[key]}: {macroResult.percentages[key]}%</li>)}</ul>
              </figure>
            </>}
            {target && <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
              <div><p className="text-sm text-secondary">Estimated daily calorie target</p><p className="mt-2 break-words font-mono text-2xl font-bold">{formatMacroAmount(target.calories)} kcal/day</p></div>
              <p className="font-mono text-sm text-secondary">{formatMacroAmount(kcalToKilojoules(target.calories))} kJ/day</p>
            </div>}
          </div>
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-5 text-sm text-secondary">
            <div><dt>Estimated BMR</dt><dd className="mt-1 font-mono">{formatMacroAmount(result.bmr)} kcal/day</dd></div>
            <div><dt>Estimated maintenance TDEE</dt><dd className="mt-1 font-mono">{formatMacroAmount(result.maintenance)} kcal/day</dd></div>
          </dl>
          <p className="mt-5 text-xs leading-6 text-secondary">Displayed amounts are rounded to one decimal place; small differences in reconstructed calorie totals can occur. 1 kcal = 4.184 kJ.</p>
        </>}
        <p className="mt-6 text-sm leading-7 text-secondary">Educational estimates only. Presets are starting examples, not individualized prescriptions. Goal labels do not guarantee an outcome, and an estimate within the supported range is not automatically safe.</p>
        <p className="mt-4 text-xs leading-6 text-secondary">Gradual loss estimates below 1,500 kcal/day (male-based) or 1,200 (female-based) are withheld using the TDEE calculator&apos;s screening safeguard. These are simplified thresholds, not individualized recommendations. Macro estimates are also limited to 1,200–6,000 kcal/day as a software guardrail.</p>
      </section>
  );
  return <div className="flex min-w-0 flex-col gap-8">{result ? [resultsPanel, measurementForm] : [measurementForm, resultsPanel]}</div>;
}
