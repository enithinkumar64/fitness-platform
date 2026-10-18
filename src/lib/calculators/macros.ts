import type { calculateTdee } from "./tdee";

export type Goal = "maintenance" | "fat-loss" | "muscle-gain";
export type MacroKey = "protein" | "carbohydrates" | "fat";
export type Percentages = Record<MacroKey, number>;
export const MACRO_KEYS: MacroKey[] = ["protein", "carbohydrates", "fat"];
export const GOALS: Record<Goal, { label: string; percentages: Percentages }> = {
  maintenance: { label: "Maintain weight", percentages: { protein: 25, carbohydrates: 50, fat: 25 } },
  "fat-loss": { label: "Gradual fat loss", percentages: { protein: 30, carbohydrates: 40, fat: 30 } },
  "muscle-gain": { label: "Gradual weight gain / muscle-building support", percentages: { protein: 30, carbohydrates: 45, fat: 25 } },
};
export const KCAL_PER_GRAM: Record<MacroKey, number> = { protein: 4, carbohydrates: 4, fat: 9 };
export const CALORIE_MIN = 1200;
export const CALORIE_MAX = 6000;
// Percentage points: numerical noise only, not a license to under/overallocate.
export const PERCENT_TOLERANCE = 0.000001;
export type MacroInput = { calories: number; goal: Goal; percentages: Percentages };
export type MacroErrors = Partial<Record<"calories" | "goal" | "total" | MacroKey, string>>;
export type MacroResult = {
  calories: number;
  goal: Goal;
  percentages: Percentages;
  macros: Record<MacroKey, { grams: number; calories: number }>;
};
export function validCalories(value: number): boolean {
  return Number.isFinite(value) && value >= CALORIE_MIN && value <= CALORIE_MAX;
}
export function parseNumericInput(value: string): number {
  return value.trim() === "" ? NaN : Number(value);
}
export function percentageTotal(percentages: Percentages): number {
  return MACRO_KEYS.reduce((sum, key) => sum + percentages[key], 0);
}
export function validateMacroPercentages(percentages: Percentages): MacroErrors {
  const errors: MacroErrors = {};
  for (const key of MACRO_KEYS) {
    if (!Number.isFinite(percentages[key]) || percentages[key] < 0 || percentages[key] > 100)
      errors[key] = "Enter a percentage from 0 to 100.";
  }
  if (MACRO_KEYS.some((key) => errors[key]) || Math.abs(percentageTotal(percentages) - 100) > PERCENT_TOLERANCE)
    errors.total = "Protein, carbohydrates, and fat must total 100%. Percentages are not changed automatically.";
  return errors;
}
export function validateMacroInput(input: MacroInput): MacroErrors {
  const errors = validateMacroPercentages(input.percentages);
  if (!validCalories(input.calories)) errors.calories = "Enter a daily calorie target from 1,200 to 6,000 kcal.";
  if (!Object.hasOwn(GOALS, input.goal)) errors.goal = "Choose a listed goal.";
  return errors;
}
export function calculateMacros(input: MacroInput): MacroResult {
  if (Object.keys(validateMacroInput(input)).length) throw new RangeError("Invalid macro calculator inputs.");
  const allocate = (key: MacroKey) => {
    const calories = input.calories * input.percentages[key] / 100;
    return { calories, grams: calories / KCAL_PER_GRAM[key] };
  };
  return {
    calories: input.calories, goal: input.goal, percentages: { ...input.percentages },
    macros: { protein: allocate("protein"), carbohydrates: allocate("carbohydrates"), fat: allocate("fat") },
  };
}
export const formatMacroAmount = (value: number): string => value.toFixed(1);

export type GoalMacroResult = {
  bmr: number;
  maintenance: number;
  macros: MacroResult | null;
  reason: string | null;
};

// Accept the validated TDEE result; do not repeat its formulas or safeguards.
export function calculateGoalMacros(energy: ReturnType<typeof calculateTdee>, goal: Goal, percentages: Percentages): GoalMacroResult {
  const errors = validateMacroPercentages(percentages);
  if (!Object.hasOwn(GOALS, goal) || Object.keys(errors).length || !Number.isFinite(energy.bmr) || !Number.isFinite(energy.maintenance) || energy.bmr <= 0 || energy.maintenance <= 0)
    throw new RangeError("Invalid goal calculation inputs.");
  const calories = goal === "maintenance" ? energy.maintenance : goal === "fat-loss" ? energy.gradualLoss : energy.gradualGain;
  const base = { bmr: energy.bmr, maintenance: energy.maintenance };
  if (calories === null) return { ...base, macros: null, reason: "This gradual fat-loss estimate is below the screening threshold. Consult a qualified professional. No calorie or macro target is shown." };
  if (!validCalories(calories)) return { ...base, macros: null, reason: "The estimated goal calories are outside this calculator's supported 1,200–6,000 kcal/day range. Consult a qualified professional. No calorie or macro target is shown." };
  return { ...base, macros: calculateMacros({ calories, goal, percentages }), reason: null };
}

export type NutritionPlan = "balanced" | "low-fat" | "low-carb" | "high-protein" | "custom";
export const NUTRITION_PLANS: Record<NutritionPlan, { label: string; description: string }> = {
  balanced: { label: "Balanced", description: "Uses your goal's original example split." },
  "low-fat": { label: "Low Fat", description: "Illustrative split: 25% protein, 55% carbs, 20% fat." },
  "low-carb": { label: "Low Carb", description: "Illustrative split: 30% protein, 30% carbs, 40% fat." },
  "high-protein": { label: "High Protein", description: "Illustrative split: 35% protein, 40% carbs, 25% fat." },
  custom: { label: "Create Your Own", description: "Edit percentages and apply a valid 100% allocation." },
};
export const PLAN_KEYS = Object.keys(NUTRITION_PLANS) as NutritionPlan[];
export function nutritionPlanPercentages(plan: NutritionPlan, goal: Goal, custom: Percentages): Percentages {
  if (!Object.hasOwn(NUTRITION_PLANS, plan) || !Object.hasOwn(GOALS, goal)) throw new RangeError("Invalid nutrition plan.");
  switch (plan) {
    case "balanced": return { ...GOALS[goal].percentages };
    case "low-fat": return { protein: 25, carbohydrates: 55, fat: 20 };
    case "low-carb": return { protein: 30, carbohydrates: 30, fat: 40 };
    case "high-protein": return { protein: 35, carbohydrates: 40, fat: 25 };
    case "custom": return { ...custom };
  }
}

// Reallocate only an already-approved target; never recalculate or bypass screening.
export function applyNutritionPlan(result: GoalMacroResult, plan: NutritionPlan, custom: Percentages): GoalMacroResult {
  if (result.macros === null) return result;
  const percentages = nutritionPlanPercentages(plan, result.macros.goal, custom);
  return { ...result, macros: calculateMacros({ calories: result.macros.calories, goal: result.macros.goal, percentages }) };
}
export const kcalToKilojoules = (calories: number): number => calories * 4.184;
