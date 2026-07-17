import { describe, expect, it } from "vitest";
import {
  adventureBlueprintSchema,
  coachSummarySchema,
  movementEventSchema,
  recommendationSchema,
  resolveAdventureBlueprint,
  resolveWorkoutPlan,
  sessionMetricsSchema,
  validateAdventureForWorkout,
  validAdventureBlueprintFixture,
  validWorkoutPlanFixture,
  workoutPlanSchema,
} from "./index";

describe("workoutPlanSchema", () => {
  it("accepts a valid versioned workout", () => {
    expect(workoutPlanSchema.parse(validWorkoutPlanFixture)).toEqual(validWorkoutPlanFixture);
  });

  it("rejects malformed and unknown fields", () => {
    expect(workoutPlanSchema.safeParse({ durationMinutes: "ten" }).success).toBe(false);
    expect(
      workoutPlanSchema.safeParse({ ...validWorkoutPlanFixture, modelExplanation: "ignore schema" })
        .success,
    ).toBe(false);
  });

  it("enforces numeric boundaries and finite values", () => {
    expect(workoutPlanSchema.safeParse({ ...validWorkoutPlanFixture, durationMinutes: 4 }).success).toBe(
      false,
    );
    expect(workoutPlanSchema.safeParse({ ...validWorkoutPlanFixture, durationMinutes: 60 }).success).toBe(
      true,
    );
    expect(workoutPlanSchema.safeParse({ ...validWorkoutPlanFixture, durationMinutes: Infinity }).success).toBe(
      false,
    );
  });

  it("rejects unknown movement identifiers", () => {
    const exercises = [{ ...validWorkoutPlanFixture.exercises[0], movement: "burpee" }];
    expect(workoutPlanSchema.safeParse({ ...validWorkoutPlanFixture, exercises }).success).toBe(false);
  });

  it("rejects duplicate exercise ids", () => {
    const exercises = validWorkoutPlanFixture.exercises.map((exercise) => ({
      ...exercise,
      id: "duplicate",
    }));
    expect(workoutPlanSchema.safeParse({ ...validWorkoutPlanFixture, exercises }).success).toBe(false);
  });

  it("returns a deterministic fallback and actionable error", () => {
    const result = resolveWorkoutPlan({ invalid: true });
    expect(result.success).toBe(false);
    expect(result.source).toBe("fallback");
    expect(result.data.schemaVersion).toBe(1);
    if (!result.success) {
      expect(result.error.retryable).toBe(true);
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

describe("adventureBlueprintSchema", () => {
  it("accepts a valid blueprint with contiguous ordering", () => {
    expect(adventureBlueprintSchema.parse(validAdventureBlueprintFixture)).toEqual(
      validAdventureBlueprintFixture,
    );
  });

  it("rejects duplicate ids and impossible ordering", () => {
    const segments = validAdventureBlueprintFixture.segments.map((segment, index) => ({
      ...segment,
      id: "duplicate",
      order: index + 2,
    }));
    expect(
      adventureBlueprintSchema.safeParse({ ...validAdventureBlueprintFixture, segments }).success,
    ).toBe(false);
  });

  it("rejects missing exercise references", () => {
    const segments = validAdventureBlueprintFixture.segments.map((segment, index) =>
      index === 0 ? { ...segment, exerciseId: "missing" } : segment,
    );
    const result = validateAdventureForWorkout(
      { ...validAdventureBlueprintFixture, segments },
      validWorkoutPlanFixture,
    );
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues.some((issue) => issue.path.endsWith("exerciseId"))).toBe(true);
  });

  it("rejects target and movement-template mismatches", () => {
    const segments = validAdventureBlueprintFixture.segments.map((segment, index) =>
      index === 0 ? { ...segment, target: 99, challengeTemplate: "broken-platforms" as const } : segment,
    );
    const result = validateAdventureForWorkout(
      { ...validAdventureBlueprintFixture, segments },
      validWorkoutPlanFixture,
    );
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues.length).toBeGreaterThanOrEqual(2);
  });

  it("returns a workout-compatible fallback", () => {
    const result = resolveAdventureBlueprint({ invalid: true }, validWorkoutPlanFixture);
    expect(result.success).toBe(false);
    expect(result.data.workoutPlanId).toBe(validWorkoutPlanFixture.id);
    expect(result.data.segments).toHaveLength(validWorkoutPlanFixture.exercises.length);
    expect(validateAdventureForWorkout(result.data, validWorkoutPlanFixture).success).toBe(true);
  });
});

describe("remaining domain contracts", () => {
  it("validates movement confidence and timestamps", () => {
    expect(
      movementEventSchema.safeParse({
        movement: "jump",
        phase: "completed",
        confidence: 1,
        occurredAtMs: 1_000,
      }).success,
    ).toBe(true);
    expect(
      movementEventSchema.safeParse({
        movement: "jump",
        phase: "completed",
        confidence: 1.1,
        occurredAtMs: -1,
      }).success,
    ).toBe(false);
  });

  it("rejects internally impossible session metrics", () => {
    expect(
      sessionMetricsSchema.safeParse({
        plannedTargets: 10,
        completedTargets: 11,
        completionRate: 100,
        accuracy: 95,
        bestExercise: "jump",
        focusExercise: "squat",
        xpEarned: 100,
      }).success,
    ).toBe(false);
  });

  it("constrains recommendations and coach language payloads", () => {
    expect(
      recommendationSchema.safeParse({
        difficulty: "maintain",
        focusExercise: "squat",
        reasonCode: "FOCUS_MOVEMENT",
      }).success,
    ).toBe(true);
    expect(
      coachSummarySchema.safeParse({
        headline: "Great mission",
        summary: "You completed the verified targets.",
        recommendation: "Keep the same difficulty.",
        calculatedAccuracy: 99,
      }).success,
    ).toBe(false);
  });
});
