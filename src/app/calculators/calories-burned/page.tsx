import type { Metadata } from "next";
import Link from "next/link";
import { CaloriesBurnedCalculator } from "@/components/calculators/calories-burned-calculator";

export const metadata: Metadata = {
  title: "Free Calories Burned Calculator | VAJRYA",
  description: "Estimate gross activity calories from body weight, duration, and 2024 Compendium MET values. Free metric and imperial calculator with 27 activity variants.",
};

export default function CaloriesBurnedPage() {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
    <p className="font-mono text-xs tracking-widest text-primary">FREE FITNESS TOOLS / 06</p>
    <h1 className="mt-4 max-w-4xl text-heading-1">Calories burned calculator</h1>
    <p className="mb-10 mt-5 max-w-2xl text-secondary">Explore a duration-based estimate for an activity session. Choose from 27 activity and intensity variants, then enter your weight and active time. No account needed.</p>
    <CaloriesBurnedCalculator />
    <section aria-labelledby="cb-method-heading" className="mt-10 max-w-3xl space-y-4 text-sm leading-7 text-secondary">
      <h2 id="cb-method-heading" className="text-heading-3 text-foreground">Understanding MET estimates</h2>
      <p>A metabolic equivalent (MET) expresses an activity’s energy demand relative to a standardized resting reference. One standard MET corresponds to oxygen consumption of 3.5 mL per kilogram per minute. It is a convention, not a measurement of your individual resting metabolism.</p>
      <p className="break-words font-mono">Gross calories (kcal) = MET × 3.5 × body weight (kg) × duration (minutes) / 200.</p>
      <p>The conversion convention uses approximately 5 kcal per liter of oxygen. Average kcal/min = MET × 3.5 × weight / 200; multiplying by 60 gives the hourly estimate. Weight in pounds is converted using 1 lb = 0.45359237 kg. Age, height, and sex are not inputs to this standard calculation.</p>
      <h3 className="text-heading-4 text-foreground">Activity descriptions matter</h3>
      <p>The catalog is a curated subset of the <a href="https://pacompendium.com/adult-compendium/">2024 Adult Compendium of Physical Activities</a>. Each variant retains its source activity code and links to the relevant source table. Pace labels describe reference conditions rather than calculating energy from distance. This tool does not interpolate between MET values.</p>
      <p>Source tables: <a href="https://pacompendium.com/walking/">walking and hiking</a>, <a href="https://pacompendium.com/running/">running</a>, <a href="https://pacompendium.com/bicycling/">cycling</a>, <a href="https://pacompendium.com/water-activities/">swimming</a>, <a href="https://pacompendium.com/conditioning-exercise/">gym activities and yoga</a>, <a href="https://pacompendium.com/dancing/">dancing</a>, and <a href="https://pacompendium.com/sports/">sports</a>.</p>
      <h3 className="text-heading-4 text-foreground">An estimate, not an exact measurement</h3>
      <p>A higher reference MET produces a higher estimate at the same weight and duration. Actual energy use varies with fitness, movement efficiency, body composition, health, and individual resting metabolism. Terrain, incline, actual pace, and breaks can change the relationship between the selected description and your session.</p>
      <p>The 2024 Adult Compendium primarily represents adults aged 19–59. Applying these values to older adults, children, pregnancy, or other populations can reduce their relevance. Our weight and duration limits are software boundaries, not evidence that every combination has been validated.</p>
      <p>Gross calories include resting expenditure during the activity interval. This calculator does not calculate net additional energy, update your daily calorie needs, or prescribe exercise or food intake. Estimates do not promise weight loss or any other outcome.</p>
      <nav aria-label="Related calculators"><Link href="/calculators/tdee" className="inline-flex min-h-control items-center rounded-control font-semibold">TDEE &amp; daily calorie calculator</Link></nav>
    </section>
  </main>;
}
