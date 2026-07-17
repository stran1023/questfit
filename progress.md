# Progress Log

## Current Verified State

- Last updated: 2026-07-18
- Objective: migrate the verified endless-runner prototype to the workout-to-adventure product
- Active feature: `demo-liftoff`
- Canonical plan: `docs/exec-plans/active/product-transformation.md`
- Baseline: `npm run verify` passes lint, strict typecheck, 6 core pose/calibration tests, 79 Vitest tests, eight system-Chrome Playwright checks, and Next.js production builds for all current application routes
- Known baseline issue: npm audit reports two moderate vulnerabilities
- Next action: complete the real-camera guest journey twice using `docs/DEMO_RUNBOOK.md`, then record the observed rehearsal evidence

## Session Log

### 2026-07-18 — Guest-only demo boundary and engaging Volcano Escape polish

- User prioritized a guest happy-path hackathon walkthrough and deferred Supabase plus a physical camera-loss demonstration; preserved all automated recovery behavior and evidence.
- `mvp-hardening` passed review 12/12 against the revised guest-only demo boundary; `game-polish` became the sole active feature ahead of deferred persistence.
- Added a typed encounter presentation for all eleven movements: boulder, flame gate, broken bridge, lava steps, storm gate, directional walls/vines, low tunnel, and ember storm.
- Added snapshot-derived XP rings, combo surges, miss feedback, encounter transitions, an exclusive escape portal celebration, in-world combo/XP, and independent procedural sound control/cleanup.
- Reduced motion keeps direct feedback while disabling camera shake, moving sparks, pulse, and large transition motion.
- System Chrome drove all eleven presentation states and completion at 1440x900 and 390x844, preserving 16:9/no-overflow layout and under-25-ms 120-frame cadence; final screenshots were visually accepted.
- `npm run verify` passed ESLint, strict TypeScript, 11 regression tests, 78 Vitest tests, eight system-Chrome Playwright checks, and production build.
- `code-reviewer` accepted `game-polish` 12/12; `demo-liftoff` is now the sole active feature.
- Removed account, prototype, and movement-check distractions from the judged navigation while preserving the compatibility route and validated test fixtures outside the visible flow.
- Added `docs/DEMO_RUNBOOK.md` with the reference Chrome setup, full and short presenter sequences, expected voice/sound and latency behavior, recovery steps, and claim boundaries.
- Final `npm run verify` passed ESLint, strict TypeScript, 11 regression tests, 78 Vitest tests, eight responsive system-Chrome Playwright checks, and the production build.
- Automated release packaging is complete; `demo-liftoff` remains in progress until two clean-profile real-camera rehearsals are observed.
- Expanded both personalized and safe-fallback generation from prototype squat/jump-only content to the six-movement standing demo sequence: jumping jack, squat, left punch, right punch, high knees, and jump.
- Planner/contract focused verification passed 19 tests, strict typecheck, canonical challenge-template validation, and `git diff --check`.
- Retired the obsolete compatibility route, React/canvas runner screens, collision/spawner state, runner-only tests, and unused presentation CSS after confirming no current product imports.
- Kept the calibration math, pose classifier, webcam, and MediaPipe adapters because the typed preparation and mission features consume them directly; their verification lane is now `test:core`.
- Post-consolidation `npm run verify` passed lint, strict typecheck, 6 core tests, 78 Vitest tests, eight responsive Playwright checks, and a production build with no compatibility route.

### 2026-07-19 — Hands-free mission launch

- Reframed `/prepare` as a launch sequence rather than a second form: compatible saved thresholds skip rerecording but no longer skip live camera/full-body readiness validation.
- After 12 stable landmark frames, or after first-time calibration completes, the screen speaks and displays `3 · 2 · 1` and navigates to `/mission` automatically with no **Begin mission** button.
- Focused preparation tests now cover camera lifecycle, permission recovery, saved-setup readiness, absence of the extra button, and automatic navigation; lint and strict typecheck pass.
- Full `npm run verify` passed 6 core tests, 79 Vitest tests, eight responsive Playwright checks, lint, strict typecheck, and the production build.

### 2026-07-18 — Mission presentation acceptance and startup-loss fix

- Added system-Chrome mission presentation coverage at 1440x900 and 390x844 under reduced motion, including 16:9 sizing, no overflow, voice/status controls, and under-25-ms average cadence across 120 Phaser frames.
- Pixel inspection accepted the refreshed Volcano Escape world at both viewports and exposed a camera/controller effect-order race.
- Buffered early device-loss signals until the mission controller is initialized, so missing or failed tracking now pauses the authoritative mission and offers Resume/retry instead of leaving gameplay active.
- `npm run verify` passed ESLint, strict TypeScript, 11 regression tests, 74 Vitest tests, eight system-Chrome Playwright checks, and the production build.
- At that point, `mvp-hardening` remained active only for the canonical physical camera-loss/retry observation tracked by TD-005; the scope was later accepted and deferred for the guest-only demo boundary.

### 2026-07-17 — Product documentation and harness reset

- Audited the old harness, all supplied new-direction docs, and the advanced harness template.
- Ran `bash init.sh`; dependency installation and production build passed. `./init.sh` failed with permission denied.
- Ran the structural harness validator before changes; score was 100/100.
- Consolidated overlapping PRD, architecture v1/v2, AI coach, engineering, UI, contracts, database, test, and task documents into canonical routed docs.
- Removed nested/duplicate instructions, obsolete old-MVP summary/UI/evaluator docs, and the source handoff folder after merging durable content.
- Replaced the completed old feature tracker with a dependency-ordered transformation roadmap and kept exactly one feature active.
- Preserved all runtime source and tests for incremental reuse.
- Restored the executable bit on `init.sh`, added tests to both bootstrap entrypoints, and passed 11/11 tests plus the production build.
- Post-refactor verification: harness validator 100/100, 85 Markdown files with valid local links, JSON parsing passed, and `git diff --check` passed.

Prior completed-MVP implementation history remains available in version control; it is no longer active product state.

### 2026-07-17 — Typed Next.js product foundation

- Replaced the Vite runtime with Next.js 15.5.20, React 19.2.7, and TypeScript 5.9.3 in strict mode.
- Added ESLint 9, target scripts, typed App Router layout and product shell, and a responsive foundation presentation.
- Preserved the verified game composition at the former compatibility route; prototype domain modules and 11 regression tests remain intact.
- Updated both bootstrap entrypoints to run `npm run verify`.
- Verification passed: lint with zero warnings, strict typecheck, 11/11 tests, production build, and production HTTP content checks for `/` and the former compatibility route.
- Browser control was unavailable, so visual evidence is tracked as TD-004 and remains required for later UI feature completion.
- `code-reviewer` accepted `product-foundation` with 12/12 and no required fixes.
- Marked `product-foundation` passing and selected `domain-contracts` as the sole active feature.

### 2026-07-17 — Executable domain contracts

- Added Zod 4 and Vitest 4.1.10 without introducing high or critical dependency findings.
- Implemented strict versioned schemas and inferred types for workouts, blueprints, movement events, session metrics, recommendations, and coach summaries.
- Centralized the MVP `jump` and `squat` movement registry and compatible challenge templates.
- Added deterministic workout/adventure fallbacks plus retryable path-specific validation errors.
- Added cross-contract validation for workout identity, exercise references, one-to-one mapping, targets, templates, and ordering.
- Verification passed: lint, strict typecheck, 11 regression tests, 14 contract tests, and production build.
- `code-reviewer` accepted the feature 12/12; `planning-experience` is now active.

### 2026-07-17 — Planning experience implementation (verification pending)

- Added a semantic responsive workout form for goal, duration, and fitness level plus loading, error, retry, privacy, and adventure briefing states.
- Added a deterministic server-only planner adapter, validated level compiler, timeout/rejection/invalid-output fallbacks, and `POST /api/workout/generate` request validation.
- Verification passed for service and API behavior: 19 TypeScript tests, 11 regression tests, personalized HTTP response, malformed-input HTTP 400, lint, strict typecheck, and production build.
- Browser discovery returned no connected browser, so required desktop/narrow visual observation is still pending. Keep `planning-experience` in progress and do not start `pose-migration`.
- Added three happy-dom interaction tests covering keyboard focus/radio operation, selected preference submission, generated briefing, announced failure, retry, and preference preservation; the full gate now passes 33 tests.
- Browser discovery returned an empty backend list for a third consecutive goal turn. Automation is blocked at the visual gate until an in-app Browser or Chrome connection is available.
- Chrome later became available. Desktop 1440x1000 and narrow 390x844 checks confirmed readable, stacked layouts without horizontal overflow; generated mission values, focus order, and zero console errors were observed.
- `code-reviewer` accepted `planning-experience` 12/12 with no fixes; `pose-migration` is now active.

### 2026-07-18 — Canonical architecture and onboarding resync

- Reconciled the supplied `docs/AI_Fitness_Escape_Codex_Docs` design packet into the routed canonical product, architecture, frontend, data, security, reliability, and active-plan documents.
- Removed the duplicate nested AGENTS file, PRD, architecture/system-design versions, UI plan, database/contracts, engineering blueprint, task list, and test plan after merging durable requirements.
- Defined the new journey as welcome/auth → fitness profile → one-time touch-free movement setup → planning/mission, while preserving guest access.
- Recorded the pose boundary: pretrained MediaPipe landmarks plus a deterministic personalized classifier; persist versioned derived thresholds only, never recordings or raw landmarks.
- Reordered the feature roadmap so `identity-profile-onboarding` is the sole active feature and `pose-migration` depends on it; existing typed pose work remains reusable.
- Pre-change `./init.sh` passed lint, strict typecheck, 11 regression tests, 33 Vitest tests, and the production build.

### 2026-07-18 — Guest identity and fitness-profile onboarding

- Added the welcome entry at `/`, moved the verified planner to `/plan`, and kept account actions honest when Supabase is not configured.
- Added a versioned Zod profile contract and browser-local repository with stable guest identity, corrupt-data rejection, profile edit/reload behavior, and an account-service adapter boundary.
- Added accessible height, weight, activity frequency, goal, fitness level, and optional movement-limitations fields with validation and local privacy guidance.
- Five new tests cover repository validation/persistence, unavailable accounts, profile validation/save/reload/edit, and planning navigation; 38 Vitest tests pass.
- Chrome verified desktop 1440x661 and narrow 390x844 layouts, honest account fallback, validation, local reload continuity, `/plan` handoff, no horizontal overflow, and zero console errors.
- `./init.sh` passed lint, strict typecheck, 11 regression tests, 38 Vitest tests, and production build; harness validation scored 100/100 and `git diff --check` passed.
- `code-reviewer` accepted `identity-profile-onboarding` 12/12; `pose-migration` is now active.

### 2026-07-18 — Automatic pose platform implementation (verification pending)

- Replaced manual lock-framing and capture controls with a pure hands-free coordinator for stable framing, spoken/visible countdowns, timed jump/squat sampling, automatic weak-sample retry, and completion.
- Moved calibration persistence to a versioned local profile with pose-model compatibility metadata; compatible thresholds skip repeat setup.
- Added coordinator coverage for no-touch completion, low-visibility framing rejection, weak-jump retry, and derived thresholds; 40 Vitest tests pass with lint and strict typecheck.
- Live Chrome verification confirmed automatic Step into view UI, no manual capture controls, local-processing guidance, camera tracking, and approximately 20 ms average inference.
- Final live jump/squat completion remains pending because the connected camera needs a person standing fully in frame and performing the prompted movements.
- User explicitly deferred the physical movement check for now. It is tracked as TD-005 and remains mandatory in `mvp-hardening`; pose feature acceptance may use deterministic landmark completion plus live camera/UI/latency evidence.
- `./init.sh` passed 51 total tests and production build; harness validation scored 100/100 and `git diff --check` passed.
- `code-reviewer` accepted `pose-migration` 12/12 with TD-005 preserved; `lower-body-movements` is now active.

### 2026-07-18 — Lunge and high-knees movement support

- Expanded contracts/registry with lunge and high knees plus compatible challenge templates.
- Added personalized threshold derivation from clear lunge/high-knee samples and rejection for weak/incomplete samples.
- Added stable lunge start/completion/rearm and alternating high-knee event semantics with side arbitration and duplicate suppression.
- `./init.sh` passed lint, strict typecheck, 11 regression tests, 44 Vitest tests, and production build; harness scored 100/100 and `git diff --check` passed.
- `code-reviewer` accepted `lower-body-movements` 12/12; physical evidence remains TD-005 and `standing-upper-cardio-movements` is active.

### 2026-07-18 — Standing upper/cardio movement support

- Registered jumping jack, directional punches, and directional side reaches with compatible challenge templates.
- Added personalized thresholds plus deterministic full-cycle, direction, hold/release, and neutral-rearm state machines.
- `./init.sh` passed lint, strict typecheck, 11 regression tests, 48 Vitest tests, and production build; `git diff --check` passed.
- `code-reviewer` accepted the feature 12/12 with physical evidence retained in TD-005; `floor-movements` is active.

### 2026-07-18 — Push-up and plank floor movement support

- Registered push-up/plank with compatible templates and added an independent side-view readiness gate.
- Added personalized floor thresholds, push-up depth/full-extension rearm, and timed plank start/held/released semantics.
- `./init.sh` passed lint, strict typecheck, 11 regression tests, 52 Vitest tests, and production build; harness scored 100/100 and `git diff --check` passed.
- `code-reviewer` accepted `floor-movements` 12/12 with physical evidence retained in TD-005; all detector prerequisites pass and `phaser-mission` is active.
- Post-update feature-graph validation passed for 12 dependency-ordered features with `identity-profile-onboarding` as the sole active slice; harness validation remained 100/100.
- Post-update `./init.sh` and `git diff --check` passed: lint, strict typecheck, 11 regression tests, 33 Vitest tests, and the production build.

### 2026-07-18 — Hackathon MVP documentation boundary

- Audited canonical docs for missing hackathon constraints and separated verified current behavior from the target judged vertical slice.
- Defined mandatory demo behavior, allowed reference-device/provider constraints, and explicitly deferred production-scale/social/administrative scope.
- Made guest-local profile, calibration, planning fallback, and latest-session continuity the no-credential demo path; real Supabase and AI claims still require real adapter evidence.
- Added hackathon runtime, persistence, frontend presentation, security, and release-gate policies without relaxing camera privacy, validation, cleanup, deterministic metrics, or RLS requirements.
- Added the canonical `docs/API.md` reference for the passing workout-generation endpoint and routed it from `AGENTS.md`.
- Post-sync verification passed: 13 Markdown files had valid local links, feature JSON parsed, harness validation scored 100/100, `git diff --check` passed, and `./init.sh` passed lint, strict typecheck, 44 tests, and production build.

### 2026-07-18 — Feature-list guest and hackathon audit

- Confirmed the tracker has one active feature, unique IDs/priorities, an acyclic dependency graph, and dependency-ready active work.
- Kept guest mode as the complete no-credential path and clarified that the active onboarding feature owns account entry/error states plus local profile behavior, not fabricated remote sign-in success.
- Moved guest-first hackathon hardening before optional Supabase history/leaderboard breadth so MVP completion does not depend on external credentials.
- Preserved real sign-up/sign-in, guest conversion, cross-device sync, RLS, history, and leaderboard as a later evidence-gated feature.
- Post-audit verification passed: 12-feature DAG and active dependency checks, harness 100/100, `git diff --check`, lint, strict typecheck, 44 tests, and production build.
- Post-sync feature-graph validation passed with exactly one dependency-ready active feature; harness validation scored 100/100 and `git diff --check` passed.
- Post-sync `./init.sh` passed lint, strict typecheck, 11 regression tests, 33 Vitest tests, and the production build for `/`, `/prepare`, the former compatibility route, and `/api/workout/generate`.

### 2026-07-18 — Full movement-library architecture

- Confirmed the target movement families: squat, jump, lunge, jumping jack, high knees, push-up, plank, left/right punch, and left/right side reach.
- Defined eleven explicit movement IDs, using directional IDs where side changes counting, gameplay, or metrics.
- Documented four detector families: vertical lower body, symmetric full body, floor side-view, and directional upper body.
- Kept pretrained MediaPipe landmark inference as the base and allowed an offline-trained temporal landmark classifier only if deterministic fixture evidence proves it necessary; onboarding never trains a model.
- Split pose delivery into automatic squat/jump platform migration, lunge/high-knees, standing upper/cardio, and floor-movement features before Phaser integration.
- Pre-change `./init.sh` passed lint, strict typecheck, 11 regression tests, 33 Vitest tests, and the production build.

### 2026-07-18 — Phaser mission and grounded coaching

- Added Phaser 3.90 blueprint execution, a validated movement-event bridge, all-movement objective rules, miss recovery, pause/replay, coarse React HUD snapshots, and lifecycle cleanup.
- Chrome verified one canvas, working pause/resume, and 16.38 ms average scene cadence over 120 frames; gameplay review passed 12/12.
- Added deterministic metrics, XP, best/focus movement, bounded recommendations, and a provider adapter that cannot overwrite factual or recommendation copy.
- Added versioned latest-result storage and responsive `/results` states with explicit fallback labeling.
- `./init.sh` passed lint, strict typecheck, 11 regression tests, 62 Vitest tests, and production builds; the added provider-injection regression makes 63 Vitest tests current. Harness validation scored 100/100 and `git diff --check` passed.
- Coaching review passed 12/12; `mvp-hardening` is active and TD-005 still requires a real-body golden journey.

### 2026-07-18 — Live mission pose runtime and physical vertical journey

- Reopened Phaser after the first TD-005 audit proved `/mission` had no camera/detector producer despite its validated event consumer.
- Added independent mission webcam/MediaPipe lifecycle and objective-aware routing across vertical, standing-upper, and floor detector families for all eleven movement IDs.
- Added live movement cues, full-body/side-view correction, device-loss pause/retry, target reset, local latency, and cleanup.
- Physical Chrome evidence passed saved calibration reuse, 8 controlled squats, automatic transition, 6 jumps, 14-movement combo, 265 XP, 100% mission completion, factual 14/14 results, and 16.5 ms average inference.
- `./init.sh` passed lint, strict typecheck, 11 regression tests, 65 Vitest tests, and production build; harness scored 100/100 and `git diff --check` passed.
- Phaser review passed 12/12 and `mvp-hardening` is active; TD-005 retains physical lunge/high-knees, jack, directional punch/reach, push-up/plank, and device-loss evidence.

### 2026-07-18 — Physical full movement check

- Added a visible validated movement-check action that creates one objective for each of the eleven registered movement IDs without hidden test state.
- The user physically completed jump, squat, lunge, high knees, jumping jack, both punches, both side reaches, push-up, and plank in one uninterrupted x11 mission.
- Chrome recorded 100% progress, 210 XP, 16.9 ms average inference, zero console errors, and factual 11/11 results with 100% accuracy; results navigation removed the camera surface.
- The full gate initially caught planner navigation/copy regressions; restored the prototype link and established pluralized briefing labels before closure.
- Final `./init.sh` passed lint, strict typecheck, 11 regression tests, 66 Vitest tests, and production build; harness scored 100/100 and `git diff --check` passed.
- TD-005 movement coverage is complete; only live device-loss pause/retry evidence remains before the debt item can resolve.

### 2026-07-18 — Distance-readable mission tracking and voice

- Added a shared mirrored landmark overlay to preparation and live gameplay so players can see the on-device skeleton used by tracking.
- Added fact-grounded browser speech for objectives, progress, framing corrections, pauses, and completion, with an accessible voice on/off control and speech cancellation on mute/exit.
- Chrome verified one pose overlay canvas, one Phaser canvas, voice toggle state, no 1440px horizontal overflow, zero console errors, and pose-surface cleanup after navigation.
- Added deterministic coverage for camera-track loss, in-place retry, denied permission, and webcam/pose-engine disposal.
- `./init.sh` passed lint, strict typecheck, 11 regression tests, 69 Vitest tests, and production build; `mvp-hardening` remains active for narrow/reduced-motion/keyboard/degraded-path/repeat-journey evidence and game visual polish.

### 2026-07-18 — Snapshot-driven Volcano Escape presentation

- Replaced the static Phaser placeholder with a layered volcano, lava path, runner, in-world objective/status, progress bar, pause veil, and escaped state.
- Scene state now derives from the authoritative mission snapshot; runner position and progress are clamped and deterministic rather than independent game facts.
- Added a 16:9 responsive canvas contract plus CSS and Phaser reduced-motion paths.
- Focused scene/controller tests, lint, and strict typecheck passed; final `./init.sh` passed 11 regression tests, 71 Vitest tests, and production build.
- Visual browser acceptance remains pending because the connected browser runtime references an expired plugin installation and currently discovers no browser.

### 2026-07-18 — Playwright hardening gate

- Added Playwright with system-Chrome desktop and narrow projects and made it part of `npm run verify`.
- Six checks pass across 1440×900 and 390×844: keyboard guest entry, honest unavailable-account recovery, local/privacy explanations, no horizontal overflow, planner failure/retry with preference preservation, and reduced-motion enforcement.
- The first run correctly exposed an ambiguous Next.js alert locator and an incorrect expected fallback title; both assertions were tightened to observable application contracts before the green run.

### 2026-07-18 — Guest persistence degradation

- Profile, generated-mission, movement-check, and calibration writes now catch browser storage failures and keep the current interaction recoverable with actionable privacy/storage guidance.
- Completed results fall back to page-lifetime memory and explicitly warn that they are temporary instead of losing deterministic metrics.
- Added profile, planner, and results failure tests; the first focused run exposed missing profile-status rendering, which was fixed before lint/typecheck and all 11 focused tests passed.
- Final standard verification passed ESLint, strict TypeScript, 11 regression tests, 74 Vitest tests, six Playwright system-Chrome checks, and the production build.
