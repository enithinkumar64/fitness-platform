# Curated Workout Planner: review and complete sample programs

All examples below are exact default generator outputs (seed 0), using the Build muscle goal. They are educational starting templates, not individualized prescriptions. They do not specify an exact lifting weight. For unilateral exercises, perform the listed target on each side; both sides together count as one set. Read the linked guides and adapt to your abilities. Stop for pain or loss of control.

## Programming architecture

- `splits.ts`: 11 stable split IDs, seven-day scheduling positions, recommendations, benefits, trade-offs and suitability notes.
- `templates.ts`: ordered Full Body, Upper, Lower, Push, Pull, Legs and separate Conditioning/Core slots.
- `substitutions.ts`: only explicitly included exercise IDs, permitted equipment modes, exact movement patterns, muscle emphasis, and authored strength priorities. Approval is an editorial inclusion decision, not personal clearance or professional certification.
- `generator.ts`: validates preferences, fills required slots, discloses unavailable optional work, calculates starting doses and applies one controlled substitution. It never draws a random exercise from the 100-guide catalog.
- Exercise names, slugs, equipment, difficulty, and guide content remain sourced from the unchanged Exercise Library.

## Equipment and known gaps

- Home requires a resistance band and secure anchor for rows. Seven splits can be generated; the four splits containing Push/Pull are unsupported because the approved home program lacks lateral shoulder/triceps and band-curl options. The library is not changed to invent these movements.
- Dumbbell programs require a stable bench for the approved rows. There is no approved dumbbell vertical pull, so that optional slot is visibly omitted. Some leg assistance uses existing bodyweight lunges; weighted dumbbell lunges are not represented by a separate library guide.
- Gym users check actual equipment. The machine bundle means chest press, leg press AND seated leg curl machines. With only some of those available, leave the bundle unchecked and use other confirmed equipment. This is intentionally conservative and coarser than a per-machine inventory.
- No trap bars, preacher benches, ab wheels, pull-up bars or specialized assistance machines are silently assumed. Assisted pull-ups are not currently included as substitutions because they would need a separate machine confirmation.
- An intermediate/advanced hip slot uses an approved hinge; a beginner/home hip slot uses hip extension. This initial program decision is explicit, and regeneration never changes between those movement patterns.
- With full confirmations, the unit matrix checks 297 goal × experience × split × equipment combinations: 261 supported and 36 explicitly rejected home Push/Pull cases. Partial gym inventories and missing confirmations can reject additional combinations.

## Volume, substitutions and limitations

Beginners use two sets. Other users get three sets for main work and two for secondary/accessory work. Mixed four-day and all five-day splits reduce main work to two sets. Sessions have at most six exercises and fourteen working sets. Muscle-building uses 8–12 repetitions; general fitness 10–15; strength main work 8–12 for beginners and 6–8 for others. Main strength work rests 180 seconds, other compound work 120 seconds, and isolation/core work 60 seconds. Forearm planks use 15–25 seconds.

Regeneration changes one eligible slot within its approved group; order, split, confirmed inventory and other slots remain unchanged. A repeated Full Body A slot is changed on both A days to keep the repetition intentional. Time targets are recalculated when a trunk-control substitution changes a repetition exercise into a hold. If no alternative fits, the existing plan remains unchanged and the interface says so. B sessions have an authored second-choice preference for chest presses and rows where available.

Three-day PPL generally exposes each movement category once weekly. Two-day upper/lower gives one session per region. UUL gives two upper sessions and one lower session. UULUL gives three upper and two lower sessions. More days are not presented as inherently better; beginners are pointed toward two or three full-body days. The chosen split is never silently replaced.

The complete default samples follow. Full gym samples confirm dumbbells, adjustable bench, barbell/plates, rack/safeties, the cable station/attachments, and the named machine bundle. Plans stay only in page memory; no account, permanent saving, AI, database or medical personalization is added. Advanced sport-specific periodization is outside this version.

## 3-day beginner full gym

**Goal:** Build muscle. **Experience:** beginner. **Split ID:** `fb-3`.

| Day | Session |
| --- | --- |
| Monday | Full Body A |
| Tuesday | Recovery day |
| Wednesday | Full Body B |
| Thursday | Recovery day |
| Friday | Full Body A |
| Saturday | Recovery day |
| Sunday | Recovery day |

Week 1: A / B / A. Week 2: B / A / B on the same training days. The repeated session is intentional.

### Monday — Full Body A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Leg Press](/exercises/leg-press) | 2 | 8–12 reps | 120 seconds |
| [Glute Bridge](/exercises/glute-bridge) | 2 | 8–12 reps | 120 seconds |
| [Machine Chest Press](/exercises/machine-chest-press) | 2 | 8–12 reps | 120 seconds |
| [Seated Cable Row](/exercises/seated-cable-row) | 2 | 8–12 reps | 120 seconds |
| [Dead Bug](/exercises/dead-bug) | 2 | 8–12 reps | 60 seconds |

### Wednesday — Full Body B

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Leg Press](/exercises/leg-press) | 2 | 8–12 reps | 120 seconds |
| [Glute Bridge](/exercises/glute-bridge) | 2 | 8–12 reps | 120 seconds |
| [Dumbbell Floor Press](/exercises/dumbbell-floor-press) | 2 | 8–12 reps | 120 seconds |
| [Chest-Supported Dumbbell Row](/exercises/chest-supported-dumbbell-row) | 2 | 8–12 reps | 120 seconds |
| [Dead Bug](/exercises/dead-bug) | 2 | 8–12 reps | 60 seconds |

### Friday — Full Body A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Leg Press](/exercises/leg-press) | 2 | 8–12 reps | 120 seconds |
| [Glute Bridge](/exercises/glute-bridge) | 2 | 8–12 reps | 120 seconds |
| [Machine Chest Press](/exercises/machine-chest-press) | 2 | 8–12 reps | 120 seconds |
| [Seated Cable Row](/exercises/seated-cable-row) | 2 | 8–12 reps | 120 seconds |
| [Dead Bug](/exercises/dead-bug) | 2 | 8–12 reps | 60 seconds |

## 4-day intermediate dumbbells

**Goal:** Build muscle. **Experience:** intermediate. **Split ID:** `ul-4`.

| Day | Session |
| --- | --- |
| Monday | Upper A |
| Tuesday | Lower A |
| Wednesday | Recovery day |
| Thursday | Upper B |
| Friday | Lower B |
| Saturday | Recovery day |
| Sunday | Recovery day |

Repeat this example only after adapting the workload and recovery to your circumstances.

### Monday — Upper A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Dumbbell Bench Press](/exercises/dumbbell-bench-press) | 3 | 8–12 reps | 120 seconds |
| [One-Arm Dumbbell Row](/exercises/one-arm-dumbbell-row) | 3 | 8–12 reps | 120 seconds |
| [Dumbbell Lateral Raise](/exercises/dumbbell-lateral-raise) | 2 | 8–12 reps | 60 seconds |
| [Dumbbell Biceps Curl](/exercises/dumbbell-biceps-curl) | 2 | 8–12 reps | 60 seconds |

Optional work not included: Optional vertical back pull: no approved alternative fits the confirmed equipment and difficulty.

### Tuesday — Lower A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Goblet Squat](/exercises/goblet-squat) | 3 | 8–12 reps | 120 seconds |
| [Dumbbell Romanian Deadlift](/exercises/dumbbell-romanian-deadlift) | 3 | 8–12 reps | 120 seconds |
| [Reverse Lunge](/exercises/reverse-lunge) | 2 | 8–12 reps | 120 seconds |
| [Standing Calf Raise](/exercises/standing-calf-raise) | 2 | 8–12 reps | 60 seconds |
| [Dead Bug](/exercises/dead-bug) | 2 | 8–12 reps | 60 seconds |

Optional work not included: Optional hamstring isolation: no approved alternative fits the confirmed equipment and difficulty.

### Thursday — Upper B

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Dumbbell Floor Press](/exercises/dumbbell-floor-press) | 3 | 8–12 reps | 120 seconds |
| [Chest-Supported Dumbbell Row](/exercises/chest-supported-dumbbell-row) | 3 | 8–12 reps | 120 seconds |
| [Dumbbell Lateral Raise](/exercises/dumbbell-lateral-raise) | 2 | 8–12 reps | 60 seconds |
| [Dumbbell Biceps Curl](/exercises/dumbbell-biceps-curl) | 2 | 8–12 reps | 60 seconds |

Optional work not included: Optional vertical back pull: no approved alternative fits the confirmed equipment and difficulty.

### Friday — Lower B

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Goblet Squat](/exercises/goblet-squat) | 3 | 8–12 reps | 120 seconds |
| [Dumbbell Romanian Deadlift](/exercises/dumbbell-romanian-deadlift) | 3 | 8–12 reps | 120 seconds |
| [Reverse Lunge](/exercises/reverse-lunge) | 2 | 8–12 reps | 120 seconds |
| [Standing Calf Raise](/exercises/standing-calf-raise) | 2 | 8–12 reps | 60 seconds |
| [Dead Bug](/exercises/dead-bug) | 2 | 8–12 reps | 60 seconds |

Optional work not included: Optional hamstring isolation: no approved alternative fits the confirmed equipment and difficulty.

## 5-day intermediate full gym PPLUL

**Goal:** Build muscle. **Experience:** intermediate. **Split ID:** `pplul-5`.

| Day | Session |
| --- | --- |
| Monday | Push A |
| Tuesday | Pull A |
| Wednesday | Legs A |
| Thursday | Recovery day |
| Friday | Upper A |
| Saturday | Lower A |
| Sunday | Recovery day |

Repeat this example only after adapting the workload and recovery to your circumstances.

### Monday — Push A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Machine Chest Press](/exercises/machine-chest-press) | 2 | 8–12 reps | 120 seconds |
| [Seated Dumbbell Shoulder Press](/exercises/seated-dumbbell-shoulder-press) | 2 | 8–12 reps | 120 seconds |
| [Dumbbell Lateral Raise](/exercises/dumbbell-lateral-raise) | 2 | 8–12 reps | 60 seconds |
| [Cable Triceps Pushdown](/exercises/cable-triceps-pushdown) | 2 | 8–12 reps | 60 seconds |

### Tuesday — Pull A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Seated Cable Row](/exercises/seated-cable-row) | 2 | 8–12 reps | 120 seconds |
| [Lat Pulldown](/exercises/lat-pulldown) | 2 | 8–12 reps | 120 seconds |
| [Cable Curl](/exercises/cable-curl) | 2 | 8–12 reps | 60 seconds |
| [Bent-Over Dumbbell Reverse Fly](/exercises/bent-over-dumbbell-reverse-fly) | 2 | 8–12 reps | 60 seconds |

### Wednesday — Legs A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Leg Press](/exercises/leg-press) | 2 | 8–12 reps | 120 seconds |
| [Dumbbell Romanian Deadlift](/exercises/dumbbell-romanian-deadlift) | 2 | 8–12 reps | 120 seconds |
| [Reverse Lunge](/exercises/reverse-lunge) | 2 | 8–12 reps | 120 seconds |
| [Standing Calf Raise](/exercises/standing-calf-raise) | 2 | 8–12 reps | 60 seconds |
| [Dead Bug](/exercises/dead-bug) | 2 | 8–12 reps | 60 seconds |
| [Seated Leg Curl](/exercises/seated-leg-curl) | 2 | 8–12 reps | 60 seconds |

### Friday — Upper A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Machine Chest Press](/exercises/machine-chest-press) | 2 | 8–12 reps | 120 seconds |
| [Seated Cable Row](/exercises/seated-cable-row) | 2 | 8–12 reps | 120 seconds |
| [Lat Pulldown](/exercises/lat-pulldown) | 2 | 8–12 reps | 120 seconds |
| [Dumbbell Lateral Raise](/exercises/dumbbell-lateral-raise) | 2 | 8–12 reps | 60 seconds |
| [Cable Curl](/exercises/cable-curl) | 2 | 8–12 reps | 60 seconds |

### Saturday — Lower A

| Exercise guide | Sets | Reps or time per set | Rest between sets |
| --- | ---: | --- | --- |
| [Leg Press](/exercises/leg-press) | 2 | 8–12 reps | 120 seconds |
| [Dumbbell Romanian Deadlift](/exercises/dumbbell-romanian-deadlift) | 2 | 8–12 reps | 120 seconds |
| [Reverse Lunge](/exercises/reverse-lunge) | 2 | 8–12 reps | 120 seconds |
| [Standing Calf Raise](/exercises/standing-calf-raise) | 2 | 8–12 reps | 60 seconds |
| [Dead Bug](/exercises/dead-bug) | 2 | 8–12 reps | 60 seconds |
| [Seated Leg Curl](/exercises/seated-leg-curl) | 2 | 8–12 reps | 60 seconds |

