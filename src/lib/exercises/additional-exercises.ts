import type { Exercise } from "./types.ts";

// Original VAJRYA written guides. Persistent IDs are future planner references.
export const ADDITIONAL_EXERCISES: readonly Exercise[] = [
  {
    "id": "ex-barbell-bench-press",
    "slug": "barbell-bench-press",
    "name": "Barbell Bench Press",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Front deltoids"
    ],
    "equipment": [
      "Barbell",
      "Bench",
      "Rack"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal push",
    "description": "A flat-bench press with a barbell and a planned rack setup.",
    "instructions": [
      "Set the rack and safety catches for your range; lie with feet supported and hands evenly spaced.",
      "Unrack with control and lower the bar toward the mid chest with wrists above forearms.",
      "Press back up without bouncing and re-rack only when the bar is securely over both hooks."
    ],
    "tips": [
      "Keep the upper back supported.",
      "Learn a controlled touch point with a light bar."
    ],
    "mistakes": [
      "Bouncing the bar off the chest.",
      "Lifting without a safe way to end the set."
    ],
    "safety": [
      "Use properly set safeties and a competent spotter for challenging loads; do not train to failure alone."
    ],
    "relatedIds": [
      "ex-dumbbell-bench-press",
      "ex-machine-chest-press"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=CayG6UYqL8g",
      "title": "How to do a Barbell Bench Press | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external barbell bench press demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-incline-dumbbell-bench-press",
    "slug": "incline-dumbbell-bench-press",
    "name": "Incline Dumbbell Bench Press",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Front deltoids"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Incline push",
    "description": "An angled bench press emphasizing a different shoulder and chest position.",
    "instructions": [
      "Set a stable bench to a modest incline and position light dumbbells near the upper chest.",
      "Press upward through a comfortable path with feet and back supported.",
      "Lower slowly and finish with a controlled way to set down the weights."
    ],
    "tips": [
      "Avoid turning the incline into a fully upright press.",
      "Keep wrists in line with forearms."
    ],
    "mistakes": [
      "Flaring the elbows sharply.",
      "Dropping the weights after the set."
    ],
    "safety": [
      "Start light and seek help with setup if positioning the dumbbells strains your shoulders."
    ],
    "relatedIds": [
      "ex-dumbbell-bench-press",
      "ex-incline-barbell-bench-press"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=_NrQUYg7Nlc",
      "title": "How to do a Incline Dumbbell Bench Press",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external incline dumbbell bench press demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-incline-barbell-bench-press",
    "slug": "incline-barbell-bench-press",
    "name": "Incline Barbell Bench Press",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Front deltoids"
    ],
    "equipment": [
      "Barbell",
      "Bench",
      "Rack"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Incline push",
    "description": "A barbell press performed on a supported incline bench.",
    "instructions": [
      "Set the incline bench and rack safeties before lying down with feet supported.",
      "Unrack an evenly gripped bar and lower toward the upper chest within your controlled range.",
      "Press upward and return the bar securely to both hooks."
    ],
    "tips": [
      "Use a modest bench angle.",
      "Keep the bar clear of the neck."
    ],
    "mistakes": [
      "Bouncing at the bottom.",
      "Losing upper-back support."
    ],
    "safety": [
      "Use a competent spotter and suitable safeties; stop if the shoulder position is uncomfortable."
    ],
    "relatedIds": [
      "ex-barbell-bench-press",
      "ex-incline-dumbbell-bench-press"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=BjGLs6KGWUc",
      "title": "How to do a Incline Barbell Bench Press  | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external incline barbell bench press demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-dumbbell-chest-fly",
    "slug": "dumbbell-chest-fly",
    "name": "Dumbbell Chest Fly",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Front deltoids",
      "Arm stabilizers"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal adduction",
    "description": "A light flat-bench fly with a softly bent elbow position.",
    "instructions": [
      "Lie on a stable flat bench with light dumbbells above the chest and elbows softly bent.",
      "Open your arms slowly until you reach a comfortable chest stretch without forcing depth.",
      "Bring the arms back over the chest while keeping the elbow bend fairly constant."
    ],
    "tips": [
      "Use much less load than for a press.",
      "Keep shoulders supported."
    ],
    "mistakes": [
      "Dropping below a controllable shoulder range.",
      "Straightening the elbows rigidly."
    ],
    "safety": [
      "Long lever arms increase shoulder demand; shorten the range or choose a press if this causes discomfort."
    ],
    "relatedIds": [
      "ex-cable-chest-fly",
      "ex-pec-deck-fly"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=QwuUZ5wgQOk",
      "title": "Dumbbell Flyes - Chest Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external dumbbell chest fly demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-cable-chest-fly",
    "slug": "cable-chest-fly",
    "name": "Cable Chest Fly",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Front deltoids",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal adduction",
    "description": "A standing two-cable fly at approximately chest height.",
    "instructions": [
      "Set both pulleys near chest height and take a stable staggered stance with light handles.",
      "Bring the hands forward in an arc with a gentle bend in the elbows.",
      "Return slowly without letting the weights pull you into an excessive stretch."
    ],
    "tips": [
      "Keep your ribs over your pelvis.",
      "Match the pulley heights."
    ],
    "mistakes": [
      "Leaning forward farther with each repetition.",
      "Forcing the hands behind the body."
    ],
    "safety": [
      "Check both attachments and leave room around the cable path; avoid painful shoulder ranges."
    ],
    "relatedIds": [
      "ex-dumbbell-chest-fly",
      "ex-pec-deck-fly"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=XNf6TBErGys",
      "title": "How to do a Two-Arm Standing Cable Fly | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external cable chest fly demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-pec-deck-fly",
    "slug": "pec-deck-fly",
    "name": "Pec Deck Fly",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Front deltoids"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "beginner",
    "movementPattern": "Horizontal adduction",
    "description": "A seated machine fly using a guided arm path.",
    "instructions": [
      "Adjust the seat so the handles or pads align comfortably near chest height.",
      "Bring the arms together with a soft elbow bend and your back against the pad.",
      "Open slowly only as far as your shoulders comfortably allow."
    ],
    "tips": [
      "Use the machine setup diagram.",
      "Choose a controlled starting width."
    ],
    "mistakes": [
      "Slamming the weight stack.",
      "Rolling the shoulders forward forcefully."
    ],
    "safety": [
      "Machine designs differ; ask staff to check the seat and start position before loading."
    ],
    "relatedIds": [
      "ex-cable-chest-fly",
      "ex-machine-chest-press"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=eGjt4lk6g34",
      "title": "How To Use The Chest Fly Machine",
      "creator": "PureGym",
      "description": "An external pec deck fly demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-dumbbell-floor-press",
    "slug": "dumbbell-floor-press",
    "name": "Dumbbell Floor Press",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Front deltoids"
    ],
    "equipment": [
      "Dumbbells"
    ],
    "difficulty": "beginner",
    "movementPattern": "Horizontal push",
    "description": "A floor-based press with upper-arm contact limiting the lowering range.",
    "instructions": [
      "Lie on a clear floor with knees bent and light dumbbells positioned above the chest.",
      "Lower until the upper arms gently contact the floor, keeping wrists stacked.",
      "Press upward smoothly and use a controlled setup and exit."
    ],
    "tips": [
      "Pause gently rather than bouncing off the floor.",
      "Keep the neck relaxed."
    ],
    "mistakes": [
      "Dropping the elbows onto hard ground.",
      "Using weights you cannot position."
    ],
    "safety": [
      "Use padding and manageable loads; the floor reduces range but does not make every load or shoulder position suitable."
    ],
    "relatedIds": [
      "ex-dumbbell-bench-press",
      "ex-incline-push-up"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=T0Y3OBF1bNI",
      "title": "How To Do A Dumbbell Floor Press",
      "creator": "PureGym",
      "description": "An external dumbbell floor press demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-kneeling-push-up",
    "slug": "kneeling-push-up",
    "name": "Kneeling Push-Up",
    "category": "Chest",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Front deltoids",
      "Abdominals"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "beginner",
    "movementPattern": "Horizontal push",
    "description": "A floor push-up supported at the knees to shorten the lever.",
    "instructions": [
      "Place hands slightly wider than shoulders and rest the knees on padding.",
      "Lower the chest between the hands while keeping a steady line from knees through shoulders.",
      "Push away from the floor without folding at the hips."
    ],
    "tips": [
      "Move the trunk and hips together.",
      "Use a comfortable elbow angle."
    ],
    "mistakes": [
      "Leaving the hips behind while the chest moves.",
      "Shrugging toward the ears."
    ],
    "safety": [
      "Use an incline instead if knee pressure or wrist loading is uncomfortable."
    ],
    "relatedIds": [
      "ex-incline-push-up",
      "ex-push-up"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=PDr5B2jLUOw",
      "title": "How to do a Modified Push-Up | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external kneeling push-up demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-pull-up",
    "slug": "pull-up",
    "name": "Pull-Up",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Abdominals"
    ],
    "equipment": [
      "Pull-up bar"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Vertical pull",
    "description": "An overhand bodyweight pull from a secure overhead bar.",
    "instructions": [
      "Grip a secure bar with palms facing away and start from a controlled hanging position.",
      "Pull your chest upward by bending the elbows without kicking or swinging.",
      "Lower smoothly through a comfortable shoulder range and step down safely."
    ],
    "tips": [
      "Keep the neck neutral.",
      "Use assistance before technique breaks down."
    ],
    "mistakes": [
      "Kipping to finish a strict repetition.",
      "Craning the chin toward the bar."
    ],
    "safety": [
      "Confirm the bar is secure and use a stable step; seek guidance if hanging provokes shoulder symptoms."
    ],
    "relatedIds": [
      "ex-assisted-pull-up",
      "ex-lat-pulldown"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=9yVGh3XbJ34",
      "title": "How to do a Pull-Up | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external pull-up demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-chin-up",
    "slug": "chin-up",
    "name": "Chin-Up",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Abdominals"
    ],
    "equipment": [
      "Pull-up bar"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Vertical pull",
    "description": "A palms-toward-you bodyweight pull with a controlled descent.",
    "instructions": [
      "Take an underhand grip on a secure bar at a comfortable width.",
      "Pull upward without swinging, allowing your elbows to bend beside your trunk.",
      "Lower slowly and end the set before grip or posture fails."
    ],
    "tips": [
      "Avoid forcing a narrow grip.",
      "Keep your legs quiet."
    ],
    "mistakes": [
      "Jerking out of the bottom.",
      "Reaching upward with the neck."
    ],
    "safety": [
      "Underhand grip can irritate some wrists or elbows; use a comfortable alternative with coaching if needed."
    ],
    "relatedIds": [
      "ex-pull-up",
      "ex-assisted-pull-up"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=fNZ8Ty7jSFA",
      "title": "Chin-Up - Back Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external chin-up demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-barbell-bent-over-row",
    "slug": "barbell-bent-over-row",
    "name": "Barbell Bent-Over Row",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear deltoids",
      "Back stabilizers"
    ],
    "equipment": [
      "Barbell"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal pull",
    "description": "A two-arm barbell row held in a stable hip hinge.",
    "instructions": [
      "Hinge with softly bent knees and hold a manageable bar below the shoulders.",
      "Pull toward the lower ribs while maintaining the same trunk angle.",
      "Lower with control without letting the back round or the bar swing."
    ],
    "tips": [
      "Brace before each pull.",
      "Keep the bar close to the body."
    ],
    "mistakes": [
      "Standing up to heave the bar.",
      "Rounding the back as fatigue builds."
    ],
    "safety": [
      "Use a supported row if you cannot maintain the hinged position comfortably."
    ],
    "relatedIds": [
      "ex-one-arm-dumbbell-row",
      "ex-chest-supported-dumbbell-row"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=bm0_q9bR_HA",
      "title": "How to do a Barbell Bent Over Row Pronated",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external barbell bent-over row demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-chest-supported-dumbbell-row",
    "slug": "chest-supported-dumbbell-row",
    "name": "Chest-Supported Dumbbell Row",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear deltoids"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "beginner",
    "movementPattern": "Horizontal pull",
    "description": "A two-dumbbell row with the chest supported on an incline bench.",
    "instructions": [
      "Lie chest-down on a stable incline bench with feet planted and arms hanging clear.",
      "Pull the dumbbells toward your ribs without lifting your chest from the pad.",
      "Lower slowly until the arms lengthen comfortably."
    ],
    "tips": [
      "Allow room for the weights below the bench.",
      "Keep the neck aligned."
    ],
    "mistakes": [
      "Throwing the head back.",
      "Bouncing the chest off the pad."
    ],
    "safety": [
      "Check bench stability and use a height that allows arm clearance without forcing your neck position."
    ],
    "relatedIds": [
      "ex-one-arm-dumbbell-row",
      "ex-seated-cable-row"
    ]
  },
  {
    "id": "ex-inverted-row",
    "slug": "inverted-row",
    "name": "Inverted Row",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear deltoids",
      "Abdominals"
    ],
    "equipment": [
      "Barbell",
      "Rack"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal pull",
    "description": "A bodyweight row underneath a securely fixed rack bar.",
    "instructions": [
      "Secure a bar in a rack against movement and position yourself underneath with heels grounded.",
      "Brace and pull the chest toward the bar while keeping a steady body line.",
      "Lower smoothly; bend the knees or raise the bar to reduce the demand."
    ],
    "tips": [
      "Check the bar cannot roll or dislodge.",
      "Keep elbows at a comfortable angle."
    ],
    "mistakes": [
      "Letting the hips sag.",
      "Using unsecured household furniture."
    ],
    "safety": [
      "Use equipment rated for this setup and verify the rack attachments before getting underneath."
    ],
    "relatedIds": [
      "ex-band-row",
      "ex-seated-cable-row"
    ]
  },
  {
    "id": "ex-straight-arm-cable-pulldown",
    "slug": "straight-arm-cable-pulldown",
    "name": "Straight-Arm Cable Pulldown",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Triceps",
      "Abdominals"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "beginner",
    "movementPattern": "Shoulder extension",
    "description": "A high-cable pull with only a small, steady elbow bend.",
    "instructions": [
      "Hold a high-pulley bar with arms reaching forward and a small hip hinge.",
      "Pull the bar toward your thighs without turning the movement into an elbow extension.",
      "Return slowly while keeping the ribs controlled."
    ],
    "tips": [
      "Use a light load to keep the arms long.",
      "Keep the shoulders away from the ears."
    ],
    "mistakes": [
      "Swinging the torso.",
      "Bending and straightening the elbows repeatedly."
    ],
    "safety": [
      "Limit overhead reach to a comfortable range and check the attachment before starting."
    ],
    "relatedIds": [
      "ex-lat-pulldown",
      "ex-dumbbell-pullover"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=wcVDItawocI",
      "title": "Straight Arm Pulldown - Back Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external straight-arm cable pulldown demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-neutral-grip-lat-pulldown",
    "slug": "neutral-grip-lat-pulldown",
    "name": "Neutral-Grip Lat Pulldown",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "beginner",
    "movementPattern": "Vertical pull",
    "description": "A front pulldown using parallel handles with palms facing inward.",
    "instructions": [
      "Fit the thigh pad and take a comfortable parallel-handle grip.",
      "Pull the handles toward the upper chest without a large backward lean.",
      "Return overhead with control while keeping the weights from slamming."
    ],
    "tips": [
      "Keep the neck relaxed.",
      "Use a handle width that fits your shoulders."
    ],
    "mistakes": [
      "Pulling behind the head.",
      "Swinging to move the stack."
    ],
    "safety": [
      "Check the seat and pad; stop if the overhead position is painful."
    ],
    "relatedIds": [
      "ex-lat-pulldown",
      "ex-assisted-pull-up"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=KgZqDuNx7rI",
      "title": "The BEST way to Perform the Neutral Grip Lat Pulldown | Form Tutorial",
      "creator": "Physique Development",
      "description": "An external neutral-grip lat pulldown demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-dumbbell-pullover",
    "slug": "dumbbell-pullover",
    "name": "Dumbbell Pullover",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Chest",
      "Triceps",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Shoulder extension",
    "description": "A bench-supported shoulder-extension movement with one light dumbbell.",
    "instructions": [
      "Lie lengthwise on a bench with head and back supported and a secure two-handed dumbbell grip.",
      "Lower the weight behind the head with elbows softly bent, stopping before the ribs flare.",
      "Bring the weight back above the chest with control."
    ],
    "tips": [
      "Begin with a short range.",
      "Keep your feet stable."
    ],
    "mistakes": [
      "Arching the back to increase depth.",
      "Using a loose grip overhead."
    ],
    "safety": [
      "Overhead mobility and grip security are essential; use a cable alternative if this position is uncomfortable."
    ],
    "relatedIds": [
      "ex-straight-arm-cable-pulldown",
      "ex-lat-pulldown"
    ]
  },
  {
    "id": "ex-band-pull-apart",
    "slug": "band-pull-apart",
    "name": "Band Pull-Apart",
    "category": "Back",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Rear deltoids",
      "Rotator cuff"
    ],
    "equipment": [
      "Resistance band"
    ],
    "difficulty": "beginner",
    "movementPattern": "Horizontal abduction",
    "description": "A light band movement opening the arms in front of the chest.",
    "instructions": [
      "Hold an intact light band at chest height with softly bent elbows.",
      "Separate your hands until your arms open comfortably without shrugging.",
      "Return slowly while keeping gentle control of the band."
    ],
    "tips": [
      "Use a wide enough grip to avoid straining.",
      "Keep the ribs steady."
    ],
    "mistakes": [
      "Snapping the band back.",
      "Forcing the shoulders backward."
    ],
    "safety": [
      "Inspect the band and keep it away from your face; this is not a treatment for shoulder pain."
    ],
    "relatedIds": [
      "ex-cable-face-pull",
      "ex-bent-over-dumbbell-reverse-fly"
    ]
  },
  {
    "id": "ex-barbell-front-squat",
    "slug": "barbell-front-squat",
    "name": "Barbell Front Squat",
    "category": "Legs and quads",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Abdominals",
      "Upper back"
    ],
    "equipment": [
      "Barbell",
      "Rack"
    ],
    "difficulty": "advanced",
    "movementPattern": "Squat",
    "description": "A front-racked barbell squat requiring an upright, controlled trunk.",
    "instructions": [
      "Set rack safeties and learn a secure front-rack position with a light bar.",
      "Unrack, brace, and bend hips and knees to a depth you can control without losing the rack.",
      "Stand through your feet and re-rack securely."
    ],
    "tips": [
      "Keep elbows supported high enough to retain the bar.",
      "Choose a comfortable stance."
    ],
    "mistakes": [
      "Letting the bar roll forward.",
      "Forcing depth after the trunk collapses."
    ],
    "safety": [
      "Get coaching for the rack position and safe exit; wrist or shoulder limitations may require another squat variation."
    ],
    "relatedIds": [
      "ex-goblet-squat",
      "ex-barbell-back-squat"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=yr_8VuSqhmM",
      "title": "How to do a Barbell Front Squat with Clean Position",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external barbell front squat demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-leg-press",
    "slug": "leg-press",
    "name": "Leg Press",
    "category": "Legs and quads",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Calves"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "beginner",
    "movementPattern": "Squat",
    "description": "A supported machine press using the hips and knees.",
    "instructions": [
      "Adjust the seat and place feet on the platform so knees can track comfortably.",
      "Release the safety only after supporting the load and lower without the pelvis curling off the pad.",
      "Press back without snapping the knees straight and re-engage the locks before exiting."
    ],
    "tips": [
      "Learn the safety mechanism first.",
      "Keep the whole foot supported."
    ],
    "mistakes": [
      "Lowering until the lower back rounds.",
      "Locking the knees abruptly."
    ],
    "safety": [
      "Ask staff to check the setup and safety catches; use a range you can control."
    ],
    "relatedIds": [
      "ex-bodyweight-squat",
      "ex-leg-extension"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=cDGOn-yfKJA",
      "title": "How to do a Leg Press  | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external leg press demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-leg-extension",
    "slug": "leg-extension",
    "name": "Leg Extension",
    "category": "Legs and quads",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Hip stabilizers"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "beginner",
    "movementPattern": "Knee extension",
    "description": "A seated machine movement straightening the knees against a padded lever.",
    "instructions": [
      "Align your knees with the machine pivot and set the pad above the front of the ankles.",
      "Straighten the knees smoothly within a comfortable range.",
      "Lower without dropping the stack or lifting off the seat."
    ],
    "tips": [
      "Use the handles for steady support.",
      "Choose a manageable load."
    ],
    "mistakes": [
      "Kicking the pad quickly.",
      "Forcing through knee discomfort."
    ],
    "safety": [
      "Machine fit matters; seek qualified guidance for knee symptoms or recent knee procedures."
    ],
    "relatedIds": [
      "ex-leg-press",
      "ex-bodyweight-squat"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=yR_LqZYSIgM",
      "title": "Leg Extensions - Leg Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external leg extension demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-bulgarian-split-squat",
    "slug": "bulgarian-split-squat",
    "name": "Bulgarian Split Squat",
    "category": "Legs and quads",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Adductors",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Bodyweight",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Lunge",
    "description": "A split squat with the rear foot supported on a low, stable bench.",
    "instructions": [
      "Place the rear foot on a low support and set the front foot far enough forward to balance.",
      "Bend the front knee and lower your hips through a comfortable range.",
      "Push through the front foot to rise; finish both sides with controlled balance."
    ],
    "tips": [
      "Start without added weight.",
      "Use hand support if needed."
    ],
    "mistakes": [
      "Using an excessively high rear support.",
      "Bouncing the rear knee off the ground."
    ],
    "safety": [
      "Choose a stable low bench and reduce range if the rear hip, front knee, or balance is uncomfortable."
    ],
    "relatedIds": [
      "ex-reverse-lunge",
      "ex-step-up"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=TEXl2b3__S4",
      "title": "How To Do Bulgarian Split Squats",
      "creator": "PureGym",
      "description": "An external bulgarian split squat demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-walking-lunge",
    "slug": "walking-lunge",
    "name": "Walking Lunge",
    "category": "Legs and quads",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Adductors",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Lunge",
    "description": "A sequence of forward steps with a controlled lowering between steps.",
    "instructions": [
      "Stand on a clear level route and step forward to a stable stance.",
      "Bend both knees to lower comfortably without striking the rear knee on the ground.",
      "Push through the front foot to step through and repeat on the other side."
    ],
    "tips": [
      "Leave space between the feet sideways.",
      "Take deliberate steps."
    ],
    "mistakes": [
      "Rushing and losing balance.",
      "Letting the knee collapse inward."
    ],
    "safety": [
      "Start with stationary or supported lunges if moving balance is uncertain."
    ],
    "relatedIds": [
      "ex-reverse-lunge",
      "ex-bulgarian-split-squat"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=mAgbXQdd4LM",
      "title": "How To Do Walking Lunges",
      "creator": "PureGym",
      "description": "An external walking lunge demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-step-up",
    "slug": "step-up",
    "name": "Step-Up",
    "category": "Legs and quads",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Bodyweight",
      "Step"
    ],
    "difficulty": "beginner",
    "movementPattern": "Step",
    "description": "A controlled step onto a low, stable platform.",
    "instructions": [
      "Place one whole foot on a low non-slip step with support nearby.",
      "Press through the raised foot to stand on the platform without jumping from the trailing leg.",
      "Step down slowly and repeat with each leg."
    ],
    "tips": [
      "Choose a height you can manage without rocking.",
      "Keep the knee aligned comfortably over the foot."
    ],
    "mistakes": [
      "Pushing hard off the floor leg.",
      "Dropping quickly from the step."
    ],
    "safety": [
      "Use a fixed step rather than movable furniture and hold a rail if needed."
    ],
    "relatedIds": [
      "ex-reverse-lunge",
      "ex-bodyweight-squat"
    ]
  },
  {
    "id": "ex-seated-calf-raise",
    "slug": "seated-calf-raise",
    "name": "Seated Calf Raise",
    "category": "Legs and quads",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Foot stabilizers"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "beginner",
    "movementPattern": "Ankle plantar flexion",
    "description": "A bent-knee heel raise on a seated calf machine.",
    "instructions": [
      "Set the thigh pad and place the balls of the feet securely on the footplate.",
      "Release the safety and raise the heels smoothly without bouncing.",
      "Lower through a comfortable ankle range and secure the lever before exiting."
    ],
    "tips": [
      "Keep pressure spread across the forefoot.",
      "Pause under control."
    ],
    "mistakes": [
      "Bouncing out of the lowest position.",
      "Rolling the ankles outward."
    ],
    "safety": [
      "Learn the release mechanism and reduce range or load if the Achilles tendon or forefoot is painful."
    ],
    "relatedIds": [
      "ex-standing-calf-raise",
      "ex-leg-press"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=--NKtIuvghI",
      "title": "How/Why To Do Seated Calf Raise",
      "creator": "Jim Stoppani, PhD",
      "description": "An external seated calf raise demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-barbell-romanian-deadlift",
    "slug": "barbell-romanian-deadlift",
    "name": "Barbell Romanian Deadlift",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Back stabilizers",
      "Forearms"
    ],
    "equipment": [
      "Barbell"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Hip hinge",
    "description": "A standing barbell hinge emphasizing controlled hip movement.",
    "instructions": [
      "Hold a manageable bar at the thighs with knees softly bent.",
      "Move your hips back and slide the bar close to the legs, stopping before your back position changes.",
      "Drive through your feet to stand without leaning backward."
    ],
    "tips": [
      "Keep knee bend fairly steady.",
      "Use your controlled hinge range rather than aiming for the floor."
    ],
    "mistakes": [
      "Turning the movement into a deep squat.",
      "Rounding to reach lower."
    ],
    "safety": [
      "Learn the hinge with light loads; use a raised starting position to pick up the bar if needed."
    ],
    "relatedIds": [
      "ex-dumbbell-romanian-deadlift",
      "ex-barbell-hip-thrust"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=xgusDooVfKU",
      "title": "How to do a Romanian Deadlift (Barbell) | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external barbell romanian deadlift demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-barbell-hip-thrust",
    "slug": "barbell-hip-thrust",
    "name": "Barbell Hip Thrust",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings",
      "Abdominals"
    ],
    "equipment": [
      "Barbell",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Hip extension",
    "description": "A loaded hip extension with the upper back supported on a stable bench.",
    "instructions": [
      "Secure a bench, pad the bar across the hips, and position feet flat with upper back supported.",
      "Raise the hips until the trunk and thighs align without overextending the lower back.",
      "Lower slowly while keeping the bar balanced and plan a controlled exit."
    ],
    "tips": [
      "Use suitable padding.",
      "Keep the chin and ribs controlled."
    ],
    "mistakes": [
      "Driving through the neck.",
      "Finishing with a large back arch."
    ],
    "safety": [
      "Check bench stability and load the bar so it can be positioned and removed safely; ask for help learning the setup."
    ],
    "relatedIds": [
      "ex-glute-bridge",
      "ex-barbell-romanian-deadlift"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=Fk1OfkMmVt4",
      "title": "Barbell Hip Thrust - Legs / Glutes Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external barbell hip thrust demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-conventional-deadlift",
    "slug": "conventional-deadlift",
    "name": "Conventional Deadlift",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings",
      "Quadriceps",
      "Back stabilizers",
      "Forearms"
    ],
    "equipment": [
      "Barbell"
    ],
    "difficulty": "advanced",
    "movementPattern": "Hip hinge",
    "description": "A barbell floor lift using coordinated hip and knee extension.",
    "instructions": [
      "Stand with the bar over the midfoot, hinge and bend the knees to take a secure grip.",
      "Brace and push through the floor to stand with the bar close, keeping arms long.",
      "Return the bar by hinging and bending the knees, setting it down under control."
    ],
    "tips": [
      "Take tension before the bar leaves the floor.",
      "Finish tall without leaning back."
    ],
    "mistakes": [
      "Jerking a slack bar upward.",
      "Letting the load drift away from the legs."
    ],
    "safety": [
      "Get coaching for floor setup and bracing; adjust starting height if the floor position cannot be controlled."
    ],
    "relatedIds": [
      "ex-kettlebell-deadlift",
      "ex-trap-bar-deadlift"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=a5zhnubunoE",
      "title": "Barbell Deadlift - Leg & Back Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external conventional deadlift demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-trap-bar-deadlift",
    "slug": "trap-bar-deadlift",
    "name": "Trap-Bar Deadlift",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Quadriceps",
      "Hamstrings",
      "Back stabilizers",
      "Forearms"
    ],
    "equipment": [
      "Trap bar"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Hip hinge",
    "description": "A floor lift standing inside a hexagonal bar with side handles.",
    "instructions": [
      "Center yourself in the trap bar and choose matching handle heights.",
      "Bend hips and knees, grip evenly, brace, and stand by pushing through both feet.",
      "Lower with control and let the load settle before resetting."
    ],
    "tips": [
      "Use the same height on both handles.",
      "Keep the arms long."
    ],
    "mistakes": [
      "Tipping forward onto the toes.",
      "Shrugging to finish the lift."
    ],
    "safety": [
      "Handle height changes the range; use appropriate plates and a starting position you can control."
    ],
    "relatedIds": [
      "ex-conventional-deadlift",
      "ex-kettlebell-deadlift"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=mZX8101zCA4",
      "title": "Trap Bar Deadlifting - The Beginners Guide to Performing it Safely and Effectively",
      "creator": "David Otey Fitness",
      "description": "An external trap-bar deadlift demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-lying-leg-curl",
    "slug": "lying-leg-curl",
    "name": "Lying Leg Curl",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "beginner",
    "movementPattern": "Knee flexion",
    "description": "A prone machine curl bending the knees against an ankle pad.",
    "instructions": [
      "Adjust the pivot near your knees and position the pad above the heels.",
      "Bend the knees to draw the pad upward without lifting the hips off the support.",
      "Lower slowly through a comfortable range."
    ],
    "tips": [
      "Keep the pelvis supported.",
      "Use a smooth start."
    ],
    "mistakes": [
      "Arching the back to move the pad.",
      "Dropping the weight stack."
    ],
    "safety": [
      "Check pad fit and avoid forcing knee flexion if it causes pain or cramping."
    ],
    "relatedIds": [
      "ex-seated-leg-curl",
      "ex-dumbbell-romanian-deadlift"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=lUH80pneL5w",
      "title": "How to do a Lying Leg Curl | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external lying leg curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-seated-leg-curl",
    "slug": "seated-leg-curl",
    "name": "Seated Leg Curl",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "beginner",
    "movementPattern": "Knee flexion",
    "description": "A seated machine curl with the thighs stabilized by a pad.",
    "instructions": [
      "Align the knees with the pivot and secure the thigh and ankle pads comfortably.",
      "Bend the knees to move the lever under the seat without sliding forward.",
      "Return slowly while maintaining contact with the back support."
    ],
    "tips": [
      "Follow the machine setup diagram.",
      "Keep the thigh pad secure without excessive pressure."
    ],
    "mistakes": [
      "Lifting the hips to finish.",
      "Letting the lever pull back abruptly."
    ],
    "safety": [
      "Ask staff to confirm machine fit, especially if you cannot align the pivot or pads comfortably."
    ],
    "relatedIds": [
      "ex-lying-leg-curl",
      "ex-barbell-romanian-deadlift"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=_2Kd0d-JEUM",
      "title": "How to do a Seated Leg Curl  | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external seated leg curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-single-leg-romanian-deadlift",
    "slug": "single-leg-romanian-deadlift",
    "name": "Single-Leg Romanian Deadlift",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Foot stabilizers",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Single-leg hip hinge",
    "description": "An unloaded single-leg hinge that challenges hip and balance control.",
    "instructions": [
      "Stand near stable hand support and soften the stance knee.",
      "Hinge at the hip as the other leg reaches behind, keeping the pelvis mostly level.",
      "Return to standing without twisting; repeat on both sides."
    ],
    "tips": [
      "Use hand support while learning.",
      "Keep the reach short enough to balance."
    ],
    "mistakes": [
      "Opening the hip toward the ceiling.",
      "Rounding to reach the floor."
    ],
    "safety": [
      "Balance is a separate skill from strength; use support and avoid unstable surfaces."
    ],
    "relatedIds": [
      "ex-dumbbell-romanian-deadlift",
      "ex-glute-bridge"
    ]
  },
  {
    "id": "ex-cable-pull-through",
    "slug": "cable-pull-through",
    "name": "Cable Pull-Through",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Hip hinge",
    "description": "A low-cable hinge with the rope passing between the legs.",
    "instructions": [
      "Face away from a low pulley and hold the rope between your legs with secure clearance.",
      "Step forward, soften the knees, and move hips back while keeping the spine steady.",
      "Stand by extending the hips without leaning backward or pulling with the arms."
    ],
    "tips": [
      "Keep arms long.",
      "Choose a load that does not pull you backward."
    ],
    "mistakes": [
      "Squatting deeply instead of hinging.",
      "Snapping the hips into a back arch."
    ],
    "safety": [
      "Check the attachment, footing, and rope clearance; learn the hinge before adding cable tension."
    ],
    "relatedIds": [
      "ex-kettlebell-deadlift",
      "ex-barbell-hip-thrust"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=fbF4_pn_0xc",
      "title": "How To Do A CABLE PULL THROUGH | Exercise Demonstration Video and Guide",
      "creator": "Live Lean TV Daily Exercises",
      "description": "An external cable pull-through demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-band-lateral-walk",
    "slug": "band-lateral-walk",
    "name": "Band Lateral Walk",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Hip abductors",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Resistance band"
    ],
    "difficulty": "beginner",
    "movementPattern": "Hip abduction",
    "description": "Short sideways steps against a loop band above the knees.",
    "instructions": [
      "Place an intact loop band above the knees and adopt a shallow, comfortable squat.",
      "Step sideways a small distance without tipping the trunk or knees inward.",
      "Bring the other foot along without snapping the band slack, then change direction."
    ],
    "tips": [
      "Keep the steps small.",
      "Maintain comfortable foot alignment."
    ],
    "mistakes": [
      "Dragging the trailing leg.",
      "Swaying the torso to move the band."
    ],
    "safety": [
      "Use a light band and clear level floor; stop if the band position irritates the knees or skin."
    ],
    "relatedIds": [
      "ex-clamshell",
      "ex-glute-bridge"
    ]
  },
  {
    "id": "ex-clamshell",
    "slug": "clamshell",
    "name": "Clamshell",
    "category": "Glutes and hamstrings",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Hip rotators",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "beginner",
    "movementPattern": "Hip external rotation",
    "description": "A side-lying hip rotation with knees bent and feet together.",
    "instructions": [
      "Lie on your side with knees bent and pelvis stacked.",
      "Keep the feet touching and open the upper knee only as far as the pelvis stays still.",
      "Lower slowly and repeat on both sides."
    ],
    "tips": [
      "Use a small range initially.",
      "Support your head comfortably."
    ],
    "mistakes": [
      "Rolling the pelvis backward.",
      "Forcing a large opening."
    ],
    "safety": [
      "Use comfortable padding and avoid pressure on a painful hip; seek guidance for persistent hip symptoms."
    ],
    "relatedIds": [
      "ex-band-lateral-walk",
      "ex-glute-bridge"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=V_AnVxKPFlY",
      "title": "How to do Clamshells",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external clamshell demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-arnold-press",
    "slug": "arnold-press",
    "name": "Arnold Press",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Upper chest"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Vertical push",
    "description": "A seated dumbbell press with a controlled change in forearm orientation.",
    "instructions": [
      "Sit on a stable backed bench with light dumbbells in front of the shoulders and palms toward you.",
      "Open and rotate the arms comfortably as you press overhead without arching the back.",
      "Reverse the path slowly to the starting position."
    ],
    "tips": [
      "Use lighter weights while learning the rotation.",
      "Move through a comfortable shoulder path."
    ],
    "mistakes": [
      "Forcing rotation at the bottom.",
      "Flaring the ribs overhead."
    ],
    "safety": [
      "Rotation is not comfortable for every shoulder; use a neutral-grip press instead if needed."
    ],
    "relatedIds": [
      "ex-seated-dumbbell-shoulder-press",
      "ex-standing-dumbbell-shoulder-press"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=X60-yTMOJfw",
      "title": "Arnold Dumbbell Press - Shoulder Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external arnold press demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-standing-dumbbell-shoulder-press",
    "slug": "standing-dumbbell-shoulder-press",
    "name": "Standing Dumbbell Shoulder Press",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Dumbbells"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Vertical push",
    "description": "A standing overhead press with independent dumbbell paths.",
    "instructions": [
      "Stand steadily with dumbbells at shoulder height and wrists over forearms.",
      "Brace and press overhead through a comfortable path without leg drive.",
      "Lower slowly without leaning backward."
    ],
    "tips": [
      "Use a slightly inward-facing grip if comfortable.",
      "Keep breathing between repetitions."
    ],
    "mistakes": [
      "Turning it into a push press.",
      "Arching the lower back."
    ],
    "safety": [
      "Use a seated supported press if standing trunk control or overhead range is limited."
    ],
    "relatedIds": [
      "ex-seated-dumbbell-shoulder-press",
      "ex-barbell-overhead-press"
    ]
  },
  {
    "id": "ex-cable-lateral-raise",
    "slug": "cable-lateral-raise",
    "name": "Cable Lateral Raise",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Upper trapezius"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "beginner",
    "movementPattern": "Shoulder abduction",
    "description": "A single-arm side raise against a low cable.",
    "instructions": [
      "Stand beside a low pulley and hold the handle with the far hand across the front of your body.",
      "Raise the arm out and slightly forward with a soft elbow bend to a comfortable height.",
      "Lower slowly and repeat on each side."
    ],
    "tips": [
      "Start with a light stack setting.",
      "Keep the torso steady."
    ],
    "mistakes": [
      "Leaning away to move more load.",
      "Lifting through shoulder pain."
    ],
    "safety": [
      "Check cable clearance and avoid forcing an awkward starting reach."
    ],
    "relatedIds": [
      "ex-dumbbell-lateral-raise",
      "ex-dumbbell-scaption"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=Z5FA9aq3L6A",
      "title": "How To Do Cable Lateral Raises",
      "creator": "PureGym",
      "description": "An external cable lateral raise demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-bent-over-dumbbell-reverse-fly",
    "slug": "bent-over-dumbbell-reverse-fly",
    "name": "Bent-Over Dumbbell Reverse Fly",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Upper back",
      "Back stabilizers"
    ],
    "equipment": [
      "Dumbbells"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal abduction",
    "description": "A light reverse fly performed from a controlled hip hinge.",
    "instructions": [
      "Hinge with knees softly bent and light dumbbells below the shoulders.",
      "Open the arms outward with a slight elbow bend without lifting the trunk.",
      "Lower slowly while maintaining the hinge."
    ],
    "tips": [
      "Use a light load and relaxed neck.",
      "Keep the reach within shoulder comfort."
    ],
    "mistakes": [
      "Swinging the torso.",
      "Shrugging forcefully at the top."
    ],
    "safety": [
      "Use a chest-supported alternative if the unsupported hinge is uncomfortable."
    ],
    "relatedIds": [
      "ex-reverse-pec-deck-fly",
      "ex-band-pull-apart"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=kLW7nbw4lcY",
      "title": "How to do a Bent-Over Dumbbell Rear Fly",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external bent-over dumbbell reverse fly demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-reverse-pec-deck-fly",
    "slug": "reverse-pec-deck-fly",
    "name": "Reverse Pec Deck Fly",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Upper back",
      "Rotator cuff"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "beginner",
    "movementPattern": "Horizontal abduction",
    "description": "A chest-supported machine reverse fly for the rear shoulder area.",
    "instructions": [
      "Face the machine pad and set the seat so handles align near shoulder height.",
      "Open your arms backward through a comfortable arc without lifting the chest.",
      "Return slowly without letting the stack crash."
    ],
    "tips": [
      "Keep a gentle elbow bend.",
      "Adjust the starting width before loading."
    ],
    "mistakes": [
      "Throwing the arms behind the body.",
      "Lifting the shoulders toward the ears."
    ],
    "safety": [
      "Machine geometry varies; get setup help if the handles do not fit your shoulder range."
    ],
    "relatedIds": [
      "ex-bent-over-dumbbell-reverse-fly",
      "ex-cable-face-pull"
    ]
  },
  {
    "id": "ex-dumbbell-front-raise",
    "slug": "dumbbell-front-raise",
    "name": "Dumbbell Front Raise",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Upper chest",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Dumbbells"
    ],
    "difficulty": "beginner",
    "movementPattern": "Shoulder flexion",
    "description": "A controlled light dumbbell raise in front of the body.",
    "instructions": [
      "Stand steadily with light dumbbells at the thighs and a comfortable grip.",
      "Raise the arms forward toward shoulder height without locking the elbows.",
      "Lower slowly without leaning backward."
    ],
    "tips": [
      "Keep the ribs steady.",
      "A neutral grip may feel more comfortable."
    ],
    "mistakes": [
      "Swinging to initiate the raise.",
      "Raising above a comfortable range."
    ],
    "safety": [
      "Use light resistance and stop for pinching or pain rather than forcing overhead height."
    ],
    "relatedIds": [
      "ex-dumbbell-lateral-raise",
      "ex-dumbbell-scaption"
    ]
  },
  {
    "id": "ex-band-external-rotation",
    "slug": "band-external-rotation",
    "name": "Band External Rotation",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Rotator cuff",
      "Upper back"
    ],
    "equipment": [
      "Resistance band"
    ],
    "difficulty": "beginner",
    "movementPattern": "Shoulder external rotation",
    "description": "A light single-arm outward rotation with the elbow beside the torso.",
    "instructions": [
      "Anchor a light band at elbow height and stand side-on with the far arm bent to a right angle.",
      "Keep the elbow near your ribs and rotate the forearm outward without turning your trunk.",
      "Return slowly and repeat on each side."
    ],
    "tips": [
      "Use very light tension.",
      "Keep the wrist straight."
    ],
    "mistakes": [
      "Moving the elbow away from the ribs.",
      "Twisting the whole torso."
    ],
    "safety": [
      "Check the anchor and use a pain-free range; this guide does not replace rehabilitation advice."
    ],
    "relatedIds": [
      "ex-cable-face-pull",
      "ex-band-pull-apart"
    ]
  },
  {
    "id": "ex-dumbbell-scaption",
    "slug": "dumbbell-scaption",
    "name": "Dumbbell Scaption",
    "category": "Shoulders",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Rotator cuff",
      "Upper trapezius"
    ],
    "equipment": [
      "Dumbbells"
    ],
    "difficulty": "beginner",
    "movementPattern": "Shoulder elevation",
    "description": "A light thumbs-up raise slightly forward of the sides.",
    "instructions": [
      "Stand with light dumbbells and thumbs facing upward.",
      "Raise the arms diagonally forward and outward toward shoulder height within a comfortable range.",
      "Lower slowly while keeping the torso still."
    ],
    "tips": [
      "Keep the elbows softly bent.",
      "Use a relaxed neck."
    ],
    "mistakes": [
      "Shrugging to finish.",
      "Using momentum to raise heavy weights."
    ],
    "safety": [
      "Stop for shoulder pain and do not use the movement as a substitute for individual assessment."
    ],
    "relatedIds": [
      "ex-dumbbell-lateral-raise",
      "ex-dumbbell-front-raise"
    ]
  },
  {
    "id": "ex-barbell-curl",
    "slug": "barbell-curl",
    "name": "Barbell Curl",
    "category": "Biceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": [
      "Barbell"
    ],
    "difficulty": "beginner",
    "movementPattern": "Elbow flexion",
    "description": "A standing underhand barbell curl with steady upper arms.",
    "instructions": [
      "Stand with an evenly spaced underhand grip and the bar near the thighs.",
      "Bend the elbows to raise the bar without leaning back.",
      "Lower slowly through a comfortable elbow range."
    ],
    "tips": [
      "Keep wrists aligned.",
      "Use a grip width that fits your arms."
    ],
    "mistakes": [
      "Heaving the torso backward.",
      "Dropping the bar at the bottom."
    ],
    "safety": [
      "A straight bar may not suit every wrist; reduce load or choose dumbbells if the grip is uncomfortable."
    ],
    "relatedIds": [
      "ex-dumbbell-biceps-curl",
      "ex-ez-bar-curl"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=pQfJR-sSIvA",
      "title": "How to Do a Barbell Bicep Curl | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external barbell curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-ez-bar-curl",
    "slug": "ez-bar-curl",
    "name": "EZ-Bar Curl",
    "category": "Biceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": [
      "EZ bar"
    ],
    "difficulty": "beginner",
    "movementPattern": "Elbow flexion",
    "description": "A standing curl using the angled grips of an EZ bar.",
    "instructions": [
      "Hold the angled grips evenly and stand with arms beside your torso.",
      "Curl without moving your upper arms far forward.",
      "Lower with control without snapping the elbows straight."
    ],
    "tips": [
      "Choose a comfortable grip section.",
      "Keep shoulders relaxed."
    ],
    "mistakes": [
      "Swinging to initiate the lift.",
      "Bending wrists backward."
    ],
    "safety": [
      "Angled grips change wrist position but do not guarantee comfort; stop for joint pain."
    ],
    "relatedIds": [
      "ex-barbell-curl",
      "ex-hammer-curl"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=S_i3SEVgKWU",
      "title": "EZ-Bar Curl - Biceps Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external ez-bar curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-incline-dumbbell-curl",
    "slug": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Curl",
    "category": "Biceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Elbow flexion",
    "description": "A seated curl with the back supported on an incline bench.",
    "instructions": [
      "Sit on a modestly inclined bench with arms hanging comfortably beside the body.",
      "Curl the dumbbells without allowing the shoulders to roll forward.",
      "Lower slowly only through a range your shoulders and elbows tolerate."
    ],
    "tips": [
      "Use light loads in the stretched starting position.",
      "Keep the head supported."
    ],
    "mistakes": [
      "Forcing the arms far behind the trunk.",
      "Swinging the weights forward."
    ],
    "safety": [
      "Reduce the incline or choose an upright curl if shoulder extension is uncomfortable."
    ],
    "relatedIds": [
      "ex-dumbbell-biceps-curl",
      "ex-concentration-curl"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=0dT4L6Lsi80",
      "title": "How to do a Incline Dumbbell Curl",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external incline dumbbell curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-preacher-curl",
    "slug": "preacher-curl",
    "name": "Preacher Curl",
    "category": "Biceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": [
      "EZ bar",
      "Preacher bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Elbow flexion",
    "description": "A supported curl with the upper arms resting on an angled pad.",
    "instructions": [
      "Adjust the seat so the upper arms rest fully on the pad and take an even EZ-bar grip.",
      "Curl without lifting the upper arms off the support.",
      "Lower slowly and stop before forced elbow straightening."
    ],
    "tips": [
      "Use a manageable load.",
      "Keep the armpits comfortably near the top of the pad."
    ],
    "mistakes": [
      "Bouncing out of the lowest position.",
      "Lifting the shoulders to finish."
    ],
    "safety": [
      "Do not force the loaded bottom stretch; ask for help positioning or returning the bar if needed."
    ],
    "relatedIds": [
      "ex-ez-bar-curl",
      "ex-concentration-curl"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=RgN216Cumtw",
      "title": "Preacher Curl - Biceps Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external preacher curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-cable-curl",
    "slug": "cable-curl",
    "name": "Cable Curl",
    "category": "Biceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "beginner",
    "movementPattern": "Elbow flexion",
    "description": "A standing two-arm curl against a low pulley.",
    "instructions": [
      "Attach a suitable bar to a low pulley and stand with elbows near the sides.",
      "Curl upward with steady upper arms and a controlled torso.",
      "Lower slowly without letting the cable pull your wrists out of line."
    ],
    "tips": [
      "Keep the cable path clear.",
      "Use a comfortable grip width."
    ],
    "mistakes": [
      "Leaning back to move the stack.",
      "Letting the shoulders shrug."
    ],
    "safety": [
      "Check the attachment and choose a load that allows a stable stance."
    ],
    "relatedIds": [
      "ex-barbell-curl",
      "ex-dumbbell-biceps-curl"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=GNlopToAZyg",
      "title": "How To Do A Cable Curl",
      "creator": "PureGym",
      "description": "An external cable curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-concentration-curl",
    "slug": "concentration-curl",
    "name": "Concentration Curl",
    "category": "Biceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "beginner",
    "movementPattern": "Elbow flexion",
    "description": "A seated single-arm curl with the upper arm supported against the inner thigh.",
    "instructions": [
      "Sit on a stable bench and rest the working upper arm against the inner thigh.",
      "Curl one light dumbbell without twisting the trunk or bending the wrist.",
      "Lower slowly and repeat on both sides."
    ],
    "tips": [
      "Keep the shoulder relaxed.",
      "Support the other hand on the opposite thigh."
    ],
    "mistakes": [
      "Rocking the torso.",
      "Pressing the elbow painfully into the leg."
    ],
    "safety": [
      "Use a comfortable support point and range; avoid forcing a loaded straight elbow."
    ],
    "relatedIds": [
      "ex-dumbbell-biceps-curl",
      "ex-preacher-curl"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=ZcU2hN76UyA",
      "title": "Concentration Curls - Biceps Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external concentration curl demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-close-grip-bench-press",
    "slug": "close-grip-bench-press",
    "name": "Close-Grip Bench Press",
    "category": "Triceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Chest",
      "Front deltoids"
    ],
    "equipment": [
      "Barbell",
      "Bench",
      "Rack"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal push",
    "description": "A flat-bench barbell press with a comfortable narrower grip.",
    "instructions": [
      "Set safeties and take an even grip roughly around shoulder width on a flat bench.",
      "Lower the bar toward the lower chest with elbows tracking comfortably near the torso.",
      "Press up with stacked wrists and re-rack securely."
    ],
    "tips": [
      "Narrower does not mean hands touching.",
      "Keep the upper back supported."
    ],
    "mistakes": [
      "Folding the wrists backward.",
      "Bouncing the bar."
    ],
    "safety": [
      "Use suitable safeties and a competent spotter; an excessively narrow grip can strain wrists."
    ],
    "relatedIds": [
      "ex-barbell-bench-press",
      "ex-cable-triceps-pushdown"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=LJeqLAmJLfs",
      "title": "How to do a Close Grip Bench Press  | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external close-grip bench press demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-lying-ez-bar-triceps-extension",
    "slug": "lying-ez-bar-triceps-extension",
    "name": "Lying EZ-Bar Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Shoulder stabilizers"
    ],
    "equipment": [
      "EZ bar",
      "Bench"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Elbow extension",
    "description": "A lying elbow extension with an angled-grip bar and controlled clearance.",
    "instructions": [
      "Lie on a stable bench holding a light EZ bar above the chest with a secure grip.",
      "Bend the elbows to lower the bar toward a comfortable point near or behind the head, keeping clearance.",
      "Extend the elbows smoothly without letting the bar drift toward your face."
    ],
    "tips": [
      "Start with very light resistance.",
      "Keep upper-arm movement controlled."
    ],
    "mistakes": [
      "Dropping the bar near the head.",
      "Flaring the ribs to finish."
    ],
    "safety": [
      "Use a competent spotter while learning; choose a pushdown if safe clearance or elbow comfort cannot be maintained."
    ],
    "relatedIds": [
      "ex-overhead-dumbbell-triceps-extension",
      "ex-cable-triceps-pushdown"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=4re6CJ0XNF8",
      "title": "How To Do The Lying Triceps Extension Exercise |  Jim Stoppani, Ph.D.",
      "creator": "Bodybuilding.com",
      "description": "An external lying ez-bar triceps extension demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-overhead-cable-triceps-extension",
    "slug": "overhead-cable-triceps-extension",
    "name": "Overhead Cable Triceps Extension",
    "category": "Triceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Shoulder stabilizers",
      "Abdominals"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Elbow extension",
    "description": "A rope cable extension with the upper arms held overhead.",
    "instructions": [
      "Attach a rope to a low pulley, face away, and position it overhead with a light load and stable stance.",
      "Straighten the elbows without arching the lower back.",
      "Bend the elbows slowly within a comfortable overhead range."
    ],
    "tips": [
      "Keep the ribs controlled.",
      "Plan a safe way to enter and leave the position."
    ],
    "mistakes": [
      "Leaning farther forward each repetition.",
      "Forcing the elbows into a painful position."
    ],
    "safety": [
      "Check the rope and overhead clearance; use a pushdown if overhead positioning is uncomfortable."
    ],
    "relatedIds": [
      "ex-overhead-dumbbell-triceps-extension",
      "ex-cable-triceps-pushdown"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=mRozZKkGIfg",
      "title": "Cable Rope Overhead Tricep Extension - Tricep Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external overhead cable triceps extension demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-dumbbell-triceps-kickback",
    "slug": "dumbbell-triceps-kickback",
    "name": "Dumbbell Triceps Kickback",
    "category": "Triceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Rear deltoids",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Dumbbells",
      "Bench"
    ],
    "difficulty": "beginner",
    "movementPattern": "Elbow extension",
    "description": "A light single-arm elbow extension from a supported hinge.",
    "instructions": [
      "Support one hand and, if comfortable, the same-side knee on a stable bench; hinge and hold the working upper arm beside the trunk.",
      "Straighten the elbow to move a light dumbbell backward without swinging the shoulder.",
      "Bend the elbow slowly and repeat on both sides."
    ],
    "tips": [
      "Keep the upper arm fairly still.",
      "Use a small, controlled load."
    ],
    "mistakes": [
      "Throwing the weight upward.",
      "Rounding the back to hold the hinge."
    ],
    "safety": [
      "Use bench support and a comfortable shoulder position; stop if the hinge or elbow motion hurts."
    ],
    "relatedIds": [
      "ex-cable-triceps-pushdown",
      "ex-overhead-dumbbell-triceps-extension"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=JPmbMOu4IYw",
      "title": "How To Do A Tricep Kickback",
      "creator": "PureGym",
      "description": "An external dumbbell triceps kickback demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-assisted-triceps-dip",
    "slug": "assisted-triceps-dip",
    "name": "Assisted Triceps Dip",
    "category": "Triceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Chest",
      "Front deltoids"
    ],
    "equipment": [
      "Machine"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Vertical push",
    "description": "A machine-assisted dip using a controlled upright torso and comfortable depth.",
    "instructions": [
      "Set the assistance and mount the machine according to its instructions.",
      "Lower by bending the elbows only as far as the shoulders remain comfortable.",
      "Press up without snapping the elbows and dismount using the machine steps."
    ],
    "tips": [
      "More assistance reduces the lifting demand on many machines.",
      "Keep the neck relaxed."
    ],
    "mistakes": [
      "Dropping deeply below shoulder control.",
      "Bouncing on the assistance pad."
    ],
    "safety": [
      "Machine mechanisms vary; ask staff to explain safe mounting and avoid deep shoulder extension that causes pain."
    ],
    "relatedIds": [
      "ex-cable-triceps-pushdown",
      "ex-close-grip-bench-press"
    ]
  },
  {
    "id": "ex-diamond-push-up",
    "slug": "diamond-push-up",
    "name": "Diamond Push-Up",
    "category": "Triceps",
    "primaryMuscle": "Arms",
    "secondaryMuscles": [
      "Chest",
      "Front deltoids",
      "Abdominals"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Horizontal push",
    "description": "A close-hand floor push-up emphasizing a narrower pressing base.",
    "instructions": [
      "Place hands close together under the chest, adjusting the spacing for wrist comfort.",
      "Maintain a steady body line as you lower with elbows tracking back comfortably.",
      "Press away from the floor without the hips sagging."
    ],
    "tips": [
      "Hands do not have to touch if that strains the wrists.",
      "Use knee support while learning."
    ],
    "mistakes": [
      "Forcing a rigid diamond shape despite pain.",
      "Leading upward with the chest alone."
    ],
    "safety": [
      "This variation increases wrist and elbow demands; choose a wider grip or incline if needed."
    ],
    "relatedIds": [
      "ex-push-up",
      "ex-kneeling-push-up"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=K8bKxVcwjrk",
      "title": "How To Do A Diamond Push up",
      "creator": "PureGym",
      "description": "An external diamond push-up demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-pallof-press",
    "slug": "pallof-press",
    "name": "Pallof Press",
    "category": "Core and abs",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Glutes",
      "Shoulder stabilizers"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "beginner",
    "movementPattern": "Anti-rotation",
    "description": "A standing cable press that resists trunk rotation.",
    "instructions": [
      "Set a light cable at chest height and stand side-on holding the handle at the sternum.",
      "Press the hands forward without turning the chest or pelvis toward the pulley.",
      "Bring the hands back slowly and repeat facing the other direction."
    ],
    "tips": [
      "Use a stance that feels steady.",
      "Start with a short reach."
    ],
    "mistakes": [
      "Twisting toward the stack.",
      "Holding the breath through the whole set."
    ],
    "safety": [
      "Use light tension and secure footing; stop if resisting rotation causes back pain."
    ],
    "relatedIds": [
      "ex-bird-dog",
      "ex-side-plank"
    ]
  },
  {
    "id": "ex-cable-woodchop",
    "slug": "cable-woodchop",
    "name": "Cable Woodchop",
    "category": "Core and abs",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders",
      "Glutes"
    ],
    "equipment": [
      "Cable"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Trunk rotation",
    "description": "A controlled high-to-low cable movement with coordinated hip and trunk rotation.",
    "instructions": [
      "Stand side-on to a high pulley with a light two-handed grip.",
      "Move the handle diagonally toward the opposite hip while turning through the hips and allowing the feet to pivot.",
      "Return slowly and repeat on both sides without wrenching the lower back."
    ],
    "tips": [
      "Use a controlled range rather than speed.",
      "Let the feet turn with the hips."
    ],
    "mistakes": [
      "Twisting against fixed feet.",
      "Jerking with the arms."
    ],
    "safety": [
      "Rotation tolerance varies; seek guidance for back symptoms and use an anti-rotation drill if appropriate."
    ],
    "relatedIds": [
      "ex-pallof-press",
      "ex-bicycle-crunch"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=iTmMPyDzeYA",
      "title": "Standing Cable Wood Chop  - Core / Abs - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external cable woodchop demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-reverse-crunch",
    "slug": "reverse-crunch",
    "name": "Reverse Crunch",
    "category": "Core and abs",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip flexors"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "beginner",
    "movementPattern": "Trunk flexion",
    "description": "A small pelvic curl from a bent-knee supine position.",
    "instructions": [
      "Lie on your back with hips and knees bent and arms supported beside you.",
      "Gently curl the pelvis so the tailbone lifts a little without swinging the legs overhead.",
      "Lower slowly until the pelvis rests again."
    ],
    "tips": [
      "Keep the motion small.",
      "Exhale during the curl."
    ],
    "mistakes": [
      "Throwing the legs for momentum.",
      "Pressing through the neck."
    ],
    "safety": [
      "Use comfortable padding and stop if spinal flexion aggravates back or neck symptoms."
    ],
    "relatedIds": [
      "ex-dead-bug",
      "ex-bicycle-crunch"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=lmSP-c1X_iY",
      "title": "Reverse Crunch - Abs / Core Exercise - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external reverse crunch demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-hanging-knee-raise",
    "slug": "hanging-knee-raise",
    "name": "Hanging Knee Raise",
    "category": "Core and abs",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip flexors",
      "Forearms",
      "Shoulder stabilizers"
    ],
    "equipment": [
      "Pull-up bar"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Hip flexion with trunk control",
    "description": "A controlled knee raise from a secure overhead hang.",
    "instructions": [
      "Grip a secure bar and establish a steady, comfortable hanging position.",
      "Bring bent knees upward without swinging or jerking the shoulders.",
      "Lower the knees slowly and end the set before grip fails."
    ],
    "tips": [
      "Use a modest raising range.",
      "Keep the neck relaxed."
    ],
    "mistakes": [
      "Swinging to gain height.",
      "Dropping suddenly from the bar."
    ],
    "safety": [
      "Hanging requires grip and shoulder tolerance; use a floor alternative if hanging is uncomfortable."
    ],
    "relatedIds": [
      "ex-reverse-crunch",
      "ex-dead-bug"
    ]
  },
  {
    "id": "ex-bicycle-crunch",
    "slug": "bicycle-crunch",
    "name": "Bicycle Crunch",
    "category": "Core and abs",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip flexors",
      "Obliques"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Trunk flexion and rotation",
    "description": "An alternating supine curl with a controlled opposite-shoulder turn.",
    "instructions": [
      "Lie on your back with hands lightly supporting the head and knees bent above the hips.",
      "Extend one leg only as far as the trunk stays controlled and turn the opposite shoulder toward the bent knee.",
      "Switch sides slowly without pulling on the neck."
    ],
    "tips": [
      "Move the shoulder rather than just the elbow.",
      "Shorten the leg reach if the back arches."
    ],
    "mistakes": [
      "Yanking the head forward.",
      "Pedaling rapidly without trunk control."
    ],
    "safety": [
      "Use a smaller curl or another core drill if neck or back symptoms occur."
    ],
    "relatedIds": [
      "ex-reverse-crunch",
      "ex-dead-bug"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=VaL7XWK3MVE",
      "title": "How to Do a Bicycle Crunch Exercise | 30 Seconds | MedBridge",
      "creator": "Medbridge",
      "description": "An external bicycle crunch demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-ab-wheel-rollout",
    "slug": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout",
    "category": "Core and abs",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders",
      "Lats",
      "Glutes"
    ],
    "equipment": [
      "Ab wheel"
    ],
    "difficulty": "advanced",
    "movementPattern": "Anti-extension",
    "description": "A kneeling rollout that resists the trunk arching as the arms reach forward.",
    "instructions": [
      "Kneel on padding with both hands on an ab wheel and a wall ahead to limit travel.",
      "Roll forward only as far as you can keep the ribs and pelvis controlled.",
      "Pull back to the start without collapsing through the lower back."
    ],
    "tips": [
      "Begin with a short wall-limited range.",
      "Keep the hips from sagging."
    ],
    "mistakes": [
      "Rolling beyond controlled strength.",
      "Using a sudden backward hip jerk."
    ],
    "safety": [
      "This is demanding on shoulders and trunk; use a shorter-range core drill if alignment or comfort cannot be maintained."
    ],
    "relatedIds": [
      "ex-forearm-plank",
      "ex-dead-bug"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=Q5MT5omGNJI",
      "title": "Ab Roller - Ab Exercises - Bodybuilding.com",
      "creator": "Bodybuilding.com",
      "description": "An external ab wheel rollout demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-kettlebell-swing",
    "slug": "kettlebell-swing",
    "name": "Kettlebell Swing",
    "category": "Full body",
    "primaryMuscle": "Full body",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Trunk stabilizers",
      "Forearms"
    ],
    "equipment": [
      "Kettlebell"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Ballistic hip hinge",
    "description": "A two-handed hip-driven swing kept around chest height or below.",
    "instructions": [
      "Learn a controlled deadlift first; hinge to take a secure two-handed grip and hike the bell back between the legs.",
      "Extend the hips to let the bell float forward without lifting it with the shoulders.",
      "Hinge as the bell returns and finish by parking it under control."
    ],
    "tips": [
      "Keep the bell path clear.",
      "Let the hips drive the movement."
    ],
    "mistakes": [
      "Squatting and lifting with the arms.",
      "Leaning backward at the top."
    ],
    "safety": [
      "Get coaching for the ballistic hinge and safe start and stop; leave ample space and never continue with a slipping grip."
    ],
    "relatedIds": [
      "ex-kettlebell-deadlift",
      "ex-barbell-romanian-deadlift"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=1FjAoO5McVI",
      "title": "How To Do A Kettlebell Swing (Two Handed)",
      "creator": "PureGym",
      "description": "An external kettlebell swing demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-suitcase-carry",
    "slug": "suitcase-carry",
    "name": "Suitcase Carry",
    "category": "Full body",
    "primaryMuscle": "Full body",
    "secondaryMuscles": [
      "Forearms",
      "Obliques",
      "Glutes"
    ],
    "equipment": [
      "Dumbbells"
    ],
    "difficulty": "beginner",
    "movementPattern": "Loaded carry",
    "description": "A controlled walk carrying one dumbbell at the side.",
    "instructions": [
      "Pick up a manageable dumbbell with a controlled hinge and stand tall.",
      "Walk slowly along a clear level path without leaning toward or away from the load.",
      "Set the weight down under control and repeat on the other side."
    ],
    "tips": [
      "Take short steady steps.",
      "Keep room between the weight and the leg."
    ],
    "mistakes": [
      "Counter-leaning heavily.",
      "Continuing after the grip starts failing."
    ],
    "safety": [
      "Choose a light enough load to resist leaning and clear the walking route before starting."
    ],
    "relatedIds": [
      "ex-farmer-carry",
      "ex-side-plank"
    ]
  },
  {
    "id": "ex-turkish-get-up",
    "slug": "turkish-get-up",
    "name": "Turkish Get-Up",
    "category": "Full body",
    "primaryMuscle": "Full body",
    "secondaryMuscles": [
      "Shoulders",
      "Glutes",
      "Abdominals"
    ],
    "equipment": [
      "Kettlebell"
    ],
    "difficulty": "advanced",
    "movementPattern": "Floor-to-stand transition",
    "description": "A coordinated floor-to-standing sequence with an overhead kettlebell.",
    "instructions": [
      "Learn the sequence unloaded first: roll to the elbow, support on the hand, and raise the hips.",
      "Sweep the leg to a supported half-kneel, align the trunk, and stand while maintaining overhead control.",
      "Reverse each step deliberately, then return the bell safely using both hands."
    ],
    "tips": [
      "Practice each stage separately.",
      "Keep attention on balance and overhead clearance."
    ],
    "mistakes": [
      "Rushing transitions.",
      "Letting a loaded arm drift toward the face."
    ],
    "safety": [
      "Learn with a qualified coach before adding load; do not attempt to catch a falling bell and keep others clear."
    ],
    "relatedIds": [
      "ex-suitcase-carry",
      "ex-kettlebell-deadlift"
    ]
  },
  {
    "id": "ex-dumbbell-thruster",
    "slug": "dumbbell-thruster",
    "name": "Dumbbell Thruster",
    "category": "Full body",
    "primaryMuscle": "Full body",
    "secondaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Shoulders",
      "Triceps"
    ],
    "equipment": [
      "Dumbbells"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Squat to overhead push",
    "description": "A front-held dumbbell squat flowing into an overhead press.",
    "instructions": [
      "Hold light dumbbells near the shoulders and squat through a comfortable range.",
      "Stand smoothly and use the leg drive to assist a controlled overhead press.",
      "Lower the weights to the shoulders before beginning the next squat."
    ],
    "tips": [
      "Learn the squat and press separately first.",
      "Keep the ribs controlled overhead."
    ],
    "mistakes": [
      "Arching at the top.",
      "Dropping into the next squat before the weights are stable."
    ],
    "safety": [
      "Use a light load and stop as fatigue changes coordination; choose separate movements if overhead control is limited."
    ],
    "relatedIds": [
      "ex-goblet-squat",
      "ex-standing-dumbbell-shoulder-press"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=tJP-fwf5ASA",
      "title": "Dumbbell Thruster (FULL TUTORIAL) - Intense Full-Body Dumbbell Exercises",
      "creator": "Mike | J2FIT Strength & Conditioning",
      "description": "An external dumbbell thruster demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-brisk-walking",
    "slug": "brisk-walking",
    "name": "Brisk Walking",
    "category": "Cardio and conditioning",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Calves",
      "Glutes",
      "Quadriceps"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "beginner",
    "movementPattern": "Locomotion",
    "description": "A purposeful walk at a pace that suits your current capacity.",
    "instructions": [
      "Choose a clear level route and begin with an easy walking pace.",
      "Increase pace gradually using comfortable steps and relaxed arm movement.",
      "Slow down before finishing and stop if you feel unwell."
    ],
    "tips": [
      "Choose supportive footwear that fits.",
      "Adjust pace to the surface and weather."
    ],
    "mistakes": [
      "Forcing an uncomfortable stride length.",
      "Ignoring dizziness or unusual breathlessness."
    ],
    "safety": [
      "Use a safe route and seek qualified guidance for new chest symptoms, faintness, or exercise restrictions."
    ],
    "relatedIds": [
      "ex-stationary-cycling",
      "ex-step-up"
    ]
  },
  {
    "id": "ex-stationary-cycling",
    "slug": "stationary-cycling",
    "name": "Stationary Cycling",
    "category": "Cardio and conditioning",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "equipment": [
      "Stationary bike"
    ],
    "difficulty": "beginner",
    "movementPattern": "Cyclic conditioning",
    "description": "Indoor pedaling with adjustable resistance and a fitted seat position.",
    "instructions": [
      "Adjust the saddle so the knee stays slightly bent at the bottom of the pedal stroke.",
      "Begin at low resistance and pedal smoothly without rocking the hips.",
      "Reduce resistance and pace before stopping and dismounting carefully."
    ],
    "tips": [
      "Ask staff to check saddle height.",
      "Keep a comfortable grip rather than leaning heavily on the bars."
    ],
    "mistakes": [
      "Using a seat too low for comfortable knee motion.",
      "Stopping abruptly against heavy resistance."
    ],
    "safety": [
      "Bike controls differ; learn the braking system, especially on fixed-flywheel bikes."
    ],
    "relatedIds": [
      "ex-brisk-walking",
      "ex-rowing-ergometer"
    ]
  },
  {
    "id": "ex-rowing-ergometer",
    "slug": "rowing-ergometer",
    "name": "Rowing Ergometer",
    "category": "Cardio and conditioning",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs",
      "Back",
      "Arms",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Rowing machine"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Cyclic push and pull",
    "description": "A rowing-machine stroke coordinating the legs, trunk, and arms.",
    "instructions": [
      "Adjust the foot straps and begin with knees bent, arms long, and a comfortable forward hip hinge.",
      "Push with the legs, then open the hips slightly and draw the handle toward the lower ribs.",
      "Extend the arms first, hinge forward, and bend the knees to return smoothly."
    ],
    "tips": [
      "Learn the sequence at an easy pace.",
      "Use a relaxed grip and modest resistance."
    ],
    "mistakes": [
      "Pulling with the arms before the leg drive.",
      "Rounding the lower back at the front."
    ],
    "safety": [
      "Limit the forward reach to your controlled range and seek setup help if the stroke causes back or knee pain."
    ],
    "relatedIds": [
      "ex-stationary-cycling",
      "ex-seated-cable-row"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=4zWu1yuJ0_g",
      "title": "Correct Rowing Machine Technique, Improve Your Rowing  | Concept2",
      "creator": "concept2usa",
      "description": "An external rowing ergometer demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-jump-rope",
    "slug": "jump-rope",
    "name": "Jump Rope",
    "category": "Cardio and conditioning",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Calves",
      "Shoulders",
      "Trunk stabilizers"
    ],
    "equipment": [
      "Jump rope"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Repeated hopping",
    "description": "Low repeated hops while rotating a rope around the body.",
    "instructions": [
      "Choose a clear non-slip area and a rope length suited to your height.",
      "Turn the rope mainly with the wrists and make small, soft hops as it passes beneath the feet.",
      "Stop and reset before fatigue changes landing control."
    ],
    "tips": [
      "Start with short bouts or practice without the rope.",
      "Keep the shoulders relaxed."
    ],
    "mistakes": [
      "Jumping unnecessarily high.",
      "Landing stiffly on a hard surface."
    ],
    "safety": [
      "Impact may not suit every joint or tendon; use a lower-impact option if hopping is uncomfortable."
    ],
    "relatedIds": [
      "ex-jumping-jack",
      "ex-brisk-walking"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=knhqqXCtoEU",
      "title": "JUMP ROPE 101 - Learn The Basic Bounce",
      "creator": "Lauren Jumps",
      "description": "An external jump rope demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-jumping-jack",
    "slug": "jumping-jack",
    "name": "Jumping Jack",
    "category": "Cardio and conditioning",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Calves",
      "Glutes",
      "Shoulders"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "beginner",
    "movementPattern": "Repeated hopping",
    "description": "A rhythmic out-and-in step or hop with arm movement.",
    "instructions": [
      "Start upright with feet together and arms at the sides on a clear surface.",
      "Hop the feet outward while raising the arms through a comfortable range.",
      "Return softly; use alternating side steps instead of hops if needed."
    ],
    "tips": [
      "Keep landings quiet and controlled.",
      "Choose a comfortable arm height."
    ],
    "mistakes": [
      "Locking the knees on landing.",
      "Continuing after coordination is lost."
    ],
    "safety": [
      "Use a step version for lower impact and stop for joint pain or unusual breathlessness."
    ],
    "relatedIds": [
      "ex-brisk-walking",
      "ex-jump-rope"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=uLVt6u15L98",
      "title": "How to do a Jumping Jack  | Proper Form & Technique | NASM",
      "creator": "National Academy of Sports Medicine (NASM)",
      "description": "An external jumping jack demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  },
  {
    "id": "ex-mountain-climber",
    "slug": "mountain-climber",
    "name": "Mountain Climber",
    "category": "Cardio and conditioning",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Abdominals",
      "Shoulders",
      "Hip flexors"
    ],
    "equipment": [
      "Bodyweight"
    ],
    "difficulty": "intermediate",
    "movementPattern": "Alternating knee drive",
    "description": "Alternating knee drives from a stable high-plank position.",
    "instructions": [
      "Set hands under shoulders on a non-slip surface and extend the legs behind you.",
      "Bring one knee toward the chest without letting the hips sag.",
      "Return the foot and alternate sides at a pace that preserves trunk control."
    ],
    "tips": [
      "Start slowly before increasing pace.",
      "Keep weight distributed through the hands."
    ],
    "mistakes": [
      "Bouncing the hips sharply.",
      "Rushing with an arched back."
    ],
    "safety": [
      "Use an incline or a standing alternative if wrist loading or plank support is uncomfortable."
    ],
    "relatedIds": [
      "ex-forearm-plank",
      "ex-brisk-walking"
    ],
    "video": {
      "url": "https://www.youtube.com/watch?v=kLh-uczlPLg",
      "title": "How To Do Mountain Climbers",
      "creator": "PureGym",
      "description": "An external mountain climber demonstration to complement the setup and control cues in this written guide.",
      "verification": {
        "checkedOn": "2026-10-18",
        "notes": "YouTube oEmbed confirmed the exact title and channel; publisher title and watch-page description reviewed for exercise and equipment match. Full playback not reviewed."
      }
    }
  }
];
