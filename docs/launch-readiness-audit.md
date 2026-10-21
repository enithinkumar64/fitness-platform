# VAJRYA launch-readiness audit — Phase 1

**Audit date:** October 20, 2026 (America/Los_Angeles). **Scope:** the existing local production build, repository, current dependency advisories, isolated browser profiles, and a small number of public USDA requests. No application code, configuration, packages, tests, environment files, commits, deployment or Git history were changed. Only this report and its audit artifacts were created.

## VAJRYA branding follow-up — verified

The public name is now **VAJRYA**, with the unchanged tagline “Train smarter. Fuel better. Stay free.” The original report title was **FormFuel launch-readiness audit — Phase 1**. All original observations, severity counts, dated verification results, screenshots and evidence below remain historical; this branding follow-up does not close unrelated launch findings.

Header/footer wordmarks reuse the existing icon and typography. Homepage copy, all page and exercise metadata, accessibility labels, current catalog source labels, download filename branding and current test expectations use VAJRYA. Open Graph site name is VAJRYA; page-specific Open Graph and Twitter titles derive from each page's metadata and are browser-tested. No domain, canonical URL or social image was invented. The starter favicon and unused starter public assets are unchanged; the related asset/SEO work in FF-12 remains outstanding.

**Compatibility:** `formfuel-nutrition-v1`, `formfuel-progress-v1`, Web Lock prefix `formfuel:${key}` and runtime identifier `__formfuelNutritionProxyV1` are deliberately retained. Historical stored-food sources/fixtures and original audit evidence retain FormFuel. A narrow display formatter renders the legacy starter-catalog attribution as VAJRYA without rewriting saved snapshots. Schema versions, stable IDs, endpoints, routes, repository and directory names are unchanged. Existing same-origin browser data remains available; a future domain/origin change needs a separate migration decision. Reload all open tabs after updating.

**Data review:** comparison against the pre-change catalog confirmed that all 29 starter-food records differ only in their app source-label branding; USDA identifiers, nutrients and portions are unchanged. Nutrition/progress storage libraries, server API implementation and synchronization hook are byte-for-byte unchanged. Exercise/program source changes are comments only. No calculation or workout-program change was made.

**Verification:** lint passed; `npx tsc --noEmit` passed; standalone `npm run build` passed; unit tests **146 passed, 0 failed, 0 skipped**. Two final full `npm run test` runs each finished with **374 passed, 8 intentional skips, 0 failed**, in **49.5 s** and **50.4 s**. New tests verify current metadata across 13 representative routes, navigation/wordmarks at mobile and desktop widths, and legacy tracker-data compatibility. Existing calculator, library, planner, tracker and cross-tab suites pass. Header screenshots were inspected at 320px and 1440px. Production build/browser execution used approved unrestricted execution. An earlier overlapping TypeScript/browser-build attempt encountered disappearing generated `.next/types` files; sequential TypeScript reruns passed. No final verification remains blocked.

**Remaining review:** manually inspect brand appearance on real devices and sharing clients, screen-reader pronunciation of VAJRYA, and existing-data behavior in the owner's browser profile. Chromium automation does not establish full accessibility compliance or coverage of all browser engines. No commit, push, deployment, dependency installation or new logo was performed. This name update does not change the existing audit's hosting, privacy or reliability limitations.

### Branding change file manifest

- `PROJECT.md`
- `README.md`
- `docs/exercise-library-review.md`
- `docs/launch-readiness-audit.md`
- `docs/nutrition-tracker.md`
- `docs/progress-tracker.md`
- `src/app/calculators/bmi/page.tsx`
- `src/app/calculators/body-fat/page.tsx`
- `src/app/calculators/calories-burned/page.tsx`
- `src/app/calculators/ideal-weight/page.tsx`
- `src/app/calculators/macros/page.tsx`
- `src/app/calculators/one-rep-max/page.tsx`
- `src/app/calculators/tdee/page.tsx`
- `src/app/exercises/[slug]/page.tsx`
- `src/app/exercises/page.tsx`
- `src/app/layout.tsx`
- `src/app/nutrition-tracker/page.tsx`
- `src/app/page.tsx`
- `src/app/progress-tracker/page.tsx`
- `src/app/workout-planner/page.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/nutrition/nutrition-tracker.tsx`
- `src/components/progress/progress-tracker.tsx`
- `src/lib/branding.ts`
- `src/lib/exercises/additional-exercises.ts`
- `src/lib/exercises/exercises.ts`
- `src/lib/nutrition/foods.ts`
- `src/lib/workout-planner/substitutions.ts`
- `tests/e2e/bmi.spec.ts`
- `tests/e2e/body-fat.spec.ts`
- `tests/e2e/branding.spec.ts`
- `tests/e2e/calories-burned.spec.ts`
- `tests/e2e/exercises.spec.ts`
- `tests/e2e/footer.spec.ts`
- `tests/e2e/hero.spec.ts`
- `tests/e2e/ideal-weight.spec.ts`
- `tests/e2e/macros.spec.ts`
- `tests/e2e/metadata.spec.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/one-rep-max.spec.ts`
- `tests/e2e/progress.spec.ts`
- `tests/e2e/tdee.spec.ts`
- `tests/e2e/workout-planner.spec.ts`
- `tests/unit/branding.test.mjs`

## Fix 1 follow-up — verified

FF-01 is **addressed for new USDA imports**. The original Phase 1 audit and severity counts below are retained as a historical snapshot. At the completion of Fix 1, three original P1 issues remained open; see the later FF-02 follow-up for the current retention fix. No other finding was fixed in Fix 1.

- `src/lib/nutrition/usda.ts` now requires an explicit positive finite gram-based serving for Branded records before interpreting full nutrients as per 100 g. Branded mL, missing basis, and incompatible units are rejected; no density or household text is used to guess a nutrient denominator. Foundation, SR Legacy and Survey (FNDDS) retain their documented per-100-g interpretation.
- `src/lib/nutrition/server.ts` returns HTTP 422 with a fixed helpful message and no food payload. The existing UI therefore cannot select/log that rejected food. Unexpected upstream errors still use the generic response rather than exposing upstream details or secrets.
- Regression fixtures reproduce the original ORANGE JUICE record 2133897 fields. Unit tests cover missing/invalid basis and serving size, incompatible units, valid gram-based Branded records without double scaling, unchanged non-Branded records, and actual route-handler responses. Browser coverage mocks the rejection response and proves submission cannot log it, then logs a starter apple successfully. Existing kJ conversion, household serving, storage migration, and diary tests remain passing.
- Final verification: lint passed; TypeScript passed; standalone production build passed; unit tests **126 passed, 0 failed**; two final complete browser runs each **320 passed, 8 intentional skips, 0 failed** (40.2 s and 43.4 s).
- Earlier attempts: sandbox build failed on port binding (`Operation not permitted`); an overlapping browser startup hit the build lock. The first unrestricted browser run had **318 passed, 2 failed, 8 skips** because the new test incorrectly expected the Add food button to disappear. That assertion was corrected to verify the existing form's “Select a food first” rejection. No UI redesign was needed. Unrestricted retries succeeded.
- Limits: no volume-to-mass nutrient conversion is supported. Valid volume-based products may be unavailable until a trustworthy conversion can be established. Starter values, household portions and saved diary snapshots are unchanged. Historical imports are not retroactively revalidated; questionable old branded snapshots still require separate review. Automated tests use fixtures/mocked upstream responses rather than live API availability.

## FF-02 follow-up — resolved and verified for cooperating updated tabs

**Root cause:** Nutrition and Progress loaded localStorage once, then wrote an entire React snapshot without rereading saved state. A later save from a stale tab removed other tabs' newer records or targets. This was confirmed by the original two-tab reproductions below before implementation.

**Implementation/evidence:**

- New `src/hooks/use-browser-store.ts:8` centralizes safe loading, per-key storage-event and focus synchronization, session-only protection, accessible warnings/status, retry/reload, and clears. Its write and clear paths use exclusive `navigator.locks.request` locks named separately for the two existing storage keys, with a five-second wait timeout.
- New `src/lib/storage/transactions.ts:14` reads and validates the latest store inside that lock, applies an intended operation, validates the proposed schema, and writes it. It also checks the raw document again before writing. `unchanged` compares structured content independent of object-key ordering. This extra check is not atomic compare-and-swap.
- Nutrition adds merge into latest entries; edits/deletes check the original entry snapshot; dirty targets check the original target group. Progress's weight, measurement and strength forms retain their original edited record, pass it to the parent, and reset only on accepted changes. New Progress sequences are allocated from latest saved data under the lock. Existing IDs, units and calculation functions remain unchanged.
- Storage events update histories and summaries without replacing form drafts. Deleted records cannot be recreated by stale editors. Conflicts display an alert with cancel/reopen instructions; reload buttons reread saved data while keeping drafts. Nutrition also offers **Use latest saved targets** to explicitly discard a conflicting target draft.
- Clears participate in the lock and compare the snapshot captured at confirmation time. A queued clear refuses to erase a newer save. Nutrition now confirms bulk clear and resets its local editor/pending request identity after success, necessary to avoid local stale-editor recreation. Remote clears retain the draft but reject attempts to save the deleted ID. This also hardens related FF-03 behavior; its separate follow-up remains recorded below.
- A failed storage write retains session-only data with a clear warning. Synchronization cannot silently replace those session-only records. Reloading them requires explicit confirmation to discard session-only records. Corrupt stores are not overwritten. No migration/schema bump is needed: Nutrition version 2 with existing version-1 migration, Progress version 1, and both existing keys are preserved.

**Regression proof:** new `tests/e2e/tracker-sync.spec.ts` has twelve scenarios run in desktop and mobile projects, using real same-origin pages. They cover simultaneous additions, edits and deletions, target drafts, all three Progress record types, missed storage/focus events, storage failures, cross-tracker isolation, missing Web Locks, and a deliberately queued clear behind a newer save. Existing household-serving, migration, canonical-unit, CSV, calculator and library tests remain passing. New `tests/unit/storage-transactions.test.mjs` has seven tests for latest-state commits, structural conflicts, preparation-time changes, validation/failures, key isolation and compatibility.

**Final verification:** lint passed; TypeScript passed (`npx --no-install tsc --noEmit`); standalone `npm run build` passed; unit suite **133 passed, 0 failed, 0 skipped**. Two full final `npm run test` runs each **344 passed, 8 intentional skips, 0 failed**, taking **50.3 s** and **47.7 s**. Build/Chromium used approved unrestricted execution to permit worker ports and browser startup. No final check is blocked.

Earlier targeted development runs had 52 passes/12 failures, then 62 passes/2 failures. These caught object-key-order false conflicts, a form-reset/input race, a test's incorrect exercise selector, and tests reading storage before asynchronous saves/clears finished. Structural comparison, pending fieldsets, and completion assertions corrected them. An intermediate full run also passed 344 with 8 skips (46.5 s); the two final runs above include the last schema-validation and storage-failure refinements.

**Guarantees/limits:** serialized read-modify-write applies to updated same-origin tabs that all participate in Web Locks. Web Locks require a supported secure context (HTTPS/localhost); without them persistent mutations fail closed and inputs remain available. Old open versions, unrelated scripts/extensions/DevTools and browser/site-data clearing are outside the protocol. Reload **all** FormFuel tabs after updating. A raw snapshot check alone cannot prevent a non-cooperating simultaneous writer. Equal content that changes and later reverts is not a persistent revision history. No cloud backup, cross-device sync, storage encryption or new service was added. Chromium is tested; other browsers require manual review. See both tracker documents for recovery details.

FF-01 and FF-02 are now addressed within their stated scope. Original Phase 1 severity counts below are historical; FF-03/FF-04 remain separately tracked, with related FF-03 clear hardening noted rather than silently erasing the original evidence.

## USDA API protection follow-up — partially mitigated (audit FF-04)

**ID clarification:** this implementation was requested as “FF-03: USDA API Rate Limiting and Protection.” In the original audit, this is **FF-04**; FF-03 remains the separate Nutrition clearing finding. IDs are not renamed.

**Root cause and scope:** existing route handlers delegated to `src/lib/nutrition/server.ts`, which validated queries/IDs, used an eight-second timeout and cached successful normalized responses, but had no attempt budgets, concurrency control or in-flight coalescing. Unique queries bypassed cache reuse. Public callers could spend the shared USDA key allowance or create excessive concurrent work. There was no deployment-wide limiter/host policy established by repository configuration.

**Implemented:** both route handlers still call the same `nutritionRequest`. `src/lib/nutrition/server.ts` now uses a shared `globalThis` handler within a JavaScript runtime, with testable clock/fetch dependencies. New `src/lib/nutrition/proxy-protection.ts` contains rolling-window budgets and bounded JSON body reading. Actual thresholds are:

| Control | Per-runtime threshold |
| --- | --- |
| Incoming calls across both routes | 120 per rolling minute, including invalid requests/cache hits/coalesced callers |
| New upstream attempts | 30 per rolling minute **and** 600 per rolling hour, including failed attempts |
| Distinct concurrent upstream calls | 4; excess gets HTTP 429, Retry-After: 1 |
| Identical in-flight calls | Coalesced by normalized endpoint/query or ID |
| Upstream body | 1 MiB maximum; declared and streamed byte checks, cancellable reader |
| Cache | Successful normalized responses only, max 100 entries and 8 MiB serialized payloads, search TTL 5 minutes/detail TTL 24 hours |
| Existing controls retained | 2–80-character search, 12 results, positive IDs up to 9 digits, 8-second abort timeout |

Budget rejections return HTTP 429 with integer-seconds Retry-After until budget recovery and a fixed helpful starter-catalog fallback message. Upstream 429 applies a shared-runtime cooldown: numeric retry is bounded to 1–3,600 seconds; other formats/missing values default to 60 seconds. Cached results are available during upstream quota/cooldown limits, subject to the incoming allowance. State has bounded cache/counter/pending-map sizes; no untrusted IP-header identity map or unbounded waiting queue is added. Missing configuration, invalid inputs, missing food, unsupported nutrition basis and upstream failures remain distinct HTTP 503/400/404/422/502 outcomes. Error bodies/exception details and API credentials are not exposed.

**Verification:** lint passed; `npx --no-install tsc --noEmit` passed; standalone production build passed; unit suite **144 passed, 0 failed, 0 skipped**. Two final complete browser runs each **348 passed, 8 intentional skips, 0 failed**, taking **45.7 s** and **46.6 s**. An intermediate full run passed 348 with 8 skips (45.1 s) before the final distinct-404 handling and extra unit cases. Eleven new deterministic handler/helper tests use synthetic credentials, fake time and mocked USDA responses; no live USDA quota was consumed. They cover normal/cache/result limits, shared search/detail thresholds, rolling recovery/boundaries, hourly budget, concurrency/coalescing, missing key, validation, cooldown/errors/timeouts, response size/cancellation, and released slots. Browser/API coverage adds 429 UX/local-catalog fallback and real invalid-input route checks. Existing nutrition units, migrations, household servings and cross-tab regressions remain passing. A private exact-value scan found no configured USDA key in 23 generated client JS assets; only boolean/count results were emitted. No dependency, food catalog, nutrition formula, diary, serving or styling change was made.

**Status: PARTIALLY MITIGATED, not fully resolved for public deployment.** JavaScript workers, isolates, processes, replicas, serverless cold starts and regions have independent/reset state. These controls are neither per-user nor deployment-wide. An attacker can exhaust the shared local budget and affect other legitimate users; Next.js still receives the incoming traffic; other consumers of the same USDA key still spend its allowance. No claim of denial-of-service resistance or production-host verification is made.

**Required before public USDA exposure:** verify the intended hosting model; add trusted edge/reverse-proxy per-client/request-size/slow-client protections and an atomic shared USDA-key budget/concurrency policy across all instances, using approved infrastructure. Do not use client-supplied IP headers as trusted identity without the host overwriting them. No paid service/new credentials were introduced. If those controls are unavailable, leave `FDC_API_KEY` unset publicly: the starter catalog and diary still work. Monitor actual aggregate quota/rejection rates without secrets or diary data. See `docs/nutrition-tracker.md` for exact cache/retry/error semantics and the installed official Next.js self-hosting guide for reverse-proxy and multi-instance considerations. Production host/global limiter configuration remains an owner decision; the launch checklist item stays open.

## Progress accessibility follow-up — original FF-10 / FF-11 (P2)

**Original evidence reviewed before editing:** FF-10's axe-core 4.14.0 populated scans in `docs/audit-artifacts/evidence.json` show two serious `definition-list` violations at both 320px and 1440px: `#body-weight > dl` and the measurement summary list, with `div > p` disallowed siblings. FF-11's original MutationObserver reproduction recorded zero live-region mutations on the second successful Progress save. The original audit priorities remain **P2**, independent of axe's rule-impact label.

**FF-10 status: resolved for the documented populated-summary markup defect.** `src/components/progress/weight-tracker.tsx:14` and `measurement-tracker.tsx:14` now place supplementary date/change paragraphs inside their corresponding `dd`, leaving each description-list group as a term plus description. The weight value uses a styled span so its number and supplementary date retain their original typography. Strength summaries already had valid term/description structure; they are tested but not rewritten. No unnecessary ARIA, new design system, calculation or storage change was made.

**FF-11 status: Progress-specific DOM defect corrected; broader finding partially addressed.** `src/components/progress/progress-tracker.tsx` uses a presentation-only operation sequence to replace the status child for each notification inside the same existing `role="status"` container. Repeated add/edit/delete wording now produces DOM updates without showing or persisting the sequence. Rejected save/delete attempts produce a fresh status directing users to the existing conflict/storage alert while preserving the form draft. Clear/export notifications use the same presentation mechanism. No shared synchronization code or mutation logic changed. Nutrition's analogous constant-message pattern remains outside this task; actual spoken announcements still require assistive-technology review. This is not a claim of full FF-11 closure or WCAG conformance.

**Automated evidence:** new `tests/e2e/progress-accessibility.spec.ts` has four scenarios run in both Chromium projects:

1. Real UI-populated weight, measurement and strength summaries; valid description-list children; date/change/value association; unchanged missing measurements; expected strength values. Existing locked `axe-core` runs against populated `main` at 320px and 1440px, with **zero violations** in all four profile/width combinations per final suite. Axe results (including incomplete checks) and screenshots are attached to the Playwright report; no dependency was added.
2. Keyboard Enter/Space expansion/collapse of all chart data tables; meaningful chart accessible names; three-pixel focus outlines; meaningful edit/delete names; edit focus, validation focus, and native cancel/confirm deletion handling.
3. MutationObserver confirms updates for repeated successful adds, edits and deletions. Edited record IDs and the version-1 storage shape remain unchanged.
4. Two real tabs confirm conflicting input remains, saved data is not overwritten, the conflict alert is present, and repeated rejected saves create status mutations. Existing cross-tab and all other functional tests remain passing.

**Final verification:** lint passed; `npx --no-install tsc --noEmit` passed; standalone `npm run build` passed; unit suite **144 passed, 0 failed, 0 skipped**. Two final full browser runs each **356 passed, 8 intentional skips, 0 failed**, taking **47.6 s** and **48.3 s**. Production worker ports/Chromium used approved unrestricted execution; no final check was blocked. Earlier focused tests passed 50/50. The first full run passed 354 with two failures and eight skips because the new test's unscoped alert selector also matched Next.js's separate route announcer. Scoping it to Progress's `main` corrected the test; no application workaround was added.

**Remaining manual checks:** VoiceOver/Safari and NVDA/Firefox or Chrome for actual term/value reading, repeated operation/conflict/error announcements and duplicate/coalesced notifications; native OS/browser confirmation-dialog keyboard/announcement behavior; real mobile date/select/keyboard controls; 200% zoom/text spacing; and any axe incomplete results. The shared synchronization announcer was not redesigned. Automated keyboard/dialog tests and DOM mutations do not prove real screen-reader behavior. No complete WCAG compliance claim is made. Review details are in `docs/progress-tracker.md`.

**Files:** three Progress components above, new `tests/e2e/progress-accessibility.spec.ts`, and the requested two documents. No formula, storage key/schema, record ID, shared synchronization hook, catalog, package, branding or unrelated component was changed. Historical audit evidence below is retained.

## FF-11 Nutrition follow-up — confirmed DOM defect resolved in both trackers (P2)

**Original ID/severity retained: FF-11, P2.** This follow-up supersedes earlier notes that the Nutrition counterpart was open. Original evidence and prior task records remain below as history.

**Pre-fix confirmation:** the original audit directly measured Progress's repeated-save problem and identified Nutrition's matching string-state pattern. Before changing Nutrition, the new browser regression logged two apples in each Chromium profile and attached a MutationObserver to the existing `Food added.` status paragraph. The second successful addition produced **zero mutations**, despite two valid diary entries. Both expected pre-fix tests failed with received 0 / expected greater than 0. This confirms the Nutrition DOM defect rather than assuming an unmeasured screen-reader outcome.

**Root cause:** repeated actions reused constant strings (`Food added.`, `Entry updated.`, `Entry deleted.`, targets and warning/error messages). React could leave an existing live region's content unchanged. Repeated external synchronization also retained the same text while the diary changed. Conditional USDA error statuses could be inserted already containing text. Existing input labels, native confirmation, focus outlines and live quantity preview were not established defects and were not redesigned.

**Nutrition-only presentation changes:** `src/components/nutrition/nutrition-tracker.tsx` adds local text/revision notices and a `NutritionNotice` span whose child render identity changes when text or revision changes. The live containers retain their polite status / assertive alert semantics. Add/edit/delete, targets and clear success notices refresh even with identical wording; repeated entry/target errors refresh while retaining existing field/error associations and entry-error focus. Blocked operations refresh the existing storage/conflict alert and clear stale success text rather than announcing a second generic failure. Session-only warnings stay explicit. Duplicate generic local-save/clear notices are suppressed when the action-specific notice already confirms that operation. The USDA error status container now exists before its message arrives; no USDA request/parsing change is made.

Repeated synchronization notices use the new displayed diary object's identity. A Nutrition-only storage-event observer increments warning presentation identity for matching events, without reading/writing entries, merging stores or changing the shared synchronization hook. No arbitrary announcement delay, extra focus shift, whole-diary serialization or persistent revision field was introduced. Counters stay in component state. Form drafts, values, serving snapshots, IDs and storage schemas are unchanged.

**Regression evidence:** new `tests/e2e/nutrition-announcements.spec.ts` has six scenarios per Chromium project: repeated additions; repeated edits/deletes with stable IDs/serving snapshots; repeated quantity/target errors with drafts retained; repeated synchronization and blocked stale edits in two real pages; repeated storage failures and clear/cancel; target saves plus keyboard/axe checks. MutationObservers inspect the actual relevant live-container subtree, not unrelated page changes. Populated/error-state axe checks against `main` at 320px and 1440px report **zero violations in all four profile/width combinations** per final suite. Results (including incomplete checks) are attached to the Playwright report. Existing locked axe-core was reused; no dependency added.

**Both portions verified:** the existing `tests/e2e/progress-accessibility.spec.ts` remains passing in the same full runs, including repeated adds/edits/deletes and blocked conflicts. FF-11 is therefore **resolved for the confirmed DOM-update defect on both routes**. Actual speech delivery, ordering, coalescing and verbosity still require VoiceOver/NVDA release review. No full WCAG compliance or universal screen-reader guarantee is claimed.

**Final verification:** lint passed; `npx --no-install tsc --noEmit` passed; standalone `npm run build` passed; unit suite **144 passed, 0 failed, 0 skipped**. Two complete final browser runs each **368 passed, 8 intentional skips, 0 failed**, taking **48.7 s** and **50.5 s**. Production worker ports/Chromium used approved unrestricted execution; no final command remains blocked. An earlier focused run had 72 passes and two failures because the new edit test assumed row position stayed fixed; the existing diary appends an edited record. Correcting the selector to follow the intended entry fixed the test without changing diary behavior. An intermediate full run passed 368 with 8 skips (47.3 s) before suppressing duplicate generic local-success notices.

**Scope:** `src/components/nutrition/nutrition-tracker.tsx`, new `tests/e2e/nutrition-announcements.spec.ts`, `docs/nutrition-tracker.md`, and this report. Progress implementation, nutrition formulas, USDA parsing/protection, serving conversions, diary schemas/IDs and cross-tab synchronization code were not changed. Remaining manual steps are documented in the Nutrition guide and the launch checklist.

## A. Executive summary

**Recommendation: address the four P1 findings before an unrestricted public launch.** The core site is functional, and the existing verification suite passes. Those tests do not cover several confirmed nutrition and data-retention defects found during this audit.

| Severity | Count | Meaning |
| --- | ---: | --- |
| P0 | **0** | No confirmed critical compromise or site-wide launch blocker discovered |
| P1 | **4** | Should fix before launch; one is conditional on exposing the USDA proxy without hosting-level protection |
| P2 | **7** | Confirmed defects or gaps worth fixing; not all are blockers |
| P3 | **3** | Optional polish or maintenance improvements |
| Total | **14** | Each issue has one ID below; repeated references do not count again |

Top five concerns:

1. **FF-01:** volume-based branded USDA nutrition can be accepted as nutrition per 100 g.
2. **FF-02:** a second browser tab can silently overwrite another tab's progress or food entries.
3. **FF-03:** Nutrition's bulk clear has no confirmation and leaves an edit form able to restore a cleared entry.
4. **FF-04:** the public USDA proxy has no application-level throttling or concurrency protection; hosting safeguards are unverified.
5. **FF-10:** populated Progress summaries contain invalid definition-list markup detected by axe; empty states do not expose it.

No broken **internal** route links were found in the 112 unique destinations crawled. All 56 initial viewport checks passed the horizontal-overflow check. Public USDA source links are a separate confirmed problem (FF-07).

The current active USDA key was not found in tracked files, checked historical text blobs, or browser JavaScript bundles. No environment values are included here. The dependency audit reports **five high affected development dependency nodes in one advisory chain, zero critical findings, and zero known production dependency vulnerabilities**. This is a scoped audit, not a security or WCAG certification.

### Evidence and artifacts

- [Machine-readable evidence](audit-artifacts/evidence.json): viewport checks, axe findings, HTTP statuses, performance samples, safe secret-scan summaries, dependency results and synthetic reproductions.
- [Homepage 320px](audit-artifacts/home-320.png), [TDEE 375px](audit-artifacts/tdee-375.png), [Exercise Library 768px](audit-artifacts/exercises-768.png), [homepage 1440px](audit-artifacts/home-1440.png).
- Populated 320px states: [macros](audit-artifacts/macros-results-320.png), [workout plan](audit-artifacts/workout-results-320.png), [nutrition](audit-artifacts/nutrition-results-320.png), [progress](audit-artifacts/progress-results-320.png).

Screenshots use empty or synthetic audit records, never the owner's saved browser data. The browser automation used fresh isolated profiles. Evidence was collected before any fixes; this task implements none.

## Project and actual route inventory

Confirmed from `src/app/**/page.tsx`, route handlers, `generateStaticParams`, production build output and HTTP requests:

| Route | Implementation |
| --- | --- |
| `/` | `src/app/page.tsx` |
| `/calculators/tdee` | `src/app/calculators/tdee/page.tsx` |
| `/calculators/macros` | `src/app/calculators/macros/page.tsx` |
| `/calculators/bmi` | `src/app/calculators/bmi/page.tsx` |
| `/calculators/body-fat` | `src/app/calculators/body-fat/page.tsx` |
| `/calculators/ideal-weight` | `src/app/calculators/ideal-weight/page.tsx` |
| `/calculators/calories-burned` | `src/app/calculators/calories-burned/page.tsx` |
| `/calculators/one-rep-max` | `src/app/calculators/one-rep-max/page.tsx` |
| `/exercises` | `src/app/exercises/page.tsx` |
| `/exercises/[slug]` | 100 statically generated guides; `src/app/exercises/[slug]/page.tsx:8–18` |
| `/workout-planner` | `src/app/workout-planner/page.tsx` |
| `/nutrition-tracker` | `src/app/nutrition-tracker/page.tsx` |
| `/progress-tracker` | `src/app/progress-tracker/page.tsx` |
| `/api/nutrition/search` | GET handler in `src/app/api/nutrition/search/route.ts` |
| `/api/nutrition/food` | GET handler in `src/app/api/nutrition/food/route.ts` |

There are **112 public HTML page destinations**: 12 non-detail pages plus 100 guides. The build's 117 generated entries also include framework/API/metadata entries; they are not 117 exercise or product pages. Unknown exercise slugs return HTTP 404. No `/calculators` index, `/progress`, `/nutrition/tracker`, `robots.txt` or `sitemap.xml` route exists in this snapshot. Planning routes in PROJECT.md are not the current route inventory.

Stack: Next.js 16.4.2 App Router, React 19.3.0, TypeScript 5, Tailwind CSS v4, Geist fonts, native Node unit tests and Playwright Chromium desktop/mobile. No chart library is installed. There are 100 exercises, 77 video references, 29 starter foods, and 65 household options across 27 foods. The other two starter foods intentionally support grams only.

## B. Prioritized issue register

### FF-01 — Branded liquid nutrient basis is not validated

**Fix 1 status: addressed and verified for new imports.** See the follow-up verification above. Original pre-fix evidence is retained below; historical saved imports are not rewritten.

- **Severity/status:** **P1 — confirmed**, including an actual public USDA record and live application endpoint response.
- **Affected route:** `/nutrition-tracker`, `/api/nutrition/food`.
- **Files/lines:** `src/lib/nutrition/usda.ts:26–43`, especially the per-100-g assumption at line 33; `src/lib/nutrition/usda-portions.ts:56–68`; `src/components/nutrition/nutrition-tracker.tsx:92–96,152`; `src/lib/nutrition/core.ts:84–93`.
- **Evidence/reproduction:** USDA branded record **2133897**, ORANGE JUICE, reports `servingSize=240`, `servingSizeUnit=ml`, and energy 46 with complete required nutrients. FormFuel's GET `/api/nutrition/food?id=2133897` returned HTTP 200 with those values under `per100g`, no household servings, and therefore a grams fallback. A direct pure-function reproduction also accepted a synthetic volume-basis record and permitted a 100 g diary entry. Rejecting mL household portions does **not** reject the food's unknown mass basis.
- **Source:** USDA's [Branded Foods documentation](https://fdc.nal.usda.gov/GBFPD_Documentation/), “Standardizing and Presenting GBFPD Data,” states that a 100-unit basis can be grams or milliliters depending on submitted data. Nutrient units such as kcal and g alone do not establish the food's denominator.
- **Impact:** users can log a liquid as weighed grams without a verified density/mass conversion. The exact error depends on the product; no claim is made that every liquid has the same error. The verified SR Legacy starter foods are not implicated.
- **Recommended fix:** establish and preserve the normalization basis. The smallest safe initial fix is to refuse Branded records without a verified gram basis, explicitly including mL-based records, until a food-specific mass conversion is available. Add real-shaped mL/unknown-basis regression fixtures and a browser test proving no diary addition is possible. Existing questionable branded snapshots need a separate review: do not silently rewrite historical nutrition from guessed density.

### FF-02 — Stale tabs silently overwrite diary data

- **Severity/status:** originally **P1 — confirmed for both trackers**; **resolved and verified for cooperating updated tabs** in the FF-02 follow-up above. Pre-fix evidence follows.
- **Affected routes:** `/nutrition-tracker`, `/progress-tracker`.
- **Files/lines:** `src/components/nutrition/nutrition-tracker.tsx:25–40,44–54`; `src/components/progress/progress-tracker.tsx:10–24`. Both initialize once, retain an in-memory snapshot, and replace the whole localStorage document. Neither subscribes to storage changes or checks a write revision.
- **Reproduction:** open two tabs before making any entries. In Progress, save 80 kg in A, then 81 kg in B. Storage contains **one entry, 81 kg**; A still shows 80 kg. In Nutrition, save eggs in A, then apples in B; storage contains only the apple entry. No conflict prompt appears. These tests used synthetic records only.
- **Impact:** valid entries, edits, or targets from another tab can disappear on reload. Documentation mentioning the limitation does not prevent the overwrite, and the visible Progress privacy text does not warn specifically about tabs.
- **Recommended fix:** detect external revisions, block stale writes with a clear refresh/conflict flow, or merge operations safely by entry ID with explicit deletion/conflict semantics. Include two-tab add/edit/delete and clear tests. At minimum, do not let a known-stale tab replace the entire store. Shared localStorage alone is not a transaction/merge mechanism.

### FF-03 — Nutrition bulk clear is irreversible without confirmation and retains stale editing state

**Related FF-02 hardening:** Nutrition now confirms clear, resets the local editor on success, and blocks remote stale-editor saves. This original finding is retained for its separate destructive-action/undo and pending-request follow-up; the following reproduction describes the pre-fix audit snapshot.

- **Severity/status:** **P1 — confirmed**.
- **Affected route:** `/nutrition-tracker`.
- **Files/lines:** `src/components/nutrition/nutrition-tracker.tsx:135–144,152–154`.
- **Reproduction:** log two eggs, edit that entry, then select **Clear stored diary and targets**. No browser confirmation occurs; localStorage is removed immediately. The form still says **Save entry**. Selecting Save entry recreates the cleared entry from stale state. Reproduction recorded zero confirmation dialogs, null storage after clear, and one restored entry after saving the stale editor.
- **Impact:** an accidental activation deletes all dates and targets, not just the visible day. There is no Nutrition export/undo recovery. The retained editor also contradicts the cleared state.
- **Recommended fix:** confirm or provide a reliable undo for bulk destruction; reset food, edit ID, quantity, errors and pending request identity when clearing. Consider undo for single-entry deletion. Add tests for cancel/confirm, editing during clear, and pending USDA results during clear. Progress already has confirmation and form resetting; reuse that interaction pattern where appropriate.

### FF-04 — USDA proxy lacks application-level abuse protection

- **Severity/status:** **P1 — partially mitigated** by the USDA API protection follow-up above; shared deployment-wide protection remains unverified. The evidence below describes the original pre-fix snapshot.
- **Affected routes:** `/api/nutrition/search`, `/api/nutrition/food`.
- **Files/lines:** both `src/app/api/nutrition/*/route.ts:1–2`; `src/lib/nutrition/server.ts:8–27,48–50`; `next.config.ts:3–14`.
- **Evidence:** bounded input, 12 search results, an eight-second timeout and a bounded process cache are present, but there is no per-client/global request budget, concurrency cap or in-flight request deduplication. Unique valid searches bypass cache reuse. Successful unauthenticated local requests were verified; no quota-exhaustion or denial-of-service test was attempted.
- **Impact:** if deployed without upstream protection and with USDA enabled, callers can consume the shared free USDA quota and deny live search to other users. The starter catalog still works, so this is not a site-wide P0 failure. USDA documents default quota limits and HTTP 429 in its [API guide](https://fdc.nal.usda.gov/api-guide/).
- **Recommended fix:** decide the host first, enforce a suitable shared request budget/concurrency limit there or in the server layer, and add cache-aware request coalescing. Do not rely solely on per-process memory in a multi-instance deployment. Verify the actual platform policy before public exposure; otherwise launch with live USDA search disabled while local food logging remains available.

### FF-05 — Available tools are still advertised as Coming Soon

- **Severity/status:** **P2 — confirmed product-content/navigation inconsistency**, not broken route links.
- **Affected routes:** homepage and shared header/footer on all pages.
- **Files/lines:** `src/app/page.tsx:3–9,80–84,94–111`; `src/components/layout/site-header.tsx:7–13,81–100`; `src/components/layout/site-footer.tsx:38–43`.
- **Evidence:** working calculator/library/planner/nutrition/progress links appear above six noninteractive Coming Soon cards, including the same implemented categories. The header says **Calculators — Coming Soon** despite seven working calculator pages. Footer Workout Plans, Nutrition Tracking and Progress Tracking remain under Coming Soon. Screenshots show the contradiction.
- **Impact:** visitors may conclude working tools are unavailable, and calculators have no direct shared-navigation entry point.
- **Recommended fix:** distinguish available tools from genuinely future capabilities, link only real routes, and keep Healthy Recipes/future functionality accurately labeled. Provide access to the seven existing calculators through a minimal menu or an explicitly approved index. Update tests currently asserting these obsolete Coming Soon counts rather than simply deleting navigation coverage.

### FF-06 — Production SEO identity and crawl-discovery files are absent

- **Severity/status:** **P2 — confirmed omissions; production domain is an owner decision**.
- **Affected routes:** all public pages, `/robots.txt`, `/sitemap.xml`.
- **Files/lines:** `src/app/layout.tsx:17–21`; `src/app/exercises/[slug]/page.tsx:8–14`; no `src/app/robots.ts`, `src/app/sitemap.ts` or public equivalents exist.
- **Evidence:** all 14 inspected page types have titles/descriptions, but none has a canonical link or Open Graph metadata. Both discovery endpoints return HTTP 404. No production metadataBase/canonical host is configured. Exercise detail metadata is unique by exercise name; details are statically generated and reachable.
- **Impact:** weaker discovery/consolidation across host aliases, query variants or preview environments. **Missing robots.txt is not a crawl block**, and missing sitemap does not mean the pages cannot be indexed.
- **Recommended fix:** after the owner supplies the real HTTPS host, configure canonical URL generation and a sitemap containing the 112 actual public destinations, plus a simple robots policy referencing it. Decide preview/staging indexing separately. Do not invent a domain or put localhost in production canonicals.

### FF-07 — USDA source/portion web links return HTTP 404

- **Severity/status:** **P2 — confirmed for three sampled source records; full external coverage requires follow-up**.
- **Affected route:** `/nutrition-tracker` source record and portion attribution links.
- **Files/lines:** `src/components/nutrition/nutrition-tracker.tsx:152`; `src/components/nutrition/food-quantity-fields.tsx:34`; `src/lib/nutrition/foods.ts:24,34` and other serving references; `src/lib/nutrition/servings.ts:20–22`; `src/lib/nutrition/usda-portions.ts:50–52`.
- **Evidence:** GET with redirects enabled returned HTTP 404 for `https://fdc.nal.usda.gov/food-details/171688/nutrients`, `/173944/nutrients`, and `/168878/nutrients`. These are the exact generated apple, banana and rice link patterns. Valid USDA API records/values do not make the web-page links valid.
- **Impact:** users cannot follow the sampled attribution links to verify food or portion values. Stored serving validation also hardcodes that pattern, so a future permalink correction needs historical-snapshot compatibility.
- **Recommended fix:** verify USDA's currently supported public food permalink format, then update source presentation and future references without guessing URLs or embedding a private key. If no stable record page is available, show the FDC ID and a working official data/search destination with honest labeling. Preserve historical snapshots and migrate reference validation safely. Recheck all generated sources after the correction; this audit does not claim all 65 links were individually fetched.

### FF-08 — High-severity advisory in development-only ESLint dependency chain

- **Severity/status:** **P2 — confirmed by current npm audit**, not evidence of a remotely exploitable production application.
- **Affected component:** lint/CI tooling.
- **Files/lines:** `package.json:18–27`, especially `eslint-config-next` at line 25; relevant `package-lock.json` nodes for `@next/eslint-plugin-next`, `fast-glob`, `micromatch`, and `braces`.
- **Evidence:** full audit exit 1: **5 high, 0 critical** affected nodes. Chain: `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. The underlying advisory is [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack exhaustion on deeply nested patterns, affecting braces through 3.0.3. This is one advisory propagated through five package nodes, not five independent exploits. Production-only audit exits 0 with zero findings.
- **Impact:** development/CI availability risk if attacker-controlled patterns reach the tool; no public API-to-glob path was found. The advisory lists no patched braces version at audit time.
- **Recommended fix:** review the supported tooling-chain remediation when available and constrain untrusted lint/glob inputs meanwhile. npm's reported fix suggestion is a semver-major change to eslint-config-next **14.2.35**, a downgrade from this project's 16.4.2; do not blindly apply it to a Next 16 project. No audit fix, package installation, override or upgrade was performed.

### FF-09 — Full educational exercise content is shipped to client-side tools

- **Severity/status:** **P2 — confirmed payload overhead; not a demonstrated Core Web Vitals failure**.
- **Affected routes:** Exercise Library, Workout Planner, Progress Tracker; normal navigation prefetch also loads shared feature chunks.
- **Files/lines:** `src/lib/progress/tracker.ts:1,20`; `src/components/progress/strength-tracker.tsx:3–4`; `src/lib/workout-planner/generator.ts:1–3`; `src/components/exercises/exercise-library.tsx:3–6`; full data in `src/lib/exercises/exercises.ts` and `additional-exercises.ts`.
- **Evidence:** this build's shared exercise chunk `07bp9eemt85s0.js` is **132,048 raw bytes** and contains full written instructions. It is present in the recorded client script requests. Its local gzip size is 26,931 bytes; observed HTTP encoded size was 26,925 bytes. Cold-cache local route samples requested about **197.4 KiB encoded JavaScript** across 11 resources including normal automatic prefetch; TDEE was 201.1 KiB/12. These are observations of this build, not universal performance scores.
- **Impact:** tools that need names, IDs, slugs, difficulty/equipment and programming metadata also deliver instructions, safety text and video attribution. This consumes additional bandwidth and parsing work, particularly on low-end phones.
- **Recommended fix:** derive a slim typed client-side projection while keeping full guide content server-side and preserving stable IDs. Measure again before changing prefetch behavior; route-prefetch speed is a trade-off. Do not claim that catalog slimming alone guarantees a Core Web Vitals improvement.

### FF-10 — Populated Progress summaries have invalid definition-list structure

- **Severity/status:** **P2 — resolved for the documented markup defect**, supported by the Progress accessibility follow-up above. Original pre-fix evidence follows.
- **Affected route:** `/progress-tracker`, after weight/measurement data exists.
- **Files/lines:** `src/components/progress/weight-tracker.tsx:14`; `src/components/progress/measurement-tracker.tsx:14`.
- **Evidence:** axe-core 4.14.0, WCAG-tagged checks, reports serious `definition-list` violations in both populated 320px and 1440px states. The latest-date/change `<p>` is placed after `<dd>` as a sibling within the `<dl>` grouping `<div>`, producing `div > p` content that is not part of a valid term/description group. Two affected list nodes were detected per populated scan. Empty-state scans had no such error because the paragraphs are conditional.
- **Impact:** invalid programmatic relationships can impair assistive interpretation of the summaries. Exact screen-reader behavior still needs manual review.
- **Recommended fix:** move supplementary date/change text inside the corresponding `<dd>` or outside the `<dl>`, preserving the visual grouping. Add accessibility checks with saved data, not just empty pages.

### FF-11 — Repeated save notifications do not update the live region

- **Severity/status:** **P2 — resolved for the confirmed DOM-update defect in both Progress and Nutrition**, verified in the Nutrition follow-up above. Real assistive-technology release review remains open; original pre-fix evidence follows.
- **Affected routes:** `/progress-tracker`; the same constant-message pattern exists in Nutrition.
- **Files/lines:** `src/components/progress/progress-tracker.tsx:26–27,45`; `src/components/nutrition/nutrition-tracker.tsx:117–125,157`.
- **Evidence:** after a first successful Progress save, a MutationObserver attached to the `Progress entry saved.` live region recorded **zero mutations on the next successful save**. React receives the same status string, so the live-region text does not change. Nutrition repeatedly sets `Food added.` in the same way; that route's repeated-save screen-reader behavior was not separately measured.
- **Impact:** users relying on announcements may not receive confirmation for subsequent saves even though the data changed. An initial announcement alone does not validate repeated interactions.
- **Recommended fix:** announce meaningful event-specific text (entry type/date/count or operation identity), or deliberately manage repeated announcements while avoiding unnecessary verbosity. Verify repeated add/edit/delete with VoiceOver/NVDA. Do not treat the MutationObserver as a substitute for assistive-technology testing.

### FF-12 — Social metadata and favicon do not complete the FormFuel branding

- **Severity/status:** **P3 — confirmed omissions/branding polish**, not a functional or indexing blocker.
- **Affected component:** root metadata and browser/social presentation.
- **Files/lines:** `src/app/layout.tsx:17–21`; `src/app/favicon.ico` (binary, no line numbers); no Open Graph image route/file exists.
- **Evidence:** inspected pages expose no `og:*` tags or social preview image. Rendering the existing favicon shows the starter **N** icon, not the FormFuel identity. No social-platform fetch or preview-cache test was performed.
- **Impact:** browser tabs and shared links do not consistently convey the product brand. Platforms may fall back to title/description, but preview appearance is not guaranteed.
- **Recommended fix:** use an approved brand favicon and a simple reusable Open Graph card, plus truthful metadata after the production host is decided. No ratings, credentials, testimonials or domain were invented during this audit.

### FF-13 — No keyboard skip-to-content link

- **Severity/status:** **P3 — confirmed absence; optional accessibility improvement**, not a claimed WCAG failure by itself.
- **Affected component:** shared layout/header.
- **Files/lines:** `src/app/layout.tsx:29–32`; `src/components/layout/site-header.tsx:120–149`; page `<main>` elements have no shared skip target.
- **Evidence:** keyboard navigation begins with branding and repeated navigation links; no skip link exists. Main landmarks and page headings already help screen-reader navigation, and axe did not flag a bypass failure.
- **Impact:** keyboard-only users must repeatedly traverse the header when moving between tools.
- **Recommended fix:** add a visible-on-focus skip link and a consistent main-content target. Test focus and scroll behavior on desktop/mobile without disrupting the existing menu.

### FF-14 — PROJECT.md work record contradicts the implemented product

- **Severity/status:** **P3 — confirmed internal maintenance issue**.
- **Affected component:** project documentation and future task scoping.
- **Files/lines:** `PROJECT.md:119–132`; planned routes in its roadmap also differ from the verified inventory above.
- **Evidence:** the work record still says the homepage is the default starter, that no fitness features have been built, and that building the homepage is upcoming. The repository contains the completed tools and 100 guides.
- **Impact:** future contributors/agents explicitly instructed to read this file receive stale context. This is not a public UI defect.
- **Recommended fix:** update the completed/upcoming record and current route map in a separately approved documentation task, retaining historical product vision and distinguishing plans from authorization. This audit did not change PROJECT.md.

## C. Findings by audit area

### Functionality

- Existing Playwright and unit suites passed for all seven calculators: labeled inputs, metric/imperial behavior, invalid submissions, stale-result clearing, result displays and navigation. No new arithmetic error was identified in the reviewed calculator functions. This is not independent clinical validation of their formulas.
- Representative regression examples include TDEE/BMR for age 30, 70 kg, 175 cm; BMI 22.86; and Epley 60 kg × 8 reps = 76 kg estimated. Safety thresholds, adult age bounds and estimate disclaimers are visible; loss estimates can be withheld rather than presented as actionable targets.
- Exercise search/combined filters, all ten categories, stable related links and unknown-slug 404 behavior are covered. The internal crawl reached 100 detail routes. Seventy-seven videos are present; missing references are represented honestly, not fabricated.
- Planner selection, all 11 splits, equipment confirmations, deterministic substitutions, recovery schedules and unsupported bodyweight Push/Pull combinations are covered by existing tests. The planner does not silently use the full educational catalog or persist plans as saved accounts.
- Nutrition quantities, food-specific portions, previews, edits, deletions, dates and historical conversion snapshots work in the covered paths. FF-01–03 are additional confirmed gaps.
- Progress adds/edits/deletes, dates, same-day ordering, missing measurements, exercise-specific records, estimates, CSV and persistence work in covered single-tab paths. FF-02, FF-10 and FF-11 need follow-up.
- Both hero anchors and footer Home/Vision/Free Tools destinations work. FF-05 concerns misleading availability labels, not nonexistent-route navigation.

### UI and mobile

Four widths were checked: **320, 375, 768 and 1440 px**, at 900px viewport height. Fourteen representative routes at every width produced **56 initial checks** with zero horizontal overflow and no visible form controls extending outside the viewport. Populated/validation states added **14 checks** at 320/1440, also without horizontal overflow.

Screenshots show the dark palette, responsive grid changes, stacked mobile controls, readable chart summaries/tables, consistent primary controls and visible focus styling. Native select controls may abbreviate long options when closed; opening the real iOS/Android native pickers needs manual verification. Inline text-link target-size exceptions should not be confused with a blanket 44px WCAG requirement.

The main visual/product concern is FF-05's availability contradiction; FF-12 is branding polish. Small secondary-control styling differences are optional polish, not established broken functionality. No full cross-browser visual claim is made from Chromium alone.

### Accessibility

- Used the **already installed axe-core 4.14.0**, without adding a package: WCAG 2 A/AA, WCAG 2.1 AA and WCAG 2.2 AA tagged rules.
- **28 initial-state scans** (14 routes at 375 and 1440) found zero violations. Two homepage contrast checks were returned as incomplete/manual review, not passed automatically.
- **14 additional populated/error scans** at 320/1440 found the same two Progress definition-list nodes at both widths (FF-10). Other sampled populated calculator/planner/nutrition states had no axe violations.
- Solid-token contrast calculations: primary text on background **18.34:1**, muted text on surface **6.15:1**, lime/dark text pair **16.72:1**, control border on surface **3.62:1**. These calculations cover those specific solid pairs, not every composited/decorative element.
- Code and existing interaction tests show labels, fieldsets, active navigation, three-pixel focus outlines, keyboard menu/Escape behavior, macro tab arrow/Home/End behavior, focusable errors/results, chart descriptions/data tables, and Progress native deletion confirmation.
- `src/app/globals.css:127–147` provides focus styling and reduced-motion overrides. Charts do not animate. This supports reduced-motion behavior but is not a vestibular/screen-reader certification.
- Address FF-10 and FF-11, consider FF-13, and manually test VoiceOver/Safari, NVDA/Firefox, real mobile keyboards/date/select pickers, 200% zoom/text spacing, repeated announcements and dialogs before claiming accessibility conformance.

### SEO

All sampled page types have a single H1 and a nonempty title/description. Exercise metadata is generated by slug and uses the exercise's unique name. Public internal routes respond 200; an unknown guide responds 404. FF-06 and FF-12 cover missing canonical/discovery/social configuration.

No structured data was found. This is **not automatically a defect**. A truthful BreadcrumbList on guide pages could be useful later; avoid Recipe markup for nonexistent recipes, invented reviews/ratings, or unverified medical/professional claims. Production host, redirects and preview indexing remain owner decisions. No production domain was assumed.

### Security and privacy

- API key access is confined to `src/lib/nutrition/server.ts:18–27`; browser requests use local handlers and numeric food IDs/search text. No `NEXT_PUBLIC_FDC_API_KEY` usage, hardcoded live key, unsafe HTML rendering or eval path was found in reviewed source.
- Scope of secret check: no tracked environment files; no environment-file paths in the checked Git history; **123 distinct historical text blobs** checked for the current active FDC key; no current-key matches in those blobs, tracked files or client chunks. This does not prove that every possible historical/rotated credential is absent. Secret values were never emitted.
- Query length (2–80), result cap (12), ID format, timeouts, generic upstream errors, 429 handling and bounded cache are present. Invalid one-character search returned HTTP 400. Live detail retrieval worked with the configured server key. FF-04 remains the public availability risk.
- Both trackers explain local storage and lack of cloud backup. Data is not encrypted or protected from another person using the same browser profile. The API receives requested food search terms, not diary contents or personal measurements.
- CSV cells are quoted; embedded quotes/newlines are escaped; formula-leading user text is apostrophe-neutralized. Unit/browser tests verified the output, but Excel/Numbers/LibreOffice application behavior was not independently tested.
- Local response/config inspection does not establish production HTTPS, HSTS, CSP, framing protection or hosting throttles. Verify these at the selected host. Their absence in localhost output is not reported as a demonstrated exploit.
- No authentication, database, payment or AI attack surface was introduced by the existing tracker features. There was no penetration test or deliberate quota exhaustion.

### Performance

Production build passed and statically generated all 100 exercise details. Fonts use next/font; decorative brand/hero artwork is CSS/inline SVG. There are no external exercise thumbnails or embedded video players to load automatically.

Cold-cache isolated Chromium samples, local production server, no throttling, no screenshots/axe injection during these samples:

| Route | Encoded JS observed | JS resources |
| --- | ---: | ---: |
| `/` | 202,144 B (197.4 KiB) | 11 |
| `/calculators/tdee` | 205,951 B (201.1 KiB) | 12 |
| `/exercises` | 202,144 B (197.4 KiB) | 11 |
| `/workout-planner` | 202,144 B (197.4 KiB) | 11 |
| `/nutrition-tracker` | 202,144 B (197.4 KiB) | 11 |
| `/progress-tracker` | 202,144 B (197.4 KiB) | 11 |

Totals include normal automatic route prefetch. They are not a pure critical-path bundle budget or field-user transfer prediction. Measurements support FF-09's full-catalog payload finding; they do not demonstrate poor Core Web Vitals. Initial broad samples were warm-cache and included screenshots/axe, so the separate cold-cache samples above are the appropriate payload reference.

A synthetic **1,000-weight-entry** Progress profile produced **10,373 DOM elements**. Reload-to-network-idle observation was 586ms, including Playwright's idle wait; this is **not** a measured 586ms render task. Rendering every history row, SVG point and collapsed table row scales with entry count. Pagination/windowing is a future optimization to investigate on low-end hardware, not a confirmed launch freeze.

USDA process-local caching uses five-minute search and 24-hour detail TTLs, capped at 100 keys. It is bounded but neither distributed nor a rate limiter. Local search requires no remote request per keystroke.

**Lighthouse is not installed; no dependencies were installed to obtain it. No Lighthouse score, public-site LCP/INP/CLS, or field Core Web Vitals result is claimed.** Production-host measurements and throttled mobile profiling remain manual work.

### Reliability and data

Nutrition schema v2 migrates v1 gram entries in memory and preserves quantity/conversion/nutrition snapshots. Progress schema v1 uses canonical kg/cm, stable IDs, original sequence, valid dates, and explicit missing-measurement semantics. Existing tests cover invalid data, duplicates, unit conversions, dates, and storage errors. Corrupt storage is not automatically replaced; session-only warnings are visible. Snapshot validation does not consult new serving weights to silently change old entries.

The confirmed retention problems are FF-02 and FF-03. Neither app has cloud restore; Nutrition has no export, and Progress CSV is not an importable full backup. Date validation accepts future Progress dates within documented software bounds; that is an intentional limitation, not proof that a workout occurred. Multi-tab warnings documented in technical notes do not prevent stale writes.

Planner equipment gaps are explicit errors rather than fabricated exercises or incomplete routines. Written guidance, sources and videos still need periodic human editorial checks; no clinician review or complete playback audit of 77 third-party videos was performed here.

### Dependency audit

| Scope | Result |
| --- | --- |
| `npm audit` | Exit 1: 5 high affected development-chain nodes, 0 critical |
| `npm audit --omit=dev` | Exit 0: 0 known vulnerabilities |
| Underlying advisory | GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 |
| Packages counted | eslint-config-next, @next/eslint-plugin-next, fast-glob, micromatch, braces |
| Package changes | None |

The initial sandbox attempt could not resolve registry.npmjs.org; that was an **environment/network failure**, not a vulnerability result. A permitted network-enabled retry succeeded and produced the figures above. No audit fix command was run. These results describe the advisory database on the audit date, not a guarantee against unknown vulnerabilities.

## D. Verification results and limitations

| Requested check | Exact outcome |
| --- | --- |
| `npm run lint` | Passed, exit 0 |
| `npx --no-install tsc --noEmit` | Passed, exit 0; same installed TypeScript check without package installation |
| `npm run build` | Passed, exit 0; 117 generated entries including all 100 guides |
| `npm run test` | **318 passed, 8 intentional skips, 0 failures**, 42.6 seconds |
| `npm run test:unit` | **124 passed, 0 failures, 0 skips** |
| `npm audit` | Completed, exit 1 due to 5 high development dependency findings |
| Production-only supplementary audit | Completed, exit 0, 0 findings |
| Initial viewport inspections | 56 checks, 0 horizontal overflow |
| Initial axe inspections | 28 scans, 0 violations; homepage contrast has an incomplete item |
| Populated/error axe inspections | 14 scans; 2 affected definition-list nodes in each of 2 populated Progress scans |
| Internal route crawl | 112 unique internal destinations, all HTTP 200 |
| Unknown exercise / robots / sitemap | Each HTTP 404; unknown exercise 404 is correct |
| Console errors | None recorded in the initial 56-check inspection |

Build, production servers and browser execution used the required local process/port permissions. The initial registry failure and unavailable Lighthouse are environment/tooling limitations; they are not application test failures. Native Node module-type and FORCE_COLOR/NO_COLOR warnings were non-blocking. The eight browser skips are the existing layout-specific skips in the opposite profile, not silently skipped tracker coverage.

Coverage limits: Chromium only; not a full assistive-technology test, clinical validation, penetration test, all-video availability/playback check, production-host audit, legal/privacy compliance opinion or field performance study. Only three generated USDA web source links were fetched; all three returned 404. No actual user diary was opened or mutated.

## E. Launch readiness checklist

- [x] Existing lint, TypeScript, production build and regression tests pass.
- [x] Current code exposes the seven calculators, 100 guides, planner and both trackers.
- [x] Existing internal destination crawl is clean and unknown-guide 404 behavior works.
- [x] Four requested widths checked without observed horizontal overflow.
- [x] Active FDC key did not appear in the scoped source/history/client-bundle scan.
- [x] Production dependency audit has no known findings on this date.
- [x] Gate unsupported USDA nutrient bases and add regression coverage (FF-01); verified in Fix 1. Historical snapshots remain unchanged.
- [x] Prevent silent stale-tab overwrites in both trackers (FF-02); verified for updated cooperating tabs using Web Locks and content conflict checks.
- [ ] Confirm/undo Nutrition clearing and reset stale editor/request state (FF-03).
- [ ] Establish deployment-wide public USDA abuse controls or disable the live proxy (FF-04). Per-runtime budgets/coalescing/size controls are implemented and verified, but do not close this launch requirement.
- [ ] Correct available-tool messaging and navigation (FF-05).
- [ ] Confirm production host, canonical policy, sitemap and robots/staging rules (FF-06).
- [ ] Repair and verify nutrition source destinations without exposing a key (FF-07).
- [ ] Choose safe development-tooling advisory mitigation; do not downgrade blindly (FF-08).
- [x] Fix populated Progress list semantics (FF-10); verified with populated axe and structural tests.
- [x] Correct and regression-test repeated live-region DOM updates in both trackers (FF-11).
- [ ] Verify real repeated announcements, ordering and verbosity with assistive technology (FF-11 release review).
- [ ] Complete Safari/Firefox, real mobile pickers, zoom/text-spacing and screen-reader review.
- [ ] Verify deployment HTTPS/headers/rate limits and obtain production performance observations.
- [ ] Approve branding/social/favicon and refresh project work records (FF-12/14).

## F. Suggested implementation order

1. **Nutrition correctness first (FF-01):** block unsupported volume/unknown bases; prove the live-record regression with a fixture. Keep the starter catalog working.
2. **Retention next (FF-02/03):** stale-write detection/conflict flow, safe clear semantics and editor reset. Reproduce the audit's two-tab and clear-during-edit cases in automated tests.
3. **USDA exposure (FF-04):** choose hosting-level or shared server safeguards; leave integration disabled on public deployment if the decision is not ready.
4. **Accessible saved-data states (FF-10/11):** repair definition lists and event announcements; run axe after logging data and perform real screen-reader checks.
5. **Public messaging and source verification (FF-05/07):** remove stale availability claims, make the existing tools discoverable, correct official source destinations and test historical serving references.
6. **Deployment SEO (FF-06):** implement against the owner-supplied domain and explicit staging policy, not a placeholder host.
7. **Tooling advisory (FF-08):** isolate untrusted pattern inputs and evaluate a supported chain remediation; repeat full and production-only audits.
8. **Measured optimization and polish (FF-09/12/13/14):** slim the client catalog, reevaluate prefetch, improve social/favicon/bypass navigation, and update documentation. Measure before claiming performance gains.

Suggested fixes are recommendations for separately approved tasks. None were implemented in this audit.

## G. Questions and decisions for the project owner

1. What is the real production HTTPS domain and hosting platform? Will preview environments be public/indexable?
2. Should public launch include live USDA search, or start with the verified starter foods while rate limiting and basis validation are finished?
3. For unsupported volume-based branded foods, is a clear “not supported yet” message acceptable until verified food-specific mass conversions exist?
4. FF-02 implemented locked latest-state operations for non-conflicting records and explicit blocking for conflicting drafts. Confirm the supported-browser policy: browsers without Web Locks can read/export but cannot persist mutations. Which additional browsers/devices should receive manual verification?
5. Should Nutrition bulk clearing use confirmation, undo, or both? Is a Nutrition export/import feature a later priority for browser-only data recovery?
6. Should existing homepage cards become links to available tools, and should Calculators use a small menu or a new approved index page?
7. What brand favicon/social card and public contact/privacy information should be used? Jurisdiction-specific policy needs require an owner/legal review; no policy content or domain has been invented.
8. Who can manually review VoiceOver/Safari, NVDA/Firefox, real iOS/Android controls and spreadsheet CSV behavior?

## H. Audit integrity

Application changes: **none**. Dependency changes: **none**. Environment edits/exposed values: **none**. Commits, pushes and deployments: **none**. The only intended repository additions are this Markdown report, eight screenshots and one machine-readable evidence file under `docs/audit-artifacts/`. Temporary audit scripts, logs and local server output stayed outside the repository. A final tracked-file hash comparison verifies that the audited source/configuration files were not changed.
