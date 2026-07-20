import { z } from "zod";
import { activityFrequencySchema, fitnessGoalSchema, fitnessLevelSchema } from "@/features/identity/profileSchema";

export const workoutRequestSchema = z.strictObject({
  goal: fitnessGoalSchema,
  durationMinutes: z.union([z.literal(10), z.literal(15), z.literal(20)]),
  fitnessLevel: fitnessLevelSchema,
  activityFrequency: activityFrequencySchema,
  movementLimitations: z.string().trim().max(300),
});

export type WorkoutRequest = z.infer<typeof workoutRequestSchema>;

export const workoutPhaseSchema = z.enum(["warm-up", "build", "surge", "peak"]);

export const cooldownPlanSchema = z.strictObject({
  durationSeconds: z.number().int().min(10).max(90),
  steps: z.array(z.string().trim().min(1).max(80)).length(3),
});

export const planRationaleSchema = z.strictObject({
  summary: z.string().trim().min(1).max(240),
  intensity: z.enum(["gentle", "moderate", "challenging"]),
  reasons: z.array(z.string().trim().min(1).max(180)).min(2).max(6),
  phases: z.array(z.strictObject({
    exerciseId: z.string().trim().min(1).max(80),
    phase: workoutPhaseSchema,
  })).min(5).max(7),
  cooldown: cooldownPlanSchema,
});

export type PlanRationale = z.infer<typeof planRationaleSchema>;
export type CooldownPlan = z.infer<typeof cooldownPlanSchema>;
