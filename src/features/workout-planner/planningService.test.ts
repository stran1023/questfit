import { describe, expect, it } from "vitest";
import { adventureBlueprintSchema, validateAdventureForWorkout, workoutPlanSchema } from "@/contracts";
import { workoutRequestSchema } from "./planningSchemas";
import { deterministicWorkoutPlanner, generatePlanningExperience } from "./planningService";

const request = workoutRequestSchema.parse({
  goal: "strength",
  durationMinutes: 15,
  fitnessLevel: "beginner",
  activityFrequency: "weekly",
  movementLimitations: "",
});

describe("planning service", () => {
  it("creates a personalized, contract-valid workout and adventure", async () => {
    const result = await generatePlanningExperience(request);
    expect(result.source).toBe("personalized");
    expect(workoutPlanSchema.safeParse(result.workout).success).toBe(true);
    expect(adventureBlueprintSchema.safeParse(result.adventure).success).toBe(true);
    expect(validateAdventureForWorkout(result.adventure, result.workout).success).toBe(true);
    expect(result.workout.durationMinutes).toBe(15);
    expect(result.workout.exercises.map((exercise) => exercise.movement)).toEqual(["jumping-jack", "squat", "lunge", "squat", "lunge", "jump"]);
    expect(result.rationale.phases).toHaveLength(result.workout.exercises.length);
    expect(result.rationale.summary).toContain("strength");
  });

  it("keeps every standard lower-body strength duration focused on lower-body work", async () => {
    const expected = {
      10: ["jumping-jack", "squat", "lunge", "squat", "jump"],
      15: ["jumping-jack", "squat", "lunge", "squat", "lunge", "jump"],
      20: ["jumping-jack", "squat", "lunge", "squat", "lunge", "squat", "jump"],
    } as const;
    for (const durationMinutes of [10, 15, 20] as const) {
      const plan = await generatePlanningExperience({ ...request, durationMinutes });
      expect(plan.workout.exercises.map((exercise) => exercise.movement)).toEqual(expected[durationMinutes]);
      expect(plan.workout.exercises.some((exercise) => exercise.movement.startsWith("punch"))).toBe(false);
    }
  });

  it("builds distinct goal structures with five to seven ordered phases", async () => {
    const plans = await Promise.all((["general", "cardio", "strength", "mobility"] as const).map((goal) => generatePlanningExperience({ ...request, goal })));
    const signatures = plans.map((plan) => plan.workout.exercises.map((exercise) => exercise.movement).join(","));
    expect(new Set(signatures).size).toBe(4);
    expect(plans.every((plan) => plan.workout.exercises.length === 6)).toBe(true);
    expect(plans.every((plan) => plan.rationale.phases.at(0)?.phase === "warm-up" && plan.rationale.phases.at(-1)?.phase === "finish")).toBe(true);
    const highImpact = new Set(["jump", "jumping-jack", "high-knees"]);
    expect(plans.every((plan) => plan.workout.exercises.every((exercise, index, exercises) => index === 0 || !highImpact.has(exercise.movement) || !highImpact.has(exercises[index - 1].movement)))).toBe(true);
  });

  it("scales targets for level and duration", async () => {
    const beginner = await deterministicWorkoutPlanner(request);
    const intermediate = await deterministicWorkoutPlanner({
      ...request,
      durationMinutes: 20,
      fitnessLevel: "intermediate",
      activityFrequency: "frequent",
    });
    const firstTarget = workoutPlanSchema.parse(beginner).exercises[0].target;
    const secondTarget = workoutPlanSchema.parse(intermediate).exercises[0].target;
    expect(secondTarget).toBeGreaterThan(firstTarget);
  });

  it("uses duration for stage count and activity for bounded intensity", async () => {
    const short = await generatePlanningExperience({ ...request, durationMinutes: 10, activityFrequency: "rarely" });
    const long = await generatePlanningExperience({ ...request, durationMinutes: 20, activityFrequency: "frequent", fitnessLevel: "intermediate" });
    expect(short.workout.exercises).toHaveLength(5);
    expect(short.rationale.intensity).toBe("gentle");
    expect(long.workout.exercises).toHaveLength(7);
    expect(long.rationale.intensity).toBe("challenging");
    expect(long.workout.exercises[0].target).toBeGreaterThan(short.workout.exercises[0].target);
  });

  it("excludes movements that conflict with reported knee or shoulder concerns", async () => {
    const knee = await generatePlanningExperience({ ...request, goal: "cardio", movementLimitations: "Knee sensitivity; low impact and no jumping" });
    expect(knee.workout.exercises.every((exercise) => !["jump", "jumping-jack", "lunge"].includes(exercise.movement))).toBe(true);
    expect(knee.rationale.reasons.join(" ")).toMatch(/remove jumps/i);

    const mobilityKnee = await generatePlanningExperience({ ...request, goal: "mobility", durationMinutes: 20, movementLimitations: "Knee sensitivity; low impact" });
    expect(mobilityKnee.workout.exercises.at(-1)?.movement).toMatch(/side-reach/);

    const shoulder = await generatePlanningExperience({ ...request, goal: "mobility", movementLimitations: "Shoulder and wrist discomfort" });
    expect(shoulder.workout.exercises.every((exercise) => !["jumping-jack", "punch-left", "punch-right", "side-reach-left", "side-reach-right", "push-up", "plank"].includes(exercise.movement))).toBe(true);
    expect(shoulder.rationale.reasons.join(" ")).toMatch(/upper-body concerns/i);
  });

  it("falls back when an adapter returns invalid output", async () => {
    const result = await generatePlanningExperience(request, async () => ({ exercises: "invalid" }));
    expect(result.source).toBe("fallback");
    expect(result.notice).toContain("profile-aware");
    expect(validateAdventureForWorkout(result.adventure, result.workout).success).toBe(true);
    expect(result.workout.exercises).toHaveLength(6);
    expect(result.workout.goal).toBe("strength");
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
