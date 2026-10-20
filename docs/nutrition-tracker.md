# FormFuel Nutrition Tracker

The tracker works without configuration at `/nutrition-tracker`. No dependencies were added.

## Optional USDA setup

1. Obtain a free personal FoodData Central API key using https://fdc.nal.usda.gov/api-guide/.
2. Create `.env.local` (already ignored by Git) and add `FDC_API_KEY=your_key_here`.
3. Restart the Next.js server. Never use a `NEXT_PUBLIC_` key or commit `.env.local`.

Only route handlers read the key. It is sent in the server's X-Api-Key header, never in browser requests or responses. Search terms and selected USDA IDs are sent to USDA on explicit user actions; diary contents are not. No remote calls occur on typing. Search query length is 2–80 characters; results limited to 12; detail IDs are positive integers up to nine digits. Requests time out after eight seconds. Safe errors never include upstream bodies or credentials. HTTP 429 prompts retry later. Process-local cache holds at most 100 records and 8 MiB of serialized payloads: search five minutes, details 24 hours. Cache is best effort and resets on restarts; distributed deployments do not share it. This does not provide deployment-wide rate limiting; public exposure requires verified hosting/shared abuse controls as described below.

## Food values and verification

29 distinct SR Legacy foods were retrieved directly from the official USDA full-food-detail endpoint on 2026-10-19 using the documented public DEMO_KEY for this one-time data verification (not used by the application). All four nutrients, exact IDs and preparation descriptions were read from returned records. The target of 30–50 foods was deliberately reduced to 29 verified distinct records rather than inserting an unverified record. Household portions were subsequently verified against USDA foodPortions; see the serving-size section below. Raw egg and meat records describe food state, not advice to consume them raw.

USDA source: https://fdc.nal.usda.gov/api-guide/ and https://fdc.nal.usda.gov/data-documentation.html. FoodData Central data are public domain (CC0). Source: U.S. Department of Agriculture, Agricultural Research Service, FoodData Central.

`src/lib/nutrition/foods.ts` preserves the numeric values. Each link below identifies the record used. Values are per 100 g, energy in kcal, other nutrients in grams.

| USDA record | Food |
| --- | --- |
| [171688](https://fdc.nal.usda.gov/food-details/171688/nutrients) | Apples, raw, with skin (Includes foods for USDA's Food Distribution Program) |
| [173944](https://fdc.nal.usda.gov/food-details/173944/nutrients) | Bananas, raw |
| [169910](https://fdc.nal.usda.gov/food-details/169910/nutrients) | Mangos, raw |
| [171705](https://fdc.nal.usda.gov/food-details/171705/nutrients) | Avocados, raw, all commercial varieties |
| [173424](https://fdc.nal.usda.gov/food-details/173424/nutrients) | Egg, whole, cooked, hard-boiled |
| [170457](https://fdc.nal.usda.gov/food-details/170457/nutrients) | Tomatoes, red, ripe, raw, year round average |
| [168462](https://fdc.nal.usda.gov/food-details/168462/nutrients) | Spinach, raw |
| [169975](https://fdc.nal.usda.gov/food-details/169975/nutrients) | Cabbage, raw |
| [170379](https://fdc.nal.usda.gov/food-details/170379/nutrients) | Broccoli, raw |
| [171477](https://fdc.nal.usda.gov/food-details/171477/nutrients) | Chicken, broilers or fryers, breast, meat only, cooked, roasted |
| [172421](https://fdc.nal.usda.gov/food-details/172421/nutrients) | Lentils, mature seeds, cooked, boiled, without salt |
| [172688](https://fdc.nal.usda.gov/food-details/172688/nutrients) | Bread, whole-wheat, commercially prepared |
| [172183](https://fdc.nal.usda.gov/food-details/172183/nutrients) | Egg, white, raw, fresh |
| [174276](https://fdc.nal.usda.gov/food-details/174276/nutrients) | Soy protein isolate |
| [173757](https://fdc.nal.usda.gov/food-details/173757/nutrients) | Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt |
| [170567](https://fdc.nal.usda.gov/food-details/170567/nutrients) | Nuts, almonds |
| [171287](https://fdc.nal.usda.gov/food-details/171287/nutrients) | Egg, whole, raw, fresh |
| [172470](https://fdc.nal.usda.gov/food-details/172470/nutrients) | Peanut butter, smooth style, without salt |
| [173686](https://fdc.nal.usda.gov/food-details/173686/nutrients) | Fish, salmon, Atlantic, wild, raw |
| [171077](https://fdc.nal.usda.gov/food-details/171077/nutrients) | Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw |
| [168917](https://fdc.nal.usda.gov/food-details/168917/nutrients) | Quinoa, cooked |
| [168878](https://fdc.nal.usda.gov/food-details/168878/nutrients) | Rice, white, long-grain, regular, enriched, cooked |
| [171413](https://fdc.nal.usda.gov/food-details/171413/nutrients) | Oil, olive, salad or cooking |
| [169228](https://fdc.nal.usda.gov/food-details/169228/nutrients) | Eggplant, raw |
| [170393](https://fdc.nal.usda.gov/food-details/170393/nutrients) | Carrots, raw |
| [170020](https://fdc.nal.usda.gov/food-details/170020/nutrients) | Peas and onions, frozen, unprepared |
| [168482](https://fdc.nal.usda.gov/food-details/168482/nutrients) | Sweet potato, raw, unprepared (Includes foods for USDA's Food Distribution Program) |
| [169291](https://fdc.nal.usda.gov/food-details/169291/nutrients) | Squash, summer, zucchini, includes skin, raw |
| [171265](https://fdc.nal.usda.gov/food-details/171265/nutrients) | Milk, whole, 3.25% milkfat, with added vitamin D |

## Normalization and limitations

Full food detail `foodNutrients.amount` uses USDA's per-100-g basis for Foundation, SR Legacy and Survey (FNDDS). Branded records are accepted only when a finite positive `servingSize` and explicit gram `servingSizeUnit` (`g`, `gram`, or `grams`) establish a gram basis. USDA standardizes branded records per 100 g **or** 100 mL, depending on the supplied unit; see [USDA GBFPD documentation](https://fdc.nal.usda.gov/GBFPD_Documentation/). Branded volume units, missing basis/serving size, and unsupported units are rejected with HTTP 422 and a helpful message before food selection. Household portions alone do not prove a Branded nutrient denominator. No density is guessed, and no volume-to-mass nutrient conversion is currently supported. Existing starter foods, verified household conversions, and saved diary snapshots are unchanged; historical imports are not retroactively validated or rewritten. Search nutrient summaries and per-serving `labelNutrients` are never used to log food. A record needs protein (1003), total carbohydrate (1005), total fat (1004) in grams and energy in understood units. Energy preference: total energy 1008 kcal, Atwater specific 2048 kcal, Atwater general 2047 kcal, then energy 1062 kJ divided by 4.184. Energy definitions are alternatives, never summed. Missing, nonfinite, negative or ambiguous required nutrient records are rejected. Zero is accepted only when explicitly present. Branded missing carbohydrate or other fields cannot be logged. Search shows brand and data type; detail requires complete values. Duplicate source IDs are removed from search, and local matches take precedence.

Grams and verified food-specific household portions are supported. Quantity must be finite and positive, and the total gram equivalent must be >0 to 5,000 g per entry. Targets are optional positive references, up to 10,000 kcal and 1,000 g per macro; these are software bounds, not safety endorsements. Targets apply across dates. Stored diary schema version 2 contains dated entries with IDs, meal, quantity, a frozen serving conversion (ID, singular/plural labels, grams per serving, source and qualifier), food/nutrient snapshot, total grams, calculated nutrition and manual targets. Version 1 entries migrate in memory with quantity = original grams and the gram unit; the same localStorage key is retained. Migration is written only on a subsequent user save, not automatically during loading. Editing can supplement legacy food snapshots with current serving options from the same USDA record, while preserving original nutrients and giving the logged conversion priority. Parsing validates schema, rejects inconsistent grams, and recomputes totals from snapshots; corrupt data is preserved until explicitly cleared. If storage fails, current-session tracking continues with a warning. No cloud backup, encryption or cross-device synchronization; avoid shared browsers for private tracking. Updated same-origin tabs synchronize saved data and merge non-conflicting operations under Web Locks; see FF-02 below.

Nutrients = per-100-g amount × grams / 100. Full precision is retained; displays round to one decimal. Above-target bars stop at 100% but text reports the actual amount above. Local dates use local calendar components and noon-based day changes rather than UTC slicing. Nutrition values vary by preparation and brand. Tracking is educational, not medical advice.

Automated API tests mock upstream responses; no live key or USDA availability is needed. Browser tests also mock search/detail and missing-key states. To verify a real deployment, configure your own key and try one search and detail selection; never share the key.

## Food-specific serving sizes (2026-10-19 revision)

All 29 original full USDA food records were retrieved again and reviewed. 27 foods have 65 selected household options. Stable local IDs, USDA IDs and every per-100-g nutrient value remain unchanged. `docs/data/usda-starter-portions.json` preserves the exact official portion fields for all 29 records, including rejected options. Each implemented option includes its USDA portion ID and a source link. USDA FoodData Central API specification: https://api.nal.usda.gov/fdc/v1/json-spec?api_key=DEMO_KEY (the documented public demo key, never a user credential).

The first household option is the default for newly selected foods (medium fruit, large egg, cup, slice, etc.); otherwise the default is 100 grams. Selecting a new food resets its options and quantity. Switching units for the same food preserves the gram equivalent without display rounding. Editing restores the original quantity and serving, including its historical conversion. Newly fetched portion weights never silently change old logs. Grams remain available for weighed portions. Listed portion weights refer to edible food; raw and cooked records are not interchangeable. Actual food sizes vary.

### Normalization rules

- SR Legacy: require a positive finite gramWeight and amount, plus a recognized household modifier or measure unit. In this data type, measureUnit is often `undetermined`; the modifier contains the actual household measure. Bare size modifiers are recognized only for the explicitly reviewed fruit/egg/carrot/zucchini record IDs. Unclear unit/yield/package/NLEA portions and mass-only ounces are not exposed.
- Foundation: require an explicit recognized measureUnit, a positive finite amount and gramWeight. A valid volume-to-gram mapping is supported only when that food's portion explicitly provides both; no density is assumed.
- Survey/FNDDS: parse an explicit positive count and recognized household unit from portionDescription (for example `1 cup` or `1/2 cup`); require gramWeight, preserve its portion ID, and reject contradictory amount fields. Numeric modifier codes are not interpreted as household units.
- Branded: require servingSize in grams. If householdServingFullText is present, only an explicit recognized quantity/measure is interpreted; otherwise use the explicitly gram-sized label serving. Unsupported or ambiguous text is left grams-only. mL-only and ounce-only branded serving fields are currently not converted. A label's per-serving nutrients are never used instead of per-100-g nutrients.
- Reject missing, zero, negative, nonfinite or excessively large weights, unsupported/ambiguous units, conflicting duplicate IDs and invalid serving quantities. Household portions with amount other than 1 use `gramWeight / amount`, e.g. the peanut-butter portion is 2 tbsp = 32 g, so each tablespoon is 16 g.

No milk mL option is inferred from its cup portion. Milk has a directly verified 244 g cup and 15 g tablespoon; neither assumes that all liquids weigh one gram per mL.

### Reviewed starter options

| USDA source record | Food | Implemented household options (grams per one option) |
| --- | --- | --- |
| [171688](https://fdc.nal.usda.gov/food-details/171688/nutrients) | Apples, raw, with skin (Includes foods for USDA's Food Distribution Program) | medium apple = 182 g (portion 89193); small apple = 149 g (portion 89194); large apple = 223 g (portion 89192); cup (quartered or chopped) = 125 g (portion 89190); cup (slices) = 109 g (portion 89191) |
| [173944](https://fdc.nal.usda.gov/food-details/173944/nutrients) | Bananas, raw | medium banana = 118 g (portion 93515); small banana = 101 g (portion 93514); large banana = 136 g (portion 93516); cup (sliced) = 150 g (portion 93512); cup (mashed) = 225 g (portion 93511) |
| [169910](https://fdc.nal.usda.gov/food-details/169910/nutrients) | Mangos, raw | cup (pieces) = 165 g (portion 85651) |
| [171705](https://fdc.nal.usda.gov/food-details/171705/nutrients) | Avocados, raw, all commercial varieties | cup (cubes) = 150 g (portion 89223); cup (sliced) = 146 g (portion 89225); cup (pureed) = 230 g (portion 89224) |
| [173424](https://fdc.nal.usda.gov/food-details/173424/nutrients) | Egg, whole, cooked, hard-boiled | large egg = 50 g (portion 92500); cup (chopped) = 136 g (portion 92498) |
| [170457](https://fdc.nal.usda.gov/food-details/170457/nutrients) | Tomatoes, red, ripe, raw, year round average | medium tomato = 123 g (portion 86686); small tomato = 91 g (portion 86689); large tomato = 182 g (portion 86685); cup (chopped or sliced) = 180 g (portion 86682) |
| [168462](https://fdc.nal.usda.gov/food-details/168462/nutrients) | Spinach, raw | cup = 30 g (portion 83132) |
| [169975](https://fdc.nal.usda.gov/food-details/169975/nutrients) | Cabbage, raw | cup (chopped) = 89 g (portion 85791); cup (shredded) = 70 g (portion 85792) |
| [170379](https://fdc.nal.usda.gov/food-details/170379/nutrients) | Broccoli, raw | cup (chopped) = 91 g (portion 86528); cup (chopped or diced) = 88 g (portion 86532) |
| [171477](https://fdc.nal.usda.gov/food-details/171477/nutrients) | Chicken, broilers or fryers, breast, meat only, cooked, roasted | cup (chopped or diced) = 140 g (portion 88817) |
| [172421](https://fdc.nal.usda.gov/food-details/172421/nutrients) | Lentils, mature seeds, cooked, boiled, without salt | cup = 198 g (portion 90596); tablespoon = 12.3 g (portion 90597) |
| [172688](https://fdc.nal.usda.gov/food-details/172688/nutrients) | Bread, whole-wheat, commercially prepared | slice = 32 g (portion 91108) |
| [172183](https://fdc.nal.usda.gov/food-details/172183/nutrients) | Egg, white, raw, fresh | large egg white = 33 g (portion 90043); cup = 243 g (portion 90044) |
| [174276](https://fdc.nal.usda.gov/food-details/174276/nutrients) | Soy protein isolate | Grams only — mass-only ounces, or insufficiently qualified piece/package sizes |
| [173757](https://fdc.nal.usda.gov/food-details/173757/nutrients) | Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt | cup = 164 g (portion 93226) |
| [170567](https://fdc.nal.usda.gov/food-details/170567/nutrients) | Nuts, almonds | almond = 1.2 g (portion 86868); cup (whole) = 143 g (portion 86863); cup (sliced) = 92 g (portion 86864); cup (slivered) = 108 g (portion 86865); cup (ground) = 95 g (portion 86866) |
| [171287](https://fdc.nal.usda.gov/food-details/171287/nutrients) | Egg, whole, raw, fresh | large egg = 50 g (portion 88374); medium egg = 44 g (portion 88378); small egg = 38 g (portion 88379); cup = 243 g (portion 88377) |
| [172470](https://fdc.nal.usda.gov/food-details/172470/nutrients) | Peanut butter, smooth style, without salt | tablespoon = 16 g (portion 90673); cup = 258 g (portion 90674) |
| [173686](https://fdc.nal.usda.gov/food-details/173686/nutrients) | Fish, salmon, Atlantic, wild, raw | fillet (USDA reference size) = 396 g (portion 93107) |
| [171077](https://fdc.nal.usda.gov/food-details/171077/nutrients) | Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw | Grams only — mass-only ounces, or insufficiently qualified piece/package sizes |
| [168917](https://fdc.nal.usda.gov/food-details/168917/nutrients) | Quinoa, cooked | cup = 185 g (portion 83990) |
| [168878](https://fdc.nal.usda.gov/food-details/168878/nutrients) | Rice, white, long-grain, regular, enriched, cooked | cup = 158 g (portion 83928) |
| [171413](https://fdc.nal.usda.gov/food-details/171413/nutrients) | Oil, olive, salad or cooking | tablespoon = 13.5 g (portion 88667); teaspoon = 4.5 g (portion 88669); cup = 216 g (portion 88668) |
| [169228](https://fdc.nal.usda.gov/food-details/169228/nutrients) | Eggplant, raw | cup (cubes) = 82 g (portion 84474) |
| [170393](https://fdc.nal.usda.gov/food-details/170393/nutrients) | Carrots, raw | medium carrot = 61 g (portion 86559); small carrot = 50 g (portion 86560); large carrot = 72 g (portion 86558); cup (chopped) = 128 g (portion 86555); cup (grated) = 110 g (portion 86556) |
| [170020](https://fdc.nal.usda.gov/food-details/170020/nutrients) | Peas and onions, frozen, unprepared | cup = 138 g (portion 85909) |
| [168482](https://fdc.nal.usda.gov/food-details/168482/nutrients) | Sweet potato, raw, unprepared (Includes foods for USDA's Food Distribution Program) | cup (cubes) = 133 g (portion 83166); sweet potato (5 inches long) = 130 g (portion 83167) |
| [169291](https://fdc.nal.usda.gov/food-details/169291/nutrients) | Squash, summer, zucchini, includes skin, raw | medium zucchini = 196 g (portion 84610); small zucchini = 118 g (portion 84612); large zucchini = 323 g (portion 84609); cup (chopped) = 124 g (portion 84607); cup (sliced) = 113 g (portion 84608) |
| [171265](https://fdc.nal.usda.gov/food-details/171265/nutrients) | Milk, whole, 3.25% milkfat, with added vitamin D | cup = 244 g (portion 88314); tablespoon = 15 g (portion 88316) |

Soy protein isolate (174276) remains grams-only because the only USDA portion is mass in ounces, not a household measure. Raw chicken breast (171077) remains grams-only because the piece/package weights do not identify a clear household size; no cooked portions are borrowed. Other foods expose only the selected, qualified portions above, not every portion returned by USDA.

### Real logging examples

| Quantity and food | Verified equivalent | Calories (display) |
| --- | --- | --- |
| 2 large hard-boiled eggs | 2 × 50 g = 100 g | 155.0 kcal |
| 2 medium raw apples with skin | 2 × 182 g = 364 g | 189.3 kcal |
| 1 medium raw banana (edible portion) | 118 g | 105.0 kcal |
| 1 cup cooked long-grain white rice | 158 g | 205.4 kcal |

For each entry, nutrients = per-100-g values × (quantity × grams per serving) / 100. Quantity and conversion snapshots retain precision. Nutrition displays round to one decimal and gram previews to three decimals; display rounding never drives diary calculations. A 0.5 cup portion of this rice is 79 g and displays 102.7 kcal.

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

[Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) serialize cooperating same-origin tabs and require a supported secure context (HTTPS or localhost). If unavailable, persistent edits and clears fail closed, keeping inputs for retry; read/export remain usable. The snapshot check is additional protection, **not an atomic localStorage compare-and-swap**. Older already-open application versions, scripts that ignore the lock, browser extensions and manual DevTools edits do not participate in this protocol. Reload all FormFuel tabs after updating; no guarantee is made against a non-cooperating writer after the final check. There is no cross-device synchronization or backup. Same-value changes that are later reverted are indistinguishable by content snapshots; no persistent audit history is introduced.

Automated coverage uses real same-context browser pages (shared origin/storage), simultaneous adds, stale editors, deletion, targets, all Progress sections, suppressed storage/focus events, queued clear, key isolation, session-only failures and absent Web Locks. Pure tests cover latest-state commits, structural comparisons, corrupt data, rejected proposed states, key isolation and existing migrations. Actual Safari/Firefox and multiple browser profiles/devices are not certified by Chromium tests.

## USDA proxy protection — partial deployment mitigation

The task called this FF-03; the original launch-audit proxy finding is **FF-04** (FF-03 concerns diary clearing). Both GET endpoints use the same `nutritionRequest` handler and runtime-local protection state. Previously, unique valid requests bypassed successful-response caching without an attempt budget, concurrency limit or in-flight coalescing. This could consume the key's quota or exhaust server work. No destructive load test or live USDA quota test was performed.

### Exact application limits

| Control | Threshold / behavior |
| --- | --- |
| Incoming requests | 120 accepted requests per rolling 60 seconds, shared by search and detail, including invalid inputs, missing-key requests, cache hits and coalesced callers |
| New USDA attempts | 30 per rolling 60 seconds **and** 600 per rolling hour, shared by both endpoints; failed attempts count too |
| Concurrent upstream calls | 4 distinct calls; no waiting queue for additional distinct calls |
| Identical in-flight requests | Same normalized endpoint/query or ID shares one upstream call; each caller still consumes an incoming allowance |
| Upstream timeout | 8 seconds, including body consumption through the fetch abort signal |
| Upstream response body | 1 MiB (1,048,576 bytes), checked using declared length and streamed decoded bytes before JSON parsing |
| Successful response cache | 100 entries and 8 MiB serialized payloads; search 5 minutes, details 24 hours; expired/oldest entries evicted |
| Query and results | Existing 2–80-character search validation, maximum 12 results; positive food IDs with at most 9 digits |

HTTP 429 includes integer-seconds `Retry-After` and a safe message explaining that users can wait/retry or use the starter catalog. A budget rejection reports remaining time until a slot frees; concurrency rejection reports 1 second. Upstream USDA 429 creates a shared-runtime cooldown: numeric Retry-After is bounded to 1–3,600 seconds; absent, date-format or invalid values use 60 seconds. Safe cached results remain usable during upstream cooldown/budget exhaustion, within the incoming limit. Do not automatically retry in a loop.

Missing key returns 503, invalid input 400, missing USDA **food** record 404, unsupported nutrient basis 422, and upstream/timeout/oversized/malformed-response failures 502. These are separate from rate-limit 429. Failures and rejected imports are not cached. Response bodies from upstream errors and exception messages are not returned or logged. Credentials remain server-side in `X-Api-Key`, never in URLs or normalized payloads. The current UI displays the safe error and keeps local search/logging functional. Starter foods, diary storage, household snapshots and nutrition calculations are unchanged.

### Scope and launch requirements

These are **runtime/process-local shared limits, not per-user limits and not deployment-wide limits**. State is shared across the two route bundles only when they use the same `globalThis`; workers, isolates, replicas, regions and serverless cold starts can have independent/reset budgets, cooldowns, caches and in-flight maps. A restart resets state. Restart a development server after changing the proxy implementation. No client-controlled IP header is trusted as an identity, and no IP/identity table is maintained.

Before enabling USDA publicly, choose/verify the actual host and add edge/reverse-proxy controls for trusted per-client request limits, URL/body size and slow-client protections, plus a durable atomic shared USDA-key budget across **all** instances/consumers. Use a shared limiter/concurrency policy appropriate to that host (for example an approved shared datastore or platform-managed control). An in-memory cache or CDN alone does not establish that budget. No infrastructure/service, payment requirement or extra credentials have been introduced by this change. See the installed Next.js self-hosting guide (`node_modules/next/dist/docs/01-app/02-guides/self-hosting.md`) for reverse-proxy and multi-instance considerations.

If shared protection is not ready, leave `FDC_API_KEY` unset on the public deployment so USDA is unavailable while the starter catalog/diary still work. Do not print the key while configuring hosting. Other applications using the same USDA key also consume its quota. Monitor aggregate quota/rejections at the chosen host without logging secrets or diary contents.

Remaining risks: an attacker can consume the shared local budget and temporarily affect other users; traffic can still reach Next.js before these guards; multiple instances can exceed aggregate USDA allowances; large otherwise-valid USDA records may be refused by the response cap. This is **partial mitigation**, not proof of denial-of-service resistance or completed production protection. No intended production host/global limiter has yet been verified.

### Regression coverage

`tests/unit/nutrition-proxy.test.mjs` invokes the actual handler with a fake clock, synthetic API key and mocked USDA responses. It checks thresholds/recovery, rolling boundaries, both endpoints' shared budgets, coalescing/concurrency, cache behavior, invalid input, missing configuration, 404/429/502 distinctions, upstream cooldown and bounded/aborted bodies. Existing nutrition tests use fresh handler instances to isolate budgets and caches. Browser tests exercise rate-limit messages/starter fallback and real invalid-input routes without contacting USDA. No test consumes live USDA quota. Final verification results are recorded in the audit follow-up.
