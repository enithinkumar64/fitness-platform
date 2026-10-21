import { siteMetadata } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXERCISES, findExerciseBySlug, findRelatedExercises } from "@/lib/exercises/exercises";
import { ExerciseCard } from "@/components/exercises/exercise-card";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return EXERCISES.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exercise = findExerciseBySlug((await params).slug);
  if (!exercise) notFound();
  return { ...siteMetadata(`/exercises/${exercise.slug}`), title: `${exercise.name}: Technique & Safety | VAJRYA`, description: `${exercise.description} Read original written steps, technique tips, common mistakes, and safety considerations.` };
}

export default async function ExercisePage({ params }: Props) {
  const exercise = findExerciseBySlug((await params).slug);
  if (!exercise) notFound();
  const related = findRelatedExercises(exercise.id);
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
    <nav aria-label="Breadcrumb"><Link href="/exercises" className="inline-flex min-h-control items-center rounded-control text-sm font-semibold">← Back to Exercise Library</Link></nav>
    <p className="mt-6 font-mono text-xs tracking-widest text-primary">{exercise.primaryMuscle.toUpperCase()} / WRITTEN GUIDE</p>
    <h1 className="mt-4 max-w-4xl text-heading-1">{exercise.name}</h1>
    <p className="mt-5 max-w-2xl text-body text-secondary">{exercise.description}</p>
    <dl className="mt-8 grid gap-5 rounded-panel border border-border bg-surface p-5 text-sm sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
      <div><dt className="text-secondary">Directory category</dt><dd className="mt-2">{exercise.category}</dd></div>
      <div><dt className="text-secondary">Primary muscle group</dt><dd className="mt-2 font-semibold">{exercise.primaryMuscle}</dd></div>
      <div><dt className="text-secondary">Secondary muscles</dt><dd className="mt-2">{exercise.secondaryMuscles.join(", ") || "None listed"}</dd></div>
      <div><dt className="text-secondary">Equipment</dt><dd className="mt-2">{exercise.equipment.join(" · ")}</dd></div>
      <div><dt className="text-secondary">Difficulty</dt><dd className="mt-2 capitalize">{exercise.difficulty}</dd></div>
      <div className="sm:col-span-2"><dt className="text-secondary">Movement pattern</dt><dd className="mt-2">{exercise.movementPattern}</dd></div>
    </dl>
    {exercise.video && <section aria-labelledby="video-heading" className="mt-8 min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8">
      <p className="font-mono text-xs tracking-widest text-primary">THIRD-PARTY RESOURCE</p>
      <h2 id="video-heading" className="mt-3 text-heading-3">Watch Exercise Demonstration</h2>
      <h3 className="mt-5 break-words text-lg font-semibold">{exercise.video.title}</h3>
      <p className="mt-2 text-sm text-secondary">Creator: {exercise.video.creator}</p>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-secondary">{exercise.video.description ?? "See an external demonstration alongside this written guide. Videos are third-party resources and do not replace individualized coaching."}</p>
      <a href={exercise.video.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-control items-center rounded-control border border-border-control px-4 py-3 text-sm font-semibold">
        Watch on YouTube<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <p className="mt-4 max-w-3xl text-xs leading-6 text-secondary">The video belongs to its creator. Linking to it does not imply the creator endorses VAJRYA. Availability on YouTube may change.</p>
    </section>}
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <section aria-labelledby="instructions-heading" className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8"><h2 id="instructions-heading" className="text-heading-3">How to perform</h2><ol className="mt-6 list-decimal space-y-5 pl-6 text-sm leading-7 text-secondary">{exercise.instructions.map((step) => <li key={step} className="pl-2 marker:font-mono marker:text-primary">{step}</li>)}</ol></section>
      <div className="min-w-0 space-y-8">{([["Technique tips", exercise.tips], ["Common mistakes to avoid", exercise.mistakes]] as const).map(([title, items]) => <section key={title} aria-label={title} className="rounded-panel border border-border bg-surface p-5 sm:p-8"><h2 className="text-heading-4">{title}</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-secondary">{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div>
    </div>
    <section aria-labelledby="safety-heading" className="mt-8 rounded-panel border border-border-control bg-surface p-5 sm:p-8"><h2 id="safety-heading" className="text-heading-4">Safety considerations</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-secondary">{exercise.safety.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-4 max-w-3xl text-sm leading-7 text-secondary">Exercise choice and range should fit your circumstances. Stop for pain, dizziness, or loss of control. Seek qualified guidance for injury, medical conditions, pregnancy, or unfamiliar equipment. Written instructions cannot replace individualized assessment or in-person coaching.</p></section>
    {related.length > 0 && <section aria-labelledby="related-heading" className="mt-12"><h2 id="related-heading" className="text-heading-3">Related exercise guides</h2><p className="mt-3 text-sm leading-7 text-secondary">Related movements to read about, not automatic substitutions or personalized recommendations.</p><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ExerciseCard key={item.id} exercise={item} />)}</div></section>}
  </main>;
}
