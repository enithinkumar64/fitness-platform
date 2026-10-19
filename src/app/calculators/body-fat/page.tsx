import type { Metadata } from "next";
import Link from "next/link";
import { BodyFatCalculator } from "@/components/calculators/body-fat-calculator";

export const metadata: Metadata = {
  title: "Free Adult Body Fat Calculator | FormFuel",
  description: "Estimate adult body fat with U.S. Navy circumference equations and a separate BMI-based comparison. Metric and imperial measurements for ages 20–100.",
};

export default function BodyFatPage() {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
    <p className="font-mono text-xs tracking-widest text-primary">FREE FITNESS TOOLS / 04</p>
    <h1 className="mt-4 max-w-4xl text-heading-1">Body fat calculator</h1>
    <p className="mb-10 mt-5 max-w-2xl text-secondary">Use circumference measurements to explore an estimate of body composition, with a separate BMI-based comparison. For adults aged 20–100. Free, with no account needed.</p>
    <BodyFatCalculator />
    <section aria-labelledby="bf-method-heading" className="mt-10 max-w-3xl space-y-4 text-sm leading-7 text-secondary">
      <h2 id="bf-method-heading" className="text-heading-3 text-foreground">How the methods work</h2>
      <p>The U.S. Navy circumference method estimates body fat from height and tape measurements. We use the published direct-percentage equations below. Every length is converted to inches before calculation; log₁₀ is the base-10 logarithm.</p>
      <p className="break-words font-mono">Male-based: % fat = 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76.</p>
      <p className="break-words font-mono">Female-based: % fat = 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387.</p>
      <p>Both height and the circumference difference must be positive. These direct equations do not divide by a body-density estimate. We use the same inch-based equations in both unit modes, rather than mixing them with the older centimeter-based density equations. Conversions use 2.54 cm per inch and 0.45359237 kg per pound.</p>
      <p>Estimated fat mass = weight × percentage / 100. Fat-free mass = weight − fat mass. Age and weight do not enter the Navy percentage equation itself; age checks eligibility and weight supplies the mass estimates.</p>
      <h3 className="text-heading-4 text-foreground">A separate BMI-based estimate</h3>
      <p className="break-words font-mono">Deurenberg adult method: % fat = 1.20 × BMI + 0.23 × age − coefficient. The coefficient is 16.2 for the male-based set or 5.4 for the female-based set.</p>
      <p>BMI comes from our existing BMI calculation: weight (kg) / height (m)². This comparison does not use your tape measurements. It is a population-based estimate, not confirmation of the Navy result.</p>
      <h3 className="text-heading-4 text-foreground">Interpret with care</h3>
      <p>Neither method directly measures body fat. Tape placement and body shape can substantially affect results, and BMI does not distinguish muscle from fat. The methods may fit poorly during pregnancy, with high muscularity, certain medical conditions, or outside the populations studied. This adult-only tool does not assess children or teens. Supporting inputs up to age 100 does not establish that these equations are validated for every age or body type.</p>
      <p>Percentages at or outside 0–100% are withheld, along with any masses derived from that method. Estimates below 2% or above 60% are explicitly flagged as extreme and potentially unreliable. These warning boundaries are software screening choices, not clinical cutoffs, recommended ranges, or guarantees of accuracy within them. We do not provide ideal-body-fat targets, categories, or prescribed fat-loss amounts.</p>
      <p>Sources: <a href="https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2023.1183836/full">Foulis and colleagues: circumference equations and their limitations</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/2043597/">Deurenberg and colleagues: adult BMI-based equation</a>.</p>
      <nav aria-label="Related calculators" className="flex flex-wrap gap-x-6 gap-y-2">{[["/calculators/bmi", "Adult BMI calculator"], ["/calculators/tdee", "TDEE & daily calorie calculator"], ["/calculators/macros", "Goal-guided macro calculator"]].map(([href, label]) => <Link key={href} href={href} className="inline-flex min-h-control items-center rounded-control font-semibold">{label}</Link>)}</nav>
    </section>
  </main>;
}
