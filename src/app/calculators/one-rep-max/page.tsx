import { siteMetadata } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { OneRepMaxCalculator } from "@/components/calculators/one-rep-max-calculator";

export const metadata: Metadata = {
  ...siteMetadata("/calculators/one-rep-max"),
  title: "Free One-Rep Max (1RM) Calculator | VAJRYA",
  description: "Estimate one-rep max from a completed set using Epley and Brzycki, with percentage-based load references. Free calculator for 1–12 reps in kg or lb.",
};

export default function OneRepMaxPage() {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
    <p className="font-mono text-xs tracking-widest text-primary">FREE FITNESS TOOLS / 07</p>
    <h1 className="mt-4 max-w-4xl text-heading-1">One-rep max calculator</h1>
    <p className="mb-10 mt-5 max-w-2xl text-secondary">Estimate a single-repetition load from weight you have already lifted for 1–12 repetitions. Compare two formulas and explore mathematical load percentages. No account needed.</p>
    <OneRepMaxCalculator />
    <section aria-labelledby="orm-method-heading" className="mt-10 max-w-3xl space-y-4 text-sm leading-7 text-secondary">
      <h2 id="orm-method-heading" className="text-heading-3 text-foreground">Measured versus estimated 1RM</h2>
      <p>A one-repetition maximum is the greatest load a person can complete once with good technique in a specific exercise. A measured 1RM comes from a direct test under appropriate conditions. This tool predicts a value from a completed set; it does not measure your maximum.</p>
      <h3 className="text-heading-4 text-foreground">Two equations, separate estimates</h3>
      <p className="break-words font-mono">Epley: estimated 1RM = lifted weight × (1 + repetitions / 30).</p>
      <p className="break-words font-mono">Brzycki: estimated 1RM = lifted weight × 36 / (37 − repetitions).</p>
      <p>For one repetition, this tool returns the entered load for both methods instead of extrapolating. For two or more, Epley increases linearly with repetitions while Brzycki uses a changing denominator. Epley is the primary display choice; Brzycki provides a comparison, not an averaged result or an accuracy verdict.</p>
      <p>The table multiplies the unrounded Epley estimate by 100%, 95%, 90%, 85%, 80%, 75%, 70%, 65%, 60%, 55%, and 50%. Weights are calculated internally in kilograms. Unit switches use 1 lb = 0.45359237 kg and retain the original measurement precision. Displayed values use one decimal place, without rounding to available plates or machine increments.</p>
      <h3 className="text-heading-4 text-foreground">Understand the uncertainty</h3>
      <p>The entered repetitions should describe a challenging set completed with good technique. An easy set with many repetitions left unperformed provides a weaker basis for these estimates. Use a set you have already completed rather than testing to failure to obtain an input.</p>
      <p>Higher-repetition estimates are generally less reliable because muscular endurance increasingly influences repetition count. Exercise, fatigue, training experience, range of motion, and technique all affect results. An estimate for one exercise does not transfer directly to another, and neither formula is universally more accurate.</p>
      <p>Percentage loads are mathematical references, not individualized prescriptions for sets, repetitions, or training intensity. A calculated weight is not guaranteed safe or achievable. Do not attempt a maximal lift solely because it appears here; seek appropriate coaching for training decisions.</p>
      <p>Research context: <a href="https://pubmed.ncbi.nlm.nih.gov/16937972/">Study of 1RM prediction from multiple-repetition testing</a>.</p>
      <nav aria-label="Related calculators" className="flex flex-wrap gap-x-6 gap-y-2"><Link href="/calculators/calories-burned" className="inline-flex min-h-control items-center rounded-control font-semibold">Activity calories burned calculator</Link><Link href="/calculators/macros" className="inline-flex min-h-control items-center rounded-control font-semibold">Goal-guided macro calculator</Link></nav>
    </section>
  </main>;
}
