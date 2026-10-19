import { BMI_LIMITS } from "./bmi.ts";
import { INCH_TO_CM, type Coefficient } from "./tdee.ts";

export type IdealWeightInput = { age: number; heightCm: number; coefficient: Coefficient };
export type IdealWeightErrors = Partial<Record<keyof IdealWeightInput, string>>;
export const FORMULAS = [
  { id: "robinson", label: "Robinson (1983)", male: [52, 1.9], female: [49, 1.7] },
  { id: "miller", label: "Miller (1983)", male: [56.2, 1.41], female: [53.1, 1.36] },
  { id: "devine", label: "Devine (1974)", male: [50, 2.3], female: [45.5, 2.3] },
  { id: "hamwi", label: "Hamwi (1964)", male: [48, 2.7], female: [45.5, 2.2] },
] as const;
export type FormulaId = typeof FORMULAS[number]["id"];
export type IdealWeightResult = {
  estimatesKg: Record<FormulaId, number> | null;
  formulaNotice: string | null;
  referenceWeightKg: { lower: number; upper: number };
};
export const FIVE_FEET_CM = 60 * INCH_TO_CM;

export function validateIdealWeightInput(input: IdealWeightInput): IdealWeightErrors {
  const errors: IdealWeightErrors = {};
  if (!Number.isInteger(input.age) || input.age < BMI_LIMITS.age[0] || input.age > BMI_LIMITS.age[1]) errors.age = "Enter a whole-number age from 20 to 100.";
  if (!Number.isFinite(input.heightCm) || input.heightCm < BMI_LIMITS.heightCm[0] || input.heightCm > BMI_LIMITS.heightCm[1]) errors.heightCm = "Enter a height from 100 to 250 cm (or equivalent feet and inches).";
  if (input.coefficient !== "male" && input.coefficient !== "female") errors.coefficient = "Choose a listed formula coefficient set.";
  return errors;
}

export function calculateIdealWeight(input: IdealWeightInput): IdealWeightResult {
  if (Object.keys(validateIdealWeightInput(input)).length) throw new RangeError("Invalid adult reference-weight inputs.");
  const heightMeters = input.heightCm / 100;
  // Reference interval is independent of coefficient set and formula eligibility.
  const referenceWeightKg = { lower: 18.5 * heightMeters ** 2, upper: 25 * heightMeters ** 2 };
  if (input.heightCm < FIVE_FEET_CM) return {
    estimatesKg: null,
    formulaNotice: "The four historical formula estimates are withheld below five feet (152.4 cm). This tool does not extrapolate them below their five-foot reference height. The separate BMI-based reference interval is still shown.",
    referenceWeightKg,
  };
  const inchesOverFiveFeet = input.heightCm / INCH_TO_CM - 60;
  const estimatesKg = {} as Record<FormulaId, number>;
  for (const formula of FORMULAS) {
    const [baseline, kgPerInch] = formula[input.coefficient];
    estimatesKg[formula.id] = baseline + kgPerInch * inchesOverFiveFeet;
  }
  return { estimatesKg, formulaNotice: null, referenceWeightKg };
}
