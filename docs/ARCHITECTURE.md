# AI Fitness Escape — Architecture

## Overview

A single-page, client-side web app. All pose detection and game logic run in the browser, no backend required for the MVP. This keeps latency low (critical for real-time exercise-to-action mapping) and removes deployment complexity for a hackathon timeline.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser (Client)                   │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐ │
│  │   Webcam      │───▶│  Pose Engine │───▶│  Movement   │ │
│  │   Capture     │    │  (MediaPipe/ │    │  Classifier │ │
│  │  (getUserMedia)│    │   MoveNet)   │    │ (jump/squat)│ │
│  └──────────────┘    └──────────────┘    └──────┬──────┘ │
│                                                    │        │
│                                                    ▼        │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐ │
│  │  Calibration │───▶│  Game State  │◀───│  Game Input │ │
│  │   Module     │    │   Manager    │    │   Handler   │ │
│  └──────────────┘    └──────┬───────┘    └─────────────┘ │
│                              │                              │
│                              ▼                              │
│                    ┌──────────────────┐                    │
│                    │   Render Engine   │                    │
│                    │ (Canvas/WebGL —   │                    │
│                    │  runner, obstacles│                    │
│                    │  monster, score)  │                    │
│                    └──────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Webcam Capture
- Uses the browser `getUserMedia` API to stream video from the user's camera into a hidden `<video>` element.
- Feeds frames to the Pose Engine at a fixed interval (target: 20-30 fps for smooth detection without overloading the browser).

### 2. Pose Engine
- **Library:** MediaPipe Pose or TensorFlow.js MoveNet, both run client-side, no server round-trip.
- Outputs body landmark coordinates (hips, knees, shoulders, etc.) per frame.
- Runs independently of the render loop so a dropped frame in detection doesn't stall the game.

### 3. Movement Classifier
- Pure function(s) that take landmark history (a short rolling buffer of recent frames, not just the current frame) and output a discrete action: `jump`, `squat`, or `none`.
- **Jump:** detects rapid upward hip-landmark displacement that returns to baseline within a short window.
- **Squat:** detects hip-to-knee vertical distance dropping below a calibrated threshold and holding for a few frames.
- Thresholds are **per-user values set during calibration**, not hardcoded, since camera distance and body proportions vary.

### 4. Calibration Module
- Runs once at game start (or on demand if the player repositions).
- Prompts: "stand in frame" → capture one sample jump → capture one sample squat.
- Writes calibrated thresholds into a shared config object consumed by the Movement Classifier.
- Shows a live silhouette/framing guide so the player knows they're correctly positioned before the run starts.

### 5. Game State Manager
- Central state holding: player position, obstacle queue, monster distance, miss count, score, game phase (`calibrating` / `running` / `game-over`).
- Movement Classifier output is the only input that changes player-related state, keeping the data flow one-directional: **pose → action → state → render**.
- Miss tolerance logic lives here: a missed obstacle decrements a buffer (e.g. 3 lives) rather than ending the game instantly, so isolated detection noise doesn't end a run unfairly.

### 6. Render Engine
- Canvas-based (2D context is sufficient for MVP; WebGL only if time allows richer visuals).
- Side-scrolling runner: character, obstacle spawner, monster sprite trailing at a distance tied to miss count, score/HUD overlay.
- Runs on `requestAnimationFrame`, decoupled from the pose-detection loop so game smoothness doesn't depend on detection speed.

---

## Data Flow (per frame)

1. Webcam frame captured
2. Pose Engine extracts landmarks
3. Movement Classifier evaluates landmark buffer against calibrated thresholds → emits action (or none)
4. Game State Manager applies action to player state, checks collisions against obstacle queue
5. Render Engine draws the updated frame

---

## Suggested Folder Structure

```
ai-fitness-escape/
├── src/
│   ├── pose/
│   │   ├── captureWebcam.js
│   │   ├── poseEngine.js          # MediaPipe/MoveNet wrapper
│   │   └── movementClassifier.js  # jump/squat detection logic
│   ├── calibration/
│   │   └── calibrationFlow.js
│   ├── game/
│   │   ├── gameState.js
│   │   ├── obstacleSpawner.js
│   │   ├── collision.js
│   │   └── renderEngine.js
│   ├── ui/
│   │   ├── CalibrationScreen.jsx
│   │   ├── GameScreen.jsx
│   │   └── GameOverScreen.jsx
│   ├── assets/                    # sprites, sounds
│   └── main.js
├── public/
│   └── index.html
├── AGENTS.md                      # Codex CLI project context
├── package.json
└── README.md
```

---

## Tech Stack Summary

| Layer | Choice | Why |
|---|---|---|
| Pose detection | MediaPipe Pose or TensorFlow.js MoveNet | Runs client-side, low latency, no backend needed |
| Rendering | HTML5 Canvas | Fast to build, sufficient for a 2D side-scroller |
| Framework | React (or plain JS if time-constrained) | Familiar component structure for UI screens |
| Hosting | Static hosting (Vercel/Netlify/GitHub Pages) | No server logic required for MVP |
| Build tooling | Codex CLI with GPT-5.6 (Terra for general build, Sol for pose/calibration logic) | Hackathon requirement |

---

## Why No Backend for MVP

Everything the game needs (video frames, pose landmarks, game state) exists only for the duration of a single session and never needs to persist or be shared. A backend would add latency (round-tripping video data is expensive) and deployment risk with no corresponding benefit at this scope. Backend/persistence (score history, accounts, multiplayer) is explicitly deferred to the post-hackathon roadmap.

## Key Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Pose detection misfires under real lighting | Calibration step sets per-user thresholds; miss-tolerance buffer absorbs noise instead of instant-failing |
| Detection loop slows down render loop | Decouple the two loops; detection runs independently, render always targets 60fps |
| Recorded demo shows an unconvincing "too perfect" run | Deliberately capture a take with a real near-miss and recovery, not a flawless run |
