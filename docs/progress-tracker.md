# VAJRYA Progress Tracker

Available at `/progress-tracker`. No dependencies, account, database, API, or external service were added. The page is a Server Component; browser interaction is contained in the tracker Client Component. Exercise Library data and calculator functions are reused without edits.

## Architecture

- `src/lib/progress/tracker.ts`: typed entries, validation, canonical conversions, sorting, summaries, strength record definitions, storage parsing, CSV export.
- `src/components/progress/progress-tracker.tsx`: browser storage, section coordination, export and deletion confirmation.
- `weight-tracker.tsx`, `measurement-tracker.tsx`, `strength-tracker.tsx`: independent forms, editing, summaries and histories.
- `controls.tsx`: shared form controls and canonical-value state. Changing display units does not round stored values, including untouched edits.
- `trend-chart.tsx`: responsive SVG line/point charts, actual calendar-date horizontal positions, readable text summaries, and expandable HTML data tables.
- `src/app/progress-tracker/page.tsx`: page structure and metadata.

## Data, units and ordering

Storage key: `formfuel-progress-v1`. Schema version 1: `{version:1, weights:[], measurements:[], strength:[]}`. Each entry has a UUID, ISO local calendar date, original sequence number, and optional note. All body weights and external/assistance loads are kilograms; all body measurements are centimeters. Conversions reuse `LB_TO_KG=0.45359237` and `INCH_TO_CM=2.54` from the TDEE module. Full precision is retained; ordinary displayed values round to two decimals.

Date is a user's local calendar day, never a UTC-truncated timestamp. Values sort by date ascending, then original sequence ascending. Editing preserves sequence, including when changing date. If imported or altered storage contains tied sequences, stable ID lexical order breaks the tie. UUIDs must be globally unique across all three sections. Missing body areas are absent, not zero. Each area's first/latest/change summaries independently ignore entries without that measurement. One entry has a zero change, not a fabricated earlier observation.

The browser initializes storage after mounting to avoid SSR/hydration differences. Parsing validates schema, IDs, dates, notes, numeric fields and exercise relationships, and rebuilds known fields only. Corrupt/inaccessible data is not automatically overwritten. Users can continue with session-only records, export those records, or explicitly clear stored progress. Storage write failures preserve in-memory entries and show a warning. Deleting an entry or clearing the entire store uses native browser confirmation. Clearing also resets the section forms.

There is no encryption, cloud backup, cross-device synchronization, or CSV import. Same-origin tabs synchronize as described below. Anyone with access to this browser profile can access the records. Clearing site data can remove them. Cooperating updated tabs use locked operations and explicit conflicts; older open versions must be reloaded. Browser storage quota varies. A total cap of 10,000 entries bounds rendering and parsing work.

## Validation boundaries

These are broad software checks, not healthy ranges or safe training recommendations:

- Dates: valid calendar dates from 1900-01-01 to 2100-12-31. Future dates in that interval are accepted as entered, not verified sessions.
- Body weight: 10–500 kg (or converted pounds).
- Waist/chest/hips: 10–350 cm; upper arm: 3–100 cm; thigh: 5–200 cm (or equivalent inches). At least one area required; no field silently becomes zero.
- Notes: up to 500 characters. Custom exercise names: 2–100 characters.
- Strength: 1–20 whole sets and 1–100 whole repetitions. Every set in an entry uses the same load and repetitions. Load: 0 for unloaded, or 0.1–1,000 kg. Nonfinite/negative, malformed and hexadecimal inputs are rejected.
- Timed holds (planks), carries, conditioning and band lateral walks are excluded from this repetition-based picker. Custom names must refer to repetition-based work; the app cannot infer the semantics of arbitrary custom text.

## Strength history and record definitions

Library exercise IDs define histories. Custom names form separate keys after Unicode NFKC normalization, whitespace collapsing and case folding. A custom name matching a library name still stays separate from that library ID. Different library exercises never share a trend. Use distinct custom names for different machines or variants; the app cannot verify device equivalence.

Enter total external load consistently, including the bar; for dumbbells use combined load. Bodyweight exercises log only added external load (0 if none), not body mass. Assisted pull-ups/dips record assistance, so larger assistance is not presented as a stronger lifted-load record. Bands log 0 for unmeasured kilogram load with resistance details in notes; their chart shows actual repetitions, not fictional zero-resistance measurements.

- **Heaviest recorded load**: largest logged external load, independent of rep count or number of sets. Bodyweight labels explicitly say added load. Assistance/bands have no heaviest-lifted record.
- **Best recorded load at N reps**: largest external load among this exercise's entries with exactly N repetitions per set. Assistance instead shows least recorded assistance at N reps. Bands have no kilogram record. Set count is displayed but does not change this load comparison.
- **Best estimated 1RM (Epley)**: largest eligible Epley estimate across this exercise's entries. Calls the existing `calculateEpley` and `validateOneRepMaxInput`; does not duplicate formulas. Valid range is 1–12 reps and 0.1–1,000 kg, with the existing one-repetition special case. For example 60 kg × 8 reps gives 76 kg estimated, not an actually tested maximum.

The conservative estimate allowlist is: Barbell Bench Press, Incline Barbell Bench Press, Close-Grip Bench Press, Barbell Back Squat, Barbell Front Squat, Conventional Deadlift, Trap-Bar Deadlift, Barbell Romanian Deadlift, Barbell Overhead Press, Barbell Bent-Over Row. All IDs are verified against the existing catalog. This is a software eligibility policy, not a claim of scientific accuracy for every lift. Machines, dumbbells, bands, assistance, bodyweight, custom names, timed work and higher-rep sets receive no estimate. Each remains distinct from an actual tested maximum. Estimates vary with technique, exercise, fatigue and training experience, and are less reliable at high repetitions. Do not attempt a maximum based solely on an estimate.

Strength load/estimate charts filter by one exercise and the selected exact rep count. The summary of best estimated 1RM still considers all eligible rep counts and is labeled separately. Band charts display repetitions across that exercise's entries. Changing a strength entry's exercise intentionally moves it into the corresponding history.

## Charts

Charts plot observed entries only, with a real date axis. Missing measurements are omitted; lines connect logged points, not inferred daily measurements. Same-day observations share their date position, ordered by the sequence rule; they can overlap or form a vertical segment. One observation displays a point. Empty trends display explanatory text. Vertical scales are auto-ranged with padding, with explicit numerical limits; they are not implied to start at zero. Text summaries and HTML tables expose every plotted value, so color and SVG alone are not required. Native focus styles and reduced-motion rules are inherited; there are no chart animations.

## CSV export

Exports the current recorded store, including in-memory records if persistence failed, but never drafts, sample records, other localStorage keys or browser/device metadata. Uses one CSV with section, ID, date, same-day sequence, exercise identity, body_weight_kg, each measurement in cm, sets, repetitions_per_set, external_load_or_assistance_kg, load_type, estimated_epley_1rm_kg and note. Missing fields are empty, not zero. Dates use YYYY-MM-DD; full-precision numeric values use decimal points. All cells are quoted, quotes doubled, and embedded commas/newlines preserved. User text beginning with a spreadsheet formula marker (including after whitespace) is prefixed with an apostrophe. Numeric cells remain numeric-looking and machine-readable. The file is generated locally, downloaded through a Blob URL, then the URL is revoked.

## Verification and review

Run `npm run lint`, `npx --no-install tsc --noEmit`, `npm run build`, `npm run test`, and `npm run test:unit`. Tests use browser-local data; no API keys or network data are needed. Browser coverage includes all three sections, date and same-day ordering, unit switching, edits, confirmed/cancelled deletions, custom and library strength histories, records, reload persistence, CSV escaping, corrupt storage, write failure, keyboard focus and 320px layout. Unit tests separately verify calculations, storage validation, definitions and CSV formatting.

For manual review, run `npm run dev`, open `http://localhost:3000/progress-tracker`, add records in different date orders, inspect trends and tables, edit and delete, reload, and inspect a CSV in a text editor or spreadsheet. Review the machine/variant naming and external-load convention carefully. No records are sent to a server.

## Cross-tab synchronization and conflict handling (FF-02)

Previously, the component read localStorage once at mount and replaced the complete saved document with its in-memory snapshot after every change. Two tabs opened before either save could overwrite each other's entries or targets. The data schemas themselves were not the cause.

Both trackers now use `src/hooks/use-browser-store.ts` and `src/lib/storage/transactions.ts`:

- A storage event for this tracker's key refreshes saved history and summaries. A window-focus check also catches missed events. Readers never write during synchronization, preventing notification loops. Nutrition and Progress use separate keys and lock names.
- Each persisted add/edit/delete/target update reads and validates the latest store **inside an exclusive Web Lock**, then applies only that operation. Distinct new IDs merge into the latest data rather than replacing it with an older React snapshot. Progress allocates new sequence numbers inside the lock and keeps existing sequences when editing.
- An edit retains the original record snapshot from when Edit was selected. A structural comparison (independent of object-key order) rejects edits or deletes when that record changed or disappeared. Other records can change without blocking an unrelated edit. Nutrition target edits compare the original target group; they do not overwrite newer targets silently. No silent field-level merge of conflicting edits is attempted.
- On conflict, saved history is refreshed where readable, the form input remains, and an accessible alert explains the conflict. Cancel the record edit and reopen the current record to review/retry. A deleted record cannot be restored by its old editor. Nutrition's **Use latest saved targets** explicitly replaces a target draft with saved targets; ordinary synchronization/reload preserves drafts.
- **Reload saved diary/progress** retries reading without clearing form drafts. If session-only records exist, confirmation is required before discarding those records; export Progress CSV or keep a separate copy first. There is no automatic promotion of session-only records back to saved storage.
- Clears use the same lock and compare the full raw snapshot seen at confirmation time. A queued clear refuses to erase data saved while it waited. Explicit clearing requires confirmation. A successful local clear resets editors and pending Nutrition request identity; a clear from another tab updates history but preserves the local draft so an attempted stale save can be rejected visibly.
- Form controls are temporarily disabled while an asynchronous write is pending, so completion cannot reset newly typed input. Lock acquisition times out after five seconds with a safe retry message.
- Corrupt storage is never automatically replaced. Initial read failures retain the existing session-only convention. A failed `setItem` retains the proposed state in memory with a warning; a later external storage event does not replace these session-only records. Invalid proposed states and unreadable newer stores are not written. Clear failures preserve current records.

### Compatibility and guarantees

No schema or storage-key change is needed. Nutrition remains version 2 under `formfuel-nutrition-v1`, with the existing version-1 grams migration; Progress remains version 1 under `formfuel-progress-v1`. Stable IDs, canonical kg/cm values, dates, nutrition snapshots and frozen household conversions remain intact. Existing calculation functions and catalog data are unchanged. Nothing is sent to an account, database or cloud service.

[Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) serialize cooperating same-origin tabs and require a supported secure context (HTTPS or localhost). If unavailable, persistent edits and clears fail closed, keeping inputs for retry; read/export remain usable. The snapshot check is additional protection, **not an atomic localStorage compare-and-swap**. Older already-open application versions, scripts that ignore the lock, browser extensions and manual DevTools edits do not participate in this protocol. Reload all VAJRYA tabs after updating; no guarantee is made against a non-cooperating writer after the final check. There is no cross-device synchronization or backup. Same-value changes that are later reverted are indistinguishable by content snapshots; no persistent audit history is introduced.

Automated coverage uses real same-context browser pages (shared origin/storage), simultaneous adds, stale editors, deletion, targets, all Progress sections, suppressed storage/focus events, queued clear, key isolation, session-only failures and absent Web Locks. Pure tests cover latest-state commits, structural comparisons, corrupt data, rejected proposed states, key isolation and existing migrations. Actual Safari/Firefox and multiple browser profiles/devices are not certified by Chromium tests.

## Progress accessibility follow-up — FF-10 and FF-11 (original P2 findings)

### FF-10: populated description lists

The original axe evidence in `docs/audit-artifacts/evidence.json` identified `definition-list` violations at 320px and 1440px: the populated weight/latest-date and measurement/date-change paragraphs were siblings of `dt`/`dd` inside a `dl > div` group. Description-list groups must contain the ordered terms and their descriptions; the extra sibling paragraph was outside that relationship. Empty-state scans missed it because the paragraphs only render after logging data.

`weight-tracker.tsx` and `measurement-tracker.tsx` now put those paragraphs inside the matching `dd`. The weight number retains its original monospace/size/color styling in a span while the supplementary date retains its original small secondary styling. Strength already used valid term/description groups and did not need a markup change. Heading levels, labels, edit/delete accessible names, native confirmation dialogs, chart text alternatives and native expandable tables remain intact. No extra ARIA is needed for the summary relationship.

### FF-11: repeated Progress operation notifications

Previously repeated saves set the same string, leaving the existing `role="status"` paragraph unchanged. `progress-tracker.tsx` now gives each operation a presentation-only sequence and replaces the child span inside that stable polite status container, even if visible wording repeats. The sequence is not saved, announced as a number, or used for record IDs, calculations or synchronization. Accepted saves, deletions, clear and export notifications use this path. Rejected save/delete attempts also issue a fresh status directing the user to the existing storage/conflict alert while retaining their draft.

This fixes the documented DOM-update mechanism for **Progress**. Nutrition's similar constant-message pattern is unchanged and remains part of the broader FF-11 follow-up. DOM mutations alone cannot establish actual spoken announcements across browser/screen-reader combinations.

### Regression evidence and manual review

New `tests/e2e/progress-accessibility.spec.ts` covers populated weight/measurement/strength summaries, description-list nesting and value associations, keyboard chart/table expansion, focus outlines, edit/delete controls, validation focus, repeated add/edit/delete DOM notifications, unchanged IDs/schema, and repeated blocked conflict attempts in two real tabs. It uses the existing locked `axe-core` 4.14.0 dependency without installing packages, runs populated main-region checks at 320px and 1440px in both Chromium profiles, and attaches axe results (including incomplete checks) and populated screenshots to the Playwright report. An available automated scan is not a WCAG compliance certification. Existing add/edit/delete, units, CSV, storage and cross-tab tests remain in the full suite.

FF-10 is resolved for the documented markup defect: lint, TypeScript and standalone build passed; both final browser runs passed 356 tests with 8 intentional skips (47.6 s / 48.3 s); all 144 unit tests passed. The launch audit records the evidence and development-test correction. The Progress-specific FF-11 DOM defect is corrected; its Nutrition counterpart and real assistive-technology verification remain open. Calculations, storage schemas/keys, record IDs and the shared synchronization hook are unchanged.

Before launch, manually review:

1. VoiceOver with Safari on the Mac (and iOS where available): navigate the populated description lists and confirm dates/changes are read with their labels/values.
2. VoiceOver/Safari and NVDA/Firefox or Chrome: verify repeated saves, edits, deletes, blocked conflicts, storage warnings and external synchronization notices are spoken clearly without excessive duplicate announcements. The shared synchronization announcer itself was not redesigned.
3. Native delete/clear dialogs: verify prompt reading, keyboard cancel/confirm and returned focus with the actual browser/OS controls. Playwright tests confirm dialog handling, not OS-level assistive interaction.
4. Real mobile keyboards/date/select controls, 200% zoom/text spacing, focus visibility and chart/table reading. Review any axe incomplete results in the generated report.

Use synthetic records or a separate browser profile for review. No cloud service or new data persistence was added.
