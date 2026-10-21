# VAJRYA

**Train smarter. Fuel better. Stay free.**

A free fitness and nutrition platform using Next.js App Router, React, TypeScript, Tailwind CSS v4 and Playwright. Current features include seven calculators, 100 exercise guides, a curated workout planner, browser-local nutrition tracking and progress tracking.

## Branding and saved-data compatibility

The public brand is VAJRYA. This is a name update, preserving the dark/lime design, shared icon, layouts, routes, formulas and existing data. The project directory and GitHub repository have not been renamed.

The old FormFuel name is intentionally retained in:

- `formfuel-nutrition-v1` and `formfuel-progress-v1`: existing browser storage keys; schema versions and record IDs are unchanged.
- `formfuel:${key}`: shared Web Lock names. Keeping them avoids splitting the synchronization protocol between already-open tabs.
- `__formfuelNutritionProxyV1`: server runtime state identifier, retained to avoid separate proxy budgets during module reloads.
- Historical stored-food fixtures and source snapshots, plus the original audit report/evidence and dated review attribution. Nutrition renders the current source label without migrating saved snapshots. New starter catalog attribution uses VAJRYA; USDA IDs, values and household conversions are unchanged.
- A narrow legacy source-label matcher in `src/lib/branding.ts` and compatibility tests that prove old records still load.

New Progress CSV downloads use `VAJRYA-progress-YYYY-MM-DD.csv`; CSV columns and values are unchanged. Existing downloaded files remain usable as files; CSV import is not implemented.

Open Graph now identifies the site as VAJRYA without inventing a production domain or social image. The existing starter favicon and unused Next.js/Vercel public assets remain unchanged; no new logo or social image was created. The existing header/footer fitness icon is reused. A branded favicon/social preview can be a separate approved asset task.

Reload all open tabs after updating so the current UI and synchronization code are loaded. Data remains browser-local: this rebrand does not provide cloud backup or cross-device synchronization. Keep using the same origin/browser profile to see existing saved data; changing domain, port or browser storage would require a separate migration plan.

## Review

Check VAJRYA in the header/footer, homepage vision, browser titles and mobile menu at 320px and desktop widths. Check the unchanged tagline, links, calculators and both trackers. With synthetic legacy records, verify the old storage keys still load and a historical food source displays the new name without rewriting its snapshot. Review the launch audit for remaining production and manual accessibility requirements.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
