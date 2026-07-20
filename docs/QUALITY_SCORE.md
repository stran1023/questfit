# Quality Score

Grades describe verified current state, not target intent: `A` verified/stable, `B` working with minor gaps, `C` partial or transitional, `D` broken/unsafe, `-` not implemented.

## Product Domains

| Domain | Grade | Current evidence | Key gap | Updated |
| --- | --- | --- | --- | --- |
| Pose and calibration | A | automatic all-family setup, versioned thresholds, all-eleven physical movement check, mirrored landmark overlay, camera recovery tests, and 16.9 ms inference | physical device-loss retry observation remains TD-005 | 2026-07-18 |
| Gameplay | A | canonical encounters, eleven movement-matched hero actions, authoritative Ash Titan strike/dodge/block battle, animated volcano tension, portal cinematic, adaptive music/effects, voice, physical x11 completion, and sub-25-ms cadence | confirm boss readability from the physical standing mark during final rehearsal | 2026-07-20 |
| Workout planning | A | four goal-aware 5/6/7-stage structures, warm-up/build/surge/peak load curve, validated unscored cooldown, profile-derived scaling/limitations, goal-specific replacements, and fallback | live provider phrasing remains optional | 2026-07-20 |
| Level compilation | A | validated all-movement blueprint contracts, referential checks, deterministic fixtures, and Phaser objective mapping | broaden themes after the MVP | 2026-07-18 |
| Coaching | A | deterministic metrics/recommendations, fact-preserving provider boundary, timeout/invalid fallback, result persistence/UI, and focused tests | live configured provider evidence remains optional for the guest-first MVP | 2026-07-18 |
| Auth and progress | - | design only | Supabase setup, RLS, guest migration, persistence tests | 2026-07-17 |
| Product UI | A | explicit Plan → AI to Action → Briefing flow, recurring Scout, visible four-chip rationale scan, Ash Titan/right-edge Storm Gate route, adventure icon, best-effort faded mission audio, one CTA, live pose/voice, guided cooldown, factual results, and responsive hardening | two clean-profile physical rehearsals remain the release gate | 2026-07-21 |

## Harness and Layers

| Area | Grade | Evidence | Key gap | Updated |
| --- | --- | --- | --- | --- |
| Harness | A | structural validator 100/100; canonical docs, active plan, cross-platform full verification, and ten Playwright desktop/narrow checks in the standard gate | retain the real-device check for camera loss without fabricating physical input | 2026-07-19 |
| Contracts | A | strict Zod v1 schemas, inferred types, deterministic fallbacks, and 14 passing boundary/referential tests | integrate every future provider at this boundary | 2026-07-17 |
| Domain logic | A | typed calibration/detector/runtime rules for eleven movements plus deterministic metrics and coaching recommendations | continue consolidating small JavaScript foundations behind typed feature boundaries | 2026-07-18 |
| Adapters/services | C | MediaPipe, deterministic AI fallback/provider boundary, and local repositories | Supabase adapter and live external AI evidence absent | 2026-07-18 |
| Runtime | A | Next.js 15 routes, independent MediaPipe and Phaser loops, live overlay/voice/sound, snapshot-derived effects, results, responsive cadence, and verified cleanup | physical camera-loss observation remains deferred TD-005 | 2026-07-18 |

Update a row only from observable evidence. Feature completion should improve a grade or state why it does not.
