# Architecture

This is the canonical system map for QuestFit.

## Tech Stack

- Language: TypeScript 5.9 in strict mode, with small JavaScript pose/calibration foundations covered by core regression tests
- Framework: Next.js 15 App Router with React 19
- Game and pose: Phaser 3 runtime and MediaPipe Tasks Vision adapter
- Data: planned Supabase Auth and PostgreSQL behind repositories and RLS
- Build and quality: npm, ESLint 9, Node/Vitest/Playwright tests, Next.js production build

## Folder Structure

```text
src/
  app/          Next.js routes, layouts, and global presentation
  calibration/  core calibration math used by typed feature adapters
  pose/         MediaPipe lifecycle and movement-classification foundations
  contracts/    executable Zod schemas and inferred types
  features/     identity, planning, calibration, gameplay, and coaching domains
docs/           canonical product, architecture, quality, and lifecycle records
```

Root configuration owns only repository-wide build, type, lint, and agent tooling. New domain code belongs under `src/`, not beside configuration files.

## System Shape

- Product: personalized workouts compiled into webcam-controlled game missions
- Primary flow: welcome/auth → profile → one-time automatic calibration → generate workout → compile adventure → play → analyze → coach → save progress
- Runtime surfaces: Next.js web UI and API routes, Phaser game runtime, browser MediaPipe worker/loop, Supabase auth and PostgreSQL
- Product behavior source of truth: `docs/PRODUCT.md`
- Hackathon deployment shape: one Next.js web application, browser-local MediaPipe inference, optional server-side AI adapter, and optional Supabase account sync; guest fallback keeps the judged journey runnable without external credentials

```text
Welcome/Auth -> FitnessProfile -> Workout Planner -> AI to Action -> Adventure Briefing
                                            |
                                            v
                                   Level Compiler -> AdventureBlueprint

Webcam -> MediaPipe -> landmarks -> calibration state machine -> CalibrationProfile
                              |                                      |
                              v                                      v
                   personalized classifier -----------------> MovementEvent
                                                                    |
                                                                    v
                                                             Phaser Runtime
                                                                    |
                                                                    v
                                                             SessionMetrics
                                                              /          \
                                                             v            v
                                                    Metrics Analyzer   Supabase adapter
                                                             |
                                                             v
                                                 Recommendation Engine
                                                             |
                                                             v
                                                        LLM Coach
```

## Domain Ownership

| Domain | Owns | Target entry points |
| --- | --- | --- |
| App | routing, lifecycle, server/client boundaries | `src/app/` |
| Workout planning | plan request, AI adapter, validation | `src/features/workout-planner/` |
| Level compilation | deterministic templates plus AI blueprint adapter | `src/features/level-compiler/` |
| Pose and calibration | webcam lifecycle, landmarks, automatic calibration state machine, thresholds, movement events | `src/features/calibration/`, `src/pose/` |
| Gameplay | Phaser scenes, encounters, challenge execution, scoring | `src/features/gameplay/` |
| Coaching | metrics, recommendations, recap generation | `src/features/coaching/` |
| Progress | auth, profiles, sessions, XP, streak, leaderboard | `src/features/progress/`, `src/lib/supabase/` |
| Contracts | Zod schemas and inferred TypeScript types | `src/contracts/` |

## Layer and Dependency Rules

Use this direction inside each domain:

```text
contracts/config -> pure domain logic -> adapters/services -> runtime coordinators -> UI
```

- UI never imports database clients or mutates runtime state directly.
- Phaser consumes validated blueprints and movement events; it does not call MediaPipe or AI providers.
- MediaPipe inference is scheduled independently from React rendering and Phaser updates.
- Supabase access enters through typed repositories/adapters. Row-level security remains the final authorization boundary.
- AI provider calls live behind server-side adapters. Provider secrets never enter browser bundles.
- Shared utilities remain domain-neutral; do not create a generic dumping-ground module.
- Cross-domain communication uses the contracts in `docs/DATA_MODEL.md` and their executable Zod equivalents.

## AI Boundaries

| Component | Implementation | Authority |
| --- | --- | --- |
| Workout Planner | deterministic goal/profile policy + schema validation; optional LLM phrasing | owns safe selection, ordering, targets, rest, intensity, exclusions, and bounded rationale facts |
| Level Compiler | templates and/or LLM + schema validation | proposes a playable blueprint |
| Pose Engine | MediaPipe landmarks + registered deterministic/temporal classifiers | emits movement observations |
| Metrics Analyzer | deterministic TypeScript | calculates session facts |
| Recommendation Engine | deterministic TypeScript rules | selects next-step guidance |
| LLM Coach | LLM constrained to structured facts | phrases the recap; cannot alter facts |

## Hackathon Runtime Policy

- Keep one deployable application and avoid introducing services that are not necessary for the judged vertical slice.
- External AI and Supabase integrations stay behind adapters. Missing credentials or provider failure must select deterministic/local behavior rather than break the mission.
- Local repositories are authoritative for guest profile, derived calibration, and demo continuity. Remote repositories become authoritative only after successful authenticated synchronization.
- Optimize and measure on the documented reference browser/device before generalizing to broad device support.
- Production-scale concerns remain visible as deferred work; hackathon shortcuts may not weaken webcam privacy, schema validation, cleanup, deterministic scoring, or authorization boundaries.
- The judged demo path is guest-only. Account sync remains a later adapter feature and must not consume game-polish time or appear partially live.

## Game Presentation Boundary

The mission controller remains authoritative for status, objective index, progress, combo, misses, XP, and completion. Phaser may derive encounter visuals, transitions, particles, camera effects, and optional sound from successive coarse snapshots, but it may not award credit, calculate scores, advance objectives, or synthesize mission facts. MediaPipe continues to publish validated movement events independently; React continues to own camera controls, voice controls, accessibility status, navigation, and results.

For the hackathon theme, project-owned generated raster art, code-native Phaser encounters, and procedural audio keep the game self-contained and license-safe. Asset provenance lives beside `public/game/`; presentation configuration remains separate from controller rules so a later art pack can replace visuals without changing scoring or pose behavior. Reduced motion disables camera shake, trails, pulsing, and large particle bursts while preserving immediate state feedback.

The cinematic mission layer derives a movement-matched runner action, hazard reaction, environmental pressure, and finale exclusively from successive `MissionSceneUpdate` snapshots. These animations are disposable views: they never publish movement events, mutate the mission controller, calculate XP, or delay authoritative progress. Automatic results navigation remains React-owned after result persistence, so Phaser teardown cannot block the route transition.

Mission music is a license-safe procedural Web Audio presentation adapter. It derives only a calm, rising, or escape tier from authoritative mission progress; it cannot affect timing, scoring, pose detection, or objective transitions. The mission attempts a low-volume fade-in on entry, reports browser-policy blocking honestly, exposes a direct mute/play control, pauses with mission state, fades out on completion/disable, and closes on route cleanup. Device and browser audio policy remains authoritative.

## Movement Detection Architecture

MediaPipe provides pretrained body landmarks; it does not decide whether a workout repetition is complete. The pose domain normalizes landmarks and routes each frame through a registered detector. Most MVP movements use deterministic geometry plus short temporal windows. A separately trained temporal classifier may be introduced only when recorded fixtures show that deterministic rules cannot meet the quality target; it must consume normalized landmark sequences, not uploaded video, and it is never trained during user onboarding.

| Detector family | MVP movements | Key signals |
| --- | --- | --- |
| Vertical lower body | `squat`, `jump`, `lunge`, `high-knees` | hip/knee angles, ankle/hip displacement, alternating knee lift, neutral rearm |
| Symmetric full body | `jumping-jack` | bilateral arm elevation and foot separation over time |
| Floor side-view | `push-up`, `plank` | shoulder/hip/ankle alignment, elbow angle, hold duration, required side-view visibility |
| Directional upper body | `punch-left`, `punch-right`, `side-reach-left`, `side-reach-right` | wrist extension, shoulder alignment, torso lean, side-specific neutral rearm |

The movement registry is the single source of supported capabilities. Workout planning, calibration, gameplay, metrics, and UI consume the registry or validated contracts; they must not maintain independent movement lists.

Canonical encounter copy is contract-adjacent presentation metadata keyed by the movement registry. Planning, React HUD, speech, and Phaser consume the same names and instructions; Phaser extends them only with visual kind and color. Repeated-set stage numbering derives from the validated blueprint order and never changes controller progress or scoring.

## Architectural Invariants

1. Cross-domain payloads enter through executable schemas; callers never trust AI or network shapes directly.
2. React owns routes and coarse UI state, Phaser owns per-frame game state/rendering, and MediaPipe owns inference scheduling.
3. Raw video and landmarks stay on-device and out of global state and persistence.
4. Authoritative metrics and recommendations are deterministic; LLM output may phrase but never replace them.
5. There is one product runtime and one judged journey; reusable pose/calibration foundations stay behind typed feature adapters and core tests.
6. Calibration persists derived thresholds and metadata only; video frames, images, and raw landmarks are never recorded or synchronized.
7. No movement is advertised as supported until its registry definition, detector, calibration/setup behavior, gameplay mapping, fixtures, and browser evidence all pass.
8. Workout goal, duration, level, activity, and recognized limitation rules deterministically own plan structure; AI cannot override exercise eligibility or authoritative targets.

## Decisions

- 2026-07-21: QuestFit is the user-facing product brand and “Your body. Your adventure.” is its tagline. Existing `ai-fitness-escape:*` storage keys and event channels remain stable compatibility identifiers until an explicit versioned migration prevents guest-data loss.
- 2026-07-21: The recurring Trail Guide is a shared React presentation component with curated route-owned messages and project-owned mood art. It may explain coarse states already owned by each screen, but cannot generate safety facts, score, pose events, recommendations, or gameplay progress. Reduced motion disables guide bob/celebration effects without removing dialogue.
- 2026-07-21: Adventure rationale cards and route destinations are React projections of validated planning data; the Phaser Ash Titan and Storm Gate remain disposable snapshot-driven views. Best-effort music autoplay may fail under browser/device policy and must fall back to an explicit control without delaying the mission.
- 2026-07-21: Planning is an explicit three-route journey. Browser session storage carries schema-validated request/result envelopes between `/plan`, `/ai-to-action`, and `/briefing`; AI to Action alone calls the server planner, and the briefing alone persists a validated mission. Missing or corrupt handoffs fail closed with a route back to planning.
- 2026-07-20: The redesign is split across presentation, planning, and gameplay boundaries. React owns the sport-first shell and pipeline explanation; planning policy owns the ordered workout intensity arc; Phaser presents story and boss reactions derived from authoritative mission snapshots. A guided cooldown is explicitly non-scored and cannot emit fabricated movement events.
- 2026-07-20: The workout arc is executable as warm-up/build/surge/peak metadata plus stage load scaling. A validated cooldown travels in the mission session, begins only after authoritative completion facts are saved, pauses camera scoring, and remains outside workout/blueprint target calculations.
- 2026-07-20: Boss combat is a Phaser projection: `bossBattleView` maps authoritative progress and the current/credited movement into story, telegraph, reaction, and health presentation. Boss visuals cannot publish movement events, change controller state, or calculate rewards.

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-07-17 | Use one Next.js App Router runtime rather than parallel Vite and Next apps | prevents duplicate configuration and makes the cutover boundary explicit |
| 2026-07-17 | Preserve proven prototype behavior during incremental migration | protects calibration and classifier behavior while replacement boundaries are verified |
| 2026-07-17 | Allow core JavaScript pose/calibration foundations behind typed adapters | preserves tested math while application and cross-domain contracts remain strictly typed |
| 2026-07-18 | Retire the prototype route and runner after the Phaser golden journey passed | establishes one coherent product while retaining only foundations imported by current features |
| 2026-07-17 | Require lint, typecheck, unit tests, and production build in `npm run verify` | makes the target foundation gate executable and cross-platform |
| 2026-07-18 | Use a pretrained MediaPipe landmark model plus a deterministic per-user classifier instead of training a model per user | keeps inference local, explainable, fast, and feasible from a short onboarding sample |
| 2026-07-18 | Replace manual framing/capture controls with an automatic calibration state machine | users stand several feet from the laptop and must complete setup without touching it |
| 2026-07-18 | Store only versioned derived calibration thresholds | enables one-time setup while preserving the raw-camera privacy boundary |
| 2026-07-18 | Model the MVP as an extensible registry of eleven movement IDs across four detector families | supports the full exercise scope without coupling planners or gameplay to squat/jump-specific code |
| 2026-07-18 | Use explicit left/right IDs for punches and side reaches | makes calibration, counting, mission mapping, and metrics deterministic |
| 2026-07-18 | Make the hackathon judged path guest-only and prioritize Phaser polish before Supabase | maximizes demo reliability and visible product value while keeping remote claims honest |
| 2026-07-18 | Treat game effects and sound as snapshot-derived presentation, never gameplay authority | preserves deterministic scoring and the independent pose/React/Phaser loops |
| 2026-07-19 | Add cinematic actions and world escalation as disposable snapshot views | makes the demo feel game-like without creating a second gameplay authority or coupling pose inference to Phaser |
| 2026-07-19 | Use opt-in procedural adaptive music instead of a streamed track | avoids autoplay, network, and licensing risk while allowing progress-driven urgency and deterministic cleanup |
| 2026-07-19 | Keep preparation as a route/state but make successful readiness auto-launch the mission | preserves camera/calibration validation and recovery without adding a second user decision |
| 2026-07-19 | Make workout policy deterministic and keep AI subordinate to validated rationale phrasing | makes goal/profile changes meaningful, keeps safety reproducible, and prevents provider output from overriding playable constraints |

## Hard Constraints

- Webcam video and raw landmarks remain local to the device.
- Every AI response is validated before use; invalid output has a safe fallback or actionable error.
- Gameplay remains usable when persistence is unavailable; saving may degrade, core movement must not.
- Guest play is supported. Account conversion must not block the first mission.
- No per-frame React or Zustand updates from pose landmarks or Phaser state.
- No calibration video, still frame, or raw landmark persistence. Account sync may contain only validated, versioned derived thresholds and device/model compatibility metadata.
- Authentication, leaderboard, and saved progress must use server-enforced authorization and Supabase RLS.

## Architecture Change Checklist

When a feature changes a boundary, update this file and the active execution plan, add or revise an executable check, and record the decision before marking the feature passing.
