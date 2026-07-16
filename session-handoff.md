# Session Handoff

## Verified Now

- What is currently working: pose-engine and calibration are passing; classifier tests pass for jump, held squat, and noise; the gameplay screen now renders a Lovable-referenced 35/65 live pose/game shell
- What verification actually ran: user completed live calibration and reached GameScreen; automated suite passed 6/6; production build passed with 33 transformed modules

## Changed This Session

- Code or behavior added: per-user calibration math and capture flow, rejected-sample handling, landmark overlay, progress/status UI, and threshold handoff to the app lifecycle
- Infrastructure or harness changes: added the 35/65 UI plan and dependency-ordered `split-screen-ui` feature
- Files modified: `src/pose/poseEngine.js`, `src/ui/CalibrationScreen.jsx`, `feature_list.json`, `docs/UI-build-plan.md`, `progress.md`, `session-handoff.md`

## Broken Or Unverified

- Known defect: runner gameplay remains a visual placeholder; npm reports 2 dependency vulnerabilities (1 moderate, 1 high)
- Unverified path: 35/65 desktop proportions, visible live action feedback, and narrow-screen stacked layout
- Blockers for the next session: completing `split-screen-ui` verification requires browser visual observation

## Next Session

- Highest-priority unfinished feature: `split-screen-ui`
- Why it is next: implementation and build checks pass, but the completion gate requires visual confirmation at desktop and narrow widths
- What counts as passing: approximately 35/65 desktop panels, mirrored landmark overlay and action feedback, stacked narrow layout, and undistorted 16:9 game canvas
- What must not change during that step: pose inference remains separate from React and game rendering; no 50/50 desktop split
- Recommended Next Step: run through calibration, verify the gameplay screen at desktop width, then resize below 850px and report whether the layout stacks correctly

## Commands

- Startup/verification on Bash: `./init.sh`
- Startup/verification on PowerShell: `./init.ps1`
- Direct verification: `npm install` then `npm run build`
- Focused debug command: `npm run dev`
