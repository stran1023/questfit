import { describe, expect, it } from "vitest";
import { adventureBlueprintSchema, validateAdventureForWorkout, workoutPlanSchema } from "@/contracts";
import { workoutRequestSchema } from "./planningSchemas";
import { deterministicWorkoutPlanner, generatePlanningExperience } from "./planningService";

const request = workoutRequestSchema.parse({
  goal: "strength",
  durationMinutes: 15,
  fitnessLevel: "beginner",
});

describe("planning service", () => {
  it("creates a personalized, contract-valid workout and adventure", async () => {
    const result = await generatePlanningExperience(request);
    expect(result.source).toBe("personalized");
    expect(workoutPlanSchema.safeParse(result.workout).success).toBe(true);
    expect(adventureBlueprintSchema.safeParse(result.adventure).success).toBe(true);
    expect(validateAdventureForWorkout(result.adventure, result.workout).success).toBe(true);
    expect(result.workout.durationMinutes).toBe(15);
    expect(result.workout.exercises.map((exercise) => exercise.movement)).toEqual([
      "jumping-jack",
      "squat",
      "punch-left",
      "punch-right",
      "high-knees",
      "jump",
    ]);
    expect(result.adventure.segments.map((segment) => segment.challengeTemplate)).toEqual([
      "energy-beacon",
      "stone-gate",
      "left-crystal",
      "right-crystal",
      "ember-sprint",
      "broken-platforms",
    ]);
  });

  it("scales targets for level and duration", async () => {
    const beginner = await deterministicWorkoutPlanner(request);
    const intermediate = await deterministicWorkoutPlanner({
      ...request,
      durationMinutes: 20,
      fitnessLevel: "intermediate",
    });
    const firstTarget = workoutPlanSchema.parse(beginner).exercises[0].target;
    const secondTarget = workoutPlanSchema.parse(intermediate).exercises[0].target;
    expect(secondTarget).toBeGreaterThan(firstTarget);
  });

  it("falls back when an adapter returns invalid output", async () => {
    const result = await generatePlanningExperience(request, async () => ({ exercises: "invalid" }));
    expect(result.source).toBe("fallback");
    expect(result.notice).toContain("safe starter workout");
    expect(validateAdventureForWorkout(result.adventure, result.workout).success).toBe(true);
    expect(result.workout.exercises).toHaveLength(6);
  });

  it("falls back when an adapter rejects", async () => {
    const result = await generatePlanningExperience(request, async () => {
      throw new Error("provider unavailable");
    });
    expect(result.source).toBe("fallback");
    expect(result.notice).toContain("retry");
  });

  it("falls back when an adapter times out", async () => {
    const result = await generatePlanningExperience(
      request,
      () => new Promise(() => undefined),
      5,
    );
    expect(result.source).toBe("fallback");
    expect(result.notice).toContain("took too long");
  });
});
