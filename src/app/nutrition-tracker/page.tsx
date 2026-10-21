import { siteMetadata } from "@/lib/site-url";
import type { Metadata } from 'next';
import { NutritionTracker } from '@/components/nutrition/nutrition-tracker';
export const metadata: Metadata = {
  ...siteMetadata("/nutrition-tracker"), title: 'Nutrition Tracker | VAJRYA', description: 'Track meals and daily nutrition estimates with a free starter food catalog and optional USDA food search. Saved in your browser.' };
export default function NutritionPage() {
    return <main className="mx-auto max-w-7xl px-page py-section"><p className="font-mono text-sm tracking-widest text-primary">FOOD. FUEL. YOUR CHOICE.</p><h1 className="mt-4">Nutrition Tracker</h1><p className="mt-4 max-w-2xl text-secondary">Log your meals and compare nutrition estimates with targets you choose. No account needed.</p><NutritionTracker /></main>;
}
