# Session Handoff

## Verified Now

- What is currently working: all six MVP features pass; jump fires once per pose entry and squat produces one fixed 0.65-second slide even when either input remains held
- What verification actually ran: prior browser lifecycle checks pass; automated suite now passes 11/11 including held-input regressions; production build passes with 37 modules

## Changed This Session

- Code or behavior added: per-user calibration math and capture flow, rejected-sample handling, landmark overlay, progress/status UI, and threshold handoff to the app lifecycle
- Infrastructure or harness changes: added the 35/65 UI plan and dependency-ordered `split-screen-ui` feature
- Files modified: `src/pose/poseEngine.js`, `src/ui/CalibrationScreen.jsx`, `feature_list.json`, `docs/UI-build-plan.md`, `progress.md`, `session-handoff.md`

## Broken Or Unverified

- Known defect: no known functional defect in the verified MVP; npm reports 2 dependency vulnerabilities (1 moderate, 1 high)
- Unverified path: none within the defined MVP completion gate
- Blockers for the next session: none

## Next Session

- Highest-priority unfinished feature: none; all features are passing
- Why it is next: the MVP implementation and verification gates are complete
- What counts as passing: already satisfied and recorded in `feature_list.json` and `evaluator-rubric.md`
- What must not change during the next step: preserve the backend-free two-exercise MVP and verified pose -> action -> state -> render flow
- Recommended Next Step: manually confirm held jump/squat behavior, then commit and push the regression fix

## Commands

- Startup/verification on Bash: `./init.sh`
- Startup/verification on PowerShell: `./init.ps1`
- Direct verification: `npm install` then `npm run build`
- Focused debug command: `npm run dev`
