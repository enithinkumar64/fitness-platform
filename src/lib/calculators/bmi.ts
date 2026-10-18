export type BmiMeasurements = { age: number; weightKg: number; heightCm: number };
export type BmiErrors = Partial<Record<keyof BmiMeasurements, string>>;
// Software input limits, not definitions of healthy measurements.
export const BMI_LIMITS = { age: [20, 100], weightKg: [20, 400], heightCm: [100, 250] } as const;
export const BMI_CATEGORIES = [
  { label: "Underweight", upper: 18.5, interval: "Below 18.5" },
  { label: "Normal", upper: 25, interval: "18.5 to below 25" },
  { label: "Overweight", upper: 30, interval: "25 to below 30" },
  { label: "Obesity Class I", upper: 35, interval: "30 to below 35" },
  { label: "Obesity Class II", upper: 40, interval: "35 to below 40" },
  { label: "Obesity Class III", upper: Infinity, interval: "40 or higher" },
] as const;
export type BmiCategory = typeof BMI_CATEGORIES[number]["label"];
export type BmiResult = { bmi: number; category: BmiCategory; prime: number; ponderalIndex: number; referenceWeightKg: { lower: number; upper: number } };

export function validateBmiMeasurements(input: BmiMeasurements): BmiErrors {
  const errors: BmiErrors = {};
  if (!Number.isInteger(input.age) || input.age < 20 || input.age > 100) errors.age = "Enter a whole-number age from 20 to 100. Child and teen BMI is not supported.";
  if (!Number.isFinite(input.weightKg) || input.weightKg < 20 || input.weightKg > 400) errors.weightKg = "Enter a weight from 20 to 400 kg (or the equivalent in pounds).";
  if (!Number.isFinite(input.heightCm) || input.heightCm < 100 || input.heightCm > 250) errors.heightCm = "Enter a height from 100 to 250 cm (or the equivalent in feet and inches).";
  return errors;
}

export function classifyBmi(bmi: number): BmiCategory {
  if (!Number.isFinite(bmi) || bmi <= 0) throw new RangeError("BMI must be positive and finite.");
  return BMI_CATEGORIES.find((category) => bmi < category.upper)!.label;
}

export function calculateBmi(input: BmiMeasurements): BmiResult {
  if (Object.keys(validateBmiMeasurements(input)).length) throw new RangeError("Invalid adult BMI measurements.");
  const meters = input.heightCm / 100;
  const squaredHeight = meters * meters;
  const bmi = input.weightKg / squaredHeight;
  return { bmi, category: classifyBmi(bmi), prime: bmi / 25, ponderalIndex: input.weightKg / (squaredHeight * meters), referenceWeightKg: { lower: 18.5 * squaredHeight, upper: 25 * squaredHeight } };
}

export const BMI_SCALE_MIN = 10;
export const BMI_SCALE_MAX = 45;
// Linear numeric scale, clamped only for drawing. The actual result is unchanged.
export function bmiMarker(bmi: number): { percent: number; overflow: "below" | "above" | null } {
  classifyBmi(bmi);
  return { percent: Math.max(0, Math.min(100, (bmi - BMI_SCALE_MIN) / (BMI_SCALE_MAX - BMI_SCALE_MIN) * 100)), overflow: bmi < BMI_SCALE_MIN ? "below" : bmi > BMI_SCALE_MAX ? "above" : null };
}
