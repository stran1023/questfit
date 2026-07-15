# AI Fitness Escape

An AI-powered fitness game where your body becomes the controller. Perform real exercises (jump, squat) to help your character escape a monster in an endless runner.

Built for people who work out alone at home and lose motivation to repetitive routines — this turns reps into game input, so you exercise to survive instead of to finish a set.

## Status

Hackathon MVP in progress. See [`docs/AI_Fitness_Escape_Final_Summary.md`](docs/AI_Fitness_Escape_Final_Summary.md) for the full pitch and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the technical design.

## Category

Apps for your life (consumer health).

## Tech Stack

- Pose detection: MediaPipe Pose (client-side, in-browser)
- Rendering: HTML5 Canvas
- Framework: React + Vite
- Hosting: static (Vercel/Netlify/GitHub Pages)

## Getting Started

```bash
npm install
npm run dev
```

Open the local dev URL, allow camera access, and follow the on-screen calibration prompts (one jump, one squat) before the run starts.

## Project Structure

```
src/
├── pose/           # webcam capture, pose engine, movement classifier
├── calibration/     # calibration flow
├── game/             # game state, obstacles, collision, render engine
├── ui/                # React screens (calibration, game, game over)
└── assets/          # sprites, sounds
```

See `docs/ARCHITECTURE.md` for the full data-flow diagram and component breakdown.

## Exercises Supported (MVP)

| Exercise | Action |
|---|---|
| Jump | Jump over obstacle |
| Squat | Slide under obstacle |

Push-ups and additional exercises are planned post-hackathon (see roadmap in `docs/AI_Fitness_Escape_Final_Summary.md`).

## Build Tooling

This project is developed using Codex CLI (GPT-5.6) per hackathon rules.

## License

TBD
