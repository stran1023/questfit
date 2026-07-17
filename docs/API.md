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
  "fitnessLevel": "beginner"
}
```

Successful responses contain the resolved workout plan, compatible adventure blueprint, and fallback/provider status consumed by the planning UI. Malformed or unsupported input returns HTTP 400 with actionable validation information. Provider rejection, invalid output, or timeout resolves through deterministic safe content rather than returning an unvalidated mission.

Hackathon rules:

- Never expose provider credentials to the browser.
- Never advertise a movement until it exists in the executable registry with detection and gameplay verification.
- Clearly distinguish deterministic fallback from live-provider output in response metadata and UI treatment.
