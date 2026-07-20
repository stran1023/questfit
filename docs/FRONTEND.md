# Frontend

## Experience Principles

- AI first: make planning and coaching legible.
- Adventure first: frame the workout as a mission, not a form.
- Movement first: instructions and feedback must be readable from several feet away.
- Minimal gameplay HUD: show only the current objective, progress, combo/XP, and danger or recovery state.
- Reward progress without obscuring exercise safety or incoming challenges.
- Use one recurring Trail Guide with brief context-aware dialogue; the guide adds personality but never duplicates long instructions or authoritative facts.

## Canonical Screens

| Screen | Required states and outcome |
| --- | --- |
| Home | guest/sign-in entry, level/XP/streak for returning users, generate-adventure CTA |
| Welcome and authentication | product promise, sign up, sign in, guest continuation, authentication error/retry |
| Profile onboarding | height, weight, activity frequency, goal, fitness level, optional movement limitations, validation and privacy explanation |
| Workout generator | goal, time, fitness level, activity frequency, movement considerations; validated handoff to generation |
| AI to Action | animated build progress, changing status, provider/fallback honesty, error/retry, automatic briefing transition |
| Adventure briefing | ten-second scan of title, duration, difficulty, movement count, checkpoints, reward, compact route, optional technical/exercise detail, one Start Adventure CTA |
| Movement setup | camera permission, automatic standing/floor readiness, safety notice, distance-readable prompts, audiovisual countdown, automatic per-family sampling, correction/retry, completion |
| Gameplay | mirrored pose panel with live landmark skeleton, Phaser mission, current objective and progress, spoken/visible coaching, tracking recovery |
| Mission complete | completion, accuracy, XP, rewards, continue |
| AI coach | fact-grounded strengths, focus, recommendation, next-adventure CTA |
| Leaderboard | weekly ranking with loading, empty, error, and signed-out treatment |
| Profile | level, XP, streak, completed adventures, accuracy, history |

## Gameplay Layout

Use an approximately 35/65 pose/game split on landscape desktop. Stack the pose panel above the game on narrow or portrait viewports. Preserve the game canvas aspect ratio and keep camera framing usable; if the viewport is unsuitable, explain how to rotate or increase distance.

React renders the surrounding shell and coarse read-only snapshots. Phaser renders the world. Landmarks use an overlay canvas; never create React elements or global-state updates per landmark frame.

During a mission, the pose panel draws a mirrored on-device skeleton over the camera preview so the player can confirm what tracking sees. The assistant speaks the current objective, progress, framing corrections, pauses, and completion using the same authoritative mission snapshot shown on screen. Voice starts enabled, has a keyboard-accessible on/off control, and visible instructions remain available at all times.

The Volcano Escape world uses a project-owned illustrated volcanic valley, lava bridge, cyan escape portal, and fitness-hero runner. Each supported movement has one canonical encounter name shared by the briefing, React HUD, assistant voice, and Phaser scene. Repeated movement sets add a visible and spoken stage number so the world advances instead of presenting the same obstacle twice. The encounter and short action cue remain recognizable from several feet away.

For the judged guest route, the briefing presents six standing objectives in a stable order: jumping jack, squat, left punch, right punch, high knees, and jump. This keeps the camera setup consistent while alternating cardio, lower-body, and directional actions.

The briefing labels each scored exercise by an increasing workout phase—warm-up, build, surge, or peak—and includes a compact **Why this plan** panel with intensity and observable policy reasons. After peak completion, show a short validated three-step guided cooldown with camera scoring paused and an honest finish-early action. Do not show raw blueprint template IDs as user-facing encounter promises. Goal-aware plans remain five to seven stages and use goal-specific replacements when a recognized limitation excludes an exercise.

Successful movement events produce immediate XP/ring feedback; every third combo produces a larger surge. Misses show a short recovery warning. Objective changes replace the encounter without changing mission authority, and completion clears transient hazards before revealing the escape portal and results-ready celebration. In-world objective, mission state, runner position, combo, XP, and progress still mirror the authoritative React snapshot.

The cinematic layer makes body input visibly control the hero. Jumps leap, squats duck, lunges stride, high knees sprint, jumping jacks power up, punches strike directionally, reaches lean directionally, push-ups drive low, and planks raise a shield. Credited actions recoil the current hazard before the next one approaches. Ember drift, lava glow, and the `VOLCANO STIRS` → `ERUPTION RISING` → `PORTAL IN SIGHT` arc add urgency; reduced motion replaces travel and shake with direct opacity feedback. The finale performs the last action, raises the eruption, and pulls the hero through the portal before automatic results navigation.

The final third introduces the Ash Titan. The briefing previews Enter → Awaken → Battle → Recover; the scene maps punch/cardio moves to direct strikes and jump/squat/lunge/reach/plank moves to dodge or block telegraphs. Boss health is derived from authoritative mission progress, reaches zero only after mission completion, and cannot affect scoring.

The mission attempts to start **Music + effects** automatically with a short fade-in. If browser or device policy keeps audio suspended, the control says **Play music** and remains the explicit recovery gesture. The theme moves through calm, rising, and escape arrangements at the same progress boundaries as the visible tension arc, pauses with the mission, and fades out on disable/results. Voice remains independently enabled and louder/clearer than the music bus.

Preparation includes a presenter preflight card for camera/model startup, full-body framing, movement setup compatibility, assistant voice availability, and validated mission stages. It reports truthful checking, ready, and attention states but adds no launch button: stable tracking still starts the countdown automatically. During play, voice announces the encounter, set stage, target, and movement instruction; larger sets suppress low-value per-repetition chatter and emphasize halfway plus the final three repetitions.

Results use only saved mission facts. After mission completion, the escape celebration and spoken completion cue remain visible for 2.6 seconds, then the application automatically replaces the mission with the results screen; no touch is required. The finale prioritizes completion, recognized-target accuracy, XP, strongest movement, the bounded next-session recommendation, replay of the current adventure, and creation of a new plan. It explicitly avoids medical or health scoring.

Voice and procedural action sound have independent accessible on/off controls. Voice starts enabled; action sound starts off because browsers require a player gesture, and can be enabled once before the player steps away from the laptop. Sound cues distinguish ordinary success, combo, objective transition, miss, and completion, and release their browser audio resources when the mission exits. Pausing places a high-contrast veil over the world. The canvas preserves a 16:9 aspect ratio; reduced motion removes camera shake, moving sparks, pulsing, and large transitions while preserving readable state feedback.

## Visual System

The application shell uses deep navy `#0F172A`, slate `#1E293B`, blue `#3B82F6`, emerald `#10B981`, gold `#F59E0B`, red `#EF4444`, white `#F8FAFC`, and muted slate `#94A3B8`. Mission themes may vary the environment palette while navigation, feedback semantics, typography, spacing, and controls remain consistent.

Start with shared primitives only when reused or independently behavioral: navigation, buttons, fields, status messages, progress cards, adventure cards, pose panel, objective card, HUD, reward summary, statistics, and leaderboard rows.

## Interaction and Accessibility

- Provide loading, empty, success, error, retry, and offline/degraded states for every remote operation.
- Use semantic structure, visible focus, keyboard-accessible controls, live regions for camera/status errors, and text/icon meaning in addition to color.
- Use at least 44 × 44 CSS-pixel targets for primary controls.
- Respect `prefers-reduced-motion`; remove strong shake, flashing, motion trails, and nonessential celebration.
- Keep safety and framing reminders concise and visible before calibration.
- Once camera setup starts, calibration must be hands-free. Do not require lock-framing or capture buttons; use stable-body readiness, countdowns, automatic sampling, and large status feedback readable from several feet away.
- Pair spoken/audio cues with visible text and status semantics. Audio is an enhancement, never the only instruction.
- Group onboarding into short standing and floor setup stages. Explain camera repositioning before push-up/plank, automatically confirm the required view, and preserve completed standing calibration if floor setup needs retrying.
- Do not let animations delay state changes or cover the next objective.

## Frontend Verification

Critical flows require Playwright coverage plus browser evidence at desktop and narrow viewports. Verify denied camera access, invalid AI output/fallback, signed-out save behavior, keyboard navigation, reduced motion, canvas sizing, and that pose/game loops do not cause per-frame React renders.

## Hackathon Demo Presentation

- Provide a single obvious path from welcome to profile, movement setup, adventure briefing, gameplay, results, and replay.
- Present `/prepare` as a cinematic hands-free launch: open the camera automatically, confirm stable full-body framing, reuse compatible thresholds, speak and display `3 · 2 · 1`, then enter the mission without another button. Show calibration steps only when recording is genuinely required.
- Render launch numbers one at a time as a full camera-stage overlay with high-contrast scale, energy rings, progress marks, and a distinct gold `GO!` payoff. Reduced motion removes the scale/ring animation while preserving timing, color, speech, and readable state changes.
- Show whether planning, coaching, and persistence are live-provider or fallback/local modes without exposing technical noise to the player.
- Preflight camera availability and viewport suitability before the judged mission begins.
- Keep primary navigation focused on the single guest product journey.
- Avoid demo-only buttons that bypass calibration, movement validation, mission progress, or result calculation.
