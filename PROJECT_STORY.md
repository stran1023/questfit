# QuestFit — Your body. Your adventure.

## Elevator Pitch

**QuestFit turns personalized workouts into body-controlled fantasy adventures—where every move powers your quest.**

## Inspiration

Traditional home workouts can feel repetitive: watch an instructor, count repetitions, and try to stay motivated. Fitness games are more engaging, but they often rely on specialized hardware or offer the same routine to everyone.

We wanted to combine the personalization of an AI fitness coach with the excitement of an adventure game—using only a laptop and webcam.

That idea became **QuestFit**, a browser-based fitness experience where your workout is transformed into a fantasy mission and your body becomes the controller. Instead of simply completing squats, punches, or jumps, players overcome collapsing paths, dodge attacks, battle the Ash Titan, and escape through the Storm Gate.

## What It Does

QuestFit creates a personalized workout using the player's:

- Fitness goal
- Available time
- Experience level
- Activity frequency
- Movement considerations

The plan follows a deliberate progression:

**Warm-up → Build → Surge → Peak → Cooldown**

QuestFit then compiles the workout into a playable adventure. Each exercise becomes a game mechanic. For example:

- Squats stabilize collapsing lava steps.
- Punches attack the Ash Titan.
- Side reaches dodge incoming hazards.
- Jumps clear obstacles.
- Completed movements generate XP and mission progress.

A recurring AI trail guide named **Scout** welcomes the player, explains the planning process, provides short motivational cues, and celebrates mission completion.

All webcam processing happens locally on the player's device. Video frames and raw body landmarks are never uploaded.

## How We Built It

QuestFit is built as a single browser application using:

- **Next.js and React** for onboarding, planning, briefings, preparation, and results
- **TypeScript** for strongly typed application and domain logic
- **MediaPipe Tasks Vision** for on-device body landmark detection
- **Phaser** for the real-time fantasy mission
- **Zod** for validating workout plans, mission blueprints, and session data
- **Vitest and Playwright** for unit, component, and end-to-end testing

The experience is organized as a validated pipeline:

```text
Player profile
      ↓
Goal-aware workout policy
      ↓
Validated workout plan
      ↓
Movement-safe game blueprint
      ↓
On-device pose events
      ↓
Deterministic results
```

The workout policy determines safe movements, intensity, ordering, recovery, and repetition targets. Structured data is validated before it can become a mission.

During gameplay, MediaPipe detects body landmarks and movement-specific classifiers convert them into events such as a verified squat or left punch. Those events are sent to an authoritative mission controller, which calculates progress and rewards.

Phaser receives snapshots from that controller and renders the corresponding attacks, hazards, effects, and boss reactions. This separation ensures that animations cannot accidentally award repetitions or modify the score.

Session metrics are deterministic. For example, completion is calculated as:

$$
\text{Completion Rate} =
\frac{\text{Verified Work}}{\text{Target Work}} \times 100
$$

AI-generated language may explain or summarize those facts, but it cannot change them. Invalid or unavailable AI output falls back to validated, deterministic content so the mission remains playable during a live demonstration.

## Challenges We Faced

### Reliable movement recognition

Human movement is noisy. Camera angle, lighting, distance, body proportions, and partial visibility can all affect pose detection.

We addressed this with touch-free personal calibration, confidence checks, neutral-position rearming, temporal filtering, and separate detector families for standing, directional, and floor exercises.

### Connecting exercise to gameplay

It was easy to make a game that merely counted repetitions. It was much harder to make each movement feel meaningful.

We created a shared movement and encounter registry so the planner, briefing, voice guidance, mission interface, and Phaser world use the same vocabulary. A punch shown in the workout plan becomes an actual attack during the boss battle rather than a disconnected counter.

### Keeping AI safe and explainable

Generated plans cannot be trusted blindly—especially when movement considerations are involved.

We built a deterministic policy layer that controls exercise eligibility, stage order, intensity, and targets. AI output is treated as untrusted data and must pass schema and policy validation. The Adventure Briefing also shows users how their profile influenced the mission without exposing hidden reasoning.

### Maintaining real-time performance

Pose inference, React updates, game rendering, audio, and voice guidance all run during the same session.

We kept these systems independent: MediaPipe owns inference, Phaser owns rendering, React owns navigation and accessible controls, and the mission controller owns gameplay facts. Raw pose frames are never pushed through global React state.

### Designing for users standing away from the screen

Players cannot constantly return to the keyboard during a workout. We introduced automatic framing checks, spoken instructions, a large countdown, distance-readable objectives, concise coaching, and automatic navigation to results.

## What We Learned

We learned that combining AI, computer vision, and games requires clear boundaries more than clever prompts.

The most important lessons were:

- AI should personalize and explain, but deterministic logic should own safety and scoring.
- Pose detection alone is not enough; stable movement recognition requires calibration and temporal state.
- Game feedback must be tied directly to verified physical actions.
- A strong fallback experience is essential for dependable live demonstrations.
- Privacy is easier to protect when local processing is an architectural rule from the beginning.
- Fitness interfaces must remain understandable from several feet away, not only when viewed like a conventional website.

We also learned how much visual storytelling matters. Adding Scout, the route map, the Ash Titan, movement-specific encounters, adaptive audio, and a clear adventure arc made the experience feel like a journey rather than a workout form connected to a game.

## What's Next

Our next steps include:

- Adding secure accounts and synchronized progress
- Introducing session history, streaks, and leaderboards
- Connecting optional external AI providers behind the existing validation boundary
- Creating additional worlds, bosses, and adventure themes
- Expanding device and browser support
- Improving recognition through broader real-world movement testing
- Adding cooperative challenges and community events

Our long-term vision is for QuestFit to become a platform where every workout can become a new adventure—personalized to the player, controlled by movement, and accessible from almost anywhere.
