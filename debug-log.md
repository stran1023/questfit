# Debug Log

## 2026-07-22 — Playwright mission canvas baseline

- Command: `./init.ps1`, followed by `npm run test:e2e`.
- Failure: desktop and narrow `mission world is distance-readable, responsive, and frame-stable` checks timed out waiting five seconds for `.game-canvas canvas`.
- Last working commit: `b030e27` (`docs: add QuestFit screenshot gallery`). The full gate also passed once at the start of this documentation-only session.
- Changed-file isolation: the active diff contains documentation and lifecycle files only; no application, test, or runtime file changed.
- Hypothesis: the browser fixture seeds `ai-fitness-escape:mission-v1` but does not seed saved calibration thresholds. `MissionPoseCamera` therefore reports `Saved movement setup is missing. Return to preparation.` and pauses before Phaser creates the canvas.
- Evidence: both retained Playwright error contexts show the missing-setup status; `tests/e2e/hardening.spec.ts` seeds only the mission, while `src/features/gameplay/MissionPoseCamera.tsx` fails immediately when `loadCalibrationThresholds()` returns no value.
- Result: hypothesis supported by source and captured page state. Runtime code was not changed because the active request is documentation-only.
- Next action: update the mission test fixture to seed a validated calibration profile or drive the preparation boundary, then rerun `./init.ps1` as a dedicated verification fix.
