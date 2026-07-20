import { z } from "zod";
import { adventureBlueprintSchema, validateAdventureForWorkout, workoutPlanSchema } from "@/contracts";
import { planRationaleSchema, workoutRequestSchema } from "./planningSchemas";

export const planningRequestKey = "ai-fitness-escape:planning-request-v1";
export const planningResultKey = "ai-fitness-escape:planning-result-v1";

const planningResponseSchema = z.strictObject({
  source: z.enum(["personalized", "fallback"]),
  workout: workoutPlanSchema,
  adventure: adventureBlueprintSchema,
  rationale: planRationaleSchema,
  notice: z.string().nullable(),
});

export type PlanningResponse = z.infer<typeof planningResponseSchema>;

function loadJson(storage: Storage, key: string): unknown | null {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function savePlanningRequest(storage: Storage, input: unknown) {
  const request = workoutRequestSchema.parse(input);
  storage.setItem(planningRequestKey, JSON.stringify(request));
  storage.removeItem(planningResultKey);
  return request;
}

export function loadPlanningRequest(storage: Storage) {
  const parsed = workoutRequestSchema.safeParse(loadJson(storage, planningRequestKey));
  return parsed.success ? parsed.data : null;
}

export function parsePlanningResponse(input: unknown): PlanningResponse {
  const result = planningResponseSchema.parse(input);
  const adventure = validateAdventureForWorkout(result.adventure, result.workout);
  if (!adventure.success) throw new Error("The generated mission did not match the workout.");
  return result;
}

export function savePlanningResult(storage: Storage, input: unknown) {
  const result = parsePlanningResponse(input);
  storage.setItem(planningResultKey, JSON.stringify(result));
  return result;
}

export function loadPlanningResult(storage: Storage) {
  try {
    return parsePlanningResponse(loadJson(storage, planningResultKey));
  } catch {
    return null;
  }
}
