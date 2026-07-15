# AGENTS.md — Project Context for Codex CLI

## Project

AI Fitness Escape: a browser-based endless runner controlled by real-time webcam pose detection. Player performs a jump to clear obstacles and a squat to slide under obstacles; a monster chases the player and catches them after repeated misses.

## Scope (MVP — do not expand without discussion)

- **Two exercises only:** jump and squat. Do not add push-up, mountain climber, or climb mechanics to MVP code paths — they are explicitly deferred to the roadmap.
- **No backend.** All pose detection, game state, and rendering run client-side. Do not introduce a server, database, or auth for the MVP.
- **Miss tolerance, not instant-fail.** A missed obstacle should reduce a lives/buffer counter, not end the game immediately — this absorbs pose-detection noise.
- **Calibration is required before gameplay starts.** Every run begins with a short calibration step (one sample jump, one sample squat) that sets per-user detection thresholds. Do not hardcode global thresholds.

## Architecture Reference

Full architecture, data flow, and folder structure are documented in `docs/ARCHITECTURE.md`. Read it before making structural changes.

## Startup Workflow

1. Read `progress.md`, `session-handoff.md`, and `feature_list.json`.
2. Run `./init.sh` on Bash or `./init.ps1` on PowerShell before changing code.
3. Select the highest-priority dependency-ready feature. Keep only one feature `in_progress`.
4. Read `docs/ARCHITECTURE.md` before structural changes, then stay inside the selected feature's scope.

## One Feature at a Time

Keep exactly one feature `in_progress`. Do not begin a dependent feature until every listed dependency is `passing`, and do not bundle unrelated cleanup into the active feature.

## Conventions

- Detection logic (pose → action) lives in `src/pose/movementClassifier.js` and must stay decoupled from rendering — the render loop should never block on pose inference.
- Game state changes flow one direction: pose → action → state → render. Do not let UI components mutate game state directly; go through `src/game/gameState.js`.
- Prefer plain functions over classes for the pose/classification logic, keep them unit-testable in isolation from the DOM/canvas.

## Model Guidance (for this session)

- Use **Terra** for general build tasks: UI screens, game loop wiring, obstacle spawning, styling.
- Use **Sol** for the harder pose-detection math: landmark buffering, jump/squat thresholding, calibration logic.

## Out of Scope for MVP

Do not build: accounts/persistence, multiplayer, adaptive difficulty, posture feedback, additional exercises, AI-generated levels. These are post-hackathon roadmap items only.

## Completion Gate

A feature is `passing` only when all of its `verification` steps have been run, observable evidence is recorded in `feature_list.json`, and the standard verification path succeeds. Do not mark placeholder, mocked, or manually unverified behavior as passing.

## End of Session

Before stopping, update `feature_list.json`, `progress.md`, and `session-handoff.md` with the actual state, commands run, evidence, blockers, files changed, and one recommended next action. Leave the baseline restartable; if verification fails, record the failure and keep the feature non-passing.
