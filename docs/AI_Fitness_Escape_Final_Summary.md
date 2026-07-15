# AI Fitness Escape

*Hackathon MVP — Final Idea Summary*

## One-Line Pitch

An AI-powered fitness game where your body becomes the controller. Perform real exercises to help your character escape a monster in an endless runner.

---

## Problem

People who work out alone at home often lose motivation because workouts feel repetitive and boring. Existing fitness apps mostly count reps, track calories, or play workout videos — they rarely make exercising fun enough to sustain engagement.

## Solution

Turn home workouts into a game. The player stands in front of a webcam while AI detects body poses in real time. Each exercise controls an in-game action in a Temple Run–style endless runner. Instead of exercising to finish a routine, the player exercises to survive.

## Final MVP Scope

Scoped down to one polished gameplay loop using two exercises, chosen for reliable pose detection and demo-readiness:

| Exercise | Detection Signal | In-Game Action |
|---|---|---|
| Jump | Rapid upward hip displacement, returns to baseline | Character jumps over obstacle |
| Squat | Hip-to-knee vertical distance drops below calibrated threshold | Character slides under obstacle |

Push-ups and wall-climbs were considered and cut from MVP scope — torso angle during push-ups is unreliable for webcam pose tracking, and climb mechanics need sustained multi-frame tracking rather than a single clear motion trigger. Both are noted as future roadmap items.

## Gameplay Loop

- Open game
- Calibration: stand in frame, perform one jump and one squat to set personal detection thresholds
- Endless runner starts — constant speed initially, gradually increasing
- Player performs jump/squat to clear obstacles
- Miss tolerance: a few missed obstacles narrow the gap before the monster catches the player (not an instant fail) — this keeps the loop forgiving of detection noise and demonstrates real stakes
- Monster catches player after repeated misses → game over, score shown
- Play again

## AI Component

Real-time pose estimation detects exercises and triggers character actions instantly. Candidate technologies: MediaPipe Pose or TensorFlow MoveNet, both able to run client-side in-browser for low latency without a backend dependency.

## Demo Format

This is an online hackathon: the submission is a recorded happy-path demo video, not a live demo. This relaxes some robustness requirements (lighting, edge-case recovery) but the recording should still show a genuine near-miss and recovery moment, not a flawless run, so the mechanic reads as real rather than pre-scripted.

## Build Tooling

Development uses Codex CLI (OpenAI) as required by the hackathon rules, with GPT-5.6 models: Terra as the default driver for general build work, Sol for the harder pose-detection and calibration logic.

## Why This Works for a Hackathon

- Easy to understand within seconds
- Highly visual, memorable demo
- Clear, legible AI application
- Real-world problem: home workout motivation
- Achievable within a short development timeline

## Future Roadmap (Post-Hackathon)

- Push-up and additional exercise support
- AI posture feedback
- Adaptive difficulty based on fatigue
- Multiple maps and themes, boss battles
- Multiplayer mode, daily challenges, progression system
- Personalized workout plans, AI-generated levels
