import { z } from "zod";

export const activityFrequencySchema = z.enum(["rarely", "weekly", "regular", "frequent"]);
export const fitnessLevelSchema = z.enum(["beginner", "intermediate"]);
export const fitnessGoalSchema = z.enum(["general", "cardio", "strength", "mobility"]);

export const fitnessProfileSchema = z
  .object({
    schemaVersion: z.literal(1),
    guestId: z.string().min(8).max(100),
    heightCm: z.number().int().min(100).max(230),
    weightKg: z.number().min(30).max(300),
    activityFrequency: activityFrequencySchema,
    fitnessLevel: fitnessLevelSchema,
    goal: fitnessGoalSchema,
    movementLimitations: z.string().trim().max(300),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type FitnessProfile = z.infer<typeof fitnessProfileSchema>;
export type FitnessProfileInput = Omit<FitnessProfile, "schemaVersion" | "guestId" | "updatedAt">;

export const defaultFitnessProfileInput: FitnessProfileInput = {
  heightCm: 170,
  weightKg: 65,
  activityFrequency: "weekly",
  fitnessLevel: "beginner",
  goal: "general",
  movementLimitations: "",
};
