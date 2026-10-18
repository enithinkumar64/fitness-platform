export type Coefficient = "male" | "female";
export const ACTIVITY_LEVELS = {
  sedentary: { label: "Sedentary — little or no exercise", multiplier: 1.2 },
  light: { label: "Lightly active — light exercise 1–3 days/week", multiplier: 1.375 },
  moderate: { label: "Moderately active — exercise 3–5 days/week", multiplier: 1.55 },
  very: { label: "Very active — hard exercise 6–7 days/week", multiplier: 1.725 },
  extra: { label: "Extra active — very hard training or physical work", multiplier: 1.9 },
} as const;
export type Activity = keyof typeof ACTIVITY_LEVELS;
export type Measurements = { age: number; weightKg: number; heightCm: number; coefficient: Coefficient; activity: Activity };
export type InputErrors = Partial<Record<keyof Measurements, string>>;
export const LB_TO_KG = 0.45359237;
export const INCH_TO_CM = 2.54;
export const poundsToKg = (pounds: number) => pounds * LB_TO_KG;
export const kgToPounds = (kg: number) => kg / LB_TO_KG;
export const imperialToCm = (feet: number, inches: number) => (feet * 12 + inches) * INCH_TO_CM;
export function cmToImperial(cm: number) {
  const totalInches = cm / INCH_TO_CM;
  const feet = Math.floor(totalInches / 12);
  return { feet, inches: totalInches - feet * 12 };
}

// Product input limits, not guarantees of formula validity across these ranges.
export function validateMeasurements(input: Measurements): InputErrors {
  const errors: InputErrors = {};
  if (!Number.isFinite(input.age) || !Number.isInteger(input.age) || input.age < 18 || input.age > 100)
    errors.age = "Enter a whole-number age from 18 to 100 years.";
  if (!Number.isFinite(input.weightKg) || input.weightKg < 30 || input.weightKg > 300)
    errors.weightKg = "Enter a weight from 30 to 300 kg (about 66.14–661.39 lb).";
  if (!Number.isFinite(input.heightCm) || input.heightCm < 120 || input.heightCm > 230)
    errors.heightCm = "Enter a height from 120 to 230 cm (about 3 ft 11.24 in–7 ft 6.55 in).";
  if (input.coefficient !== "male" && input.coefficient !== "female")
    errors.coefficient = "Choose a formula coefficient.";
  if (!Object.hasOwn(ACTIVITY_LEVELS, input.activity)) errors.activity = "Choose an activity level.";
  return errors;
}
export function calculateBmr(input: Measurements): number {
  if (Object.keys(validateMeasurements(input)).length) throw new RangeError("Invalid adult calculator inputs.");
  return 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + (input.coefficient === "male" ? 5 : -161);
}
export function screenLossTarget(target: number, coefficient: Coefficient): number | null {
  if (!Number.isFinite(target) || (coefficient !== "male" && coefficient !== "female")) throw new RangeError("Invalid screening inputs.");
  return target < (coefficient === "male" ? 1500 : 1200) ? null : target;
}
export function calculateTdee(input: Measurements) {
  const bmr = calculateBmr(input);
  const maintenance = bmr * ACTIVITY_LEVELS[input.activity].multiplier;
  return {
    bmr, maintenance,
    gradualLoss: screenLossTarget(maintenance - 250, input.coefficient),
    moderateLoss: screenLossTarget(maintenance - 500, input.coefficient),
    gradualGain: maintenance + 250,
    moderateGain: maintenance + 500,
  };
}
