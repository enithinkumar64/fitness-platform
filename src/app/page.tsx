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

        <div className="grid gap-8 pt-8 sm:grid-cols-2 sm:gap-12">
          <section id="our-vision" tabIndex={-1} aria-labelledby="vision-heading" className="scroll-mt-8 rounded-control">
            <p className="mb-3 font-mono text-xs tracking-widest text-primary">THE WHY</p>
            <h2 id="vision-heading" className="text-heading-4">Our vision</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-secondary">
              Train smarter. Fuel better. Stay free. We&apos;re building FormFuel to
              bring everyday fitness and nutrition together, with core tools that
              stay completely free.
            </p>
          </section>
          <section id="whats-coming" tabIndex={-1} aria-labelledby="coming-heading" className="scroll-mt-8 rounded-control">
            <p className="mb-3 font-mono text-xs tracking-widest text-primary">THE NEXT STEP</p>
            <h2 id="coming-heading" className="text-heading-4">What&apos;s coming</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-secondary">
              Fitness calculators, personalized workout plans, nutrition tools,
              and progress tracking are planned. These tools aren&apos;t available
              yet. We&apos;re building them one step at a time.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
