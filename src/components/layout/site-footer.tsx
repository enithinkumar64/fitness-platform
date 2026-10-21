const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Our Vision", href: "/#our-vision" },
  { label: "Free Tools", href: "/#whats-coming" },
];

export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-page">
        <div className="grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr] md:gap-12 md:py-16">
          <div className="min-w-0 sm:col-span-2 md:col-span-1">
            <p className="flex items-center gap-3 text-2xl font-bold tracking-tight">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary text-on-primary" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                  <path d="M7 12h10M3 10v4m4-7v10m10-10v10m4-7v4M3 12h4m10 0h4" />
                </svg>
              </span>
              <span>VAJ<span className="text-primary">RYA</span></span>
            </p>
            <p className="mt-5 text-sm font-medium leading-7">Train smarter. Fuel better. Stay free.</p>
            <p className="mt-2 max-w-xs text-sm leading-7 text-secondary">Making fitness and nutrition accessible to everyone.</p>
          </div>

          <nav aria-labelledby="footer-explore-heading" className="min-w-0">
            <h2 id="footer-explore-heading" className="mb-4 font-mono text-xs font-semibold tracking-widest text-foreground uppercase">Explore</h2>
            <ul className="space-y-1">
              {exploreLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="inline-flex min-h-control items-center rounded-control py-2 text-sm text-secondary no-underline hover:text-primary hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <h2 id="footer-coming-heading" className="mb-4 font-mono text-xs font-semibold tracking-widest text-foreground uppercase">Coming Soon</h2>
            <ul aria-labelledby="footer-coming-heading" className="space-y-1 text-sm text-secondary">
              {["Workout Plans", "Nutrition Tracking", "Progress Tracking"].map((label) => (
                <li key={label} className="py-3">{label}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs leading-6 text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 VAJRYA. All rights reserved.</p>
          <p className="flex items-center gap-2 font-mono">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary" />
            Free at the core.
          </p>
        </div>
      </div>
    </footer>
  );
}
