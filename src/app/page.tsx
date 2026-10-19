import Link from "next/link";

const freeTools = [
  { name: "Fitness Calculators", description: "Calories, macros, and TDEE.", icon: "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8 7h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 3h1m6 0h1" },
  { name: "Workout Plans", description: "Training plans tailored to your goals and schedule.", icon: "M7 12h10M3 10v4m4-7v10m10-10v10m4-7v4M3 12h4m10 0h4" },
  { name: "Exercise Library", description: "Learn exercises and proper technique.", icon: "M4 4h6l2 2 2-2h6v15h-6l-2 2-2-2H4V4Zm8 2v15M7 8h2m-2 4h2m6-4h2m-2 4h2" },
  { name: "Nutrition Tracking", description: "Track meals, calories, and macros.", icon: "M4 3v5a3 3 0 0 0 6 0V3M7 3v18M20 21V3c-4 2-5 8 0 9" },
  { name: "Healthy Recipes", description: "Discover nutritious meal ideas.", icon: "M12 20C4 19 3 13 4 5c8-1 14 0 15 7 0 5-3 8-7 8Zm0 0V12m0 4-4-4m4 1 4-4" },
  { name: "Progress Tracking", description: "Monitor your fitness journey over time.", icon: "M4 3v17h17M8 15l4-4 4 2 5-7m-5 0h5v5" },
];

export default function Home() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <section aria-labelledby="hero-heading" className="mx-auto max-w-7xl px-page pb-12 pt-section sm:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-8">
          <div className="min-w-0">
            <p className="mb-6 flex items-center gap-3 font-mono text-xs font-medium tracking-[0.14em] text-secondary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 shrink-0 bg-primary" />
              YOUR FITNESS. NO PAYWALLS.
            </p>
            <h1 id="hero-heading" className="text-heading-1 leading-[1.05] font-extrabold tracking-[-0.05em] xl:text-display">
              <span className="block">TRAIN SMARTER.</span>{" "}
              <span className="block">FUEL BETTER.</span>{" "}
              <span className="block text-primary">STAY FREE.</span>
            </h1>
            <p className="mt-7 max-w-xl text-body text-secondary sm:text-lg sm:leading-8">
              Your all-in-one fitness platform for smarter workouts, better nutrition,
              and meaningful progress. Built to make fitness accessible to everyone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#our-vision" className="inline-flex min-h-12 items-center justify-center gap-4 rounded-control border border-primary bg-primary px-6 py-3 text-sm font-semibold text-on-primary no-underline hover:border-primary-hover hover:bg-primary-hover hover:text-on-primary active:bg-primary-active">
                Explore Our Vision <span aria-hidden="true">↗</span>
              </a>
              <a href="#whats-coming" className="inline-flex min-h-12 items-center justify-center gap-4 rounded-control border border-border-control bg-background px-6 py-3 text-sm font-semibold text-foreground no-underline hover:bg-surface hover:text-foreground">
                See What&apos;s Coming <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="mt-4 text-caption text-secondary">In the making. Free at the core. Built for you.</p>
          </div>

          {/* Abstract training geometry, not a working chart or progress display. */}
          <div aria-hidden="true" className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="absolute inset-8 rounded-full bg-primary/5 blur-3xl" />
            <svg viewBox="0 0 400 400" fill="none" className="relative w-full text-primary" focusable="false">
              <circle cx="200" cy="200" r="176" stroke="var(--color-border)" />
              <circle cx="200" cy="200" r="140" stroke="var(--color-border)" strokeDasharray="2 10" />
              <path d="M24 200h352M200 24v352" stroke="var(--color-border)" />
              <circle cx="200" cy="200" r="104" stroke="var(--color-surface)" strokeWidth="28" />
              <path d="M200 96a104 104 0 0 1 104 104" stroke="currentColor" strokeWidth="28" />
              <path d="M200 304A104 104 0 0 1 96 200" stroke="currentColor" strokeOpacity=".35" strokeWidth="28" />
              <path d="m160 222 37-76h30l-23 47h37l-43 65h-27l24-36z" fill="currentColor" />
              <path d="M24 40V24h16m320 0h16v16M24 360v16h16m320 0h16v-16" stroke="var(--color-border-control)" strokeWidth="2" />
              <circle cx="200" cy="24" r="4" fill="currentColor" />
              <circle cx="376" cy="200" r="4" fill="currentColor" />
            </svg>
          </div>
        </div>

        <ul aria-label="Fitness categories" className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border pb-8 font-mono text-xs tracking-wide text-secondary sm:mt-14 sm:gap-x-10">
          {["Workouts", "Nutrition", "Progress"].map((label, index) => (
            <li key={label} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-primary">0{index + 1} /</span>
              {label}
            </li>
          ))}
        </ul>

        <div className="pt-8">
          <section id="our-vision" tabIndex={-1} aria-labelledby="vision-heading" className="scroll-mt-8 rounded-control">
            <p className="mb-3 font-mono text-xs tracking-widest text-primary">THE WHY</p>
            <h2 id="vision-heading" className="text-heading-4">Our vision</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-secondary">
              Train smarter. Fuel better. Stay free. We&apos;re building FormFuel to
              bring everyday fitness and nutrition together, with core tools that
              stay completely free.
            </p>
          </section>
        </div>
        <p className="mt-6 text-sm text-secondary">Available now: <Link href="/calculators/tdee" className="inline-flex min-h-control items-center rounded-control font-semibold">Free TDEE &amp; daily calorie calculator</Link>, <Link href="/calculators/macros" className="inline-flex min-h-control items-center rounded-control font-semibold">Free goal-guided macro calculator</Link>, <Link href="/calculators/bmi" className="inline-flex min-h-control items-center rounded-control font-semibold">Free adult BMI calculator</Link>, and <Link href="/calculators/body-fat" className="inline-flex min-h-control items-center rounded-control font-semibold">Free body fat calculator</Link>. The previews below are still coming soon.</p>
      </section>
      <section id="whats-coming" tabIndex={-1} aria-labelledby="tools-heading" className="mx-auto max-w-7xl scroll-mt-8 px-page pb-section pt-8 sm:pt-12">
        <div className="border-t border-border pt-10 sm:pt-14">
          <p className="mb-4 font-mono text-xs font-medium tracking-[0.14em] text-primary sm:text-sm">
            BUILT FOR YOUR FITNESS JOURNEY
          </p>
          <h2 id="tools-heading" className="max-w-3xl text-heading-2 font-bold tracking-tight">
            Everything you need. Nothing behind a paywall.
          </h2>
          <p className="mt-4 text-body text-secondary sm:text-lg">
            Explore the free fitness tools we’re building for you.
          </p>
        </div>
        <ul aria-label="Free tools" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {freeTools.map((tool, index) => (
            <li key={tool.name} className="min-w-0">
              <article aria-labelledby={`tool-${index}`} className="flex h-full flex-col rounded-panel border border-border bg-surface p-6 sm:p-7">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                  <span className="flex size-12 items-center justify-center rounded-control border border-primary/20 bg-primary/5 text-primary" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                      <path d={tool.icon} />
                    </svg>
                  </span>
                  <span className="rounded-full border border-border-control px-3 py-1 font-mono text-xs text-secondary">Coming Soon</span>
                </div>
                <h3 id={`tool-${index}`} className="text-heading-4 font-semibold">{tool.name}</h3>
                <p className="mt-3 text-sm leading-7 text-secondary">{tool.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
