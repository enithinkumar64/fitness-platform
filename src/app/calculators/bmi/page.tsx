import { siteMetadata } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { BmiCalculator } from "@/components/calculators/bmi-calculator";

export const metadata: Metadata = {
  ...siteMetadata("/calculators/bmi"),
  title: "Free Adult BMI Calculator | VAJRYA",
  description: "Calculate adult BMI, BMI Prime, Ponderal Index, and height-based reference-weight boundaries. Free metric and imperial calculator for ages 20–100.",
};

export default function BmiPage() {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
    <p className="font-mono text-xs tracking-widest text-primary">FREE FITNESS TOOLS / 03</p>
    <h1 className="mt-4 max-w-4xl text-heading-1">Adult BMI calculator</h1>
    <p className="mb-10 mt-5 max-w-2xl text-secondary">Explore how your weight relates to your height, with context beyond a single number. For adults aged 20–100. Free, with no account needed.</p>
    <BmiCalculator />
    <section aria-labelledby="bmi-method-heading" className="mt-10 max-w-3xl space-y-4 text-sm leading-7 text-secondary">
      <h2 id="bmi-method-heading" className="text-heading-3 text-foreground">Understanding your BMI</h2>
      <p>Body mass index compares weight with height. Divide weight in kilograms by height in meters squared: <span className="font-mono">BMI = weight (kg) / height (m)²</span>. Adult categories use the same thresholds regardless of sex; this calculator does not need the formula coefficient used by our TDEE tool.</p>
      <p>The adult reference category runs from 18.5 up to, but not including, 25. Below 18.5 is Underweight; 25 to below 30 is Overweight. The remaining reference categories are Obesity Class I (30 to below 35), Class II (35 to below 40), and Class III (40 or higher). These labels describe screening categories, not a person.</p>
      <p>BMI Prime divides BMI by 25. Ponderal Index divides weight in kilograms by height in meters cubed. These are mathematical summaries, not additional diagnoses. Calculations retain full precision; only displayed values are rounded.</p>
      <h2 className="text-heading-4 text-foreground">A useful reference, with limits</h2>
      <p>BMI does not directly measure body fat or distinguish fat from muscle and bone. Athletes and highly muscular people can have a higher BMI without the body-fat level the category might suggest. Health also depends on medical history, body composition, and other clinical information; BMI alone cannot determine it.</p>
      <p>This tool is not intended for pregnancy or for child or teen assessment. People younger than 20 need age-specific assessment, which is not provided here. Seek qualified healthcare guidance for personal interpretation, particularly during pregnancy or with medical conditions. No weight-loss instructions or individualized weight targets are provided.</p>
      <p>Reference: <a href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">CDC adult BMI categories</a> and <a href="https://www.cdc.gov/bmi/faq/">CDC explanation of BMI limitations</a>.</p>
      <nav aria-label="Related calculators" className="flex flex-wrap gap-x-6 gap-y-2"><Link href="/calculators/tdee" className="inline-flex min-h-control items-center rounded-control font-semibold">TDEE &amp; daily calorie calculator</Link><Link href="/calculators/macros" className="inline-flex min-h-control items-center rounded-control font-semibold">Goal-guided macro calculator</Link></nav>
    </section>
  </main>;
}
