import type { MetadataRoute } from 'next';
import { EXERCISES } from '../lib/exercises/exercises.ts';
import { siteSettings } from '../lib/site-url.ts';
export default function sitemap(): MetadataRoute.Sitemap {
  const { url, indexable } = siteSettings();
  if (!indexable) return [];
  return ['/', ...['tdee','macros','bmi','body-fat','ideal-weight','calories-burned','one-rep-max'].map(slug => `/calculators/${slug}`),
    '/exercises','/workout-planner','/nutrition-tracker','/progress-tracker', ...EXERCISES.map(exercise => `/exercises/${exercise.slug}`)]
    .map(path => ({ url: new URL(path, url).href }));
}
