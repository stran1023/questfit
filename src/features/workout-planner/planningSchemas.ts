import { z } from "zod";

export const workoutRequestSchema = z.strictObject({
  goal: z.enum(["cardio", "strength", "mobility", "general"]),
  durationMinutes: z.union([z.literal(10), z.literal(15), z.literal(20)]),
  fitnessLevel: z.enum(["beginner", "intermediate"]),
});

export type WorkoutRequest = z.infer<typeof workoutRequestSchema>;
