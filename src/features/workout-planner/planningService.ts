import { randomUUID } from "node:crypto";
import {
  challengeTemplateByMovement,
  resolveWorkoutPlan,
  type AdventureBlueprint,
  type WorkoutPlan,
} from "@/contracts";
import type { PlanRationale, WorkoutRequest } from "./planningSchemas";
import { createPlanRationale, isWorkoutPolicyCompliant, restSecondsFor, selectPlannedMovements, targetMultiplier } from "./planningPolicy";

export type PlanningResult = {
  source: "personalized" | "fallback";
  workout: WorkoutPlan;
  adventure: AdventureBlueprint;
  rationale: PlanRationale;
  notice: string | null;
};

export type WorkoutPlannerAdapter = (request: WorkoutRequest) => Promise<unknown>;

export const deterministicWorkoutPlanner: WorkoutPlannerAdapter = async (request) => {
  const workoutId = randomUUID();
  const multiplier = targetMultiplier(request);
  const selected = selectPlannedMovements(request);

  return {
    schemaVersion: 1,
    id: workoutId,
    goal: request.goal,
    durationMinutes: request.durationMinutes,
    difficulty: request.goal === "mobility" || request.activityFrequency === "rarely" ? 1 : request.fitnessLevel === "intermediate" ? 2 : 1,
    exercises: selected.map((exercise, index) => ({
      id: `${workoutId}-${index + 1}-${exercise.movement}`,
      movement: exercise.movement,
      mode: "reps" as const,
      target: Math.max(1, Math.round(exercise.baseTarget * multiplier)),
      restSeconds: restSecondsFor(request, exercise.movement),
    })),
  } satisfies WorkoutPlan;
};

function compileAdventure(workout: WorkoutPlan): AdventureBlueprint {
  const titleByGoal: Record<WorkoutPlan["goal"], string> = {
    general: "Volcano Training Escape",
    cardio: "Race the Eruption",
    strength: "Forge of Strength",
    mobility: "Flow Through the Fire",
  };
  const blueprint = {
    schemaVersion: 1,
    id: randomUUID(),
    workoutPlanId: workout.id,
    theme: "volcano-escape",
    title: titleByGoal[workout.goal],
    segments: workout.exercises.map((exercise, index) => ({
      id: `${workout.id}-segment-${index + 1}`,
      exerciseId: exercise.id,
      challengeTemplate: challengeTemplateByMovement[exercise.movement],
      target: exercise.target,
      order: index + 1,
    })),
    rewards: { baseXp: 100 + workout.difficulty * 25 },
  } satisfies AdventureBlueprint;

  return blueprint;
}

async function deterministicFallback(request: WorkoutRequest, notice: string): Promise<PlanningResult> {
  const workout = resolveWorkoutPlan(await deterministicWorkoutPlanner(request)).data;
  return {
    source: "fallback",
    workout,
    adventure: compileAdventure(workout),
    rationale: createPlanRationale(request, workout),
    notice,
  };
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
    if (!workoutResolution.success || !isWorkoutPolicyCompliant(request, workoutResolution.data)) {
      return deterministicFallback(request, "The proposed plan did not pass workout safety rules, so a profile-aware plan is ready instead.");
    }

    return {
      source: "personalized",
      workout: workoutResolution.data,
      adventure: compileAdventure(workoutResolution.data),
      rationale: createPlanRationale(request, workoutResolution.data),
      notice: null,
    };
  } catch {
    return deterministicFallback(request, "Planning took too long, so a profile-aware adventure is ready. You can retry anytime.");
  }
}
