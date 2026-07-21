# Session Handoff

## 2026-07-21 — Open-source governance ready

- README now links to a root MIT License, contribution guide, code of conduct, contributor list, and structured issue forms; the previous governance TODOs are removed.
- Bug, feature, and pull-request templates protect webcam/health data and require observable verification and architecture-aware changes.
- The initial maintained contributor list reflects repository history: `stran1023` is the creator and maintainer.
- Governance links and issue-form YAML validate, whitespace checks pass, and post-change `./init.sh` passed 6 core tests, 94 Vitest tests, 10 Playwright checks, and production build.

## 2026-07-21 — AI collaboration narrative added

- README now contains a dedicated AI Development Workflow describing the distinct roles of GPT-5.6, Codex, and the development team.
- Concrete examples cover ideation, UX/story refinement, migration, contracts, implementation, refactoring, race-condition debugging, test creation, responsive verification, and documentation.
- An eight-decision comparison table explains chosen alternatives; human responsibility for architecture, privacy, safety, validation, evidence, and release approval is explicit.
- README links, feature JSON, and whitespace checks pass; post-edit `./init.sh` passed 6 core tests, 94 Vitest tests, 10 Playwright checks, and production build.

## 2026-07-21 — Public README synchronized

- Replaced the short project summary with a complete, public-facing QuestFit README grounded in current source, scripts, canonical docs, and the renamed GitHub remote.
- It now documents the guest journey, 11-movement scope, privacy and deterministic authority boundaries, installation and verification commands, optional visual-evidence flag, architecture, roadmap, and known limitations.
- Missing hosted demo/screenshots, license, and contribution governance remain explicit TODOs. `docs-gap.md` reports no undocumented passing features.
- README local links, feature JSON, and whitespace checks pass. Post-edit `./init.sh` passed 6 core tests, 94 Vitest tests, 10 Playwright checks, and production build; `demo-liftoff` remains active and still requires two physical rehearsals.

## 2026-07-21 — QuestFit branding complete

- `questfit-brand-rollout` is passing 12/12; `demo-liftoff` is the sole active feature.
- The canonical visible identity is **QuestFit — Your body. Your adventure.** Browser metadata, welcome, planning/loading/briefing navigation, README, product docs, and demo narration are synchronized.
- **Volcano Escape** remains the current mission name. Stable `ai-fitness-escape:*` storage keys and DOM event channels intentionally remain compatibility identifiers so existing guest state survives the rename.
- Browser inspection confirmed the QuestFit title, entry brand/tagline, Volcano Escape preview, and planner link. Full verification passes 6 core tests, 94 Vitest tests, 10 Playwright checks, and production build.
- Next action: rehearse the full QuestFit real-camera path twice from clean profiles and record the existing runbook evidence.

## 2026-07-21 — Adventure immersion pass complete

- `adventure-immersion-pass` is passing 12/12; `demo-liftoff` is the sole active feature.
- Why this plan is now a visible validated four-chip/four-card scan. The adventure map flows left-to-right through a prominent Ash Titan to the rightmost Storm Gate without desktop/narrow overflow.
- Phaser shows Ash Titan as a distant environmental threat before battle and positions the Storm Gate encounter at x=824; both remain snapshot-derived presentation.
- Procedural music attempts entry autoplay with an 800 ms fade. Browser/device blocking produces Play music; disable/exit fades for 320 ms and retains cleanup. Silent-mode behavior still requires physical rehearsal.
- `src/app/icon.png` is the new project-owned mountain-route/portal icon and remains legible at 64px. Full verification passes 6 core tests, 94 Vitest tests, 10 Playwright checks, and production build.
- Next action: run two clean-profile real-camera rehearsals and record autoplay/silent-mode behavior plus standing-distance boss/map readability.

## 2026-07-21 — Scout adventure theme complete

- `trail-guide-adventure-theme` is passing 12/12; `demo-liftoff` is the sole active feature.
- Scout is the recurring presentation-only AI trail guide across welcome/profile, planner, AI to Action, briefing, preparation, mission/cooldown, and results. Curated dialogue cannot modify plans, safety, pose input, scoring, or recommendations.
- Project-owned source/transparent four-pose sheets live in `public/game/`; provenance and prompt intent are documented in `public/game/README.md`.
- The full gate passes 6 core tests, 94 Vitest tests, 10 desktop/narrow Playwright checks, and production build. Browser inspection confirmed the character sheet renders correctly on returning welcome and planner screens.
- Next action: run two clean-profile real-camera rehearsals and include Scout readability/non-interference from the standing mark in the recorded evidence.

## 2026-07-21 — Scannable briefing complete

- `scannable-adventure-briefing` is passing; `demo-liftoff` is active again.
- The briefing's default view is intentionally short: hero, five stats, four checkpoints, movement chips, and one Start Adventure CTA. Pipeline, instructions, rationale, fallback notice, and safety detail are under Mission details.
- Project-owned `volcanic-guardian.png` now illustrates the briefing hero; distance/weather remain omitted because the validated indoor-mission contracts do not own them.
- Full verification passes 6 core tests, 93 Vitest tests, 10 desktop/narrow Playwright checks, and production build.
- Next action: run two clean-profile real-camera rehearsals and include a ten-second briefing comprehension/readability observation.

## 2026-07-21 — Planning journey redesign complete

- `guided-planning-journey` is passing; `demo-liftoff` is active again.
- The judged flow is now `/plan` → `/ai-to-action` → `/briefing` → `/prepare`. Request/result handoff is schema-validated in `src/features/workout-planner/planningJourney.ts` and remains browser-session local.
- AI to Action performs the actual generation call and automatically advances after its five-stage animation. Failure stays on that route with Retry planning and Edit choices.
- The full gate passes 6 core tests, 92 Vitest tests, 10 desktop/narrow Playwright checks, and production builds for all routes.
- Next action: run two clean-profile real-camera rehearsals and observe loading duration, briefing scanability, standing-distance preparation, pose recognition, audio balance, cooldown, and recovery.

## 2026-07-20 Redesign handoff

- Active feature: `demo-liftoff`.
- `sport-ui-pipeline` is passing with responsive Chrome evidence and the standard automated gates.
- User-approved direction: modern sport UI outside missions, cinematic fantasy in Phaser, direct verified attack/dodge boss combat, and guided unscored cooldown.
- `phased-workout-arc` passed 12/12 with warm-up/build/surge/peak load scaling and validated non-scored cooldown.
- `boss-story-gameplay` passed 12/12 with a locally generated Ash Titan, direct strike/dodge/block reactions, authoritative health projection, and responsive browser evidence.
- Automated `demo-liftoff` packaging and visual capture pass at desktop/narrow sizes; the runbook reflects the redesigned flow.
- Next action: complete two real-camera clean-profile rehearsals and record physical recognition, standing-distance boss readability, voice/music balance, cooldown clarity, browser/version, and latency. This evidence cannot be synthesized by browser events.

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
- Successful missions now persist authoritative facts and automatically replace `/mission` with `/results` after a 2.6-second completion celebration; no results click is required.
- Completed `cinematic-mission`: snapshot-derived hero actions for all eleven movements, current-hazard recoil, approaching next hazards, ember/lava atmosphere, escalating tension, and eruption-to-portal finale. Full gate and 12/12 review pass; `demo-liftoff` is active again for two physical rehearsals.
- Completed `adaptive-mission-music`: opt-in procedural soundtrack/effects, calm/rising/escape progress tiers, voice-safe gain, pause/resume, late-start cancellation, and route cleanup. Full gate and 12/12 review pass; real-camera rehearsal should explicitly judge music/voice balance.

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
