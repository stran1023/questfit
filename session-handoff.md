# Session Handoff

## Verified Now

- What is currently working: project structure and React/Vite production build pass; the harness validator scores all five subsystems 5/5
- What verification actually ran: `./init.ps1` (`npm install`, `npm run build`) and `validate-harness.mjs --target .`

## Changed This Session

- Code or behavior added: none
- Infrastructure or harness changes: added feature state, progress, handoff, and cross-platform verification
- Files modified: `AGENTS.md`, `feature_list.json`, `progress.md`, `session-handoff.md`, `init.sh`, `init.ps1`

## Broken Or Unverified

- Known defect: core MVP source modules contain unfinished TODO implementations; npm reports 2 dependency vulnerabilities (1 moderate, 1 high)
- Unverified path: live webcam, calibration, pose classification, and complete gameplay
- Blockers for the next session: none known; live browser verification requires camera access

## Next Session

- Highest-priority unfinished feature: `pose-engine`
- Why it is next: calibration and movement classification depend on live landmarks
- What counts as passing: build succeeds and live landmark production plus stream cleanup are observed
- What must not change during that step: no backend, no extra exercises, and no coupling pose inference to rendering
- Recommended Next Step: implement and verify `src/pose/poseEngine.js`

## Commands

- Startup/verification on Bash: `./init.sh`
- Startup/verification on PowerShell: `./init.ps1`
- Direct verification: `npm install` then `npm run build`
- Focused debug command: `npm run dev`
