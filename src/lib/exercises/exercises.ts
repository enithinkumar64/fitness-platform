import { ADDITIONAL_EXERCISES } from "./additional-exercises.ts";
import { DIRECTORY_CATEGORIES, MUSCLE_GROUPS, EQUIPMENT, DIFFICULTIES, type Exercise, type ExerciseFilters } from "./types.ts";

// Original VAJRYA editorial content. IDs are persistent planner references;
// slugs are readable URLs. Difficulty is a broad skill label, not clearance to train.
// Video URLs, titles, and channel attribution checked against YouTube oEmbed and
// published watch-page descriptions on 2026-10-18. External references only;
// no permission to reproduce video media is asserted. Uncertain variants omitted.
export const EXERCISES: readonly Exercise[] = [
  {
    id: "ex-push-up", slug: "push-up", category: "Chest", name: "Push-Up", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front deltoids", "Abdominals"], equipment: ["Bodyweight"], difficulty: "intermediate", movementPattern: "Horizontal push",
    video: {"url": "https://www.youtube.com/watch?v=WDIpL0pjun0", "title": "How to do a Push-Up | Proper Form & Technique | NASM", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external push-up demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A floor-based press that combines upper-body pushing with trunk control.",
    instructions: ["Place your hands slightly wider than shoulder width and extend your legs behind you.", "Brace your trunk and lower your chest between your hands, letting your elbows angle back rather than straight sideways.", "Press the floor away to return to the start while keeping your body moving as one unit."],
    tips: ["Use an incline variation if the floor version changes your posture.", "Choose a depth you can control without discomfort."], mistakes: ["Letting the hips sag or leading upward with the chest alone.", "Flaring the elbows sharply out to the sides."], safety: ["Reduce the load or stop if your wrists or shoulders hurt; a stable raised surface may be more manageable."], relatedIds: ["ex-incline-push-up", "ex-machine-chest-press"],
  },
  {
    id: "ex-incline-push-up", slug: "incline-push-up", category: "Chest", name: "Incline Push-Up", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front deltoids", "Abdominals"], equipment: ["Bodyweight", "Bench"], difficulty: "beginner", movementPattern: "Horizontal push",
    video: {"url": "https://www.youtube.com/watch?v=0JUrOH--Kdk", "title": "How to do an Incline Push-Up | Proper Form & Technique | NASM", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external incline push-up demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "An elevated-hand press with less bodyweight resistance than a floor push-up.",
    instructions: ["Place your hands on a fixed, non-slip bench and walk your feet back into a straight-body position.", "Bend your elbows to bring your chest toward the bench while keeping your trunk steady.", "Push through your hands to return without shifting the bench."],
    tips: ["A higher support generally reduces the pressing demand.", "Keep your neck in line with your torso."], mistakes: ["Using a light bench that can tip or slide.", "Bending only at the hips instead of the elbows."], safety: ["Check the support can hold your load before starting. Do not use wheeled furniture."], relatedIds: ["ex-push-up", "ex-dumbbell-bench-press"],
  },
  {
    id: "ex-dumbbell-bench-press", slug: "dumbbell-bench-press", category: "Chest", name: "Dumbbell Bench Press", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front deltoids"], equipment: ["Dumbbells", "Bench"], difficulty: "intermediate", movementPattern: "Horizontal push",
    video: {"url": "https://www.youtube.com/watch?v=Vc63DPUoA40", "title": "Dumbbell Bench Press - Chest Exercise - Bodybuilding.com", "creator": "Bodybuilding.com", "description": "An external dumbbell bench press demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A supported chest press using independently controlled dumbbells.",
    instructions: ["Set up on a stable flat bench with your feet supported and dumbbells above your chest.", "Lower the weights with your forearms roughly upright and elbows angled away from your torso comfortably.", "Press upward with control, then finish the set using a planned, controlled way to sit up or receive assistance."],
    tips: ["Keep your upper back supported and avoid bouncing at the bottom.", "Use loads you can position and put down under control."], mistakes: ["Dropping the elbows far beyond a comfortable shoulder range.", "Colliding the dumbbells at the top."], safety: ["Learn the setup and exit with light loads. Ask a qualified coach or spotter for help with unfamiliar or heavy loads."], relatedIds: ["ex-machine-chest-press", "ex-push-up"],
  },
  {
    id: "ex-machine-chest-press", slug: "machine-chest-press", category: "Chest", name: "Machine Chest Press", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front deltoids"], equipment: ["Machine"], difficulty: "beginner", movementPattern: "Horizontal push",
    video: {"url": "https://www.youtube.com/watch?v=lRo9zZ7EwpM", "title": "How to do a Chest Press on a Machine | Proper Form & Technique | NASM", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external machine chest press demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A seated press with a guided handle path and adjustable resistance.",
    instructions: ["Adjust the seat so the handles sit around mid-chest height and select a manageable load.", "Keep your back against the pad and press the handles forward without snapping your elbows straight.", "Return slowly until you reach a comfortable start position."],
    tips: ["Read the machine's setup instructions; handle paths differ.", "Keep your feet firmly supported."], mistakes: ["Letting the weight stack slam between repetitions.", "Lifting the shoulders toward the ears while pressing."], safety: ["A guided path is not suitable for every shoulder. Adjust the seat or stop if the path causes discomfort."], relatedIds: ["ex-incline-push-up", "ex-dumbbell-bench-press"],
  },
  {
    id: "ex-one-arm-dumbbell-row", slug: "one-arm-dumbbell-row", category: "Back", name: "One-Arm Dumbbell Row", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear deltoids"], equipment: ["Dumbbells", "Bench"], difficulty: "beginner", movementPattern: "Horizontal pull",
    description: "A single-arm row with the other hand supported on a stable bench.",
    instructions: ["Support one hand on a bench, stagger your feet, and hinge until your trunk is steady.", "Let the dumbbell hang, then draw your elbow back toward your hip without rotating your torso.", "Lower the weight smoothly and repeat before changing sides."],
    tips: ["Use the support to keep your lower back from doing the rowing.", "Let the shoulder blade move naturally rather than forcing an exaggerated squeeze."], mistakes: ["Twisting upward to lift the weight.", "Jerking the shoulder toward the ear."], safety: ["Use a non-slip bench and avoid a load that makes your supporting arm or back lose position."], relatedIds: ["ex-seated-cable-row", "ex-band-row"],
  },
  {
    id: "ex-seated-cable-row", slug: "seated-cable-row", category: "Back", name: "Seated Cable Row", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear deltoids"], equipment: ["Cable"], difficulty: "beginner", movementPattern: "Horizontal pull",
    video: {"url": "https://www.youtube.com/watch?v=xQNrFHEMhI4", "title": "Seated Cable Row | Exercise Guide", "creator": "Bodybuilding.com", "description": "An external seated cable row demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "A seated horizontal pull against cable resistance.",
    instructions: ["Sit with your feet on the supports and take the handle with a comfortable grip.", "Keep a steady torso as you draw the handle toward your lower ribs.", "Extend your arms slowly, allowing a controlled reach without collapsing your back."],
    tips: ["Keep a soft bend in the knees.", "Choose a grip that allows your wrists to stay comfortable."], mistakes: ["Rocking the whole torso to move the stack.", "Pulling the shoulders up toward the ears."], safety: ["Check the attachment is secured and avoid releasing the handle abruptly."], relatedIds: ["ex-one-arm-dumbbell-row", "ex-band-row"],
  },
  {
    id: "ex-lat-pulldown", slug: "lat-pulldown", category: "Back", name: "Lat Pulldown", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear deltoids"], equipment: ["Cable"], difficulty: "beginner", movementPattern: "Vertical pull",
    video: {"url": "https://www.youtube.com/watch?v=lueEJGjTuPQ", "title": "Wide-Grip Lat Pulldown | Back Exercise Guide", "creator": "Bodybuilding.com", "description": "An external lat pulldown demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A seated overhead pull using a cable and thigh support.",
    instructions: ["Adjust the thigh pad and take an overhead grip that feels comfortable for your shoulders.", "With a small, steady backward lean, pull the bar in front of you toward the upper chest.", "Return upward with control, without letting the stack lift you off the seat."],
    tips: ["Think of moving your elbows down toward your sides.", "Use only the range you can control without shoulder discomfort."], mistakes: ["Pulling the bar behind the neck.", "Using a large backward swing to finish the pull."], safety: ["Keep the bar in front of your head and check the thigh pad holds you securely."], relatedIds: ["ex-assisted-pull-up", "ex-seated-cable-row"],
  },
  {
    id: "ex-assisted-pull-up", slug: "assisted-pull-up", category: "Back", name: "Assisted Pull-Up", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Forearms"], equipment: ["Machine"], difficulty: "intermediate", movementPattern: "Vertical pull",
    video: {"url": "https://www.youtube.com/watch?v=wFj808u2HWU", "title": "How To Use The Assisted Pull Up Machine", "creator": "PureGym", "description": "An external assisted pull-up demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A machine-assisted vertical pull with some bodyweight offset by a support platform.",
    instructions: ["Read the machine instructions and choose enough assistance to control the movement.", "Mount the platform carefully, grip the handles, and pull upward by bringing your elbows toward your sides.", "Lower under control and dismount using the machine's steps or supports."],
    tips: ["On many machines, a larger selected weight means more assistance.", "Keep your trunk steady instead of swinging."], mistakes: ["Using too little assistance and shortening every repetition.", "Stepping off a moving support abruptly."], safety: ["The platform can move quickly. Ask staff to demonstrate mounting and dismounting if unfamiliar."], relatedIds: ["ex-lat-pulldown", "ex-band-row"],
  },
  {
    id: "ex-band-row", slug: "band-row", category: "Back", name: "Band Row", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear deltoids"], equipment: ["Resistance band"], difficulty: "beginner", movementPattern: "Horizontal pull",
    description: "A standing horizontal pull using an anchored resistance band.",
    instructions: ["Secure a suitable band to a rated anchor around lower-chest height and step back to light tension.", "Stand steadily and pull your elbows back while keeping your ribs over your pelvis.", "Reach forward slowly, maintaining control of the band."],
    tips: ["Increase distance from the anchor only when you can control the return.", "Keep your wrists aligned with your forearms."], mistakes: ["Leaning back to substitute bodyweight for a row.", "Letting the band snap forward."], safety: ["Inspect the band for wear and confirm the anchor is secure. Keep the band path away from your face."], relatedIds: ["ex-seated-cable-row", "ex-one-arm-dumbbell-row"],
  },
  {
    id: "ex-bodyweight-squat", slug: "bodyweight-squat", category: "Legs and quads", name: "Bodyweight Squat", primaryMuscle: "Legs", secondaryMuscles: ["Glutes", "Abdominals"], equipment: ["Bodyweight"], difficulty: "beginner", movementPattern: "Squat",
    video: {"url": "https://www.youtube.com/watch?v=l83R5PblSMA", "title": "Leg exercise - How to bodyweight squat", "creator": "PureGym", "description": "An external bodyweight squat demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "An unloaded squat for practicing coordinated hip, knee, and ankle movement.",
    instructions: ["Stand with your feet at a comfortable width and toes turned out as needed.", "Bend your hips and knees together, lowering as far as you can while keeping balance across your feet.", "Push through your feet to stand without snapping your knees backward."],
    tips: ["Let your knees follow the direction of your toes.", "Depth depends on your control and comfortable range."], mistakes: ["Forcing a depth that lifts the heels or collapses posture.", "Allowing the knees to buckle inward."], safety: ["Use a stable support for balance if needed. Stop rather than force painful joint movement."], relatedIds: ["ex-goblet-squat", "ex-reverse-lunge"],
  },
  {
    id: "ex-goblet-squat", slug: "goblet-squat", category: "Legs and quads", name: "Goblet Squat", primaryMuscle: "Legs", secondaryMuscles: ["Glutes", "Abdominals"], equipment: ["Dumbbells"], difficulty: "beginner", movementPattern: "Squat",
    video: {"url": "https://www.youtube.com/watch?v=CkFzgR55gho", "title": "How to Perform Dumbbell Goblet Squat", "creator": "Physique Development", "description": "An external goblet squat demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A squat with one dumbbell held close to the front of the chest.",
    instructions: ["Hold a dumbbell securely at chest height with both hands and find a stable stance.", "Brace gently and lower by bending your hips and knees, keeping the weight close.", "Stand through the whole foot while maintaining control of the dumbbell."],
    tips: ["Begin with a load you can lift into and out of position easily.", "Keep your elbows clear of your knees rather than forcing contact."], mistakes: ["Letting the weight drift away from the chest.", "Rushing out of the bottom position."], safety: ["Use a secure grip and do not continue if the load causes back or joint pain."], relatedIds: ["ex-bodyweight-squat", "ex-barbell-back-squat"],
  },
  {
    id: "ex-barbell-back-squat", slug: "barbell-back-squat", category: "Legs and quads", name: "Barbell Back Squat", primaryMuscle: "Legs", secondaryMuscles: ["Glutes", "Trunk stabilizers"], equipment: ["Barbell", "Rack"], difficulty: "advanced", movementPattern: "Squat",
    video: {"url": "https://www.youtube.com/watch?v=-bJIpOq-LWk", "title": "How to do a Barbell Back Squat", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external barbell back squat demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A loaded squat with a bar supported across the upper back inside a rack.",
    instructions: ["Set rack hooks and safety arms for your height, and position the bar on a supported upper-back shelf, not the neck.", "Brace, stand to unrack, and take a short controlled step back into your stance.", "Bend your hips and knees to a controlled depth, then stand and re-rack by contacting both hooks before lowering the bar."],
    tips: ["Practice the rack setup and exit with an empty bar first.", "Keep pressure balanced across the feet."], mistakes: ["Descending beyond the depth you can control.", "Moving the bar before confirming both rack hooks are engaged."], safety: ["Learn this lift with qualified coaching. Use correctly positioned safety arms and an appropriate spotting plan; do not rely on these notes for heavy lifting."], relatedIds: ["ex-goblet-squat", "ex-bodyweight-squat"],
  },
  {
    id: "ex-dumbbell-romanian-deadlift", slug: "dumbbell-romanian-deadlift", category: "Glutes and hamstrings", name: "Dumbbell Romanian Deadlift", primaryMuscle: "Legs", secondaryMuscles: ["Glutes", "Back stabilizers", "Forearms"], equipment: ["Dumbbells"], difficulty: "intermediate", movementPattern: "Hip hinge",
    video: {"url": "https://www.youtube.com/watch?v=QFbZevA7dps", "title": "How to do a Dumbbell Romanian Deadlift | Proper Form & Technique | NASM", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external dumbbell romanian deadlift demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "A hip hinge that loads the back of the legs while the dumbbells stay close.",
    instructions: ["Stand with dumbbells at your sides or in front of your thighs and soften your knees.", "Move your hips backward, letting the weights travel close to your legs as your torso inclines.", "Stop before your back position changes, then drive your hips forward to stand tall."],
    tips: ["Keep the knee bend fairly consistent during the hinge.", "You do not need to reach the floor."], mistakes: ["Turning the hinge into a deep knee bend.", "Reaching lower by rounding the lower back."], safety: ["Use a comfortable hamstring range and reduce load if your back cannot stay controlled."], relatedIds: ["ex-kettlebell-deadlift", "ex-glute-bridge"],
  },
  {
    id: "ex-reverse-lunge", slug: "reverse-lunge", category: "Legs and quads", name: "Reverse Lunge", primaryMuscle: "Legs", secondaryMuscles: ["Glutes", "Trunk stabilizers"], equipment: ["Bodyweight"], difficulty: "beginner", movementPattern: "Lunge",
    video: {"url": "https://www.youtube.com/watch?v=xrPteyQLGAo", "title": "How To Reverse Lunge", "creator": "PureGym", "description": "An external reverse lunge demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A backward stepping lunge that challenges leg strength and balance.",
    instructions: ["Stand tall with enough clear space behind you and support nearby if required.", "Step one foot back and bend both knees, keeping the front foot grounded.", "Push through the front foot to return, then repeat under control on either side."],
    tips: ["Keep some width between your feet instead of walking a tightrope.", "Choose a step length that lets the front knee track comfortably."], mistakes: ["Dropping the back knee onto the floor.", "Using a narrow, unstable stance."], safety: ["Use a stable hand support if balance is uncertain; reduce depth if the movement is uncomfortable."], relatedIds: ["ex-bodyweight-squat", "ex-glute-bridge"],
  },
  {
    id: "ex-glute-bridge", slug: "glute-bridge", category: "Glutes and hamstrings", name: "Glute Bridge", primaryMuscle: "Legs", secondaryMuscles: ["Hamstrings", "Abdominals"], equipment: ["Bodyweight"], difficulty: "beginner", movementPattern: "Hip extension",
    description: "A floor-based hip extension with the shoulders and feet supported.",
    instructions: ["Lie on your back with bent knees, feet flat, and arms resting beside you.", "Brace lightly and press through your feet to raise your hips until your trunk and thighs are roughly aligned.", "Lower slowly without dropping onto the floor."],
    tips: ["Keep your ribs from lifting excessively.", "Adjust foot position until you feel comfortable hip movement."], mistakes: ["Arching the lower back to gain height.", "Pushing through the neck instead of the upper back and feet."], safety: ["Keep pressure off the neck. Stop if lifting produces back pain or cramping that does not settle."], relatedIds: ["ex-dumbbell-romanian-deadlift", "ex-bodyweight-squat"],
  },
  {
    id: "ex-standing-calf-raise", slug: "standing-calf-raise", category: "Legs and quads", name: "Standing Calf Raise", primaryMuscle: "Legs", secondaryMuscles: ["Foot stabilizers"], equipment: ["Bodyweight"], difficulty: "beginner", movementPattern: "Ankle plantar flexion",
    video: {"url": "https://www.youtube.com/watch?v=KziSdepGOkc", "title": "Standing Bodyweight Calf Raise", "creator": "Girls Gone Strong | Women's Health & Fitness", "description": "An external standing calf raise demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A standing heel raise using both feet and optional hand support.",
    instructions: ["Stand on level ground with your feet comfortably spaced and a stable support within reach.", "Raise your heels slowly while keeping pressure across the balls of your feet.", "Lower your heels to the floor with control."],
    tips: ["Use a pause rather than bouncing.", "Keep the ankles from rolling outward."], mistakes: ["Rocking the whole body forward for momentum.", "Dropping the heels quickly."], safety: ["Begin on level ground rather than a step, especially with balance or Achilles concerns. Seek guidance for persistent tendon pain."], relatedIds: ["ex-bodyweight-squat", "ex-reverse-lunge"],
  },
  {
    id: "ex-seated-dumbbell-shoulder-press", slug: "seated-dumbbell-shoulder-press", category: "Shoulders", name: "Seated Dumbbell Shoulder Press", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps", "Upper chest"], equipment: ["Dumbbells", "Bench"], difficulty: "intermediate", movementPattern: "Vertical push",
    video: {"url": "https://www.youtube.com/watch?v=Vphi6UMhF7o", "title": "Dumbbell Seated Overhead Shoulder Press Tutorial", "creator": "IronmasterPro", "description": "An external seated dumbbell shoulder press demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed. Publisher identifies seated dumbbells and an adjustable bench."}},
    description: "A seated overhead press with a supported back and independent hand positions.",
    instructions: ["Sit on a stable backed bench with feet supported and dumbbells near shoulder height.", "Press upward through a comfortable path without forcing your lower back into an arch.", "Lower slowly to your controlled starting position."],
    tips: ["A partly inward-facing grip may be more comfortable than palms fully forward.", "Keep your head clear of the weight path."], mistakes: ["Leaning back more with each repetition.", "Forcing the elbows behind the torso at the bottom."], safety: ["Overhead range varies. Use a lighter load or seek coaching if you cannot press without discomfort or trunk compensation."], relatedIds: ["ex-barbell-overhead-press", "ex-dumbbell-lateral-raise"],
  },
  {
    id: "ex-dumbbell-lateral-raise", slug: "dumbbell-lateral-raise", category: "Shoulders", name: "Dumbbell Lateral Raise", primaryMuscle: "Shoulders", secondaryMuscles: ["Upper trapezius"], equipment: ["Dumbbells"], difficulty: "beginner", movementPattern: "Shoulder abduction",
    video: {"url": "https://www.youtube.com/watch?v=XPPfnSEATJA", "title": "How to do a Dumbbell Lateral Raise", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external dumbbell lateral raise demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "A light dumbbell raise out to the sides with softly bent elbows.",
    instructions: ["Stand steadily with light dumbbells at your sides and elbows slightly bent.", "Lift the arms out and slightly forward toward shoulder height, within a comfortable range.", "Lower slowly without swinging your torso."],
    tips: ["Let the shoulder blades move naturally as your arms rise.", "Use a neutral hand position rather than deliberately turning thumbs downward."], mistakes: ["Using a heavy load and shrugging or swinging to lift it.", "Raising through a painful arc."], safety: ["Keep the load light enough for controlled movement and stop if the shoulder pinches or hurts."], relatedIds: ["ex-cable-face-pull", "ex-seated-dumbbell-shoulder-press"],
  },
  {
    id: "ex-cable-face-pull", slug: "cable-face-pull", category: "Shoulders", name: "Cable Face Pull", primaryMuscle: "Shoulders", secondaryMuscles: ["Upper back", "Rotator cuff"], equipment: ["Cable"], difficulty: "beginner", movementPattern: "High horizontal pull",
    video: {"url": "https://www.youtube.com/watch?v=eTCBSFlCJ_s", "title": "How to do a Face Pull | Proper Form & Technique | NASM", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external cable face pull demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "A light rope pull toward the face with controlled shoulder rotation.",
    instructions: ["Attach a rope near eye level and step back to a stable stance with light tension.", "Pull the rope toward your face while separating the ends and keeping the neck relaxed.", "Return slowly, maintaining a steady torso."],
    tips: ["Choose a comfortable elbow height rather than forcing it upward.", "Keep the movement slow enough to control the handle near your face."], mistakes: ["Leaning far back to move the load.", "Forcing shoulder rotation beyond a comfortable range."], safety: ["Check the rope attachment and leave clearance around the face. This is not a treatment for shoulder pain."], relatedIds: ["ex-dumbbell-lateral-raise", "ex-seated-cable-row"],
  },
  {
    id: "ex-barbell-overhead-press", slug: "barbell-overhead-press", category: "Shoulders", name: "Barbell Overhead Press", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps", "Trunk stabilizers"], equipment: ["Barbell", "Rack"], difficulty: "intermediate", movementPattern: "Vertical push",
    video: {"url": "https://www.youtube.com/watch?v=cGnhixvC8uA", "title": "How to do a Barbell Overhead Press", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external barbell overhead press demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A standing barbell press that requires overhead mobility and trunk control.",
    instructions: ["Set the bar in a rack near upper-chest height and take a comfortable grip with forearms roughly upright.", "Unrack, brace your trunk, and press upward while keeping the bar clear of your face.", "Lower to the upper chest with control and re-rack securely after the set."],
    tips: ["Begin with a light bar and learn the path before adding load.", "Keep your ribs from flaring as the bar passes overhead."], mistakes: ["Arching the lower back to finish the press.", "Allowing the bar to drift far in front of the body."], safety: ["Use qualified coaching for unfamiliar barbell setup or overhead limitations. Do not press through shoulder or back pain."], relatedIds: ["ex-seated-dumbbell-shoulder-press", "ex-dumbbell-lateral-raise"],
  },
  {
    id: "ex-dumbbell-biceps-curl", slug: "dumbbell-biceps-curl", category: "Biceps", name: "Dumbbell Biceps Curl", primaryMuscle: "Arms", secondaryMuscles: ["Forearms"], equipment: ["Dumbbells"], difficulty: "beginner", movementPattern: "Elbow flexion",
    video: {"url": "https://www.youtube.com/watch?v=3OZ2MT_5r3Q", "title": "Dumbbell Bicep Curl - Bicep Exercise - Bodybuilding.com", "creator": "Bodybuilding.com", "description": "An external dumbbell biceps curl demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A controlled palms-up dumbbell curl with the upper arms near the torso.",
    instructions: ["Stand or sit steadily with dumbbells at your sides and palms facing forward.", "Bend your elbows to lift the weights without driving the upper arms forward.", "Lower slowly through a comfortable elbow range."],
    tips: ["Keep wrists aligned instead of folding them back.", "Use a load that does not require a body swing."], mistakes: ["Throwing the torso backward to start a repetition.", "Dropping the weights quickly at the bottom."], safety: ["Reduce load or adjust grip if wrists or elbows are uncomfortable; persistent pain needs individual assessment."], relatedIds: ["ex-hammer-curl", "ex-cable-triceps-pushdown"],
  },
  {
    id: "ex-hammer-curl", slug: "hammer-curl", category: "Biceps", name: "Hammer Curl", primaryMuscle: "Arms", secondaryMuscles: ["Forearms"], equipment: ["Dumbbells"], difficulty: "beginner", movementPattern: "Elbow flexion",
    video: {"url": "https://www.youtube.com/watch?v=nL3SedGG7X0", "title": "How to do a Dumbbell Hammer Curl", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external hammer curl demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A neutral-grip curl with the palms facing inward throughout the movement.",
    instructions: ["Hold dumbbells beside your thighs with palms facing your body.", "Curl the weights while keeping your upper arms fairly still and wrists neutral.", "Lower to the starting position without locking the elbows abruptly."],
    tips: ["Alternate arms if that makes trunk control easier.", "Keep the shoulders relaxed."], mistakes: ["Swinging the weights across the body.", "Bending the wrist to finish the curl."], safety: ["Keep a comfortable grip and avoid loads that cause elbow or wrist pain."], relatedIds: ["ex-dumbbell-biceps-curl", "ex-farmer-carry"],
  },
  {
    id: "ex-cable-triceps-pushdown", slug: "cable-triceps-pushdown", category: "Triceps", name: "Cable Triceps Pushdown", primaryMuscle: "Arms", secondaryMuscles: ["Forearms"], equipment: ["Cable"], difficulty: "beginner", movementPattern: "Elbow extension",
    video: {"url": "https://www.youtube.com/watch?v=HIKzvHkibWc", "title": "Triceps Pushdown - Tricep Exercise - Bodybuilding.com", "creator": "Bodybuilding.com", "description": "An external cable triceps pushdown demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "A standing cable exercise that extends the elbows against a high pulley.",
    instructions: ["Secure a suitable handle to a high pulley and stand with elbows near your sides.", "Straighten your elbows smoothly to move the handle downward while your upper arms stay fairly still.", "Return to a comfortable bent-elbow position with control."],
    tips: ["Use a slight forward lean without rounding over the handle.", "Choose a rope or bar grip that feels comfortable."], mistakes: ["Using bodyweight to shove the handle down.", "Letting the elbows move far forward and back."], safety: ["Check the attachment and avoid snapping the elbows into the end of the movement."], relatedIds: ["ex-overhead-dumbbell-triceps-extension", "ex-incline-push-up"],
  },
  {
    id: "ex-overhead-dumbbell-triceps-extension", slug: "overhead-dumbbell-triceps-extension", category: "Triceps", name: "Overhead Dumbbell Triceps Extension", primaryMuscle: "Arms", secondaryMuscles: ["Shoulder stabilizers"], equipment: ["Dumbbells"], difficulty: "intermediate", movementPattern: "Elbow extension",
    video: {"url": "https://www.youtube.com/watch?v=7h3lG2WnLXg", "title": "Single Dumbbell Overhead Tricep Extension - OPEX Exercise Library", "creator": "OPEX Fitness", "description": "An external overhead dumbbell triceps extension demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A two-handed elbow extension with one dumbbell held overhead.",
    instructions: ["Take a secure two-handed grip on one light dumbbell and position it overhead without flaring your ribs.", "Bend your elbows to lower the weight behind your head within a comfortable range.", "Extend the elbows to return while keeping your upper arms as steady as practical."],
    tips: ["Keep breathing rather than straining to hold the position.", "Use a shorter range if the overhead position is difficult."], mistakes: ["Arching the back to make room for the weight.", "Using a grip that lets the dumbbell slip."], safety: ["Plan a controlled setup and exit. If overhead positioning is uncomfortable, consider a pushdown with appropriate guidance instead."], relatedIds: ["ex-cable-triceps-pushdown", "ex-seated-dumbbell-shoulder-press"],
  },
  {
    id: "ex-dead-bug", slug: "dead-bug", category: "Core and abs", name: "Dead Bug", primaryMuscle: "Core", secondaryMuscles: ["Hip flexors"], equipment: ["Bodyweight"], difficulty: "beginner", movementPattern: "Anti-extension",
    description: "A supine trunk-control drill with slow opposite-arm and leg reaches.",
    instructions: ["Lie on your back with arms raised and hips and knees bent roughly to right angles.", "Brace lightly and reach one arm and the opposite leg away without letting the trunk arch.", "Return and alternate sides, shortening the reach as needed to maintain control."],
    tips: ["Exhale during the reach and keep the motion slow.", "Leave the heel close to the body if a long reach changes your back position."], mistakes: ["Rushing through alternating limbs.", "Forcing the leg lower after the back starts arching."], safety: ["Use a pain-free range and seek guidance for back symptoms rather than forcing the spine into the floor."], relatedIds: ["ex-bird-dog", "ex-forearm-plank"],
  },
  {
    id: "ex-forearm-plank", slug: "forearm-plank", category: "Core and abs", name: "Forearm Plank", primaryMuscle: "Core", secondaryMuscles: ["Shoulders", "Glutes"], equipment: ["Bodyweight"], difficulty: "beginner", movementPattern: "Anti-extension",
    video: {"url": "https://www.youtube.com/watch?v=xhk1JkbF2lg", "title": "How to do a Plank", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external forearm plank demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "An isometric trunk hold supported by the forearms and toes.",
    instructions: ["Place your elbows under your shoulders and extend your legs behind you, or start with knees supported.", "Lift into a steady body line while lightly engaging your trunk and glutes.", "Breathe normally and end the hold before your posture changes."],
    tips: ["Short, controlled holds are preferable to prolonged sagging.", "Keep the head aligned with the torso."], mistakes: ["Holding the breath.", "Letting the hips sag or rise to avoid trunk control."], safety: ["Stop if your lower back or shoulders hurt; use knee support or seek a different option with guidance."], relatedIds: ["ex-dead-bug", "ex-side-plank"],
  },
  {
    id: "ex-side-plank", slug: "side-plank", category: "Core and abs", name: "Side Plank", primaryMuscle: "Core", secondaryMuscles: ["Shoulder stabilizers", "Gluteus medius"], equipment: ["Bodyweight"], difficulty: "intermediate", movementPattern: "Anti-lateral flexion",
    video: {"url": "https://www.youtube.com/watch?v=ZpBJIRLGEgg", "title": "How to do a Side Plank", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external side plank demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A side-supported hold that resists the trunk bending toward the floor.",
    instructions: ["Lie on your side with the supporting elbow beneath your shoulder and feet staggered, or knees bent for support.", "Raise your hips until the side of your trunk is aligned, without rotating toward the floor.", "Breathe during a controlled hold, then lower gently and change sides."],
    tips: ["Start with knee support if the full version changes your alignment.", "Keep the supporting shoulder active rather than sinking into it."], mistakes: ["Rolling the chest downward.", "Continuing after the hips begin to drop."], safety: ["The supporting shoulder carries substantial load. Stop for shoulder pain and seek an appropriate modification."], relatedIds: ["ex-forearm-plank", "ex-bird-dog"],
  },
  {
    id: "ex-bird-dog", slug: "bird-dog", category: "Core and abs", name: "Bird Dog", primaryMuscle: "Core", secondaryMuscles: ["Glutes", "Back stabilizers", "Shoulders"], equipment: ["Bodyweight"], difficulty: "beginner", movementPattern: "Anti-rotation",
    video: {"url": "https://www.youtube.com/watch?v=ZdAHe9_HeEw", "title": "How to do a Bird Dog | Proper Form & Technique | NASM", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external bird dog demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the title and channel. Publisher title and exercise description reviewed for movement match. Full playback not reviewed; retained from the original eight references."}},
    description: "A hands-and-knees balance drill with opposite-arm and leg reaches.",
    instructions: ["Start on hands and knees with hands under shoulders and knees under hips.", "Reach one arm forward and the opposite leg back while keeping your trunk and pelvis steady.", "Return slowly and alternate sides without shifting abruptly."],
    tips: ["Think of reaching long rather than lifting the leg high.", "Move only one limb at a time if balancing both is difficult."], mistakes: ["Arching the back as the leg rises.", "Rotating the pelvis open."], safety: ["Use padding if needed and avoid positions that aggravate wrists, knees, or the back."], relatedIds: ["ex-dead-bug", "ex-side-plank"],
  },
  {
    id: "ex-kettlebell-deadlift", slug: "kettlebell-deadlift", category: "Full body", name: "Kettlebell Deadlift", primaryMuscle: "Full body", secondaryMuscles: ["Glutes", "Hamstrings", "Back stabilizers", "Forearms"], equipment: ["Kettlebell"], difficulty: "beginner", movementPattern: "Hip hinge",
    video: {"url": "https://www.youtube.com/watch?v=LnIMaf-XOpM", "title": "How to do a Kettlebell Deadlift  | Proper Form & Technique | NASM", "creator": "National Academy of Sports Medicine (NASM)", "description": "An external kettlebell deadlift demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed. Publisher description has an incorrect heading, but its kettlebell-between-feet lifting steps agree with the title."}},
    description: "A controlled floor pickup using a kettlebell positioned between the feet.",
    instructions: ["Stand over a kettlebell with a stable stance, hinge your hips back, and bend your knees enough to reach the handle.", "Brace and push through the feet to stand, keeping the weight close and arms long.", "Return the bell by moving the hips back and bending the knees, setting it down gently."],
    tips: ["Raise the starting bell on a stable platform if the floor is beyond your controlled range.", "Finish tall without leaning backward."], mistakes: ["Jerking the bell off the floor.", "Reaching down by rounding the lower back."], safety: ["Choose a load and starting height that allow control. This is a deadlift, not a kettlebell swing."], relatedIds: ["ex-dumbbell-romanian-deadlift", "ex-goblet-squat"],
  },
  {
    id: "ex-farmer-carry", slug: "farmer-carry", category: "Full body", name: "Farmer Carry", primaryMuscle: "Full body", secondaryMuscles: ["Forearms", "Upper back", "Trunk stabilizers", "Legs"], equipment: ["Dumbbells"], difficulty: "beginner", movementPattern: "Loaded carry",
    video: {"url": "https://www.youtube.com/watch?v=8OtwXwrJizk", "title": "How To Do A Farmer's Walk (Farmer's Carry)", "creator": "PureGym", "description": "An external farmer carry demonstration to complement the setup and control cues in this written guide.", "verification": {"checkedOn": "2026-10-18", "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."}},
    description: "A controlled walk with a dumbbell held at each side.",
    instructions: ["Pick up two manageable dumbbells using a controlled hinge and stand with your arms by your sides.", "Walk along a clear, level route with short steady steps and an upright trunk.", "Stop before grip or posture fails and set the weights down under control."],
    tips: ["Keep enough clearance between the weights and your legs.", "Turn slowly rather than pivoting abruptly with heavy weights."], mistakes: ["Rushing or swaying from side to side.", "Continuing when the fingers are losing their grip."], safety: ["Clear the walking path and plan where to set the weights down. Keep other people away from the load path."], relatedIds: ["ex-kettlebell-deadlift", "ex-hammer-curl"],
  },
  ...ADDITIONAL_EXERCISES,
];

export function findExerciseBySlug(slug: string): Exercise | undefined {
  return EXERCISES.find((exercise) => exercise.slug === slug);
}
export function searchExercises(query: string, exercises: readonly Exercise[] = EXERCISES): Exercise[] {
  if (typeof query !== "string") return [];
  const normalized = query.trim().toLowerCase();
  return exercises.filter((exercise) => exercise.name.toLowerCase().includes(normalized));
}
export function filterExercises(filters: ExerciseFilters = {}): Exercise[] {
  const { category = "", search = "", muscle = "", equipment = "", difficulty = "" } = filters;
  // Reject unknown filter values rather than silently widening results.
  if ((category && !DIRECTORY_CATEGORIES.some((value) => value === category)) ||
      typeof category !== "string" || (muscle && !MUSCLE_GROUPS.some((value) => value === muscle)) ||
      (equipment && !EQUIPMENT.some((value) => value === equipment)) ||
      (difficulty && !DIFFICULTIES.some((value) => value === difficulty)) ||
      typeof muscle !== "string" || typeof equipment !== "string" || typeof difficulty !== "string") return [];
  return searchExercises(search).filter((exercise) => (!category || exercise.category === category) && (!muscle || exercise.primaryMuscle === muscle) &&
    (!equipment || exercise.equipment.includes(equipment)) && (!difficulty || exercise.difficulty === difficulty));
}
export function findRelatedExercises(id: string): Exercise[] {
  const exercise = EXERCISES.find((item) => item.id === id);
  if (!exercise) return [];
  return exercise.relatedIds.flatMap((relatedId) => {
    const related = EXERCISES.find((item) => item.id === relatedId);
    return related ? [related] : [];
  });
}
