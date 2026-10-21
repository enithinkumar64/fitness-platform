import { siteMetadata } from "@/lib/site-url";
import type { Metadata } from "next";
import { TdeeCalculator } from "@/components/calculators/tdee-calculator";

export const metadata: Metadata = {
  ...siteMetadata("/calculators/tdee"),
  title: "Free TDEE & Daily Calorie Calculator | VAJRYA",
  description: "Estimate adult BMR, maintenance calories, and daily calorie adjustments using the Mifflin–St Jeor equation. Free metric and imperial TDEE calculator.",
};

export default function TdeePage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
      <p className="font-mono text-xs tracking-widest text-primary">FREE FITNESS TOOLS / 01</p>
      <h1 className="mt-4 max-w-4xl text-heading-1">TDEE & daily calorie calculator</h1>
      <p className="mb-10 mt-5 max-w-2xl text-secondary">Estimate the energy you use at rest and throughout your day. For adults aged 18 and older, with metric or imperial measurements. No account needed.</p>
      <TdeeCalculator />
      <section aria-labelledby="method-heading" className="mt-10 max-w-3xl space-y-4 text-sm leading-7 text-secondary">
        <h2 id="method-heading" className="text-heading-3 text-foreground">How these estimates work</h2>
        <p>BMR describes energy needed at rest. The Mifflin–St Jeor equation estimates resting energy expenditure, used here as a BMR estimate. TDEE adds an approximate allowance for activity to estimate total daily energy use.</p>
        <p className="break-words font-mono">BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age + coefficient.</p>
        <p>The coefficient is +5 (male-based) or −161 (female-based). TDEE = BMR × activity multiplier: sedentary 1.2, lightly active 1.375, moderately active 1.55, very active 1.725, extra active 1.9. Activity categories are rough guides.</p>
        <p>Weight goals adjust unrounded TDEE by ±250 or ±500 kcal/day. Only displayed results are rounded to whole kcal. Conversions: 1 lb = 0.45359237 kg; 1 inch = 2.54 cm; 1 foot = 12 inches.</p>
        <h2 className="text-heading-4 text-foreground">Estimates, not medical advice</h2>
        <p>This formula is not a diagnosis or medical recommendation. Estimates may be less reliable for people who are pregnant, breastfeeding, highly muscular, or have certain health conditions. Seek individualized advice from a qualified healthcare or nutrition professional, especially before changing intake in these circumstances. No exact weight-loss rate or outcome is guaranteed.</p>
        <p>Sources: <a href="https://pubmed.ncbi.nlm.nih.gov/2305711/">Mifflin–St Jeor original research</a> and <a href="https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner">NIDDK adult planning guidance</a>.</p>
      </section>
    </main>
  );
}
