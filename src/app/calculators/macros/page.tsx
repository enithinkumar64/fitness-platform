import { siteMetadata } from "@/lib/site-url";
import type { Metadata } from "next";
import { MacroCalculator } from "@/components/calculators/macro-calculator";

export const metadata: Metadata = {
  ...siteMetadata("/calculators/macros"),
  title: "Free Goal-Guided Macro Calculator | VAJRYA",
  description: "Explore illustrative macro splits for maintenance, fat loss, and muscle gain. Estimate calories from body measurements and activity, then calculate protein, carbohydrates, and fat for your goal.",
};

export default function MacrosPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-page py-section">
      <p className="font-mono text-xs tracking-widest text-primary">FREE FITNESS TOOLS / 02</p>
      <h1 className="mt-4 max-w-4xl text-heading-1 font-bold">Goal-guided macro calculator</h1>
      <p className="mb-10 mt-5 max-w-2xl text-secondary">Enter your measurements, activity, and goal to estimate daily calories and macros. You can customize the starting percentages. Free educational estimates for adults aged 18 and older.</p>
      <MacroCalculator />
      <section aria-labelledby="macro-method" className="mt-10 max-w-3xl space-y-4 text-sm leading-7 text-secondary">
        <h2 id="macro-method" className="text-heading-3 font-bold text-foreground">From calories to macros</h2>
        <p>We reuse the adult Mifflin–St Jeor BMR estimate and activity multipliers from our <a href="/calculators/tdee">TDEE calculator</a>. The formula estimates resting energy expenditure, used here as BMR. Goal adjustments and macro allocations use the unrounded estimate.</p>
        <p>For each macro: allocated calories = daily calorie target × percentage ÷ 100. Protein and carbohydrates provide 4 kcal per gram; fat provides 9. Divide allocated calories by the corresponding kcal per gram to estimate grams per day.</p>
        <p>Calculations retain full precision. Results display one decimal place, so reconstructing calories from the rounded grams may give a slightly different total. Percentages must sum to 100%, with a tolerance of 0.000001 percentage points for floating-point arithmetic only. We never normalize your inputs.</p>
        <h2 className="text-heading-4 text-foreground">Starting examples, not prescriptions</h2>
        <p>Presets are general examples, not individualized dietary recommendations. Goal labels do not guarantee fat loss, muscle gain, or maintenance. Maintain weight uses estimated TDEE, gradual fat loss uses its screened −250 kcal estimate, and gradual gain uses its +250 kcal estimate. These are illustrative adjustments, not prescribed intake or guaranteed outcomes.</p>
        <p>Calorie requirements and macronutrient needs vary; formula estimates may be less reliable for highly muscular people or certain health conditions. If you have relevant medical conditions, are pregnant or breastfeeding, or have specialized nutrition needs, seek qualified professional guidance. These educational estimates are not medical advice.</p>
        <p>Energy conversion reference: <a href="https://www.nal.usda.gov/programs/fnic">USDA Food and Nutrition Information Center</a>.</p>
      </section>
    </main>
  );
}
