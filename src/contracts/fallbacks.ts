import { challengeTemplateByMovement } from "./movements";
import type { AdventureBlueprint, WorkoutPlan } from "./schemas";

export function createFallbackWorkoutPlan(id = "fallback-workout-v1"): WorkoutPlan {
  return {
    schemaVersion: 1,
    id,
    goal: "general",
    durationMinutes: 10,
    difficulty: 1,
    exercises: [
      { id: "fallback-jumping-jacks", movement: "jumping-jack", mode: "reps", target: 4, restSeconds: 10 },
      { id: "fallback-squats", movement: "squat", mode: "reps", target: 5, restSeconds: 15 },
      { id: "fallback-left-punches", movement: "punch-left", mode: "reps", target: 3, restSeconds: 5 },
      { id: "fallback-right-punches", movement: "punch-right", mode: "reps", target: 3, restSeconds: 10 },
      { id: "fallback-high-knees", movement: "high-knees", mode: "reps", target: 6, restSeconds: 15 },
      { id: "fallback-jumps", movement: "jump", mode: "reps", target: 3, restSeconds: 20 },
    ],
  };
}

export function createFallbackAdventureBlueprint(
  workout: WorkoutPlan,
  id = "fallback-adventure-v1",
): AdventureBlueprint {
  return {
    schemaVersion: 1,
    id,
    workoutPlanId: workout.id,
    theme: "volcano-escape",
    title: "Volcano Training Escape",
    segments: workout.exercises.map((exercise, index) => ({
      id: `fallback-segment-${index + 1}`,
      exerciseId: exercise.id,
      challengeTemplate: challengeTemplateByMovement[exercise.movement],
      target: exercise.target,
      order: index + 1,
    })),
    rewards: { baseXp: 100 },
  };
}
