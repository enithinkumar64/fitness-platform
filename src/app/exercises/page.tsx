import type { Metadata } from "next";
import { ExerciseLibrary } from "@/components/exercises/exercise-library";

export const metadata: Metadata = {
  title: "Free Exercise Library | VAJRYA",
  description: "Browse 100 exercise guides with written instructions, technique tips, and safety considerations. Filter by muscle group, equipment, and difficulty.",
};

export default function ExercisesPage() {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
    <p className="font-mono text-xs tracking-widest text-primary">EXPLORE / LEARN / MOVE</p>
    <h1 className="mt-4 text-heading-1">Exercise Library</h1>
    <p className="mt-5 max-w-2xl text-body text-secondary">Find your next movement to learn. Explore 100 written exercise guides across 10 directory categories, with filters for muscle group, equipment, and skill level. Free, with no account needed.</p>
    <p className="mb-8 mt-4 max-w-3xl text-sm leading-7 text-secondary">Difficulty labels describe general skill demands, not personal suitability. These written guides do not replace qualified in-person coaching. Selected guides include optional third-party demonstration links that open on YouTube.</p>
    <ExerciseLibrary />
  </main>;
}
