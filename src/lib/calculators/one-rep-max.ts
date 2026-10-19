export type OneRepMaxInput = { weightKg: number; repetitions: number };
export type OneRepMaxErrors = Partial<Record<keyof OneRepMaxInput, string>>;
// Software boundaries, not claims about safe or achievable loads.
export const LIFTED_WEIGHT_LIMITS_KG = { min: 0.1, max: 1000 } as const;
export const TRAINING_PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50] as const;
export type TrainingLoad = { percentage: typeof TRAINING_PERCENTAGES[number]; weightKg: number };
export type OneRepMaxResult = {
  weightKg: number; repetitions: number; epleyKg: number; brzyckiKg: number; trainingLoads: TrainingLoad[];
};

export function validateOneRepMaxInput(input: OneRepMaxInput): OneRepMaxErrors {
  const errors: OneRepMaxErrors = {};
  if (!Number.isFinite(input.weightKg) || input.weightKg < LIFTED_WEIGHT_LIMITS_KG.min || input.weightKg > LIFTED_WEIGHT_LIMITS_KG.max)
    errors.weightKg = "Enter a lifted weight from 0.1 to 1,000 kg (or equivalent pounds).";
  if (!Number.isInteger(input.repetitions) || input.repetitions < 1 || input.repetitions > 12)
    errors.repetitions = "Enter a whole number of completed repetitions from 1 to 12.";
  return errors;
}
function assertInput(input: OneRepMaxInput): void {
  if (Object.keys(validateOneRepMaxInput(input)).length) throw new RangeError("Invalid one-rep max inputs.");
}
export function calculateEpley(input: OneRepMaxInput): number {
  assertInput(input);
  return input.repetitions === 1 ? input.weightKg : input.weightKg * (1 + input.repetitions / 30);
}
export function calculateBrzycki(input: OneRepMaxInput): number {
  assertInput(input);
  // Valid reps 1–12 keep the denominator positive and away from zero.
  return input.repetitions === 1 ? input.weightKg : input.weightKg * 36 / (37 - input.repetitions);
}
export function calculateTrainingLoads(estimatedMaxKg: number): TrainingLoad[] {
  if (!Number.isFinite(estimatedMaxKg) || estimatedMaxKg <= 0) throw new RangeError("Estimated maximum must be positive and finite.");
  return TRAINING_PERCENTAGES.map((percentage) => ({ percentage, weightKg: estimatedMaxKg * (percentage / 100) }));
}
export function calculateOneRepMax(input: OneRepMaxInput): OneRepMaxResult {
  const epleyKg = calculateEpley(input);
  const brzyckiKg = calculateBrzycki(input);
  return { ...input, epleyKg, brzyckiKg, trainingLoads: calculateTrainingLoads(epleyKg) };
}
