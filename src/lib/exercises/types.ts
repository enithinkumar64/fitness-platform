export const DIRECTORY_CATEGORIES = ["Chest", "Back", "Legs and quads", "Glutes and hamstrings", "Shoulders", "Biceps", "Triceps", "Core and abs", "Full body", "Cardio and conditioning"] as const;
export type DirectoryCategory = typeof DIRECTORY_CATEGORIES[number];
export const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full body", "Cardio"] as const;
export const EQUIPMENT = ["Bodyweight", "Dumbbells", "Barbell", "Cable", "Machine", "Resistance band", "Kettlebell", "Bench", "Rack", "Pull-up bar", "Step", "Trap bar", "EZ bar", "Preacher bench", "Ab wheel", "Stationary bike", "Rowing machine", "Jump rope"] as const;
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type MuscleGroup = typeof MUSCLE_GROUPS[number];
export type Equipment = typeof EQUIPMENT[number];
export type Difficulty = typeof DIFFICULTIES[number];
export type ExerciseVideoReference = {
  url: string;
  title: string;
  creator: string;
  description: string;
  verification: { checkedOn: string; notes: string };
};
export type Exercise = {
  id: string; slug: string; name: string; category: DirectoryCategory; primaryMuscle: MuscleGroup;
  secondaryMuscles: readonly string[]; equipment: readonly Equipment[]; difficulty: Difficulty;
  movementPattern: string; description: string; instructions: readonly string[];
  tips: readonly string[]; mistakes: readonly string[]; safety: readonly string[];
  relatedIds: readonly string[];
  video?: ExerciseVideoReference;
};
export type ExerciseFilters = { category?: DirectoryCategory | ""; search?: string; muscle?: MuscleGroup | ""; equipment?: Equipment | ""; difficulty?: Difficulty | "" };
