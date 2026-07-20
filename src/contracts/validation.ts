import type { ZodIssue } from "zod";
import { createFallbackAdventureBlueprint, createFallbackWorkoutPlan } from "./fallbacks";
import {
  adventureBlueprintSchema,
  expectedChallengeTemplate,
  workoutPlanSchema,
  type AdventureBlueprint,
  type WorkoutPlan,
} from "./schemas";

export type ContractIssue = {
  path: string;
  message: string;
};

export type ContractFailure = {
  code: "INVALID_WORKOUT_PLAN" | "INVALID_ADVENTURE_BLUEPRINT";
  message: string;
  retryable: true;
  issues: ContractIssue[];
};

export type Resolution<T> =
  | { success: true; source: "generated"; data: T }
  | { success: false; source: "fallback"; data: T; error: ContractFailure };

function formatIssues(issues: ZodIssue[]): ContractIssue[] {
  return issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
}

export function resolveWorkoutPlan(input: unknown): Resolution<WorkoutPlan> {
  const parsed = workoutPlanSchema.safeParse(input);
  if (parsed.success) return { success: true, source: "generated", data: parsed.data };

  return {
    success: false,
    source: "fallback",
    data: createFallbackWorkoutPlan(),
    error: {
      code: "INVALID_WORKOUT_PLAN",
      message: "We could not use that workout, so a safe starter workout is ready instead.",
      retryable: true,
      issues: formatIssues(parsed.error.issues),
    },
  };
}

export function validateAdventureForWorkout(
  input: unknown,
  workout: WorkoutPlan,
): { success: true; data: AdventureBlueprint } | { success: false; issues: ContractIssue[] } {
  const parsed = adventureBlueprintSchema.safeParse(input);
  if (!parsed.success) return { success: false, issues: formatIssues(parsed.error.issues) };

  const blueprint = parsed.data;
  const issues: ContractIssue[] = [];
  const exercises = new Map(workout.exercises.map((exercise) => [exercise.id, exercise]));
  const referencedExercises = new Set<string>();

  if (blueprint.workoutPlanId !== workout.id) {
    issues.push({ path: "workoutPlanId", message: "Blueprint references a different workout plan." });
  }

  for (const [index, segment] of blueprint.segments.entries()) {
    const exercise = exercises.get(segment.exerciseId);
    if (!exercise) {
      issues.push({
        path: `segments.${index}.exerciseId`,
        message: `Unknown exercise reference: ${segment.exerciseId}`,
      });
      continue;
    }

    if (referencedExercises.has(exercise.id)) {
      issues.push({
        path: `segments.${index}.exerciseId`,
        message: `Exercise is mapped more than once: ${exercise.id}`,
      });
    }
    referencedExercises.add(exercise.id);

    if (segment.target !== exercise.target) {
      issues.push({ path: `segments.${index}.target`, message: "Segment target must match the workout." });
    }
    if (segment.challengeTemplate !== expectedChallengeTemplate(exercise.movement)) {
      issues.push({
        path: `segments.${index}.challengeTemplate`,
        message: `Challenge template does not support ${exercise.movement}.`,
      });
    }
  }

  for (const exercise of workout.exercises) {
    if (!referencedExercises.has(exercise.id)) {
      issues.push({ path: "segments", message: `Workout exercise is not mapped: ${exercise.id}` });
    }
  }

  return issues.length === 0 ? { success: true, data: blueprint } : { success: false, issues };
}

export function resolveAdventureBlueprint(
  input: unknown,
  workout: WorkoutPlan,
): Resolution<AdventureBlueprint> {
  const validated = validateAdventureForWorkout(input, workout);
  if (validated.success) return { success: true, source: "generated", data: validated.data };

  return {
    success: false,
    source: "fallback",
    data: createFallbackAdventureBlueprint(workout),
    error: {
      code: "INVALID_ADVENTURE_BLUEPRINT",
      message: "We could not build that adventure, so a safe mission is ready instead.",
      retryable: true,
      issues: validated.issues,
    },
  };
}
