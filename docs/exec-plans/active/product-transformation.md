# Product Transformation Plan

## Objective

Transform the verified Vite endless-runner prototype into the hackathon MVP vertical slice defined in `docs/PRODUCT.md`, preserving reusable pose, calibration, state, UI, rendering, and test behavior whenever it satisfies the target boundaries.

## Scope

The migration covers the Next.js/TypeScript foundation, executable contracts, welcome/auth and fitness-profile onboarding, AI workout planning, automatic one-time pose calibration, level compilation, Phaser gameplay, deterministic analysis/coaching, Supabase auth/progress, and full golden-journey verification.

It does not include roadmap-only social, multiplayer, seasonal, wearable, medical, unlimited-content, production analytics, multi-region operations, or administration features. Deep history and weekly leaderboard work follows the stable judged journey and may be deferred if it threatens the vertical slice.

## Sequence

1. Consolidate the new product docs and reset the harness to the migration state.
2. Establish the typed Next.js test/build foundation without losing the working baseline before replacement coverage exists.
3. Implement Zod contracts and deterministic workout/blueprint fixtures.
4. Build the application shell, design system, workout generator, and briefing.
5. Build welcome/auth entry and validated fitness-profile onboarding, with a local guest repository and a replaceable account adapter boundary.
6. Establish the automatic calibration platform and registry while migrating verified squat/jump behavior.
7. Add lower-body lunge and high-knees detectors and calibration.
8. Add jumping-jack, directional punch, and directional side-reach detectors and calibration.
9. Add side-view push-up and plank detectors, floor setup, and hold semantics.
10. Build blueprint-driven Phaser gameplay and mission completion for every registered movement.
11. Implement deterministic metrics/recommendations and grounded coaching.
12. Harden the guest-first hackathon journey with degraded paths, performance, accessibility, privacy, cleanup, and repeatable demo evidence.
13. Polish the Phaser mission with movement-specific encounters, immediate action feedback, combo/reward energy, sound, transitions, and a memorable completion payoff.
14. Unify encounter vocabulary and repeated-set progression across planning, voice, React, and Phaser.
15. Add truthful presenter preflight without adding a second launch action.
16. Tune hands-free cue density, target announcements, and distance-readable set progress.
17. Polish the factual results finale and replay/new-plan actions.
18. Add a cinematic body-controlled mission pass with movement-matched hero actions, reactive hazards, environmental motion, escalation, and portal finale.
19. Add an opt-in procedural soundtrack that escalates with mission progress and cleans up safely.
20. Refresh the non-mission journey with a compact sport-first interface and a truthful visual AI-to-game pipeline.
21. Restructure every plan into warm-up, build, peak, and a guided non-scored cooldown.
22. Add a cinematic monster confrontation where validated movement events directly attack or dodge and Phaser remains presentation-only.
23. Split generation into Plan → AI to Action → Adventure Briefing with validated route handoff, animated progress, failure recovery, and a premium responsive briefing.
24. Compress the Adventure Briefing into a ten-second visual scan with optional detail and one primary mission action.
25. Add a recurring project-owned Trail Guide, curated motivational moments, outdoor route motifs, and reduced-motion-safe micro-interactions across the judged journey.
26. Redesign plan rationale, expose Ash Titan and the right-side Storm Gate on the route, add best-effort auto-start music with fades, and replace the app icon.
27. Roll out QuestFit — Your body. Your adventure. across visible product identity while preserving compatibility namespaces.
28. Physically rehearse the redesigned guest happy path twice with a clean judged navigation surface and presenter runbook.
29. Add Supabase account sync, RLS, guest conversion, session persistence, history, and leaderboard after the guest-only hackathon demo.

## Verification

Every feature owns observable steps in `feature_list.json`. The standard gate will evolve toward lint, typecheck, unit/integration tests, Playwright, production build, and targeted Supabase/RLS checks. Browser and performance claims require recorded runtime evidence.

## Risks and Mitigations

- Rewrite risk: preserve old behavior until replacement tests and a golden journey pass.
- AI variability: schema validation, bounded prompts, deterministic fallback fixtures.
- Pose/game coupling: movement-event boundary and independent loops.
- Duplicate state: explicit domain ownership; React/Zustand receive coarse snapshots only.
- Auth/data leakage: repository adapters, RLS, cross-user tests.
- Movement quality risk: implement the eleven explicit movement IDs in detector-family slices; only registered, calibrated, gameplay-mapped, and verified movements enter generated workouts.
- Hackathon integration risk: keep AI and Supabase optional behind adapters, preserve guest/local fallbacks, and prioritize one fully evidenced vertical slice over partially connected breadth.

## Decisions

- 2026-07-17: the new Codex docs supersede the old endless-runner product scope.
- 2026-07-17: merged overlapping direction/system-design documents into canonical product, architecture, frontend, data, reliability, and security docs.
- 2026-07-17: retained the working runtime for incremental migration instead of deleting it during documentation cleanup.
- 2026-07-17: one feature tracker replaces the source `TASKS.md` checklist.
- 2026-07-18: the canonical flow begins with welcome/auth, fitness profile, and one-time automatic calibration; the pose model is pretrained and user setup stores thresholds rather than recordings or trained weights.
- 2026-07-18: the supplied `docs/AI_Fitness_Escape_Codex_Docs` packet was reconciled into canonical routed docs and removed to prevent duplicate PRDs, architectures, task lists, and instructions.
- 2026-07-18: expanded the committed MVP movement scope to squat, jump, lunge, jumping jack, high knees, push-up, plank, directional punches, and directional side reaches; split implementation by detector family.
- 2026-07-18: defined the hackathon release boundary, mandatory judged journey, allowed constraints, provider fallbacks, and demo evidence gate across canonical docs.
- 2026-07-18: corrected the feature graph so optional Supabase/leaderboard breadth no longer blocks guest-first hackathon completion; the onboarding slice no longer implies fake remote sign-in success.
- 2026-07-18: narrowed the judged hackathon walkthrough to the guest happy path and prioritized a dedicated Phaser-polish slice before all Supabase work.
- 2026-07-18: preserved mission-controller authority; Phaser effects, encounters, and sound may derive from snapshots but cannot calculate or mutate gameplay facts.
- 2026-07-20: user explicitly replaced demo rehearsal as the active slice with a hybrid redesign: modern sport UI outside missions, cinematic fantasy inside, a visible AI-to-game pipeline, phased exercise programming, a direct body-controlled monster battle, and a guided unscored cooldown. Demo rehearsal now follows those slices.
- 2026-07-21: the planning journey uses three explicit React routes. The plan route validates and stores the request, AI to Action owns the one server generation call and honest progress/retry states, and the briefing validates the stored result before it can save a mission. Route animation is presentation only and reduced-motion safe.
- 2026-07-21: the briefing uses progressive disclosure. Validated mission identity, workload, route beats, and reward stay visible; AI pipeline, instructions, rationale, fallback context, and cooldown detail remain in one accessible disclosure. Indoor missions do not fabricate outdoor distance or weather.
- 2026-07-21: one React-owned Trail Guide carries curated welcome, thinking, pointing, motivating, and celebration moments across routes. Character art and decorative outdoor motifs are presentation-only and cannot become a second coaching, scoring, safety, or gameplay authority.

## Progress

- 2026-07-22: Added the published QuestFit YouTube demo to the public README and removed outdated future-video language from the demo note and roadmap.
- 2026-07-22: Revised the public README into a consistent solo-developer narrative, preserved verified technical detail, and clarified that GPT-5.6 and Codex accelerated development while the developer retained every final product, architecture, engineering, and implementation decision.
- 2026-07-21: Captured and documented three project-owned README screenshots from the camera-free desktop Playwright journey: validated route planning, active Ash Titan combat, and deterministic results. Real-camera video remains separate release evidence.
- 2026-07-21: Deployed the verified production build to the Git-connected Vercel project `questfit-adventure`; the public homepage, planning route, and workout-generation API passed live HTTP checks at `https://questfit-adventure.vercel.app`.
- 2026-07-21: Replaced public governance placeholders with the MIT License, contribution and conduct policies, contributor recognition, structured issue forms, and a verification/safety-aware pull-request template.
- 2026-07-21: Documented the team, GPT-5.6, and Codex collaboration in the public README with concrete implementation examples, decision trade-offs, and explicit human ownership of architecture, safety, validation, evidence, and release claims.
- 2026-07-21: Rebuilt the root README as the concise public onboarding surface for QuestFit, with verified setup, architecture, features, AI boundaries, limitations, and explicit TODOs for missing release assets and governance files.
- 2026-07-17: baseline passed via `bash init.sh`; Vite built 37 modules. Direct `./init.sh` failed because the executable bit is missing. npm reported one moderate and one high vulnerability.
- 2026-07-17: harness validation scored 100/100 before refactoring.
- 2026-07-17: canonical documentation and migration feature state created; obsolete duplicate docs removed.
- 2026-07-17: restored the Bash executable bit and expanded both bootstrap scripts to run tests before the build; 11/11 tests and the 37-module build passed.
- 2026-07-17: post-refactor harness validation scored 100/100; Markdown local-link validation, JSON parsing, and `git diff --check` passed.
- 2026-07-17: migrated the primary runtime from Vite to Next.js 15/React 19/TypeScript 5.9; added strict typechecking, ESLint 9, typed App Router shell, and the former compatibility route compatibility route.
- 2026-07-17: `npm run verify` passed lint, typecheck, 11/11 regression tests, and static production builds for `/` and the former compatibility route; production HTTP checks returned expected content for both routes.
- 2026-07-17: in-app browser control was unavailable, so visual route evidence is deferred to the UI feature and tracked as TD-004.
- 2026-07-17: code-reviewer accepted `product-foundation` with 12/12 and no required fixes; `domain-contracts` became the sole active feature.
- 2026-07-17: implemented strict versioned Zod contracts, inferred types, supported-movement registry, deterministic fixtures/fallbacks, and cross-contract blueprint validation; 14 contract and 11 regression tests passed.
- 2026-07-17: code-reviewer accepted `domain-contracts` with 12/12 and no required fixes; `planning-experience` became the sole active feature.
- 2026-07-17: implemented the planning form, deterministic server adapter, validated compiler, timeout/error fallbacks, API route, and responsive briefing; 19 TypeScript plus 11 regression tests and HTTP behavior checks passed.
- 2026-07-17: browser discovery returned no available backend, leaving the required desktop/narrow and keyboard observation pending; `planning-experience` remains active.
- 2026-07-17: added happy-dom interaction coverage for keyboard focus, preference submission, briefing, failure announcement, and retry; 33 total tests and the full gate pass. Only desktop/narrow visual observation remains pending.
- 2026-07-17: browser discovery returned no available backend for a third consecutive goal turn; automation is blocked at the `planning-experience` visual gate until external browser state changes.
- 2026-07-17: Chrome became available; verified generated planning at 1440x1000 and 390x844, no horizontal overflow, correct keyboard focus order, and no console errors.
- 2026-07-17: code-reviewer accepted `planning-experience` with 12/12 and no required fixes; `pose-migration` became the sole active feature.
- 2026-07-18: implemented and browser-verified welcome, honest account-unavailable handling, guest profile validation/persistence/edit/reload, responsive layouts, and `/plan` handoff; code-reviewer accepted `identity-profile-onboarding` 12/12 and selected `pose-migration`.
- 2026-07-18: implemented automatic squat/jump coordination and reusable versioned thresholds; revised automated/live gates passed, physical completion moved to TD-005 by user choice, and code-reviewer accepted `pose-migration` 12/12.
- 2026-07-18: implemented sample-derived lunge/high-knee thresholds and deterministic side-aware event semantics; full gate and review passed 12/12 with physical evidence retained in TD-005.
- 2026-07-18: implemented sample-derived jumping-jack, directional punch, and directional side-reach thresholds/events; full gate and review passed 12/12 with physical evidence retained in TD-005.
- 2026-07-18: implemented side-view gating plus sample-derived push-up/plank thresholds and timed event semantics; full gate and review passed 12/12 with physical evidence retained in TD-005.
- 2026-07-18: implemented the blueprint-driven Phaser mission, validated pose-event bridge, coarse HUD updates, miss recovery, pause/replay/cleanup, and all-movement objective mapping; browser cadence averaged 16.38 ms and review passed 12/12.
- 2026-07-18: implemented deterministic session analysis/recommendations, fact-preserving coach wording with timeout/invalid fallback, versioned latest results, and a responsive results route; full gate and review passed 12/12.
- 2026-07-18: reopened Phaser after TD-005 exposed its missing pose producer; added objective-aware camera/detector orchestration for every movement family, then physically completed 8 squats and 6 jumps through factual results at 16.5 ms average inference. Review passed 12/12; remaining physical families stay in TD-005 hardening.
- 2026-07-18: completed a visible physical all-eleven movement check, then added a mirrored mission landmark overlay, grounded voice cues/mute, camera-loss and denied-permission recovery tests, and browser cleanup evidence. The full gate now passes 80 tests; broader MVP hardening remains active.
- 2026-07-18: replaced the static Phaser placeholder with a mission-snapshot-driven Volcano Escape world, responsive 16:9 layout, pause/completion presentation, and reduced-motion behavior. The full gate passes 82 tests; browser visual acceptance remains pending after the browser plugin connection expired.
- 2026-07-18: installed Playwright and integrated six system-Chrome desktop/narrow hardening checks into the standard gate, covering keyboard guest entry, honest/local privacy behavior, provider retry, overflow, and reduced motion.
- 2026-07-18: hardened local persistence failure paths across profile, mission/check creation, calibration, and results; actionable recovery replaces uncaught writes and completed metrics retain explicit page-memory continuity.
- 2026-07-18: visually accepted the refreshed Volcano Escape scene in system Chrome at 1440x900 and 390x844 with reduced motion, preserved 16:9 layout/no overflow, and under-25-ms 120-frame cadence. Fixed an effect-order race so startup tracking failure pauses the mission instead of leaving gameplay active.
- 2026-07-18: accepted `mvp-hardening` 12/12 against the user-approved guest-only demo boundary; physical camera-loss demonstration remains TD-005 and `game-polish` is now active.
- 2026-07-18: accepted `game-polish` 12/12 after integrating project-owned illustrated background/runner art, all-eleven encounter presentation, snapshot feedback, opt-in sound, reduced-motion behavior, and desktop/narrow visual evidence; `demo-liftoff` is active.
- 2026-07-18: replaced the prototype two-movement generated plan and fallback with the six-movement standing demo sequence (jumping jack, squat, directional punches, high knees, jump), scaled targets by duration/level, and mapped every segment through the canonical challenge registry.
- 2026-07-18: retired the compatibility route and unused React/canvas runner after the Phaser golden journey passed; retained imported calibration/pose foundations as core product modules, renamed their gate to `test:core`, and passed the full release verification.
- 2026-07-19: retained preparation as the camera/calibration safety boundary but removed its second launch decision; compatible saved setup now performs stable live framing validation and every successful path speaks/displays a three-second countdown before automatic mission navigation.
- 2026-07-19: replaced fixed workout generation with deterministic goal-aware policy: four distinct curated structures, 5/6/7 stages by duration, level/activity scaling, recognized limitation exclusions, goal-specific replacements, profile-aware fallback, and validated user-facing rationale. Desktop/narrow browser evidence passed and review accepted the slice 12/12.
- 2026-07-19: completed the automated demo-polish order: canonical progressive encounters, truthful launch preflight, lower-noise target-aware voice coaching, and a responsive factual results finale with replay and new-plan paths.

## Next Action

Complete two clean-profile QuestFit physical `demo-liftoff` rehearsals and record the runbook evidence.
