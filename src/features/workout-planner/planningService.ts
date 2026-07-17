import { randomUUID } from "node:crypto";
import {
  createFallbackAdventureBlueprint,
  createFallbackWorkoutPlan,
  challengeTemplateByMovement,
  resolveAdventureBlueprint,
  resolveWorkoutPlan,
  type AdventureBlueprint,
  type WorkoutPlan,
} from "@/contracts";
import type { WorkoutRequest } from "./planningSchemas";

export type PlanningResult = {
  source: "personalized" | "fallback";
  workout: WorkoutPlan;
  adventure: AdventureBlueprint;
  notice: string | null;
};

export type WorkoutPlannerAdapter = (request: WorkoutRequest) => Promise<unknown>;

const targetByLevel = {
  beginner: { multiplier: 1, difficulty: 1 as const },
  intermediate: { multiplier: 1.5, difficulty: 2 as const },
};

const standingDemoSequence = [
  { movement: "jumping-jack", target: 4, restSeconds: 10 },
  { movement: "squat", target: 5, restSeconds: 15 },
  { movement: "punch-left", target: 3, restSeconds: 5 },
  { movement: "punch-right", target: 3, restSeconds: 10 },
  { movement: "high-knees", target: 6, restSeconds: 15 },
  { movement: "jump", target: 3, restSeconds: 20 },
] as const;

export const deterministicWorkoutPlanner: WorkoutPlannerAdapter = async (request) => {
  const level = targetByLevel[request.fitnessLevel];
  const targetMultiplier = (request.durationMinutes / 10) * level.multiplier;
  const workoutId = randomUUID();

  return {
    schemaVersion: 1,
    id: workoutId,
    goal: request.goal,
    durationMinutes: request.durationMinutes,
    difficulty: request.goal === "mobility" ? 1 : level.difficulty,
    exercises: standingDemoSequence.map((exercise) => ({
      id: `${workoutId}-${exercise.movement}`,
      movement: exercise.movement,
      mode: "reps" as const,
      target: Math.max(1, Math.round(exercise.target * targetMultiplier)),
      restSeconds: exercise.restSeconds,
    })),
  } satisfies WorkoutPlan;
};

function compileAdventure(workout: WorkoutPlan): AdventureBlueprint {
  const blueprint = {
    schemaVersion: 1,
    id: randomUUID(),
    workoutPlanId: workout.id,
    theme: "volcano-escape",
    title: workout.goal === "strength" ? "Forge of Strength" : "Volcano Training Escape",
    segments: workout.exercises.map((exercise, index) => ({
      id: `${workout.id}-segment-${index + 1}`,
      exerciseId: exercise.id,
      challengeTemplate: challengeTemplateByMovement[exercise.movement],
      target: exercise.target,
      order: index + 1,
    })),
    rewards: { baseXp: 100 + workout.difficulty * 25 },
  } satisfies AdventureBlueprint;

  return resolveAdventureBlueprint(blueprint, workout).data;
}

function timeoutAfter(milliseconds: number): Promise<never> {
  return new Promise((_, reject) => {
    const timeout = setTimeout(() => reject(new Error("WORKOUT_PLANNER_TIMEOUT")), milliseconds);
    timeout.unref?.();
  });
}

export async function generatePlanningExperience(
  request: WorkoutRequest,
  adapter: WorkoutPlannerAdapter = deterministicWorkoutPlanner,
  timeoutMs = 4_000,
): Promise<PlanningResult> {
  try {
    const candidate = await Promise.race([adapter(request), timeoutAfter(timeoutMs)]);
    const workoutResolution = resolveWorkoutPlan(candidate);
    if (!workoutResolution.success) {
      const workout = workoutResolution.data;
      return {
        source: "fallback",
        workout,
        adventure: createFallbackAdventureBlueprint(workout),
        notice: workoutResolution.error.message,
      };
    }

    return {
      source: "personalized",
      workout: workoutResolution.data,
      adventure: compileAdventure(workoutResolution.data),
      notice: null,
    };
  } catch {
    const workout = createFallbackWorkoutPlan();
    return {
      source: "fallback",
      workout,
      adventure: createFallbackAdventureBlueprint(workout),
      notice: "Planning took too long, so a safe starter adventure is ready. You can retry anytime.",
    };
  }
}
