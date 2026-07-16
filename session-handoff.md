# Session Handoff

## Verified Now

- What is currently working: all six MVP features pass, including pose, per-user calibration, jump/squat classification, responsive split UI, playable runner, miss tolerance, game over, replay, and camera recovery
- What verification actually ran: user confirmed complete browser behavior including two replay cycles and denied-camera recovery; automated suite passed 9/9; final `./init.ps1` built 37 modules successfully; code review accepted at 11/12

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
- Recommended Next Step: commit and push the current verified completion state

## Commands

- Startup/verification on Bash: `./init.sh`
- Startup/verification on PowerShell: `./init.ps1`
- Direct verification: `npm install` then `npm run build`
- Focused debug command: `npm run dev`
