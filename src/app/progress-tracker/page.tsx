import { siteMetadata } from "@/lib/site-url";
import type { Metadata } from 'next';
import { ProgressTracker } from '@/components/progress/progress-tracker';
export const metadata: Metadata = {
  ...siteMetadata("/progress-tracker"),title:'Progress Tracker | VAJRYA',description:'Track body weight, body measurements and exercise-specific strength history for free, with browser-local storage, accessible trends and CSV export.'};
export default function ProgressPage() {
  return <main className="mx-auto max-w-7xl px-page py-section"><p className="font-mono text-sm tracking-widest text-primary">YOUR RECORDS. YOUR PERSPECTIVE.</p><h1 className="mt-4">Progress Tracker</h1><p className="mt-4 max-w-2xl text-secondary">Keep a personal history of weight, measurements and strength. Review your records over time without assigning value judgments to changes.</p><ProgressTracker/></main>;
}
