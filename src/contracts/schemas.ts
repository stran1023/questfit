import { z } from "zod";
import {
  challengeTemplateByMovement,
  supportedChallengeTemplates,
  supportedMovements,
} from "./movements";

const idSchema = z.string().trim().min(1).max(80);
const movementSchema = z.enum(supportedMovements);

const workoutExerciseSchema = z
  .strictObject({
    id: idSchema,
    movement: movementSchema,
    mode: z.enum(["reps", "hold"]),
    target: z.number().int().positive().max(300),
    restSeconds: z.number().int().min(0).max(180).optional(),
  })
  .superRefine((exercise, context) => {
    if (exercise.mode === "reps" && exercise.target > 100) {
      context.addIssue({
        code: "custom",
        path: ["target"],
        message: "Rep targets cannot exceed 100.",
      });
    }
  });

export const workoutPlanSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    id: idSchema,
    goal: z.enum(["cardio", "strength", "mobility", "general"]),
    durationMinutes: z.number().int().min(5).max(60),
    difficulty: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
    ]),
    exercises: z.array(workoutExerciseSchema).min(1).max(12),
  })
  .superRefine((plan, context) => {
    const ids = new Set<string>();
    for (const [index, exercise] of plan.exercises.entries()) {
      if (ids.has(exercise.id)) {
        context.addIssue({
          code: "custom",
          path: ["exercises", index, "id"],
          message: `Duplicate exercise id: ${exercise.id}`,
        });
      }
      ids.add(exercise.id);
    }
  });

const adventureSegmentSchema = z.strictObject({
  id: idSchema,
  exerciseId: idSchema,
  challengeTemplate: z.enum(supportedChallengeTemplates),
  target: z.number().int().positive().max(300),
  order: z.number().int().positive().max(12),
});

export const adventureBlueprintSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    id: idSchema,
    workoutPlanId: idSchema,
    theme: z.literal("volcano-escape"),
    title: z.string().trim().min(1).max(80),
    segments: z.array(adventureSegmentSchema).min(1).max(12),
    rewards: z.strictObject({ baseXp: z.number().int().min(0).max(10_000) }),
  })
  .superRefine((blueprint, context) => {
    const ids = new Set<string>();
    const orders = new Set<number>();

    for (const [index, segment] of blueprint.segments.entries()) {
      if (ids.has(segment.id)) {
        context.addIssue({
          code: "custom",
          path: ["segments", index, "id"],
          message: `Duplicate segment id: ${segment.id}`,
        });
      }
      if (orders.has(segment.order)) {
        context.addIssue({
          code: "custom",
          path: ["segments", index, "order"],
          message: `Duplicate segment order: ${segment.order}`,
        });
      }
      ids.add(segment.id);
      orders.add(segment.order);
    }

    const sortedOrders = [...orders].sort((left, right) => left - right);
    sortedOrders.forEach((order, index) => {
      if (order !== index + 1) {
        context.addIssue({
          code: "custom",
          path: ["segments"],
          message: "Segment orders must be contiguous and start at 1.",
        });
      }
    });
  });

export const movementEventSchema = z.strictObject({
  movement: movementSchema,
  phase: z.enum(["started", "completed", "held", "released"]),
  confidence: z.number().finite().min(0).max(1),
  occurredAtMs: z.number().int().nonnegative().safe(),
});

export const sessionMetricsSchema = z
  .strictObject({
    plannedTargets: z.number().int().nonnegative(),
    completedTargets: z.number().int().nonnegative(),
    completionRate: z.number().finite().min(0).max(100),
    accuracy: z.number().finite().min(0).max(100),
    bestExercise: movementSchema.nullable(),
    focusExercise: movementSchema.nullable(),
    xpEarned: z.number().int().nonnegative().max(100_000),
  })
  .superRefine((metrics, context) => {
    if (metrics.completedTargets > metrics.plannedTargets) {
      context.addIssue({
        code: "custom",
        path: ["completedTargets"],
        message: "Completed targets cannot exceed planned targets.",
      });
    }
  });

export const recommendationSchema = z.strictObject({
  difficulty: z.enum(["decrease", "maintain", "increase"]),
  focusExercise: movementSchema.nullable(),
  reasonCode: z.enum([
    "LOW_COMPLETION",
    "STEADY_PROGRESS",
    "HIGH_MASTERY",
    "FOCUS_MOVEMENT",
  ]),
});

export const coachSummarySchema = z.strictObject({
  headline: z.string().trim().min(1).max(100),
  summary: z.string().trim().min(1).max(600),
  recommendation: z.string().trim().min(1).max(300),
});

export type WorkoutPlan = z.infer<typeof workoutPlanSchema>;
export type WorkoutExercise = WorkoutPlan["exercises"][number];
export type AdventureBlueprint = z.infer<typeof adventureBlueprintSchema>;
export type AdventureSegment = AdventureBlueprint["segments"][number];
export type MovementEvent = z.infer<typeof movementEventSchema>;
export type SessionMetrics = z.infer<typeof sessionMetricsSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type CoachSummary = z.infer<typeof coachSummarySchema>;

export function expectedChallengeTemplate(movement: WorkoutExercise["movement"]) {
  return challengeTemplateByMovement[movement];
}
