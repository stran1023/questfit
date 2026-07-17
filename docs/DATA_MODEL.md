# Data Model and Contracts

This document defines semantic contracts. Executable Zod schemas in `src/contracts/` become the runtime source of truth as they are implemented; TypeScript types must be inferred from those schemas rather than duplicated by hand.

## Core Contracts

```ts
type WorkoutPlan = {
  schemaVersion: 1
  id: string
  goal: 'cardio' | 'strength' | 'mobility' | 'general'
  durationMinutes: number
  difficulty: 1 | 2 | 3 | 4 | 5
  exercises: Array<{
    id: string
    movement: string
    mode: 'reps' | 'hold'
    target: number
    restSeconds?: number
  }>
}

type AdventureBlueprint = {
  schemaVersion: 1
  id: string
  workoutPlanId: string
  theme: string
  title: string
  segments: Array<{
    id: string
    exerciseId: string
    challengeTemplate: string
    target: number
    order: number
  }>
  rewards: { baseXp: number }
}

type MovementEvent = {
  movement: string
  phase: 'started' | 'completed' | 'held' | 'released'
  confidence: number
  occurredAtMs: number
}

type SessionMetrics = {
  plannedTargets: number
  completedTargets: number
  completionRate: number
  accuracy: number
  bestExercise: string | null
  focusExercise: string | null
  xpEarned: number
}

type Recommendation = {
  difficulty: 'decrease' | 'maintain' | 'increase'
  focusExercise: string | null
  reasonCode: string
}

type CoachSummary = {
  headline: string
  summary: string
  recommendation: string
}
```

## Contract Rules

- Validate every AI and network response at its boundary.
- Reject unknown movement identifiers unless the active plan explicitly registers them with detection and gameplay support.
- Clamp numeric ranges and reject NaN, infinity, negative durations, duplicate IDs, missing exercise references, and impossible segment ordering.
- Store timestamps in UTC and render them in the user's locale.
- Coach prompts receive only necessary structured facts; coach output cannot overwrite metrics or recommendations.
- Version persisted workout and blueprint payloads before their shapes become externally durable.
- The executable source of truth is `src/contracts/schemas.ts`; exported TypeScript types use `z.infer` and are never maintained as a parallel declaration.
- MVP movement identifiers are `squat`, `jump`, `lunge`, `jumping-jack`, `high-knees`, `push-up`, `plank`, `punch-left`, `punch-right`, `side-reach-left`, and `side-reach-right`. Squat and jump are the first migrated registry entries, not the library limit.
- Direction is explicit in identifiers when it affects counting or gameplay. Do not infer left/right punch or reach from an untyped label.
- Each movement registry entry declares mode, detector family, calibration requirements, minimum landmark visibility, neutral/rearm rules, confidence policy, and compatible gameplay templates.
- Generated workout or blueprint validation failures return deterministic safe fallback content plus retryable, path-specific issues.

## Persistence Model

| Table | Purpose | Key fields |
| --- | --- | --- |
| `profiles` | user onboarding and public-facing progress | `id` (auth user), `display_name`, `height_cm`, `weight_kg`, `activity_frequency`, `fitness_level`, `goal`, `movement_limitations`, `level`, `xp`, `current_streak`, `longest_streak` |
| `calibration_profiles` | versioned derived movement thresholds; never camera data | `id`, `profile_id`, `schema_version`, `pose_model_version`, `movement`, `thresholds_json`, `quality_score`, `calibrated_at`, `invalidated_at` |
| `workout_plans` | validated generated plans | `id`, `profile_id`, `schema_version`, `goal`, `difficulty`, `duration_minutes`, `plan_json`, timestamps |
| `workout_sessions` | authoritative completed-session facts | `id`, `profile_id`, `workout_plan_id`, `blueprint_json`, `duration_seconds`, `completion_rate`, `accuracy`, `xp_earned`, timestamps |
| `coach_summaries` | derived language tied to facts | `id`, `profile_id`, `session_id`, `recommendation_json`, `summary_json`, timestamps |

Weekly leaderboard views derive from session/profile data; do not create a second mutable score source without an explicit design decision. Guest profile and calibration thresholds remain local and are migrated through an idempotent, validated conversion flow after sign-in.

## Hackathon Persistence Policy

- Guest/local storage is sufficient for the no-credential demo path and owns fitness profile, derived calibration, generated plan/blueprint, and latest completed-session summary.
- Supabase is required only for claims about real sign-in, cross-device persistence, protected history, streaks, or leaderboard behavior.
- Local and remote records use the same versioned schemas so guest conversion does not require a second data model.
- Seed/demo data must be labeled and must never be mixed into authoritative XP, streak, or leaderboard calculations.

## Authorization and Privacy

Enable RLS on every user-owned table. A user may select and mutate only rows whose `profile_id` matches `auth.uid()`; profile creation must also bind to that identity. Public leaderboard access exposes only the minimal approved projection. Calibration persistence contains derived thresholds and compatibility metadata only. Never persist webcam frames, images, raw landmarks, calibration samples, provider prompts containing personal data, or secrets.
