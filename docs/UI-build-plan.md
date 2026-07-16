# AI Fitness Escape — UI Build Plan

## Purpose

This document defines the MVP user interface and a dependency-aware implementation sequence. It is a build guide, not a change to the priority order in `feature_list.json`: UI work must be completed only within the currently selected, dependency-ready feature.

## MVP Experience

The interface should make one loop immediately understandable:

1. Fit your full body in the camera frame.
2. Perform one sample jump and one sample squat.
3. Use jumps and squats to clear the matching obstacles.
4. Survive misses using a three-hit buffer while the monster closes in.
5. Review the score and recalibrate before replaying.

The MVP has three primary screens: calibration, gameplay, and game over. Camera permission and runtime failures appear as states within this flow rather than as separate application areas.

## Experience Principles

- **Movement first:** prompts and gameplay cues must be readable from several feet away.
- **One clear action:** each calibration step and recovery state exposes one primary button or physical action.
- **Visible system status:** always show the current calibration step, detected action, remaining miss buffer, and camera/error state when relevant.
- **Forgiving feedback:** distinguish a recoverable miss from game over; never imply that one noisy detection ends the run.
- **No hidden calibration:** gameplay cannot begin until valid per-user jump and squat thresholds exist.
- **Privacy clarity:** state that camera processing happens locally in the browser and no video is uploaded.
- **MVP discipline:** expose only jump and squat. Do not add accounts, persistence, multiplayer, posture coaching, or additional exercises.

## Information Architecture and Flow

```text
App start
  -> Camera request / loading
  -> Permission or device error -> Retry
  -> Framing check
  -> Jump sample
  -> Squat sample
  -> Ready confirmation
  -> Running game
  -> Recoverable miss feedback (0–2 misses)
  -> Monster catches player (3 misses)
  -> Game-over summary
  -> Play again -> fresh calibration
```

Every replay returns to calibration. Thresholds are session data and must not silently carry into a new run.

## Visual Direction

- Use a stylized **neon jungle escape** direction: deep indigo and purple environments, a warm sunset glow, cyan jump accents, magenta squat accents, and bright character/obstacle silhouettes.
- Favor illustrated arcade graphics over realism. The style should be energetic, internally consistent, and readable while the player is moving several feet from the screen.
- Keep the game world dominant during play with a 35/65 desktop split: pose tracking on the left and the game on the right.
- Use semantic status colors plus text/icons: neutral/instruction, success/ready, warning/miss, and danger/game over. Never rely on color alone.
- Prefer large display text, strong silhouettes, and simple shapes that remain legible in a recorded demo.
- Use rounded, translucent HUD surfaces so the pose and game panels feel like one interface without obscuring the playfield.
- Define reusable CSS custom properties for color, spacing, type scale, radius, shadow, and motion duration before polishing individual screens.
- Use system fonts for the first functional pass; custom fonts and final art are polish items, not dependencies.

## Game Art and Engagement Direction

### Canvas scene layers

Draw the game world from back to front so different scroll speeds create convincing depth without requiring 3D rendering:

1. Sky gradient and atmospheric sunset glow
2. Distant mountains or temple ruins
3. Slow clouds, fog, and drifting particles
4. Midground trees and structures
5. Faster foreground foliage
6. Glowing trail and ground plane
7. Monster
8. Player
9. Obstacles
10. Action particles and foreground effects

Keep decorative layers visually quiet near upcoming obstacles. Parallax must enhance depth without hiding collision information.

### Player and monster animation

The MVP player needs a compact, purposeful animation set: run, jump, slide, land, stumble, and caught. The monster needs a chase loop, a close-in reaction after a miss, and a final catch animation.

Monster position is the primary danger indicator:

| Misses | Monster presentation |
|---|---|
| 0 | Far behind; visible but not dominant |
| 1 | Clearly closer with a brief approach reaction |
| 2 | Immediately behind the player; danger treatment intensifies |
| 3 | Catch sequence transitions to game over |

The miss buffer remains visible in the HUD, but the monster’s physical distance should communicate the consequence without requiring the player to read a number.

### Obstacle language

Use two unmistakable obstacle families:

- **Low obstacle / jump:** fallen log, broken wall, or ground trap with a cyan upward cue.
- **High obstacle / squat:** hanging branch, low archway, or energy barrier with a magenta downward cue.

Obstacle silhouette and placement must remain sufficient to understand the required movement. Accent colors and arrow cues are reinforcement, not the only distinction. Introduce the cue early enough for a webcam-controlled reaction, then preserve a consistent timing window.

### Moment-to-moment feedback

Prioritize small effects that make successful movement feel responsive:

- Dust or energy particles behind the runner
- Brief motion streaks during a jump
- Squash-and-stretch on landing
- Short cyan or magenta acknowledgement when an action is recognized
- A score pop when points increase
- A controlled camera shake and monster approach on a miss
- A screen-edge danger pulse when the monster is close
- A brief slow-motion beat during the final catch
- Layered ambient, movement, success, miss, and catch sounds

Effects must never cover an approaching obstacle or delay state changes. Respect `prefers-reduced-motion` by removing strong shake, intense pulses, motion streaks, and nonessential slow motion. Avoid rapid flashing.

### Art asset strategy

- Start with geometric placeholders until movement, collision, scoring, and miss tolerance are verified.
- Replace placeholders with a consistent player sprite set, monster sprite set, two obstacle families, layered backgrounds, and a small reusable effects atlas.
- Prefer sprite sheets or image atlases for animated assets to reduce loading and draw overhead.
- Establish a shared palette, outline weight, lighting direction, scale, and camera angle before producing final assets.
- Optimize raster assets for browser delivery and preload only assets required for the current run.
- Do not add additional maps, themes, characters, or cosmetic selection to the MVP.

## Screen Specifications

### 1. Calibration Screen

**Goal:** obtain camera access, confirm framing, and collect valid jump and squat samples before enabling gameplay.

**Layout:**

- Header: game title, current step label, and progress indicator (`1 of 3`, `2 of 3`, `3 of 3`).
- Main stage: mirrored live camera preview with a non-blocking full-body framing guide and pose-status overlay.
- Instruction panel: one short headline, one supporting sentence, and the current action cue.
- Status area: camera loading, body-in-frame, sampling, sample accepted, or actionable error.
- Privacy note: “Processed on this device. Video is not uploaded.”

**Step states:**

| State | Primary message | Advance condition |
|---|---|---|
| Requesting camera | Allow camera access to begin | Browser permission and usable stream |
| Framing | Fit your whole body inside the guide | Required landmarks stable for the configured window |
| Jump sample | Jump once when the cue appears | Valid jump sample captured |
| Squat sample | Squat and hold briefly | Valid squat sample captured |
| Ready | Calibration complete | Finite thresholds exist; short countdown starts |
| Error | Explain the specific failure | Retry successfully obtains a stream or valid sample |

Do not enable a manual “skip calibration” path. If a sample is rejected, explain the correction (“step back,” “keep feet visible,” or “try one clear jump”) and retry only that step.

### 2. Game Screen

**Goal:** keep the playfield readable while giving immediate confirmation that body movements are being recognized.

**Desktop layout:** use a 35/65 horizontal split. The left 35% is the pose-tracking panel and the right 65% is the game panel. This makes the AI interaction visible in the recorded demo without making the game secondary.

```text
┌──────────────────────┬──────────────────────────────────────┐
│ Pose tracking — 35%  │ Game — 65%                           │
│                      │                                      │
│ Mirrored camera      │ Runner, obstacles, and monster       │
│ Skeleton overlay     │                                      │
│                      │ Score · Buffer · Monster distance    │
│ Tracking status      │                                      │
│ Action: JUMP         │ Responsive 16:9 canvas               │
└──────────────────────┴──────────────────────────────────────┘
```

**Pose-tracking panel (left):**

- Mirrored webcam feed with a lightweight landmark/skeleton overlay.
- Tracking state such as `Loading`, `Tracking`, `Body not visible`, or `Camera lost`.
- Prominent recognized-action feedback: `Jump`, `Squat`, or `Ready`.
- Short corrective guidance when required, such as “Step back” or “Keep feet visible.”
- Local-processing privacy label.
- Draw landmarks on an overlay canvas rather than creating React elements for each landmark or updating React on every inference frame.

**Game panel (right):**

- Primary region: responsive 16:9 game canvas.
- Top HUD: score, three-segment miss buffer, monster-distance indicator, and current speed.
- Pause/error overlay only when camera input is lost or the page becomes unable to continue safely.

The game panel remains the visual focus. Avoid duplicating full pose feedback over the game canvas; only use a brief in-world acknowledgement when it improves action timing.

**Feedback rules:**

- A recognized jump or squat gets brief visual acknowledgement without obscuring obstacles.
- A miss removes one buffer segment and briefly emphasizes the monster closing in.
- Buffer segments progress from calm teal through warning amber to danger red, with icons/text so the meaning does not depend on color.
- The first two misses return immediately to play; no modal interrupts the run.
- At the final miss, transition once to game over after the catch animation/state completes.
- HUD values render from game state. UI components must not directly change score, misses, obstacles, or player action.

### 3. Game-Over Screen

**Goal:** clearly close the run and offer a reliable restart.

**Layout and content:**

- Outcome headline: “Caught!”
- Final score as the strongest numeric element.
- Short run summary using only data already available in the MVP state.
- Primary action: “Play again,” which cleans up the previous run and starts fresh calibration.
- Secondary guidance: remind the player that replay recalibrates for their current position.

Do not add leaderboards, saved history, sign-in, or sharing to the MVP.

## Shared UI Components

Start with screen-local markup. Extract a shared component only when it is reused or has independent behavior.

| Component | Responsibility | Data source |
|---|---|---|
| `AppShell` | Page framing and phase-level presentation | App lifecycle |
| `CalibrationProgress` | Step labels and completion state | Calibration flow |
| `CameraStage` | Video preview, mirroring, framing overlay | Webcam and pose engine |
| `StatusMessage` | Loading, success, warning, and error announcements | Current subsystem state |
| `GameCanvas` | Canvas host and sizing only | Render engine |
| `GameHud` | Score, miss buffer, monster distance | Read-only game-state snapshot |
| `ActionBadge` | Last/current classified action | Movement classifier output |
| `GameOverSummary` | Final score and replay control | Final game-state snapshot |

Suggested location: keep screen components in `src/ui/`; place genuinely reused UI primitives under `src/ui/components/` once they exist. Styling may begin in `src/ui/styles.css`; split it only when the file becomes difficult to navigate.

Game assets should live under purpose-specific folders such as `src/assets/player/`, `src/assets/monster/`, `src/assets/obstacles/`, `src/assets/backgrounds/`, `src/assets/effects/`, and `src/assets/audio/`. Keep rendering behavior in `src/game/renderEngine.js`; introduce a separate `gameLoop.js` only when fixed-step update coordination is implemented.

## State Ownership and Interfaces

The allowed dependency direction remains:

```text
webcam -> pose engine -> calibration/classifier -> game state -> render/UI
```

- `main.jsx` coordinates lifecycle phases and passes callbacks/data down.
- `calibrationFlow.js` owns calibration step transitions and threshold validity.
- `gameState.js` is the source of truth for score, misses, obstacles, player action, and game phase.
- React screens display state and request domain actions through callbacks; they do not mutate domain state directly.
- `renderEngine.js` owns canvas drawing. React owns surrounding DOM/HUD, not per-frame game-world drawing.
- Pose inference and `requestAnimationFrame` remain independent loops. React renders must not be triggered for every raw landmark frame.
- Camera streams, pose tasks, animation frames, and timers must be disposed on phase change and unmount.

Recommended view models passed to UI:

```js
calibrationView = {
  step, stepIndex, stepCount, cameraStatus, framingStatus,
  instruction, sampleStatus, error
}

gameHudView = {
  score, misses, maxMisses, monsterDistance, detectedAction
}
```

These are presentation projections, not parallel mutable stores.

## Responsive Behavior

- Optimize first for a laptop in landscape, since the webcam requires enough distance for full-body framing.
- Use the 35/65 pose/game split at desktop widths; do not allow the pose panel to grow to 50% and make the game feel secondary.
- On narrow or portrait viewports, stack the pose panel above the game panel instead of squeezing them side by side. Keep both panels readable and preserve the game canvas aspect ratio.
- Keep the canvas at a 16:9 aspect ratio and scale it within the viewport without stretching game coordinates.
- At widths below the desktop layout, stack the instruction/HUD regions around the stage rather than shrinking text below legibility.
- Use a minimum 44 × 44 CSS-pixel target for buttons.
- If the viewport cannot show the full calibration stage, show guidance to rotate or increase distance; do not silently crop the framing guide.

## Accessibility and Safety

- Use semantic headings, buttons, and live regions for status/errors.
- Preserve visible keyboard focus and allow retry/replay with keyboard input.
- Give text labels to icons and non-color indicators to buffer segments.
- Respect `prefers-reduced-motion`; reduce screen shake, pulses, and nonessential transitions.
- Avoid rapid flashes. Keep miss feedback brief but below unsafe flashing frequency.
- Error copy must identify the next action: grant permission, close another camera-using app, reconnect the camera, step back, or retry.
- Provide a concise physical-space reminder before calibration: clear overhead and floor space before jumping or squatting.

## Build Sequence

Implementation must follow `feature_list.json`; only the selected feature may be `in_progress`.

### Phase A — Pose-engine UI states (feature: `pose-engine`)

- Add camera loading, permission, ready, and failure states to the calibration screen.
- Mount the live preview and framing overlay host without implementing calibration thresholds.
- Verify stream cleanup when leaving/unmounting the screen.
- Keep visual styling functional and minimal until pose evidence passes.

### Phase B — Calibration experience (feature: `calibration`)

- Implement framing, jump, squat, rejected-sample, ready, and countdown presentations.
- Connect progress strictly to `calibrationFlow.js` outputs.
- Prevent gameplay transition when thresholds are missing or invalid.
- Validate instructions at real camera-viewing distance.

### Phase C — Recognition feedback (feature: `movement-classifier`)

- Add the action badge and sample/debug feedback needed to observe jump, squat, and neutral classifications.
- Throttle presentation updates so raw inference does not cause excessive React rendering.
- Remove or hide developer-only landmark/debug details from the demo path.

### Phase D — Gameplay HUD and canvas shell (feature: `runner-loop`)

- Build the responsive 35/65 pose/game layout, including the narrow-screen stacked fallback.
- Add responsive canvas sizing and wire read-only HUD projections.
- Render the mirrored camera and landmark overlay in the left panel without coupling pose inference to React or the game render loop.
- Implement the playable loop with geometric placeholders first: player movement, two obstacle types, collision, score, miss buffer, and monster distance.
- Use `requestAnimationFrame` with delta time for drawing and a fixed update step for reliable gameplay and collision behavior.
- Add scene-layer hooks in back-to-front order so final parallax art can replace placeholders without changing game-state logic.
- Add score, three-segment miss buffer, monster-distance cue, and recognized-action feedback.
- Add recoverable miss and final-catch transitions without interrupting the first two misses.
- Verify that UI controls call game-state functions rather than mutating state.

### Phase E — Lifecycle and visual polish (feature: `mvp-polish`)

- Complete game-over summary, replay-to-calibration, actionable camera errors, and cleanup.
- Apply final tokens, responsive styling, accessibility states, reduced motion, and demo-readable copy.
- Replace geometric placeholders with the approved neon-jungle sprite and background set.
- Add parallax, compact character animations, particles, action acknowledgement, miss feedback, sound, and the final catch sequence in that order.
- Confirm decorative layers and effects never obscure obstacles, HUD values, or pose status.
- Run two full calibration-to-replay loops without refresh.
- Polish only shipped MVP states; do not create roadmap UI.

## Verification Checklist

For each phase, record observable evidence in the matching `feature_list.json` entry before marking it `passing`.

### Functional

- Camera loading, permission denial, unavailable device, and retry states are distinguishable.
- Calibration always runs in framing -> jump -> squat order and cannot be skipped.
- Invalid samples do not create thresholds or start gameplay.
- Jump and squat feedback matches classifier output without blocking the render loop.
- A single miss reduces the buffer but does not end the run.
- The third miss reaches game over once, with the correct final score.
- Replay releases prior resources and begins fresh calibration.

### Visual and responsive

- Primary instructions are readable at exercise distance.
- The full framing guide, primary action, and current status fit at the target laptop viewport.
- The canvas preserves 16:9 geometry at supported viewport sizes.
- HUD content does not cover upcoming obstacles or the player.
- Warning and danger states remain understandable without color.

### Accessibility and performance

- Keyboard focus is visible on retry and replay controls.
- Status and error changes are exposed through appropriate live regions.
- Reduced-motion mode removes nonessential intense animation.
- No raw landmark stream is stored in React state or rendered at inference frequency.
- Camera tracks, timers, pose tasks, and animation frames stop on cleanup.
- `npm run build` succeeds.

## Definition of UI Complete

The UI portion of the MVP is complete only when all five feature entries are `passing`, their specified verification evidence is recorded, and a player can complete calibration, survive at least one miss, reach game over, and replay twice without refreshing. Placeholder screens, mocked classifier output, or build-only verification do not satisfy this definition.

## Explicit Non-Goals

- Additional exercise selectors or controls
- Accounts, profiles, persistence, leaderboards, or multiplayer
- Adaptive difficulty or fatigue/posture coaching
- AI-generated levels, multiple maps, or theme selection
- Backend APIs, analytics pipelines, or video upload
- UI frameworks or state libraries unless an observed implementation need justifies them
