import type { Slot, TemplateId, WorkoutTemplate } from "./types.ts";
const lowerSlots: readonly Slot[] = [
  { id: "squat", label: "Main squat", group: "squat", kind: "main" },
  { id: "hip", label: "Main hip movement", group: "hip-main", kind: "main" },
  { id: "lunge", label: "Secondary split-stance work", group: "lunge", kind: "secondary" },
  { id: "calf", label: "Calf work", group: "calf", kind: "secondary" },
  { id: "core", label: "Trunk control", group: "core", kind: "secondary" },
  { id: "leg-curl", label: "Optional hamstring isolation", group: "leg-curl", kind: "accessory", optional: true, experiencedOnly: true },
];
export const TEMPLATES: Record<TemplateId, WorkoutTemplate> = {
  full: { id: "full", name: "Full Body", requiredPatterns: ["Squat","Hip hinge or Hip extension","Horizontal push","Horizontal pull","Anti-extension"], notes: "A compact major-movement routine. B uses a predefined alternate preference for chest presses and rows where available.", slots: [
    { id: "squat", label: "Main squat", group: "squat", kind: "main" },
    { id: "hip", label: "Main hip movement", group: "hip-main", kind: "main" },
    { id: "press", label: "Main chest press", group: "chest-press", kind: "main" },
    { id: "row", label: "Main back row", group: "row", kind: "main" },
    { id: "core", label: "Trunk control", group: "core", kind: "secondary" },
  ] },
  upper: { id: "upper", name: "Upper", requiredPatterns: ["Horizontal push","Horizontal pull"], notes: "Chest press and row lead. Vertical pulling and shoulder work are added only when their approved equipment is available; experienced users may add curls.", slots: [
    { id: "press", label: "Main chest press", group: "chest-press", kind: "main" },
    { id: "row", label: "Main back row", group: "row", kind: "main" },
    { id: "vertical-pull", label: "Optional vertical back pull", group: "vertical-pull", kind: "secondary", optional: true },
    { id: "shoulder", label: "Optional lateral shoulder work", group: "lateral-raise", kind: "secondary", optional: true },
    { id: "curl", label: "Optional biceps work", group: "biceps", kind: "accessory", optional: true, experiencedOnly: true },
  ] },
  lower: { id: "lower", name: "Lower", requiredPatterns: ["Squat","Hip hinge or Hip extension","Lunge","Ankle plantar flexion","Anti-extension"], notes: "Squat, hip work, split-stance work, calves and trunk control in that order. Machine knee flexion is an optional experienced-user addition.", slots: lowerSlots },
  legs: { id: "legs", name: "Legs", requiredPatterns: ["Squat","Hip hinge or Hip extension","Lunge","Ankle plantar flexion","Anti-extension"], notes: "Uses the same deliberate lower-body sequence as Lower; it is not a separate random exercise pool.", slots: lowerSlots },
  push: { id: "push", name: "Push", requiredPatterns: ["Horizontal push","Shoulder abduction","Elbow extension"], notes: "Chest pressing, optional experienced overhead pressing, lateral shoulder work and triceps extension. Lateral raises are not substituted for overhead presses.", slots: [
    { id: "press", label: "Main chest press", group: "chest-press", kind: "main" },
    { id: "overhead", label: "Optional overhead press", group: "vertical-press", kind: "secondary", optional: true, experiencedOnly: true },
    { id: "shoulder", label: "Lateral shoulder work", group: "lateral-raise", kind: "secondary" },
    { id: "triceps", label: "Triceps work", group: "triceps", kind: "secondary" },
  ] },
  pull: { id: "pull", name: "Pull", requiredPatterns: ["Horizontal pull","Elbow flexion"], notes: "A row followed by vertical pulling where equipment allows, then curls. Rear-shoulder work is optional for experienced users. Dumbbell routines have no vertical pull in the current approved program.", slots: [
    { id: "row", label: "Main back row", group: "row", kind: "main" },
    { id: "vertical-pull", label: "Optional vertical back pull", group: "vertical-pull", kind: "secondary", optional: true },
    { id: "curl", label: "Biceps work", group: "biceps", kind: "secondary" },
    { id: "rear", label: "Optional rear-shoulder work", group: "rear-delts", kind: "accessory", optional: true, experiencedOnly: true },
  ] },
  conditioning: { id: "conditioning", name: "Conditioning/Core", requiredPatterns: ["Locomotion","Anti-extension"], notes: "A separate easy template, not silently inserted into a selected resistance split.", slots: [
    { id: "walk", label: "Easy walking", group: "walk", kind: "secondary" }, { id: "core", label: "Light trunk control", group: "core", kind: "secondary" },
  ] },
};
