import { calculateBmi, validateBmiMeasurements } from "./bmi.ts";
import { INCH_TO_CM, type Coefficient } from "./tdee.ts";

export type BodyFatInput = {
  age: number; coefficient: Coefficient; weightKg: number; heightCm: number;
  neckCm: number; waistCm: number; hipCm?: number;
};
export type BodyFatErrors = Partial<Record<keyof BodyFatInput | "formula", string>>;
export type BodyFatEstimate = { percentage: number | null; warning: string | null };
export type BodyFatResult = {
  navy: BodyFatEstimate; bmiComparison: BodyFatEstimate; bmi: number;
  fatMassKg: number | null; fatFreeMassKg: number | null;
};
// Software limits only; accepting an input does not establish method accuracy.
export const CIRCUMFERENCE_LIMITS = { neckCm: [20, 80], waistCm: [30, 250], hipCm: [40, 250] } as const;

export function validateBodyFatInput(input: BodyFatInput): BodyFatErrors {
  const errors: BodyFatErrors = { ...validateBmiMeasurements(input) };
  if (input.coefficient !== "male" && input.coefficient !== "female") errors.coefficient = "Choose a listed equation coefficient set.";
  for (const key of ["neckCm", "waistCm", ...(input.coefficient === "female" ? ["hipCm" as const] : [])] as const) {
    const value = input[key];
    const [min, max] = CIRCUMFERENCE_LIMITS[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max)
      errors[key] = `Enter a ${key === "neckCm" ? "neck" : key === "waistCm" ? "waist" : "hip"} circumference from ${min} to ${max} cm (or equivalent inches).`;
  }
  if (!errors.neckCm && !errors.waistCm && !errors.coefficient && !errors.hipCm) {
    const difference = input.waistCm + (input.coefficient === "female" ? input.hipCm! : 0) - input.neckCm;
    if (!Number.isFinite(difference) || difference <= 0) errors.formula = input.coefficient === "male"
      ? "Waist must be greater than neck for this equation. Check your measurement sites."
      : "Waist plus hip must be greater than neck for this equation. Check your measurement sites.";
  }
  return errors;
}

// Explicit software screening, NOT clinical thresholds or recommended ranges.
// Never clamp: impossible percentages are withheld; extreme finite values are flagged.
export function screenBodyFatEstimate(percentage: number): BodyFatEstimate {
  if (!Number.isFinite(percentage) || percentage <= 0 || percentage >= 100)
    return { percentage: null, warning: "This method produced a percentage outside the physically meaningful 0–100% interval. The estimate and any derived masses are withheld. Recheck measurements or seek qualified guidance." };
  return { percentage, warning: percentage < 2 || percentage > 60
    ? "Extreme estimate: this may reflect measurement error or poor fit of the equation. Do not treat it as a reliable measurement. Recheck measurements and seek qualified guidance. The 2–60% warning boundaries are software screening choices, not clinical or recommended ranges."
    : null };
}

/** Published direct-percent circumference regressions, ALL lengths in inches.
 * Male: 86.010 log10(waist-neck) - 70.041 log10(height) + 36.76
 * Female: 163.205 log10(waist+hip-neck) - 97.684 log10(height) - 78.387
 * See Foulis et al., Front Physiol 2023, doi:10.3389/fphys.2023.1183836.
 * Unlike the older metric density/Siri variant, these have no density denominator.
 */
export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  if (Object.keys(validateBodyFatInput(input)).length) throw new RangeError("Invalid adult body fat measurements.");
  const heightInches = input.heightCm / INCH_TO_CM;
  const differenceInches = (input.waistCm + (input.coefficient === "female" ? input.hipCm! : 0) - input.neckCm) / INCH_TO_CM;
  // Guard every logarithm argument and conversion denominator explicitly.
  if (!(INCH_TO_CM > 0) || !Number.isFinite(heightInches) || heightInches <= 0 || !Number.isFinite(differenceInches) || differenceInches <= 0)
    throw new RangeError("Circumference equation logarithms require positive finite measurements.");
  const navyRaw = input.coefficient === "male"
    ? 86.010 * Math.log10(differenceInches) - 70.041 * Math.log10(heightInches) + 36.76
    : 163.205 * Math.log10(differenceInches) - 97.684 * Math.log10(heightInches) - 78.387;
  const bmi = calculateBmi(input).bmi;
  // Deurenberg et al. 1991 adult regression; published sex code male=1, female=0.
  const bmiRaw = 1.20 * bmi + 0.23 * input.age - (input.coefficient === "male" ? 10.8 : 0) - 5.4;
  const navy = screenBodyFatEstimate(navyRaw);
  const fatMassKg = navy.percentage === null ? null : input.weightKg * navy.percentage / 100;
  return { navy, bmiComparison: screenBodyFatEstimate(bmiRaw), bmi, fatMassKg, fatFreeMassKg: fatMassKg === null ? null : input.weightKg - fatMassKg };
}
