# Reliability and Verification

## Current Standard Paths

- Bootstrap: `./init.sh` or `./init.ps1`
- Full verification: `npm run verify`
- Tests: `npm test`
- Browser checks: `npm run test:e2e`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Production build: `npm run build`
- Local runtime: `npm run dev`

The bootstrap scripts install dependencies and run the full verification command. Playwright desktop/narrow checks are part of that gate. Add Supabase/RLS checks when its owning feature begins; both bootstrap entrypoints must remain equivalent and fail fast.

## Completion Evidence

Automated output belongs in `feature_list.json` as concise dated evidence. Browser-only claims must name the viewport, action, and observed result. Inspection, placeholders, mocks that bypass the boundary under test, and stale evidence from the old runtime do not close a new feature.

## Golden Journeys

1. Guest completes profile setup, finishes touch-free calibration, generates or receives a safe fallback workout, completes a mission, receives fact-grounded coaching, and can replay without recalibrating.
2. Signed-in user reloads a compatible saved profile and calibration, completes a mission, saves progress, and sees updated XP/streak/history.
3. Camera denial/loss, invalid AI output, and persistence failure each produce an actionable recovery without corrupting the session.

## Hackathon Release Gate

Before the demo build is considered ready:

1. Run the guest vertical slice twice from a clean browser profile on the reference laptop.
2. Confirm remote identity/sync is labeled unavailable and demonstrate guest-local continuity; Supabase is outside the judged demo.
3. Exercise at least one movement from each detector family live and run fixture coverage for every registered movement and direction.
4. Disable or fail the AI adapter and confirm workout planning plus coaching remain usable through deterministic fallbacks.
5. Keep deterministic camera denial/loss/retry and cleanup checks green; a physical failure-path demonstration is post-demo hardening.
6. Record browser/version, viewport, pose-to-action latency, gameplay frame time, build commit, and any provider modes used.

Physical movement completion may be deferred from an individual detector implementation only when deterministic landmark-sequence tests cover its state machine and the deferral is recorded as technical debt. It remains mandatory before `mvp-hardening` can pass.

The demo may use a documented reference device, but it may not rely on manually editing storage, refreshing to repair state, hidden bypass controls, or fabricated provider responses.

## Runtime Targets

- Pose-to-action latency target: under 100 ms on a supported laptop after model warm-up.
- Automatic calibration must reject missing-body, unstable, incomplete, and implausible samples, recover without touch input, and persist only versioned derived thresholds.
- Verification fixtures and live checks must cover every registered movement, both directional sides, rep rearming, hold start/release, occlusion, wrong camera orientation, and transition between standing and floor setup.
- Phaser gameplay target: 60 FPS with frame-time evidence on the reference device.
- No React or Zustand update per raw pose frame or Phaser tick.
- Webcam, MediaPipe tasks, animation frames, workers, subscriptions, and timers clean up on route/phase change.
- A camera track ending pauses the mission and offers in-place retry; denied startup permission offers the same recovery path without requiring reload or losing mission progress.
- Spoken mission cues are derived only from validated mission snapshots and coarse tracking guidance, and muting or leaving the mission cancels queued speech.
- AI calls have timeouts, structured error categories, schema validation, and deterministic fallback content.
- Invalid, rejected, timed-out, or policy-incompatible workout proposals regenerate through the same goal/profile-aware deterministic policy. Fallbacks must preserve duration, goal, limitation exclusions, playability, and rationale truth.
- Save operations are idempotent where retry could duplicate XP or session rows.
- Guest storage failures keep validated form/mission state recoverable and display an actionable message. Completed results fall back to page-lifetime memory with an explicit temporary-results warning rather than discarding authoritative metrics.
- The launch preflight reflects existing camera, model, framing, calibration, voice, and mission state; it cannot override readiness or create a synthetic demo-ready state.
- Speech cues are derived from coarse mission snapshots and canonical encounter copy. New cues cancel stale speech, corrections and pause/completion take priority, and nonessential high-count repetition announcements are suppressed.
- Procedural music starts only after the explicit audio gesture, degrades silently when Web Audio is unavailable, guards late async unlock after disable, pauses during mission pause/recovery, and clears its scheduler/gain/context on exit.

## Baseline Policy

Run bootstrap before changes. If it fails, either repair it within the active feature or record the exact failure and avoid claiming a passing baseline. Never delete the working prototype until the replacement golden journey has equivalent evidence.
