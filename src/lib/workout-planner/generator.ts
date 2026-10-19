import { EXERCISES } from "../exercises/exercises.ts";
import { DIFFICULTIES, type Exercise, type Equipment } from "../exercises/types.ts";
import { SPLITS } from "./splits.ts";
import { TEMPLATES } from "./templates.ts";
import { SUBSTITUTIONS, GYM_EQUIPMENT } from "./substitutions.ts";
import { GOALS, EQUIPMENT_MODES, type Preferences, type PreferenceErrors, type GroupId, type Dose, type Slot, type WorkoutPlan, type GenerationResult } from "./types.ts";

export function validatePreferences(value: unknown, seed = 0): PreferenceErrors {
  const p = value as Partial<Preferences> | null;
  const errors: PreferenceErrors = {};
  if (!p || typeof p !== "object" || !Object.keys(GOALS).includes(p.goal ?? "")) errors.goal = "Choose a fitness goal.";
  if (!p || !DIFFICULTIES.includes(p.experience!)) errors.experience = "Choose an experience level.";
  if (!p || ![2,3,4,5].includes(p.days!)) errors.days = "Choose 2, 3, 4, or 5 training days.";
  if (!p || !SPLITS.some((s) => s.id === p.split && s.days === p.days)) errors.split = "Choose a split that matches your training frequency.";
  if (!p || !Object.keys(EQUIPMENT_MODES).includes(p.equipment ?? "")) errors.equipment = "Choose your available equipment.";
  if (!p || typeof p.hasBench !== "boolean" || (p.hasBench && p.equipment !== "dumbbells")) errors.hasBench = "Confirm bench availability only for dumbbell mode.";
  else if (p.equipment === "dumbbells" && !p.hasBench) errors.hasBench = "The curated dumbbell rows require a stable exercise bench. Confirm one only if available, or choose a supported home program with a band and anchor.";
  if (!p || typeof p.hasBand !== "boolean" || (p.hasBand && p.equipment !== "bodyweight")) errors.hasBand = "Confirm band availability only for home mode.";
  else if (p.equipment === "bodyweight" && !p.hasBand) errors.hasBand = "Home programs need a resistance band and secure anchor for upper-body pulling. Without them, a complete routine cannot be generated.";
  if (!p || !Array.isArray(p.gymEquipment) || p.gymEquipment.some((e) => !GYM_EQUIPMENT.some((option) => option.value === e)) || new Set(p.gymEquipment).size !== p.gymEquipment.length || (p.equipment !== "gym" && p.gymEquipment.length > 0)) errors.gymEquipment = "Confirm only the listed gym equipment, without duplicate entries.";
  else if (p.equipment === "gym" && !p.gymEquipment.length) errors.gymEquipment = "Confirm the equipment actually available at your gym.";
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 1_000_000) errors.seed = "Variation seed must be a whole number from 0 to 1,000,000.";
  return errors;
}
export function allowedEquipment(p: Preferences): readonly Equipment[] {
  if (p.equipment === "gym") return ["Bodyweight", ...p.gymEquipment];
  if (p.equipment === "dumbbells") return ["Bodyweight","Dumbbells", ...(p.hasBench ? ["Bench" as const] : [])];
  return ["Bodyweight", ...(p.hasBand ? ["Resistance band" as const] : [])];
}
export function isCompatible(exercise: Exercise, p: Preferences): boolean {
  return exercise.equipment.every((item) => allowedEquipment(p).includes(item)) && DIFFICULTIES.indexOf(exercise.difficulty) >= 0 && DIFFICULTIES.indexOf(exercise.difficulty) <= DIFFICULTIES.indexOf(p.experience);
}
export function resolveGroup(slot: Slot, p: Preferences): GroupId {
  return slot.group === "hip-main" ? p.experience === "beginner" || p.equipment === "bodyweight" ? "hip-extension" : "hinge" : slot.group;
}
export function approvedCandidates(groupId: GroupId, p: Preferences, catalog: readonly Exercise[] = EXERCISES): Exercise[] {
  const group = SUBSTITUTIONS[groupId];
  const present = new Set(catalog.map((e) => e.id));
  let ids = [...group.options[p.equipment]];
  if (p.goal === "strength" && group.strengthPriority) {
    const priority = group.strengthPriority;
    ids = [...priority.filter((id) => ids.includes(id)), ...ids.filter((id) => !priority.includes(id))];
  }
  // Selection begins with curated IDs, never a search across the educational catalog.
  return ids.flatMap((id) => {
    const exercise = EXERCISES.find((e) => e.id === id);
    return exercise && present.has(id) && exercise.movementPattern === group.pattern && group.categories.includes(exercise.category) && isCompatible(exercise,p) ? [exercise] : [];
  });
}
export function prescription(exercise: Exercise, p: Preferences, kind: Slot["kind"], easy = false): Dose {
  const effort = easy ? "Easy pace; finish feeling able to do more." : "Keep about 2–3 controlled repetitions in reserve. End a hold before posture changes; stop for pain or loss of control.";
  if (exercise.id === "ex-brisk-walking") return { sets: 1, target: { unit: "minutes", min: 10, max: 20 }, restSeconds: 0, effort };
  // More frequent/mixed splits start with less work per session, not extra volume.
  const reduced = p.days === 5 || p.split === "fbulfb-4" || p.split === "pplfb-4";
  const sets = easy ? 1 : p.experience === "beginner" || reduced || kind !== "main" ? 2 : 3;
  if (exercise.id === "ex-forearm-plank") return { sets, target: { unit: "seconds", min: 15, max: 25 }, restSeconds: 60, effort };
  const strength = p.goal === "strength" && kind === "main";
  const min = strength ? p.experience === "beginner" ? 8 : 6 : p.goal === "muscle" ? 8 : 10;
  const max = strength ? p.experience === "beginner" ? 12 : 8 : p.goal === "muscle" ? 12 : 15;
  const compound = ["Squat","Hip hinge","Hip extension","Horizontal push","Horizontal pull","Vertical push","Vertical pull","Lunge"].includes(exercise.movementPattern);
  return { sets, target: { unit: "reps", min, max }, restSeconds: strength ? 180 : compound ? 120 : 60, effort };
}
export function formatDose(dose: Dose): string { return `${dose.sets} ${dose.sets === 1 ? "set" : "sets"} × ${dose.target.min}–${dose.target.max} ${dose.target.unit}`; }
export function generatePlan(value: unknown, seed = 0, catalog: readonly Exercise[] = EXERCISES): GenerationResult {
  const errors = validatePreferences(value,seed);
  if (Object.keys(errors).length) return { ok: false, errors, message: Object.values(errors).join(" ") };
  const p = value as Preferences;
  const split = SPLITS.find((s) => s.id === p.split)!;
  const workouts: WorkoutPlan["workouts"] = [];
  const counts: Record<string,number> = {};
  for (const [index, templateId] of split.structure.entries()) {
    const template = TEMPLATES[templateId];
    const variant = p.split === "fb-3" ? index % 2 : counts[templateId] ?? 0;
    counts[templateId] = (counts[templateId] ?? 0) + 1;
    const name = `${template.name} ${String.fromCharCode(65 + variant)}`;
    const workout: WorkoutPlan["workouts"][number] = { id: `workout-${index}`, name, templateId, programKey: `${templateId}-${variant}`, exercises: [], omitted: [] };
    for (const slot of template.slots) {
      if (slot.experiencedOnly && p.experience === "beginner") { workout.omitted.push(`${slot.label}: not included in the beginner template.`); continue; }
      const group = resolveGroup(slot,p);
      const candidates = approvedCandidates(group,p,catalog);
      if (!candidates.length) {
        if (slot.optional) { workout.omitted.push(`${slot.label}: no approved alternative fits the confirmed equipment and difficulty.`); continue; }
        const home = p.equipment === "bodyweight" && ["push","pull"].includes(templateId);
        return { ok: false, errors: {}, message: `${name} cannot be completed: ${slot.label} requires an approved ${SUBSTITUTIONS[group].label.toLowerCase()} matching your confirmed equipment and experience. ${home ? "The home program has no approved bodyweight shoulder/triceps or band-curl alternatives for a complete Push/Pull split. Choose Full Body or Upper/Lower instead." : "Confirm suitable available equipment, or choose a supported Full Body/home-band program. Do not confirm equipment you do not have."} No incomplete plan was generated.` };
      }
      // Predefined B sessions prefer the second chest/row alternative where one
      // exists. Other slots keep their authored priority and deliberate order.
      const preferred = variant % 2 && ["chest-press","row"].includes(group) ? Math.min(1,candidates.length - 1) : 0;
      const exercise = candidates[preferred];
      workout.exercises.push({ slotId: slot.id, label: slot.label, group, kind: slot.kind, exerciseId: exercise.id, alternatives: candidates.filter((e) => e.id !== exercise.id).map((e) => e.id), dose: prescription(exercise,p,slot.kind,templateId === "conditioning") });
    }
    workouts.push(workout);
  }
  const plan: WorkoutPlan = { version: 2, preferences: { ...p, gymEquipment: [...p.gymEquipment] }, seed: 0, workouts, schedule: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day, index) => { const workoutIndex = split.trainingDays.indexOf(index); return { day, workoutId: workoutIndex < 0 ? null : `workout-${workoutIndex}` }; }), rotation: p.split === "fb-3" ? "Week 1: A / B / A. Week 2: B / A / B on the same training days. The repeated session is intentional." : "Repeat this example only after adapting the workload and recovery to your circumstances.", notes: [split.tradeoffs, p.experience === "beginner" && (!split.recommended || p.days > 3) ? "Beginner note: two or three full-body days usually offer a simpler starting structure; selecting this alternative does not make it a beginner recommendation." : split.suitability, "Five-day and mixed four-day splits use reduced sets per session. The split alone does not determine outcomes."] };
  return { ok: true, plan: seed ? controlledVariation(plan,seed,catalog).plan : plan };
}
export function planSignature(plan: WorkoutPlan): string { return JSON.stringify(plan.workouts.map((w) => w.exercises.map((e) => e.exerciseId))); }
function controlledVariation(plan: WorkoutPlan, seed: number, catalog: readonly Exercise[]): { changed: boolean; plan: WorkoutPlan; message: string } {
  const changes = plan.workouts.flatMap((workout) => workout.exercises.flatMap((entry) => approvedCandidates(entry.group,plan.preferences,catalog).filter((e) => e.id !== entry.exerciseId && !workout.exercises.some((other) => other.exerciseId === e.id)).map((exercise) => ({ workout,entry,exercise }))));
  if (!changes.length) return { changed: false, plan, message: "No eligible approved substitutions are available. Your existing plan is unchanged." };
  const chosen = changes[(seed - 1) % changes.length];
  const next: WorkoutPlan = { ...plan, seed, workouts: plan.workouts.map((workout) => workout.programKey !== chosen.workout.programKey ? workout : { ...workout, exercises: workout.exercises.map((entry) => {
    if (entry.slotId !== chosen.entry.slotId) return entry;
    const candidates = approvedCandidates(entry.group,plan.preferences,catalog);
    return { ...entry, exerciseId: chosen.exercise.id, alternatives: candidates.filter((e) => e.id !== chosen.exercise.id).map((e) => e.id), dose: prescription(chosen.exercise,plan.preferences,entry.kind,workout.templateId === "conditioning") };
  }) }) };
  const original = EXERCISES.find((e) => e.id === chosen.entry.exerciseId)!;
  return { changed: true, plan: next, message: `Approved substitution: ${original.name} → ${chosen.exercise.name}. Slot order, split, preferences and programming rules are unchanged. Repeated A/B sessions stay consistent.` };
}
export function regeneratePlan(plan: WorkoutPlan, catalog: readonly Exercise[] = EXERCISES) { return controlledVariation(plan, plan.seed >= 1_000_000 ? 1 : plan.seed + 1, catalog); }
