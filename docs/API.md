# API

This document describes application-owned HTTP boundaries. Payload schemas in `src/contracts/` and route-local request schemas are the executable source of truth.

## Generate Workout and Adventure

`POST /api/workout/generate`

Creates a validated workout and compatible adventure briefing. The current implementation uses a deterministic server-side planner; a future external AI provider must remain behind the same validated boundary.

Request body:

```json
{
  "goal": "strength",
  "durationMinutes": 15,
  "fitnessLevel": "beginner",
  "activityFrequency": "weekly",
  "movementLimitations": "Avoid high-impact jumping"
}
```

Successful responses contain the resolved workout plan, compatible adventure blueprint, validated plan rationale, and fallback/provider status consumed by the planning UI. The rationale provides intensity, concise user-facing reasons, and an exercise-to-phase mapping; it is not hidden chain-of-thought. Malformed or unsupported input returns HTTP 400 with actionable validation information. Provider rejection, policy violation, invalid output, or timeout regenerates through the same deterministic profile-aware rules rather than returning an unvalidated or generic mission.

Hackathon rules:

- Never expose provider credentials to the browser.
- Never advertise a movement until it exists in the executable registry with detection and gameplay verification.
- Clearly distinguish deterministic fallback from live-provider output in response metadata and UI treatment.
- Deterministic policy owns allowed movements, goal structure, stage count, ordering, targets, rest, intensity, and limitation exclusions. Provider output cannot override it.
