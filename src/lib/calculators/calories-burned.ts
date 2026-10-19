export type CatalogActivity = {
  id: string; name: string; group: string; category: string; intensity: string;
  met: number; sourceCode: string; sourceUrl: string;
};
function activity(id: string, group: string, category: string, intensity: string, met: number, sourceCode: string, sourcePage: string): CatalogActivity {
  return { id, name: `${group} — ${intensity}`, group, category, intensity, met, sourceCode, sourceUrl: `https://pacompendium.com/${sourcePage}/` };
}
// Curated subset of the 2024 Adult Compendium, verified 2026-10-18.
// Each code identifies the source row; labels are shortened/paraphrased for this UI.
// Values are fixed published METs, never interpolated from a requested pace.
export const ACTIVITIES: readonly CatalogActivity[] = [
  activity("walking-slow", "Walking", "Walking & hiking", "2.0–2.4 mph, level firm ground", 2.8, "17152", "walking"),
  activity("walking-moderate", "Walking", "Walking & hiking", "2.8–3.4 mph, level firm ground", 3.8, "17190", "walking"),
  activity("walking-brisk", "Walking", "Walking & hiking", "3.5–3.9 mph, level firm ground", 4.8, "17200", "walking"),
  activity("hiking-cross-country", "Hiking", "Walking & hiking", "Cross-country", 6, "17080", "walking"),
  activity("running-4mph", "Running", "Running", "4.0–4.2 mph", 6.5, "12028", "running"),
  activity("running-5mph", "Running", "Running", "5.0–5.2 mph", 8.5, "12030", "running"),
  activity("running-6mph", "Running", "Running", "6.0–6.3 mph", 9.3, "12050", "running"),
  activity("cycling-leisure", "Cycling", "Cycling", "Below 10 mph, leisure riding", 4, "01010", "bicycling"),
  activity("cycling-moderate", "Cycling", "Cycling", "12–13.9 mph, moderate effort", 8, "01030", "bicycling"),
  activity("cycling-vigorous", "Cycling", "Cycling", "14–15.9 mph, vigorous effort", 10, "01040", "bicycling"),
  activity("swimming-slow", "Swimming", "Pool", "Freestyle laps, slow recreation", 5.8, "18240", "water-activities"),
  activity("swimming-fast", "Swimming", "Pool", "Freestyle laps, fast vigorous effort", 9.8, "18230", "water-activities"),
  activity("weights-multiple", "Weight training", "Gym & strength", "Multiple exercises, 8–15 repetitions", 3.5, "02054", "conditioning-exercise"),
  activity("weights-vigorous", "Weight training", "Gym & strength", "Vigorous resistance training", 6, "02050", "conditioning-exercise"),
  activity("bodyweight-general", "Bodyweight exercises", "Gym & strength", "General resistance exercises", 3, "02056", "conditioning-exercise"),
  activity("bodyweight-high", "Bodyweight exercises", "Gym & strength", "High-intensity resistance exercises", 6.5, "02057", "conditioning-exercise"),
  activity("rowing-moderate", "Rowing machine", "Gym & strength", "Below 100 watts, moderate effort", 5, "02071", "conditioning-exercise"),
  activity("rowing-vigorous", "Rowing machine", "Gym & strength", "100–149 watts, vigorous effort", 7.5, "02072", "conditioning-exercise"),
  activity("elliptical-moderate", "Elliptical trainer", "Gym & strength", "Moderate effort", 5, "02048", "conditioning-exercise"),
  activity("elliptical-vigorous", "Elliptical trainer", "Gym & strength", "Vigorous effort", 9, "02049", "conditioning-exercise"),
  activity("yoga-hatha", "Yoga", "Mind & body", "Hatha", 2.3, "02150", "conditioning-exercise"),
  activity("yoga-power", "Yoga", "Mind & body", "Power", 4, "02160", "conditioning-exercise"),
  activity("dance-ballroom-slow", "Dancing", "Dance", "Slow ballroom", 3, "03040", "dancing"),
  activity("dance-ballroom-fast", "Dancing", "Dance", "Fast ballroom", 5.5, "03030", "dancing"),
  activity("basketball-game", "Basketball", "Sports", "Game play", 8, "15040", "sports"),
  activity("soccer-casual", "Soccer", "Sports", "Casual play", 7, "15610", "sports"),
  activity("tennis-singles", "Tennis", "Sports", "Singles", 8, "15690", "sports"),
];
export const ACTIVITY_GROUPS = [...new Map(ACTIVITIES.map(({ group, category }) => [group, { group, category }])).values()];
export const ACTIVITY_CATEGORIES = [...new Set(ACTIVITY_GROUPS.map(({ category }) => category))];
export const MAX_SESSION_MINUTES = 720;
export type CaloriesBurnedInput = { activityId: string; weightKg: number; hours: number; minutes: number };
export type CaloriesBurnedErrors = Partial<Record<keyof CaloriesBurnedInput | "duration", string>>;
export type CaloriesBurnedResult = {
  activity: CatalogActivity; durationMinutes: number; weightKg: number;
  grossCalories: number; caloriesPerMinute: number; caloriesPerHour: number;
};
export const findActivity = (id: string): CatalogActivity | undefined => ACTIVITIES.find((item) => item.id === id);

export function durationToMinutes(hours: number, minutes: number): number {
  if (!Number.isInteger(hours) || hours < 0 || hours > 12 || !Number.isInteger(minutes) || minutes < 0 || minutes > 59)
    throw new RangeError("Use whole hours 0–12 and whole minutes 0–59.");
  const duration = hours * 60 + minutes;
  if (duration <= 0 || duration > MAX_SESSION_MINUTES) throw new RangeError("Session duration must be greater than zero and at most 12 hours.");
  return duration;
}

export function validateCaloriesBurnedInput(input: CaloriesBurnedInput): CaloriesBurnedErrors {
  const errors: CaloriesBurnedErrors = {};
  if (!findActivity(input.activityId)) errors.activityId = "Choose a recognized activity and intensity.";
  if (!Number.isFinite(input.weightKg) || input.weightKg < 20 || input.weightKg > 400) errors.weightKg = "Enter a weight from 20 to 400 kg (or the equivalent in pounds).";
  if (!Number.isInteger(input.hours) || input.hours < 0 || input.hours > 12) errors.hours = "Enter whole hours from 0 to 12. Use 0 for a session under one hour.";
  if (!Number.isInteger(input.minutes) || input.minutes < 0 || input.minutes > 59) errors.minutes = "Enter whole minutes from 0 to 59. Use 0 for an exact number of hours.";
  if (!errors.hours && !errors.minutes && (input.hours * 60 + input.minutes <= 0 || input.hours * 60 + input.minutes > MAX_SESSION_MINUTES)) errors.duration = "Enter a session longer than zero and no longer than 12 hours in total.";
  return errors;
}

export function calculateCaloriesBurned(input: CaloriesBurnedInput): CaloriesBurnedResult {
  if (Object.keys(validateCaloriesBurnedInput(input)).length) throw new RangeError("Invalid activity calorie inputs.");
  const selected = findActivity(input.activityId)!;
  const durationMinutes = durationToMinutes(input.hours, input.minutes);
  const caloriesPerMinute = selected.met * 3.5 * input.weightKg / 200;
  return { activity: { ...selected }, durationMinutes, weightKg: input.weightKg, grossCalories: caloriesPerMinute * durationMinutes, caloriesPerMinute, caloriesPerHour: caloriesPerMinute * 60 };
}
