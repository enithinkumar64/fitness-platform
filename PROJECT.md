# VAJRYA Fitness Platform

Brand: **VAJRYA**. Tagline: **Train smarter. Fuel better. Stay free.**

VAJRYA is the current public name of the project formerly branded FormFuel. The existing project directory, repository, routes, storage keys, Web Lock names and historical saved-data identifiers are retained for compatibility. See README.md for the rebrand boundary and review checklist.

## Product vision

Build a dark, premium, mobile-first fitness website where core fitness tools are completely free. The website should feel polished, welcoming, and easy to use, including for people who are new to fitness. Design for phone screens first, then adapt to tablets and desktops.

Core tools must remain free. Future professional consultations may be optional paid services. Do not introduce paid APIs or services without approval.

## Product scope

### Version 1: Free fitness foundation

- Fitness calculators: basal metabolic rate (BMR), total daily energy expenditure (TDEE), calorie targets, macros, body mass index (BMI), and strength estimates.
- Personalized workout generator based on goals, available days, equipment, and experience.
- Exercise library with instructions and properly licensed demonstration videos. Record each video's source, license, and required attribution before using it.
- Workout logging and progressive overload tracking: record workouts and monitor gradual increases in training demands.
- Food and macro tracking.
- Nutrition ideas, recipes, and meal planning.
- User accounts and saved plans.
- Fitness dashboard and progress tracking.

### Version 2: AI assistance

- AI fitness chat.
- AI-assisted workout and meal suggestions.
- Smart exercise substitutions.
- More advanced personalization.

Choose AI providers, costs, and data handling only when this version is approved. AI features must not make the core tools paid.

### Version 3: Professionals and community

- Verified fitness coaches and qualified nutrition professionals.
- Coach profiles, availability, and bookings.
- Optional paid professional consultations.
- Community features.

Define credential verification, booking and payment policies, privacy safeguards, and community moderation before implementing these features.

## Technology stack

The existing project uses:

| Technology | Purpose |
| --- | --- |
| Next.js 16.4.2 with the App Router | Website framework and folder-based page routing |
| React 19.3.0 and React DOM 19.3.0 | Reusable interface components and browser rendering |
| TypeScript 5 | Code checking to help catch mistakes |
| Tailwind CSS 4 with its Turbopack integration | Styling and responsive layouts |
| ESLint 9 with Next.js rules | Checks for common code problems |
| npm and package-lock.json | Package management and recorded dependency versions |
| Git and GitHub | Local version history and remote repository |

Pages live in `src/app/`. The homepage is `src/app/page.tsx`, the shared layout is `src/app/layout.tsx`, and shared styles are in `src/app/globals.css`. Public assets belong in `public/`.

No database, account provider, food data provider, video source, AI provider, payment provider, or hosting service is selected by this document. Evaluate those choices when the relevant feature is authorized; prefer solutions compatible with free core tools.

## Design direction

- Use a consistent dark palette, readable typography, restrained accent colors, and generous spacing for a premium feel.
- Start with small screens and make layouts work at larger sizes.
- Use reusable components for repeated patterns such as buttons, inputs, cards, and navigation.
- Provide readable contrast, visible keyboard focus, clear form labels, useful error messages, and comfortable touch targets.
- Keep fitness language understandable. Show formulas, units, assumptions, and limitations for calculations, and describe outputs as estimates rather than diagnoses or guarantees.

## Page-by-page roadmap

This is a proposed sequence, not authorization to build everything. Approve and complete one page or feature per task. Larger pages must be split into focused tasks. Resolve data and account dependencies before implementing features that save personal information.

| Stage | Page or feature | Proposed address | Scope |
| --- | --- | --- | --- |
| V1 — 1 | Homepage | `/` | Introduce the product and free core tools; establish the shared design through this page |
| V1 — 2 | Calculators index | `/calculators` | Explain and link to available calculators |
| V1 — 3 | Individual calculators | `/calculators/bmr`, `/calculators/tdee`, `/calculators/calories`, `/calculators/macros`, `/calculators/bmi`, `/calculators/strength` | Build and verify one calculator per task, including formulas, units, validation, and estimate limitations |
| V1 — 4 | Workout generator | `/workouts/generator` | Generate plans from goals, days, equipment, and experience; split form and generation work into focused tasks |
| V1 — 5 | Exercise library | `/exercises` | Browse and filter exercises |
| V1 — 6 | Exercise details | `/exercises/[slug]` | Instructions and licensed demonstration videos; `[slug]` represents an exercise name in the address |
| V1 — 7 | Accounts | `/sign-up`, `/sign-in`, `/account` | Build one account page or feature per task after choosing authentication, storage, and privacy requirements |
| V1 — 8 | Saved plans | `/plans` | Save, view, and manage personal workout plans |
| V1 — 9 | Workout log | `/workouts/log` | Record exercises, sets, repetitions, and weights |
| V1 — 10 | Progressive overload | `/workouts/progress` | Show training history and gradual progression |
| V1 — 11 | Food and macro tracker | `/nutrition/tracker` | Record food intake and compare totals with chosen targets |
| V1 — 12 | Nutrition ideas | `/nutrition` | Practical nutrition ideas and navigation to nutrition tools |
| V1 — 13 | Recipes | `/recipes`, `/recipes/[slug]` | Build browsing and recipe details in separate tasks |
| V1 — 14 | Meal planner | `/nutrition/meal-planner` | Create and save meal plans |
| V1 — 15 | Dashboard | `/dashboard` | Bring together saved plans, activity, and nutrition summaries |
| V1 — 16 | Progress tracking | `/progress` | Track user-selected measurements and trends |
| V2 | AI chat | `/ai/chat` | Approved AI fitness assistance |
| V2 | AI suggestions and substitutions | Existing workout and nutrition pages | Add each AI feature separately after approval |
| V2 | Advanced personalization | Relevant plan and account pages | Expand personalization in focused tasks |
| V3 | Professional directory | `/coaches` | Discover verified coaches and qualified nutrition professionals |
| V3 | Professional profiles | `/coaches/[slug]` | Show qualifications, services, and availability |
| V3 | Bookings and consultations | `/bookings` | Book appointments and optionally pay for professional consultations |
| V3 | Community | `/community` | Introduce community features with moderation in place |

Routes are planning suggestions and may be refined before their tasks begin. Version 2 and Version 3 must not be implemented early.

## Definition of done

A page or feature is complete when:

1. It meets the agreed scope without changing unrelated features or implementing future roadmap items.
2. It uses the existing stack and follows the shared dark, premium, mobile-first design.
3. Relevant phone and desktop layouts, keyboard use, labels, focus states, and contrast have been checked.
4. Relevant inputs, invalid values, empty states, loading states, and errors behave clearly.
5. Calculations have transparent formulas, units, assumptions, and appropriate estimate qualifications. Meaningful checks cover representative inputs and edge cases.
6. Any demonstration media has documented permission or licensing and required attribution. Credentials and API keys are never exposed.
7. Available checks pass: `npm run lint`, `npx --no-install tsc --noEmit`, and `npm run build`. TypeScript is already installed; do not install tools merely to run checks. Report any failed or blocked check honestly.
8. The result has been manually checked in the browser where relevant, and test results and remaining problems are reported in beginner-friendly language.
9. Documentation and the work record below reflect what was completed and what comes next.
10. The user can review the changes. Commit and push only when explicitly requested by the user.

For documentation-only tasks, review the text, check the diff for formatting problems, and confirm file scope. Application checks are unnecessary when no application code or configuration changed.

## Work record

The initial documentation-task record below is retained as history and is not a current feature inventory. The application now includes seven calculators, 100 exercise guides, the curated Workout Planner, Nutrition Tracker and Progress Tracker. This branding task updates the public name to VAJRYA without implementing roadmap features or changing data/calculations. The launch audit records completed follow-ups and outstanding launch requirements.


### Completed

- Next.js fitness-platform project created with TypeScript, Tailwind CSS, and ESLint.
- Git initialized and GitHub connected, as confirmed by the project owner.
- Existing starter structure inspected; the homepage remains the default Next.js starter.
- Product vision, version scope, roadmap, and definition of done documented in `PROJECT.md`.
- Project-specific development rules added to `AGENTS.md` while preserving the Next.js-generated instructions.

### Upcoming

- Review this documentation and save it with Git when the user requests it.
- Agree on the homepage's content and visual direction.
- Build only the homepage in the next implementation task, then test and review it.
- Continue through Version 1 one approved page or feature at a time; save completed work with Git when explicitly requested.

No fitness features or custom website pages have been built as part of this documentation task.
