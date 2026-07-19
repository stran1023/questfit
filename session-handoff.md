# Session Handoff

## Verified Now

- Next.js 15 is the only product runtime; routes cover guest onboarding, planning, preparation, Phaser mission, results, and the planning API.
- `npm run verify` passes ESLint, strict TypeScript, 6 core pose/calibration tests, 86 Vitest tests, ten responsive Playwright checks, and the production build.
- The obsolete compatibility game route and runner implementation are removed; reusable calibration and pose foundations are integrated behind current typed feature adapters.
- The pre-refactor harness validator scored 100/100.
- Documentation now has one canonical source for product, architecture, frontend, data, reliability, security, quality, and planning concerns.
- The post-refactor harness validator scored 100/100; 85 Markdown files passed local-link validation; JSON parsing and `git diff --check` passed.

## Changed This Session

- Reframed the repository around the AI-generated workout-to-adventure product.
- Added the advanced-harness routing model, active execution plan, quality score, security and reliability guidance, and technical-debt tracker.
- Replaced the old completed feature list with eight dependency-ordered migration features; `product-foundation` is the only active feature.
- Removed duplicate new-direction source docs and obsolete prototype product/evaluator docs after consolidation.
- Migrated the build/runtime configuration from Vite to Next.js 15, React 19, and TypeScript 5.9.
- Added the typed App Router shell and the former compatibility route compatibility composition without changing the tested domain modules.
- Added ESLint, typecheck, start, and full verification scripts; both bootstrap entrypoints run the full gate.
- `product-foundation` is passing; `domain-contracts` is the sole active feature.
- `evaluator-rubric.md` records a 12/12 Accept verdict with no required foundation fixes.
- Added versioned Zod contracts, inferred types, deterministic fallbacks, and 14 passing contract tests.
- `code-reviewer` accepted `domain-contracts` 12/12; `planning-experience` is the sole active feature.
- Chrome verified the planning flow at desktop and 390px narrow viewports with no overflow or console errors; `code-reviewer` accepted it 12/12.
- `pose-migration` is now the sole active feature.
- Reconciled and removed the duplicate `docs/AI_Fitness_Escape_Codex_Docs` packet after merging its durable direction into canonical routed docs.
- Updated the canonical journey to welcome/auth, fitness-profile onboarding, one-time automatic movement setup, planning, and mission execution.
- Added the privacy-preserving calibration boundary: pretrained MediaPipe inference plus derived thresholds; no user-specific model training or camera/landmark persistence.
- Added `identity-profile-onboarding` as the sole dependency-ready active feature; `pose-migration` now follows it without discarding existing pose adapters/tests.
- Post-sync verification passed: feature graph, harness validator 100/100, `git diff --check`, lint, strict typecheck, 44 tests, and production build.
- Expanded the canonical MVP to eleven movement IDs covering squat, jump, lunge, jumping jack, high knees, push-up, plank, directional punches, and directional side reaches.
- Split pose implementation into detector-family features; Phaser now depends on all movement slices rather than only the prototype squat/jump migration.
- The revised 12-feature dependency graph, harness validation 100/100, `git diff --check`, lint, typecheck, 44 tests, and production build all pass.
- Defined the target explicitly as a hackathon MVP vertical slice: one Chromium reference setup and one polished theme, with guest/local and deterministic fallbacks when external providers are unavailable.
- Added canonical API documentation and hackathon release gates; production-scale analytics, administration, social features, deep history, and leaderboard breadth may not displace the judged journey.
- Hackathon docs verification passed: local Markdown links, feature JSON, harness 100/100, whitespace check, lint, strict typecheck, 44 tests, and production build.
- Audited and corrected the feature graph: guest-first hackathon hardening now precedes optional Supabase/leaderboard breadth, and onboarding no longer claims successful remote auth before its adapter is implemented.
- Feature-list audit verification passed: valid 12-feature DAG with one dependency-ready active slice, harness 100/100, whitespace check, lint, typecheck, 44 tests, and production build.
- Implemented and browser-verified guest welcome/profile onboarding with local persistence, honest unavailable-account behavior, responsive layouts, and `/plan` handoff.
- `identity-profile-onboarding` passed review 12/12; `pose-migration` is now the sole active feature.
- Implemented the touch-free calibration coordinator and versioned local threshold reuse; focused lint/typecheck and 40 Vitest tests pass.
- Chrome is left on `/prepare` with live tracking at about 20 ms and no manual controls. Final pose evidence needs the user to stand fully in frame and follow the automatic jump/squat cues.
- User deferred the physical camera movement; TD-005 carries it to hardening. Automated/live revised gates passed and code-reviewer accepted pose-migration 12/12.
- `lower-body-movements` is now the sole active feature.
- Implemented and reviewed personalized lunge/high-knees detection; 55 total tests and full gate pass, with physical evidence retained in TD-005.
- `standing-upper-cardio-movements` is now the sole active feature.
- Implemented and accepted jumping-jack, directional punch, and directional side-reach support 12/12; 59 total tests and full gate pass.
- `floor-movements` is now the sole active feature.
- Implemented and accepted side-view push-up/plank support 12/12; all movement detector prerequisites now pass with TD-005 retained.
- `phaser-mission` is now the sole active feature.
- Implemented and reviewed the Phaser mission 12/12: all movement mappings, validated event bridge, pause/recovery/replay/cleanup, one canvas, and 16.38 ms browser cadence.
- Implemented deterministic session analysis, bounded recommendations, fact-preserving coach fallback/provider behavior, and `/results`; coaching review passed 12/12.
- TD-005 passed automatic full-body framing, jump capture, weak-squat retry, deeper-squat completion, saved thresholds, and 16.6 ms inference. It exposed that `/mission` has no camera/detector producer, so `phaser-mission` is reopened and hardening is no longer active.
- Implemented the missing live mission camera/detector producer for all three detector families and all eleven movement IDs.
- Physical TD-005 now passes saved reuse plus an 8-squat/6-jump mission through 14/14 factual results at 16.5 ms average inference; Phaser is passing again and `mvp-hardening` is active.
- Added and physically completed a visible all-eleven movement-check mission: x11 combo, 210 XP, 100%, factual 11/11 results, 16.9 ms inference, zero console errors, and camera cleanup on results navigation.
- TD-005 now retains only live device-loss pause/retry evidence; all registered movement directions and the standing-to-floor transition have physical evidence.
- Added the mirrored live landmark overlay and fact-grounded voice assistant with an accessible mute toggle; Chrome verified both canvases, toggle state, no desktop overflow/errors, and route cleanup.
- Mission camera tests now cover track-ended pause/retry, denied permission recovery, and resource disposal; the full gate passes 80 tests and production build.
- Replaced the placeholder Phaser world with snapshot-driven Volcano Escape visuals, in-canvas mission state/progress, responsive 16:9 sizing, pause veil, and reduced-motion handling; the full gate now passes 82 tests.
- Added a required Playwright gate to `npm run verify`; six desktop/narrow system-Chrome checks pass for keyboard, privacy, honest account fallback, provider recovery, responsiveness, and reduced motion.
- Added actionable browser-storage failure handling across guest profile, mission/check preparation, calibration, and results; deterministic results retain page-lifetime memory with a visible temporary warning.
- Visually accepted the refreshed Volcano Escape scene at 1440x900 and 390x844 under reduced motion; 16:9 sizing, no overflow, distance-readable controls/status, and under-25-ms 120-frame cadence pass.
- Fixed early camera-failure delivery so a missing setup or failed tracking startup pauses the authoritative mission before presenting in-place recovery.
- The hackathon demo boundary is now guest-only; Supabase breadth and the physical camera-loss walkthrough are deferred while automated recovery remains preserved.
- `mvp-hardening` and `game-polish` passed review 12/12; `demo-liftoff` is the sole active feature.
- Added distinct Phaser encounters for all eleven movement IDs, snapshot-derived XP/combo/miss feedback, procedural action sound with its own control, and an exclusive escape-portal completion payoff.
- Desktop and narrow Chrome drove every encounter kind through validated movement events, visually accepted active/completed frames, preserved no-overflow/16:9 layout, and retained the under-25-ms reduced-motion cadence target.
- Current full gate: ESLint, strict TypeScript, 6 core pose/calibration tests, 83 Vitest tests, ten Playwright system-Chrome checks, and production build all pass.
- Generated and fallback workouts now use the same six-movement standing demo sequence—jumping jack, squat, left/right punch, high knees, jump—with duration/level target scaling and canonical encounter mappings; focused planner/contracts tests and typecheck pass.
- Consolidated the application into one product: removed the compatibility route, old React/canvas runner, runner state and unused CSS; renamed retained foundation verification to `test:core` and passed the full gate.
- Converted `/prepare` into a hands-free launch state: saved calibration still validates stable live framing, first-time setup retains automatic calibration, and both paths use a spoken/visible three-second countdown followed by automatic `/mission` navigation.
- Polished the launch countdown into a distance-readable camera overlay with individual number transitions, energy rings, progress marks, a gold `GO!` state, and reduced-motion fallback; navigation occurs after the payoff remains visible for 650 ms.
- Implemented and accepted goal-aware planning 12/12: four distinct curated goals, duration-based 5/6/7 stages, profile-derived activity/limitations, bounded targets/rest, safety exclusions, goal-specific replacements, profile-aware fallbacks, and validated phased rationale. `demo-liftoff` is active again.
- User review removed punches from standard lower-body strength plans; every duration now uses jumping-jack warm-up, repeated squat/lunge work, and a jump finale, protected by exact-sequence tests.
- Committed the countdown/planner baseline as `c1fb4f6`, then expanded the recommended demo sequence into dependency-ordered, session-sized feature records.
- Completed canonical encounter coherence and repeated-set stage progression across planner, React HUD, assistant voice, and Phaser.
- Completed the presenter preflight card without adding a launch decision or bypass; existing readiness remains authoritative.
- Completed target-aware lower-noise voice cues and current/target HUD progress for hands-free play.
- Completed the factual results finale with completion visualization, canonical strongest-movement naming, grounded recommendation, replay, and new-plan actions.
- Fixed in-flight MediaPipe initialization cancellation so navigating to results cannot leak a late-created landmarker; the browser mission test now uses deterministic synthetic camera denial and verifies cleanup at desktop and narrow widths.

## Broken or Unverified

- Supabase is explicitly post-hackathon; the judged path is guest-local and no remote identity/persistence claim is made.
- npm audit reports two moderate vulnerabilities.
- A physical device unplug/revoke-and-retry observation is deferred in TD-005; deterministic track-ended, denied-permission, progress-preservation, and cleanup coverage passes.
- Phaser Game Agent is authenticated as `sonchan`, but the account reports no access/credits, so no cloud project or spend was started.
- The in-app browser plugin still references an expired cached documentation path; system-Chrome Playwright screenshots were inspected directly for presentation evidence.

## Next Session

- Active feature: `demo-liftoff`.
- Next step: use `docs/DEMO_RUNBOOK.md` to run the complete real-camera guest path twice from clean Chrome profiles, record the observed results, then commit and push the release candidate.
- Preserve deterministic fallbacks and do not claim live AI, remote auth, or physical movement evidence without observation.

## Commands

- Bash bootstrap: `./init.sh`
- PowerShell bootstrap: `./init.ps1`
- Tests: `npm test`
- Build: `npm run build`
- Full gate: `npm run verify`
- Harness audit: `node .agents/skills/harness-creator/scripts/validate-harness.mjs --target .`
