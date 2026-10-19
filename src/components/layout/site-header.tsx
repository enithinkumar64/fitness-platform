"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const navigationSections = [
  "Calculators",
  "Workouts",
  "Exercises",
  "Nutrition",
  "Progress",
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const desktopHomeRef = useRef<HTMLAnchorElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  function closeMenu() {
    setIsOpen(false);
    toggleRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        if (headerRef.current?.contains(document.activeElement)) {
          toggleRef.current?.focus();
        }
      }
    }

    // Match Tailwind's lg breakpoint and discard stale mobile menu state.
    const desktop = window.matchMedia("(min-width: 64rem)");
    function onResize(event: MediaQueryListEvent) {
      if (event.matches) {
        if (
          mobileNavRef.current?.contains(document.activeElement) ||
          document.activeElement === toggleRef.current
        ) {
          desktopHomeRef.current?.focus();
        }
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [isOpen]);

  function navigationItems(mobile: boolean) {
    return (
      <ul className={mobile ? "flex flex-col gap-1" : "flex items-center gap-1"}>
        <li>
          <Link
            ref={mobile ? undefined : desktopHomeRef}
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={mobile ? closeMenu : undefined}
            className={`flex min-h-control items-center rounded-control border px-4 py-2 text-sm font-semibold no-underline hover:bg-surface-hover hover:text-primary ${
              pathname === "/"
                ? "border-primary/30 bg-surface text-primary"
                : "border-transparent text-foreground"
            }`}
          >
            Home
          </Link>
        </li>
        {navigationSections.map((section) => (
          <li key={section}>
            {section === "Exercises" ? <Link
              href="/exercises"
              aria-current={pathname === "/exercises" ? "page" : pathname.startsWith("/exercises/") ? "location" : undefined}
              onClick={mobile ? closeMenu : undefined}
              className={`flex min-h-control items-center rounded-control border px-3 py-2 text-sm font-semibold no-underline hover:bg-surface-hover hover:text-primary ${pathname === "/exercises" || pathname.startsWith("/exercises/") ? "border-primary/30 bg-surface text-primary" : "border-transparent text-foreground"}`}
            >Exercises</Link> :
            <span
              aria-disabled="true"
              className={`flex min-h-control cursor-default gap-1 rounded-control px-3 py-2 text-secondary ${
                mobile
                  ? "flex-wrap items-center justify-between gap-x-4"
                  : "flex-col items-center justify-center"
              }`}
            >
              <span className="text-sm font-medium">{section}</span>
              <span className="font-mono text-[0.625rem] leading-4 tracking-wide uppercase">
                Coming Soon
              </span>
            </span>
            }
          </li>
        ))}
      </ul>
    );
  }

  return (
    <header
      ref={headerRef}
      className="shrink-0 border-b border-border bg-background"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div className="mx-auto max-w-7xl px-page">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <Link
            href="/"
            aria-label="FormFuel home"
            onClick={() => setIsOpen(false)}
            className="flex min-h-control shrink-0 items-center gap-2 rounded-control text-foreground no-underline hover:text-foreground sm:gap-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary text-on-primary">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M7 12h10M3 10v4m4-7v10m10-10v10m4-7v4M3 12h4m10 0h4" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              Form<span className="text-primary">Fuel</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            {navigationItems(false)}
          </nav>

          <span className="hidden shrink-0 items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-secondary xl:inline-flex">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Free Fitness
          </span>

          <button
            ref={toggleRef}
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls={menuId}
            onClick={() => setIsOpen((open) => !open)}
            className="flex size-11 shrink-0 items-center justify-center rounded-control border border-border-control bg-surface p-0 text-foreground hover:bg-surface-hover active:bg-surface-hover lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d={isOpen ? "M6 6l12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* In-flow disclosure: no overlay, scroll lock, or trapped focus. */}
        <nav
          ref={mobileNavRef}
          id={menuId}
          aria-label="Primary mobile"
          hidden={!isOpen}
          className="border-t border-border py-4 lg:hidden"
        >
          {navigationItems(true)}
        </nav>
      </div>
    </header>
  );
}
