# Product

## Promise

QuestFit — **Your body. Your adventure.** — makes a home workout feel like an adventure: AI creates a personalized routine, converts it into a mission, and uses the player's body as the controller.

## Primary Users and Job

The initial audience is casual fitness beginners, students, busy professionals, and home-workout users who struggle with repetitive routines. They need a short, understandable session that feels playful without hiding the physical work.

## MVP User Journey

1. Enter through a welcome screen and sign up, sign in, or continue as a guest.
2. Complete a fitness profile with the minimum information needed for personalization: height, weight, activity frequency, goal, fitness level, and optional movement limitations.
3. Grant camera access and complete one-time, touch-free calibration for every supported movement.
4. Choose available time and generate a validated workout plan using the saved profile.
5. Compile the plan into one themed adventure briefing.
6. Play the mission using recognized exercise events.
7. Review completion, accuracy, XP, and rewards.
8. Receive a coaching recap grounded only in calculated metrics.
9. Save profile, calibration thresholds, and progress when signed in; guest data remains local and can be converted without blocking play.

## MVP Scope

- One polished adventure theme and mission loop
- Guest welcome and local profile onboarding; account entry remains visibly unavailable in the demo build
- Fitness profile onboarding used by workout personalization
- Structured AI workout generation with schema validation and fallback
- Workout-to-adventure level compilation
- Local MediaPipe pose detection and one-time, touch-free per-user calibration
- Phaser gameplay with readable objectives and forgiving recognition failures
- Deterministic session metrics, XP, streak, and recommendation rules
- AI-written session recap constrained to deterministic facts
- Local guest profile, compatible calibration reuse, and latest-session continuity
- Responsive browser UI with a desktop-first webcam experience

The MVP movement library contains squat, jump, lunge, jumping jack, high knees, push-up, plank, left/right punch, and left/right side reach. The migration reuses the prototype's proven squat and jump behavior, but every movement is implemented through the new registry, calibration, event, gameplay, accessibility, and verification boundaries. A movement is not considered supported merely because it appears in generated content.

The judged guest plan uses a six-movement standing sequence: jumping jack, squat, left punch, right punch, high knees, then jump. It demonstrates full-body, lower-body, cardio, and directional tracking without asking the presenter to reposition the laptop or transition to the floor. Other registered movements remain available for future plan variation and the verified full-library check.

That sequence is the default 15-minute general-fitness path, not a universal result. Cardio, strength, and mobility intents use distinct curated structures. Ten-, fifteen-, and twenty-minute requests produce five, six, and seven stages respectively. Fitness level and activity frequency scale bounded targets and recovery; recognized knee/impact and shoulder/upper-body considerations remove incompatible movements and use goal-appropriate replacements. The briefing shows phases and concise reasons rather than internal encounter identifiers or hidden model reasoning.

Lower-body strength remains faithful to its stated intent: jumping jacks provide the warm-up, repeated squat/lunge sets provide the work, and jumps provide the power finale. Punches are reserved for general/cardio structures and limitation-driven fallback only when lower-body options have been explicitly excluded.

## Hackathon Release Boundary

The hackathon MVP is a complete, demoable vertical slice rather than a production launch. It must work on one documented reference laptop and a current Chromium browser, use one polished adventure theme, and complete the primary journey without manual state repair.

Must work for judging:

- Welcome entry, guest continuation, and fitness-profile onboarding
- Automatic, hands-free standing and floor movement setup with local-processing disclosure
- The full registered movement library, with the generated workout restricted to movements whose detection and gameplay gates pass
- Validated workout generation with a deterministic fallback when an external AI provider is unavailable
- Goal-aware five-to-seven-stage workouts that use goal, time, level, activity frequency, and recognized movement considerations to select, order, scale, and explain a safe standing mission
- One blueprint-driven mission with readable objectives, forgiving misses, completion, and replay
- Deterministic session results and a fact-grounded coaching recap with fallback copy
- Local guest profile, calibration, and latest-session continuity
- Automated regression coverage for camera denial/loss, AI failure, and save failure; the live judged walkthrough follows the happy path

Allowed hackathon constraints:

- One browser family, one adventure theme, and a small curated workout/template set
- Email, Google authentication, remote synchronization, history, and leaderboard are deferred until after the judged guest demo
- Weekly leaderboard, deep history, social systems, production analytics, multi-region operations, and content administration may be deferred after the vertical slice
- Deterministic planner and coach fallbacks are acceptable demo behavior and must be presented honestly, not disguised as live model output

The team must not claim a movement, remote save, authentication provider, or AI provider is live unless its feature evidence demonstrates the real boundary.

## Non-Goals for the MVP

- Multiplayer, guilds, friends leaderboard, battle pass, seasonal events
- Medical advice, diagnosis, injury assessment, or authoritative posture correction
- Wearable integration or native mobile apps
- Raw webcam upload or cloud landmark storage
- Unlimited generated themes or fully generative game mechanics
- LLM-calculated scores, accuracy, streaks, or fitness recommendations

## Product Rules

- Adventure meaning comes from the environment and objective, not from requiring a large character animation set.
- Calibration is required before the first mission that uses a movement. It advances automatically from stable full-body framing through spoken/visible countdowns and sample capture; users standing away from the laptop must not need to touch the keyboard or pointer.
- Preparation is a launch state, not a second form. Returning guests with compatible saved thresholds still receive live full-body readiness validation, then a spoken/visible three-second countdown opens the mission automatically. First-time calibration ends in the same automatic launch sequence.
- Recalibration is requested only when the user chooses it, the camera/device changes materially, saved thresholds are incompatible, or tracking quality is persistently unreliable.
- Detection noise should reduce credit or trigger recoverable feedback, not cause an unexplained instant failure.
- The AI layer must be visible but never pretend to be measuring facts it did not calculate.
- Guest users reach the core experience before being asked to create an account.
- Every failure state gives a next action: retry, adjust framing, use fallback content, or continue without saving.

## Movement Library

| Family | Executable movement IDs | Mode | Primary camera setup |
| --- | --- | --- | --- |
| Squat | `squat` | reps | standing, front view |
| Jump | `jump` | reps | standing, full body |
| Lunge | `lunge` | reps | standing, full body |
| Jumping jack | `jumping-jack` | reps | standing, full body and arm clearance |
| High knees | `high-knees` | reps | standing, full body |
| Push-up | `push-up` | reps | floor, side view |
| Plank | `plank` | hold | floor, side view |
| Punch | `punch-left`, `punch-right` | reps | standing, upper body visible |
| Side reach | `side-reach-left`, `side-reach-right` | reps or hold | standing, upper body and lateral clearance |

## Success Signals

- Workout completion rate
- Time from landing to first mission
- Mission completion and retry rate
- Calibration retry rate
- Returning users and streak continuation
- AI generation fallback/error rate
- Gameplay frame time and pose-to-action latency

## Acceptance Bar

The hackathon MVP is acceptable when a new guest can complete the judged vertical slice twice without refresh on the reference setup, every movement offered by the planner has verified detection and gameplay support, webcam data remains local, provider failures retain automated fallback coverage, and session facts are reproducible from inputs. Remote identity and persistence are explicitly outside the demo claim.
