import Link from "next/link";

export default function ExerciseNotFound() {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section"><p className="font-mono text-sm text-primary">404 / EXERCISE NOT FOUND</p><h1 className="mt-4 text-heading-1">That exercise guide isn’t here</h1><p className="mt-5 max-w-xl text-secondary">The address may be incorrect or the guide may not be in our current catalog. Browse the library to find an available exercise.</p><Link href="/exercises" className="mt-8 inline-flex min-h-control items-center rounded-control bg-primary px-5 py-3 font-semibold text-on-primary no-underline hover:bg-primary-hover hover:text-on-primary">Browse Exercise Library</Link></main>;
}
