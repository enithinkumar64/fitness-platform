# FormFuel Progress Tracker

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

There is no encryption, backup, synchronization, multi-tab merge, or CSV import. Anyone with access to this browser profile can access the records. Clearing site data can remove them. Concurrent tabs may overwrite one another; use one tab for editing. Browser storage quota varies. A total cap of 10,000 entries bounds rendering and parsing work.

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
