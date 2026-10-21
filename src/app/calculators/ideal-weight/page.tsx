import type { Metadata } from "next";
import Link from "next/link";
import { IdealWeightCalculator } from "@/components/calculators/ideal-weight-calculator";
import { FORMULAS } from "@/lib/calculators/ideal-weight";

export const metadata: Metadata = {
  title: "Free Ideal Weight Calculator | VAJRYA",
  description: "Compare Robinson, Miller, Devine, and Hamwi height-based reference-weight estimates with a separate adult BMI interval. Metric and imperial, ages 20–100.",
};

export default function IdealWeightPage() {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
    <p className="font-mono text-xs tracking-widest text-primary">FREE FITNESS TOOLS / 05</p>
    <h1 className="mt-4 max-w-4xl text-heading-1">Ideal weight calculator</h1>
    <p className="mb-10 mt-5 max-w-2xl text-secondary">Compare four historical height-based estimates and a separate BMI reference interval. “Ideal weight” is the traditional name of these formulas, not a personal goal you need to achieve. For adults aged 20–100.</p>
    <IdealWeightCalculator />
    <section aria-labelledby="iw-method-heading" className="mt-10 max-w-3xl space-y-4 text-sm leading-7 text-secondary">
      <h2 id="iw-method-heading" className="text-heading-3 text-foreground">Four formulas, different assumptions</h2>
      <p>Each formula starts with a reference weight at five feet and adds a fixed amount per inch above that height. Convert height to inches using 1 inch = 2.54 cm, then set x = height in inches − 60. Results are in kilograms before any display conversion to pounds (1 lb = 0.45359237 kg).</p>
      <dl className="space-y-4">{FORMULAS.map((formula) => <div key={formula.id}><dt className="font-semibold text-foreground">{formula.label}</dt><dd className="mt-1 break-words font-mono">Male-based: {formula.male[0]} + {formula.male[1]} × x kg.<br />Female-based: {formula.female[0]} + {formula.female[1]} × x kg.</dd></div>)}</dl>
      <p>Robinson and Miller use different baselines and increments from Devine and Hamwi, so their estimates can differ at the same height. None is selected as the correct answer here, and the estimates are not averaged. Age is used only to validate adult eligibility; it does not enter any of the four equations.</p>
      <h3 className="text-heading-4 text-foreground">Reference values, not prescriptions</h3>
      <p>These historical formulas arose from height–weight references and clinical practice; many were developed for or applied to medication-related calculations. Their origins do not make them individualized health goals, and this tool must not be used to determine medication doses. They cannot represent every body type or health circumstance.</p>
      <p>We withhold the four formulas below five feet rather than extrapolating them downward. Even above that height, being within the software limits does not establish that a formula is accurate for you. The separate BMI interval uses height squared with BMI boundaries of 18.5 (inclusive) and 25 (exclusive), independently of formula eligibility or coefficient selection.</p>
      <p>Muscle mass, body composition, pregnancy, medical conditions, and individual circumstances are not captured by these simple height-based equations. No single ideal weight exists for everyone. A qualified healthcare professional can help interpret reference values in context; this tool does not prescribe a target or an amount of weight to lose or gain. Child and teen assessment is outside its scope.</p>
      <p>Sources: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4841935/">Research on historical reference-weight equations</a> and <a href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">CDC adult BMI reference categories</a>.</p>
      <nav aria-label="Related calculators" className="flex flex-wrap gap-x-6 gap-y-2"><Link href="/calculators/bmi" className="inline-flex min-h-control items-center rounded-control font-semibold">Adult BMI calculator</Link><Link href="/calculators/body-fat" className="inline-flex min-h-control items-center rounded-control font-semibold">Body fat calculator</Link></nav>
    </section>
  </main>;
}
